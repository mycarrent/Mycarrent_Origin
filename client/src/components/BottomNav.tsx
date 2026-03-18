/**
 * BottomNav — Mobile bottom tab navigation
 * Design: Fixed bottom bar with 5 tabs + center FAB, neo-brutalist style
 */
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  ClipboardList,
  BarChart3,
  Car,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/", label: "หน้าหลัก", icon: LayoutDashboard },
  { path: "/history", label: "ประวัติ", icon: ClipboardList },
  { path: "/add", label: "เพิ่ม", icon: Plus, isFab: true },
  { path: "/reports", label: "รายงาน", icon: BarChart3 },
  { path: "/more", label: "เพิ่มเติม", icon: MoreHorizontal, isMore: true },
];

const MORE_ITEMS = [
  { path: "/vehicles", label: "ทะเบียนรถ", icon: Car },
  { path: "/settings", label: "ตั้งค่า", icon: MoreHorizontal },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = ["/vehicles", "/settings"].includes(location);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu popup */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-50 brutal-card p-2 min-w-[160px]"
        >
          {MORE_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setShowMore(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  active ? "bg-foreground text-background" : "hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </motion.div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-[2.5px] border-foreground safe-bottom">
        <div className="max-w-lg mx-auto flex items-end justify-around px-2 pt-1 pb-1">
          {NAV_ITEMS.map((item) => {
            const active = item.isMore ? isMoreActive : location === item.path;
            const Icon = item.icon;

            if (item.isFab) {
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="relative -top-4"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border-[2.5px] border-foreground ${
                        location === item.path
                          ? "bg-foreground text-background"
                          : "bg-card text-foreground"
                      }`}
                      style={{
                        boxShadow:
                          location === item.path
                            ? "none"
                            : "3px 3px 0px oklch(0.15 0.02 280)",
                      }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-medium text-center block mt-0.5">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            }

            if (item.isMore) {
              return (
                <motion.button
                  key="more"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMore(!showMore)}
                  className="flex flex-col items-center py-1.5 px-2 min-w-[52px]"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      active
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            }

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center py-1.5 px-2 min-w-[52px]"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 ${
                      active
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
