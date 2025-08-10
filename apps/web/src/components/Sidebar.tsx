"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Médias", href: "/media", icon: "📹" },
  { name: "Clips", href: "/clips", icon: "✂️" },
  { name: "Rendus", href: "/renditions", icon: "🎬" },
  { name: "Templates", href: "/templates", icon: "📝" },
  { name: "Publications", href: "/posts", icon: "📊" },
  { name: "Intégrations", href: "/integrations", icon: "⚙️" },
  { name: "Équipes", href: "/teams", icon: "👥" },
  { name: "Favoris", href: "/favorites", icon: "❤️" },
  { name: "Tags", href: "/tags", icon: "🏷️" },
  { name: "Collections", href: "/collections", icon: "📁" },
  { name: "Métriques", href: "/metrics", icon: "📈" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🎬</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Reelgen
            </span>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "mr-3 flex-shrink-0 text-lg",
                    isActive
                      ? "text-purple-500"
                      : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  )}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
