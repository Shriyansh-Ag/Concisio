"use client";

import { useState } from "react";

interface SummaryOutputProps {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  originalLength: number;
}

export default function SummaryOutput({
  summary,
  isLoading,
  error,
  originalLength,
}: SummaryOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = summary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reductionPercent =
    summary && originalLength > 0
      ? Math.round((1 - summary.length / originalLength) * 100)
      : 0;

  return (
    <div className="panel glass-card">
      <div className="panel-header">
        <div className="panel-title">
          <span className="icon">📋</span>
          Summary Output
        </div>
        {summary && (
          <span className="char-count">{summary.length} characters</span>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Generating summary…</p>
        </div>
      )}

      {!isLoading && !summary && !error && (
        <div className="output-placeholder">
          <span className="icon">✨</span>
          <p>Your AI-generated summary will appear here</p>
        </div>
      )}

      {!isLoading && summary && (
        <div className="summary-result">
          <div className="summary-text">{summary}</div>
          <div className="summary-actions">
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <span className="summary-meta">
              {reductionPercent > 0 && `${reductionPercent}% shorter`}
            </span>
          </div>
        </div>
      )}

      {copied && <div className="toast">✓ Copied to clipboard</div>}
    </div>
  );
}
