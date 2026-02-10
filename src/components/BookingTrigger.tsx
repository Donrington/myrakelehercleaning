"use client";

import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";

/**
 * Mounts globally and intercepts any click on <a href="#book"> links
 * so the modal opens without a full navigation.
 */
export default function BookingTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.getAttribute("href") === "#book") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <BookingModal isOpen={open} onClose={() => setOpen(false)} />;
}
