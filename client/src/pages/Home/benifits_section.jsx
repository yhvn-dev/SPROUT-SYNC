import { Droplets, Shield, Bell, Gauge, Database } from 'lucide-react';

export default function BenefitSection() {
  return (
    <section className="benefits_section p-2 md:p-8 sm:py-20 lg:py-24 ">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#003333] mb-4 sm:mb-6">
            Why Choose SPROUTSYNC
          </h2>
          <p className="benefits_main_text text-base sm:text-lg md:text-xl text-[var(--metal-dark2)] max-w-2xl mx-auto">
            Transform your agricultural practices with data-driven automation
          </p>
        </div>




        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 ">
          {/* Automatic Irrigation */}
          <div className="
          hover:scale-102 hover:shadow-md
          transition-transform transition-shadow

          md:col-span-2 md:row-span-2 bg-gradient-to-br from-[var(--sancga)] to-[var(--sancgb)] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon_badges w-12 h-12 sm:w-14 sm:h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                <Droplets className="w-6 h-6 sm:w-7 sm:h-7 text-[#027c68]" />
              </div>
              <h3 className="automatic_irrigation_text text-2xl sm:text-3xl font-bold text-[var(--main-white)]">
                Automatic Irrigation
              </h3>
            </div>

            <p className="automatic_irrigation_text text-base sm:text-lg text-gray-200 mb-6 leading-relaxed">
              Waters only when plants need it
            </p>

            <div className="bg-[var(--main-white)] rounded-2xl p-5 sm:p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl sm:text-6xl font-bold text-[#027c68]">30%</span>
                <span className="text-lg sm:text-xl font-semibold text-[var(--metal-dark2)]">
                  Water Savings
                </span>
              </div>
              <p className="text-sm text-[var(--metal-dark2)]">
                Reduce water consumption through precise, need-based irrigation.
              </p>
            </div>
          </div>

          {/* Water Level Safety */}
          <div className="benefits_grid hover:scale-102 hover:shadow-md
            transition-transform transition-shadow
            
            md:col-span-2 bg-gradient-to-r from-[var(--white-blple))] via-[var(--white-blple)] to-[var(--white-blple)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon_badges w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-[#208b3a]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#003333]">
                Water Level Safety
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[var(--metal-dark2)] leading-relaxed">
              Pump automatically shuts off when water is low, protecting your system and preventing dry runs
            </p>
          </div>

          {/* Real-Time Alerts */}
          <div className="benefits_grid hover:scale-102 hover:shadow-md
            transition-transform transition-shadow
            
            bg-gradient-to-br from-[#A8C7B8] to-[#C4DED0] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="icon_badges w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <Bell className="w-6 h-6 text-[#027c68]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#003333] mb-2">
              Real-Time Alerts
            </h3>
            <p className="text-sm text-[var(--metal-dark2)]">
              Know exactly when your plants are being watered
            </p>
          </div>




          {/* Manual & Remote Control */}
          <div className="benefits_grid hover:scale-102 hover:shadow-md
            transition-transform transition-shadow
            duration-500 ease-in-out bg-gradient-to-br from-[#A8C7B8] to-[#C4DED0] rounded-3xl p-6 shadow-sm ">
  
            <div className="icon_badges w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <Gauge className="w-6 h-6 text-[#1a7431]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#003333] mb-2">
              Manual & Remote Control
            </h3>
            <p className="text-sm text-[var(--metal-dark2)]">
              Take full control of your valves anytime, anywhere
            </p>
          </div>




          {/* Data Logging */}
          <div className="benefits_grid
          hover:scale-102 
          transition-transform transition-shadow
          
          md:col-span-2 bg-gradient-to-br from-[#b7efc5] to-[#7BA591] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="icon_badges w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                <Database className="w-6 h-6 text-[#009983]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#003333]">
                Data Logging 
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[var(--metal-dark2)] leading-relaxed">
               Track your latest and average moisture levels, and monitor water levels over time
            </p>
          </div>




          {/* Stats */}
          <div className=" grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-start-3 md:col-end-5 md:row-start-3">
            {[
              { value: "Better", title: "Yield Quality", desc: "Optimal growing conditions lead to healthier, more productive plants" },
              { value: "Less", title: "Manual Work", desc: "Automation reduces manual monitoring and irrigation tasks" },
              { value: "24/7", title: "Monitoring", desc: "Continuous system oversight ensures your plants never go without care" },
            ].map((item, i) => (
              <div key={i} className="benefits_grid hover:scale-102 hover:shadow-md
             transition-shadow bg-[var(--main-white)] rounded-3xl p-6 shadow-sm border border-[#E8F3ED]">
                <div className="text-4xl sm:text-5xl font-bold text-[#027c68] mb-2">
                  {item.value}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[#003333] mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-[var(--metal-dark2)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>



    </section>
  );
}
