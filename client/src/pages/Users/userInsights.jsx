
import * as Charts from "./charts"

export function UserInsights({chartData,refreshChart}){
    

    return(<>
        <section className="w-full h-full rounded-[10px] flex items-center  justify-center full gap-8  bg-white shadow-lg">
         
            <div className="full bg-white shadow-lg rounded-[10px]">
                <Charts.RoleChart chartData={chartData} />
            </div>

        </section>
    </>)



}