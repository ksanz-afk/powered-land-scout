"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Site } from "@/lib/types";

// Free vector tiles, no API key. Swap the style URL for Mapbox later if needed.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export function SitesMap({ sites, height = 420 }: { sites: Site[]; height?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || sites.length === 0) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: [sites[0].lng, sites[0].lat],
      zoom: 4,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const bounds = new maplibregl.LngLatBounds();
    for (const site of sites) {
      bounds.extend([site.lng, site.lat]);
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `<a href="/sites/${site.id}" style="font-weight:600">${escapeHtml(site.name)}</a>` +
          `<div style="font-size:12px;margin-top:2px">Score ${site.score} · ${site.est_available_mw} MW est.</div>`,
      );
      new maplibregl.Marker({ color: site.score >= 75 ? "#059669" : site.score >= 60 ? "#2563eb" : "#71717a" })
        .setLngLat([site.lng, site.lat])
        .setPopup(popup)
        .addTo(map);
    }
    map.fitBounds(bounds, { padding: 60, maxZoom: 10, duration: 0 });

    return () => map.remove();
  }, [sites]);

  return <div ref={container} className="w-full overflow-hidden rounded-lg border" style={{ height }} />;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
