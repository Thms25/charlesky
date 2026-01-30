"use cache";

import { cacheTag } from "next/cache";
import { getSiteContent } from "@/lib/site/server-content";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

export default async function PlaylistsPage() {
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
                <Radio className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{data.lab.playlists.headline}</h1>
                <p className="text-xl text-white/60 mt-2">What&apos;s spinning in the studio.</p>
            </div>
        </div>

        <div className="mt-12">
          <div className="space-y-8">
             {data.lab.playlists.items.length > 0 ? (
               <div className="grid gap-6">
                 {data.lab.playlists.items.map((item) => (
                   <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <div className="w-full overflow-hidden rounded-lg">
                        {item.embedUrl ? (
                           <iframe 
                             src={item.embedUrl} 
                             width="100%" 
                             height={item.platform === "spotify" ? "352" : "166"} 
                             frameBorder="0" 
                             allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                             loading="lazy"
                             className="w-full"
                             title={item.title}
                           ></iframe>
                        ) : (
                          <div className="h-40 bg-white/5 flex items-center justify-center text-white/30">
                            No embed URL provided
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
                <div className="text-center py-12 text-white/30 border border-white/10 rounded-xl bg-white/5">
                  No playlists added yet.
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
