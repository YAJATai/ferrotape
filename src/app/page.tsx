'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Demo mode
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main ref={containerRef} className="relative h-[600vh] bg-[#050508]">
      {/* 3D Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Scene />
      </div>
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
          style={{ width: useScroll({ target: containerRef }).scrollYProgress, scaleX: scrollYProgress }}
        />
      </div>
      
      {/* TEXT OVERLAYS */}
      <div className="relative z-10">
        
        {/* SCENE 1: HERO */}
        <section className="h-screen flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-6">
              Introducing
            </p>
            <h1 className="text-8xl md:text-[10rem] font-thin tracking-tighter text-white leading-none">
              FERROO
            </h1>
            <h1 className="text-8xl md:text-[10rem] font-thin tracking-tighter text-white leading-none -mt-4 md:-mt-8">
              TAPE
            </h1>
            <p className="text-2xl md:text-3xl mt-10 text-gray-300 font-light tracking-wide">
              Protect airflow. Block dust.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-16"
          >
            <div className="w-px h-20 bg-gradient-to-b from-cyan-500 to-transparent mx-auto animate-pulse"></div>
            <p className="text-xs text-gray-500 mt-4 uppercase tracking-[0.3em]">Scroll to explore</p>
          </motion.div>
        </section>
        
        {/* SCENE 2: MACRO */}
        <section className="h-screen flex items-center justify-start px-8 md:px-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="max-w-xl"
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-8">
              Engineered<br />
              <span className="text-cyan-300">breathable mesh.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Ultra-fine precision mesh allows air to flow freely while blocking 
              99.7% of dust particles. Every fiber engineered for perfection.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="px-4 py-2 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                99.7% Dust Block
              </div>
              <div className="px-4 py-2 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                0% Airflow Loss
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* SCENE 3: LAPTOP REVEAL */}
        <section className="h-screen flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="max-w-xl text-right"
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-8">
              Designed for<br />
              <span className="text-cyan-300">bottom vents.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Every laptop has a ventilation zone on the bottom. 
              Ferroo Tape protects exactly where it matters most.
            </p>
            <div className="mt-8 flex gap-4 justify-end">
              <div className="px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-400 text-sm">
                Universal Fit
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* SCENE 4-5: UNROLL & ALIGNMENT */}
        <section className="h-screen flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-6">
              Align. Apply. <span className="text-green-400">Protect.</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Magnetic precision alignment in seconds. No tools. No hassle.
            </p>
          </motion.div>
        </section>
        
        {/* SCENE 6: INSTALLATION */}
        <section className="h-screen flex items-center justify-start px-8 md:px-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="max-w-xl"
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-8">
              Apply in <span className="text-green-400">seconds.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Peel, align, and press. The adhesive ripple ensures 
              a perfect seal every time. No tools required.
            </p>
          </motion.div>
        </section>
        
        {/* SCENE 7: DUST DEFENSE */}
        <section className="h-screen flex items-center justify-end px-8 md:px-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="max-w-xl text-right"
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-8">
              Dust blocked.<br />
              <span className="text-green-400">Air preserved.</span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Watch as dust particles collide with the mesh and deflect away, 
              while clean airflow continues uninterrupted.
            </p>
          </motion.div>
        </section>
        
        {/* SCENE 8: FINAL CTA */}
        <section className="h-screen flex flex-col items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="text-center max-w-3xl"
          >
            <h2 className="text-6xl md:text-8xl font-thin text-white mb-2">
              Ferroo Tape
            </h2>
            <p className="text-3xl text-cyan-400 mb-4">
              Engineered Protection
            </p>
            <p className="text-xl text-gray-400 mb-12">
              Cleaner fans. Longer life. Zero hassle.
            </p>
            
            {/* CTA BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-14 py-6 bg-white text-black text-xl font-medium rounded-full hover:bg-cyan-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Get Early Access
            </motion.button>
            
            {/* NEWSLETTER */}
            <div className="mt-16">
              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-xl"
                >
                  ✓ You're on the list!
                </motion.p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-8 py-4 bg-gray-900/80 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 w-80 backdrop-blur"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-full transition-all"
                  >
                    Notify Me
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
          
          {/* FOOTER */}
          <footer className="absolute bottom-8 text-center text-gray-600 text-sm">
            <p>© 2026 Ferroo Tape. All rights reserved.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
