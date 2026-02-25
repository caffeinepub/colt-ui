import React, { useState, useRef } from 'react';
import GlassCard from '../GlassCard';
import { Globe, Search, AlertTriangle, RefreshCw, X } from 'lucide-react';

const ProxyTab: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [proxiedUrl, setProxiedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizeUrl = (url: string): string => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const handleGo = () => {
    if (!inputUrl.trim()) return;
    const normalized = normalizeUrl(inputUrl.trim());
    setError('');
    setIsLoading(true);
    setProxiedUrl(normalized);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGo();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Unable to load this page. The site may block embedding or require HTTPS.');
  };

  const handleClear = () => {
    setProxiedUrl('');
    setInputUrl('');
    setError('');
    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const quickLinks = [
    { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'MDN Docs', url: 'https://developer.mozilla.org' },
    { label: 'HackerNews', url: 'https://news.ycombinator.com' },
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
                placeholder="Enter URL..."
                className="flex-1 bg-transparent border-0 outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/50"
              />
              {isLoading && <RefreshCw size={14} className="text-neon-cyan animate-spin shrink-0" />}
              <button
                onClick={handleGo}
                disabled={!inputUrl.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded font-display text-xs tracking-wider transition-all duration-200 disabled:opacity-40 shrink-0"
                style={{
                  background: 'oklch(0.78 0.22 195 / 0.15)',
                  border: '1px solid oklch(0.78 0.22 195 / 0.5)',
                  color: 'oklch(0.78 0.22 195)',
                  boxShadow: '0 0 8px oklch(0.78 0.22 195 / 0.2)',
                }}
              >
                GO
              </button>
              <button
                onClick={handleClear}
                className="p-1 rounded text-muted-foreground hover:text-neon-cyan transition-colors shrink-0"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-body">Browsing:</span>
              <span className="text-xs text-neon-cyan font-body truncate">{proxiedUrl}</span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Landing state: Google-style centered layout ── */}
      {!isActive && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          {/* Logo row */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src="/assets/generated/colt-ui-logo.dim_400x100.png"
              alt="Colt UI"
              className="h-14 object-contain drop-shadow-[0_0_12px_oklch(0.78_0.22_195_/_0.6)]"
            />
            <span
              className="font-display text-3xl tracking-widest font-bold"
              style={{
                color: 'oklch(0.78 0.22 195)',
                textShadow: '0 0 16px oklch(0.78 0.22 195 / 0.7), 0 0 32px oklch(0.78 0.22 195 / 0.3)',
              }}
            >
              COLT UI
            </span>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-xl">
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-300"
              style={{
                background: 'oklch(0.18 0.02 240 / 0.85)',
                border: isFocused
                  ? '1.5px solid oklch(0.78 0.22 195 / 0.9)'
                  : '1.5px solid oklch(0.78 0.22 195 / 0.25)',
                boxShadow: isFocused
                  ? '0 0 0 3px oklch(0.78 0.22 195 / 0.12), 0 0 24px oklch(0.78 0.22 195 / 0.25)'
                  : '0 2px 16px oklch(0 0 0 / 0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Search
                size={18}
                className="shrink-0 transition-colors duration-200"
                style={{ color: isFocused ? 'oklch(0.78 0.22 195)' : 'oklch(0.6 0.05 240)' }}
              />
              <input
                ref={inputRef}
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter a URL to browse... (e.g. wikipedia.org)"
                className="flex-1 bg-transparent border-0 outline-none text-foreground font-body text-base placeholder:text-muted-foreground/50"
                autoFocus
              />
              {inputUrl && (
                <button
                  onClick={() => setInputUrl('')}
                  className="p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={handleGo}
                disabled={!inputUrl.trim()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-xs tracking-widest transition-all duration-200 disabled:opacity-40 shrink-0"
                style={{
                  background: 'oklch(0.78 0.22 195 / 0.18)',
                  border: '1px solid oklch(0.78 0.22 195 / 0.55)',
                  color: 'oklch(0.78 0.22 195)',
                  boxShadow: '0 0 10px oklch(0.78 0.22 195 / 0.2)',
                }}
              >
                GO
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs text-muted-foreground font-body tracking-widest">QUICK LINKS</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setInputUrl(link.url);
                    setProxiedUrl(link.url);
                    setError('');
                    setIsLoading(true);
                  }}
                  className="px-4 py-1.5 glass rounded-full border border-border/50 text-xs font-body text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <p className="mt-6 text-xs text-muted-foreground/50 font-body text-center max-w-xs">
            Note: some sites may block iframe embedding.
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex-shrink-0 mb-3">
          <GlassCard className="p-3 border-destructive/30">
            <div className="flex items-center gap-2 text-destructive text-sm font-body">
              <AlertTriangle size={14} />
              {error}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Iframe ── */}
      {isActive && !error && (
        <div
          className="flex-1 rounded-lg overflow-hidden"
          style={{
            border: '1px solid oklch(0.78 0.22 195 / 0.3)',
            boxShadow: '0 0 15px oklch(0.78 0.22 195 / 0.1)',
            minHeight: '300px',
          }}
        >
          <iframe
            ref={iframeRef}
            src={proxiedUrl}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            style={{ minHeight: '300px', height: '100%' }}
            title="Proxy Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      )}
    </div>
  );
};

export default ProxyTab;
