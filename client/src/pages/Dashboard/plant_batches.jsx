import React from 'react';
import { TrendingUp, Edit2, Trash2 } from 'lucide-react';

function Plant_batches() {
  // Static placeholders for template
  const deadCount = 10;

  return (
    <div className="space-y-3">


    <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <p className="text-2xl">Batches</p>
        </div>
        <div className="h-full w-1/2 flex items-center justify-start flex-row-reverse">
          <button className="rounded-xl shadow-lg px-4 py-[2px] bg-[var(--sage)] text-[var(--main-white--)] cursor-pointer">
            Add  Batches
          </button>
        </div>
      </header>


      <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Plant Name</h3>
              <p className="text-sm text-gray-500">Batch ID: 1</p>
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Date Planted</p>
            <p className="text-sm font-semibold text-gray-900">01/01/2025</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Expected Harvest</p>
            <p className="text-sm font-semibold text-gray-900">01/03/2025</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Planted</p>
            <p className="text-xl font-bold text-gray-900">100</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Seedlings</p>
            <p className="text-xl font-bold text-[#92e6a7]">60</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Fully Grown</p>
            <p className="text-xl font-bold text-[#25a244]">30</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Dead</p>
            <p className="text-xl font-bold text-red-500">{deadCount}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Replants</p>
            <p className="text-xl font-bold text-orange-500">10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plant_batches;
