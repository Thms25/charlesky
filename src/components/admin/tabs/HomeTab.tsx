"use client";

import { Eye, EyeOff } from "lucide-react";
import { AdminTabProps } from "../types";

export function HomeTab({ draft, setDraft, uploadFile, deleteFile, setMediaLibraryState }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tighter">Home</h2>
      <div className="grid gap-4">
        <label className="text-sm text-white/70">Tagline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.home.tagline}
          onChange={(e) => setDraft({ ...draft, home: { ...draft.home, tagline: e.target.value } })}
        />
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h3 className="text-lg font-bold">Latest release</h3>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Title</label>
          <input
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
            value={draft.home.latestRelease.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, title: e.target.value } },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Description</label>
          <textarea
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none min-h-28"
            value={draft.home.latestRelease.description}
            onChange={(e) =>
              setDraft({
                ...draft,
                home: {
                  ...draft.home,
                  latestRelease: { ...draft.home.latestRelease, description: e.target.value },
                },
              })
            }
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Audio File (MP3/WAV)</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-sm">
                <input
                  type="file"
                  accept=".mp3,.wav"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      const url = await uploadFile(f, "audio");
                      setDraft({
                        ...draft,
                        home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, audioSrc: url } },
                      });
                    } catch (err: unknown) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    }
                  }}
                />
                Upload Audio
              </label>
              <button
                onClick={() =>
                  setMediaLibraryState({
                    isOpen: true,
                    type: "audio",
                    onSelect: (url) => {
                      setDraft({
                        ...draft,
                        home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, audioSrc: url } },
                      });
                      setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                    },
                  })
                }
                className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm text-white/70"
              >
                Select from Library
              </button>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p className="text-xs text-white/50 truncate">{draft.home.latestRelease.audioSrc || "No audio uploaded"}</p>
              {draft.home.latestRelease.audioSrc && (
                <button
                  onClick={async () => {
                    if (!confirm("Remove this file?")) return;
                    await deleteFile(draft.home.latestRelease.audioSrc);
                    setDraft({
                      ...draft,
                      home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, audioSrc: "" } },
                    });
                  }}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Artwork (Optional)</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-sm">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try {
                      const url = await uploadFile(f, "image");
                      setDraft({
                        ...draft,
                        home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, artworkSrc: url } },
                      });
                    } catch (err: unknown) {
                      alert(err instanceof Error ? err.message : "Upload failed");
                    }
                  }}
                />
                Upload Artwork
              </label>
              <button
                onClick={() =>
                  setMediaLibraryState({
                    isOpen: true,
                    type: "image",
                    onSelect: (url) => {
                      setDraft({
                        ...draft,
                        home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, artworkSrc: url } },
                      });
                      setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                    },
                  })
                }
                className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm text-white/70"
              >
                Select
              </button>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p className="text-xs text-white/50 truncate">{draft.home.latestRelease.artworkSrc || "No artwork"}</p>
              {draft.home.latestRelease.artworkSrc && (
                <button
                  onClick={async () => {
                    if (!confirm("Remove this file?")) return;
                    await deleteFile(draft.home.latestRelease.artworkSrc!);
                    setDraft({
                      ...draft,
                      home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, artworkSrc: "" } },
                    });
                  }}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h3 className="text-lg font-bold">Lab Cards</h3>
        <div className="space-y-6">
          {draft.lab.home.cards.map((card, idx) => (
            <div key={card.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white/80 font-mono text-sm">
                  Card {idx + 1}: {card.title}
                </p>
                <button
                  onClick={() => {
                    const nextCards = [...draft.lab.home.cards];
                    nextCards[idx] = { ...nextCards[idx], hidden: !nextCards[idx].hidden };
                    setDraft({
                      ...draft,
                      lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                    });
                  }}
                  className={`p-2 rounded-lg transition ${
                    card.hidden 
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                      : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                  }`}
                  title={card.hidden ? "Card is hidden" : "Card is visible"}
                >
                  {card.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-sm">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          try {
                            const url = await uploadFile(f, "image");
                            const nextCards = [...draft.lab.home.cards];
                            nextCards[idx] = { ...nextCards[idx], imageSrc: url };
                            setDraft({
                              ...draft,
                              lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                            });
                          } catch (err: unknown) {
                            alert(err instanceof Error ? err.message : "Upload failed");
                          }
                        }}
                      />
                      Upload
                    </label>
                    <button
                      onClick={() =>
                        setMediaLibraryState({
                          isOpen: true,
                          type: "image",
                          onSelect: (url) => {
                            const nextCards = [...draft.lab.home.cards];
                            nextCards[idx] = { ...nextCards[idx], imageSrc: url };
                            setDraft({
                              ...draft,
                              lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                            });
                            setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                          },
                        })
                      }
                      className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm text-white/70"
                    >
                      Select
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <p className="text-xs text-white/50 truncate">{card.imageSrc || "No image"}</p>
                    {card.imageSrc && (
                      <button
                        onClick={async () => {
                          if (!confirm("Remove this file?")) return;
                          await deleteFile(card.imageSrc);
                          const nextCards = [...draft.lab.home.cards];
                          nextCards[idx] = { ...nextCards[idx], imageSrc: "" };
                          setDraft({
                            ...draft,
                            lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                          });
                        }}
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/70">Title</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={card.title}
                  onChange={(e) => {
                    const nextCards = [...draft.lab.home.cards];
                    nextCards[idx] = { ...nextCards[idx], title: e.target.value };
                    setDraft({
                      ...draft,
                      lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Subtitle</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={card.subtitle}
                  onChange={(e) => {
                    const nextCards = [...draft.lab.home.cards];
                    nextCards[idx] = { ...nextCards[idx], subtitle: e.target.value };
                    setDraft({
                      ...draft,
                      lab: { ...draft.lab, home: { ...draft.lab.home, cards: nextCards } },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
