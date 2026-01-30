"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AdminTabProps } from "../types";
import { SiteContent } from "@/lib/site/content";

export function WorkTab({ draft, setDraft, uploadFile, deleteFile, setMediaLibraryState }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tighter">Work</h2>
        <button
          onClick={() => {
            const newProject = {
              id: crypto.randomUUID(),
              title: "New Project",
              artist: "Artist Name",
              role: "Role",
              color: "bg-neutral-800",
              audioSrc: "",
              artworkSrc: "",
            };
            setDraft({ ...draft, work: { ...draft.work, projects: [newProject, ...draft.work.projects] } });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.work.headline}
          onChange={(e) => setDraft({ ...draft, work: { ...draft.work, headline: e.target.value } })}
        />
      </div>
      <div className="space-y-6 mt-8">
        {draft.work.projects.map((p, idx) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <p className="text-white/80 font-mono text-sm">Project {idx + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    const next = [...draft.work.projects];
                    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                    setDraft({ ...draft, work: { ...draft.work, projects: next } });
                  }}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (idx === draft.work.projects.length - 1) return;
                    const next = [...draft.work.projects];
                    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                    setDraft({ ...draft, work: { ...draft.work, projects: next } });
                  }}
                  disabled={idx === draft.work.projects.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    if (!confirm("Are you sure you want to remove this project?")) return;
                    const next = draft.work.projects.filter((_, i) => i !== idx);
                    setDraft({ ...draft, work: { ...draft.work, projects: next } });
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Title</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={p.title}
                  onChange={(e) => {
                    const next = [...draft.work.projects];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setDraft({ ...draft, work: { ...draft.work, projects: next } });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Artist</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={p.artist}
                  onChange={(e) => {
                    const next = [...draft.work.projects];
                    next[idx] = { ...next[idx], artist: e.target.value };
                    setDraft({ ...draft, work: { ...draft.work, projects: next } });
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70">Role</label>
              <input
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                value={p.role}
                onChange={(e) => {
                  const next = [...draft.work.projects];
                  next[idx] = { ...next[idx], role: e.target.value };
                  setDraft({ ...draft, work: { ...draft.work, projects: next } });
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-sm text-white/70 block mb-2">Audio (Preview)</label>
                <label className="inline-block px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-xs">
                  <input
                    type="file"
                    accept=".mp3,.wav"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const url = await uploadFile(f, "audio");
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], audioSrc: url };
                        setDraft({ ...draft, work: { ...draft.work, projects: next } });
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
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], audioSrc: url };
                        setDraft((d: SiteContent) => ({ ...d, work: { ...d.work, projects: next } }));
                        setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                      },
                    })
                  }
                  className="px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition text-xs text-white/70 ml-2"
                >
                  Select
                </button>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <p className="text-[10px] text-white/50 truncate max-w-[150px]">{p.audioSrc || "No audio"}</p>
                  {p.audioSrc && (
                    <button
                      onClick={async () => {
                        if (!confirm("Remove this file?")) return;
                        await deleteFile(p.audioSrc!);
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], audioSrc: "" };
                        setDraft({ ...draft, work: { ...draft.work, projects: next } });
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-2">Artwork</label>
                <label className="inline-block px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-xs">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const url = await uploadFile(f, "image");
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], artworkSrc: url };
                        setDraft({ ...draft, work: { ...draft.work, projects: next } });
                      } catch (err: unknown) {
                        alert(err instanceof Error ? err.message : "Upload failed");
                      }
                    }}
                  />
                  Upload Image
                </label>
                <button
                  onClick={() =>
                    setMediaLibraryState({
                      isOpen: true,
                      type: "image",
                      onSelect: (url) => {
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], artworkSrc: url };
                        setDraft((d: SiteContent) => ({ ...d, work: { ...d.work, projects: next } }));
                        setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                      },
                    })
                  }
                  className="px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition text-xs text-white/70 ml-2"
                >
                  Select
                </button>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  <p className="text-[10px] text-white/50 truncate max-w-[150px]">{p.artworkSrc || "No artwork"}</p>
                  {p.artworkSrc && (
                    <button
                      onClick={async () => {
                        if (!confirm("Remove this file?")) return;
                        await deleteFile(p.artworkSrc!);
                        const next = [...draft.work.projects];
                        next[idx] = { ...next[idx], artworkSrc: "" };
                        setDraft({ ...draft, work: { ...draft.work, projects: next } });
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300"
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
