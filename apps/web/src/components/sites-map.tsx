"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Site } from "@/lib/types";

// Free vector tiles, no API key. Swap the style URL for Mapbox later if needed.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export function SitesMap({ sites, height = 420 }: { sites: Site[]; height?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!container.current || sites.length === 0) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: container.current,
        style: STYLE_URL,
        center: [sites[0].lng, sites[0].lat],
        zoom: 4,
        attributionControl: { compact: true },
      });
    } catch {
      // No WebGL (old browsers, some headless environments): show the fallback instead of crashing the page.
      queueMicrotask(() => setFailed(true));
      return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const bounds = new maplibregl.LngLatBounds();
    for (const site of sites) {
      bounds.extend([site.lng, site.lat]);
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `<a href="/sites/${site.id}" style="font-weight:600">${escapeHtml(site.name)}</a>` +
          `<div style="font-size:12px;margin-top:2px">Score ${site.score} · ~${site.est_available_mw} MW proxy</div>`,
      );
      new maplibregl.Marker({ color: site.score >= 75 ? "#059669" : site.score >= 60 ? "#2563eb" : "#71717a" })
        .setLngLat([site.lng, site.lat])
        .setPopup(popup)
        .addTo(map);
    }
    map.fitBounds(bounds, { padding: 60, maxZoom: 10, duration: 0 });

    return () => map.remove();
  }, [sites]);

  if (failed) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-[28px] bg-black/[0.03] text-sm text-muted-foreground ring-1 ring-black/5"
        style={{ height }}
      >
        The map needs WebGL, which this browser doesn&rsquo;t support. Parcels are listed below.
      </div>
    );
  }

  return <div ref={container} className="w-full overflow-hidden rounded-[28px] ring-1 ring-black/5" style={{ height }} />;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
