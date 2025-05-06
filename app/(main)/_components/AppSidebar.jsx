"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus, X } from "lucide-react";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("app-sidebar");
      if (sidebar && !sidebar.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle drag to open/close
  const handleTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
      setSidebarWidth(sidebar.getBoundingClientRect().width);
    }
  };

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const diff = touchX - dragStartX;
    
    // Only respond to right swipes from the left edge
    if (dragStartX < 30 && diff > 50) {
      setIsOpen(true);
    } else if (isOpen && diff < -50) {
      setIsOpen(false);
    }
  };

  // Close on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className="fixed bottom-4 left-4 bg-white p-3 rounded-full shadow-lg z-30 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <span>☰</span>}
      </button>

      {/* Sidebar */}
      <Sidebar
        id="app-sidebar"
        className={`fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Improved Logo Alignment */}
        <SidebarHeader className="flex items-center justify-center py-4 px-4">
          <Image
            src="/Suji.png"
            alt="Suji Logo"
            width={120}
            height={120}
            className="w-[120px] object-contain"
            priority
          />
        </SidebarHeader>

        {/* Consistent Padding */}
        <div className="px-4">
          <Button
            className="w-full cursor-pointer"
            onClick={() => router.push("/dashboard/create-interview")}
          >
            <Plus className="mr-2" />
            Create New Interview
          </Button>
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-3 ${path === option.path && "bg-blue-50"}`}
                  >
                    <Link href={option.path} className="flex items-center gap-3">
                      <option.icon className="w-5 h-5" />
                      <span
                        className={`text-base font-medium ${
                          path == option.path && "text-primary"
                        }`}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
      </Sidebar>
    </>
  );
}

export default AppSidebar;