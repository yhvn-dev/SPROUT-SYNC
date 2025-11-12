 
import { LogOut } from 'lucide-react'

export function Logout({onOpen}) {

return (
  <>
      <button className="flex items-center gap-2 py-1 w-full transition-colors duration-300 rounded-[10px] 
    hover:bg-[var(--pal2-whiteb)] hover:text-[var(--acc-darkb)]" onClick={onOpen}>
         <LogOut className="mx-2" strokeWidth={1.5} size={16} />
          <p className='text-sm'>Logout</p>
      </button>

     </>
)

}
