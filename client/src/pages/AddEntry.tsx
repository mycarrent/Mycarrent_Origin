/**
 * AddEntry Page — Task entry form with category selection, plate dropdown, price input
 * Design: Large touch-friendly inputs, bold category selection cards
 */
import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { CATEGORIES, CATEGORY_LIST, getTodayStr } from "@/lib/utils-app";
import type { Category } from "@/lib/db";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Droplets, Truck, KeyRound, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  wash: <Droplets className="w-7 h-7" />,
  delivery: <Truck className="w-7 h-7" />,
  pickup: <KeyRound className="w-7 h-7" />,
};

export default function AddEntry() {
  const { addEntry, plates, addPlate } = useData();

  const [date, setDate] = useState(getTodayStr());
  const [category, setCategory] = useState<Category | null>(null);
  const [plate, setPlate] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [showNewPlate, setShowNewPlate] = useState(false);
  const [newPlateValue, setNewPlateValue] = useState("");

  const plateOptions = useMemo(
    () => plates.map((p) => p.plate),
    [plates]
  );

  const handleSave = async () => {
    if (!category) {
      toast.error("กรุณาเลือกประเภทงาน");
      return;
    }
    if (!plate) {
      toast.error("กรุณาเลือกทะเบียนรถ");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("กรุณาใส่ราคา");
      return;
    }

    setSaving(true);
    try {
      await addEntry({
        date,
        category,
        plate,
        price: Number(price),
        note,
      });
      toast.success("บันทึกสำเร็จ!");
      // Reset form
      setCategory(null);
      setPlate("");
      setPrice("");
      setNote("");
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewPlate = async () => {
    if (!newPlateValue.trim()) return;
    await addPlate(newPlateValue.trim());
    setPlate(newPlateValue.trim().toUpperCase());
    setNewPlateValue("");
    setShowNewPlate(false);
    toast.success("เพิ่มทะเบียนรถสำเร็จ");
  };

  return (
    <div className="page-enter pb-6">
      <h1 className="text-2xl font-bold mb-6">เพิ่มรายการ</h1>

      {/* Date Picker */}
      <div className="mb-5">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          วันที่
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="brutal-btn w-full text-left bg-card num-display text-base"
        />
      </div>

      {/* Category Selection */}
      <div className="mb-5">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          ประเภทงาน
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORY_LIST.map((cat) => {
            const config = CATEGORIES[cat];
            const selected = category === cat;
            return (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`brutal-card p-4 text-center transition-all ${
                  selected ? "!bg-foreground !text-background" : ""
                }`}
                style={{
                  borderColor: selected ? config.color : undefined,
                  boxShadow: selected
                    ? `4px 4px 0px ${config.color}`
                    : undefined,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{
                    backgroundColor: selected ? config.color : config.bgColor,
                    color: selected ? "white" : config.color,
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                </div>
                <p className="text-sm font-medium">{config.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Plate Selection */}
      <div className="mb-5">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          ทะเบียนรถ
        </label>
        <div className="flex gap-2">
          <select
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="brutal-btn flex-1 bg-card text-base appearance-none"
          >
            <option value="">เลือกทะเบียนรถ...</option>
            {plateOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNewPlate(true)}
            className="brutal-btn bg-card flex items-center justify-center w-12"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-5">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          ราคา (บาท)
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="brutal-btn w-full bg-card num-display text-xl pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            ฿
          </span>
        </div>
        {/* Quick price buttons */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {[200, 300, 500, 700, 1000].map((p) => (
            <button
              key={p}
              onClick={() => setPrice(String(p))}
              className="px-3 py-1.5 rounded-lg text-sm num-display border-2 border-border bg-secondary hover:bg-accent transition-colors"
            >
              ฿{p}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <StickyNote className="w-4 h-4" />
          หมายเหตุ (ไม่บังคับ)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น ล้างภายนอก, ส่งสนามบิน..."
          className="brutal-btn w-full bg-card text-base"
        />
      </div>

      {/* Save Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={saving}
        className="brutal-btn w-full bg-foreground text-background text-lg font-semibold flex items-center justify-center gap-2 py-4"
      >
        <Save className="w-5 h-5" />
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </motion.button>

      {/* Preview */}
      <AnimatePresence>
        {category && plate && price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div
              className="brutal-card p-4"
              style={{ borderColor: CATEGORIES[category].color }}
            >
              <p className="text-xs text-muted-foreground mb-1">ตัวอย่าง</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORIES[category].icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORIES[category].label} · {date}
                  </p>
                </div>
                <span className="num-display text-lg font-bold">
                  ฿{Number(price).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Plate Dialog */}
      <Dialog open={showNewPlate} onOpenChange={setShowNewPlate}>
        <DialogContent className="brutal-card !rounded-xl max-w-sm">
          <DialogHeader>
            <DialogTitle>เพิ่มทะเบียนรถใหม่</DialogTitle>
          </DialogHeader>
          <Input
            value={newPlateValue}
            onChange={(e) => setNewPlateValue(e.target.value)}
            placeholder="เช่น กก 1234"
            className="text-lg py-6 border-2"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPlate(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleAddNewPlate}>เพิ่ม</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
