"use client";

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="logo-group">
          <div className="logo-icon">✂️</div>
          <span className="logo-text gradient-text">Concisio</span>
        </div>
        <div className="header-badge">
          <span className="dot" />
          Powered by PEGASUS
        </div>
      </div>
    </header>
  );
}
