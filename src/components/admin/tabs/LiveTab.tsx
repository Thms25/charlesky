"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { AdminTabProps } from "../types";

export function LiveTab({ draft, setDraft }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tighter">Live</h2>
        <button
          onClick={() => {
            const newShow = {
              id: crypto.randomUUID(),
              date: "OCT 12",
              year: "2025",
              venue: "Venue Name",
              city: "City",
              country: "Country",
              status: "available" as const,
              ticketLink: "#",
            };
            setDraft({
              ...draft,
              live: {
                ...draft.live,
                shows: [newShow, ...draft.live.shows],
              },
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Show
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.live.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              live: { ...draft.live, headline: e.target.value },
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Subtitle</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.live.subtitle}
          onChange={(e) =>
            setDraft({
              ...draft,
              live: { ...draft.live, subtitle: e.target.value },
            })
          }
        />
      </div>

      <div className="space-y-6 mt-8">
        {draft.live.shows.map((show, idx) => (
          <div
            key={show.id}
            className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <p className="text-white/80 font-mono text-sm">
                Show {idx + 1}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    const next = [...draft.live.shows];
                    [next[idx - 1], next[idx]] = [
                      next[idx],
                      next[idx - 1],
                    ];
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (idx === draft.live.shows.length - 1) return;
                    const next = [...draft.live.shows];
                    [next[idx], next[idx + 1]] = [
                      next[idx + 1],
                      next[idx],
                    ];
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                  disabled={idx === draft.live.shows.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    if (
                      !confirm(
                        "Are you sure you want to remove this show?",
                      )
                    )
                      return;
                    const next = draft.live.shows.filter(
                      (_, i) => i !== idx,
                    );
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-white/70">
                  Date (e.g. OCT 12)
                </label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.date}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = { ...next[idx], date: e.target.value };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">Year</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.year}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = { ...next[idx], year: e.target.value };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm text-white/70">Venue</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.venue}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = {
                      ...next[idx],
                      venue: e.target.value,
                    };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-white/70">City</label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.city}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = { ...next[idx], city: e.target.value };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">
                  Country
                </label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.country}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = {
                      ...next[idx],
                      country: e.target.value,
                    };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">
                  Status
                </label>
                <select
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.status}
                  onChange={(e) => {
                    const next = [...draft.live.shows];

                    next[idx] = {
                      ...next[idx],
                      status: e.target.value as
                        | "available"
                        | "sold_out"
                        | "selling_fast",
                    };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="selling_fast">Selling Fast</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-white/70">
                  Ticket Link
                </label>
                <input
                  className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                  value={show.ticketLink}
                  onChange={(e) => {
                    const next = [...draft.live.shows];
                    next[idx] = {
                      ...next[idx],
                      ticketLink: e.target.value,
                    };
                    setDraft({
                      ...draft,
                      live: { ...draft.live, shows: next },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
