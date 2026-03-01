"use client";

import { useEffect, useRef, useState } from "react";
import { useOverlayStore, Widget } from "@/lib/store";
import { io, Socket } from "socket.io-client";
import { motion } from "motion/react";
import {
  Bell,
  Plus,
  Settings,
  Trash2,
  LayoutDashboard,
  Link as LinkIcon,
  Play,
} from "lucide-react";

export default function Dashboard() {
  const { widgets, setWidgets, updateWidget, addWidget, removeWidget } =
    useOverlayStore();
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const userId = "user-abc-123"; // Hardcoded for MVP

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io({
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join-room", `room_${userId}`);
    });

    newSocket.on("sync-state", (state: any) => {
      if (state && state.widgets) {
        setWidgets(state.widgets);
      }
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, [setWidgets]);

  // Sync state to server whenever widgets change
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("update-state", `room_${userId}`, { widgets });
    }
  }, [widgets]);

  // Handle canvas scaling
  useEffect(() => {
    const updateScale = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const parentWidth = parent.clientWidth - 48; // 24px padding on each side
        const parentHeight = parent.clientHeight - 48;

        const scaleX = parentWidth / 1920;
        const scaleY = parentHeight / 1080;

        setScale(Math.min(scaleX, scaleY));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleTestAlert = () => {
    if (socketRef.current) {
      socketRef.current.emit("trigger-alert", `room_${userId}`, {
        name: "Sultan Andara",
        amount: "100.000",
        message: "Semangat streamingnya ngab!",
      });
    }
  };

  const handleDragEnd = (id: string, event: any, info: any) => {
    const widget = widgets.find((w) => w.id === id);
    if (widget) {
      updateWidget(id, {
        x: widget.x + info.offset.x / scale,
        y: widget.y + info.offset.y / scale,
      });
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Kring
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Unified Streamer Overlay</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* Overlay Link */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Your Overlay Link
            </h2>
            <div className="flex items-center gap-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <LinkIcon className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/overlay/${userId}`}
                className="bg-transparent text-sm flex-1 outline-none text-zinc-300"
              />
              <button
                className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-colors"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/overlay/${userId}`,
                  )
                }
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Paste this into an OBS Browser Source (1920x1080)
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Actions
            </h2>
            <button
              onClick={handleTestAlert}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium py-3 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              Test Alert
            </button>
          </div>

          {/* Widgets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Active Widgets
              </h2>
              <button
                className="text-zinc-400 hover:text-emerald-400 transition-colors"
                onClick={() =>
                  addWidget({
                    type: "alert",
                    x: 500,
                    y: 500,
                    width: 400,
                    height: 300,
                    visible: true,
                    settings: {},
                  })
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-zinc-800 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium capitalize">
                      {widget.type} Widget
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-zinc-500 hover:text-zinc-300">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      className="text-zinc-500 hover:text-red-400"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-zinc-950 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-zinc-400" />
            Layout Editor
          </h2>
          <div className="text-sm text-zinc-500 font-mono">
            1920 &times; 1080
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex items-center justify-center relative checkerboard-bg">
          <div
            ref={canvasRef}
            className="bg-black/40 relative shadow-2xl ring-1 ring-white/10"
            style={{
              width: 1920,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                drag
                dragMomentum={false}
                onDragEnd={(e, info) => handleDragEnd(widget.id, e, info)}
                initial={{ x: widget.x, y: widget.y }}
                animate={{ x: widget.x, y: widget.y }}
                transition={{ type: "tween", duration: 0 }}
                className="absolute border-2 border-emerald-500/50 hover:border-emerald-400 bg-zinc-900/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center cursor-move group"
                style={{ width: widget.width, height: widget.height }}
              >
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity">
                  {widget.type.charAt(0).toUpperCase()}
                </div>

                {widget.type === "alert" && (
                  <div className="text-center p-4">
                    <div className="w-24 h-24 bg-zinc-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Bell className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-lg font-bold text-emerald-400">
                      Alert Box
                    </p>
                    <p className="text-sm text-zinc-400 mt-2">
                      Drag to position
                    </p>
                  </div>
                )}

                {widget.type === "goal" && (
                  <div className="w-full px-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">
                        {widget.settings.title || "Goal"}
                      </span>
                      <span className="text-emerald-400">
                        Rp 50.000 / Rp 100.000
                      </span>
                    </div>
                    <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-1/2 rounded-full" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
