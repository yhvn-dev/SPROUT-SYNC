import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pfp = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='40'%3EU%3C/text%3E%3C/svg%3E";

export function UserTable({ users, setOpen, setMode, setSelectedUser }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;
  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr>
              <th className="p-3 bg-[var(--sage)] text-white text-left">Username</th>
              <th className="p-3 bg-[var(--sage)] text-white text-left">Fullname</th>
              <th className="p-3 bg-[var(--sage)] text-white text-left">Email</th>
              <th className="p-3 bg-[var(--sage)] text-white text-left">Phone Number</th>
              <th className="p-3 bg-[var(--sage)] text-white text-left">Role</th>
              <th className="p-3 bg-[var(--sage)] text-white text-center">Action</th>
            </tr>
          </thead>

          <tbody className="userTbody">
            {users.map((u) => (
              <tr className="u_tr" key={u.user_id}>
                <td className="u_td p-3">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        u.status === "active" ? "bg-[var(--ptl-greenb)]" : "bg-[var(--acc-darkc)]"
                      }`}
                    ></div>
                    <span className="truncate">{u.username}</span>
                  </div>
                </td>

                <td className="u_td p-3">
                  <div className="flex items-center">
                    <img
                      src={u.profile_picture || Pfp}
                      alt="profile"
                      className="h-12 w-12 object-cover rounded-full"
                    />
                    <p className="ml-3 truncate">{u.fullname}</p>
                  </div>
                </td>

                <td className="u_td p-3">{u.email}</td>
                <td className="u_td p-3">{u.phone_number}</td>

                <td className="u_td p-3">
                  <p className={u.role === "admin" ? "admin_color" : "viewer_color"}>
                    {u.role}
                  </p>
                </td>

                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setSelectedUser(u); setOpen(true); setMode("update"); }}
                      className="rounded-xl px-4 py-2 shadow-lg bg-[var(--white-blple--)] text-white text-sm"
                    >
                      UPDATE
                    </button>
                    <button
                      onClick={() => { setSelectedUser(u); setOpen(true); setMode("delete"); }}
                      className="rounded-xl px-4 py-2 shadow-lg bg-[var(--color-danger-b)] text-white text-sm"
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




      {/* Mobile Card View */}
      <div className="md:hidden w-full">
        {currentUsers.map((u) => (
          <div key={u.user_id} className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <img
                src={u.profile_picture || Pfp}
                alt="profile"
                className="h-16 w-16 object-cover rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      u.status === "active" ? "bg-[var(--ptl-greenb)]" : "bg-[var(--acc-darkc)]"
                    }`}
                  ></div>
                  <h3 className="text-base font-semibold truncate">{u.fullname}</h3>
                </div>
                <p className="text-sm text-gray-500 truncate">@{u.username}</p>
              </div>
            </div>



            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm break-all">{u.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                <p className="text-sm">{u.phone_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className={`text-sm ${u.role === "admin" ? "admin_color" : "viewer_color"}`}>
                  {u.role}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => { setSelectedUser(u); setOpen(true); setMode("update"); }}
                className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--purpluish--) text-white shadow hover:shadow-md transition">
                UPDATE
              </button>
              <button
                onClick={() => { setSelectedUser(u); setOpen(true); setMode("delete"); }}
                className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a) text-white shadow hover:shadow-md transition"  >
                DELETE
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[var(--sage)] text-white'
              }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i;
                } else if (currentPage === 0) {
                  pageNum = i;
                } else if (currentPage === totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-[var(--sage)] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === totalPages - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[var(--sage)] text-white'
              }`}>
                
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}