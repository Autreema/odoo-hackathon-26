import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { loadDB } from "@/lib/db";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const demoAccounts = [
  { role: "Fleet Manager", email: "manager@transitops.com" },
  { role: "Dispatcher", email: "dispatcher@transitops.com" },
  { role: "Safety Officer", email: "safety@transitops.com" },
  { role: "Financial Analyst", email: "finance@transitops.com" },
];

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("manager@transitops.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  // ensure seed
  if (typeof window !== "undefined") loadDB();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const u = login(email.trim(), password);
    setLoading(false);
    if (!u) { toast.error("Invalid credentials"); return; }
    toast.success(`Welcome, ${u.name}`);
    nav({ to: "/dashboard" });
  }

  function IsometricLogisticsIllustration() {
    return (
      <div className="relative isolate w-full max-w-lg">
        {/* glow blobs */}
        <div
          className="pointer-events-none absolute -inset-10 opacity-70"
          style={{
            background:
              "radial-gradient(280px 180px at 25% 20%, color-mix(in oklab,var(--primary) 28%, transparent), transparent), radial-gradient(220px 160px at 80% 75%, color-mix(in oklab,var(--chart-4) 22%, transparent), transparent)",
          }}
        />

        <div className="glass rounded-3xl p-5 sm:p-6 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-80">
            <svg
              viewBox="0 0 600 420"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgb(114 75 255)" stopOpacity="0.35" />
                  <stop offset="1" stopColor="rgb(255 58 199)" stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="rgb(98 246 211)" stopOpacity="0.18" />
                  <stop offset="1" stopColor="rgb(114 75 255)" stopOpacity="0.05" />
                </linearGradient>
                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              <path
                d="M40 290 C120 200, 210 210, 285 175 C340 150, 420 115, 560 120"
                stroke="url(#g1)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M30 120 C120 90, 210 110, 290 140 C370 170, 420 230, 570 260"
                stroke="url(#g2)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.55"
                filter="url(#soft)"
              />
            </svg>
          </div>

          <div className="relative w-full">
            {/* Isometric scene (pure SVG, premium shading) */}
            <svg
              viewBox="0 0 600 420"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="bgTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="rgb(114 75 255)" stopOpacity="0.22" />
                  <stop offset="1" stopColor="rgb(114 75 255)" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="isoA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgb(90 160 255)" stopOpacity="0.92" />
                  <stop offset="1" stopColor="rgb(114 75 255)" stopOpacity="0.82" />
                </linearGradient>
                <linearGradient id="isoB" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="rgb(114 75 255)" stopOpacity="0.75" />
                  <stop offset="1" stopColor="rgb(60 210 255)" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="isoC" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="rgb(34 46 82)" stopOpacity="0.55" />
                  <stop offset="1" stopColor="rgb(114 75 255)" stopOpacity="0.28" />
                </linearGradient>

                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="rgba(114,75,255,0.35)" />
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
                </filter>

                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="b" />
                  <feColorMatrix
                    in="b"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
                  />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgb(114 75 255)" stopOpacity="0.6" />
                  <stop offset="1" stopColor="rgb(0 240 255)" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* ground */}
              <g filter="url(#shadow)" opacity="0.98">
                <path
                  d="M120 310 L300 210 L480 310 L300 390 Z"
                  fill="url(#isoC)"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1"
                />
              </g>
              <path d="M160 300 L300 220 L440 300 L300 360 Z" fill="rgba(255,255,255,0.03)" />

              {/* warehouse block */}
              <g filter="url(#shadow)">
                {/* base */}
                <path
                  d="M210 270 L300 220 L390 270 L300 320 Z"
                  fill="url(#isoB)"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                {/* top */}
                <path
                  d="M210 270 L300 220 L300 205 L210 255 Z"
                  fill="url(#isoA)"
                  opacity="0.92"
                />
                {/* right face */}
                <path
                  d="M390 270 L300 220 L300 205 L390 255 Z"
                  fill="rgba(0,255,210,0.18)"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1"
                />

                {/* warehouse details */}
                <g opacity="0.9">
                  <path d="M248 272 L300 242 L352 272 L300 302 Z" fill="rgba(0,0,0,0.18)" />
                  <path
                    d="M270 265 L300 248 L330 265 L300 282 Z"
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.10)"
                  />
                </g>
              </g>

              {/* truck */}
              <g filter="url(#shadow)" opacity="0.98">
                {/* truck body (isometric) */}
                <path
                  d="M300 305 L340 282 L395 315 L355 338 Z"
                  fill="rgba(255,255,255,0.05)"
                  stroke="rgba(255,255,255,0.12)"
                />
                <path
                  d="M300 305 L340 282 L340 266 L300 290 Z"
                  fill="url(#isoA)"
                  opacity="0.95"
                />
                <path
                  d="M395 315 L340 282 L340 266 L395 299 Z"
                  fill="rgba(0,240,255,0.14)"
                  stroke="rgba(255,255,255,0.10)"
                />

                {/* cab */}
                <path
                  d="M335 282 L365 266 L402 286 L372 302 Z"
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.10)"
                />
                <path d="M365 266 L365 254 L402 274 L402 286 Z" fill="rgba(114,75,255,0.25)" />

                {/* wheels */}
                <g>
                  <ellipse cx="333" cy="320" rx="13" ry="7" fill="rgba(0,0,0,0.35)" />
                  <ellipse cx="373" cy="343" rx="13" ry="7" fill="rgba(0,0,0,0.35)" />
                  <ellipse cx="333" cy="320" rx="6" ry="3" fill="rgba(0,240,255,0.35)" filter="url(#glow)" />
                  <ellipse cx="373" cy="343" rx="6" ry="3" fill="rgba(114,75,255,0.35)" filter="url(#glow)" />
                </g>

                {/* headlights */}
                <path
                  d="M392 315 L410 304"
                  stroke="rgba(0,240,255,0.35)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              {/* delivery boxes */}
              <g filter="url(#shadow)">
                {/* stack 1 */}
                <path d="M200 275 L230 258 L260 275 L230 292 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
                <path d="M230 258 L230 244 L260 262 L260 275 Z" fill="rgba(114,75,255,0.20)" />
                <path d="M200 275 L200 262 L230 244 L230 258 Z" fill="rgba(0,240,255,0.12)" />

                <path d="M215 252 L238 238 L270 257 L247 271 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" />
                <path d="M238 238 L238 224 L270 242 L270 257 Z" fill="rgba(114,75,255,0.18)" />
                <path d="M215 252 L215 238 L238 224 L238 238 Z" fill="rgba(0,240,255,0.10)" />

                {/* stack 2 */}
                <path d="M250 300 L275 285 L305 302 L280 317 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" />
                <path d="M275 285 L275 271 L305 288 L305 302 Z" fill="rgba(0,240,255,0.10)" />
                <path d="M250 300 L250 286 L275 271 L275 285 Z" fill="rgba(114,75,255,0.18)" />
              </g>

              {/* GPS pin + route */}
              <g filter="url(#glow)">
                <path
                  d="M455 120 C478 120 495 137 495 160 C495 190 455 225 455 225 C455 225 415 190 415 160 C415 137 432 120 455 120 Z"
                  fill="rgba(0,240,255,0.18)"
                  stroke="rgba(0,240,255,0.55)"
                  strokeWidth="2"
                />
                <circle cx="455" cy="160" r="10" fill="rgba(0,240,255,0.55)" />
              </g>

              {/* smartphone with route */}
              <g filter="url(#shadow)">
                {/* phone body */}
                <path
                  d="M430 70 L510 52 L520 98 L440 116 Z"
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.14)"
                />
                <path d="M440 116 L520 98 L520 110 L440 128 Z" fill="rgba(114,75,255,0.10)" />
                <path
                  d="M444 86 L505 72 L512 102 L451 116 Z"
                  fill="url(#screen)"
                  opacity="0.85"
                />

                {/* route polyline */}
                <path
                  d="M455 94 C470 88, 485 88, 500 95"
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                <path
                  d="M456 98 C472 92, 487 92, 503 99"
                  fill="none"
                  stroke="rgba(0,240,255,0.65)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="503" cy="99" r="5" fill="rgba(0,240,255,0.7)" />
                <circle cx="503" cy="99" r="10" fill="rgba(0,240,255,0.18)" filter="url(#glow)" />
              </g>
            </svg>

            {/* subtle caption dots (decorative) */}
            <div className="mt-3 flex items-center justify-between opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[color-mix(in_oklab,var(--primary)_70%,transparent)] shadow-[0_0_16px_rgba(114,75,255,0.45)]" />
                <div className="text-xs text-muted-foreground">Live route visualization</div>
              </div>
              <div className="text-xs text-muted-foreground/80 hidden sm:block">Secure. Fast. Dispatch-ready.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 500px at 10% -10%, color-mix(in oklab, var(--primary) 25%, transparent), transparent), radial-gradient(900px 500px at 100% 100%, color-mix(in oklab, var(--chart-4) 20%, transparent), transparent)",
        }}
      />

      <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-10">
        {/* HERO */}
        <div className="max-w-xl md:max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-2">
            <div className="gradient-primary w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">TransitOps</span>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Smart Transport Operations Platform
          </h1>


          {/* NEW ILLUSTRATION */}
          <div className="mt-8 md:mt-9">
            <div className="transition-transform duration-700 will-change-transform hover:scale-[1.01]">
              <IsometricLogisticsIllustration />
            </div>
          </div>

          {/* demo accounts */}
          <div className="mt-7 md:mt-8 grid grid-cols-2 gap-3 text-sm">
            {demoAccounts.map((a) => (
              <button
                key={a.email}
                onClick={() => {
                  setEmail(a.email);
                  setPassword("123456");
                }}
                className="glass rounded-lg px-3 py-2 text-left hover:border-primary/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="font-semibold">{a.role}</div>
                <div className="text-xs text-muted-foreground truncate">{a.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* LOGIN CARD (unchanged behavior) */}
        <form
          onSubmit={onSubmit}
          className="glass-strong w-full max-w-sm rounded-2xl p-6 space-y-4 relative overflow-hidden"
        >
          {/* card glow */}
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklab,var(--primary)_35%,transparent), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, color-mix(in oklab,var(--chart-4)_30%,transparent), transparent 60%)",
            }}
          />

          <div className="relative">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Use a demo account. Password: <span className="font-mono">123456</span>
            </p>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <div className="mt-1 relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-lg bg-background/60 border border-border pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <div className="mt-1 relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full rounded-lg bg-background/60 border border-border pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </label>
          <button
            disabled={loading}
            type="submit"
            className="w-full gradient-primary text-white rounded-lg py-2.5 font-medium inline-flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Signing in…" : (
              <>
                Sign in <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
