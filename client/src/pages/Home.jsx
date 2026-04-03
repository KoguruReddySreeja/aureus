import HomeNav from '../components/home/HomeNav.jsx';
import HeroSection from '../components/home/HeroSection.jsx';
import RolesSection from '../components/home/RolesSection.jsx';
import ServicesSection from '../components/home/ServicesSection.jsx';
import ProductsSection from '../components/home/ProductsSection.jsx';
import BlogSection from '../components/home/BlogSection.jsx';
import ContactSection from '../components/home/ContactSection.jsx';

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <HomeNav />
      <HeroSection />
      <RolesSection />
      <ServicesSection />
      <ProductsSection />
      <BlogSection />
      <ContactSection />

      {/* Footer */}
      <footer className="bg-black border-t border-border/30 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">◆</span>
            <span className="font-mono font-bold text-white tracking-widest text-sm">AUREUS</span>
          </div>
          <p className="text-sm text-text-secondary">
            Finance intelligence for modern teams.
          </p>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Aureus Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
