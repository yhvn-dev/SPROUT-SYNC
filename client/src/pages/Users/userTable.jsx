
export function UserTable({ users, setOpen, setMode, setSelectedUser }) {
  return (
    <div className=" w-full">

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="user_table_div hidden md:block max-h-[70vh] overflow-y-auto overflow-x-auto ">
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
                <td className="u_td">          
                    {u.username}
                </td>
                <td className="u_td">                              
                    <p className="ml-3 truncate">{u.fullname}</p>              
                </td>
                <td className="u_td">{u.email}</td>
                <td className="u_td">{u.phone_number}</td>
                <td className="u_td text-sm text-center ">
                  <p className={u.role === "admin" ? "admin_color" : "viewer_color"}>
                    {u.role}
                  </p>
                </td>
                

                
                <td className="u_td">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => {
                        setSelectedUser(u);
                        setOpen(true);
                        setMode("update");
                      }}
                      className="
                        cursor-pointer
                        text-xs
                        px-2.5 py-1
                        rounded-md
                        bg-[var(--purpluish--)]
                      text-white
                        shadow
                        hover:shadow-md
                        transition">
                      UPDATE
                    </button>

                    {u.role.toLowerCase() === "viewer" && (
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setOpen(true);
                          setMode("delete");
                        }}
                        className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition"
                      >
                        DELETE
                      </button>
                    )}


                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




      {/* ================= MOBILE CARD VIEW (SCROLLABLE) ================= */}
      <div className="conb md:hidden w-full">


        
        {/* SCROLL CONTAINER */}
        <div className="conb max-h-[70vh]  pr-1">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="conb bg-white rounded-lg shadow-md p-4 mb-4">

              {/* HEADER */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
              
                    <h3 className="text-base font-semibold truncate">
                      {u.fullname}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    @{u.username}
                  </p>
                </div>
              </div>





              {/* DETAILS */}
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
                  <p
                    className={`text-sm ${
                      u.role === "admin"
                        ? "admin_color"
                        : "viewer_color"
                    }`}
                  >
                    {u.role}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setOpen(true);
                    setMode("update");
                  }}
                  className="
                    cursor-pointer
                    text-xs
                    px-2.5 py-1
                    rounded-md
                    bg-[var(--purpluish--)]
                  text-white
                    shadow
                    hover:shadow-md
                    transition"
                >
                  UPDATE
                </button> 

                {u.role.toLowerCase() === "viewer" && (
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setOpen(true);
                      setMode("delete");
                    }}
                    className="cursor-pointer text-xs px-2.5 py-1 rounded-md bg-[var(--color-danger-a)] text-white shadow hover:shadow-md transition"
                  >
                    DELETE
                  </button>
                )}

      
              </div>


            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
