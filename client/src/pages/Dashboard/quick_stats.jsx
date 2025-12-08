export function Quick_Stats({data_box}) {
  return (
    
    <section className="numbers flex flex-col w-full 
    justify-start items-center p-t gap-[1rem] col-start-2 col-end-5 rounded-[10px] ">
        <div className="flex flex-col items-start justify-start w-full h-[10%]">
            <p className='text-2xl font-semibold'>Quick Stats</p>
        </div>
        <div className="flex items-center justify-evenly w-full h-full gap-4">
          {data_box}
        </div>
      
    </section>

  )
}
