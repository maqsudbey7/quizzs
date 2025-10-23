import React from "react";

export default function Leaderboard() {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  const sorted = [...results].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        🏆 Reyting jadvali
      </h1>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {sorted.map((r, i) => (
          <div
            key={i}
            className="flex justify-between py-3 border-b text-lg font-semibold"
          >
            <span>
              {i + 1}. {r.studentName}
            </span>
            <span className="text-indigo-600">{r.score} ball</span>
          </div>
        ))}
      </div>
    </div>
  );
}
