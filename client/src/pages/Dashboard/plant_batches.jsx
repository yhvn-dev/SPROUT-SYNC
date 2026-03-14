import { TrendingUp, Search } from "lucide-react";
import { useState } from "react";
import { getStageColor, getHarvestStatusColor } from "../../utils/colors";
import { formatDateOnly } from "../../utils/formatDates";

function Plant_batches({ setMsg, batchesData, setSelectedBatches, setBatchModalOpen, setBatchModalMode }) {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("");

  const handleUpdateBatches = (batch) => {
    setSelectedBatches({ ...batch });
    setBatchModalMode("update");
    setBatchModalOpen(true);
  };

  const handleDeleteBatches = (batch) => {
    const hasData = batch.fully_grown_seedlings > 0 || batch.dead_seedlings > 0 || batch.replanted_seedlings > 0;
    if (!hasData) {
      setMsg("Cannot delete this batch. Update the batch data first before deleting");
      return;
    }
    setSelectedBatches({ ...batch });
    setBatchModalMode("delete");
    setBatchModalOpen(true);
  };

  // SEARCH — filter by plant name
  const searchedBatches = batchesData.filter((pb) =>
    pb.plant_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // SORT — sort based on selected category
  const filteredBatches = [...searchedBatches].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === "plant_name") return a.plant_name.localeCompare(b.plant_name);
    if (sortBy === "total_seedlings") return a.total_seedlings - b.total_seedlings;
    if (sortBy === "fully_grown_seedlings") return a.fully_grown_seedlings - b.fully_grown_seedlings;
    if (sortBy === "dead_seedlings") return (a.dead_seedlings ?? 0) - (b.dead_seedlings ?? 0);
    if (sortBy === "replanted_seedlings") return a.replanted_seedlings - b.replanted_seedlings;
    if (sortBy === "growth_stage") return a.growth_stage.localeCompare(b.growth_stage);
    if (sortBy === "harvest_status") return a.harvest_status.localeCompare(b.harvest_status);
    if (sortBy === "date_planted") return new Date(a.date_planted) - new Date(b.date_planted);
    if (sortBy === "expected_harvest_days") return a.expected_harvest_days - b.expected_harvest_days;
    return 0;
  });

  return (
    <main className="batch_table_main space-y-3">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="h-full w-1/2 flex items-center justify-start">
          <TrendingUp className="mr-4" size={24} />
          <p className="text-2xl">Batches</p>
        </div>

        {/* Search + Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plant name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#027c68] focus:border-[#027c68]"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm rounded-md border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#027c68] focus:border-[#027c68] text-gray-600"
          >
            <option value="">Sort by...</option>
            <option value="plant_name">Plant Name</option>
            <option value="total_seedlings">Total Seedlings</option>
            <option value="fully_grown_seedlings">Grown</option>
            <option value="replanted_seedlings">Replanted</option>
            <option value="dead_seedlings">Dead</option>
            <option value="growth_stage">Stage</option>
            <option value="harvest_status">Harvest Status</option>
            <option value="date_planted">Date Planted</option>
            <option value="expected_harvest_days">Harvest Days</option>
          </select>
        </div>
      </header>

      <div className="batch_table h-[350px] overflow-y-auto pr-2 space-y-3">
        <table className="batch_table w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Plant Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Grown</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Replanted</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Dead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Date Planted</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Day/s</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          {filteredBatches.length === 0 && (
            <tbody>
              <tr>
                <td colSpan="100%" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <TrendingUp size={48} className="mb-3 opacity-50" />
                    <p className="text-lg font-medium">No batches found</p>
                    <p className="text-sm">Create a batch to start tracking plants</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {filteredBatches.length > 0 && filteredBatches.map((pb, index) => (
            <tbody key={pb.batch_id} className="divide-y divide-gray-200">
              <tr
                className={`pb_tr hover:bg-[#E8F3ED] transition-colors
                  ${index % 2 === 0
                    ? "bg-white dark:bg-[var(--metal-dark4)]"
                    : "bg-[#f0f9f5] dark:bg-[var(--metal-dark5)]"
                  }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#027c68] flex">
                  <p>[{pb.batch_number}]</p>{pb.plant_name}
                </td>
                <td className="px-4 py-3 text-sm text-center font-semibold">{pb.total_seedlings}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="fully_grown_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {pb.fully_grown_seedlings}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="replanted_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {pb.replanted_seedlings}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  {pb.dead_seedlings === null ? "" :
                    <span className="dead_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {pb.dead_seedlings}
                    </span>
                  }
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className="bh_growth_stage inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getStageColor(pb.growth_stage) }}>
                    {pb.growth_stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                  <span className="bh_growth_stage inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getHarvestStatusColor(pb.harvest_status) }}>
                    {pb.harvest_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                  {formatDateOnly(pb.date_planted)}
                </td>
                <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                  {pb.expected_harvest_days}
                </td>
                <td className="flex gap-4 px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                  <button
                    onClick={() => handleUpdateBatches(pb)}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--purpluish--)] text-white shadow hover:bg-[var(--bluis--)]">
                    UPDATE
                  </button>
                  <button
                    onClick={() => handleDeleteBatches(pb)}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:bg-red-500">
                    DELETE
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </main>
  );
}

export default Plant_batches;