'use client';

import { motion } from 'framer-motion';
import { Diamond, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } }
};

export default function AboutPage() {
  return (
    <div className="bg-white pt-24 md:pt-28">
      {/* Hero Narrative */}
      <section className="px-6 md:px-12 py-12 md:py-20 border-b border-zinc-100">
        <div className="max-w-[1400px] mx-auto text-center">
           <motion.span 
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1.5 }}
              className="text-[10px] md:text-xs font-black uppercase text-accent mb-8 block"
           >
              The ElvaEdit Story
           </motion.span>
           <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl md:text-8xl font-light uppercase tracking-tight leading-[0.9] text-zinc-900 mb-12"
           >
              Crafting <br /> <span className="font-italic-none italic-none text-accent">Timeless</span> Mastery
           </motion.h1>
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto text-zinc-500 text-base md:text-lg leading-relaxed font-medium"
           >
              ElvaEdit is a Pakistan based jewellery brand which was founded in 2026. Committed to create trendy, luxury and timeless pieces at an affordable price without compromising the quality or sustainability.
           </motion.p>
        </div>
      </section>

      {/* Visual Storytelling */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
           <motion.div 
             initial="hidden"
             whileInView="visible"
             variants={sectionVariants}
             viewport={{ once: false }}
             className="relative aspect-[4/5] bg-zinc-100 overflow-hidden group rounded-2xl"
           >
              <img 
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=100&w=2560&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10" />
           </motion.div>
           
           <div className="space-y-12">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                viewport={{ once: false }}
                className="space-y-6"
              >
                 <h2 className="text-3xl md:text-4xl font-light uppercase tracking-wide text-zinc-900">Boutique Philosophy</h2>
                 <p className="text-zinc-500 leading-relaxed text-base font-medium opacity-80">
                   We believe every piece of jewellery carries a personality – a silent narrative of craftsmanship and soul. At Editeval, each collection is curated to reflect the brilliance of our customers, blending contemporary trends with legacy artistry.
                 </p>
                 <p className="text-zinc-500 leading-relaxed text-base font-medium opacity-80">
                   Each of our pieces has its own personality – just like our customers. At Editeval, we provide the highest quality jewelry. Every purchase is an experience, not just a transaction.
                 </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8 pt-6">
                 {[
                   { icon: Diamond, label: 'Pure Elegance', text: 'Finest Handpicked Metals' },
                   { icon: ShieldCheck, label: 'Certified Quality', text: 'Guaranteed Authenticity' },
                   { icon: Heart, label: 'Handcrafted', text: 'Made with Artisanal Care' },
                   { icon: Sparkles, label: 'Sustainable', text: 'Ethically Sourced Materials' }
                 ].map((pill, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     viewport={{ once: false }}
                     className="space-y-3"
                   >
                     <pill.icon className="w-5 h-5 text-accent stroke-[1.5]" />
                     <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">{pill.label}</h3>
                     <p className="text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">{pill.text}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Cinematic Quote */}
      <section className="bg-zinc-950 py-32 px-6 overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
            className="space-y-8"
          >
             <Diamond className="w-8 h-8 text-accent/40 mx-auto animate-pulse" />
             <blockquote className="text-3xl md:text-6xl font-light text-white uppercase tracking-tight max-w-4xl mx-auto leading-[1.1]">
                "Jewellery is the <span className="text-accent italic-none font-italic-none">Exclaimation Point</span> of a woman's outfit."
             </blockquote>
             <cite className="text-[10px] uppercase font-black tracking-[0.5em] text-zinc-500 block">
                — Founder of ElvaEdit
             </cite>
          </motion.div>
          
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2" />
        </div>
      </section>

      {/* Production Story */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto text-center mb-20">
           <h2 className="text-3xl font-light uppercase tracking-[0.3em] text-zinc-900">Bespoke Production</h2>
        </div>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: 'The Concept', text: 'Infinite iterations until perfection is achieved.', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2670&auto=format&fit=crop' },
             { title: 'The Casting', text: 'Molten brilliance poured into timeless molds.', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2560&auto=format&fit=crop' },
             { title: 'The Polish', text: 'Refining every facet to catch every light.', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2670&auto=format&fit=crop' }
           ].map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               viewport={{ once: false }}
               className="group cursor-default"
             >
                <div className="relative aspect-square mb-8 overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100">
                   <img src={step.img} alt={step.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{step.text}</p>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
}
