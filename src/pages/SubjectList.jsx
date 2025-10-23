import React from "react";
import { useNavigate } from "react-router-dom";

export default function SubjectList() {
  const navigate = useNavigate();
  const subjects = JSON.parse(localStorage.getItem("subjects")) || {};

  const subjectNames = Object.keys(subjects);

  if (subjectNames.length === 0)
    return <p className="text-center mt-10 text-gray-500">Hozircha fanlar mavjud emas.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">📚 Fanlar ro‘yxati</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {subjectNames.map((subject, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">{subject}</h3>
            <p className="text-gray-500 mb-4">{subjects[subject].length} ta savol mavjud</p>
            <button
              onClick={() => navigate(`/test/${subject}`)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              🧠 Testni boshlash
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}