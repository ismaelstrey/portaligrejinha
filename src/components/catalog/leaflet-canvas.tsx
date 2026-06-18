"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

import type { Provider } from "@/types/catalog";

type LeafletCanvasProps = {
  providers: Provider[];
  activeId?: string;
  onSelect: (id: string) => void;
};

function MapViewportController({ provider }: { provider?: Provider }) {
  const map = useMap();

  useEffect(() => {
    if (!provider) {
      return;
    }

    map.flyTo([provider.latitude, provider.longitude], Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.8
    });
  }, [map, provider]);

  return null;
}

export function LeafletCanvas({ providers, activeId, onSelect }: LeafletCanvasProps) {
  const activeProvider = providers.find((provider) => provider.id === activeId) ?? providers[0];
  const center: [number, number] = activeProvider
    ? [activeProvider.latitude, activeProvider.longitude]
    : [-29.5744, -50.7905];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full min-h-[540px] w-full rounded-[28px]">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewportController provider={activeProvider} />

      {providers.map((provider) => {
        const isActive = provider.id === activeId;

        return (
          <CircleMarker
            key={provider.id}
            center={[provider.latitude, provider.longitude]}
            radius={isActive ? 12 : 9}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: isActive ? "#f97316" : "#1d4ed8",
              fillOpacity: 1
            }}
            eventHandlers={{
              click: () => onSelect(provider.id)
            }}
          >
            <Popup>
              <div className="space-y-1">
                <strong>{provider.name}</strong>
                <p>{provider.neighborhood}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
