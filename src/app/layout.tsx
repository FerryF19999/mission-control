'use client';
import './globals.css';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Film, 
  Shield, 
  Users, 
  Calendar, 
  FolderKanban, 
  Brain, 
  FileText, 
  UserCircle, 
  Building,
  UsersRound,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { name: '🤖 Chat', href: '/chat', icon: MessageSquare },
  { name: '📋 Tasks', href: '/tasks', icon: CheckSquare },
  { name: '🧠 Memory', href: '/memory', icon: Brain },
  { name: '👥 Team', href: '/team', icon: UsersRound },
  { name: '📝 Content', href: '/content', icon: Film },
  { name: '📁 Projects', href: '/projects', icon: FolderKanban },
  { name: '📅 Calendar', href: '/calendar', icon: Calendar },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#0a0a0a] text-white">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-[#111111] border-r border-[#2a2a2a]
            transform transition-transform duration-200
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 p-4 border-b border-[#2a2a2a]">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Mission Control</h1>
                <p className="text-xs text-zinc-500">OpenClaw Hub</p>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="ml-auto lg:hidden p-1 hover:bg-zinc-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-150
                      ${isActive 
                        ? 'bg-zinc-800 text-white' 
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                  F
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Ferry</p>
                  <p className="text-xs text-zinc-500">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Mobile header */}
          <header className="lg:hidden flex items-center gap-3 p-4 border-b border-[#2a2a2a] bg-[#111111]">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold">Mission Control</h1>
          </header>

          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
