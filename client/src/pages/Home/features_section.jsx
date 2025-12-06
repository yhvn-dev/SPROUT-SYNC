import { Droplets, Sun, Wind,Activity,TrendingUp, Bell } from 'lucide-react';

export function FeatureSection(){

    return(

     <>
        {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-[#E8F3ED]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
              Intelligent Monitoring
            </h2>
            <p className="text-xl text-[#5A8F73] max-w-2xl mx-auto">
              Our system tracks critical environmental factors to ensure optimal plant growth conditions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Droplets,
                title: 'Soil Moisture',
                description: 'Real-time soil moisture monitoring ensures plants receive the perfect amount of water',
                color: '#027c68',
                bg: '#E8F3ED'
              },
         
              {
                icon: Droplets,
                title: 'Water Level',
                description: 'Smart water reservoir monitoring with automatic refill alerts',
                color: '#5A8F73',
                bg: '#E8F3ED'
              },
                {
                  icon: TrendingUp,
                  title: 'Growth Analytics',
                  description: 'Historical data analysis to optimize watering schedules and patterns',
                  color: '#027c68',
                  bg: '#E8F3ED'
              },
                {
                  icon: Bell,
                  title: 'Real Time Notifications',
                  description: 'Real time notifications from different inputs and sensors',
                  color: '#027c68',
                  bg: '#E8F3ED'
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-[#E8F3ED]">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-[#003333] mb-4">{feature.title}</h3>
                <p className="text-[#5A8F73] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>

    )
    
}