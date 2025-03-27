import React, { useState } from "react";
import "./ClientLayout.css";
import HomeIcon from "../../components/icons/HomeIcon";
import ArrowIcon from "../../components/icons/ArrowIcon";
import { useLocation, Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader/AdminHeader";
import ClientSidebar from "../../components/client/ClientSidebar/ClientSidebar";

const ClientLayout = ({ children }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  return (
    <div className="admin-layout">
      {/* Sidebar - Hidden by default on small screens */}
      <div className={`admin-content ${isSidebarOpen ? "visible" : ""}`}>
        <ClientSidebar />
      </div>

      {/* Sidebar Overlay (To close the sidebar on click) */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="admin-main">
        <div className="admin-top">
          <AdminHeader onclickMenu={() => setIsSidebarOpen(!isSidebarOpen)}/>
        </div>

        {/* Breadcrumb Navigation */}
        <main className="admin-children">
          <div className="href-history small-font">
            {pathSegments.length > 0 &&
              pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                const isLast = index === pathSegments.length - 1;
                return (
                  <span key={index}>
                    {index === 0 && (
                      <>
                        <Link className="padding-top-4-px link-history" to={"/"}>
                          <HomeIcon />
                        </Link>
                        <ArrowIcon />
                      </>
                    )}
                    {!isLast ? (
                      <>
                        <Link className="text-align-center link-history padding-bottom-4-px" to={path}>{segment}</Link>
                        <ArrowIcon />
                      </>
                    ) : (
                      <span className="padding-bottom-4-px clickable link">{segment}</span>
                    )}
                  </span>
                );
              })}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
