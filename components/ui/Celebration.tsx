"use client";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

export function triggerCelebration(): void {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
}

export default function CelebrationOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    triggerCelebration();
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-navy-800 border border-go-cyan rounded-2xl px-8 py-6 text-center">
        <p className="text-go-cyan text-2xl font-bold">🎉 Module Complete!</p>
      </div>
    </div>
  );
}
