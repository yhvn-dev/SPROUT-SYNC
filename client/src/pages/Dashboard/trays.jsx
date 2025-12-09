import { LayoutGrid, Edit2, Trash2 } from 'lucide-react';

function Trays({traysData}) {
  return (
    
    <div className="space-y-3">

     <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <p className="text-2xl">Trays</p>
        </div>
        <div className="h-full w-1/2 flex items-center justify-start flex-row-reverse">
          
        </div>
      </header>


      {/* Tray Template */}
      <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Plant Name</h3>
                <p className="text-sm text-gray-500">Tray ID: 123</p>
              </div>
            </div>
            <div className="ml-13 flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Zone:</span>
                <span className="text-sm font-semibold text-[#7BA591]">Zone Name</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Status:</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Batch ID:</span>
                <span className="text-sm font-semibold text-gray-700">Batch123</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trays;
