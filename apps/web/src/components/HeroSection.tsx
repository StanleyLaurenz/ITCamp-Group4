import Link from "next/link";
import { MapPin, Navigation, Shield, Zap } from "react-feather";

/**
 * Enhanced Hero Section
 * Uses the Space Grotesk font family established in tailwind.config.ts
 * and brand colors like #1572D3 used in the search and location components.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center overflow-hidden bg-slate-950">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
        }}
      />
      {/* Gradients to ensure text readability against any image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1572D3]/10 border border-[#1572D3]/20 text-[#1572D3] text-xs font-bold tracking-widest uppercase">
              <Shield size={14} />
              Singapore Travel Partner
            </div>

            <h1 className="text-5xl font-black italic tracking-tighter text-white leading-[1.25] ">
              Navigate <span className="text-[#1572D3]"> Singapore</span>
              <br />
              With Confidence.
            </h1>

            <div className="space-y-4 max-w-md">
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Stop worrying about navigating the Lion City. Trippa provides
                <span className="text-white"> real-time updates</span> and
                <span className="text-white"> interactive guides</span> for an
                effortless experience.
              </p>
              <p className="text-slate-500 text-sm italic">
                Explore weather, taxi availability, and top attractions
                instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/location"
                className="group flex items-center gap-3 px-8 py-4 bg-[#1572D3] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-[#1572D3]/40 hover:bg-[#125ba8] transition-all active:scale-95"
              >
                Locations
                <Navigation
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/map"
                className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
              >
                Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
