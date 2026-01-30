"use client";

import { useEffect, useState } from "react";
import { getDownloadURL, ref, listAll, type StorageReference } from "firebase/storage";
import { X, Music } from "lucide-react";
import { firebaseStorage } from "@/lib/firebase/client";

export function MediaLibraryModal({
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
