"use client";

import { useEffect, useState, useRef } from "react";
import { useOverlayStore } from "@/lib/store";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Overlay() {
  const { widgets, setWidgets } = useOverlayStore();
  const socketRef = useRef<Socket | null>(null);
  const [activeAlert, setActiveAlert] = useState<any | null>(null);
  const pathname = usePathname();
  const userId = pathname.split("/").pop() || "user-abc-123";

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io({
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Overlay connected to server");
      newSocket.emit("join-room", `room_${userId}`);
    });

    newSocket.on("sync-state", (state: any) => {
      if (state && state.widgets) {
        setWidgets(state.widgets);
      }
    });

    newSocket.on("play-alert", (alertData: any) => {
      setActiveAlert(alertData);

      // Play sound
      const audio = new Audio("/kring.mp3"); // We'll need to mock this or provide a real URL
      audio.play().catch((e) => console.log("Audio play failed:", e));

      // Hide alert after 5 seconds
      setTimeout(() => {
        setActiveAlert(null);
      }, 5000);
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [setWidgets, userId]);

  return (
    <div className="w-[1920px] h-[1080px] bg-transparent overflow-hidden relative">
      {/* Render Widgets */}
      {widgets.map((widget) => {
        if (!widget.visible) return null;

        if (widget.type === "alert") {
          return (
            <div
              key={widget.id}
              className="absolute"
              style={{
                left: widget.x,
                top: widget.y,
                width: widget.width,
                height: widget.height,
              }}
            >
              <AnimatePresence>
                {activeAlert && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-full h-full flex flex-col items-center justify-center text-center drop-shadow-2xl"
                  >
                    <div className="relative w-64 h-64 mb-6">
                      <Image
                        src={
                          widget.settings.image ||
                          "https://picsum.photos/seed/meme/400/300"
                        }
                        alt="Alert GIF"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover rounded-2xl border-4 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                      />
                    </div>
                    <div className="bg-zinc-900/90 backdrop-blur-md px-8 py-4 rounded-full border-2 border-emerald-500/50">
                      <h1 className="text-4xl font-black text-white drop-shadow-md">
                        <span className="text-emerald-400">
                          {activeAlert.name}
                        </span>{" "}
                        donated Rp {activeAlert.amount}!
                      </h1>
                    </div>
                    <p className="text-2xl font-bold text-white mt-4 bg-zinc-900/80 px-6 py-3 rounded-xl max-w-md break-words">
                      &quot;{activeAlert.message}&quot;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        if (widget.type === "goal") {
          return (
            <div
              key={widget.id}
              className="absolute"
              style={{
                left: widget.x,
                top: widget.y,
                width: widget.width,
                height: widget.height,
              }}
            >
              <div className="w-full h-full bg-zinc-900/80 backdrop-blur-md rounded-2xl border-2 border-zinc-800 p-6 flex flex-col justify-center shadow-xl">
                <div className="flex justify-between items-end mb-3">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {widget.settings.title || "Target Sahur"}
                  </h2>
                  <div className="text-xl font-bold text-emerald-400">
                    Rp{" "}
                    {widget.settings.current?.toLocaleString("id-ID") ||
                      "50.000"}{" "}
                    <span className="text-zinc-500 text-lg">
                      / Rp{" "}
                      {widget.settings.target?.toLocaleString("id-ID") ||
                        "100.000"}
                    </span>
                  </div>
                </div>
                <div className="h-8 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((widget.settings.current || 50000) / (widget.settings.target || 100000)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  {/* Stripes overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
