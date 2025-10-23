// storage.js — localStorage bilan ishlovchi yordamchi funksiyalar
export const getSubjects = () => JSON.parse(localStorage.getItem("subjects")) || {};
export const setSubjects = (data) => localStorage.setItem("subjects", JSON.stringify(data));

export const getResults = () => JSON.parse(localStorage.getItem("results")) || [];
export const setResults = (data) => localStorage.setItem("results", JSON.stringify(data));

export const getFeedbacks = () => JSON.parse(localStorage.getItem("feedbacks")) || [];
export const setFeedbacks = (data) => localStorage.setItem("feedbacks", JSON.stringify(data));

export const getLoggedUser = () => JSON.parse(localStorage.getItem("loggedUser"));
export const setLoggedUser = (user) => localStorage.setItem("loggedUser", JSON.stringify(user));
export const removeLoggedUser = () => localStorage.removeItem("loggedUser");
