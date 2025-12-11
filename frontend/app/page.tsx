'use client';

import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import { WemaHero } from '@/components/ui/wema-hero';
import { TrustStrip } from '@/components/ui/trust-strip';
import { BenefitsSection } from '@/components/ui/benefits-section';
import { WorkflowSection } from '@/components/ui/workflow-steps';
import { ProductHighlight } from '@/components/ui/product-highlight';
import { SecurityTrust } from '@/components/ui/security-trust';
import { SpecialProducts } from '@/components/ui/special-products';
import { BoldCTA } from '@/components/ui/bold-cta';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-primary selection:text-white">

      {/* 1. Navigation Bar */}
      <Navbar variant="light" />

      {/* 2. Hero Section with Slideshow */}
      <WemaHero />

      {/* 3. Trust Strip (Trusted By Partners) */}
      <TrustStrip />

      {/* 4. Benefits Section */}
      <BenefitsSection />

      {/* 5. Workflow Section (How It Works) */}
      <WorkflowSection />

      {/* 6. Product Highlight */}
      <ProductHighlight />

      {/* 7. Security & Trust */}
      <SecurityTrust />

      {/* 8. Special Products */}
      <SpecialProducts />

      {/* 9. Bold CTA */}
      <BoldCTA />

      {/* 10. Footer */}
      <Footer />

    </div>
  );
}

