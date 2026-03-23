/**
 * Settings Page — App info, seed sample data, clear data
 * Design: Orange & White theme
 */
import { useState, useEffect, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import {
  Database,
  Trash2,
  Smartphone,
  Wifi,
  WifiOff,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createBackup, downloadBackupFile, parseBackupFile, restoreBackup } from "@/lib/backup";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452232695/Geqw5Dwwk2pA5LmRx3Tkji/my-car-rent-logo_efb7efea.webp";

export default function Settings() {
  const { seedData, entries, plates } = useData();
  const [showClear, setShowClear] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSeedData = async () => {
    await seedData();
    toast.success("เพิ่มข้อมูลตัวอย่างสำเร็จ");
  };

  const handleClearData = async () => {
    // Clear IndexedDB
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) indexedDB.deleteDatabase(db.name);
    }
    setShowClear(false);
    toast.success("ล้างข้อมูลสำเร็จ — กรุณารีเฟรชหน้า");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      const backup = await createBackup();
      downloadBackupFile(backup);
      toast.success(`สำรองข้อมูลสำเร็จ (${backup.entries.length} รายการ, ${backup.plates.length} ทะเบียน)`);
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoring(true);
      const backup = await parseBackupFile(file);
      setShowRestore(true);
      
      // Store backup in state for confirmation
      (window as any).__pendingBackup = backup;
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRestoring(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmRestore = async () => {
    try {
      const backup = (window as any).__pendingBackup;
      if (!backup) return;

      setIsRestoring(true);
      const result = await restoreBackup(backup);
      setShowRestore(false);
      toast.success(`กู้คืนข้อมูลสำเร็จ (${result.entriesRestored} รายการ, ${result.platesRestored} ทะเบียน)`);
      
      // Reload to reflect changes
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRestoring(false);
      delete (window as any).__pendingBackup;
    }
  };

  return (
    <div className="page-enter pb-6">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่า</h1>

      {/* App Info */}
      <div className="clean-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={LOGO_URL}
            alt="My Car Rent"
            className="h-14 w-auto"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
            <p className="text-2xl font-bold num-display text-orange-600">{entries.length}</p>
            <p className="text-xs text-muted-foreground">รายการทั้งหมด</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
            <p className="text-2xl font-bold num-display text-orange-600">{plates.length}</p>
            <p className="text-xs text-muted-foreground">ทะเบียนรถ</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="clean-card p-4 mb-4">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-orange-500" />
          )}
          <div>
            <p className="font-medium text-sm">
              {isOnline ? "ออนไลน์" : "ออฟไลน์"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOnline
                ? "เชื่อมต่ออินเทอร์เน็ตแล้ว"
                : "ทำงานแบบออฟไลน์ — ข้อมูลจะถูกบันทึกในเครื่อง"}
            </p>
          </div>
        </div>
      </div>

      {/* PWA Install */}
      <div className="clean-card p-4 mb-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-orange-500" />
          <div>
            <p className="font-medium text-sm">ติดตั้งแอป</p>
            <p className="text-xs text-muted-foreground">
              เปิดในเบราว์เซอร์ แล้วกด "Add to Home Screen" เพื่อติดตั้ง
            </p>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="clean-card p-5 mb-4">
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-orange-500" />
          สำรองและกู้คืนข้อมูล
        </h2>
        <div className="space-y-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-orange-900">
                {isBackingUp ? "กำลังสำรองข้อมูล..." : "สำรองข้อมูล"}
              </p>
              <p className="text-xs text-orange-700">
                ดาวน์โหลด {entries.length} รายการ, {plates.length} ทะเบียน
              </p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleRestoreClick}
            disabled={isRestoring}
            className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-blue-900">
                {isRestoring ? "กำลังกู้คืนข้อมูล..." : "กู้คืนข้อมูล"}
              </p>
              <p className="text-xs text-blue-700">
                อัปโหลดไฟล์ JSON ที่สำรองไว้
              </p>
            </div>
          </motion.button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Select backup file"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSeedData}
          className="clean-btn w-full bg-card text-left flex items-center gap-3 py-3.5"
        >
          <Database className="w-5 h-5 text-orange-500" />
          <div>
            <p className="font-medium text-sm">เพิ่มข้อมูลตัวอย่าง</p>
            <p className="text-xs text-muted-foreground">
              สร้างข้อมูลทดสอบ 30 วัน
            </p>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowClear(true)}
          className="clean-btn w-full bg-card text-left flex items-center gap-3 py-3.5"
        >
          <Trash2 className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-medium text-sm text-destructive">ล้างข้อมูลทั้งหมด</p>
            <p className="text-xs text-muted-foreground">
              ลบรายการและทะเบียนรถทั้งหมด
            </p>
          </div>
        </motion.button>
      </div>

      {/* Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          ข้อมูลทั้งหมดถูกเก็บในเครื่องของคุณ (IndexedDB)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ไม่มีข้อมูลถูกส่งไปยังเซิร์ฟเวอร์ภายนอก
        </p>
      </div>

      {/* Clear Data Confirmation */}
      <AlertDialog open={showClear} onOpenChange={setShowClear}>
        <AlertDialogContent className="clean-card !rounded-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>ล้างข้อมูลทั้งหมด?</AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้จะลบรายการและทะเบียนรถทั้งหมด ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive text-destructive-foreground"
            >
              ล้างข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation */}
      <AlertDialog open={showRestore} onOpenChange={setShowRestore}>
        <AlertDialogContent className="clean-card !rounded-xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>กู้คืนข้อมูล?</AlertDialogTitle>
            <AlertDialogDescription>
              ข้อมูลจากไฟล์สำรองจะถูกเพิ่มเข้าไปในฐานข้อมูลปัจจุบัน อาจมีข้อมูลซ้ำกันได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isRestoring ? "กำลังกู้คืน..." : "กู้คืนข้อมูล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
