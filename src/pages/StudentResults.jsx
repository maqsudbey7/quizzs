import React, { useEffect, useState } from "react";

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("results")) || [];
    // faqat o‘ziga tegishli natijalar
    const myResults = data.filter(r => r.studentPhone === loggedUser.phone);
    setResults(myResults);
  }, []);

  if (results.length === 0)
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Natijalar</h2>
        <p>Siz hali testlarni bajarmagansiz.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Natijalar</h2>
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b">Fan</th>
            <th className="p-2 border-b">Savollar soni</th>
            <th className="p-2 border-b">To‘g‘ri javob</th>
            <th className="p-2 border-b">Ball</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="p-2 border-b">{r.subject}</td>
              <td className="p-2 border-b">{r.totalQuestions}</td>
              <td className="p-2 border-b">{r.correctAnswers}</td>
              <td className="p-2 border-b">{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
