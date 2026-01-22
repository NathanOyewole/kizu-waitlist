"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Terminal, Activity } from "lucide-react";
import clsx from "clsx";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden relative">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          KIZU
        </div>
        <div className="text-xs text-[#525252] font-mono">
          STATUS: <span className="text-green-500">LISTENING</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 pb-20">

        <div className="max-w-2xl w-full text-center space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#2A2A2A] text-[10px] uppercase tracking-wider text-[#A1A1A1] shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            System v0.1 Alpha
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Find the <br /> bleeding neck.
          </h1>

          <p className="text-lg text-[#A1A1A1] max-w-lg mx-auto leading-relaxed">
            Stop guessing. Kizu scans niche communities (Reddit, X, Discord) to find exactly what users are complaining about.
          </p>

          {/* Form */}
          <div className="max-w-sm mx-auto w-full pt-6">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="founder@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-[#333]"
              />
              <button
                disabled={loading || status === "success"}
                className={clsx(
                  "absolute right-1 top-1 bottom-1 px-4 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                  status === "success"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-[#EDEDED] text-black hover:bg-white"
                )}
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : status === "success" ? <CheckCircle2 className="w-3 h-3" /> : "Access"}
              </button>
            </form>
            <div className="h-6 mt-2 flex justify-center">
              {status === "success" && <p className="text-green-500 text-xs animate-in fade-in slide-in-from-top-1">{message}</p>}
              {status === "error" && <p className="text-red-500 text-xs animate-in fade-in slide-in-from-top-1">{message}</p>}
            </div>
          </div>
        </div>

        {/* Visual: The Code Block */}
        <div className="mt-16 w-full max-w-3xl relative group opacity-80 hover:opacity-100 transition-opacity">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-purple-500/20 blur opacity-30 rounded-lg" />
          <div className="relative bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center px-4 py-3 border-b border-[#2A2A2A] bg-[#0F0F0F] gap-2">
              <Terminal className="w-3 h-3 text-[#525252]" />
              <span className="text-xs text-[#525252] font-mono">kizu-cli — analysis</span>
            </div>
            <div className="p-6 font-mono text-xs space-y-3">
              <div className="text-[#525252]">$ kizu scan --target=r/SaaS</div>
              <div className="text-blue-500">[SCANNING] 452 posts found...</div>
              <div className="text-[#EDEDED] pl-4 border-l border-[#333] py-1">
                <span className="text-[#525252] block mb-1">// High Signal Found</span>
                "I would pay $50/mo for a tool that just handles Stripe tax compliance automatically for Next.js apps."
              </div>
              <div className="text-green-500">$ Opportunity detected: High Intent (92/100)</div>
              <div className="text-[#525252] animate-pulse">_</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
