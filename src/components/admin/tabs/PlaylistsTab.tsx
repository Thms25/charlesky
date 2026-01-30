"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AdminTabProps } from "../types";

export function PlaylistsTab({ draft, setDraft }: AdminTabProps) {
  const formatSpotifyUrl = (url: string) => {
    // Check if it's a standard web link
    if (url.includes("open.spotify.com/playlist/")) {
      const id = url.split("playlist/")[1]?.split("?")[0];
      if (id) return `https://open.spotify.com/embed/playlist/${id}`;
    }
    // Check if it's an album link
    if (url.includes("open.spotify.com/album/")) {
        const id = url.split("album/")[1]?.split("?")[0];
        if (id) return `https://open.spotify.com/embed/album/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tighter">Playlists</h2>
        <button
          onClick={() => {
            const newItem = {
              id: crypto.randomUUID(),
              title: "New Playlist",
              embedUrl: "",
              platform: "spotify" as const,
            };
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                playlists: {
                  ...draft.lab.playlists,
                  items: [newItem, ...draft.lab.playlists.items],
                },
              },
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Playlist
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.lab.playlists.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                playlists: { ...draft.lab.playlists, headline: e.target.value },
              },
            })
          }
        />
      </div>

      <div className="space-y-6 mt-8">
        {draft.lab.playlists.items.map((item, idx) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <p className="text-white/80 font-mono text-sm">Playlist {idx + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    const next = [...draft.lab.playlists.items];
                    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        playlists: { ...draft.lab.playlists, items: next },
                      },
                    });
                  }}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (idx === draft.lab.playlists.items.length - 1) return;
                    const next = [...draft.lab.playlists.items];
                    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        playlists: { ...draft.lab.playlists, items: next },
                      },
                    });
                  }}
                  disabled={idx === draft.lab.playlists.items.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    if (!confirm("Are you sure you want to remove this playlist?")) return;
                    const next = draft.lab.playlists.items.filter((_, i) => i !== idx);
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        playlists: { ...draft.lab.playlists, items: next },
                      },
                    });
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Title</label>
              <input
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                value={item.title}
                onChange={(e) => {
                  const next = [...draft.lab.playlists.items];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setDraft({
                    ...draft,
                    lab: {
                      ...draft.lab,
                      playlists: { ...draft.lab.playlists, items: next },
                    },
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Spotify Link</label>
              <input
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none placeholder:text-white/20"
                placeholder="https://open.spotify.com/playlist/..."
                value={item.embedUrl}
                onChange={(e) => {
                    const formatted = formatSpotifyUrl(e.target.value);
                    const next = [...draft.lab.playlists.items];
                    next[idx] = { ...next[idx], embedUrl: formatted };
                    setDraft({
                        ...draft,
                        lab: {
                        ...draft.lab,
                        playlists: { ...draft.lab.playlists, items: next },
                        },
                    });
                }}
              />
              <p className="text-xs text-white/40">Paste a Spotify playlist or album link. We'll automatically format it for the player.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
