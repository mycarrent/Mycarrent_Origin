/**
 * LoadingScreen — Full-screen loading state with brand
 */
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-[2.5px] border-foreground"
          style={{ boxShadow: "4px 4px 0px oklch(0.15 0.02 280)" }}
        >
          MCR
        </div>
        <h1 className="text-xl font-bold mb-1">My Car Rent</h1>
        <p className="text-sm text-muted-foreground">กำลังโหลด...</p>
        <motion.div
          className="w-12 h-1 bg-foreground rounded-full mx-auto mt-4"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
