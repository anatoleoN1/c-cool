"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProgressRepository } from "@/lib/repositories/progress-repository";
import {
  generateMentalMathQuestions,
  type MentalMathCategory,
  type MentalMathQuestion,
} from "@/lib/algorithms/mental-math";

const GROUPS: Array<{
  title: string;
  items: Array<{ value: MentalMathCategory; label: string; description: string }>;
}> = [
  {
    title: "Fondamentaux",
    items: [
      { value: "addition", label: "Additions", description: "Calculer rapidement des sommes" },
      { value: "subtraction", label: "Soustractions", description: "Écarts et calculs à trous" },
      { value: "multiplication", label: "Multiplications", description: "Tables et produits" },
      { value: "division", label: "Divisions", description: "Divisions exactes" },
    ],
  },
  {
    title: "Techniques",
    items: [
      { value: "complements", label: "Compléments", description: "Compléter vers 10, 100, 1 000" },
      { value: "decimals", label: "Décimaux", description: "Calculs avec virgule" },
      { value: "fractions", label: "Fractions", description: "Sommes de fractions simples" },
      { value: "percentages", label: "Pourcentages", description: "Pourcentages usuels" },
    ],
  },
  {
    title: "Lycée",
    items: [
      { value: "powers", label: "Puissances", description: "Carrés et petites puissances" },
      { value: "signed", label: "Nombres relatifs", description: "Signes et opérations" },
      { value: "priorities", label: "Priorités", description: "Calculs avec × avant +" },
      { value: "mixed", label: "Mix complet", description: "Un parcours de tout le catalogue" },
    ],
  },
];

export default function CalculMentalPage() {
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<MentalMathCategory>("mixed");
  const [difficulty, setDifficulty] = useState(2);
  const [count, setCount] = useState(15);
  const [questions, setQuestions] = useState<MentalMathQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [questionStartedAt, setQuestionStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const selectedLabel = useMemo(
    () => GROUPS.flatMap((group) => group.items).find((item) => item.value === category)?.label || "Mix complet",
    [category],
  );

  const startSession = useCallback(() => {
    const generated = generateMentalMathQuestions({ category, difficulty, count });
    const now = Date.now();
    setQuestions(generated);
    setCurrent(0);
    setAnswer("");
    setCorrect(0);
    setFeedback(null);
    setFinished(false);
    setStarted(true);
    setStartedAt(now);
    setQuestionStartedAt(now);
    setElapsed(0);
  }, [category, count, difficulty]);

  useEffect(() => {
    if (!started || finished || startedAt === null) return;
    const timer = window.setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => window.clearInterval(timer);
  }, [finished, started, startedAt]);

  function submitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!questions[current] || feedback) return;

    const value = Number(answer.replace(",", "."));
    const isCorrect = Number.isFinite(value) && Math.abs(value - questions[current].answer) < 0.0001;
    const responseTimeMs = questionStartedAt === null ? 0 : Date.now() - questionStartedAt;
    const schoolId = profile?.activeSchoolIds[0];

    if (user && schoolId) {
      const now = new Date().toISOString();
      void new ProgressRepository(user.uid).createMentalMathAttempt({
        userId: user.uid,
        schoolId,
        operation: questions[current].operation,
        format: questions[current].format,
        difficulty,
        question: questions[current].text,
        answer,
        expectedAnswer: String(questions[current].answer),
        correct: isCorrect,
        responseTimeMs,
        timed: false,
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
        updatedBy: user.uid,
      }).catch(() => undefined);
    }

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrect((score) => score + 1);

    window.setTimeout(() => {
      if (current + 1 >= questions.length) {
        const finalElapsed = startedAt === null ? elapsed : (Date.now() - startedAt) / 1000;
        setElapsed(finalElapsed);
        setFinished(true);
        setStarted(false);
        setFeedback(null);
        setBestTime((previous) => previous === null ? finalElapsed : Math.min(previous, finalElapsed));
        return;
      }

      setCurrent((index) => index + 1);
      setAnswer("");
      setFeedback(null);
      setQuestionStartedAt(Date.now());
    }, 450);
  }

  const currentQuestion = questions[current];
  const finalScore = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <AppShell>
      <div className="page-content mental-page">
        <div className="mental-hero">
          <div>
            <p className="section-label">Entraînement</p>
            <h2 className="page-title">Calcul mental</h2>
            <p className="page-description">Des automatismes courts, organisés par compétence, avec difficulté progressive et suivi de tes performances.</p>
          </div>
          <div className="mental-stats">
            <span><strong>{bestTime === null ? "—" : `${bestTime.toFixed(1)}s`}</strong> meilleur temps</span>
            <span><strong>{difficulty}/5</strong> difficulté</span>
          </div>
        </div>

        {!started && !finished && (
          <>
            <section className="section mental-catalog">
              <div className="section-heading">
                <div><p className="section-label">Catalogue</p><h2>Choisis ton entraînement</h2></div>
                <span className="mental-count">{selectedLabel}</span>
              </div>

              {GROUPS.map((group) => (
                <div className="mental-group" key={group.title}>
                  <div className="mental-group-title"><strong>{group.title}</strong><span>{group.items.length} activités</span></div>
                  <div className="mental-catalog-grid">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        key={item.value}
                        className={category === item.value ? "mental-activity selected" : "mental-activity"}
                        onClick={() => setCategory(item.value)}
                      >
                        <span className="mental-activity-icon">∑</span>
                        <span><strong>{item.label}</strong><small>{item.description}</small></span>
                        {category === item.value && <b>✓</b>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="section mental-settings">
              <div>
                <span className="mental-label">Difficulté</span>
                <div className="difficulty-row">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button type="button" key={value} className={difficulty === value ? "difficulty selected" : "difficulty"} onClick={() => setDifficulty(value)}>
                      <strong>{value}</strong><small>{["Début", "Facile", "Intermédiaire", "Avancé", "Expert"][value - 1]}</small>
                    </button>
                  ))}
                </div>
              </div>
              <label className="mental-select"><span className="mental-label">Questions</span>
                <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                  {[5, 10, 15, 20, 30, 50].map((value) => <option value={value} key={value}>{value}</option>)}
                </select>
              </label>
            </section>

            <button className="mental-start mental-start-wide" type="button" onClick={startSession}>
              Commencer « {selectedLabel} » <span>→</span>
            </button>
          </>
        )}

        {started && currentQuestion && (
          <section className="mental-play">
            <div className="mental-progress-row">
              <span>{current + 1} / {questions.length}</span>
              <span>{Math.floor(elapsed / 60).toString().padStart(2, "0")}:{Math.floor(elapsed % 60).toString().padStart(2, "0")}</span>
            </div>
            <div className="mental-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
            <p className="mental-play-category">{selectedLabel} · niveau {difficulty}</p>
            <div className="mental-question">{currentQuestion.text}</div>
            <form onSubmit={submitAnswer} className="mental-answer-form">
              <input autoFocus inputMode="decimal" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Ta réponse" aria-label="Réponse" />
              <button className="mental-start" type="submit">Valider <span>↵</span></button>
            </form>
            {feedback && <p className={feedback === "correct" ? "mental-feedback correct" : "mental-feedback wrong"}>{feedback === "correct" ? "Correct ✓" : `Pas tout à fait — ${currentQuestion.answer}`}</p>}
          </section>
        )}

        {finished && (
          <section className="mental-result">
            <p className="section-label">Série terminée</p>
            <h2>{finalScore}%</h2>
            <p>{correct} bonne{correct > 1 ? "s" : ""} réponse{correct > 1 ? "s" : ""} sur {questions.length} · {elapsed.toFixed(1)} secondes.</p>
            <div className="mental-result-actions">
              <button className="mental-start" type="button" onClick={startSession}>Rejouer <span>↻</span></button>
              <button className="text-button" type="button" onClick={() => { setFinished(false); setQuestions([]); }}>Changer d&apos;activité</button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
