"use client";

import { PieChart, Pie} from "recharts";
import {  Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as color from "../../utils/colors"


export function UserChartLegend({roleCount,colors}){
  return(
    <div className="space-y-1">
      {roleCount.map((rc, index) => (
        <div key={rc.role} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span>
            {rc.role}: {rc.total_users}
          </span>
        </div>
      ))}
    </div>
  )
}




export function RoleChart({ chartData }) {
  const { count = { total_users: 0 }, roleCount = [] } = chartData || {};

  const COLORS = [
    color.setRoleColor.adminColor,
    color.setRoleColor.viewerColor,
  ];

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6 h-full">

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Role Distribution
        </h2>
        <p className="text-sm text-gray-500">
          Number of users based on roles
        </p>
      </div>

      {/* CHART */}
      <div className="relative w-full min-h-[320px]">
        {/* CENTER LABEL */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-2xl font-semibold text-gray-900">
            {count.total_users}
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roleCount}
              dataKey="total_users"
              nameKey="role"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
            >
              {roleCount.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 flex-wrap">
        {roleCount.map((rc, index) => (
          <div key={rc.role} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm shadow"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">
              {rc.role}: {rc.total_users}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}





export function chartBg({}){
  <PieChart width={450} height={230}></PieChart>
}




export function StatusChart({ statusData, COLORS }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-6 h-full">

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          User Status
        </h2>
        <p className="text-sm text-gray-500">
          Current activity breakdown
        </p>
      </div>

      {/* CHART */}
      <div className="relative w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="total_users"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={3}
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 flex-wrap">
        {statusData.map((item, index) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm shadow"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-700 capitalize">
              {item.status}: {item.total_users}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}




