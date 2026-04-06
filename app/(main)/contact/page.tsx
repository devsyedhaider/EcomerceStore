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
      {/* Header Narrative */}
      <section className="px-6 md:px-12 py-12 bg-zinc-50 border-b border-zinc-100 flex flex-col items-center text-center relative">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto space-y-8 relative z-10"
         >
            <div className="flex items-center justify-center gap-4 text-accent mb-2">
               <div className="h-[1px] w-8 bg-accent/30" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em]">The ElvaEdit Concierge</span>
               <div className="h-[1px] w-8 bg-accent/30" />
            </div>
            
            <h1 className="text-5xl md:text-8xl font-light uppercase tracking-tighter text-zinc-900 leading-[0.9]">
               Elegance in <br /> <span className="text-accent underline decoration-1 underline-offset-[16px] decoration-zinc-200">Communication</span>
            </h1>
            
            <p className="text-zinc-400 text-[10px] md:text-sm font-black uppercase tracking-[0.4em] max-w-xl mx-auto py-8">
               Our dedicated artisans and support team are here to guide you through your luxury journey.
            </p>
         </motion.div>
         
         {/* Kinetic Sparkle Backdrop */}
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[0.5px] border-zinc-200 rounded-full opacity-20 pointer-events-none"
         />
      </section>

      {/* Modern High-Impact Contact Grid */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Communication Hubs */}
            {[
              { icon: Mail, label: 'Concierge Email', value: 'support@elvaedit.com', sub: '24/48H Response time', accent: true },
              { icon: Phone, label: 'Artisan Hotline', value: '+92 300 123 4567', sub: 'Availability: 09AM - 08PM PKT' },
              { icon: MessageCircle, label: 'Instant WhatsApp', value: '+92 345 987 6543', sub: 'Chat with our designers directly' },
              { icon: MapPin, label: 'Design Studio', value: 'Lahore, Punjab, PK', sub: 'Bespoke Viewings by Appointment' },
              { icon: Instagram, label: 'Visual Muse', value: '@elvaedit.boutique', sub: 'Follow for the daily sparkle' },
              { icon: Clock, label: 'Boutique Hours', value: 'Mon - Sat', sub: 'Excluding Public Holidays' }
            ].map((hub, i) => (
               <motion.div 
                  key={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-12 bg-white rounded-[40px] border border-zinc-100 hover:border-accent transition-all duration-700 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden text-center"
               >
                  <div className="relative z-10 space-y-6">
                     <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-all duration-700">
                        <hub.icon className="w-7 h-7 stroke-[1.2]" />
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">{hub.label}</p>
                        <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight leading-tight">{hub.value}</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-accent opacity-60 group-hover:opacity-100 transition-opacity">{hub.sub}</p>
                     </div>
                  </div>
                  
                  {/* Luxury Background Glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               </motion.div>
            ))}
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
           
           <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8">
              {[
                { icon: Instagram, label: 'Instagram', sub: 'DM for assistance' },
                { icon: MessageSquare, label: 'Facebook Messenger', sub: 'Connect with a specialist' }
              ].map((btn, i) => (
                <motion.button 
                   key={i}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-8 md:px-12 h-20 border border-white/10 rounded-full flex items-center gap-4 hover:border-accent hover:bg-white/5 transition-all group"
                >
                   <btn.icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">{btn.label}</p>
                      <p className="text-[9px] text-zinc-500 uppercase font-medium">{btn.sub}</p>
                   </div>
                </motion.button>
              ))}
           </div>
        </div>
        
        {/* Artistic Backdrop */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
      </section>
    </div>
  );
}
