import { AlertCircle, Loader2, Music, Play, Search } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import GlassCard from "../GlassCard";

interface VideoResult {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  duration?: string;
}

const INVIDIOUS_INSTANCES = [
  "https://invidious.io",
  "https://vid.puffyan.us",
  "https://invidious.nerdvpn.de",
  "https://inv.riverside.rocks",
  "https://invidious.snopyta.org",
];

async function searchInvidiousWithFallback(
  query: string,
): Promise<VideoResult[]> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,author,videoThumbnails,lengthSeconds`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;
      return data.slice(0, 12).map((item: any) => ({
        videoId: item.videoId,
        title: item.title || "Unknown Title",
        author: item.author || "Unknown Artist",
        thumbnail:
          item.videoThumbnails?.find((t: any) => t.quality === "medium")?.url ||
          item.videoThumbnails?.[0]?.url ||
          `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
        duration: item.lengthSeconds
          ? `${Math.floor(item.lengthSeconds / 60)}:${String(item.lengthSeconds % 60).padStart(2, "0")}`
          : undefined,
      }));
    } catch {
      // try next instance
    }
  }
  throw new Error("All Invidious instances failed. Please try again later.");
}

export default function MusicTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [bypassMode, setBypassMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const videos = await searchInvidiousWithFallback(query.trim());
      setResults(videos);
      if (videos.length === 0)
        setError("No results found. Try a different search term.");
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlayerUrl = (video: VideoResult) => {
    if (bypassMode) {
      return `https://piped.video/watch?v=${video.videoId}`;
    }
    return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`;
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-neon-pink/20 border border-neon-pink/50 flex items-center justify-center">
            <Music className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h2
              className="text-lg font-bold text-neon-pink"
              style={{ textShadow: "0 0 10px rgba(255,0,128,0.5)" }}
            >
              Music Search
            </h2>
            <p className="text-xs text-gray-400">
              Search and play music via YouTube
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, albums..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink/50 focus:bg-white/8 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-lg bg-neon-pink/20 border border-neon-pink/50 text-neon-pink font-semibold text-sm hover:bg-neon-pink/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </form>

        {/* Bypass toggle */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBypassMode((b) => !b)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              bypassMode
                ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan"
                : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"
            }`}
          >
            {bypassMode ? "🔓 Bypass Mode ON" : "🔒 Bypass Mode OFF"}
          </button>
          <span className="text-xs text-gray-600">
            Use Piped.video instead of YouTube
          </span>
        </div>
      </GlassCard>

      {/* Error */}
      {error && (
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </GlassCard>
      )}

      {/* Video Player */}
      {selectedVideo && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-neon-pink" />
              <span className="text-sm font-semibold text-white truncate max-w-xs">
                {selectedVideo.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="text-xs text-gray-500 hover:text-gray-300 border border-white/10 px-2 py-1 rounded transition-colors"
            >
              Close
            </button>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getPlayerUrl(selectedVideo)}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo.title}
            />
          </div>
        </GlassCard>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {results.map((video) => (
            <GlassCard
              key={video.videoId}
              hoverable
              className="p-3 cursor-pointer flex flex-col gap-2"
              onClick={() => setSelectedVideo(video)}
            >
              <div
                className="relative rounded-lg overflow-hidden"
                style={{ paddingBottom: "56.25%" }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {video.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {video.duration}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                  {video.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {video.author}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && !error && (
        <GlassCard className="p-12 flex flex-col items-center justify-center gap-3 text-center">
          <Music className="w-12 h-12 text-neon-pink/30" />
          <p className="text-gray-500 text-sm">
            Search for your favorite music above
          </p>
          <p className="text-gray-600 text-xs">
            Powered by YouTube via Invidious
          </p>
        </GlassCard>
      )}
    </div>
  );
}
