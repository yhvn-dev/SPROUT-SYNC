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

export function RoleChart({chartData}) {
 const { count, roleCount } = chartData || {};
 
  const colors = [color.setRoleColor.adminColor,
                  color.setRoleColor.viewerColor];

  return (
    <div className="flex items-center justify-center flex-col w-auto max-w-[100%] h-full relative">

      <ul className="column absolute top-0 left-0 m-4">
        
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Role Distribution</h2>
          <p className="text-sm text-gray-600">
            Number of user base on roles
          </p>
      </ul>
      
      <ul className="flex flex-col items-center justify-center absolute rounded-full mb-12 ">
          <p className="">Total</p>
          <p className="num_data">{count?.total_users ?? 0}</p>
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
            label={({ role, total_users }) => `${role}: ${total_users}`}>
              
            {Array.isArray(roleCount) && roleCount.map((entry, index) => (
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
                className="w-4 h-4 rounded-sm shadow-md"style={{ backgroundColor: colors[index % colors.length] }}
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









const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-100 ">
        <p className="text-sm font-semibold text-gray-800">{payload[0].payload.username}</p>
        <p className="text-xs text-gray-600 mt-1">
          Logins: <span className="font-bold" style={{ color: '#027c68' }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};



export function LoginsBarChart() {

    const initialData = [
    { username: 'User 1', logins: 45 },
    { username: 'User 2', logins: 32 },
    { username: 'User 3', logins: 78 },
    { username: 'User 4', logins: 23 },
    { username: 'User 5', logins: 91 },
    { username: 'User 6', logins: 56 },
    { username: 'User 7', logins: 67 },
    { username: 'User 8', logins: 12 },
    { username: 'User 9', logins: 43 },
    { username: 'User 10', logins: 89 },
    { username: 'User 11', logins: 34 },
    { username: 'User 12', logins: 95 },
  ];

  const [data] = useState(initialData);
  const maxUser = data.reduce((max, user) => user.logins > max.logins ? user : max, data[0]);


  return (
    <div className="rounded-2xl bg-white backdrop-blur-[100px] shadow-lg p-6 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Logins per User</h2>
        <p className="text-sm text-gray-600">
          Track login activity across all users
        </p>
        <div className="mt-3 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: '#E8F3ED' }}>
          <p className="text-sm font-medium" style={{ color: '#003333' }}>
            💡 <span style={{ color: '#027c68' }} className="font-bold">{maxUser.username}</span> has the most active sessions with <span className="font-bold">{maxUser.logins} logins</span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350} >
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8F3ED" />
          <XAxis 
            dataKey="username" 
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: '#5A8F73', fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Number of Logins', angle: -90, position: 'insideLeft', fill: '#5A8F73' }}
            tick={{ fill: '#5A8F73', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8F3ED', opacity: 0.5 }} />
          <Bar 
            dataKey="logins" 
            radius={[8, 8, 0, 0]}
            maxBarSize={60}>

            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.username === maxUser.username ? '#027c68' : '#7BA591'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className=" flex items-center justify-center gap-6 text-sm ">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7BA591' }}></div>
          <span className="text-gray-600">Regular Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#027c68' }}></div>
          <span className="text-gray-600">Most Active User</span>
        </div>
      </div>
    </div>
    ) 
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

  
  