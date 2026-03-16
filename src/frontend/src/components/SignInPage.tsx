import type React from "react";
import { useEffect, useRef, useState } from "react";

interface SignInPageProps {
  onComplete: (username: string) => void;
}

export default function SignInPage({ onComplete }: SignInPageProps) {
  const [username, setUsername] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    localStorage.setItem("colt_username", trimmed);
    onComplete(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, oklch(0.15 0.06 200 / 1) 0%, oklch(0.06 0.02 240 / 1) 60%, oklch(0.04 0.01 240 / 1) 100%)",
        zIndex: 9999,
      }}
    >
      {/* Animated grid lines in background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.78 0.22 195 / 0.04) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.78 0.22 195 / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridPan 20s linear infinite",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.78 0.22 195 / 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md mx-4 p-8 rounded-2xl flex flex-col items-center gap-6"
        style={{
          background: "oklch(0.10 0.03 240 / 0.9)",
          border: "1px solid oklch(0.78 0.22 195 / 0.3)",
          boxShadow:
            "0 0 40px oklch(0.78 0.22 195 / 0.15), 0 0 80px oklch(0.78 0.22 195 / 0.06), inset 0 1px 0 oklch(0.78 0.22 195 / 0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl"
            style={{
              color: "oklch(0.78 0.22 195)",
              border: "2px solid oklch(0.78 0.22 195 / 0.6)",
              boxShadow:
                "0 0 20px oklch(0.78 0.22 195 / 0.4), inset 0 0 12px oklch(0.78 0.22 195 / 0.1)",
              background: "oklch(0.78 0.22 195 / 0.08)",
            }}
          >
            C
          </div>
          <span
            className="text-lg font-bold tracking-widest"
            style={{
              color: "oklch(0.78 0.22 195)",
              textShadow: "0 0 12px oklch(0.78 0.22 195 / 0.6)",
            }}
          >
            COLT UI
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-xl font-bold text-center tracking-wide"
          style={{ color: "oklch(0.92 0.05 200)" }}
        >
          What is your username?
        </h1>

        {/* Input */}
        <div
          className={`w-full transition-all duration-200 ${shake ? "animate-shake" : ""}`}
          style={{ animationName: shake ? "shake" : "none" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your username..."
            maxLength={24}
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-all duration-200"
            style={{
              background: "oklch(0.14 0.04 240 / 0.8)",
              border: username
                ? "1.5px solid oklch(0.78 0.22 195 / 0.7)"
                : "1.5px solid oklch(0.78 0.22 195 / 0.25)",
              color: "oklch(0.92 0.05 200)",
              boxShadow: username
                ? "0 0 12px oklch(0.78 0.22 195 / 0.2), inset 0 0 8px oklch(0.78 0.22 195 / 0.04)"
                : "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "oklch(0.78 0.22 195 / 0.18)",
            border: "1.5px solid oklch(0.78 0.22 195 / 0.6)",
            color: "oklch(0.78 0.22 195)",
            boxShadow: "0 0 16px oklch(0.78 0.22 195 / 0.2)",
            textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
          }}
        >
          ENTER COLT UI →
        </button>

        <p
          className="text-xs text-center"
          style={{ color: "oklch(0.55 0.05 240)" }}
        >
          Your username will appear next to your online status
        </p>
      </div>

      <style>{`
        @keyframes gridPan {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
