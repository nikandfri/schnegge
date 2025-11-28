'use client'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

function ScrollImage({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.3, 1])
  
  return (
    <div ref={ref} className="w-full h-full overflow-hidden relative">
      <motion.img
        src="/schnegge1.JPG"
        alt="Schnegge"
        className="object-cover absolute inset-0"
        style={{ 
          scale,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}

function ScrollContent({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end start"]
  })
  
  // Text tracks picture's top edge as it grows, then continues scrolling down
  const pictureScale = useTransform(scrollYProgress, [0, 0.6], [0.3, 1])
  
  const y = useTransform(scrollYProgress, (progress) => {
    if (progress <= 0.6) {
      // First phase: move up to track picture's top edge (0 to 0.6)
      const scale = 0.3 + (progress / 0.6) * 0.7
      const pictureTopPercent = 50 - (scale * 50)
      const offsetPercent = 50 - pictureTopPercent
      const movePixels = (offsetPercent / 100) * 640
      return -Math.min(movePixels, 320)
    } else if (progress <= 0.85) {
      // Second phase: stay at top (0.6 to 0.85)
      return -320
    } else {
      // Third phase: scroll down as next row approaches (0.85 to 1.0)
      const scrollDownProgress = (progress - 0.85) / 0.15
      // Move from top (-320px) back toward center (0px)
      return -320 + (scrollDownProgress * 320)
    }
  })
  
  return (
    <div ref={ref} className="w-full h-full overflow-hidden relative">
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          className="w-full"
          style={{ 
            y,
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
  ]

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [heroMouseX, setHeroMouseX] = useState(0)
  const footerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Only update if mouse is within footer bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setMousePosition({ x, y })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleHeroMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        // Normalize mouse position (0 to 1)
        const normalizedX = x / rect.width
        // Calculate offset (-1 to 1, center is 0)
        const offset = (normalizedX - 0.5) * 2
        setHeroMouseX(offset)
      }
    }

    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleHeroMouseMove)
      heroRef.current.addEventListener('mouseleave', () => setHeroMouseX(0))
    }

    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleHeroMouseMove)
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 bg-black dark:bg-white">
        <nav aria-label="Global" className="mx-auto grid max-w-7xl grid-cols-3 items-center p-6 lg:px-8">
          <div className="flex">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Schnegge</span>
              <img
                alt="Schnegge"
                src="/schnegge2.svg"
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white dark:text-gray-200 lg:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white dark:text-gray-900">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <a href="#" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white dark:text-gray-900">
              <span className="sr-only">Instagram</span>
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Schnegge</span>
                <img 
                  alt="Schnegge"
                  src="/schnegge2.svg"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
        </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      
      <main className="">
        <section className="hero" aria-label="Hero section">
          <div ref={heroRef} className="relative isolate overflow-hidden pt-14">
          <div className="absolute inset-0 -z-10 w-full overflow-hidden bg-black">
            <motion.div 
              className="grid grid-cols-24 grid-rows-1 h-full w-[150%]"
              style={{
                left: '-25%',
              }}
              animate={{
                x: -heroMouseX * 30,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.5,
              }}
            >
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className={index % 2 === 0 ? "bg-blue-300" : "bg-black"}
                />
              ))}
            </motion.div>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl pt-8 pb-32 sm:pt-0 sm:pb-20 lg:pt-0 lg:pb-20">
              <div className="text-center">
                <h1 className="text-balance text-9xl font-bold tracking-tight text-white sm:text-8xl dark:text-white">
                  SCHNEGGEN IS A PEOPLE BUSINESS!
                </h1>
                <img
                  alt="Schnegge"
                  src="/schnegge.svg"
                  className="mx-auto mt-0 h-32 w-auto sm:h-40 lg:h-48"
                />
              </div>
              
              {/* Randomly placed images */}
              <div className="relative mt-16 h-96">
                <img
                  alt="Schnegge"
                  src="/schnegge1.JPG"
                  className="absolute top-20 left-20 w-48 rounded-lg shadow-lg"
                />
                <img
                  alt="Schnegge"
                  src="/schnegge2.JPG"
                  className="absolute top-32 right-20 w-56 rounded-lg shadow-lg"
                />
                <img
                  alt="Business meeting"
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop"
                  className="absolute bottom-10 left-1/3 w-52 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
        </section>
        
        <section className="products bg-black " aria-label="Products section">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          </div>
          <div className="grid grid-cols-3 w-full">
            {Array.from({ length: 12 }).map((_, index) => {
              const col = index % 3;
              const isFirstCol = col === 0;
              const isLastCol = col === 2;
              const isMiddleItem = index === 1 || index === 4 || index === 7 || index === 10;
              const isSideItem = !isMiddleItem && (index === 0 || index === 2 || index === 3 || index === 5 || index === 6 || index === 8 || index === 9 || index === 11);
              
              return (
                <div 
                  key={index} 
                  className={`border-t border-b border-white bg-black w-full h-[80vh] -m-[1px] relative ${
                    !isFirstCol ? 'border-l border-white' : ''
                  } ${!isLastCol ? 'border-r border-white' : ''}`}
                >
                  {isMiddleItem ? (
                    <ScrollImage index={index} />
                  ) : isSideItem ? (
                    <ScrollContent index={index}>
                      <p className="text-center text-white">Product {index + 1}</p>
                    </ScrollContent>
                  ) : (
                    <p className="text-center text-white">Product {index + 1}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      
      <footer ref={footerRef} className="bg-black h-screen flex flex-col relative overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-5xl font-semibold text-white text-center sm:text-7xl">
            a match made in heaven
          </h2>
        </div>
        <div className="h-1/3 w-1/3 flex flex-col">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              className="flex-1 border-t border-b border-r border-white flex items-center justify-start px-8"
            >
              <p className="text-white text-left">Item {index + 1}</p>
            </div>
          ))}
        </div>
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-blue-300 opacity-50 mix-blend-difference cursor-pointer"
          animate={{
            x: mousePosition.x - 128 - 40,
            y: mousePosition.y - 128 - 40,
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 50,
              damping: 30,
              mass: 1,
            },
            y: {
              type: "spring",
              stiffness: 50,
              damping: 30,
              mass: 1,
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </footer>
    </div>
  );
}
