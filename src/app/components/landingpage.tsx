'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
    id: string;
    name: string;
    email: string;
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('')
  const [user, setUser] = useState<User | null>(null) // Added type annotation
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()

  // Fetch user details from API
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'how-it-works', 'testimonials']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveNavItem(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white overflow-hidden">
      {/* Dotted background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      <header className="relative z-20 container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          <h1 className="font-extrabold font-mono inline-flex items-center text-4xl">
    <span className="bg-gradient-to-bl from-blue-500 to-purple-600 bg-clip-text text-transparent">
      Cracke
    </span>
    <Image
      src="/cracked.png"
      width={15}
      height={15}
      alt="fuzzie logo"
      className="shadow-sm mx-0.5 -mb-1"
    />
    <span 
      className="relative bg-gradient-to-bl from-blue-500 to-purple-600 bg-clip-text text-transparent"
      style={{ 
        transform: 'rotate(12deg)',
        transformOrigin: 'bottom left',
        display: 'inline-block'
      }}
    >
      d
    </span>
  </h1>
        </motion.div>
        <nav className="hidden md:flex rounded-full bg-black  space-x-4">
          {['features', 'how-it-works', 'testimonials'].map((item) => (
            <Link key={item} href={`#${item}`}>
              <motion.div
                className={`relative px-4 py-2 rounded-full transition-colors ${
                  activeNavItem === item ? 'text-purple-300' : 'hover:text-purple-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {activeNavItem === item && (
                  <motion.div
                    className="absolute inset-0 bg-purple-700 rounded-full -z-10"
                    layoutId="bubble"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block"
        >
          {user ? (
            <div className="relative">
              <Button
                variant="outline"
                className="bg-purple-700 text-white border-purple-500 hover:bg-purple-600"
                onClick={handleUserMenuToggle}
              >
                {user.name} {/* Fixed: Changed from User.name to user.name */}
              </Button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-purple-700 text-white rounded-lg shadow-lg">
                  <Link href="/dashboard">
                    <div className="px-4 py-2 hover:bg-purple-600">Dashboard</div>
                  </Link>
                  <Link href="/settings">
                    <div className="px-4 py-2 hover:bg-purple-600">Settings</div>
                  </Link>
                  <button className="w-full px-4 py-2 hover:bg-purple-600">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="bg-purple-700 text-white border-purple-500 hover:bg-purple-600"
              onClick={() => router.push('/auth')}
            >
              Get Started
            </Button>
          )}
        </motion.div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-purple-900 z-10"
          >
            <nav className="flex flex-col items-center py-4">
              {['features', 'how-it-works', 'testimonials'].map((item) => (
                <Link key={item} href={`#${item}`} onClick={() => setIsMenuOpen(false)}>
                  <motion.div
                    className="px-4 py-2 w-full text-center"
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </motion.div>
                </Link>
              ))}
              <Button
                variant="outline"
                className="bg-purple-700 text-white border-purple-500 hover:bg-purple-600"
                onClick={() => router.push('/auth')}
              >
                Get Started
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            Unleash Your Potential with Data-Driven Growth
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-purple-200"
          >
            Become unstoppable and elevate your performance by focusing on yourself through our powerful goal-tracking dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg" onClick={() => router.push('/auth')}>
              Start Tracking Now <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  )
}