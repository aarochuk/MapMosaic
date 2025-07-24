"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Loader2, Upload, X, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentFormProps {
  onCancel?: () => void;
}

export function ContentForm({ onCancel }: ContentFormProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [location, setLocation] = useState<{
    city?: string;
    country?: string;
    loading: boolean;
    error?: string;
  }>({ loading: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocation({ loading: true });

    if (!navigator.geolocation) {
      setLocation({ loading: false, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding to get city and country
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );

          if (response.ok) {
            const data = await response.json();
            const result = data.results[0];
            setLocation({
              loading: false,
              city:
                result?.components?.city ||
                result?.components?.town ||
                result?.components?.village,
              country: result?.components?.country,
            });
          } else {
            setLocation({
              loading: false,
              city: "Unknown",
              country: "Location",
            });
          }
        } catch {
          setLocation({ loading: false, city: "Unknown", country: "Location" });
        }
      },
      () => {
        setLocation({ loading: false, error: "Failed to get location" });
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview for images and videos
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!message.trim()) {
      setError("Please write a message");
      return;
    }

    try {
      // Here you would normally upload the file and submit the form data
      // For now, just show success
      setSuccess("Content shared successfully!");

      // Reset form
      setMessage("");
      setFile(null);
      setFilePreview(null);
      setSpotifyUrl("");
    } catch {
      setError("Failed to share content");
    }
  };

  return (
    <Card className="w-full border-0 shadow-lg rounded-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
          Share Your Moment
        </CardTitle>

        {/* Current Location Display */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-3">
          <MapPin className="w-4 h-4" />
          {location.loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-sm font-medium leading-none">
                Getting location...
              </span>
            </span>
          ) : location.error ? (
            <span className="text-sm font-medium text-destructive">
              {location.error}
            </span>
          ) : (
            <span className="text-sm font-medium leading-none">
              {location.city && location.country
                ? `${location.city}, ${location.country}`
                : "Location unavailable"}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Textarea */}
          <div className="space-y-3">
            <Label
              htmlFor="message"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              What&apos;s happening?
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something meaningful..."
              className="min-h-[100px] resize-none rounded-xl"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Add Photo or Video{" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>

            {!file ? (
              <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:border-muted-foreground/50 transition-colors hover:bg-muted/50">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-sm font-medium leading-none">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, MP4 up to 10MB
                  </p>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-muted">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={filePreview!}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={filePreview!}
                    controls
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      {file.name}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5 transition-colors shadow-lg border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Spotify URL */}
          <div className="space-y-3">
            <Label
              htmlFor="spotify"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Music className="w-4 h-4 text-green-600" />
              Spotify Song{" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="spotify"
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="rounded-xl"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-200">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Share Moment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
