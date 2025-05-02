"use client"; 

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
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react';
import { useRouter } from "next/navigation"; // Only keep ONE import

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  console.log(path);

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center mt-6 mb-4">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          width={120}
          height={120}
          className="w-[120px] object-contain"
        />
      </SidebarHeader>

      <div className="px-4">
        <Button className="w-full mt-2 cursor-pointer" onClick={() => router.push('/dashboard/create-interview')}>
          <Plus className="mr-2" />
          Create New Interview
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton asChild className={`p-3 ${path === option.path && 'bg-blue-50'}`}>
                  <Link href={option.path} className="flex items-center gap-3">
                    <option.icon className="w-5 h-5" />
                    <span className={`text-base font-medium ${path == option.path && 'text-primary'}`}>{option.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;