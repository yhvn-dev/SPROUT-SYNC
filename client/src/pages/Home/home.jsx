import { useState, useEffect } from 'react';
import { Droplets, Sun, Wind, Menu, X, Download , ArrowBigDown} from 'lucide-react';
import { Load_Logo } from "../../components/logo";
import { Link } from "react-router-dom";
import { Header } from "../../components/header";
import { Dashboard_Mockup } from "./dashboard_mockup";
import { FeatureSection } from './features_section';
import { BenefitSection } from './benifits_section';
import { Farm_Info_Section } from './farm_info_section';
import { Contact_Section } from './contact_section';
import { Logo_Page } from "./logo_page";
import { Footer } from "../../components/footer";
import "./home.css";



export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      console.log("🔥 beforeinstallprompt fired");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User installed SproutSync");
    }
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      className="cursor-pointer hover:bg-[var(--sancgd)] flex fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full 
      bg-[var(--sancgb)] text-white">
     <ArrowBigDown className='mr-4'/> Install SproutSync
    </button>
  );
}



function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedHome");
    if (!hasVisited) {
      setShowLogo(true);
      sessionStorage.setItem("hasVisitedHome", "true");
      const timer = setTimeout(() => setShowLogo(false), 4000); 
      return () => clearTimeout(timer);
    } else {
      setShowLogo(false);
    }
  }, []);


  
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {showLogo ? (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
          <Load_Logo />
        </div>
      ) : (
        <>
          <Header
            navChildren={
              <>
                <div className="hidden md:flex flex-row-reverse items-center gap-8">
                  <Link to="/login" className="px-6 py-1 bg-[var(--sancgb)] text-white rounded-full font-medium hover:shadow-lg transition-all">
                    Get Started
                  </Link>
                  <a href="#features" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                    Features
                  </a>
                  <a href="#dashboard_mockup" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                    Dashboard
                  </a>
                  <a href="#farm" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                    Our Farm
                  </a>
                </div>

                <div className="flex items-center justify-end w-full relative">
                  <button
                    className="md:hidden text-[#003333] mx-4 rounded-2xl shadow-lg p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>

                {mobileMenuOpen && (
                  <div className="md:hidden space-y-3">
                    <Link to="/login" className="block bg-[var(--sancgb)] text-[var(--sage-lighter)] rounded-2xl px-4 py-1 hover:text-[#027c68]">
                      Login
                    </Link>
                    <a href="#features" className="block text-[#5A8F73] rounded-2xl px-4 py-1 hover:text-[#027c68]">
                      Features
                    </a>
                    <a href="#dashboard_mockup" className="block text-[#5A8F73] rounded-2xl px-4 py-1 hover:text-[#027c68]">
                      Dashboard
                    </a>
                    <a href="#farm" className="block text-[#5A8F73] rounded-2xl px-4 py-1 hover:text-[#027c68]">
                      Our Farm
                    </a>
                  </div>
                )}
              </>
            }
          />

        
          {/* Hero Section */}
          <section className="hero_section relative min-h-screen flex flex-col md:flex-row items-center pt-4 overflow-hidden bg-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="gd_a absolute top-20 -left-20 w-72 h-72 md:w-96 md:h-96 bg-[#E8F3ED] rounded-full blur-3xl opacity-60 animate-pulse"></div>
              <div className="gd_b absolute top-40 right-10 w-60 h-60 md:w-80 md:h-80 bg-[#C4DED0] rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="gd_c absolute bottom-20 left-1/4 w-60 h-60 md:w-72 md:h-72 bg-[#b0e892]/30 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="space-y-6 md:space-y-8">
                  <div className="smart_agriculture_solutions  inline-block px-3 py-1 bg-[#E8F3ED] rounded-full text-center">
                    <span className="text-[#027c68] font-semibold text-sm md:text-base">Smart Agriculture Solution</span>
                  </div>

                  <h1 className="hook-txt-a text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#003333] leading-snug">
                    Nurture <br/>
                    <span className="text-[var(--sancgb)] font-bold">Growth</span> <br />
                    Effortlessly
                  </h1>

                  <p className="text-base sm:text-lg text-[#5A8F73] leading-relaxed max-w-full md:max-w-lg">
                    Revolutionize your farming with our intelligent automatic plant watering system. Monitor soil moisture, water levels and seedlings cycle in real-time.
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <button className="cursor-pointer px-4 py-2 bg-gradient-to-r from-[#027c68] to-[#009983] text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
                      Explore Dashboard
                    </button> 
                    <button className="learn-more-button cursor-pointer px-4 py-2 border-2 border-[#7BA591] text-[#003333] rounded-2xl font-semibold text-lg hover:bg-[#E8F3ED] transition-all">
                      Learn More
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 justify-start sm:justify-start">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl sm:text-3xl font-bold text-[#027c68]">24/7</div>
                      <div className="text-sm sm:text-base text-[#5A8F73]">Monitoring</div>
                    </div>
                    <div className="w-px h-12 bg-[#C4DED0] hidden sm:block"></div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl sm:text-3xl font-bold text-[#027c68]">100%</div>
                      <div className="text-sm sm:text-base text-[#5A8F73]">Automated</div>
                    </div>
                    <div className="w-px h-12 bg-[#C4DED0] hidden sm:block"></div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl sm:text-3xl font-bold text-[#027c68]">Smart</div>
                      <div className="text-sm sm:text-base text-[#5A8F73]">Analytics</div>
                    </div>
                  </div>
                </div>





                {/* Visual Section */}
                <div className="relative flex justify-center md:justify-end mt-8 md:mt-0">
                  <div className="conb sw-64 p-4 sm:w-80 md:w-96 lg:w-[24rem] h-auto bg-white rounded-3xl shadow-sm flex items-center justify-center relative">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-gradient-to-br from-[#027c68] to-[#009983] rounded-full flex items-center justify-center">
                      <Droplets className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                    </div>

                    {/* Floating Cards */}
                    <div className="floating_card_a absolute -top-2 -right-2 bg-white rounded-2xl shadow-lg p-3 border border-[#E8F3ED] w-28 sm:w-32">
                      <div className=" flex items-center gap-2">
                        <div className="hero_icons_a w-8 h-8 sm:w-10 sm:h-10 my-4bg-[#E8F3ED] rounded-xl flex items-center justify-center">
                          <Droplets className="w-4 h-4 sm:w-6 sm:h-6 text-[#027c68]" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-[#5A8F73]">Moisture</p>
                          <p className="text-lg sm:text-xl font-bold text-[#003333]">40 %</p>
                        </div>
                      </div>
                    </div>

                    <div className="floating_card_b absolute -bottom-2 -left-2 bg-white rounded-2xl shadow-lg p-3 border border-[#E8F3ED] w-28 sm:w-32">
                      <div className=" flex items-center gap-2">
                        <div className="hero_icons_b w-8 h-8 sm:w-10 sm:h-10 bg-[#E8F3ED] rounded-xl flex items-center justify-center">
                          <Droplets className="w-4 h-4 sm:w-6 sm:h-6 text-[#027c68]" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-[#5A8F73]">Water Level</p>
                          <p className="text-lg sm:text-xl font-bold text-[#003333]">65%</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Fixed Install Button - Bottom Right Corner */}
          <InstallButton/>
          <FeatureSection />
          <section className='center' id="dashboard_mockup">
            <Dashboard_Mockup />   
          </section>
          <Farm_Info_Section />
          <BenefitSection />
          <Logo_Page /> 
          <Footer />     
        </>
      )}
    </div>
  );
  
  
}

export default Home;