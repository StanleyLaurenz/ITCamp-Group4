import Link from 'next/link'

/**
 * Hero section — same layout for both guest and logged-in users.
 *
 * Background image: place your Singapore skyline photo at
 *   apps/web/public/hero-bg.jpg
 * and it will be picked up automatically. Until then a blue gradient
 * is used as a fallback.
 */
export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] w-full items-center overflow-hidden bg-cover bg-[68%_center] bg-no-repeat"
      style={{
        backgroundImage:
          "url('/hero-bg.jpg'), linear-gradient(135deg, #1a3a5c 0%, #2d6a8a 60%, #3a8fa8 100%)",
      }}
    >
      {/* Dark gradient overlay — heavier on the left so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-950/48 to-slate-900/10" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mb-5 text-4xl font-bold leading-tight text-cyan-400 sm:text-5xl lg:text-6xl">
            Ever Feel Worried Navigating Around Singapore?
          </h1>

          <p className="mb-4 max-w-xl text-base leading-relaxed text-white sm:text-lg">
            No worries — Trippa has you covered.
            <br />
            Check real-time weather updates, taxi availability, and explore top tourist
            attractions — all without creating an account.
          </p>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-white sm:text-lg">
            You can also sign-up for a free account to save locations and personalise your
            experience.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/location"
              className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Locations
            </Link>
            <Link
              href="/map"
              className="rounded border border-white px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Map
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
