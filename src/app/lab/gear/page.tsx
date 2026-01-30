"use cache";

import { cacheTag } from "next/cache";
import { getSiteContent } from "@/lib/site/server-content";
import Link from "next/link";
import { Headphones, ArrowLeft } from "lucide-react";

export default async function GearPage() {
  cacheTag("site-content");
  const data = await getSiteContent();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-white/50 hover:text-white transition mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-white/10 rounded-full">
                <Headphones className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{data.lab.gear.headline}</h1>
                <p className="text-xl text-white/60 mt-2">The analog soul of my sound.</p>
            </div>
        </div>

        <div className="mt-12">
          <div className="space-y-8">
            {data.lab.gear.sections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.lab.gear.sections.map((section) => (
                  <div key={section.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-orange-400">{section.title}</h3>
                    {section.items.length > 0 ? (
                      <ul className="space-y-3 text-white/70">
                        {section.items.map((item) => (
                          <li key={item.id} className="space-y-1">
                            <div className="font-medium text-white/90">{item.name}</div>
                            {item.description && (
                              <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/30 italic text-sm">No items yet.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/30 border border-white/10 rounded-xl bg-white/5">
                No gear sections added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
