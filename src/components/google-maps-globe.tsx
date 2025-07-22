"use client";

import { useEffect, useRef } from "react";

interface GoogleMapsGlobeProps {
  apiKey: string;
}

export function GoogleMapsGlobe({ apiKey }: GoogleMapsGlobeProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !apiKey) return;

    // Load Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&v=3.exp`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (mapRef.current && window.google) {
        // Initialize 3D map
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeId: "satellite",
          tilt: 45,
          heading: 0,
          disableDefaultUI: true,
          backgroundColor: "transparent",
          styles: [
            {
              featureType: "all",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Auto-rotate the map
        let heading = 0;
        const rotateMap = () => {
          heading += 0.1;
          map.setHeading(heading);
          requestAnimationFrame(rotateMap);
        };
        rotateMap();
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-full overflow-hidden"
      style={{
        filter: "contrast(1.1) saturate(1.2)",
      }}
    />
  );
}
