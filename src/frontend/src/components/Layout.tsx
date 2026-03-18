import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Library,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import { mockProfile } from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerProfile, useIsCallerAdmin } from "../hooks/useQueries";

type Page = "dashboard" | "resources" | "profile" | "performance" | "admin";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const navItems: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resources", label: "Resource Library", icon: Library },
  { id: "profile", label: "Student Profiles", icon: User },
  { id: "performance", label: "Performance", icon: TrendingUp },
];

export default function Layout({
  currentPage,
  onNavigate,
  children,
}: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: profile } = useGetCallerProfile();
  const [searchQuery, setSearchQuery] = useState("");

  const displayProfile = profile || mockProfile;
  const isLoggedIn = loginStatus === "success" && !!identity;
  const initials = displayProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const allNavItems = isAdmin
    ? [
        ...navItems,
        { id: "admin" as Page, label: "Management", icon: Settings },
      ]
    : navItems;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-navy sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              className="flex items-center gap-3"
              onClick={() => onNavigate("dashboard")}
            >
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                EduPathway
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {allNavItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-ocid={`nav.${item.id}.link`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block relative">
                <Input
                  placeholder="Search materials\u2026"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-ocid="header.search_input"
                  className="w-52 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full text-sm h-9"
                />
              </div>

              <button
                type="button"
                className="relative text-white/80 hover:text-white p-2"
                data-ocid="header.notification.button"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
              </button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-ocid="header.user_menu.button"
                      className="flex items-center gap-2 text-white/80 hover:text-white rounded-lg px-2 py-1 hover:bg-white/10 transition-colors"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium">
                        {displayProfile.name}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    data-ocid="header.user_menu.dropdown_menu"
                  >
                    <DropdownMenuItem
                      onClick={() => onNavigate("profile")}
                      data-ocid="user_menu.profile.link"
                    >
                      <User className="w-4 h-4 mr-2" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onNavigate("performance")}
                      data-ocid="user_menu.performance.link"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" /> Performance
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={clear}
                      data-ocid="user_menu.logout.button"
                      className="text-destructive"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-ocid="header.login.button"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full text-sm"
                  disabled={loginStatus === "logging-in"}
                >
                  {loginStatus === "logging-in"
                    ? "Signing in\u2026"
                    : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy text-white/70 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg">EduPathway</span>
              </div>
              <p className="text-sm leading-relaxed">
                Personalized learning that adapts to your unique style and
                goals.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("resources")}
                    className="hover:text-white transition-colors"
                  >
                    Resource Library
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("performance")}
                    className="hover:text-white transition-colors"
                  >
                    Performance
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Subjects</h3>
              <ul className="space-y-2 text-sm">
                <li>Mathematics</li>
                <li>Computer Science</li>
                <li>Physics &amp; Chemistry</li>
                <li>History &amp; Social Studies</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
