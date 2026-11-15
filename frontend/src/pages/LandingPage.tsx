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
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        a, button, [role="button"], [role="tab"] {
          cursor: pointer;
        }

        a:focus-visible,
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible,
        [role="button"]:focus-visible,
        [role="tab"]:focus-visible {
          outline: 2px solid #0E67CC;
          outline-offset: 2px;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F4F5F7; }
        ::-webkit-scrollbar-thumb { background: rgba(13, 17, 23, 0.25); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(13, 17, 23, 0.45); }

        .ravira-no-scrollbar {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .ravira-no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        @media (max-width: 960px) {
          .about-bento-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-card-fan {
            flex-wrap: wrap !important;
            gap: 12px !important;
            perspective: none !important;
          }
          .hero-card-fan > div {
            margin: 0 !important;
            transform: none !important;
            flex: 1 1 150px !important;
            max-width: 220px !important;
          }
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
      <AboutSection />
      <FeaturesSection />
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
