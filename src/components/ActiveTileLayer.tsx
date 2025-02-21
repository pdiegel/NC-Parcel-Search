import React from "react";
import { TileLayer } from "react-leaflet";

// Define the available tile layers.

export const tileLayers = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { maxZoom: 19 },
  },
  satellite: {
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    options: { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"] },
  },
  hybrid: {
    url: "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    options: { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"] },
  },

  terrain: {
    url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    options: { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"] },
  },
};

export const ActiveTileLayer = ({ tileLayer }: { tileLayer: string }) => {
  // Choose the config based on the prop.
  const layerConfig = tileLayers[tileLayer];

  return (
    <TileLayer
      key={tileLayer} // forces remounting when tileLayer changes
      url={layerConfig.url}
      {...layerConfig.options}
    />
  );
};
