import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CreateQuestion() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      question,
      options,
      answer: correctAnswer, // A, B, C, D
      time: Number(time),
      score: Number(score),
    };

    const allSubjects = JSON.parse(localStorage.getItem("subjects")) || {};

    if (allSubjects[subject]) {
      allSubjects[subject].push(newQuestion);
    } else {
      allSubjects[subject] = [newQuestion];
    }

    localStorage.setItem("subjects", JSON.stringify(allSubjects));

    toast.success(`Savol ${subject} faniga qo‘shildi!`);

    // Formani tozalash
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("A");
    setTime(30);
    setScore(1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-4">
      <h2 className="text-3xl font-bold mb-6">📝 Yangi Savol Qo‘shish</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-lg flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Fan nomi (masalan HTML)"
          className="border p-2 rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <textarea
          placeholder="Savol matni..."
          className="border p-2 rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Variant ${String.fromCharCode(65 + i)}`}
            className="border p-2 rounded"
            value={opt}
            onChange={(e) => {
              const updated = [...options];
              updated[i] = e.target.value;
              setOptions(updated);
            }}
            required
          />
        ))}

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="border p-2 rounded"
        >
          {["A", "B", "C", "D"].map((v) => (
            <option key={v} value={v}>
              {v} variant
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Vaqt (sekund)"
            className="border p-2 rounded w-1/2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Ball"
            className="border p-2 rounded w-1/2"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Savol qo‘shish
        </button>
      </form>
    </div>
  );
}
