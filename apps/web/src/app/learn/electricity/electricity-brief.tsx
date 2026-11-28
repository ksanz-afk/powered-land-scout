"use client";

import { useRef, useState } from "react";
import { evidence } from "./evidence";
import { EvidenceReader, OtherEvidenceSources } from "./evidence-reader";

const sourceTabs = [
  { id: "government", label: "Virginia review" },
  { id: "company", label: "Microsoft" },
  { id: "other", label: "Other" },
];
const otherSources = ["regulator", "research"].map(id => evidence.find(item => item.id === id)!);

export function ElectricityBrief() {
  const [sourceId, setSourceId] = useState("government");
  const source = evidence.find(item => item.id === sourceId)!;
  const activeTab = sourceId === "government" || sourceId === "company" ? sourceId : "other";
  const evidenceDialog = useRef<HTMLDialogElement>(null);
  const evidenceClose = useRef<HTMLButtonElement>(null);
  const evidenceOpener = useRef<HTMLButtonElement | null>(null);

  function openEvidence(id: string, trigger: HTMLButtonElement) {
    evidenceOpener.current = trigger;
    setSourceId(id);
    evidenceDialog.current?.showModal();
    if (evidenceDialog.current) evidenceDialog.current.scrollTop = 0;
    evidenceClose.current?.focus();
  }

  return (
    <div id="ce-brief">


      <section className="hero" aria-labelledby="main-title">
        <div className="hero-copy">
          <p className="eyebrow">
            Virginia
          </p>
          <h2 id="main-title" className="brief-title">
            Could data centers <em>affect my electricity bill?</em>
          </h2>
        </div>
        <div className="hero-visual">
          <svg className="grid-scene" viewBox="0 0 560 320" role="img" aria-labelledby="scene-title scene-desc">
            <title id="scene-title">
              A data center and homes connected to a shared electricity grid
            </title>
            <desc id="scene-desc">
              Conceptual illustration of a data center, transmission infrastructure, and a neighborhood. It does not represent a specific location, measured power flows, or costs.
            </desc>
            <defs>
              <pattern id="grid-pattern" width="34" height="20" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .42 -1 .42 280 -5)">
                <path d="M34 0H0V20" fill="none" stroke="#dbe3ed" strokeWidth=".7"/>
              </pattern>
              <linearGradient id="dc-front" x2="1" y2="1">
                <stop stopColor="#edf2ff"/>
                <stop offset="1" stopColor="#b9caf2"/>
              </linearGradient>
              <linearGradient id="dc-side" x2="1" y2="1">
                <stop stopColor="#9bb4e9"/>
                <stop offset="1" stopColor="#6e90ce"/>
              </linearGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#36527c" floodOpacity=".12"/>
              </filter>
            </defs>
            <ellipse cx="285" cy="177" rx="260" ry="120" fill="#f1f5fa"/>
            <ellipse cx="285" cy="177" rx="260" ry="120" fill="url(#grid-pattern)"/>
            {/* Connections represent a shared system, not measured flows. */}
            <path d="M150 191L246 234 325 193 427 237" fill="none" stroke="#d4deee" strokeWidth="12" strokeLinejoin="round"/>
            <path d="M150 191L246 234 325 193 427 237" fill="none" stroke="#6e91c2" strokeWidth="2" strokeDasharray="5 5"/>
            <g filter="url(#shadow)">
              <path d="M45 178L134 132 233 176 145 224Z" fill="#d3ddeb"/>
              <path d="M45 178v8l100 46v-8z" fill="#c3cfe0"/>
              <path d="M145 224l88-48v8l-88 48z" fill="#b4c2d7"/>
              <path d="M65 109l78-37 70 32-78 39z" fill="#e3ecff" stroke="#9eb5de"/>
              <path d="M65 109v66l70 34v-66z" fill="url(#dc-front)" stroke="#9eb5de"/>
              <path d="M135 143l78-39v67l-78 38z" fill="url(#dc-side)" stroke="#7d9dcc"/>
              <path d="M74 122l51 25v9l-51-25zM74 141l51 25v9l-51-25zM74 160l51 25v9l-51-25z" fill="#6185c7"/>
              <path d="M147 145l12-6v47l-12 6zM167 135l12-6v47l-12 6zM187 125l12-6v47l-12 6z" fill="#3c619b"/>
              <path d="M86 104l20-10 20 9-20 11zM120 88l20-9 20 9-20 10zM119 120l20-10 20 9-20 11zM153 104l20-10 20 9-20 11z" fill="#f8faff" stroke="#94acd2"/>
              <path d="M86 104v6l20 10v-6M120 88v6l20 10v-6M119 120v6l20 10v-6M153 104v6l20 10v-6" fill="#b3c7e8"/>
            </g>
            <g stroke="#56718d" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M285 192L310 59l26 133M295 139h31M299 116h23M304 88h13M287 180h47M299 116l27 23-39 41M322 116l-27 23 39 41M303 88l19 28M317 88l-18 28M284 88h52M289 68h42M310 59V46"/>
              <path d="M284 88v10M336 88v10M289 68v9M331 68v9" stroke="#91a4b7" strokeWidth="4"/>
            </g>
            <path d="M213 117Q253 127 284 97M336 97Q389 145 434 146" fill="none" stroke="#9baec3" strokeWidth="1.3"/>
            <g filter="url(#shadow)">
              <path d="M367 212l70-35 87 41-70 36z" fill="#dbe4db"/>
              <path d="M367 212v7l87 42v-7z" fill="#c7d5ca"/>
              <path d="M454 254l70-36v7l-70 36z" fill="#b7c9be"/>
              <path d="M390 172l30 14v38l-30-14z" fill="#fffaf1" stroke="#d1c9ba"/>
              <path d="M420 186l29-15v38l-29 15z" fill="#d8d5c7" stroke="#c1bcad"/>
              <path d="M384 173l20-36 23 10 28 25-35 18z" fill="#527d70"/>
              <path d="M384 173l20-36 23 10-14 38z" fill="#719888"/>
              <path d="M398 187l9 4v10l-9-4z" fill="#c0d9e0"/>
              <path d="M429 197l10-5v12l-10 5z" fill="#9cb7b6"/>
              <path d="M448 192l25 12v31l-25-12z" fill="#fffaf1" stroke="#d1c9ba"/>
              <path d="M473 204l25-12v31l-25 12z" fill="#d8d5c7" stroke="#c1bcad"/>
              <path d="M443 192l18-28 21 9 21 20-30 15z" fill="#527d70"/>
              <path d="M443 192l18-28 21 9-13 31z" fill="#719888"/>
              <path d="M454 203l8 4v8l-8-4z" fill="#c0d9e0"/>
              <path d="M480 212l9-4v10l-9 4z" fill="#9cb7b6"/>
              <path d="M503 198v-23M375 200v-21" stroke="#779381" strokeWidth="3"/>
              <ellipse cx="503" cy="170" rx="9" ry="15" fill="#a9c2a8"/>
              <ellipse cx="375" cy="175" rx="8" ry="12" fill="#b7cbae"/>
            </g>
            <g fontFamily="Inter, -apple-system, sans-serif" fontSize="11" fill="#53647c" textAnchor="middle">
              <text x="131" y="264">
                DATA CENTER
              </text>
              <text x="308" y="218">
                SHARED GRID
              </text>
              <text x="445" y="285">
                NEIGHBORHOOD
              </text>
            </g>
            <circle cx="246" cy="234" r="7" fill="#fff" stroke="#5178b6" strokeWidth="2"/>
            <circle cx="246" cy="234" r="2.5" fill="#5178b6"/>
          </svg>
        </div>
      </section>
      <section className="practical-evidence" aria-label="Electricity concern and Microsoft commitment">
        <article className="practical-card">
          <p className="practical-label">Virginia JLARC · 2024</p>
          <h3>Households could pay more.</h3>
          <p>Virginia’s review found that adding power plants and transmission lines to serve data centers could raise household bills.</p>
          <button className="source-link" id="view-evidence" onClick={event => openEvidence("government", event.currentTarget)}>See the bill estimate</button>
        </article>
        <article className="practical-card practical-promise">
          <p className="practical-label">Microsoft · January 2026</p>
          <h3>“We’ll pay our way.”</h3>
          <p>Microsoft says it will seek rates that cover the cost of powering and connecting its data centers.</p>
          <button className="source-link" onClick={event => openEvidence("company", event.currentTarget)}>Read the promise</button>
        </article>
      </section>
      <dialog ref={evidenceDialog} id="evidence-dialog" aria-labelledby="evidence-title" onClose={() => evidenceOpener.current?.focus()}>
        <div className="reader-header" data-compact={activeTab === "other"}>
          <h2 id="evidence-title">The evidence</h2>
          <button ref={evidenceClose} className="close-button" aria-label="Close evidence" onClick={() => evidenceDialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
        </div>
        <div className="evidence-tabs" role="tablist" aria-label="Evidence sources">
          {sourceTabs.map((tab, index) => (
            <button key={tab.id} id={`evidence-tab-${tab.id}`} role="tab" type="button"
              aria-selected={activeTab === tab.id} aria-controls="evidence-panel" tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setSourceId(tab.id === "other" ? "regulator" : tab.id)}
              onKeyDown={event => {
                const target = event.key === "ArrowRight" ? (index + 1) % sourceTabs.length
                  : event.key === "ArrowLeft" ? (index + sourceTabs.length - 1) % sourceTabs.length
                  : event.key === "Home" ? 0 : event.key === "End" ? sourceTabs.length - 1 : null;
                if (target === null) return;
                event.preventDefault();
                const next = sourceTabs[target];
                setSourceId(next.id === "other" ? "regulator" : next.id);
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
              }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div id="evidence-panel" role="tabpanel" aria-labelledby={`evidence-tab-${activeTab}`}>
          {activeTab === "other" ? (
            <OtherEvidenceSources sources={otherSources} />
          ) : (
            <EvidenceReader key={source.id} source={source} />
          )}
        </div>
      </dialog>



    </div>
  );
}
