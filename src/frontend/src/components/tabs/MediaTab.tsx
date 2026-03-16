import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  Loader2,
  Play,
  RefreshCw,
  Search,
} from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import GlassCard from "../GlassCard";

interface VideoResult {
  videoId: string;
  title: string;
  author: string;
  viewCount: number;
  publishedText: string;
  lengthSeconds: number;
  thumbnail: string;
}

type PlayerMode = "youtube" | "invidious";

const INVIDIOUS_INSTANCES = [
  "inv.nadeko.net",
  "invidious.privacydev.net",
  "invidious.fdn.fr",
  "vid.puffyan.us",
  "yt.artemislena.eu",
];

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

async function fetchFromInvidious(query: string): Promise<VideoResult[]> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const apiUrl = `https://${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,author,viewCount,publishedText,lengthSeconds&page=1`;
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
      const res = await fetch(proxiedUrl, {
        mode: "cors",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;
      return data
        .slice(0, 18)
        .map(
          (item: {
            videoId?: string;
            title?: string;
            author?: string;
            viewCount?: number;
            publishedText?: string;
            lengthSeconds?: number;
          }) => ({
            videoId: item.videoId || "",
            title: item.title || "Untitled",
            author: item.author || "Unknown",
            viewCount: item.viewCount || 0,
            publishedText: item.publishedText || "",
            lengthSeconds: item.lengthSeconds || 0,
            thumbnail: `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
          }),
        )
        .filter((v) => v.videoId);
    } catch {
      // try next instance
    }
  }
  throw new Error("All Invidious instances failed");
}

export default function MediaTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoResult | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>("youtube");
  const [iframeError, setIframeError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (q?: string) => {
      const searchQuery = q ?? query;
      if (!searchQuery.trim()) return;
      setIsSearching(true);
      setSearchError("");
      setHasSearched(true);
      setActiveVideo(null);
      try {
        const data = await fetchFromInvidious(searchQuery.trim());
        setResults(data);
        if (data.length === 0) {
          setSearchError("No results found. Try a different search term.");
        }
      } catch {
        setSearchError(
          "Could not load results. The search service may be temporarily unavailable — please try again.",
        );
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [query],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const openVideo = (video: VideoResult) => {
    setActiveVideo(video);
    setPlayerMode("youtube");
    setIframeError(false);
  };

  const handleBypass = () => {
    setPlayerMode("invidious");
    setIframeError(false);
  };

  const getEmbedUrl = (video: VideoResult, mode: PlayerMode): string => {
    if (mode === "youtube") {
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`;
    }
    return `https://${INVIDIOUS_INSTANCES[0]}/embed/${video.videoId}?autoplay=1`;
  };

  // ── Video player view ──
  if (activeVideo) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="media.back.button"
            onClick={() => setActiveVideo(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs transition-all"
          >
            <ArrowLeft size={14} />
            Back to Results
          </button>
          <span className="text-xs text-gray-500 truncate max-w-xs">
            {activeVideo.title}
          </span>
        </div>

        {/* Player */}
        <GlassCard className="p-3">
          <div
            className="relative"
            style={{ paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              key={`${activeVideo.videoId}-${playerMode}`}
              src={getEmbedUrl(activeVideo, playerMode)}
              title={activeVideo.title}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setIframeError(true)}
              data-ocid="media.canvas_target"
            />
          </div>

          {/* Player mode indicator + bypass */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                  playerMode === "youtube"
                    ? "border-red-500/50 bg-red-500/10 text-red-400"
                    : "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                }`}
              >
                {playerMode === "youtube" ? "▶ YouTube" : "⚡ Bypass Mode"}
              </span>
              {playerMode === "invidious" && (
                <span className="text-xs text-gray-500">via Invidious</span>
              )}
            </div>
            {playerMode === "youtube" && (
              <button
                type="button"
                data-ocid="media.secondary_button"
                onClick={handleBypass}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 transition-all"
              >
                <RefreshCw size={12} />
                Try Bypass
              </button>
            )}
          </div>

          {iframeError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <AlertTriangle size={14} />
              The video couldn&apos;t be embedded. Try the bypass mode or watch
              on YouTube.
            </div>
          )}
        </GlassCard>

        {/* Video info */}
        <div className="px-1">
          <h3 className="text-base font-semibold text-white leading-tight mb-1">
            {activeVideo.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span>{activeVideo.author}</span>
            <span>·</span>
            <span>{formatViews(activeVideo.viewCount)}</span>
            {activeVideo.publishedText && (
              <>
                <span>·</span>
                <span>{activeVideo.publishedText}</span>
              </>
            )}
            {activeVideo.lengthSeconds > 0 && (
              <>
                <span>·</span>
                <span>{formatDuration(activeVideo.lengthSeconds)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Search view ──
  return (
    <div className="flex flex-col gap-6">
      {/* Rainbow neon search bar */}
      <div className="relative">
        <div
          className={`relative rounded-2xl p-[2px] transition-all duration-300 ${
            isFocused ? "rainbow-border-focused" : "rainbow-border"
          }`}
          style={{
            background: isFocused
              ? "linear-gradient(90deg, #ff0080, #ff8800, #ffff00, #00ff88, #00e5ff, #aa00ff, #ff0080)"
              : "linear-gradient(90deg, #ff008066, #ff880066, #ffff0066, #00ff8866, #00e5ff66, #aa00ff66, #ff008066)",
            backgroundSize: "200% 100%",
            animation: "rainbow-shift 3s linear infinite",
          }}
        >
          <div className="flex items-center bg-[#0a0a1a] rounded-[14px] overflow-hidden">
            <div className="pl-4 text-gray-400">
              {isSearching ? (
                <Loader2 size={18} className="animate-spin text-neon-cyan" />
              ) : (
                <Search size={18} />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              data-ocid="media.search_input"
              placeholder="Search YouTube videos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 px-4 py-4 bg-transparent text-white placeholder:text-gray-500 text-sm outline-none"
              style={{ cursor: "none" }}
            />
            <button
              type="button"
              data-ocid="media.submit_button"
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="px-6 py-4 text-xs font-bold tracking-widest text-white disabled:opacity-40 transition-all hover:bg-white/5"
              style={{ cursor: "none" }}
            >
              {isSearching ? "SEARCHING..." : "SEARCH"}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {searchError && (
        <div
          data-ocid="media.error_state"
          className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm"
        >
          <AlertTriangle size={16} className="shrink-0" />
          <span>{searchError}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {isSearching && (
        <div
          data-ocid="media.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
            <div
              key={sk}
              className="rounded-xl border border-white/5 bg-white/3 overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-white/5" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty / welcome state */}
      {!hasSearched && !isSearching && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div
            className="text-6xl"
            style={{ filter: "drop-shadow(0 0 20px #00e5ff)" }}
          >
            📺
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-neon-cyan neon-text">
              MEDIA SEARCH
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Search any YouTube video. Blocked? Hit bypass.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            {[
              "lofi hip hop",
              "minecraft music",
              "coding music",
              "synthwave",
              "vaporwave",
            ].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1.5 rounded-full text-xs border border-neon-cyan/30 text-neon-cyan/70 hover:border-neon-cyan hover:text-neon-cyan transition-all"
                style={{ cursor: "none" }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      {!isSearching && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((video) => (
            <button
              key={video.videoId}
              type="button"
              data-ocid="media.item.1"
              onClick={() => openVideo(video)}
              className="group text-left rounded-xl border border-white/5 bg-white/3 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 overflow-hidden transition-all duration-200"
              style={{ cursor: "none" }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center">
                    <Play size={20} className="text-neon-cyan ml-1" />
                  </div>
                </div>
                {video.lengthSeconds > 0 && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.lengthSeconds)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm text-white font-medium leading-snug line-clamp-2 group-hover:text-neon-cyan transition-colors">
                  {video.title}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                  <Eye size={11} />
                  <span>{formatViews(video.viewCount)}</span>
                  {video.publishedText && (
                    <>
                      <span>·</span>
                      <span>{video.publishedText}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{video.author}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes rainbow-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
