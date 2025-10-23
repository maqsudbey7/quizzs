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
  const [timeExpired, setTimeExpired] = useState(false);

  // ⏳ localStorage dan vaqtni olish
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`timeLeft_${title}_${currentIndex}`);
    return savedTime ? Number(savedTime) : questions[0]?.time || 30;
  });

  // 🕒 TIMER ishlashi

  useEffect(() => {
    if (showNextButton || currentIndex >= questions.length) return;

    // 🔹 1. Sahifa yangilansa — avval saqlangan vaqtni o‘qiymiz
    const savedTime = localStorage.getItem("remainingTime");
    if (savedTime && timeLeft === 0) {
      setTimeLeft(Number(savedTime));
    }

    // 🔹 2. Agar vaqt tugasa — to‘xtatamiz
    if (timeLeft <= 0) {
      setAnswerStatus("incorrect");
      setShowNextButton(true);
      setTimeExpired(true);
      toast.error("⏰ Vaqt tugadi!");
      localStorage.removeItem("remainingTime");
      return;
    }

    // 🔹 3. Har 1 sekundda kamaytirib, localStorage’da saqlaymiz
    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        localStorage.setItem("remainingTime", newTime);
        return newTime;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showNextButton, currentIndex, questions.length]);

  localStorage.removeItem("remainingTime");
  // ⏱ vaqtni saqlab borish (har 1 soniyada)
  useEffect(() => {
    localStorage.setItem(`timeLeft_${title}_${currentIndex}`, timeLeft);
  }, [timeLeft, title, currentIndex]);

  // ✅ Javobni tekshirish
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) return toast.error("Avval javob tanlang!");

    const correctAnswer = questions[currentIndex].answer;
    const correctOptionIndex = correctAnswer.charCodeAt(0) - 65;
    const correctOption = questions[currentIndex].options[correctOptionIndex];

    if (!timeExpired) {
      if (selectedAnswer.trim() === correctOption.trim()) {
        setAnswerStatus("correct");
        setCorrectCount((prev) => prev + 1);
      } else {
        setAnswerStatus("incorrect");
      }
    } else {
      setAnswerStatus("incorrect");
    }

    setShowNextButton(true);
  };

  // ⏭ Keyingi savolga o‘tish
  const handleNext = () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const results = JSON.parse(localStorage.getItem("results")) || [];

    // oxirgi savol bo‘lsa natijani saqlaymiz
    if (currentIndex === questions.length - 1) {
      const existingIndex = results.findIndex(
        (r) =>
          r.studentPhone === loggedUser?.phone &&
          r.subject === title
      );

      const newResult = {
        studentName: loggedUser?.name || "Unknown",
        studentPhone: loggedUser?.phone || "Unknown",
        subject: title,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        score: correctCount * (questions[0]?.score || 1),
        date: new Date().toLocaleString(),
      };

      if (existingIndex !== -1) {
        results[existingIndex] = newResult;
      } else {
        results.push(newResult);
      }

      localStorage.setItem("results", JSON.stringify(results));

      // ⛔ Test tugadi, vaqtni tozalaymiz
      Object.keys(localStorage)
        .filter((k) => k.startsWith(`timeLeft_${title}_`))
        .forEach((k) => localStorage.removeItem(k));

      toast.success("🎉 Test yakunlandi!");
      navigate(`/result/${title}`);
      return;
    }

    // Keyingi savolga o‘tish
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer("");
    setAnswerStatus(null);
    setShowNextButton(false);
    const nextTime =
      Number(localStorage.getItem(`timeLeft_${title}_${currentIndex + 1}`)) ||
      questions[currentIndex + 1]?.time ||
      30;
    setTimeLeft(nextTime);
    setTimeExpired(false);
  };

  if (!questions.length)
    return (
      <p className="p-6 text-center text-red-500 font-semibold">
        ❌ Bu fan uchun savollar topilmadi.
      </p>
    );

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
                ${answerStatus === "correct" && selectedAnswer === opt
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
                disabled={showNextButton || timeExpired}
              />
              <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </label>
          ))}

          <div className="flex justify-between items-center mt-4">
            <span
              className={`px-4 py-2 rounded-full text-white font-semibold ${timeLeft <= 5 ? "bg-red-500 animate-pulse" : "bg-blue-500"
                }`}
            >
              ⏳ {timeLeft}s
            </span>

            {!showNextButton ? (
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition"
                disabled={timeExpired}
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-500 text-white py-2 px-6 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
