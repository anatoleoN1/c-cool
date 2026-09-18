"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProgressRepository } from "@/lib/repositories/progress-repository";
import {
  generateMentalMathQuestions,
  type MentalMathFormat,
  type MentalMathOperation,
  type MentalMathQuestion,
} from "@/lib/algorithms/mental-math";

const OPERATION_LABELS: Record<MentalMathOperation, string> = {
  addition: "Additions",
  subtraction: "Soustractions",
  multiplication: "Multiplications",
  division: "Divisions",
};

const FORMAT_LABELS: Record<MentalMathFormat, string> = {
  direct: "Calcul direct",
  "missing-left": "Nombre manquant à gauche",
  "missing-right": "Nombre manquant à droite",
  division: "Divisions",
};

export default function CalculMentalPage() {
  const { user, profile } = useAuth();
  const [operations, setOperations] = useState<MentalMathOperation[]>([
    "addition",
    "subtraction",
    "multiplication",
  ]);
  const [format, setFormat] = useState<MentalMathFormat>("direct");
  const [count, setCount] = useState(10);
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

  const startSession = useCallback(() => {
    const generated = generateMentalMathQuestions({
      operations,
      formats: [format],
      min: 1,
      max: 12,
      count,
    });
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
  }, [count, format, operations]);

  useEffect(() => {
    if (!started || finished || startedAt === null) return;
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
    }, 100);
    return () => window.clearInterval(timer);
  }, [finished, started, startedAt]);

  function toggleOperation(operation: MentalMathOperation) {
    setOperations((currentOperations) => {
      if (currentOperations.includes(operation)) {
        return currentOperations.length === 1
          ? currentOperations
          : currentOperations.filter((item) => item !== operation);
      }
      return [...currentOperations, operation];
    });
  }

  async function submitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!questions[current] || feedback) return;

    const value = Number(answer.replace(",", "."));
    const isCorrect = Number.isFinite(value) && value === questions[current].answer;
    const responseTimeMs = questionStartedAt === null ? 0 : Date.now() - questionStartedAt;
    const schoolId = profile?.activeSchoolIds[0];

    if (user && schoolId) {
      const now = new Date().toISOString();
      void new ProgressRepository(user.uid).createMentalMathAttempt({
        userId: user.uid,
        schoolId,
        operation: questions[current].operation,
        format: questions[current].format,
        difficulty: 1,
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
        setFinished(true);
        setStarted(false);
        setFeedback(null);
        return;
      }
      const nextStartedAt = Date.now();
      setCurrent((index) => index + 1);
      setAnswer("");
      setFeedback(null);
      setQuestionStartedAt(nextStartedAt);
    }, 550);
  }

  const currentQuestion = questions[current];
  const percentage = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Entraînement</p>
        <h2 className="page-title">Calcul mental</h2>
        <p className="page-description">
          Entraîne-toi avec des calculs courts, puis mesure ta progression.
        </p>

        {!started && !finished && (
          <section className="mental-panel" aria-label="Configuration du calcul mental">
            <div className="mental-heading">
              <div>
                <p className="section-label">Nouvelle série</p>
                <h3>Choisis ton entraînement</h3>
              </div>
              <span className="mental-count">{count} questions</span>
            </div>

            <div className="mental-options">
              <div>
                <p className="mental-label">Opérations</p>
                <div className="mental-chips">
                  {(Object.keys(OPERATION_LABELS) as MentalMathOperation[]).map((operation) => (
                    <button
                      key={operation}
                      type="button"
                      className={`mental-chip ${operations.includes(operation) ? "selected" : ""}`}
                      onClick={() => toggleOperation(operation)}
                    >
                      {OPERATION_LABELS[operation]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="mental-select">
                <span className="mental-label">Format</span>
                <select value={format} onChange={(event) => setFormat(event.target.value as MentalMathFormat)}>
                  <option value="direct">Calcul direct</option>
                  <option value="missing-left">Nombre manquant à gauche</option>
                  <option value="missing-right">Nombre manquant à droite</option>
                  <option value="division">Division</option>
                </select>
              </label>

              <label className="mental-select">
                <span className="mental-label">Questions</span>
                <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>
            </div>

            <button className="mental-start" type="button" onClick={startSession}>
              Commencer la série <span>→</span>
            </button>
          </section>
        )}

        {started && currentQuestion && (
          <section className="mental-play" aria-label="Série de calcul mental">
            <div className="mental-progress-row">
              <span>{current + 1} / {questions.length}</span>
              <span>{elapsed.toFixed(1)} s</span>
            </div>
            <div className="mental-progress">
              <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            <div className={`mental-question ${feedback ?? ""}`}>
              <p className="mental-label">{FORMAT_LABELS[currentQuestion.format]}</p>
              <strong>{currentQuestion.text}</strong>
              <form onSubmit={submitAnswer}>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Ta réponse"
                  aria-label="Réponse"
                  disabled={Boolean(feedback)}
                />
                <button type="submit" disabled={!answer || Boolean(feedback)}>Valider</button>
              </form>
              {feedback === "correct" && <p className="mental-feedback">✓ Correct</p>}
              {feedback === "wrong" && <p className="mental-feedback">Pas cette fois — la réponse était {currentQuestion.answer}.</p>}
            </div>
          </section>
        )}

        {finished && (
          <section className="mental-result" aria-label="Résultat">
            <p className="section-label">Série terminée</p>
            <h3>{correct} / {questions.length}</h3>
            <p>{percentage}% de réussite · {elapsed.toFixed(1)} secondes</p>
            <button className="mental-start" type="button" onClick={startSession}>
              Recommencer <span>↻</span>
            </button>
          </section>
        )}
      </div>
    </AppShell>
  );
}
