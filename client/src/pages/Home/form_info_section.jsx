
import {Leaf, TrendingUp, MapPin} from 'lucide-react';

export function Farm_Info_Section(){
    return(
        <>    
        {/* Farm Information Section */}
        <section id="farm" className="py-24 bg-gradient-to-b from-[#E8F3ED] to-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-block px-4 py-2 bg-white rounded-full mb-6 shadow-md">
                <span className="text-[#027c68] font-semibold text-sm">Our Implementation</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
                FLOR and Daisy's Farm
                </h2>
                <p className="text-xl text-[#5A8F73] leading-relaxed mb-8">
                Located in the heart of sustainable agriculture, FLOR and Daisy's Farm serves as the testing ground for our innovative automatic plant watering system. Our technology helps maintain optimal growing conditions across multiple cultivation beds.
                </p>
                
                <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">Strategic Location</h3>
                    <p className="text-[#5A8F73]">Positioned to maximize sunlight exposure and natural water drainage</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">Sustainable Practices</h3>
                    <p className="text-[#5A8F73]">Water conservation through smart irrigation and sensor-driven automation</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">Proven Results</h3>
                    <p className="text-[#5A8F73]">30% water savings and 25% yield improvement since implementation</p>
                    </div>
                </div>
                </div>
            </div>

            <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#027c68] to-[#009983] p-8">
                <div className="bg-white rounded-2xl p-8 text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-full flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-[#027c68]" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#003333]">Farm Statistics</h3>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="bg-[#E8F3ED] rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#027c68]">3</div>
                        <div className="text-sm text-[#5A8F73] mt-1">Cultivation Beds</div>
                    </div>
                    <div className="bg-[#E8F3ED] rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#027c68]">18</div>
                        <div className="text-sm text-[#5A8F73] mt-1">Sensor Zones</div>
                    </div>
                    <div className="bg-[#E8F3ED] rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#027c68]">500+</div>
                        <div className="text-sm text-[#5A8F73] mt-1">Plants Monitored</div>
                    </div>
                    <div className="bg-[#E8F3ED] rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#027c68]">24/7</div>
                        <div className="text-sm text-[#5A8F73] mt-1">Monitoring</div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
        </>
    )
}