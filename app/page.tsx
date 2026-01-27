"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Terminal, Activity, Radio, Brain, Zap, Copy } from "lucide-react";
import emailjs from '@emailjs/browser';

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Helper to grab ?ref=XYZ (Safe for Next.js client)
  const getReferrer = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("ref");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 👇 UPDATED: Your actual Vercel URL
    const liveUrl = "https://kizu-waitlist.vercel.app";

    try {
      // 1. Call our Next.js API Route
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          referrer: getReferrer()
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // 2. Trigger EmailJS (Client Side)
      if (data.status === 'new') {
        console.log("Attempting to send email to:", email); // 👈 Debug Log

        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            to_email: email,
            user_name: name,
            referral_link: `${liveUrl}?ref=${data.referral_code}`
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
        console.log("Email sent successfully!");
      }

      // 3. Update UI
      setStatus("success");
      setMessage(data.message);
      setReferralCode(data.referral_code);

    } catch (err: any) {
      console.error("Error:", err); // 👈 Check your browser console for this
      setStatus("error");
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const liveUrl = "https://kizu-waitlist.vercel.app";
    navigator.clipboard.writeText(`${liveUrl}?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 pb-20 pt-10">
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
            Stop guessing. Kizu scans niche communities to find exactly what users are complaining about.
          </p>

          {/* Form Area */}
          <div className="max-w-md mx-auto w-full pt-6">

            {status === "success" ? (
              // SUCCESS STATE
              <div className="animate-in fade-in zoom-in duration-500 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-full text-green-500 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Access Requested</h3>
                    <p className="text-sm text-green-400/90 font-medium mt-1">{message}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222] mt-4">
                  <p className="text-xs text-[#737373] mb-3 uppercase tracking-wider">
                    Boost your position
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#121212] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-[#737373] truncate">
                      https://kizu-waitlist.vercel.app?ref={referralCode}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="bg-[#EDEDED] hover:bg-white text-black px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                    >
                      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // FORM STATE
              <>
                <form onSubmit={handleSubmit} className="relative group space-y-3">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                  {/* Name Input */}
                  <div className="relative z-10">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-[#333] text-[#EDEDED]"
                    />
                  </div>

                  {/* Email Input + Button */}
                  <div className="relative z-10">
                    <input
                      type="email"
                      placeholder="founder@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-[#333] text-[#EDEDED]"
                    />
                    <button
                      disabled={loading}
                      className="absolute right-1 top-1 bottom-1 px-4 rounded-md text-xs font-medium transition-all flex items-center gap-2 bg-[#EDEDED] text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Access"}
                    </button>
                  </div>
                </form>

                {status === "error" && (
                  <div className="h-6 mt-2 flex justify-center">
                    <p className="text-red-500 text-xs animate-in fade-in slide-in-from-top-1">{message}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Visual: The Code Block */}
        <div className="mt-16 w-full max-w-3xl relative group opacity-60 hover:opacity-100 transition-opacity duration-700">
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

        {/* Workflow Section */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full text-center px-4">
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto bg-[#121212] border border-[#2A2A2A] rounded-full flex items-center justify-center text-blue-500">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDED]">1. Connect Sources</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Link your Reddit, X, or Discord. Kizu listens where your users already hang out.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto bg-[#121212] border border-[#2A2A2A] rounded-full flex items-center justify-center text-purple-500">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDED]">2. Detect Pain</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              AI filters out the noise. No tutorials, no news. Only complaints and unmet needs.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto bg-[#121212] border border-[#2A2A2A] rounded-full flex items-center justify-center text-green-500">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-[#EDEDED]">3. Build the Cure</h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Get a verified problem delivered to your dashboard. Build what sells.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-[#525252] text-xs">
        © 2026 KIZU Systems. Lagos, NG.
      </footer>
    </div>
  );
}
