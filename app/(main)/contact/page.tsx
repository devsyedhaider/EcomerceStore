'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock, MessageCircle, MessageSquare, Diamond } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any } }
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pt-24 md:pt-28 overflow-hidden">
      {/* Header Narrative - Updated to match About Page Style */}
      <section className="px-6 md:px-12 py-12 md:py-20 border-b border-zinc-100 bg-white">
        <div className="max-w-[1400px] mx-auto text-center">
           <motion.span 
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.5 }}
              className="text-[9px] md:text-xs font-black uppercase text-accent mb-6 md:mb-8 block font-lato tracking-[0.3em] md:tracking-[0.5em]"
           >
              The Elva Edit Concierge
           </motion.span>
           <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-8xl font-light uppercase tracking-tighter sm:tracking-tight leading-[1.1] md:leading-[0.9] text-zinc-900 mb-8 md:mb-12 font-lato"
           >
              Elegance in <br className="hidden md:block" /> <span className="font-italic-none italic-none text-accent">Communication</span>
           </motion.h1>
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto text-zinc-500 text-base md:text-lg leading-relaxed font-medium font-lato"
           >
              Our dedicated artisans and support team are here to guide you through your luxury journey. Whether you're seeking a bespoke creation or have an inquiry about our collection, we are here to assist.
           </motion.p>
        </div>
      </section>

      {/* Modern High-Impact Contact Grid */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            
            {/* Communication Hubs */}
            {[
              { icon: Mail, label: 'Concierge Email', value: 'support@theelvaedit.com', sub: '24/48H Response time', accent: true, href: 'mailto:support@theelvaedit.com' },
              { icon: Phone, label: 'Artisan Hotline', value: '+92 312 6728122', sub: 'Availability: 09AM - 08PM PKT', href: 'tel:+923126728122' },
              { icon: MessageCircle, label: 'Instant WhatsApp', value: '+92 312 6728122', sub: 'Chat with our designers directly', href: 'https://wa.me/923126728122' },
              { icon: MapPin, label: 'Design Studio', value: 'Lahore, Punjab, PK', sub: 'Bespoke Viewings by Appointment' },
              { icon: Instagram, label: 'Visual Muse', value: '@glamhubbyalina', sub: 'Follow for the daily sparkle', href: 'https://www.instagram.com/glamhubbyalina?igsh=MWxxanZzdWF4NmZ0eA%3D%3D&utm_source=qr' },
              { icon: Facebook, label: 'Community Hub', value: 'The Elva Edit', sub: 'Join our Facebook community', href: 'https://www.facebook.com/share/1DdFEa73UF/?mibextid=wwXIfr' },
              { icon: Clock, label: 'Boutique Hours', value: 'Mon - Sat', sub: 'Excluding Public Holidays' }
            ].map((hub, i) => {
              const CardWrapper = hub.href ? motion.a : motion.div;
              return (
               <CardWrapper 
                  key={i}
                  {...(hub.href ? { href: hub.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-8 md:p-12 bg-white rounded-[32px] md:rounded-[40px] border border-zinc-100 hover:border-accent transition-all duration-700 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden text-center cursor-pointer"
               >
                  <div className="relative z-10 space-y-6">
                     <div className="w-14 h-14 md:w-16 md:h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-all duration-700">
                        <hub.icon className="w-6 h-6 md:w-7 md:h-7 stroke-[1.2]" />
                     </div>
                     <div className="space-y-4">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400">{hub.label}</p>
                        <h3 className="text-base md:text-lg font-bold text-zinc-900 uppercase tracking-tight leading-tight break-words">{hub.value}</h3>
                        <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-accent opacity-60 group-hover:opacity-100 transition-opacity">{hub.sub}</p>
                     </div>
                  </div>
                  
                  {/* Luxury Background Glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               </CardWrapper>
              );
            })}
          </div>
      </section>

      {/* Cinematic Social Interaction */}
      <section className="py-24 px-6 md:px-12 bg-zinc-950 text-white relative">
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
           <Diamond className="w-8 h-8 text-accent/40 mx-auto animate-pulse mb-8" />
           <motion.h2 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-3xl md:text-5xl font-light uppercase tracking-widest leading-tight max-w-4xl mx-auto"
           >
             Prefer a <span className="text-accent italic-none font-italic-none">Direct Connection</span>? <br /> Message us on Social Media
           </motion.h2>
           
           <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 pt-8">
              {[
                { icon: Instagram, label: 'Instagram', sub: 'DM for assistance', href: 'https://www.instagram.com/glamhubbyalina?igsh=MWxxanZzdWF4NmZ0eA%3D%3D&utm_source=qr' },
                { icon: MessageSquare, label: 'Facebook Messenger', sub: 'Connect with a specialist', href: 'https://www.facebook.com/share/1DdFEa73UF/?mibextid=wwXIfr' }
              ].map((btn, i) => (
                <motion.a 
                   key={i}
                   href={btn.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="w-full md:w-auto px-8 md:px-12 h-20 border border-white/10 rounded-full flex items-center justify-center md:justify-start gap-4 hover:border-accent hover:bg-white/5 transition-all group"
                >
                   <btn.icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">{btn.label}</p>
                      <p className="text-[9px] text-zinc-500 uppercase font-medium">{btn.sub}</p>
                   </div>
                </motion.a>
              ))}
           </div>
        </div>
        
        {/* Artistic Backdrop */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      </section>
    </div>
  );
}
