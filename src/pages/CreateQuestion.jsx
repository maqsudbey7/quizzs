import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AIQuestionGenerator from "../components/AIQuestionGenerator";

export default function CreateQuestion() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("subjects")) || {};
    setSubjects(Object.keys(stored));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSubject = subject === "new" ? newSubject : subject;

    if (!selectedSubject) {
      toast.error("Fan nomini tanlang yoki kiriting!");
      return;
    }

    const newQuestion = {
      question,
      options,
      answer: correctAnswer,
      time: Number(time),
      score: Number(score),
    };

    const allSubjects = JSON.parse(localStorage.getItem("subjects")) || {};
    if (allSubjects[selectedSubject]) {
      allSubjects[selectedSubject].push(newQuestion);
    } else {
      allSubjects[selectedSubject] = [newQuestion];
    }

    localStorage.setItem("subjects", JSON.stringify(allSubjects));
    toast.success(`✅ "${selectedSubject}" faniga savol qo‘shildi!`);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("A");
    setTime(30);
    setScore(1);
    setSubject(selectedSubject);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 p-4 sm:p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 md:p-10 border border-gray-100 transition-all duration-300 hover:shadow-indigo-200">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 text-indigo-700">
          🧠 Yangi Savol Qo‘shish
        </h2>

        <AIQuestionGenerator
          subject={subject === "new" ? newSubject.trim() : subject}
          onAdded={(name) => {
            setSubjects((prev) => (prev.includes(name) ? prev : [...prev, name]));
            setSubject(name);
          }}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Fan tanlash */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              Fan nomi
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-indigo-400 outline-none text-gray-700 bg-gray-50"
              required
            >
              <option value="">Fan tanlang...</option>
              {subjects.map((subj, i) => (
                <option key={i} value={subj}>
                  {subj}
                </option>
              ))}
              <option value="new">➕ Yangi fan qo‘shish</option>
            </select>
          </div>

          {subject === "new" && (
            <input
              type="text"
              placeholder="Masalan: HTML yoki Matematika"
              className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 text-gray-700"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
            />
          )}

          {/* Savol matni */}
          <textarea
            placeholder="Savol matnini yozing..."
            className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 h-24 focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 text-gray-700"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          {/* Variantlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Variant ${String.fromCharCode(65 + i)}`}
                className="border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 text-gray-700 w-full"
                value={opt}
                onChange={(e) => {
                  const updated = [...options];
                  updated[i] = e.target.value;
                  setOptions(updated);
                }}
                required
              />
            ))}
          </div>

          {/* To‘g‘ri javob */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-600">
              To‘g‘ri javob
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 text-gray-700"
            >
              {["A", "B", "C", "D"].map((v) => (
                <option key={v} value={v}>
                  {v} variant
                </option>
              ))}
            </select>
          </div>

          {/* Vaqt va Ball */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="⏱ Vaqt (sekund)"
              className="border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-sky-400 outline-none bg-gray-50 text-gray-700 w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="⭐ Ball"
              className="border border-gray-200 rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-yellow-400 outline-none bg-gray-50 text-gray-700 w-full"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>

          {/* Tugma */}
          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-3 sm:py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            ✅ Savolni Qo‘shish
          </button>
        </form>
      </div>
    </div>
  );
}
