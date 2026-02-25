import * as Charts from "./charts";

export function UserInsights({ chartData, refreshChart, statusData }) {
  const COLORS = ['#7BA591', '#6b7070'];

  return (
    <>

      
      {/* Two-column layout */}
      <main className="grid h-full w-full grid-cols-1  gap-4 md:gap-6">


        {/* LEFT COLUMN — Role Chart */}
        <div className="conb bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4">
          <Charts.RoleChart chartData={chartData} />
        </div>
      </main>

          
    </>

  );
}
