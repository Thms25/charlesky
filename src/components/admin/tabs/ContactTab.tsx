"use client";

import { AdminTabProps } from "../types";

export function ContactTab({ draft, setDraft }: AdminTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tighter">Contact</h2>
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.contact.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              contact: { ...draft.contact, headline: e.target.value },
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.contact.email}
          onChange={(e) =>
            setDraft({
              ...draft,
              contact: { ...draft.contact, email: e.target.value },
            })
          }
        />
      </div>

      <div className="border-t border-white/10 pt-6 space-y-4">
        <h3 className="text-lg font-bold">Socials</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-white/70">Instagram URL</label>
            <input
              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
              value={draft.contact.socials.instagram || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socials: {
                      ...draft.contact.socials,
                      instagram: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70">YouTube URL</label>
            <input
              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
              value={draft.contact.socials.youtube || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socials: {
                      ...draft.contact.socials,
                      youtube: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70">Spotify URL</label>
            <input
              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
              value={draft.contact.socials.spotify || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socials: {
                      ...draft.contact.socials,
                      spotify: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70">SoundCloud URL</label>
            <input
              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
              value={draft.contact.socials.soundcloud || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socials: {
                      ...draft.contact.socials,
                      soundcloud: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70">Twitter URL</label>
            <input
              className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
              value={draft.contact.socials.twitter || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socials: {
                      ...draft.contact.socials,
                      twitter: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
