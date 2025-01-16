"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  ChevronUp,
  User2,
  CreditCard,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/users";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    label: "Todos",
    icon: CheckSquare,
    href: "/dashboard/todos",
    color: "text-sky-500",
  },
  {
    label: "Prioritäten",
    icon: ListFilter,
    href: "/dashboard/priorities",
    color: "text-orange-500",
  },
  {
    label: "Users",
    icon: Users,
    href: "/dashboard/users",
    color: "text-violet-500",
  },
  {
    label: "Checkup",
    icon: ClipboardCheck,
    href: "/dashboard/checkup",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-pink-700",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <Card className="h-full rounded-none border-0 bg-muted/40">
      <CardHeader className="pb-4">
        <Link href="/dashboard">
          <CardTitle className="text-2xl font-bold">TaskMaster Pro</CardTitle>
        </Link>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="flex flex-col h-[calc(100vh-140px)] justify-between p-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={route.href}>
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User2 className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">{user?.name || 'User'}</span>
                <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account" className="flex items-center">
                  <User2 className="h-4 w-4 mr-2" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/logout" className="flex items-center text-red-500 hover:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}