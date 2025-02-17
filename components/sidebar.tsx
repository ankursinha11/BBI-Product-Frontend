"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Database,
  FileEdit,
  Home,
  LayoutDashboard,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Schema Changes",
    href: "/dashboard/ddl",
    icon: Database,
  },
  {
    name: "Feed Management",
    href: "/dashboard/feeds",
    icon: Home,
    children: [
      {
        name: "New Feed",
        href: "/dashboard/feeds/new",
        icon: Plus,
      },
      {
        name: "Edit Feeds",
        href: "/dashboard/feeds/edit",
        icon: FileEdit,
      },
      {
        name: "Remove Feeds",
        href: "/dashboard/feeds/remove",
        icon: Trash2,
      },
    ],
  },
  {
    name: "Migration",
    href: "/dashboard/migration",
    icon: Package,
  },
  {
    name: "Configure ABC",
    href: "/dashboard/configureABC",
    icon: Plus,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#000B2E]/80 backdrop-blur-xl border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="block">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BBI_Logo_White-B1geXfwkPqABQuJWmxC14tT8vx6ueV.png"
              alt="BBi Logo"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                  pathname === item.href
                    ? "bg-white/10 text-blue-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-white hover:bg-white/5 hover:text-blue-300"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                        pathname === child.href
                          ? "bg-white/10 text-blue-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "text-white hover:bg-white/5 hover:text-blue-300"
                      )}
                    >
                      <child.icon className="w-4 h-4" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
