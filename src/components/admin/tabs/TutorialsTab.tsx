"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AdminTabProps } from "../types";
import { SiteContent } from "@/lib/site/content";

export function TutorialsTab({ draft, setDraft, uploadFile, deleteFile, setMediaLibraryState }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tighter">Tutorials</h2>
        <button
          onClick={() => {
            const newItem = {
              id: crypto.randomUUID(),
              title: "New Tutorial",
              videoUrl: "",
              description: "",
              thumbnailSrc: "",
            };
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                tutorials: {
                  ...draft.lab.tutorials,
                  items: [newItem, ...draft.lab.tutorials.items],
                },
              },
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Tutorial
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.lab.tutorials.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                tutorials: { ...draft.lab.tutorials, headline: e.target.value },
              },
            })
          }
        />
      </div>

      <div className="space-y-6 mt-8">
        {draft.lab.tutorials.items.map((item, idx) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <p className="text-white/80 font-mono text-sm">Tutorial {idx + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    const next = [...draft.lab.tutorials.items];
                    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        tutorials: { ...draft.lab.tutorials, items: next },
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
                    if (idx === draft.lab.tutorials.items.length - 1) return;
                    const next = [...draft.lab.tutorials.items];
                    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        tutorials: { ...draft.lab.tutorials, items: next },
                      },
                    });
                  }}
                  disabled={idx === draft.lab.tutorials.items.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    if (!confirm("Are you sure you want to remove this tutorial?")) return;
                    const next = draft.lab.tutorials.items.filter((_, i) => i !== idx);
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        tutorials: { ...draft.lab.tutorials, items: next },
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
                  const next = [...draft.lab.tutorials.items];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setDraft({
                    ...draft,
                    lab: {
                      ...draft.lab,
                      tutorials: { ...draft.lab.tutorials, items: next },
                    },
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">YouTube Video URL</label>
              <input
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                placeholder="https://youtube.com/watch?v=..."
                value={item.videoUrl}
                onChange={(e) => {
                  const next = [...draft.lab.tutorials.items];
                  next[idx] = { ...next[idx], videoUrl: e.target.value };
                  setDraft({
                    ...draft,
                    lab: {
                      ...draft.lab,
                      tutorials: { ...draft.lab.tutorials, items: next },
                    },
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Description</label>
              <textarea
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none min-h-20"
                value={item.description || ""}
                onChange={(e) => {
                  const next = [...draft.lab.tutorials.items];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setDraft({
                    ...draft,
                    lab: {
                      ...draft.lab,
                      tutorials: { ...draft.lab.tutorials, items: next },
                    },
                  });
                }}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-white/70">Thumbnail (Optional)</label>
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
                          const next = [...draft.lab.tutorials.items];
                          next[idx] = { ...next[idx], thumbnailSrc: url };
                          setDraft({
                            ...draft,
                            lab: {
                              ...draft.lab,
                              tutorials: { ...draft.lab.tutorials, items: next },
                            },
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
                          const next = [...draft.lab.tutorials.items];
                          next[idx] = { ...next[idx], thumbnailSrc: url };
                          setDraft((d: SiteContent) => ({
                            ...d,
                            lab: {
                              ...d.lab,
                              tutorials: { ...d.lab.tutorials, items: next },
                            },
                          }));
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
                  <p className="text-xs text-white/50 truncate">{item.thumbnailSrc || "No thumbnail"}</p>
                  {item.thumbnailSrc && (
                    <button
                      onClick={async () => {
                        if (!confirm("Remove this file?")) return;
                        await deleteFile(item.thumbnailSrc!);
                        const next = [...draft.lab.tutorials.items];
                        next[idx] = { ...next[idx], thumbnailSrc: "" };
                        setDraft({
                          ...draft,
                          lab: {
                            ...draft.lab,
                            tutorials: { ...draft.lab.tutorials, items: next },
                          },
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
        ))}
      </div>
    </div>
  );
}
