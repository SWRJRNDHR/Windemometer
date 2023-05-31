import React from "react";
import { Route, Routes } from "react-router-dom";
import HealthCheck from "./components/HealthCheck";
import UserForm from "./components/UserForm";
import NewJobPage from "./components/NewJobPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/HealthCheck" element={<HealthCheck />} />
      <Route path="/NewJobPage" element={<NewJobPage />} />
    </Routes>
  );
}

export default App;
