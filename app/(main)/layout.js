'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardProvider from './provider';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';


function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="p-10 w-full space-y-6">
        <WelcomeContainer/>
        {children}
      </div>
    </DashboardProvider>
  );
}

export default DashboardLayout;
