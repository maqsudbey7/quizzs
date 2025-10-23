import React from "react";

export default function TeacherDashboard() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

  const myQuizzes = quizzes.filter(
    (q) => q.createdBy === loggedUser?.phone
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        📚 Mening testlarim
      </h1>

      {myQuizzes.length === 0 ? (
        <p className="text-center text-gray-600">Siz hali test yaratmagansiz.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {myQuizzes.map((quiz, i) => (
            <li key={i} className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {quiz.title}
              </h2>
              <p className="text-gray-500">{quiz.questions.length} ta savol</p>
              <div className="flex justify-end mt-4 gap-2">
                <button className="bg-yellow-400 text-white px-4 py-1 rounded-xl">
                  Tahrirlash
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-xl">
                  O‘chirish
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
