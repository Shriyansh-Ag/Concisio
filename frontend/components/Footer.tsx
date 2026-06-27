"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Built with{" "}
          <a
            href="https://huggingface.co/google/pegasus-cnn_dailymail"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google PEGASUS
          </a>{" "}
          · Fine-tuned on{" "}
          <a
            href="https://huggingface.co/datasets/samsum"
            target="_blank"
            rel="noopener noreferrer"
          >
            SAMSum
          </a>{" "}
          · Concisio © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
