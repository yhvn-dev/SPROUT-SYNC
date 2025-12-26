"use client";
import { useState } from "react";
import { PieChart, Pie} from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import * as color from "../../utils/colors"

export function UserChartLegend({roleCount,colors}){
  return(
    <>

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

    </>

  )
}



export function RoleChart({ chartData }) {
  const { count = { total_users: 0 }, roleCount = [] } = chartData || {};
  
  const colors = [
    color.setRoleColor.adminColor,
    color.setRoleColor.viewerColor
  ];

  return (
    <div className="flex items-center justify-center flex-col w-auto max-w-[100%] h-full relative">
      <ul className="column absolute top-0 left-0 m-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Role Distribution</h2>
        <p className="text-sm text-gray-600">Number of users based on roles</p>
      </ul>

      <ul className="flex flex-col items-center justify-center absolute rounded-full mb-12 ">
        <p>Total</p>
        <p className="num_data">{count.total_users}</p>
      </ul>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={550} height={430}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="5" dy="10" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
            </filter>
          </defs>

          <Pie
            data={roleCount}
            dataKey="total_users"
            nameKey="role"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`}>
            {roleCount.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                filter="url(#shadow)"
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="center mt-4 gap-12 ">
        {roleCount.map((rc, index) => (
          <div key={rc.role} className="flex items-center justify-start flex-col gap-2">
            <div
              className="w-4 h-4 rounded-sm shadow-md"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm">
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

export function StatusChart({statusData,COLORS}){
  return(
    <>
         {Array.isArray(statusData) && statusData.length > 0 ?(

        <div className="w-full h-full flex scale-80 origin-center items-center justify-center  ">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="total_users" 
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={40}    
                outerRadius={80}
                label={({ status, total_users, percent }) => 
                  `${status}: ${total_users} (${(percent * 100).toFixed(0)}%)`
                }>

                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          
        <div className="w-[20%]">
            {statusData.map((count,index) => (      
                <div  key={count.status || index} className="flex items-start justify-start  py-4">           
                  <div className={`${count.status === "active" ? "bg-[var(--sage)]" : "bg-[var(--acc-darkc)]"} w-5 h-5 rounded-sm shadow-md`}>
                  </div>
                    <span className="ml-2 text-sm text-[var(--acc-darkc)]">{count.status} </span>              
                </div>                
            ))}
        </div>
        
        </div>              
    ) : (
      <p className="text-gray-500 text-center">No status data available</p>
    )}

    </>

  )
}

  
  