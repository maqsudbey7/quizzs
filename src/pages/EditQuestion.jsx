import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditQuestion() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || {};
    const currentSubject = Object.keys(savedSubjects).find(
      (s) => s.toLowerCase() === subject.toLowerCase()
    );

    if (currentSubject) {
      setQuestions(savedSubjects[currentSubject]);
    } else {
      console.warn("Test topilmadi:", subject);
      setQuestions(false);
    }
  }, [subject]);

  const handleSave = () => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || {};
    savedSubjects[subject] = questions;
    localStorage.setItem("subjects", JSON.stringify(savedSubjects));
    navigate("/");
  };

  if (questions === null)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <p className="text-xl font-semibold text-indigo-700">
          ⏳ Yuklanmoqda...
        </p>
      </div>
    );

  if (questions === false)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-yellow-100">
        <p className="text-red-600 text-lg font-semibold bg-white shadow-lg rounded-xl p-5">
          ❌ “{subject}” faniga oid test topilmadi.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          ✏️ “{subject}” savollarini tahrirlash
        </h2>

        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-white to-indigo-50 border border-indigo-100 rounded-2xl shadow p-5 hover:shadow-md transition-all duration-300"
            >
              <h3 className="font-semibold text-indigo-700 mb-3">
                Savol {i + 1}
              </h3>

              {/* Savol inputi */}
              <input
                type="text"
                className="w-full border border-indigo-200 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={q.question}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[i].question = e.target.value;
                  setQuestions(updated);
                }}
                placeholder="Savol matnini kiriting..."
              />

              {/* Variantlar */}
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                {q.options.map((opt, j) => (
                  <input
                    key={j}
                    type="text"
                    className="border border-indigo-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[i].options[j] = e.target.value;
                      setQuestions(updated);
                    }}
                    placeholder={`${String.fromCharCode(65 + j)} variant`}
                  />
                ))}
              </div>

              {/* To‘g‘ri javob tanlash */}
              <select
                className="w-full border border-indigo-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={q.answer}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[i].answer = e.target.value;
                  setQuestions(updated);
                }}
              >
                <option value="">✅ To‘g‘ri javobni tanlang</option>
                {["A", "B", "C", "D"].map((v) => (
                  <option key={v} value={v}>
                    {v} variant
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Saqlash tugmasi */}
        <button
          onClick={handleSave}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
        >
          💾 O‘zgarishlarni saqlash
        </button>

        {/* Ortga qaytish */}
        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-xl transition"
        >
          🔙 Ortga
        </button>
      </div>
    </div>
  );
}
