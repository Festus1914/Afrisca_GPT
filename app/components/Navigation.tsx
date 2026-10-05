"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Chat", icon: "💬" },
    { href: "/image-generation", label: "Generate", icon: "🎨" },
    { href: "/image-editor", label: "Edit", icon: "✏️" },
    { href: "/image-analysis", label: "Analyze", icon: "🔍" },
    { href: "/writing-tools", label: "Write", icon: "✍️" },
  ];

  return (
    <nav className="nav-container sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">A</div>
          <span className="hidden sm:inline">Afrisca GPT</span>
        </Link>

        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-white bg-[#10a37f]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden">{item.icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
