
export function Features_Skeleton() {
  return (
    <>
      <section id="features" className="feature_section py-24 bg-gradient-to-b from-white to-[#E8F3ED]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="conb group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-[#E8F3ED]">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  )
}



export function Dashboard_Mockup_Skeleton() {
  return (
    <>
    <section id="features" className="feature_section py-24 bg-gradient-to-b from-white to-[#E8F3ED]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="conb group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-[#E8F3ED]">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}