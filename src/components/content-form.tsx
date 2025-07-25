"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    if (!message.trim()) {
      setError("Please write a message to share your moment");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would normally upload the file and submit the form data
      // For now, just show success
      setSuccess("Your moment has been shared successfully! 🎉");

      // Reset form after success
      setTimeout(() => {
        setMessage("");
        setFile(null);
        setFilePreview(null);
        setSpotifyUrl("");
        setSuccess("");
      }, 2000);
    } catch {
      setError("Failed to share your moment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background rounded-xl shadow-xl border border-border p-6 w-full max-w-2xl mx-auto backdrop-blur-sm">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-3">
          Share Your Moment
        </h1>

        {/* Location Banner */}
        <div className="bg-muted/50 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {location.loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Getting your location...</span>
            </div>
          ) : location.error ? (
            <span className="text-destructive">{location.error}</span>
          ) : (
            <span>
              {location.city && location.country
                ? `${location.city}, ${location.country}`
                : "Location unavailable"}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-border space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something meaningful about this moment..."
                className="resize-none min-h-[120px] text-base leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  Express yourself authentically
                </span>
                <span
                  className={cn(
                    "font-mono",
                    message.length > 450
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {message.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="pt-6 space-y-4">
            <div>
              <Label className="text-base font-medium text-foreground">
                Add Media
                <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Optional
                </span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a photo or video to capture this moment
              </p>
            </div>

            {!file ? (
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer group">
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Upload your photo or video
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      Click to browse or drag and drop your files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: PNG, JPG, MP4 • Maximum size: 10MB
                    </p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-muted border border-border group">
                {file.type.startsWith("image/") ? (
                  <div className="relative">
                    <Image
                      src={filePreview!}
                      alt="Media preview"
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={filePreview!}
                    controls
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-muted">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          File ready to share
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isSubmitting}
                  className="absolute top-3 right-3 bg-background/90 hover:bg-background text-foreground rounded-full p-2 transition-all duration-200 shadow-lg border border-border opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Spotify Section */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-green-600" />
                <Label
                  htmlFor="spotify"
                  className="text-base font-medium text-foreground"
                >
                  Add Music
                </Label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Optional
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                id="spotify"
                type="url"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="Paste Spotify track URL..."
                className="h-12 text-base focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                Share the soundtrack to your moment
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          <div className="pt-4 space-y-3">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm font-medium text-destructive flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">{success}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 text-base font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sharing your moment...</span>
                  </div>
                ) : (
                  "Share Moment"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
