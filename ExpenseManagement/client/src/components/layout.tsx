import { Link, useLocation } from "wouter";
import { PieChart, LayoutDashboard, Wallet, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/expenses", label: "Transactions", icon: Wallet },
    { href: "/reports", label: "Reports", icon: PieChart },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground tracking-tight">
            PennyWise
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 translate-x-1" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
                    }
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="font-semibold text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-border/40 fixed h-full bg-card/50 backdrop-blur-xl z-20">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
