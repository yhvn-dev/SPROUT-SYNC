
import * as Charts from "./charts"

export function UserInsights({chartData,refreshChart}){

return(
    <section className="rounded-[10px] full gap-8 shadow-lg">    
        <div className="full  bg-white md:items-center md:justify-center  shadow-lg rounded-[10px]">
            <Charts.RoleChart chartData={chartData} />
        </div>
    </section>
    )
}