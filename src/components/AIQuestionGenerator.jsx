/* eslint-disable react/prop-types, no-unused-vars */
import React, { useState } from "react";
import toast from "react-hot-toast";

const LETTERS = ["A", "B", "C", "D"];

export default function AIQuestionGenerator({ subject, onAdded }) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [language, setLanguage] = useState("uz");
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState([]);
  const [selected, setSelected] = useState([]);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Mavzuni kiriting!");
      return;
    }
    setLoading(true);
    setGenerated([]);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count, difficulty, language }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Server xatosi");
      setGenerated(data.questions);
      setSelected(data.questions.map((_, i) => i));
      toast.success(`🤖 ${data.questions.length} ta savol tayyor!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const addSelected = () => {
    if (!subject) {
      toast.error("Avval pastda fan nomini tanlang yoki kiriting!");
      return;
    }
    const picked = generated
      .filter((_, i) => selected.includes(i))
      .map(({ question, options, answer }) => ({
        question,
        options,
        answer,
        time: Number(time),
        score: Number(score),
      }));
    if (!picked.length) {
      toast.error("Hech bo'lmaganda bitta savol tanlang");
      return;
    }
    const all = JSON.parse(localStorage.getItem("subjects")) || {};
    all[subject] = [...(all[subject] || []), ...picked];
    localStorage.setItem("subjects", JSON.stringify(all));
    toast.success(`✅ "${subject}" faniga ${picked.length} ta savol qo‘shildi!`);
    setGenerated([]);
    setSelected([]);
    onAdded?.(subject);
  };

  const input =
    "w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 outline-none bg-gray-50 text-gray-700";

  return (
    <div className="mb-8 rounded-2xl border border-purple-200 bg-purple-50/50 p-5 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">
        🤖 AI bilan savol yaratish
      </h3>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Mavzu: masalan, JavaScript massivlar yoki Kasrlarni qo‘shish"
          className={input}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), generate())}
        />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <label className="text-xs font-semibold text-gray-600">
            Soni
            <input type="number" min="1" max="20" className={input} value={count}
              onChange={(e) => setCount(e.target.value)} />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Qiyinlik
            <select className={input} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Oson</option>
              <option value="medium">O‘rtacha</option>
              <option value="hard">Qiyin</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Til
            <select className={input} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="uz">O‘zbek</option>
              <option value="ru">Rus</option>
              <option value="en">Ingliz</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">
            ⏱ Vaqt (s)
            <input type="number" className={input} value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            ⭐ Ball
            <input type="number" className={input} value={score} onChange={(e) => setScore(e.target.value)} />
          </label>
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
        >
          {loading ? "⏳ AI savollar tuzmoqda..." : "✨ Savollarni yaratish"}
        </button>
      </div>

      {generated.length > 0 && (
        <div className="mt-5 flex flex-col gap-3">
          {generated.map((q, i) => (
            <label
              key={i}
              className={`block rounded-xl border p-4 cursor-pointer bg-white transition ${
                selected.includes(i) ? "border-purple-400" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex gap-3">
                <input type="checkbox" checked={selected.includes(i)} onChange={() => toggle(i)} className="mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{i + 1}. {q.question}</p>
                  <ul className="mt-2 grid sm:grid-cols-2 gap-1 text-sm">
                    {q.options.map((opt, j) => (
                      <li key={j} className={LETTERS[j] === q.answer ? "text-green-600 font-semibold" : "text-gray-600"}>
                        {LETTERS[j]}) {opt}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && <p className="mt-2 text-xs text-gray-500">💡 {q.explanation}</p>}
                </div>
              </div>
            </label>
          ))}
          <button
            type="button"
            onClick={addSelected}
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            ➕ Tanlanganlarni ({selected.length}) {subject ? `"${subject}"` : ""} faniga qo‘shish
          </button>
        </div>
      )}
    </div>
  );
}
