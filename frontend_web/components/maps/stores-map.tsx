"use client";

import { GoogleMap, MarkerF, MarkerClustererF, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import SpotCard from "../spot-card";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default location if user denies permission
const fallbackCenter = { lat: 6.5244, lng: 3.3792 };

// Stable libraries array to avoid reload warning
const LIBRARIES: ("marker" | "places")[] = ["marker", "places"];

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

type CombinedPlace = {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address?: string;
  rating?: number;
  price_level?: number;
  verified?: boolean;
  source?: string;
  imageUrl?: string;
  photos?: any[];
  opening_hours?: any;
  geometry?: any;
  place_id?: string;
  opensAt?: string;
  closesAt?: string;
  phone?: string;
  description?: string;
};

export default function StoresMap() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isPlaceSaved } = useSavedPlaces();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: LIBRARIES,
  });

  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [selectedStore, setSelectedStore] = useState<CombinedPlace | null>(null);
  const [stores, setStores] = useState<CombinedPlace[]>([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const currentMapStyle = theme === "dark" ? darkMapStyle : lightMapStyle;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation(fallbackCenter)
      );
    } else {
      setUserLocation(fallbackCenter);
    }
  }, []);

  // Fetch combined places from backend Amala Finder when map and user location are ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !userLocation) return;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchPlaces = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/ai/amala_finder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            location: { lat: userLocation.lat, long: userLocation.lng },
            query: "amala",
          }),
        });
        const json = await resp.json();
        const places = json?.data?.places || json?.places || [];
        const mapped: CombinedPlace[] = (places as any[])
          .map((p) => {
            const placeId: string = p.place_id || p.id;
            const name: string = p.name;
            const addr: string | undefined = p.formatted_address || p.vicinity || p.address;
            const geo = p.geometry?.location;
            const lat = geo?.lat;
            const lng = geo?.lng ?? geo?.long;
            if (!placeId || !name || typeof lat !== "number" || typeof lng !== "number") {
              return null;
            }
            return {
              id: placeId,
              name,
              address: addr,
              rating: typeof p.rating === "number" ? p.rating : undefined,
              price_level: typeof p.price_level === "number" ? p.price_level : undefined,
              verified: (p.source === "verified") || p.verifiedBy === "amala-joint" || (typeof placeId === "string" && placeId.startsWith("amala_")),
              source: p.source,
              position: { lat, lng },
              photos: p.photos,
              opening_hours: p.opening_hours,
              imageUrl: p.imageUrl,
              opensAt: p.opensAt,
              closesAt: p.closesAt,
              phone: p.phone,
              description: p.description,
            } as CombinedPlace;
          })
          .filter(Boolean) as CombinedPlace[];
        setStores(mapped);
      } catch (e) {
        setStores([]);
      }
    };

    fetchPlaces();
  }, [isLoaded, userLocation]);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: userLocation,
        title: "You are here",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        },
      });

      markerRef.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        e.stop?.(); // Prevent map click from firing
        setShowPopover((prev) => !prev);
      });
    } else {
      markerRef.current.setPosition(userLocation);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [userLocation, isLoaded]);

  if (loadError) {
    return <p>Error loading map: {loadError.message}</p>;
  }

  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || fallbackCenter}
      zoom={userLocation ? 14 : 12}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onClick={() => {
        setSelectedStore(null);
        setShowPopover(false);
      }}
      options={{
        styles: currentMapStyle,
        // disableDefaultUI: true  ,
        gestureHandling: "greedy",
        // zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapTypeId: "roadmap",
        backgroundColor: theme === "dark" ? "#212121" : "#f5f5f5",
      }}
    >
      {/* Clustered store markers */}
      {stores.length > 0 && (
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {stores.map((s) => (
                <MarkerF
                  key={s.id}
                  position={s.position}
                  clusterer={clusterer}
                  title={s.name}
                  icon={{
                    url: "/images/amala_shop.png", 
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32), // Center bottom of image
                  }}
                  // shape={google.maps.}
                  onClick={(e) => {
                    e.stop?.(); // Prevent map click from firing
                    setSelectedStore(s);
                  }}
                />
              ))}
            </>
          )}
        </MarkerClustererF>
      )}
      {/* Store InfoWindow */}
      {selectedStore && (
        <InfoWindowF
          position={selectedStore.position}
          onCloseClick={() => setSelectedStore(null)}
          
          options={{
            pixelOffset: new google.maps.Size(0, -32) // Offset by marker height
          }}
        >
          <SpotCard
            key={selectedStore.id}
            name={selectedStore.name}
            location={selectedStore.address || "Unknown address"}
            opensAt={selectedStore.opensAt || (selectedStore.opening_hours?.open_now ? 'Open' : 'Closed')}
            closesAt={selectedStore.closesAt || (selectedStore.opening_hours?.open_now ? 'Now' : 'Now')}
            distanceKm={Math.round(Math.random() * 10 + 1)}
            etaMinutes={Math.round(Math.random() * 30 + 5)}
            rating={selectedStore.rating ?? 4.0}
            verified={!!selectedStore.verified}
            imageUrl={
              selectedStore.imageUrl
                || (selectedStore.photos?.[0]?.photo_reference
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${selectedStore.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
                  : '/images/amala-billboard.png')
            }
            isFavorite={isPlaceSaved(selectedStore.id)}
            onDirections={() => {
              const { lat, lng } = selectedStore.position;
              const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
              window.open(url, '_blank');
            }}
            onExplore={() => {
              router.push(`/home/${selectedStore.id}`);
            }}
            onToggleFavorite={() => {}}
          />
        </InfoWindowF>
      )}
      
      {showPopover && userLocation && (
        <InfoWindowF
        position={userLocation}
        onCloseClick={() => setShowPopover(false)}
      >
        <div
          style={{            
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          You are here 🎉
        </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}


