"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Dialog } from "./dialog";
import { digits } from "@/lib/format";
export function FilterPanel({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filters">
      <button
        className="filter-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <SlidersHorizontal size={18} /> فیلتر و مرتب‌سازی{" "}
        {count > 0 && <span>({digits(count)})</span>}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="فیلتر و مرتب‌سازی"
        drawer
      >
        <div className="filter-drawer">{children}</div>
      </Dialog>
    </div>
  );
}
