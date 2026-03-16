import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const SENTENCES = [
  "the quick brown fox jumps over the lazy dog",
  "pack my box with five dozen liquor jugs",
  "how vexingly quick daft zebras jump",
  "the five boxing wizards jump quickly",
  "sphinx of black quartz judge my vow",
  "neon lights glow bright in the cyber city",
  "colt ui is the ultimate gaming hub online",
  "type fast and score high to beat the clock",
  "electric dreams power the digital frontier",
  "blazing speed sets the champions apart",
];

const ColtSpeedType: React.FC = () => {
  const [sentence, setSentence] = useState("");
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickSentence = useCallback(() => {
    return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  }, []);

  const startGame = useCallback(() => {
    const s = pickSentence();
    setSentence(s);
    setTyped("");
    setStarted(true);
    setFinished(false);
    setTimeLeft(30);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [pickSentence]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (finished) return;
    if (typed === sentence && sentence.length > 0) {
      // Completed early
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = 30 - timeLeft;
      const words = sentence.trim().split(" ").length;
      const calcWpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
      setWpm(calcWpm);
      setFinished(true);
    }
  }, [typed, sentence, finished, timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const val = e.target.value;
    setTyped(val);

    // Accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === sentence[i]) correct++;
    }
    setAccuracy(
      val.length > 0 ? Math.round((correct / val.length) * 100) : 100,
    );

    // Live WPM
    const elapsed = 30 - timeLeft;
    if (elapsed > 0) {
      const words = val.trim().split(" ").filter(Boolean).length;
      setWpm(Math.round((words / elapsed) * 60));
    }
  };

  const renderSentence = () => {
    const chars = sentence.split("");
    const result: React.ReactNode[] = [];
    chars.forEach((char, i) => {
      let color = "oklch(0.55 0.05 240)";
      if (i < typed.length) {
        color =
          typed[i] === char ? "oklch(0.78 0.22 140)" : "oklch(0.65 0.25 25)";
      } else if (i === typed.length) {
        color = "oklch(0.95 0.02 200)";
      }
      const glow =
        i < typed.length && typed[i] === char
          ? "0 0 6px oklch(0.78 0.22 140 / 0.5)"
          : "none";
      result.push(
        <span key={`c${i}-${char}`} style={{ color, textShadow: glow }}>
          {char}
        </span>,
      );
    });
    return result;
  };

  return (
    <div
      className="flex flex-col items-center gap-5 py-4"
      style={{ minWidth: 340, maxWidth: 480 }}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className="text-sm font-bold"
          style={{
            color: "oklch(0.78 0.22 195)",
            textShadow: "0 0 8px oklch(0.78 0.22 195 / 0.6)",
          }}
        >
          COLT SPEED TYPE
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-gray-400">
            Time:{" "}
            <span
              className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-white"}`}
            >
              {timeLeft}s
            </span>
          </span>
          <span className="text-xs text-gray-400">
            WPM: <span className="text-neon-cyan font-bold">{wpm}</span>
          </span>
          <span className="text-xs text-gray-400">
            Acc: <span className="text-neon-green font-bold">{accuracy}%</span>
          </span>
        </div>
      </div>

      {!started && !finished && (
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            Type as fast as you can in 30 seconds!
          </p>
          <button
            type="button"
            onClick={startGame}
            className="px-6 py-3 rounded-xl font-bold text-sm tracking-widest transition-all hover:scale-105"
            style={{
              background: "oklch(0.78 0.22 195 / 0.18)",
              border: "1.5px solid oklch(0.78 0.22 195 / 0.6)",
              color: "oklch(0.78 0.22 195)",
              boxShadow: "0 0 16px oklch(0.78 0.22 195 / 0.2)",
            }}
          >
            START TYPING
          </button>
        </div>
      )}

      {started && (
        <>
          <div
            className="w-full p-4 rounded-xl text-base leading-relaxed font-mono"
            style={{
              background: "oklch(0.10 0.03 240 / 0.8)",
              border: "1px solid oklch(0.78 0.22 195 / 0.2)",
              letterSpacing: "0.05em",
            }}
          >
            {renderSentence()}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleChange}
            disabled={finished}
            placeholder="Start typing here..."
            className="w-full px-4 py-3 rounded-xl font-mono text-sm outline-none transition-all"
            style={{
              background: "oklch(0.14 0.04 240 / 0.8)",
              border: finished
                ? "1.5px solid oklch(0.55 0.22 140 / 0.6)"
                : "1.5px solid oklch(0.78 0.22 195 / 0.4)",
              color: "oklch(0.92 0.05 200)",
            }}
          />
        </>
      )}

      {finished && (
        <div
          className="w-full p-4 rounded-xl text-center"
          style={{
            background: "oklch(0.55 0.22 140 / 0.1)",
            border: "1px solid oklch(0.55 0.22 140 / 0.4)",
          }}
        >
          <div
            className="text-2xl font-black mb-1"
            style={{ color: "oklch(0.78 0.22 195)" }}
          >
            {wpm} WPM
          </div>
          <div className="text-sm text-gray-400">Accuracy: {accuracy}%</div>
          <button
            type="button"
            onClick={startGame}
            className="mt-3 px-5 py-2 rounded-lg text-xs font-bold tracking-widest transition-all hover:scale-105"
            style={{
              background: "oklch(0.78 0.22 195 / 0.15)",
              border: "1px solid oklch(0.78 0.22 195 / 0.5)",
              color: "oklch(0.78 0.22 195)",
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default ColtSpeedType;
