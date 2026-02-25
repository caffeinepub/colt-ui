import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import { Music, Play, ExternalLink } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  embedUrl: string;
  color: 'cyan' | 'green' | 'purple' | 'pink';
}

const tracks: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Synthwave Radio',
    genre: 'SYNTHWAVE',
    embedUrl: 'https://www.youtube.com/embed/videoseries?list=PLuMTe9QKFZB3Z5OkMFJFHFJFHFJFHFJFH&autoplay=1',
    color: 'cyan',
  },
  {
    id: '2',
    title: 'Cyberpunk Mix',
    artist: 'Electronic Beats',
    genre: 'ELECTRONIC',
    embedUrl: 'https://www.youtube.com/embed/b1kbLwvqugk?autoplay=1',
    color: 'purple',
  },
  {
    id: '3',
    title: 'Lo-Fi Study Beats',
    artist: 'ChilledCow',
    genre: 'LO-FI',
    embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
    color: 'green',
  },
  {
    id: '4',
    title: 'Retrowave Drive',
    artist: 'Outrun Radio',
    genre: 'RETROWAVE',
    embedUrl: 'https://www.youtube.com/embed/5E4oHCHMkMU?autoplay=1',
    color: 'pink',
  },
  {
    id: '5',
    title: 'Dark Techno',
    artist: 'Underground Beats',
    genre: 'TECHNO',
    embedUrl: 'https://www.youtube.com/embed/4_2lhj7BFEM?autoplay=1',
    color: 'cyan',
  },
  {
    id: '6',
    title: 'Ambient Space',
    artist: 'Cosmic Sounds',
    genre: 'AMBIENT',
    embedUrl: 'https://www.youtube.com/embed/tNkZsRW7h2c?autoplay=1',
    color: 'purple',
  },
];

const genreColors: Record<string, string> = {
  SYNTHWAVE: 'text-neon-cyan',
  ELECTRONIC: 'text-neon-purple',
  'LO-FI': 'text-neon-green',
  RETROWAVE: 'text-[oklch(0.72_0.22_330)]',
  TECHNO: 'text-neon-cyan',
  AMBIENT: 'text-neon-purple',
};

const MusicTab: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <Music className="text-neon-cyan" size={20} />
        <h2 className="font-display text-lg tracking-widest text-foreground">MUSIC PLAYER</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        {/* Track List */}
        <div className="lg:w-80 shrink-0">
          <p className="text-xs text-muted-foreground font-body tracking-wider mb-3">CURATED TRACKS</p>
          <div className="flex flex-col gap-2">
            {tracks.map((track) => (
              <GlassCard
                key={track.id}
                hoverable
                neonColor={track.color}
                onClick={() => setSelectedTrack(track)}
                className={`p-3 transition-all ${selectedTrack?.id === track.id ? 'border-neon-cyan shadow-neon' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center shrink-0"
                    style={{ background: 'oklch(0.18 0.03 240)', border: '1px solid oklch(0.25 0.04 240)' }}
                  >
                    {selectedTrack?.id === track.id ? (
                      <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse-neon"
                        style={{ boxShadow: '0 0 8px oklch(0.78 0.22 195)' }} />
                    ) : (
                      <Play size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground truncate">{track.title}</p>
                    <p className="font-body text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className={`text-xs font-display tracking-wider shrink-0 ${genreColors[track.genre] || 'text-muted-foreground'}`}>
                    {track.genre}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Player */}
        <div className="flex-1">
          {selectedTrack ? (
            <div className="h-full flex flex-col gap-3">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm tracking-wider text-neon-cyan">{selectedTrack.title}</p>
                    <p className="font-body text-xs text-muted-foreground">{selectedTrack.artist}</p>
                  </div>
                  <a
                    href={selectedTrack.embedUrl.replace('/embed/', '/watch?v=').replace('?autoplay=1', '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-neon-cyan transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </GlassCard>
              <div
                className="flex-1 rounded-lg overflow-hidden"
                style={{
                  border: '1px solid oklch(0.78 0.22 195 / 0.3)',
                  boxShadow: '0 0 15px oklch(0.78 0.22 195 / 0.1)',
                  minHeight: '300px',
                }}
              >
                <iframe
                  src={selectedTrack.embedUrl}
                  className="w-full h-full"
                  style={{ minHeight: '300px' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedTrack.title}
                />
              </div>
            </div>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center p-12 opacity-60" style={{ minHeight: '300px' }}>
              <Music size={48} className="text-neon-cyan mb-4 animate-float" />
              <p className="font-display text-sm tracking-widest text-muted-foreground mb-2">SELECT A TRACK</p>
              <p className="text-xs text-muted-foreground font-body text-center">
                Choose a track from the list to start playing
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicTab;
