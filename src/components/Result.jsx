import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Result() {
  const { title } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const results = JSON.parse(localStorage.getItem("results")) || [];

    // Foydalanuvchi natijasini topamiz
    const userResult = results.find(
      (res) => res.studentPhone === loggedUser?.phone && res.subject === title
    );

    setResult(userResult || null);
    setLoading(false);
  }, [title]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Yüklenmoqda...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
        <div className="bg-white shadow-lg rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Natija topilmadi</h1>
          <p className="text-gray-600 mb-8">
            Siz bu testni hali ishlamagan bo‘lishingiz mumkin.
          </p>
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition duration-300"
          >
            🔁 Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">
          🎉 Test yakunlandi!
        </h1>
        <p className="text-lg text-gray-600">
          Siz{" "}
          <span className="font-semibold text-indigo-600">{title}</span> fanidan{" "}
          <span className="font-semibold text-indigo-600">
            {result.score} ball
          </span>{" "}
          oldingiz.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8 sm:p-12 text-center max-w-md w-full">
        <div className="text-7xl font-extrabold text-indigo-600 mb-2 animate-bounce">
          {result.correctAnswers}
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Jami{" "}
          <span className="font-medium text-gray-800">
            {result.totalQuestions}
          </span>{" "}
          ta savoldan
        </p>

        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition duration-300"
        >
          🔁 Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
