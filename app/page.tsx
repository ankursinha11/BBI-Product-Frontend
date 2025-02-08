'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, Eye, Scale, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-[#000B2E] via-[#001959] to-[#000B2E]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#000B2E] border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BBI_Logo_White-B1geXfwkPqABQuJWmxC14tT8vx6ueV.png" 
            alt="BBi Logo" 
            width={120} 
            height={48}
            className="h-10 w-auto transform hover:scale-105 transition-transform duration-300"
          />
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              className="text-white border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#000B2E]/50 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 font-display mb-6 drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              ABC Framework
              <span className="block text-4xl md:text-5xl mt-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-bold">
                Overview
              </span>
            </motion.h1>
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto font-semibold"
            >
              A comprehensive approach to data management and control, reimagined for the future
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ArrowDown className="w-12 h-12 mx-auto animate-bounce text-white/50" />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwQjJFIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMwMDE5NTkiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-5"></div>
        </motion.section>

        {/* ABC Sections */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid gap-16">
              {/* Audit Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_rgba(0,0,0,0.5)] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500">
                          <Eye className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Audit</h2>
                      </div>
                      <ul className="space-y-4 text-blue-100/90">
                        {[
                          'Audits provide traceability of data and processes',
                          'Process version tracking',
                          'Start and end times monitoring',
                          'Record count tracking (Input, Rejected, Output)',
                          'Certification and authority management'
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="text-blue-400 mr-2">•</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-white/10 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        Data Record Tracking
                      </h3>
                      <ul className="space-y-4 text-blue-100/90">
                        {[
                          'Process creation tracking',
                          'Update history',
                          'Timestamp logging'
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center"
                          >
                            <span className="text-blue-400 mr-3">✓</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Balance Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center">
                          <Scale className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold text-white">Balance</h2>
                      </div>
                      <ul className="space-y-4 text-green-100/90">
                        {["Verifies proper dataset processing",
                         "Independent comparison checks",
                         "Lost record detection",
                         "Computation error checking",
                         "Quality confirmation for data and processes"].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="text-blue-400 mr-2">•</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-white/10 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        Quality Assurance
                      </h3>
                      <ul className="space-y-4 text-blue-100/90">
                        {[
                          'Data integrity checks',
                          'Process validation',
                          'Reconciliation assurance'
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center"
                          >
                            <span className="text-blue-400 mr-3">✓</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Control Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
                  <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center">
                          <Settings className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold text-white">Control</h2>
                      </div>
                      <ul className="space-y-4 text-red-100/90">
                        {["Workflow management system", "Process scheduling", "Exception handling", "Notification management",
                         "Recovery procedures"].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="text-blue-400 mr-2">•</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-white/10 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <h3 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      Process Management
                      </h3>
                      <ul className="space-y-4 text-blue-100/90">
                        {[
                          'Automated workflows',
                          'Exception notifications',
                          'Job restart capabilities'
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center"
                          >
                            <span className="text-blue-400 mr-3">✓</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.3)]"
            >
              <h2 
                className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Transform Your Data Management
              </h2>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-lg px-8 py-6"
                >
                  Access Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Image 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BBI_Logo_White-B1geXfwkPqABQuJWmxC14tT8vx6ueV.png" 
                alt="BBi Logo" 
                width={150} 
                height={60}
                className="h-12 w-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-blue-200/50 mb-2">
                © {new Date().getFullYear()} BBi Engineering. All rights reserved.
              </p>
              <div className="flex justify-center md:justify-end space-x-6">
                {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="text-blue-200/70 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

