import { notFound } from "next/navigation";
import { Headphones, Youtube, Radio, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AudioPlayer } from "@/components/AudioPlayer";

// Mock data for the pages (since we aren't pulling this from Admin yet)
const labData: Record<string, { title: string; desc: string; icon: any; content: React.ReactNode }> = {
  gear: {
    title: "Studio Gear",
    desc: "The analog soul of my sound.",
    icon: Headphones,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-400">Synthesizers</h3>
                <ul className="space-y-2 text-white/70">
                    <li>Moog Sub 37</li>
                    <li>Prophet 6</li>
                    <li>Roland Juno-106</li>
                    <li>Korg Minilogue XD</li>
                </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-400">Outboard</h3>
                <ul className="space-y-2 text-white/70">
                    <li>Universal Audio 1176LN</li>
                    <li>Warm Audio WA-2A</li>
                    <li>SSL Fusion</li>
                    <li>Neve 1073 Preamp</li>
                </ul>
            </div>
             <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-400">Monitoring</h3>
                <ul className="space-y-2 text-white/70">
                    <li>Focal Shape 65</li>
                    <li>Yamaha NS-10M</li>
                    <li>Sennheiser HD 600</li>
                </ul>
            </div>
        </div>
      </div>
    ),
  },
  tutorials: {
    title: "Tutorials",
    desc: "Sharing knowledge on production & mixing.",
    icon: Youtube,
    content: (
      <div className="space-y-8">
        <div className="aspect-video w-full bg-black/50 rounded-xl flex items-center justify-center border border-white/10">
            <p className="text-white/50">Latest tutorial placeholder</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1, 2, 3].map((i) => (
                 <div key={i} className="group cursor-pointer">
                     <div className="aspect-video bg-neutral-800 rounded-lg mb-3 overflow-hidden">
                        <div className="w-full h-full bg-red-900/20 group-hover:bg-red-900/40 transition-colors" />
                     </div>
                     <h4 className="font-bold">How to mix synthwave bass {i}</h4>
                     <p className="text-sm text-white/60">10 min • Production</p>
                 </div>
             ))}
        </div>
      </div>
    ),
  },
  playlists: {
    title: "Playlists",
    desc: "What's spinning in the studio.",
    icon: Radio,
    content: (
      <div className="space-y-8">
         <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <Radio className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Studio Vibes</h3>
            <p className="text-white/60 max-w-md mb-6">A curated selection of tracks that inspire my daily workflow. Synthwave, Retrowave, and Dark Pop.</p>
            <button className="px-6 py-3 bg-[#1DB954] text-black font-bold rounded-full hover:scale-105 transition">
                Listen on Spotify
            </button>
         </div>
      </div>
    ),
  },
};

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = labData[slug];

  if (!data) {
    notFound();
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-white/50 hover:text-white transition mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-white/10 rounded-full">
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{data.title}</h1>
                <p className="text-xl text-white/60 mt-2">{data.desc}</p>
            </div>
        </div>

        <div className="mt-12">
            {data.content}
        </div>
      </div>
    </div>
  );
}
