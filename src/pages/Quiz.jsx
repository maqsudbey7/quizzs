import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Test from "../components/Test";
import React from "react";

export default function Quiz() {
  const { title } = useParams(); // fan nomi
  const [questionsData, setQuestionsData] = useState(null);

  useEffect(() => {
    const allSubjects = JSON.parse(localStorage.getItem("subjects")) || {};
    if (allSubjects[title]) {
      setQuestionsData({
        title,
        questions: allSubjects[title],
      });
    }
  }, [title]);

  if (!questionsData) {
    return <p className="text-center mt-10">Bu fanga savollar topilmadi.</p>;
  }

  return <Test questions={questionsData} />;
}
