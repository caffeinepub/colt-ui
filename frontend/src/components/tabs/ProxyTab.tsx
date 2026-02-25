import React, { useState, useRef } from 'react';
import GlassCard from '../GlassCard';
import { Globe, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

const ProxyTab: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [proxiedUrl, setProxiedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const quickLinks = [
    { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'MDN Docs', url: 'https://developer.mozilla.org' },
    { label: 'HackerNews', url: 'https://news.ycombinator.com' },
  ];

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in-up">
      {/* URL Bar */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <Globe className="text-neon-cyan shrink-0" size={18} />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter URL to browse... (e.g. wikipedia.org)"
              className="flex-1 bg-transparent border-0 outline-none text-foreground font-body text-sm placeholder:text-muted-foreground/50"
            />
          </div>
          <button
            onClick={handleGo}
            disabled={!inputUrl.trim()}
            className="flex items-center gap-2 px-4 py-1.5 rounded font-display text-xs tracking-wider transition-all duration-200 disabled:opacity-40"
            style={{
              background: 'oklch(0.78 0.22 195 / 0.15)',
              border: '1px solid oklch(0.78 0.22 195 / 0.5)',
              color: 'oklch(0.78 0.22 195)',
              boxShadow: '0 0 8px oklch(0.78 0.22 195 / 0.2)',
            }}
          >
            GO <ArrowRight size={12} />
          </button>
        </div>

        {proxiedUrl && (
          <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-body">Browsing:</span>
            <span className="text-xs text-neon-cyan font-body truncate">{proxiedUrl}</span>
            {isLoading && <RefreshCw size={12} className="text-neon-cyan animate-spin ml-auto" />}
          </div>
        )}
      </GlassCard>

      {/* Quick Links */}
      {!proxiedUrl && (
        <div>
          <p className="text-xs text-muted-foreground font-body tracking-wider mb-3">QUICK LINKS</p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { setInputUrl(link.url); setProxiedUrl(link.url); setError(''); setIsLoading(true); }}
                className="px-3 py-1.5 glass rounded border border-border/50 text-xs font-body text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <GlassCard className="p-3 border-destructive/30">
          <div className="flex items-center gap-2 text-destructive text-sm font-body">
            <AlertTriangle size={14} />
            {error}
          </div>
        </GlassCard>
      )}

      {/* Iframe */}
      {proxiedUrl && !error && (
        <div
          className="flex-1 rounded-lg overflow-hidden"
          style={{
            border: '1px solid oklch(0.78 0.22 195 / 0.3)',
            boxShadow: '0 0 15px oklch(0.78 0.22 195 / 0.1)',
            minHeight: '400px',
          }}
        >
          <iframe
            ref={iframeRef}
            src={proxiedUrl}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full"
            style={{ minHeight: '400px', height: '100%' }}
            title="Proxy Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      )}

      {/* Empty state */}
      {!proxiedUrl && (
        <GlassCard className="flex-1 flex flex-col items-center justify-center p-12 opacity-60">
          <Globe size={48} className="text-neon-cyan mb-4 animate-float" />
          <p className="font-display text-sm tracking-widest text-muted-foreground mb-2">PROXY BROWSER</p>
          <p className="text-xs text-muted-foreground font-body text-center max-w-xs">
            Enter a URL above to browse the web through the built-in proxy. Note: some sites may block iframe embedding.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default ProxyTab;
