import Link from "next/link";
import { Headphones, ArrowLeft } from "lucide-react";

export default function LabePageContent() {
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
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Studio Gear</h1>
                <p className="text-xl text-white/60 mt-2">The analog soul of my sound.</p>
            </div>
        </div>

        <div className="mt-12">
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
        </div>
      </div>
    </div>
  )
}
