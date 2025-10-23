import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const subjects = JSON.parse(localStorage.getItem("subjects")) || {};
  const results = JSON.parse(localStorage.getItem("results")) || [];
  const navigate = useNavigate();

  if (!user || user.role !== "teacher") {
    return <p className="p-6 text-red-500">Only teachers can access this page.</p>;
  }

  const handleEdit = (subject) => {
    navigate(`/edit/${subject}`);
  };

  const handleDelete = (subject) => {
    if (window.confirm("Are you sure to delete this quiz?")) {
      delete subjects[subject];
      localStorage.setItem("subjects", JSON.stringify(subjects));
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Teacher Dashboard</h1>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Created Quizzes</h2>
        {Object.keys(subjects).length === 0 && <p>No quizzes created yet.</p>}
        {Object.keys(subjects).map(subj => (
          <div key={subj} className="p-4 border rounded mb-3 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{subj}</h3>
              <p>Total Questions: {subjects[subj].length}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(subj)} className="bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-300">Edit</button>
              <button onClick={() => handleDelete(subj)} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400 text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Student Results</h2>
        {results.length === 0 && <p>No results yet.</p>}
        {results.map((res, i) => (
          <div key={i} className="p-4 border rounded mb-2 bg-white">
            <p><strong>Student:</strong> {res.studentPhone}</p>
            <p><strong>Subject:</strong> {res.subject}</p>
            <p><strong>Correct:</strong> {res.correctAnswers} / {res.totalQuestions}</p>
            <p><strong>Score:</strong> {res.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
