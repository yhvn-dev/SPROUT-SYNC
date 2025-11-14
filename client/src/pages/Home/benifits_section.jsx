

export function BenefitSection(){
    
    return(    
        <>     
        <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
              Why Choose GreenLink
            </h2>
            <p className="text-xl text-[#5A8F73] max-w-2xl mx-auto">
              Transform your agricultural practices with data-driven automation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-3xl p-8 shadow-lg">
              <div className="text-6xl font-bold text-[#027c68] mb-4">30%</div>
              <h3 className="text-2xl font-bold text-[#003333] mb-3">Water Savings</h3>
              <p className="text-[#5A8F73]">Reduce water consumption through precise, need-based irrigation</p>
            </div>

            <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-3xl p-8 shadow-lg">
              <div className="text-6xl font-bold text-[#027c68] mb-4">25%</div>
              <h3 className="text-2xl font-bold text-[#003333] mb-3">Yield Increase</h3>
              <p className="text-[#5A8F73]">Optimal growing conditions lead to healthier, more productive plants</p>
            </div>

            <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-3xl p-8 shadow-lg">
              <div className="text-6xl font-bold text-[#027c68] mb-4">50%</div>
              <h3 className="text-2xl font-bold text-[#003333] mb-3">Time Saved</h3>
              <p className="text-[#5A8F73]">Automation reduces manual monitoring and irrigation tasks</p>
            </div>
          </div>
        </div>
      </section>
      
    </>
    )
    
}