"use client";

import Image from "next/image";
import type { EvidenceSource } from "./evidence";
import { evidenceHighlights } from "./evidence-highlights";

export function EvidenceReader({ source }: { source: EvidenceSource }) {
  const highlight = evidenceHighlights[source.id];

  return (
    <article id="source-detail" aria-live="polite">
      <div className="evidence-feature">
        <div className="document-preview">
          <div className="document-thumb">
            <Image src={source.preview} alt={source.previewAlt} width={154} height={207} unoptimized />
          </div>
        </div>
        <div className="evidence-reading">
          <div className="source-meta"><span className="source-tag">{highlight?.label ?? source.status ?? source.category}</span><span>{highlight?.scope ?? source.scope}</span></div>
          {highlight ? (
            <>
              <h3 className={source.id === "company" ? "evidence-question" : "evidence-metric"}>{highlight.value}</h3>
              <p className="metric-description">{highlight.description}</p>
              <ul className="metric-bullets">{highlight.bullets.map(bullet => (
                <li key={bullet.label}><strong>{bullet.label}:</strong> {bullet.text}</li>
              ))}</ul>
            </>
          ) : (
            <>
              <h3 className="evidence-question">{source.question}</h3>
              <p className="source-finding">{source.finding}</p>
            </>
          )}
          <div className="source-citation"><strong>{source.publisher}</strong><span>{source.date}</span></div>
        </div>
      </div>
      <div className="document-footer">
        <a className="original-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.id === "government" ? "Read the report" : source.id === "company" ? "Read the statement" : "Read original source"} ↗</a>
      </div>
    </article>
  );
}

export function OtherEvidenceSources({ sources }: { sources: EvidenceSource[] }) {
  return (
    <div className="other-source-grid">
      {sources.map(source => (
        <a key={source.id} className="other-source-card" href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`Read original: ${source.title}`}>
          <div className="other-source-preview">
            <Image src={source.preview} alt={source.previewAlt} width={154} height={207} unoptimized />
          </div>
          <div className="other-source-copy">
            <p className="other-source-publisher">{source.publisher}</p>
            <h3>{source.id === "regulator" ? "Large-user electricity rates" : "Data centers and power costs"}</h3>
            <span className="other-source-action">Read original <span aria-hidden="true">↗</span></span>
          </div>
        </a>
      ))}
    </div>
  );
}
