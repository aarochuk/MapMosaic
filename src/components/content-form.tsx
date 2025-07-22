"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Loader2 } from "lucide-react";

interface ContentFormProps {
  onCancel?: () => void;
}

export function ContentForm({ onCancel }: ContentFormProps) {
  const [type, setType] = useState("text");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGeo = () => {
    setLoadingGeo(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(6));
          setLng(pos.coords.longitude.toFixed(6));
          setLoadingGeo(false);
        },
        (err) => {
          setError("Failed to get location");
          setLoadingGeo(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoadingGeo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content) {
      setError("Content is required");
      return;
    }
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content,
          description,
          lat: lat ? parseFloat(lat) : undefined,
          lng: lng ? parseFloat(lng) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess("Submitted!");
      setContent("");
      setDescription("");
      setLat("");
      setLng("");
    } catch (err) {
      setError("Failed to submit");
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Add Content to Globe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image URL</SelectItem>
                <SelectItem value="song">Song Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            {type === "text" ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text message..."
                className="min-h-[80px]"
              />
            ) : (
              <Input
                id="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === "image" ? "Enter image URL..." : "Enter song link..."
                }
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Name (optional)</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description or name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                step="any"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGeo}
            disabled={loadingGeo}
            className="w-full"
          >
            {loadingGeo ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {loadingGeo ? "Getting location..." : "Use My Location"}
          </Button>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1">
              Submit Content
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
