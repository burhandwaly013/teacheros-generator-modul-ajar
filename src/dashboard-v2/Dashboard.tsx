import React from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import DashboardHome from "./pages/DashboardHome";


const Dashboard: React.FC = () => {

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar />


      {/* MAIN AREA */}
      <div className="flex-1">

        <Header />


        <main
          className="
            p-6
          "
        >

          <DashboardHome />

        </main>

      </div>

    </div>
  );
};


export default Dashboard;