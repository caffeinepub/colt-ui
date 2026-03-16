import { AlertTriangle, Globe, RefreshCw, Search, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import GlassCard from "../GlassCard";

const ProxyTab: React.FC = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [proxiedUrl, setProxiedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const normalizeUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const buildProxyUrl = (rawUrl: string, fallback = false): string => {
    const normalized = normalizeUrl(rawUrl);
    if (fallback) {
      return `https://api.allorigins.win/raw?url=${encodeURIComponent(normalized)}`;
    }
    return `https://corsproxy.io/?url=${encodeURIComponent(normalized)}`;
  };

  const handleGo = (fallback = false) => {
    if (!inputUrl.trim()) return;
    setError("");
    setIsLoading(true);
    setUseFallback(fallback);
    setProxiedUrl(buildProxyUrl(inputUrl.trim(), fallback));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGo();
  };

  const handleIframeLoad = () => setIsLoading(false);
  const handleIframeError = () => {
    setIsLoading(false);
    setError("Could not load page. Try the fallback proxy below.");
  };

  const handleClear = () => {
    setProxiedUrl("");
    setInputUrl("");
    setError("");
    setIsLoading(false);
    setUseFallback(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const quickLinks = [
    { label: "Wikipedia", url: "https://en.wikipedia.org" },
    { label: "GitHub", url: "https://github.com" },
    { label: "MDN Docs", url: "https://developer.mozilla.org" },
    { label: "HackerNews", url: "https://news.ycombinator.com" },
  ];

  const isActive = !!proxiedUrl;

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      {/* ── Active state: compact URL bar ── */}
      {isActive && (
        <div className="flex-shrink-0 mb-3">
          <GlassCard className="p-3">
            <div className="flex items-center gap-3">
              <Globe className="text-neon-cyan shrink-0" size={16} />
              <input
                ref={inputRef}
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter URL to bypass..."
                className="flex-1 bg-transparent border-0 outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/50"
              />
              {isLoading && (
                <RefreshCw
                  size={14}
                  className="text-neon-cyan animate-spin shrink-0"
                />
              )}
              <button
                type="button"
                onClick={() => handleGo(useFallback)}
                disabled={!inputUrl.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded font-display text-xs tracking-wider transition-all duration-200 disabled:opacity-40 shrink-0"
                style={{
                  background: "oklch(0.78 0.22 195 / 0.15)",
                  border: "1px solid oklch(0.78 0.22 195 / 0.5)",
                  color: "oklch(0.78 0.22 195)",
                  boxShadow: "0 0 8px oklch(0.78 0.22 195 / 0.2)",
                }}
              >
                GO
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded text-muted-foreground hover:text-neon-cyan transition-colors shrink-0"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-body">
                Browsing via {useFallback ? "allorigins" : "corsproxy"}:
              </span>
              <span className="text-xs text-neon-cyan font-body truncate max-w-xs">
                {inputUrl}
              </span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Landing state ── */}
      {!isActive && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <div className="mb-8 text-center">
            <p
              className="font-display text-4xl tracking-widest font-bold mb-2"
              style={{
                color: "oklch(0.78 0.22 195)",
                textShadow:
                  "0 0 16px oklch(0.78 0.22 195 / 0.7), 0 0 32px oklch(0.78 0.22 195 / 0.3)",
              }}
            >
              PROXY BROWSER
            </p>
            <p className="text-sm text-muted-foreground font-body tracking-widest">
              Browse the web through Colt UI — bypasses most blocks
            </p>
          </div>

          {/* Search bar with rainbow neon border */}
          <div className="w-full max-w-xl">
            <div className="rainbow-border rounded-full p-0.5">
              <div
                className="flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-300"
                style={{
                  background: "oklch(0.18 0.02 240 / 0.95)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Search
                  size={18}
                  className="shrink-0 transition-colors duration-200"
                  style={{
                    color: isFocused
                      ? "oklch(0.78 0.22 195)"
                      : "oklch(0.6 0.05 240)",
                  }}
                />
                <input
                  ref={inputRef}
                  data-ocid="proxy.search_input"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter any URL to bypass blocks... (e.g. wikipedia.org)"
                  className="flex-1 bg-transparent border-0 outline-none text-foreground font-body text-base placeholder:text-muted-foreground/50"
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl("")}
                    className="p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="proxy.primary_button"
                  onClick={() => handleGo(false)}
                  disabled={!inputUrl.trim()}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-xs tracking-widest transition-all duration-200 disabled:opacity-40 shrink-0"
                  style={{
                    background: "oklch(0.78 0.22 195 / 0.18)",
                    border: "1px solid oklch(0.78 0.22 195 / 0.55)",
                    color: "oklch(0.78 0.22 195)",
                    boxShadow: "0 0 10px oklch(0.78 0.22 195 / 0.2)",
                  }}
                >
                  GO
                </button>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground font-body tracking-widest">
              QUICK LINKS
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setInputUrl(link.url);
                    setError("");
                    setIsLoading(true);
                    setUseFallback(false);
                    setProxiedUrl(buildProxyUrl(link.url, false));
                  }}
                  className="px-4 py-1.5 glass rounded-full border border-border/50 text-xs font-body text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/50 font-body text-center max-w-xs">
            Powered by corsproxy — bypasses most site blocks
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex-shrink-0 mb-3">
          <GlassCard className="p-3 border-destructive/30">
            <div className="flex items-center gap-3 text-sm font-body flex-wrap">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle size={14} />
                {error}
              </div>
              {!useFallback && inputUrl && (
                <button
                  type="button"
                  onClick={() => handleGo(true)}
                  className="ml-auto px-3 py-1 rounded text-xs border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                >
                  Try Fallback Proxy
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Iframe ── */}
      {isActive && !error && (
        <div
          className="flex-1 rounded-lg overflow-hidden"
          style={{
            border: "1px solid oklch(0.78 0.22 195 / 0.3)",
            boxShadow: "0 0 15px oklch(0.78 0.22 195 / 0.1)",
            minHeight: "300px",
          }}
        >
          <iframe
            ref={iframeRef}
            src={proxiedUrl}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            style={{ minHeight: "300px", height: "100%" }}
            title="Proxy Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      )}
    </div>
  );
};

export default ProxyTab;
