"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import FileDropzone from "@/components/FileDropzone";
import SummaryOutput from "@/components/SummaryOutput";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileContent = useCallback(
    (content: string, fileName: string) => {
      setInputText(content);
      setAttachedFile(fileName);
      setError(null);
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setAttachedFile(null);
    setInputText("");
  }, []);

  const handleSummarize = async () => {
    const text = inputText.trim();
    if (!text) {
      setError("Please enter some text or upload a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data.summary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      if (message.includes("fetch") || message.includes("Failed")) {
        setError(
          "Unable to reach the API server. Make sure the FastAPI backend is running on port 8080."
        );
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setAttachedFile(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        <div className="container">
          {/* Hero */}
          <section className="hero">
            <h1>
              Summarize anything with{" "}
              <span className="gradient-text">AI precision</span>
            </h1>
            <p>
              Paste your text or upload a file — Concisio condenses it into a
              crisp, meaningful summary in seconds.
            </p>
          </section>

          {/* Summarizer Grid */}
          <div className="summarizer-grid">
            {/* Input Panel */}
            <div className="panel glass-card">
              <div className="panel-header">
                <div className="panel-title">
                  <span className="icon">📝</span>
                  Input Text
                </div>
                <span className="char-count">
                  {inputText.length.toLocaleString()} chars
                </span>
              </div>

              <textarea
                className="text-input"
                placeholder="Paste your text here… articles, dialogues, notes — anything you want summarized."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError(null);
                }}
                rows={10}
                id="input-textarea"
              />

              <div className="divider-with-text">
                <span>or upload a file</span>
              </div>

              <FileDropzone
                onFileContent={handleFileContent}
                attachedFile={attachedFile}
                onRemoveFile={handleRemoveFile}
              />

              {error && (
                <div className="error-banner">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  className="btn-primary"
                  onClick={handleSummarize}
                  disabled={isLoading || !inputText.trim()}
                  id="summarize-button"
                  style={{ flex: 1 }}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner"
                        style={{ width: 18, height: 18 }}
                      />
                      Processing…
                    </>
                  ) : (
                    <>✂️ Summarize</>
                  )}
                </button>
                {inputText && (
                  <button
                    className="btn-secondary"
                    onClick={handleClear}
                    id="clear-button"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Output Panel */}
            <SummaryOutput
              summary={summary}
              isLoading={isLoading}
              error={null}
              originalLength={inputText.length}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
