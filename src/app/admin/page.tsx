"use client";

import { useEffect, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase/client";
import { defaultSiteContent, type SiteContent } from "@/lib/site/content";
import { useSiteContent } from "@/lib/site/useSiteContent";
import { cn } from "@/lib/utils";

type Tab = "home" | "work" | "live" | "bio" | "contact";

function missingFirebaseConfig() {
  const values = [
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ];
  return values.some((v) => !v);
}

const SITE_DOC = doc(firebaseDb, "site", "content");

import { revalidateSiteContent } from "@/lib/site/actions";

export default function AdminPage() {
  const content = useSiteContent();
  const { data, actions } = content;
  const [tab, setTab] = useState<Tab>("home");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [draft, setDraft] = useState<SiteContent>(defaultSiteContent);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [uploadState, setUploadState] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => {
      setUserEmail(u?.email ?? null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // keep draft synced with content snapshot (unless user is mid-edit)
    setDraft(data);
  }, [data]);

  const canEdit = !!userEmail;

  const onLogin = async () => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : "Failed to sign in.");
    }
  };

  const onLogout = async () => {
    await signOut(firebaseAuth);
  };

  const onSave = async () => {
    setSaveState("saving");
    setSaveError(null);
    try {
      await setDoc(SITE_DOC, draft, { merge: false });
      await revalidateSiteContent();
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e: unknown) {
      setSaveState("error");
      setSaveError(e instanceof Error ? e.message : "Failed to save.");
    }
  };

  const uploadImage = async (file: File) => {
    const u = firebaseAuth.currentUser;
    if (!u) throw new Error("You must be signed in to upload.");
    setUploadState(`Uploading ${file.name}...`);
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const storageRef = ref(firebaseStorage, `media/${new Date().getTime()}_${safeName}`);
    const task = uploadBytesResumable(storageRef, file);
    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setUploadState(`Uploading ${file.name}... ${pct}%`);
        },
        reject,
        () => resolve()
      );
    });
    const url = await getDownloadURL(task.snapshot.ref);
    setUploadState(null);
    return url;
  };

  const tabs: Array<{ id: Tab; label: string }> = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "work", label: "Work" },
      { id: "live", label: "Live" },
      { id: "bio", label: "Bio" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  if (missingFirebaseConfig()) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Admin</h1>
        <p className="text-white/70 leading-relaxed">
          Firebase is not configured yet. Add your Firebase Web App config to <code className="text-white">.env.local</code>.
        </p>
        <p className="text-white/70 leading-relaxed mt-4">
          Follow: <code className="text-white">docs/FIREBASE_SETUP.md</code>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Admin</h1>
          <p className="text-white/60 mt-2">Edit content + upload media (Firebase).</p>
          {content.status === "error" && (
            <p className="text-red-400 mt-2 text-sm">Content load error: {content.error}</p>
          )}
        </div>

        <div className="text-right">
          {userEmail ? (
            <>
              <p className="text-white/60 text-sm">Signed in as</p>
              <p className="text-white font-mono text-sm">{userEmail}</p>
              <button onClick={onLogout} className="mt-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition">
                Sign out
              </button>
            </>
          ) : (
            <div className="w-[320px] bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white font-semibold mb-3">Sign in</p>
              <div className="space-y-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                />
                <button onClick={onLogin} className="w-full mt-2 px-4 py-2 rounded-lg bg-white text-black font-bold">
                  Sign in
                </button>
                {authError && <p className="text-red-400 text-xs mt-2">{authError}</p>}
                <p className="text-white/50 text-xs mt-2">
                  Create the user in Firebase Auth first (Email/Password), then sign in here. Lock writes using rules in{" "}
                  <code className="text-white">firebase/*.rules</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!canEdit ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">
            Sign in to edit content. Reading the site is public; writing is enforced by your Firebase security rules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-3 h-fit md:sticky md:top-28">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition",
                  tab === t.id ? "bg-white text-black font-bold" : "text-white/70 hover:bg-white/10"
                )}
              >
                {t.label}
              </button>
            ))}

            <div className="mt-4 px-2">
              <button
                onClick={actions.ensureSeeded}
                className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition text-white/90"
              >
                Seed defaults
              </button>
              <p className="text-white/50 text-xs mt-2">Creates &apos;site/content&apos; if it doesn&apos;t exist yet.</p>
            </div>
          </aside>

          <main className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-white/60 text-sm font-mono">
                {saveState === "saving" && "Saving..."}
                {saveState === "saved" && "Saved ✓"}
                {saveState === "error" && `Save failed: ${saveError}`}
                {saveState === "idle" && " "}
              </p>
              <button onClick={onSave} className="px-5 py-2.5 rounded-full bg-white text-black font-bold">
                Save changes
              </button>
            </div>

            {uploadState && <p className="text-white/70 text-sm mb-4">{uploadState}</p>}

            {tab === "home" && (
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
                    <label className="text-sm text-white/70">Spotify embed URL</label>
                    <input
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
                      value={draft.home.latestRelease.spotifyEmbedUrl}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          home: {
                            ...draft.home,
                            latestRelease: { ...draft.home.latestRelease, spotifyEmbedUrl: e.target.value },
                          },
                        })
                      }
                    />
                    <p className="text-white/50 text-xs">Example: https://open.spotify.com/embed/track/…</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "bio" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter">Bio</h2>
                <div className="grid gap-2">
                  <label className="text-sm text-white/70">Headline</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                    value={draft.bio.headline}
                    onChange={(e) => setDraft({ ...draft, bio: { ...draft.bio, headline: e.target.value } })}
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
                        bio: { ...draft.bio, paragraphs: e.target.value.split("\n").filter(Boolean) },
                      })
                    }
                  />
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h3 className="text-lg font-bold">Gallery (3 items)</h3>
                  <p className="text-white/50 text-xs">
                    You can paste a URL or upload an image to Firebase Storage and use the generated URL.
                  </p>

                  <div className="space-y-6">
                    {draft.bio.gallery.map((g, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-white/80 font-mono text-sm">Item {idx + 1}</p>
                          <label className="text-xs text-white/70 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                try {
                                  const url = await uploadImage(f);
                                  const next = [...draft.bio.gallery];
                                  next[idx] = { ...next[idx], src: url };
                                  setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
                                } catch (err: unknown) {
                                  setUploadState(null);
                                  alert(err instanceof Error ? err.message : "Upload failed");
                                }
                              }}
                            />
                            Upload image
                          </label>
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm text-white/70">Image URL</label>
                          <input
                            className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none font-mono text-sm"
                            value={g.src}
                            onChange={(e) => {
                              const next = [...draft.bio.gallery];
                              next[idx] = { ...next[idx], src: e.target.value };
                              setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
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
                              setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
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
                                next[idx] = { ...next[idx], phraseTitle: e.target.value };
                                setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
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
                                next[idx] = { ...next[idx], phraseBody: e.target.value };
                                setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab !== "home" && tab !== "bio" && (
              <div className="text-white/70">
                <p className="mb-2">This tab is scaffolded. Next steps:</p>
                <ul className="list-disc pl-6 space-y-1 text-white/60">
                  <li>Work: edit projects list and optional artwork URLs.</li>
                  <li>Live: edit show dates list + ticket links.</li>
                  <li>Contact: edit email + social links.</li>
                </ul>
                <p className="mt-4 text-white/50 text-sm">
                  The site already reads from Firestore with fallbacks; we can expand these editors as needed.
                </p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

