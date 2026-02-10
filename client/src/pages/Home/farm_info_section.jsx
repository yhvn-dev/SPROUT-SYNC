import { Leaf, TrendingUp, MapPin } from "lucide-react";

export default function Farm_Info_Section() {
  return (
    <>
      {/* Farm Information Section */}
      <section
        id="farm"
        className="farm_info_section py-24 bg-gradient-to-b from-[#E8F3ED] to-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <div className="our_implementation_container inline-block px-4 py-2 bg-white rounded-full mb-6 shadow-md">
                <span className="text-[#027c68] font-semibold text-sm">
                  Partner Farm & Training Center
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
                F&D Agriculture and Livelihood Training Center OPC
              </h2>

              <p className="text-xl text-[#5A8F73] leading-relaxed mb-8">
                Located along Quezon Avenue Extension, Brgy. Mamala 2, Sariaya,
                Quezon, F&D Agriculture and Livelihood Training Center OPC serves
                as a hub for sustainable farming, agricultural training, and
                community-based livelihood programs, supporting farmers through
                education, collaboration, and modern agricultural practices.
              </p>

              <div className="space-y-6">
                {/* LOCATION */}
                <div className="flex items-start gap-4">
                  <div className="farm_info_icons w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#027c68]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">
                      Strategic Location
                    </h3>
                    <p className="text-[#5A8F73]">
                      Situated in a high-elevation area of Sariaya, Quezon, the
                      farm benefits from good airflow, natural drainage, and
                      accessibility for training activities and farm operations.
                    </p>
                  </div>
                </div>

                {/* SUSTAINABILITY */}
                <div className="flex items-start gap-4">
                  <div className="farm_info_icons w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#027c68]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">
                      Sustainable Farming Practices
                    </h3>
                    <p className="text-[#5A8F73]">
                      Promotes responsible land use, efficient water management,
                      and environmentally conscious farming methods to support
                      long-term agricultural productivity.
                    </p>
                  </div>
                </div>

                {/*TECH INNOVATION */}  
                <div className="flex items-start gap-4">
                  <div className="farm_info_icons w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#027c68]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#003333] mb-2">
                      Training & Innovation
                    </h3>
                    <p className="text-[#5A8F73]">
                      Actively engages in training programs, focus group
                      discussions, and technology adoption initiatives to
                      enhance farmers’ skills and improve farm efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#027c68] to-[#009983] p-8">
                <div className="bg-white rounded-2xl p-8 text-center space-y-6">
                  <div className="farm_info_icons w-24 h-24 mx-auto bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-full flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-[#027c68]" />
                  </div>
                  <p className="text-[#5A8F73] font-medium">
                    Supporting sustainable agriculture and community livelihood
                    development in Quezon Province
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
