import Link from "next/link";
import { Bell, Zap, Layout, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight">Kring</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          The Unified Streamer Overlay
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
          One Link.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Zero Lag.
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Kring consolidates all your widgets into a single transparent canvas.
          Reduce OBS CPU usage and set up your stream in 30 seconds. Built for
          Indonesian streamers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-full text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Start Streaming
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-bold rounded-full text-lg transition-all border border-zinc-800"
          >
            View Features
          </Link>
        </div>

        {/* Features Grid */}
        <div
          id="features"
          className="grid md:grid-cols-3 gap-8 mt-32 text-left"
        >
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Layout className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Single Link Architecture</h3>
            <p className="text-zinc-400 leading-relaxed">
              Stop pasting 10 different browser sources into OBS. Kring uses a
              cloud Z-Index manager to handle Alerts, Goals, and Chat in one
              1920x1080 canvas.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Localized for Indonesia</h3>
            <p className="text-zinc-400 leading-relaxed">
              Built-in support for QRIS, OVO, Dana, and ShopeePay. Plus, TTS
              that actually understands Indonesian slang and &quot;bahasa
              gaul&quot;.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Layout Engine</h3>
            <p className="text-zinc-400 leading-relaxed">
              Drag and drop widgets in your dashboard and watch them move
              instantly in OBS. No refreshing required, powered by WebSockets.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
