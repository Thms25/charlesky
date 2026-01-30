"use client";

import { useEffect, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject, listAll, type StorageReference } from "firebase/storage";
import { X, Music, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase/client";
import { defaultSiteContent, type SiteContent } from "@/lib/site/content";
import { useSiteContent } from "@/lib/site/useSiteContent";
import { cn } from "@/lib/utils";
import { revalidateSiteContent } from "@/lib/site/actions";

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


function MediaLibraryModal({
  onSelect,
  onClose,
  type,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
  type: "audio" | "image";
}) {
  const [files, setFiles] = useState<Array<{ name: string; url: string; ref: StorageReference }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const listRef = ref(firebaseStorage, "media");
        const res = await listAll(listRef);
        const filePromises = res.items.map(async (itemRef) => {
          try {
             const url = await getDownloadURL(itemRef);
             return { name: itemRef.name, url, ref: itemRef };
          } catch (err) {
             console.warn("Failed to get URL for item", itemRef.name, err);
             return null;
          }
        });
        const allFilesResults = await Promise.all(filePromises);
        const allFiles = allFilesResults.filter((f): f is { name: string; url: string; ref: StorageReference } => f !== null);
        
        // Simple client-side filtering based on extension
        const filtered = allFiles.filter(f => {
            const lower = f.name.toLowerCase();
            if (type === "audio") return lower.match(/\.(mp3|wav)$/);
            if (type === "image") return lower.match(/\.(jpg|jpeg|png|gif|webp)$/);
            return true;
        });
        
        // Sort by name (roughly time) descending if we used timestamp prefix
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        
        setFiles(filtered);
      } catch (e) {
        console.error("Failed to list files", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [type]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl border border-white/10 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold">Select {type === "image" ? "Image" : "Audio"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No files found. Upload some first!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square bg-black/40 rounded-lg overflow-hidden border border-white/5 hover:border-white/20 transition text-left"
                >
                  {type === "image" ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 group-hover:text-white/40">
                      <Music className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-[10px] truncate text-white/70">
                    {file.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [mediaLibraryState, setMediaLibraryState] = useState<{
    isOpen: boolean;
    type: "audio" | "image";
    onSelect?: (url: string) => void;
  }>({ isOpen: false, type: "image" });

  // Check for unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(draft);
  }, [data, draft]);

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

  const uploadFile = async (file: File, type: "audio" | "image") => {
    const u = firebaseAuth.currentUser;
    if (!u) throw new Error("You must be signed in to upload.");

    // Validate file type
    if (type === "audio") {
      if (!file.name.match(/\.(mp3|wav)$/i)) {
         throw new Error("Only .mp3 and .wav files are allowed for audio.");
      }
    } else if (type === "image") {
       if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
         throw new Error("Only .jpg, .jpeg, and .png files are allowed for images.");
      }
    }

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

  const deleteFile = async (url: string) => {
      if (!url) return;
      const u = firebaseAuth.currentUser;
      if (!u) throw new Error("You must be signed in to delete.");
      
      try {
          // Create a reference from the download URL
          // This requires the URL to be a valid Firebase Storage download URL
          const fileRef = ref(firebaseStorage, url);
          await deleteObject(fileRef);
      } catch (e) {
          console.warn("Could not delete file from storage (might not exist or invalid URL):", e);
          // We continue anyway to clear the field in the DB
      }
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
                    <label className="text-sm text-white/70">Audio File (MP3/WAV)</label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-sm">
                                <input type="file" accept=".mp3,.wav" className="hidden" onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    try {
                                        const url = await uploadFile(f, "audio");
                                        setDraft({ ...draft, home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, audioSrc: url } } });
                                    } catch (err: unknown) {
                                        alert(err instanceof Error ? err.message : "Upload failed");
                                    }
                                }} />
                                Upload Audio
                            </label>
                            <button
                                onClick={() => setMediaLibraryState({
                                    isOpen: true,
                                    type: "audio",
                                    onSelect: (url) => {
                                        setDraft(d => ({ ...d, home: { ...d.home, latestRelease: { ...d.home.latestRelease, audioSrc: url } } }));
                                        setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                    }
                                })}
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
                                 setDraft({ ...draft, home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, audioSrc: "" } } });
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
                                <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    try {
                                        const url = await uploadFile(f, "image");
                                        setDraft({ ...draft, home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, artworkSrc: url } } });
                                    } catch (err: unknown) {
                                        alert(err instanceof Error ? err.message : "Upload failed");
                                    }
                                }} />
                                Upload Artwork
                            </label>
                             <button
                                onClick={() => setMediaLibraryState({
                                    isOpen: true,
                                    type: "image",
                                    onSelect: (url) => {
                                        setDraft(d => ({ ...d, home: { ...d.home, latestRelease: { ...d.home.latestRelease, artworkSrc: url } } }));
                                        setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                    }
                                })}
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
                                 setDraft({ ...draft, home: { ...draft.home, latestRelease: { ...draft.home.latestRelease, artworkSrc: "" } } });
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
              </div>
            )}

            {tab === "bio" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter">Bio</h2>
                
                <div className="grid gap-2">
                    <label className="text-sm text-white/70">Header Image</label>
                    <div className="flex items-center gap-4">
                        <label className="px-4 py-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-sm">
                            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                try {
                                    const url = await uploadFile(f, "image");
                                    setDraft({ ...draft, bio: { ...draft.bio, headerImage: url } });
                                } catch (err: unknown) {
                                    alert(err instanceof Error ? err.message : "Upload failed");
                                }
                            }} />
                            Upload Header
                        </label>
                        <button
                            onClick={() => setMediaLibraryState({
                                isOpen: true,
                                type: "image",
                                onSelect: (url) => {
                                    setDraft(d => ({ ...d, bio: { ...d.bio, headerImage: url } }));
                                    setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                }
                            })}
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
                                 setDraft({ ...draft, bio: { ...draft.bio, headerImage: "" } });
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
                    You can paste a URL or upload an image to Firebase Storage.
                  </p>

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
                                  setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
                                } catch (err: unknown) {
                                  setUploadState(null);
                                  alert(err instanceof Error ? err.message : "Upload failed");
                                }
                              }}
                            />
                            Upload image
                          </label>
                          <button
                            onClick={() => setMediaLibraryState({
                                isOpen: true,
                                type: "image",
                                onSelect: (url) => {
                                    const next = [...draft.bio.gallery];
                                    next[idx] = { ...next[idx], src: url };
                                    setDraft(d => ({ ...d, bio: { ...d.bio, gallery: next } }));
                                    setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                }
                            })}
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
                                 setDraft({ ...draft, bio: { ...draft.bio, gallery: next } });
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

            {tab === "work" && (
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
                                            <input type="file" accept=".mp3,.wav" className="hidden" onChange={async (e) => {
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
                                            }} />
                                            Upload Audio
                                        </label>
                                        <button
                                            onClick={() => setMediaLibraryState({
                                                isOpen: true,
                                                type: "audio",
                                                onSelect: (url) => {
                                                    const next = [...draft.work.projects];
                                                    next[idx] = { ...next[idx], audioSrc: url };
                                                    setDraft(d => ({ ...d, work: { ...d.work, projects: next } }));
                                                    setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                                }
                                            })}
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
                                            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
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
                                            }} />
                                            Upload Image
                                        </label>
                                        <button
                                            onClick={() => setMediaLibraryState({
                                                isOpen: true,
                                                type: "image",
                                                onSelect: (url) => {
                                                    const next = [...draft.work.projects];
                                                    next[idx] = { ...next[idx], artworkSrc: url };
                                                    setDraft(d => ({ ...d, work: { ...d.work, projects: next } }));
                                                    setMediaLibraryState(s => ({ ...s, isOpen: false }));
                                                }
                                            })}
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
            )}

            {tab === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter">Contact</h2>
                <div className="grid gap-2">
                  <label className="text-sm text-white/70">Headline</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                    value={draft.contact.headline}
                    onChange={(e) =>
                      setDraft({ ...draft, contact: { ...draft.contact, headline: e.target.value } })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-white/70">Email</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
                    value={draft.contact.email}
                    onChange={(e) =>
                      setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })
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
                              socials: { ...draft.contact.socials, instagram: e.target.value },
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
                              socials: { ...draft.contact.socials, youtube: e.target.value },
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
                              socials: { ...draft.contact.socials, spotify: e.target.value },
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
                              socials: { ...draft.contact.socials, soundcloud: e.target.value },
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
                              socials: { ...draft.contact.socials, twitter: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab !== "home" && tab !== "bio" && tab !== "work" && tab !== "contact" && (
              <div className="text-white/70">
                <p className="mb-2">This tab is scaffolded. Next steps:</p>
                <ul className="list-disc pl-6 space-y-1 text-white/60">
                  <li>Live: edit show dates list + ticket links.</li>
                </ul>
                <p className="mt-4 text-white/50 text-sm">
                  The site already reads from Firestore with fallbacks; we can expand these editors as needed.
                </p>
              </div>
            )}
          </main>
        </div>
      )}
      {mediaLibraryState.isOpen && (
        <MediaLibraryModal
          type={mediaLibraryState.type}
          onClose={() => setMediaLibraryState((s) => ({ ...s, isOpen: false }))}
          onSelect={(url) => mediaLibraryState.onSelect?.(url)}
        />
      )}
    </div>
  );
}
