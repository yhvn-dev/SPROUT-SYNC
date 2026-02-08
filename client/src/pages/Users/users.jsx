  import { useEffect, useState, useContext } from 'react';
  import * as userService from "../../data/userService";
  import { UserContext } from '../../hooks/userContext';

  import { Sidebar } from "../../components/sidebar";
  import { Db_Header } from "../../components/db_header";
  import { Workspace } from "./workspace";
  import { UserInsights } from './userInsights';
  import { Notif_Modal } from '../../components/notifModal';
  import { LogoutModal } from '../../components/logoutModal';
  import  InfosModal  from "../../components/infosModal"

  import { Menu,CircleQuestionMark } from "lucide-react";

  import "./users.css";

  function Users() {
    const { user } = useContext(UserContext);
    const [chartData, setChartData] = useState({ count: { total_users: 0 }, roleCount: [] });
    const [statusData, setStatusData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [activeTab, setActiveTab] = useState('Overview');
    const [isNotifOpen, setNotifOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [isInfoModalOpen,setInfoModalOpen] = useState(false);
    const [infoModalPurpose,setInfoModalPurpose] = useState("");
    
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
        console.log("USER COUNT BY STATUS",userCountByStatus)
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


    const handleOpenInfosModalUsers = () =>{
        setInfoModalPurpose("users")
        setInfoModalOpen(true)
    }






    
    return (
      <section className="con_main users grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr] 
        grid-rows-[8vh_10vh_200vh] md:grid-rows-[8vh_10vh_82vh] gap-4 h-[100vh] w-full overflow-x-hidden overflow-y-auto  md:overflow-hidden 
        relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="conb md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg">
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
            <Sidebar user={user}  setLogoutOpen={setLogoutOpen}   />
          </aside>

          {/* ================= HEADER ================= */}
          <div className='col-start-1 col-span-full md:col-start-2'>

            <Db_Header
              input={
                <div className="form_box center h-full flex-grow-1  ">
                  <input
                    className="border-[1px] w-full md:w-1/2 border-[var(--acc-darkc)] rounded-2xl px-4"
                    onChange={handleSearchChange}
                    type="text"
                    value={searchValue}
                    placeholder="Search for Users"
                  />
                </div>
              }
              setNotifOpen={setNotifOpen}
            />
          </div>
            
            
          {/* ================= TAB NAVIGATION ================= */}
          <nav className='users_nav flex col-start-1 col-span-full md:col-start-2  row-start-2 row-end-2 my-4'>
            <div className='w-full'>
                <button
                onClick={() => setActiveTab("Overview")}
                className={`
                  cursor-pointer flex-1 md:flex-none
                  px-6 py-2 text-sm rounded-lg transition-all duration-200
                  mr-2
                  ${
                    activeTab === "Overview"
                      ? "bg-white text-[#027c68] shadow-md active"  
                      : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
                  }
                `}>            
                Overview
              </button>

              <button
                onClick={() => setActiveTab("User Insights")}
                className={`
                  cursor-pointer flex-1 md:flex-none
                  px-6 py-2 text-sm rounded-lg transition-all duration-200
                  ml-2
                  ${
                    activeTab === "User Insights"
                      ? "bg-white text-[#027c68] shadow-md active" // ← add active class here
                      : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
                  }
                `}>
                User Insights
              </button>
            </div>
            
            <div className='w-1/3 flex items-center justify-end'>
              <CircleQuestionMark onClick={handleOpenInfosModalUsers} className='mr-4 w-4 h-4 cursor-pointer'/>            
            </div>
        
          </nav>




          {/* ================= MAIN CONTENT ================= */}
          <main className='w-full h-full 
          col-start-1 md:col-start-2 col-span-full row-start-3 row-span-full rounded-lg'>
            {activeTab === "Overview"
              ? <Workspace
                  refreshChart={fetchChartData}
                  refreshStatus={fetchStatusData}
                  searchValue={searchValue}
                  userCount={chartData.count.total_users}
                  statusData={statusData}
                />
              : <UserInsights chartData={chartData} statusData={statusData} />
            }
          </main>

          {/* ================= NOTIFICATION MODAL ================= */}
          {isNotifOpen && (
            <Notif_Modal
              isOpen={isNotifOpen}
              onClose={() => setNotifOpen(false)}
            />
          )}

          {logoutOpen && (
            <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
          )}


          {isInfoModalOpen &&
          <InfosModal
            isInfosModalOpen={isInfoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            purpose={infoModalPurpose}  
          />
        }
      
    



        </section>
    );
  }

  export default Users;
