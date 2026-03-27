'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const isLoggedIn = !!user
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const username =
    typeof user?.user_metadata?.username === 'string' && user.user_metadata.username.trim().length > 0
      ? user.user_metadata.username.trim()
      : user?.email?.split('@')[0] ?? 'User'
  const email = user?.email ?? ''

  const navLinkClass = (path: string) =>
    `relative inline-flex items-center pb-1 text-base font-medium transition-colors ${
      pathname === path
        ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-slate-900'
        : 'text-gray-600 hover:text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-slate-900 after:transition-transform after:duration-200 hover:after:scale-x-100'
    }`

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left: Logo + Nav links */}
        <div className="flex min-w-0 items-center gap-5 sm:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2.5" fill="white" />
                <line x1="7" y1="1" x2="7" y2="3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="7" y1="10.5" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="7" x2="3.5" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10.5" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-base font-semibold text-blue-600">Trippa</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/map" className={navLinkClass('/map')}>Map</Link>
            <Link href="/location" className={navLinkClass('/location')}>Location</Link>
            {isLoggedIn && (
              <Link href="/saved" className={navLinkClass('/saved')}>Saved</Link>
            )}
          </div>
        </div>

        {/* Right: Auth area — hidden while loading to prevent flash */}
        {!loading && (
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {isLoggedIn ? (
              <>
                {/* Heart icon (placeholder — feature coming soon) */}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
                  aria-label="Favourites"
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-400 text-gray-500 transition-colors hover:border-gray-600 hover:text-gray-800"
                    aria-label="Profile"
                    title="Profile"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full z-20 mt-3 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
                      <div className="border-b border-gray-100 px-1 pb-3">
                        <p className="text-sm font-semibold text-slate-900">{username}</p>
                        <p className="mt-1 break-all text-sm text-gray-500">{email}</p>
                      </div>

                      <button
                        onClick={async () => {
                          setIsProfileMenuOpen(false)
                          await signOut()
                        }}
                        className="mt-3 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  )
}
