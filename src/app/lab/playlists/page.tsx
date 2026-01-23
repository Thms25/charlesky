import { ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";

export default function page() {
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
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Playlists</h1>
                <p className="text-xl text-white/60 mt-2">What&apos;s spinning in the studio.</p>
            </div>
        </div>

        <div className="mt-12">
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
        </div>
      </div>
    </div>
  )
}
