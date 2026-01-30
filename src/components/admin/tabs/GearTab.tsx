"use client";

import { Plus, Trash2, ArrowUp, ArrowDown, ChevronRight, ChevronDown } from "lucide-react";
import { AdminTabProps } from "../types";
import { SiteContent } from "@/lib/site/content";
import { useState } from "react";

export function GearTab({ draft, setDraft, uploadFile, deleteFile, setMediaLibraryState }: AdminTabProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tighter">Gear</h2>
        <button
          onClick={() => {
            const newSection = {
              id: crypto.randomUUID(),
              title: "New Section",
              items: [],
            };
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                gear: {
                  ...draft.lab.gear,
                  sections: [newSection, ...draft.lab.gear.sections],
                },
              },
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Headline</label>
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
          value={draft.lab.gear.headline}
          onChange={(e) =>
            setDraft({
              ...draft,
              lab: {
                ...draft.lab,
                gear: { ...draft.lab.gear, headline: e.target.value },
              },
            })
          }
        />
      </div>

      <div className="space-y-8 mt-8">
        {draft.lab.gear.sections.map((section, sIdx) => (
          <div key={section.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-5 h-5 text-white/50" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/50" />
                )}
                <input
                  className="bg-transparent text-xl font-bold outline-none placeholder:text-white/30 w-full"
                  value={section.title}
                  placeholder="Section Title"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    const nextSections = [...draft.lab.gear.sections];
                    nextSections[sIdx] = { ...nextSections[sIdx], title: e.target.value };
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        gear: { ...draft.lab.gear, sections: nextSections },
                      },
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    if (sIdx === 0) return;
                    const next = [...draft.lab.gear.sections];
                    [next[sIdx - 1], next[sIdx]] = [next[sIdx], next[sIdx - 1]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        gear: { ...draft.lab.gear, sections: next },
                      },
                    });
                  }}
                  disabled={sIdx === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (sIdx === draft.lab.gear.sections.length - 1) return;
                    const next = [...draft.lab.gear.sections];
                    [next[sIdx], next[sIdx + 1]] = [next[sIdx + 1], next[sIdx]];
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        gear: { ...draft.lab.gear, sections: next },
                      },
                    });
                  }}
                  disabled={sIdx === draft.lab.gear.sections.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                  onClick={() => {
                    if (!confirm("Delete this entire section?")) return;
                    const next = draft.lab.gear.sections.filter((_, i) => i !== sIdx);
                    setDraft({
                      ...draft,
                      lab: {
                        ...draft.lab,
                        gear: { ...draft.lab.gear, sections: next },
                      },
                    });
                  }}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedSections.includes(section.id) && (
              <div className="p-6 pt-0 border-t border-white/10 mt-6 space-y-4">
              {section.items.map((item, iIdx) => (
                <div key={item.id} className="rounded-xl bg-black/20 p-4 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white/50 text-xs font-mono">Item {iIdx + 1}</p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (iIdx === 0) return;
                          const nextSections = [...draft.lab.gear.sections];
                          const nextItems = [...nextSections[sIdx].items];
                          [nextItems[iIdx - 1], nextItems[iIdx]] = [nextItems[iIdx], nextItems[iIdx - 1]];
                          nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                          setDraft({
                            ...draft,
                            lab: {
                              ...draft.lab,
                              gear: { ...draft.lab.gear, sections: nextSections },
                            },
                          });
                        }}
                        disabled={iIdx === 0}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (iIdx === section.items.length - 1) return;
                          const nextSections = [...draft.lab.gear.sections];
                          const nextItems = [...nextSections[sIdx].items];
                          [nextItems[iIdx], nextItems[iIdx + 1]] = [nextItems[iIdx + 1], nextItems[iIdx]];
                          nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                          setDraft({
                            ...draft,
                            lab: {
                              ...draft.lab,
                              gear: { ...draft.lab.gear, sections: nextSections },
                            },
                          });
                        }}
                        disabled={iIdx === section.items.length - 1}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("Remove this item?")) return;
                          const nextSections = [...draft.lab.gear.sections];
                          nextSections[sIdx] = {
                            ...nextSections[sIdx],
                            items: section.items.filter((_, i) => i !== iIdx),
                          };
                          setDraft({
                            ...draft,
                            lab: {
                              ...draft.lab,
                              gear: { ...draft.lab.gear, sections: nextSections },
                            },
                          });
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-white/50">Name</label>
                    <input
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none text-sm"
                      value={item.name}
                      onChange={(e) => {
                        const nextSections = [...draft.lab.gear.sections];
                        const nextItems = [...nextSections[sIdx].items];
                        nextItems[iIdx] = { ...nextItems[iIdx], name: e.target.value };
                        nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                        setDraft({
                          ...draft,
                          lab: {
                            ...draft.lab,
                            gear: { ...draft.lab.gear, sections: nextSections },
                          },
                        });
                      }}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label className="text-xs text-white/50">Description</label>
                    <textarea
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 outline-none text-sm min-h-16"
                      value={item.description || ""}
                      onChange={(e) => {
                        const nextSections = [...draft.lab.gear.sections];
                        const nextItems = [...nextSections[sIdx].items];
                        nextItems[iIdx] = { ...nextItems[iIdx], description: e.target.value };
                        nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                        setDraft({
                          ...draft,
                          lab: {
                            ...draft.lab,
                            gear: { ...draft.lab.gear, sections: nextSections },
                          },
                        });
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-white/50">Image</label>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition text-xs">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              try {
                                const url = await uploadFile(f, "image");
                                const nextSections = [...draft.lab.gear.sections];
                                const nextItems = [...nextSections[sIdx].items];
                                nextItems[iIdx] = { ...nextItems[iIdx], imageSrc: url };
                                nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                                setDraft({
                                  ...draft,
                                  lab: {
                                    ...draft.lab,
                                    gear: { ...draft.lab.gear, sections: nextSections },
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
                                const nextSections = [...draft.lab.gear.sections];
                                const nextItems = [...nextSections[sIdx].items];
                                nextItems[iIdx] = { ...nextItems[iIdx], imageSrc: url };
                                nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                                setDraft((d: SiteContent) => ({
                                  ...d,
                                  lab: {
                                    ...d.lab,
                                    gear: { ...d.lab.gear, sections: nextSections },
                                  },
                                }));
                                setMediaLibraryState((s) => ({ ...s, isOpen: false }));
                              },
                            })
                          }
                          className="px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition text-xs text-white/70"
                        >
                          Select
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/50 truncate mb-1">{item.imageSrc || "No image"}</p>
                        {item.imageSrc && (
                          <button
                            onClick={async () => {
                              if (!confirm("Remove this image?")) return;
                              await deleteFile(item.imageSrc!);
                              const nextSections = [...draft.lab.gear.sections];
                              const nextItems = [...nextSections[sIdx].items];
                              nextItems[iIdx] = { ...nextItems[iIdx], imageSrc: "" };
                              nextSections[sIdx] = { ...nextSections[sIdx], items: nextItems };
                              setDraft({
                                ...draft,
                                lab: {
                                  ...draft.lab,
                                  gear: { ...draft.lab.gear, sections: nextSections },
                                },
                              });
                            }}
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                   const newItem = {
                    id: crypto.randomUUID(),
                    name: "New Item",
                    description: "",
                    imageSrc: "",
                  };
                  const nextSections = [...draft.lab.gear.sections];
                  nextSections[sIdx] = {
                    ...nextSections[sIdx],
                    items: [...nextSections[sIdx].items, newItem],
                  };
                  setDraft({
                    ...draft,
                    lab: {
                      ...draft.lab,
                      gear: { ...draft.lab.gear, sections: nextSections },
                    },
                  });
                }}
                className="w-full py-2 border-2 border-dashed border-white/10 rounded-xl text-white/40 hover:text-white/70 hover:border-white/20 transition text-sm font-medium"
              >
                + Add Item
              </button>
            </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
