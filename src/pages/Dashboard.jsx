import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Trash2,
  User,
  BookOpen,
  CheckCircle,
  Award,
  PlusCircle,
  Download,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const subjects = JSON.parse(localStorage.getItem("subjects")) || {};
  const results = JSON.parse(localStorage.getItem("results")) || [];

  if (!user || user.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
        <p className="p-6 text-red-600 text-lg font-semibold bg-white shadow-lg rounded-xl">
          ❌ Faqat o‘qituvchilar uchun ruxsat berilgan.
        </p>
      </div>
    );
  }

  const handleEdit = (subject) => navigate(`/edit/${subject}`);

  const handleDelete = (subject) => {
    if (window.confirm(`"${subject}" fanini o‘chirishni xohlaysizmi?`)) {
      delete subjects[subject];
      localStorage.setItem("subjects", JSON.stringify(subjects));
      window.location.reload();
    }
  };

  const handleDeleteResult = (index) => {
    if (window.confirm("Bu talaba natijasini o‘chirishni xohlaysizmi?")) {
      const updatedResults = [...results];
      updatedResults.splice(index, 1);
      localStorage.setItem("results", JSON.stringify(updatedResults));
      window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  const exportResults = () => {
    if (results.length === 0) return alert("Natijalar mavjud emas!");

    const csvHeader = "Ism,Fan,To‘g‘ri javoblar,Ball\n";
    const csvRows = results
      .map(
        (r) =>
          `${r.studentName},${r.subject},${r.correctAnswers}/${r.totalQuestions},${r.score}`
      )
      .join("\n");

    const csv = csvHeader + csvRows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "natijalar.csv";
    a.click();
  };

  const getAverageScore = (subject) => {
    const filtered = results.filter((r) => r.subject === subject);
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((a, b) => a + b.score, 0);
    return (total / filtered.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 p-6 sm:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
          👩‍🏫 Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2 font-bold text-lg">
          {user.name} — o‘qituvchi paneli
        </p>
      </div>

      {/* Create new quiz */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => navigate("/create-question")}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:scale-105"
        >
          <PlusCircle size={20} /> Yangi test yaratish
        </button>
      </div>

      {/* Subjects */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          🧩 Siz yaratgan fanlar
        </h2>

        {Object.keys(subjects).length === 0 ? (
          <p className="text-gray-500 text-center font-semibold">
            Hech qanday test yaratilmagan.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(subjects).map((subj) => (
              <div
                key={subj}
                className="bg-white/80 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-indigo-700 mb-2">
                  {subj}
                </h3>
                <p className="text-gray-600 mb-1">
                  Savollar soni:{" "}
                  <span className="font-medium text-indigo-600">
                    {subjects[subj].length}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  📊 O‘rtacha ball: {getAverageScore(subj)}
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(subj)}
                    className="flex items-center gap-1 bg-yellow-400 text-white px-4 py-2 rounded-xl hover:bg-yellow-500 transition"
                  >
                    <Edit3 size={18} /> Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(subj)}
                    className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} /> O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-center  sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center gap-2 justify-center">
            📊 Talabalar natijalari
          </h2>
          <button
            onClick={exportResults}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow-md hover:scale-105"
          >
            <Download size={18} /> Export
          </button>
        </div>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center font-semibold">
            Hozircha natijalar mavjud emas.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((res, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4">
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <User size={18} className="text-indigo-600" />
                    {res.studentName}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    {res.subject}
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    To‘g‘ri javoblar: {res.correctAnswers} /{" "}
                    {res.totalQuestions}
                  </p>
                  <p className="flex items-center gap-2">
                    <Award size={16} className="text-yellow-500" />
                    Ball:{" "}
                    <span className="font-semibold text-gray-800">
                      {res.score}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDeleteResult(i)}
                    className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} /> O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
