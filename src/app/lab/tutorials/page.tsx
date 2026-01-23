import { ArrowLeft, Youtube } from "lucide-react";
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
                <Youtube className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Tutorials</h1>
                <p className="text-xl text-white/60 mt-2">Sharing knowledge on production & mixing</p>
            </div>
        </div>

        <div className="mt-12">
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
        </div>
      </div>
    </div>
  )
}
