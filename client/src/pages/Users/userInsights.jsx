import * as Charts from "./charts";

export function UserInsights({ chartData, refreshChart, statusData }) {
  const COLORS = ['#7BA591', '#6b7070'];

  return (
    <section className="w-full h-full overflow-hidden md:overflow-y-auto">
      
      {/* Two-column layout */}
      <main className="grid h-full w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">


        {/* LEFT COLUMN — Role Chart */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4">
          <Charts.RoleChart chartData={chartData} />
        </div>
        {/* RIGHT COLUMN — User Status */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">    
            <Charts.StatusChart statusData={statusData} COLORS={COLORS} />    
        </div>



      </main>
    </section>
  );
}
