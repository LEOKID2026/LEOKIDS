import { useCallback, useState } from "react";
import DevPrototypeShell from "../../../solo-games/prototypes/dev/DevPrototypeShell.jsx";

const BODIES = [
  { id: "mars", name: "Mars", emoji: "🔴", fact: "Mars is the red planet — cold and dusty." },
  { id: "saturn", name: "Saturn", emoji: "🪐", fact: "Saturn has big rings of ice and dust." },
  { id: "earth", name: "Earth", emoji: "🌍", fact: "Earth is our home — it has water and life." },
  { id: "moon", name: "Moon", emoji: "🌙", fact: "The Moon orbits Earth and shines at night." },
  { id: "sun", name: "Sun", emoji: "☀️", fact: "The Sun is a star that heats the solar system." },
  { id: "jupiter", name: "Jupiter", emoji: "🟤", fact: "Jupiter is the biggest planet." },
  { id: "comet", name: "Comet", emoji: "☄️", fact: "A comet is an icy body flying through space with a tail." },
];

const MISSIONS = [
  { id: "red", prompt: "Find the red planet", answer: "mars" },
  { id: "rings", prompt: "Find the planet with rings", answer: "saturn" },
  { id: "home", prompt: "Find our home", answer: "earth" },
  { id: "moon-orbit", prompt: "What orbits Earth?", answer: "moon" },
  { id: "biggest", prompt: "Find the biggest planet", answer: "jupiter" },
  { id: "tail", prompt: "What flies with a long tail?", answer: "comet" },
];

function pickMission(done = []) {
  const pool = MISSIONS.filter((m) => !done.includes(m.id));
  return pool[Math.floor(Math.random() * pool.length)] || MISSIONS[0];
}

export default function SpaceMissionPrototype() {
  const [phase, setPhase] = useState("intro");
  const [mission, setMission] = useState(() => pickMission());
  const [doneMissions, setDoneMissions] = useState(/** @type {string[]} */ ([]));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [fact, setFact] = useState("");
  const [flash, setFlash] = useState("");

  const reset = () => {
    setPhase("intro");
    setMission(pickMission());
    setDoneMissions([]);
    setSelected(null);
    setScore(0);
    setFeedback("");
    setFact("");
    setFlash("");
  };

  const start = () => {
    setPhase("play");
    setMission(pickMission());
    setDoneMissions([]);
    setSelected(null);
    setScore(0);
    setFeedback("");
    setFact("");
  };

  const selectBody = useCallback(
    (id) => {
      if (phase !== "play" || !mission) return;
      setSelected(id);
      const body = BODIES.find((b) => b.id === id);

      if (id === mission.answer) {
        setScore((s) => s + 10);
        setFeedback(`Mission complete! ${body?.name} ✅`);
        setFact(body?.fact ?? "");
        setFlash("ok");
        const nextDone = [...doneMissions, mission.id];
        setDoneMissions(nextDone);
        window.setTimeout(() => {
          setFlash("");
          if (nextDone.length >= MISSIONS.length) {
            setFeedback("All missions complete! Excellent astronaut 🚀");
            setPhase("done");
            return;
          }
          setMission(pickMission(nextDone));
          setSelected(null);
          setFact("");
          setFeedback("");
        }, 2000);
      } else {
        setFeedback(`Not ${body?.name} — try again for this mission`);
        setFact("");
        setFlash("bad");
        window.setTimeout(() => setFlash(""), 400);
      }
    },
    [phase, mission, doneMissions],
  );

  return (
    <DevPrototypeShell
      title="Space Mission"
      subtitle="Prototype · Complete missions with Leo in the spaceship"
      headerExtra={
        <span className="rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold text-amber-200">
          {score} · {doneMissions.length}/{MISSIONS.length}
        </span>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3 sm:p-4">
        {phase === "intro" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-5xl">🚀</p>
            <p className="max-w-sm text-sm font-semibold text-indigo-200">Help Leo complete missions in space!</p>
            <button type="button" onClick={start} className="min-h-[48px] rounded-xl bg-indigo-600 px-8 py-2.5 text-base font-bold text-white">
              Launch!
            </button>
          </div>
        ) : (
          <>
            {phase === "play" && mission ? (
              <div className="rounded-xl border-2 border-yellow-400/70 bg-slate-950/90 px-3 py-2 text-center">
                <p className="text-xs font-bold text-amber-200">📡 Mission</p>
                <p className="text-sm font-extrabold sm:text-base">{mission.prompt}</p>
              </div>
            ) : null}

            <div
              className={`relative mx-auto aspect-square w-full max-w-md rounded-2xl border-4 border-yellow-400 bg-gradient-to-b from-indigo-950 via-purple-950/80 to-black p-3 ${
                flash === "ok" ? "ring-4 ring-emerald-400/40" : flash === "bad" ? "ring-4 ring-rose-400/40" : ""
              }`}
            >
              <p className="absolute left-3 top-2 text-lg">🛸</p>
              <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {BODIES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    disabled={phase !== "play"}
                    onClick={() => selectBody(b.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 active:scale-95 ${
                      selected === b.id ? "border-sky-300 bg-sky-500/30" : "border-white/20 bg-slate-900/60"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{b.emoji}</span>
                    <span className="mt-1 text-[10px] font-bold sm:text-xs">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {feedback ? <p className="text-center text-sm font-bold text-white/90">{feedback}</p> : null}
            {fact ? (
              <p className="rounded-lg bg-indigo-500/15 px-3 py-2 text-center text-xs font-semibold text-indigo-100">
                💡 {fact}
              </p>
            ) : null}

            <button type="button" onClick={reset} className="mx-auto min-h-[44px] rounded-xl border-2 border-white/25 px-6 py-2 text-sm font-bold">
              New game
            </button>
          </>
        )}
      </div>
    </DevPrototypeShell>
  );
}
