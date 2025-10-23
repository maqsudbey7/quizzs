import React from "react";

export default function ResultsOverview() {
  const results = JSON.parse(localStorage.getItem("results")) || [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        📊 Barcha natijalar
      </h1>

      <table className="w-full bg-white shadow-lg rounded-2xl">
        <thead>
          <tr className="bg-indigo-200">
            <th className="p-3">Ism</th>
            <th className="p-3">Fan</th>
            <th className="p-3">To‘g‘ri javob</th>
            <th className="p-3">Ball</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b text-center">
              <td className="p-3">{r.studentName}</td>
              <td className="p-3">{r.subject}</td>
              <td className="p-3">{r.correctAnswers}</td>
              <td className="p-3 text-indigo-600 font-semibold">
                {r.score} ball
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
