"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { getCurrentLocation, FALLBACK_LOCATION } from "@/utils/geolocation";

const containerStyle = {
  width: "100%",
  maxWidth: "900px",
  height: "350px",
  borderRadius: "30px",
};

// Use the fallback location from utils
const fallbackCenter = FALLBACK_LOCATION;

// Stable libraries array to avoid reload warning
const LIBRARIES: ("marker")[] = ["marker"];

// Dark map style
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

// Light map style
const lightMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];

export default function UserLocationMap() {
  const { theme } = useTheme();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Get current map style based on theme
  const currentMapStyle = theme === "dark" ? darkMapStyle : lightMapStyle;

  // Get user location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation({ lat: location.lat, lng: location.lng });
        
        if (location.error) {
          console.warn('Geolocation warning:', location.error);
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setUserLocation(fallbackCenter);
      }
    };

    fetchUserLocation();
  }, []);

  // Add regular Marker once map + location ready
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (!markerRef.current) {
      // Create regular marker (works with all browsers)
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: userLocation,
        title: "You are here",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        },
      });

      // Click event for popover
      markerRef.current.addListener("click", () => {
        setShowPopover((prev) => !prev);
      });
    } else {
      // Update marker position
      markerRef.current.setPosition(userLocation);
    }

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [userLocation, isLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-[30px]">
        <div className="text-center space-y-2">
          <p className="text-red-600 dark:text-red-400">Error loading map</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-[30px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || fallbackCenter}
      zoom={userLocation ? 14 : 12}
      onLoad={(map) => {(mapRef.current = map)}}
      options={{
        styles: currentMapStyle,
        disableDefaultUI: true, // hides all controls
        gestureHandling: "greedy",
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapTypeId: "roadmap", // Force roadmap type for better compatibility
        backgroundColor: theme === "dark" ? "#212121" : "#f5f5f5", // Dynamic background color
      }}
    >
      {/* Custom popover */}
      {showPopover && userLocation && (
        <div
          style={{
            position: "absolute",
            transform: "translate(-50%, -100%)",
            left: "50%",
            top: "50%",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          You are here 🎉
        </div>
      )}
    </GoogleMap>
  );
}
