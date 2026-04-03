import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Galaxy background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/galaxy.jpg')" }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 90%, #000 100%)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="text-[clamp(4rem,18vw,14rem)] font-black tracking-tighter text-white leading-none"
          style={{ textShadow: '0 0 120px rgba(47,129,247,0.25)' }}
        >
          Aureus
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-full uppercase tracking-widest text-sm transition-all duration-200 active:scale-95"
          >
            Explore Dashboard
          </button>
        </motion.div>
      </div>
    </section>
  );
}
