"use cache";

import { cacheTag } from "next/cache";
import { getSiteContent } from "@/lib/site/server-content";
import Link from "next/link";
import { ArrowLeft, Youtube, ExternalLink } from "lucide-react";
import Image from "next/image";

function getYoutubeEmbedUrl(url: string) {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default async function TutorialsPage() {
  cacheTag("site-content");
  const data = await getSiteContent();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-white/50 hover:text-white transition mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-white/10 rounded-full">
                <Youtube className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{data.lab.tutorials.headline}</h1>
                <p className="text-xl text-white/60 mt-2">Sharing knowledge on production & mixing</p>
            </div>
        </div>

        <div className="mt-12">
            {data.lab.tutorials.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.lab.tutorials.items.map((item) => {
                        const embedUrl = getYoutubeEmbedUrl(item.videoUrl);
                        
                        return (
                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition flex flex-col">
                                <div className="aspect-video w-full bg-black relative">
                                    {embedUrl ? (
                                        <iframe
                                            src={embedUrl}
                                            title={item.title}
                                            className="w-full h-full absolute inset-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : item.thumbnailSrc ? (
                                        <div className="relative w-full h-full">
                                            <Image 
                                                src={item.thumbnailSrc} 
                                                alt={item.title}
                                                fill
                                                className="object-cover opacity-60 group-hover:opacity-80 transition"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Youtube className="w-12 h-12 text-white/80 drop-shadow-lg" />
                                            </div>
                                        </div>
                                    ) : (
                                         <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                            <Youtube className="w-12 h-12" />
                                         </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-sm text-white/60 line-clamp-3 mb-4 flex-1">{item.description}</p>
                                    )}
                                    <a 
                                        href={item.videoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-xs font-bold text-white/50 hover:text-white uppercase tracking-wider transition mt-auto"
                                    >
                                        Watch on YouTube <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="text-center py-12 text-white/30 border border-white/10 rounded-xl bg-white/5">
                  No tutorials added yet.
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
