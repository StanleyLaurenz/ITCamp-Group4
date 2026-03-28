import Link from "next/link";
import { MapPin, Navigation, Shield, Zap } from "react-feather";

/**
 * Responsive Enhanced Hero Section
 * Fully optimized for Mobile, Tablet, and Desktop.
 */
export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full flex items-center overflow-hidden bg-slate-950">
      {/* Background - Center on mobile, Right-aligned on desktop for better text contrast */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-[center_top] lg:bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
        }}
      />

      {/* Mobile Overlay: Darker overall to ensure text stands out.
        Desktop Overlay: Gradient from left.
      */}
      <div className="absolute inset-0 z-10 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/80 lg:to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Wrapper - Centered on mobile, Left-aligned on desktop */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-8 lg:slide-in-from-left-8 duration-1000">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1572D3]/20 backdrop-blur-md border border-[#1572D3]/30 text-[#1572D3] text-[10px] lg:text-xs font-bold tracking-widest uppercase">
              <Shield size={14} />
              Singapore Travel Partner
            </div>

            {/* Headline - Responsive Text Sizes */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black italic tracking-tighter text-white leading-[1.1] lg:leading-[1.25]">
              Navigate <span className="text-[#1572D3]">Singapore</span>
              <br className="hidden sm:block" />
              <span className="sm:inline"> With Confidence.</span>
            </h1>

            {/* Descriptions */}
            <div className="space-y-4 max-w-sm sm:max-w-md">
              <p className="text-slate-300 lg:text-slate-400 text-base lg:text-lg font-medium leading-relaxed">
                Stop worrying about navigating the Lion City. Trippa provides
                <span className="text-white font-bold">
                  {" "}
                  real-time updates
                </span>{" "}
                and
                <span className="text-white font-bold">
                  {" "}
                  interactive guides
                </span>{" "}
                for an effortless experience.
              </p>
              <p className="hidden sm:block text-slate-400 text-sm italic">
                Explore weather, taxi availability, and top attractions
                instantly.
              </p>
            </div>

            {/* Buttons - Stacked on mobile, side-by-side on desktop */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                href="/location"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-[#1572D3] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-[#1572D3]/40 hover:bg-[#125ba8] transition-all active:scale-95"
              >
                Locations
                <Navigation
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/map"
                className="flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all"
              >
                View Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
