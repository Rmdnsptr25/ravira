import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { MetricsStrip } from "../components/MetricsStrip";
import { FeaturesSection } from "../components/FeaturesSection";
import { AboutSection } from "../components/AboutSection";
import { ProblemSection } from "../components/ProblemSection";
import { SolutionSection } from "../components/SolutionSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { AudienceSection } from "../components/AudienceSection";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { DashboardPreview } from "../components/DashboardPreview";
import { TrustSection } from "../components/TrustSection";
import { MetricsSection } from "../components/MetricsSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f4f8ff; }
        ::-webkit-scrollbar-thumb { background: rgba(22,119,255,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(22,119,255,0.55); }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .metrics-strip-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 640px) {
          .hidden.md\\:flex { display: none !important; }
          .flex.md\\:hidden { display: flex !important; }
        }

        @media (min-width: 641px) {
          .hidden.md\\:flex { display: flex !important; }
          .flex.md\\:hidden { display: none !important; }
        }
      `}</style>

      <Navbar />
      <Hero />
      <MetricsStrip />
      <FeaturesSection />
      <AboutSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <AudienceSection />
      <AnalyticsSection />
      <DashboardPreview />
      <TrustSection />
      <MetricsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
