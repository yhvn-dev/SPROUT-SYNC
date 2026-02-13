
export function Features_Skeleton() {
  return (
    <>
      <section id="features" className="feature_section py-24 bg-gradient-to-b from-white to-[#E8F3ED]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="conb group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-[#E8F3ED]">
                <div className="conc w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                <div className="conc h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="conc h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="conc h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
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
    <section  className="con_main w-full h-full p-12 bg-gradient-to-b from-white to-[#E8F3ED]">

              <div  className="conb grid grid-cols-[1fr_9fr] gap-4 grid-rows-[1fr_9fr] h-[100vh] w-full group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-[#E8F3ED]">
                  <ul className="conc h-full w-full col-start-1  col-end-1 row-start-1 row-span-full bg-gray-200   mb-4 animate-pulse"></ul>
                  <ul className="conc h-full w-full bg-gray-200 rounded  mb-3 animate-pulse"></ul>
                  <ul className="conc flex flex-col items-start gap-4 justify-start h-full w-full bg-white rounded mb-2 animate-pulse">
                  <div className="conc h-40 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="conc h-40 w-full bg-gray-200 rounded animate-pulse"></div>
                 </ul>
               
              </div>   
    
      </section>
    </> 
  )
}



export function Farm_Info_Skeleton() {
  return (
    <section className="con_main w-full min-h-screen p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-white to-[#E8F3ED]">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[4fr_6fr] gap-4 h-full">

        {/* TOP LEFT CONTAINER */}
        <div className="conb  flex flex-col gap-4 h-full w-full bg-gray-100 rounded-2xl p-6 animate-pulse">
          <div className="conc h-6 w-1/2 bg-gray-300 rounded" />
          <div className="conc h-4 w-full bg-gray-300 rounded" />
          <div className="conc h-4 w-5/6 bg-gray-300 rounded" />
        </div>

        {/* TOP RIGHT CONTAINER */}
        <div className="conb flex flex-col gap-4 h-full w-full bg-white rounded-2xl p-6 animate-pulse">
          <div className="conc h-6 w-1/3 bg-gray-200 rounded" />
          <div className="conc h-4 w-full bg-gray-200 rounded" />
          <div className="conc h-4 w-4/6 bg-gray-200 rounded" />
        </div>

        {/* BOTTOM LEFT LIST (3 ITEMS ONLY – SAME AS YOUR CODE) */}
        <ul className="flex flex-col gap-3">
          <li className="conb flex flex-col gap-3 h-20 w-full bg-white rounded-2xl p-4 animate-pulse">
            <div className="conc h-4 w-2/3 bg-gray-200 rounded" />
            <div className="conc h-3 w-1/2 bg-gray-200 rounded" />
          </li>

          <li className="conb flex flex-col gap-3 h-20 w-full bg-white rounded-2xl p-4 animate-pulse">
            <div className="conc h-4 w-3/4 bg-gray-200 rounded" />
            <div className="conc h-3 w-1/3 bg-gray-200 rounded" />
          </li>

          <li className="conb flex flex-col gap-3 h-20 w-full bg-white rounded-2xl p-4 animate-pulse">
            <div className="conc h-4 w-1/2 bg-gray-200 rounded" />
            <div className="conc h-3 w-2/5 bg-gray-200 rounded" />
          </li>
        </ul>

      </div>
    </section>
  );
}




export function BenefitSection_Skeleton() {

  return (
    <section className="con_main benefits_section py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16 animate-pulse">
          <div className="conc h-10 sm:h-12 md:h-14 w-2/3 mx-auto bg-white rounded mb-4" />
          <div className="conc h-5 w-1/2 mx-auto bg-white rounded" />
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">

          {/* Automatic Irrigation (Big Card) */}
          <div className="conb md:col-span-2 md:row-span-2 rounded-3xl bg-white animate-pulse p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="conc w-14 h-14 bg-white rounded-2xl" />
              <div className="conc h-6 w-1/2 bg-white rounded" />
            </div>

            <div className="h-4 w-3/4 bg-white rounded mb-6" />

            <div className="conb bg-white rounded-2xl p-6">
              <div className="conc h-10 w-1/3 bg-white rounded mb-2" />
              <div className="conc h-4 w-2/3 bg-white rounded" />
            </div>
          </div>

          {/* Water Level Safety */}
          <div className="conb  md:col-span-2 rounded-3xl p-6 bg-white animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="conc w-12 h-12 bg-white rounded-xl" />
              <div className="conc h-6 w-1/3 bg-white rounded" />
            </div>
            <div className="conc h-4 w-full bg-white rounded mb-2" />
            <div className="conc h-4 w-5/6 bg-white rounded" />
          </div>

          {/* Real-Time Alerts */}
          <div className="conb  rounded-3xl p-6 bg-white animate-pulse">
            <div className="conc w-12 h-12 bg-white rounded-xl mb-4" />
            <div className="conc h-5 w-2/3 bg-white rounded mb-2" />
            <div className="conc h-4 w-full bg-white rounded" />
          </div>

          {/* Manual & Remote Control */}
          <div className="conb rounded-3xl p-6 bg-white animate-pulse">
            <div className="conc w-12 h-12 bg-white rounded-xl mb-4" />
            <div className="conc h-5 w-3/4 bg-white rounded mb-2" />
            <div className="conc h-4 w-full bg-white rounded" />
          </div>

          {/* Data Logging */}
          <div className="conb md:col-span-2 rounded-3xl p-6 bg-white animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="conc w-12 h-12 bg-white rounded-xl" />
              <div className="conc h-6 w-1/3 bg-white rounded" />
            </div>
            <div className="conc h-4 w-full bg-white rounded mb-2" />
            <div className="conc h-4 w-5/6 bg-white rounded" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-start-3 md:col-end-5 md:row-start-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="conb rounded-3xl p-6 bg-white border border-gray-100 animate-pulse"
              >
                <div className="conc h-10 w-1/3 bg-white rounded mb-3" />
                <div className="conc h-5 w-2/3 bg-white rounded mb-2" />
                <div className="conc h-4 w-full bg-white rounded" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}




export function Logo_Page_Skeleton() {
  return (
    <section className="con_main flex items-center justify-center gap-4 w-full h-full overflow-hidden px-4 py-6">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="w-50 h-20 bg-gray-300 rounded-lg flex-shrink-0 animate-pulse"
        />
      ))}

    </section>
  );
}




export function Footer_Skeleton() {
  return (
    <footer id="footer" className="con_main bg-[#003333] text-white rounded-4xl shadow-2xl animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* Brand Section Skeleton */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="conc  w-10 h-10 rounded-full bg-gray-500" />
              <div className="conc  h-5 w-32 bg-gray-400 rounded" />
            </div>
            <div className="conb h-16 w-full bg-gray-500 rounded mb-2" />
            <div className="flex gap-4">
              <div className="conc w-9 h-9 rounded-full bg-gray-400" />
              <div className="conc w-9 h-9 rounded-full bg-gray-400" />
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div className="space-y-4">
            <div className="conb h-5 w-24 bg-gray-400 rounded mb-2" />
            <ul className="space-y-2">
              <li className="conc h-4 w-32 bg-gray-500 rounded" />
              <li className="conc h-4 w-32 bg-gray-500 rounded" />
              <li className="conc h-4 w-32 bg-gray-500 rounded" />
            </ul>
          </div>

          {/* Contact Info Skeleton */}
          <div className="space-y-4">
            <div className="conb h-5 w-28 bg-gray-400 rounded mb-2" />
            <ul className="space-y-3">
              <li className="h-12 w-full bg-gray-500 rounded" />
              <li className="conc h-6 w-40 bg-gray-500 rounded" />
              <li className="conc h-6 w-36 bg-gray-500 rounded" />
            </ul>
          </div>
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="border-t border-[#027c68] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="conb h-4 w-40 bg-gray-500 rounded mb-2 md:mb-0" />
          <div className="flex gap-6">
            <div className="conc  h-4 w-24 bg-gray-500 rounded" />
            <div className="conc  h-4 w-24 bg-gray-500 rounded" />
            <div className="conc  h-4 w-28 bg-gray-500 rounded" />
          </div>
        </div>

      </div>
    </footer>
  );
}




export function Dashboard_Skeleton() {

  return (
    <section className="con_main w-full h-screen grid grid-cols-[250px_1fr] grid-rows-[80px_1fr] gap-4 p-4 bg-gray-50 animate-pulse">
      
      {/* Sidebar */}
      <div className="conb bg-gray-200 rounded-xl p-4 flex flex-col gap-4 col-start-1 row-start-1 row-end-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="con_b h-8 bg-gray-300 rounded-md"></div>
        ))}
      </div>

      {/* Header */}
      <div className="conb bg-gray-200 rounded-xl p-4 col-start-2 row-start-1 flex items-center justify-between">
        <div className="conc h-6 w-1/4 bg-gray-300 rounded"></div>
        <div className="conc h-6 w-1/6 bg-gray-300 rounded"></div>
      </div>

      {/* Main Content */}
      <div className="conb bg-gray-200 rounded-xl p-6 col-start-2 row-start-2 flex flex-col gap-4">
        <div className="conc h-6 w-1/3 bg-gray-300 rounded"></div>
        <div className="conc h-4 w-full bg-gray-300 rounded"></div>
        <div className="conc h-4 w-full bg-gray-300 rounded"></div>
        <div className="conc h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="conc h-64 w-full bg-gray-300 rounded"></div>
      </div>

    </section>
  );
}



