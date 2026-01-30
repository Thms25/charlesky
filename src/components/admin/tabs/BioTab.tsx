"use client";

import { AdminTabProps } from "../types";
import { SiteContent } from "@/lib/site/content";

export function BioTab({ draft, setDraft, uploadFile, deleteFile, setMediaLibraryState }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tighter">Bio</h2>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Header Image</label>
        <div className="flex items-center gap-4">
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
                    bio: { ...draft.bio, headerImage: url },
                  });
                } catch (err: unknown) {
                  alert(err instanceof Error ? err.message : "Upload failed");
                }
              }}
            />
            Upload Header
          </label>
          <button
            onClick={() =>
              setMediaLibraryState({
                isOpen: true,
                type: "image",
                onSelect: (url) => {
                  setDraft((d: SiteContent) => ({
                    ...d,
                    bio: { ...d.bio, headerImage: url },
                  }));
                  setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                },
              })
            }
            className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition text-sm text-white/70"
          >
            Select
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <p className="text-xs text-white/50 truncate">{draft.bio.headerImage || "No header image"}</p>
            {draft.bio.headerImage && (
              <button
                onClick={async () => {
                  if (!confirm("Remove this file?")) return;
                  await deleteFile(draft.bio.headerImage);
                  setDraft({
                    ...draft,
                    bio: { ...draft.bio, headerImage: "" },
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
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.bio.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              bio: { ...draft.bio, headline: e.target.value },
            })
          }
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Paragraphs (one per line)</label>
        <textarea
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none min-h-32"
          value={draft.bio.paragraphs.join("\n")}
          onChange={(e) =>
            setDraft({
              ...draft,
              bio: {
                ...draft.bio,
                paragraphs: e.target.value.split("\n").filter(Boolean),
              },
            })
          }
        />
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h3 className="text-lg font-bold">Gallery (3 items)</h3>
        <p className="text-white/50 text-xs">You can paste a URL or upload an image to Firebase Storage.</p>

        <div className="space-y-6">
          {draft.bio.gallery.map((g, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-white/80 font-mono text-sm">Item {idx + 1}</p>
                <label className="text-xs text-white/70 cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const url = await uploadFile(f, "image");
                        const next = [...draft.bio.gallery];
                        next[idx] = { ...next[idx], src: url };
                        setDraft({
                          ...draft,
                          bio: { ...draft.bio, gallery: next },
                        });
                      } catch (err: unknown) {
                        alert(err instanceof Error ? err.message : "Upload failed");
                      }
                    }}
                  />
                  Upload image
                </label>
                <button
                  onClick={() =>
                    setMediaLibraryState({
                      isOpen: true,
                      type: "image",
                      onSelect: (url) => {
                        const next = [...draft.bio.gallery];
                        next[idx] = { ...next[idx], src: url };
                        setDraft((d: SiteContent) => ({
                          ...d,
                          bio: { ...d.bio, gallery: next },
                        }));
                        setMediaLibraryState((s) => ({
                          ...s,
                          isOpen: false,
                        }));
                      },
                    })
                  }
                  className="text-xs text-white/70 hover:text-white transition bg-white/5 px-2 py-1 rounded"
                >
                  Select
                </button>
                {g.src && (
                  <button
                    onClick={async () => {
                      if (!confirm("Remove this file?")) return;
                      await deleteFile(g.src);
                      const next = [...draft.bio.gallery];
                      next[idx] = { ...next[idx], src: "" };
                      setDraft({
                        ...draft,
                        bio: { ...draft.bio, gallery: next },
                      });
                    }}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Image URL</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
                  value={g.src}
                  onChange={(e) => {
                    const next = [...draft.bio.gallery];
                    next[idx] = { ...next[idx], src: e.target.value };
                    setDraft({
                      ...draft,
                      bio: { ...draft.bio, gallery: next },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Alt</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={g.alt}
                  onChange={(e) => {
                    const next = [...draft.bio.gallery];
                    next[idx] = { ...next[idx], alt: e.target.value };
                    setDraft({
                      ...draft,
                      bio: { ...draft.bio, gallery: next },
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label className="text-sm text-white/70">Phrase title</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                    value={g.phraseTitle}
                    onChange={(e) => {
                      const next = [...draft.bio.gallery];
                      next[idx] = {
                        ...next[idx],
                        phraseTitle: e.target.value,
                      };
                      setDraft({
                        ...draft,
                        bio: { ...draft.bio, gallery: next },
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white/70">Phrase body</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                    value={g.phraseBody}
                    onChange={(e) => {
                      const next = [...draft.bio.gallery];
                      next[idx] = {
                        ...next[idx],
                        phraseBody: e.target.value,
                      };
                      setDraft({
                        ...draft,
                        bio: { ...draft.bio, gallery: next },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
