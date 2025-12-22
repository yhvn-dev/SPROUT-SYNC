  import { useEffect, useState, useContext } from 'react';
  import * as userService from "../../data/userService";
  import { UserContext } from '../../hooks/userContext';

  import { Sidebar } from "../../components/sidebar";
  import { Db_Header } from "../../components/db_header";
  import { Workspace } from "./workspace";
  import { UserInsights } from './userInsights';
  import { Notif_Modal } from '../../components/notifModal';

  import { Menu } from "lucide-react";
  import "./users.css";

  function Users() {
    const { user } = useContext(UserContext);
    const [chartData, setChartData] = useState({ count: { total_users: 0 }, roleCount: [] });
    const [statusData, setStatusData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [activeTab, setActiveTab] = useState('Overview');
    const [isNotifOpen, setNotifOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // <-- mobile sidebar toggle

    const token = localStorage.getItem("accessToken");

    // Fetch chart data
    const fetchChartData = async () => {
      try {
        const [userCount, userCountByRole] = await Promise.all([
          userService.getUsersCount(),
          userService.getUsersCountByRole(),
        ]);

        setChartData({
          count: userCount,
          roleCount: userCountByRole.map(rc => ({
            role: rc.role,
            total_users: Number(rc.total_users)
          }))
        });
      } catch (err) {
        console.error("Error Fetching Chart");
      }
    };

    const fetchStatusData = async () => {
      try {
        const userCountByStatus = await userService.getUsersByStatus();
        setStatusData(userCountByStatus.map(sc => ({
          status: sc.status,
          total_users: Number(sc.total_users || 0)
        })));
      } catch (err) {
        console.error("Error Fetching Status Data");
      }
    };

    useEffect(() => {
      fetchChartData();
      fetchStatusData();
    }, [token]);

    const handleSearchChange = (e) => {
      setSearchValue(e.target.value);
    };

    return (
    <section className="users grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr] 
      grid-rows-[8vh_10vh_200vh] md:grid-rows-[8vh_10vh_82vh] gap-4 h-[100vh] w-full overflow-x-hidden overflow-y-auto 
      relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg"
        >
          <Menu size={22} className="text-[var(--acc-darkb)]" />
        </button>

        {/* ================= MOBILE OVERLAY ================= */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`${
            sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"
          } md:static md:block`}
        >
          <Sidebar user={user} />
        </aside>

        {/* ================= HEADER ================= */}
        <Db_Header
          input={
            <div className="form_box center h-full">
              <input
                className="border-[1px] border-[var(--acc-darkc)] rounded-2xl px-4"
                onChange={handleSearchChange}
                type="text"
                value={searchValue}
                placeholder="Search for Users"
              />
            </div>
          }
          setNotifOpen={setNotifOpen}
        />

        {/* ================= TAB NAVIGATION ================= */}
        <div className='flex col-start-2 col-span-full row-start-2 row-end-2 my-4'>
          <button
            onClick={() => setActiveTab("Overview")}
            className={`cursor-pointer ${activeTab === "Overview" ? "bg-white text-[#027c68] shadow-md" : "bg-white/50 text-[#5A8F73] hover:bg-white/70"} mr-2 px-6 py-2 text-sm rounded-lg transition-all duration-200`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("User Insights")}
            className={`cursor-pointer ${activeTab === "User Insights" ? "bg-white text-[#027c68] shadow-md" : "bg-white/50 text-[#5A8F73] hover:bg-white/70"} ml-2 px-6 py-2 text-sm rounded-lg transition-all duration-200`}
          >
            User Insights
          </button>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className='w-full h-full col-start-2 col-span-full row-start-3 row-span-full rounded-lg'>
          {activeTab === "Overview"
            ? <Workspace
                refreshChart={fetchChartData}
                refreshStatus={fetchStatusData}
                searchValue={searchValue}
                userCount={chartData.count.total_users}
                statusData={statusData}
              />
            : <UserInsights chartData={chartData} />
          }
        </main>

        {/* ================= NOTIFICATION MODAL ================= */}
        {isNotifOpen && (
          <Notif_Modal
            isOpen={isNotifOpen}
            onClose={() => setNotifOpen(false)}
          />
        )}

      </section>
    );
  }

  export default Users;
