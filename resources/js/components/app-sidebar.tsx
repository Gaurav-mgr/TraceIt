import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Forklift } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        url: '/inventory',
        icon: Forklift,
    }
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-[#17201b] rounded-r-xl">
                <SidebarHeader className="bg-[#17201b]">
                    <SidebarMenu className="hover:bg-[#17201b]">
                        <SidebarMenuItem>
                            <SidebarMenuButton size="xl" asChild>
                                <Link href="/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

            <SidebarContent className="bg-[#17201b] text-white">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-[#17201b] text-white">
                <NavFooter items={footerNavItems} className="mt-auto"  />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
