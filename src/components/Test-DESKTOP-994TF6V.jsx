import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Test() {
  const { title } = useParams();
  const navigate = useNavigate();
  const subjects = JSON.parse(localStorage.getItem("subjects")) || {};
  const questions = subjects[title] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.time || 30);

  // Timer
  useEffect(() => {
    if (showNextButton || currentIndex >= questions.length) return;
    if (timeLeft <= 0) {
      handleNext();
      toast.error("⏰ Time is up!");
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showNextButton]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) return toast.error("Select an answer!");
    const correctAnswer = questions[currentIndex].answer;

    if (selectedAnswer.trim().toUpperCase() === correctAnswer.trim().toUpperCase()) {
      setAnswerStatus("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      setAnswerStatus("incorrect");
    }

    setShowNextButton(true);
  };

  const handleNext = () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const results = JSON.parse(localStorage.getItem("results")) || [];

    // Save result after each question
    if (currentIndex === questions.length - 1) {
      results.push({
        studentPhone: loggedUser.phone,
        subject: title,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        score:
          correctCount *
          (questions[0]?.score || 1), // ball har bir savol uchun bir xil
      });
      localStorage.setItem("results", JSON.stringify(results));
      toast.success("🎉 Test completed!");
      navigate("/");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer("");
    setAnswerStatus(null);
    setShowNextButton(false);
    setTimeLeft(questions[currentIndex + 1]?.time || 30);
  };

  if (!questions.length)
    return <p className="p-6">No questions available for this quiz.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-xl rounded-3xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">
          {title} - Savol {currentIndex + 1}/{questions.length}
        </h2>

        <p className="text-gray-700 mb-4">{questions[currentIndex].question}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {questions[currentIndex].options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition
                ${
                  answerStatus === "correct" && selectedAnswer === opt
                    ? "bg-green-100 border-green-500"
                    : answerStatus === "incorrect" && selectedAnswer === opt
                    ? "bg-red-100 border-red-500"
                    : ""
                }
              `}
            >
              <input
                type="radio"
                name="option"
                value={opt}
                checked={selectedAnswer === opt}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showNextButton}
              />
              <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </label>
          ))}

          <div className="flex justify-between items-center mt-4">
            <span
              className={`px-4 py-2 rounded-full text-white font-semibold ${
                timeLeft <= 5 ? "bg-red-500 animate-pulse" : "bg-blue-500"
              }`}
            >
              ⏳ {timeLeft}s
            </span>

            {!showNextButton ? (
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
