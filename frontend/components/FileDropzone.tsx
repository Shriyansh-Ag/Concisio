"use client";

import { useRef, useState, useCallback } from "react";

interface FileDropzoneProps {
  onFileContent: (content: string, fileName: string) => void;
  attachedFile: string | null;
  onRemoveFile: () => void;
}

export default function FileDropzone({
  onFileContent,
  attachedFile,
  onRemoveFile,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileContent(text, file.name);
      };
      reader.readAsText(file);
    },
    [onFileContent]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (attachedFile) {
    return (
      <div className="file-attached">
        <span>📄</span>
        <span>{attachedFile}</span>
        <button
          className="file-remove"
          onClick={onRemoveFile}
          aria-label="Remove file"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`dropzone ${isDragOver ? "drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload a text file"
      >
        <div className="dropzone-icon">📂</div>
        <p className="dropzone-text">
          Drag & drop a file or <strong>click to browse</strong>
        </p>
        <p className="dropzone-hint">Supports .txt files</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </>
  );
}
