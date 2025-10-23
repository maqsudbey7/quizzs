import { Link } from "react-router-dom";
import React from "react";

function Result({ title, correctAnswerCount, questionsLength, scorePerQuestion }) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const results = JSON.parse(localStorage.getItem("results")) || [];

  // Faqat bir marta saqlash uchun tekshirish
  const alreadySaved = results.some(
    (res) =>
      res.studentPhone === loggedUser.phone && res.subject === title
  );

  if (!alreadySaved) {
    results.push({
      studentPhone: loggedUser.phone,
      subject: title,
      totalQuestions: questionsLength,
      correctAnswers: correctAnswerCount,
      score: correctAnswerCount * scorePerQuestion,
    });
    localStorage.setItem("results", JSON.stringify(results));
  }

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2">
          🎉 Quiz Completed!
        </h1>
        <p className="text-lg text-gray-600">
          You scored{" "}
          <span className="font-semibold text-indigo-600">
            {correctAnswerCount * scorePerQuestion} points
          </span>
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-3xl p-8 sm:p-12 text-center max-w-md w-full">
        <div className="text-7xl font-extrabold text-indigo-600 mb-2 animate-bounce">
          {correctAnswerCount}
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          out of <span className="font-medium text-gray-800">{questionsLength}</span> questions
        </p>

        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition duration-300"
        >
          🔁 Play Again
        </Link>
      </div>
    </div>
  );
}

export default Result;
