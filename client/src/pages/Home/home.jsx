import { useState, useEffect } from 'react';
import { Droplets, Sun, Wind, Menu, X } from 'lucide-react';
import {Load_Logo} from "../../components/logo"

import { Link } from "react-router-dom"
import { Header } from "../../components/header"
import { Dashboard_Mockup } from "./dashboard_mockup"
import { FeatureSection } from './features_section';
import { BenefitSection } from './benifits_section';
import { Farm_Info_Section  } from './farm_info_section';
import { Contact_Section  } from './contact_section';
import { Logo_Page } from "./logo_page"
import { Footer } from "../../components/footer"
import "./home.css"
function Home(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
 
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedHome")

    if(!hasVisited){
      setShowLogo(true)
      sessionStorage.setItem("hasVisitedHome","true")
      const timer = setTimeout(() => setShowLogo(false), 4000); 
      return () => clearTimeout(timer);
    }else{
      setShowLogo(false)
    }

  }, []);
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {showLogo ? (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
            <Load_Logo/>
        </div>
      ) : (
          <>
              <Header navChildren={
                 <>
            
              <div className="hidden md:flex  flex-row-reverse items-center gap-8">
                <Link to="/login" className="px-6 py-1 bg-[var(--sancgb)]  text-white rounded-full font-medium hover:shadow-lg transition-all">
                  Get Started
                </Link>
                
                <a href="#features" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                  Features
                </a>
                <a href="#dashboard" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                  Dashboard
                </a>
                <a href="#farm" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                  Our Farm
                </a>
                {/* <a href="#contact" className="text-[#5A8F73] hover:text-[#027c68] transition-colors font-medium">
                  Contact
                </a>
               */}
               
              </div>

              <div className='flex items-center justify-end w-full  '>
                  <button 
                  className="md:hidden text-[#003333] mx-4 rounded-2xl shadow-lg p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>  
              </div>

              {mobileMenuOpen && (
                <div className="md:hidden  space-y-3">
                  <Link to="/login"  href="#login" className="block bg-[var(--sancgb)] text-[var(--sage-lighter)] rounded-2xl px-4 py-1  hover:text-[#027c68]">Get Started</Link>
                  <a href="#features" className="block text-[#5A8F73] rounded-2xl px-4 py-1   hover:text-[#027c68] ">Features</a>
                  <a href="#dashboard" className="block text-[#5A8F73] rounded-2xl px-4 py-1  hover:text-[#027c68] ">Dashboard</a>
                  <a href="#farm" className="block text-[#5A8F73] rounded-2xl px-4 py-1  hover:text-[#027c68] ">Our Farm</a>
                </div>
            )}
        </>
      }
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-4 overflow-hidden bg-white">
        {/* Backdrop Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-[#E8F3ED] rounded-full blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-[#C4DED0] rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-[#b0e892]/30 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-[#E8F3ED] rounded-full">
                <span className="text-[#027c68] font-semibold text-sm">Smart Agriculture Solution</span>
              </div>
              
              <h1 className="hook-txt-a text-6xl md:text-5xl lg:text-7xl font-bold text-[#003333] leading-none">
                Nurture
                <br/>
                  <span className="text-[var(--sancgb)] font-bold">
                    Growth
                  </span>
                <br />
                Effortlessly
              </h1>
                
              <p className="text-lg text-[#5A8F73] leading-relaxed max-w-lg">
                Revolutionize your farming with our intelligent automatic plant watering system. Monitor soil moisture, temperature, humidity, pH levels, and water levels in real-time.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-gradient-to-r from-[#027c68] to-[#009983] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  Explore Dashboard
                </button>
                <button className="px-4 py-2  border-2 border-[#7BA591] text-[#003333] rounded-2xl font-semibold text-lg hover:bg-[#E8F3ED] transition-all">
                  Learn More
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-[#027c68]">24/7</div>
                  <div className="text-sm text-[#5A8F73]">Monitoring</div>
                </div>
                <div className="w-px h-12 bg-[#C4DED0]"></div>
                <div>
                  <div className="text-2xl font-bold text-[#027c68]">100%</div>
                  <div className="text-sm text-[#5A8F73]">Automated</div>
                </div>
                <div className="w-px h-12 bg-[#C4DED0]"></div>
                <div>
                  <div className="text-2xl font-bold text-[#027c68]">Smart</div>
                  <div className="text-sm text-[#5A8F73]">Analytics</div>
                </div>
              </div>
            </div>

            {/* Image/Visual Space */}
            <div className="relative">
              <div className="center rounded-3xl  p-8">
                <div className="relative rounded-full h-130 w-130 bg-white shadow-sm flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#027c68] to-[#009983] rounded-full flex items-center justify-center">
                      <Droplets className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-[#003333] font-semibold text-lg">Smart Irrigation</div>
                    <div className="text-[#5A8F73]">Powered by IoT Sensors</div>

                    {/* Floating Cards */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-[#E8F3ED]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E8F3ED] rounded-xl flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-[#027c68]" />
                        </div>
                        <div>
                          <div className="text-sm text-[#5A8F73]">Moisture</div>
                          <div className="text-xl font-bold text-[#003333]">40 %</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-[#E8F3ED]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E8F3ED] rounded-xl flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-[#027c68]" />
                        </div>
                        <div>
                          <div className="text-sm text-[#5A8F73]">Water Level</div>
                          <div className="text-xl font-bold text-[#003333]">65%</div>
                        </div>
                      </div>
                    </div>

                
                  </div>
                </div>
              </div>
              
           
            </div>
          </div>
        </div>
      </section>

        <FeatureSection/>
        <Dashboard_Mockup/>
        <Farm_Info_Section/>
        <BenefitSection/>
        <Logo_Page/>
        <Footer/>     
      </>
      )}
       
   
    </div>

    )

  }

  export default Home