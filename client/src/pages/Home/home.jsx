import { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, X, ArrowBigDown } from 'lucide-react';
import { Load_Logo } from "../../components/logo";
import { Link } from "react-router-dom";
import { Header } from "../../components/header";

const Dashboard_Mockup = lazy(() => import('./dashboard_mockup'));
const FeatureSection = lazy(() => import('./features_section'));
const BenefitSection = lazy(() => import('./benifits_section'));
const Farm_Info_Section = lazy(() => import('./farm_info_section'));
const Logo_Page = lazy(() => import('./logo_page'));
const Footer = lazy(() => import('../../components/footer'));

import SproutImg from "../../assets/Images/SPROUT-SYNC LOGO.png";
import Plant_Bg_1 from "../../assets/Images/PLANT BG -1.jpg";
import {
  Features_Skeleton,
  Dashboard_Mockup_Skeleton,
  Farm_Info_Skeleton,
  BenefitSection_Skeleton,
  Footer_Skeleton,
  Logo_Page_Skeleton,
  Dashboard_Skeleton
} from '../../components/skeletons';

import "./home.css";


export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setVisible(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      console.log("🔥 beforeinstallprompt fired");
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
  }



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
      className="cursor-pointer hover:bg-[var(--sancgd)] flex items-center fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 
      px-4 py-3 md:px-6 md:py-4 rounded-full bg-[var(--sancgb)] text-white shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
      <ArrowBigDown className='mr-2 md:mr-4 w-5 h-5 md:w-6 md:h-6' />
      <span className="hidden sm:inline">Install SproutSync</span>
      <span className="sm:hidden">Install</span>
    </button>
  );
}


function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  if (showLogo === null) return null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      {showLogo ? (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          <Load_Logo />
        </div>
      ) : (
        <>
          <Header
            isScrolled={isScrolled}
            navChildren={
              <div className="mobile-menu-container w-full">

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-row-reverse items-center gap-6 lg:gap-8">
                  <Link
                    to="/login"
                    className="header-button border-2 rounded-2xl px-4 lg:px-6 py-[1px] bg-[var(--sancgb)] text-white font-medium hover:shadow-lg transition-all whitespace-nowrap">
                    Login
                  </Link>
                  
                  <a 
                    href="#features"
                    className={`header-button border-white border-1 px-4 lg:px-6 py-[1px] rounded-2xl font-medium whitespace-nowrap transition-colors ${
                      isScrolled ? "text-black hover:text-[#027c68]" : "text-white hover:text-[#027c68]"
                    }`}>
                    Features
                  </a>
              
                  <a href="#dashboard_mockup"
                    className={`header-button border-white border-1 px-4 lg:px-6 py-[1px] rounded-2xl font-medium whitespace-nowrap transition-colors ${
                      isScrolled ? "text-black hover:text-[#027c68]" : "text-white hover:text-[#027c68]"
                    }`}>
                    Dashboard
                  </a>     

                  <a href="#farm"
                    className={`header-button border-white border-1 px-4 lg:px-6 py-[1px] rounded-2xl font-medium whitespace-nowrap transition-colors ${
                      isScrolled ? "text-black hover:text-[#027c68]" : "text-white hover:text-[#027c68]"
                    }`}>
                    Our Farm
                  </a>
                  
                   <a href="#contacts"
                    className={`header-button border-white border-1 px-4 lg:px-6 py-[1px] rounded-2xl font-medium whitespace-nowrap transition-colors ${
                      isScrolled ? "text-black hover:text-[#027c68]" : "text-white hover:text-[#027c68]"
                    }`}>
                    Contacts
                  </a>

                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center justify-end w-full md:hidden">
                  <button
                    className={` ${isScrolled ? "bg-[var(--metal-dark4)]" : "bg-[var(--metal-dark4)]" } cursor-pointer header-button border-white rounded-2xl text-[#003333] shadow-lg p-2 hover:bg-[var(--metal-dark4)] transition-colors`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileMenuOpen(!mobileMenuOpen);
                    }}
                    aria-label="Toggle menu">
                    {mobileMenuOpen ? <X size={24} /> : <Menu className='text-white' size={24} />}
                  </button>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                  <div className="md:hidden absolute top-0 left-0 right-0 bg-[var(--metal-dark1)] shadow-lg rounded-b-2xl mt-2 py-2 px-4 space-y-2 border-t border-gray-100">
                    <Link
                      to="/login"
                      className="header-button block text-[var(--main-white--)] rounded-2xl px-4 py-2 hover:bg-[var(--metal-dark4)] transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                    
                      <a 
                      href="#features"
                      className="header-button block text-[var(--main-white--)] rounded-2xl px-4 py-2 hover:bg-[var(--metal-dark4)] transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Features
                    </a>
                      <a 
                      href="#dashboard_mockup"
                      className="header-button block text-[var(--main-white--)] rounded-2xl px-4 py-2 hover:bg-[var(--metal-dark4)] transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </a>
                      <a 
                      href="#farm"
                      className="header-button block text-[var(--main-white--)] rounded-2xl px-4 py-2 hover:bg-[var(--metal-dark4)] transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Our Farm
                    </a>
                      <a 
                      href="#contacts"
                      className="header-button block text-[var(--main-white--)] rounded-2xl px-4 py-2 hover:bg-[var(--metal-dark4)] transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}>
                      Contacts
                    </a>
                  </div>
                )}
              </div>
            }
          />


          {/* Hero Section */}
          <section className="hero_section relative h-screen w-full overflow-hidden bg-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="gd_a absolute top-10 md:top-20 -left-10 md:-left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[#E8F3ED] rounded-full blur-3xl opacity-60 animate-pulse"></div>
              <div className="gd_b absolute top-32 md:top-40 right-5 md:right-10 w-40 h-40 sm:w-52 sm:h-52 md:w-80 md:h-80 bg-[#C4DED0] rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="gd_c absolute bottom-10 md:bottom-20 left-1/4 w-40 h-40 sm:w-52 sm:h-52 md:w-72 md:h-72 bg-[#b0e892]/30 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 h-full w-full flex items-center justify-center pl-3 py-3 pr-1">
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={Plant_Bg_1}
                  alt="SproutSync Agricultural Technology"
                  className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                />
                <div className="w-full h-full absolute inset-0 rounded-xl md:rounded-2xl bg-black/30"></div>
                <div className="flex flex-col items-center justify-center absolute inset-0 p-4 w-full">
                  <ul className='flex w-[95%] flex-col sm:flex-row items-start gap-4 sm:gap-4'>
                    <li className="px-4 text-2xl text-white">Nurtured by</li>
                  </ul>

                  <ul className='flex w-[95%] center flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-4'>
                    <li className='sprout-sync-text font-bold text-[var(--main-white)] text-center text-[8.07rem] leading-[0.50] md:text-[11.07rem] lg:text-[16.07rem] pointer-events-none drop-shadow-2xl'>
                      SPROUT
                    </li>
                    <li className='flex sprout-sync-text font-bold text-[var(--main-white)] text-[8.07rem] leading-[0.50] ml-10 mt-4 md:text-[11.07rem] lg:text-[16.07rem] pointer-events-none drop-shadow-2xl'>
                      S
                      <img className="h-auto w-25 xs:w-24 sm:w-28 md:w-30 my-2 sm:my-4" src={SproutImg} />
                      NC
                    </li>
                  </ul>

                  <p className='sm:my-8 text-center text-white text-xs sm:text-sm md:text-base px-4'>
                    We take care of your plant's needs with smart monitoring and gentle,<br />
                    targeted watering—so it grows happy and healthy.
                  </p>
                </div>

                <div className='left-2 sm:left-4 bottom-2 sm:bottom-4 absolute flex flex-col sm:flex-row gap-2 sm:gap-4 w-[calc(100%-1rem)] sm:w-auto max-w-[calc(100%-2rem)]'>
                  <ul className="flex w-full sm:w-[10rem] md:w-[12rem] h-auto sm:h-[6rem] md:h-[8rem] p-3 sm:p-4 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-xl sm:rounded-2xl shadow-lg">
                    <div className="absolute inset-0 bg-gray-200/20 rounded-xl sm:rounded-2xl" />
                    <div className="relative z-10">
                      <h1 className="text-base sm:text-lg md:text-[2.617rem)] text-white font-semibold mb-1">
                        100% Automated
                      </h1>
                      <p className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem] font-extralight text-gray-100">
                        Smart monitoring, healthier plants. Automatic watering, effortless care
                      </p>
                    </div>
                  </ul>

                  <div className='gap-2 sm:gap-4 w-full sm:w-[10rem] md:w-[12rem] h-auto sm:h-[6rem] md:h-[8rem] flex flex-row sm:flex-col'>
                    <ul className="flex items-center justify-start p-2 flex-grow w-full bg-white/20 backdrop-blur-3xl border border-white/30 rounded-xl sm:rounded-2xl shadow-lg">
                      <p className='text-xs sm:text-sm text-white'>Real-time Notifications</p>
                    </ul>
                    <ul className="flex items-center justify-start p-2 flex-grow w-full bg-white/20 backdrop-blur-3xl border border-white/30 rounded-xl sm:rounded-2xl shadow-lg">
                      <p className='text-xs sm:text-sm text-white'>Plant Cycle Management</p>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>





          {/* Install Button */}
          <InstallButton />

          {/* Features Section */}
          <section id="features" className="w-full">
            <Suspense fallback={<div className="text-center py-8"><Features_Skeleton /></div>}>
              <FeatureSection />
            </Suspense>
          </section>

          {/* Dashboard Section */}
          <section id="dashboard_mockup" className="center w-full   h-full">
            <Suspense fallback={<Dashboard_Mockup_Skeleton />}>
              <Dashboard_Mockup />
            </Suspense>
          </section>

          <section id="farm" className="center w-full">
            <Suspense fallback={<Farm_Info_Skeleton />}>
              <Farm_Info_Section />
            </Suspense>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="center w-full">
            <Suspense fallback={<BenefitSection_Skeleton />}>
              <BenefitSection />
            </Suspense>
          </section>

          {/* Logo Section */}
          <section className="w-full">
            <Suspense fallback={<div className="text-center py-8"><Logo_Page_Skeleton /></div>}>
              <Logo_Page />
            </Suspense>
          </section>

          <section id="contacts" className='w-full p-2 md:px-8 py-8'>
            <Suspense fallback={<div className="text-center py-8"><Footer_Skeleton /></div>}>
              <Footer />
            </Suspense>
          </section>

        </>
      )}
    </div>
  );
}

export default Home;