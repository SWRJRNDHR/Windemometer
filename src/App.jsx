import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HealthCheck from "./components/HealthCheck";
import ExistingJob from "./components/ExistingJob";
import UserForm from "./components/UserForm";
import NewJobPage from "./components/NewJobPage";

import { Amplify } from "aws-amplify";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./Configuration";
Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div className="d-flex justify-content-end p-3">
            <button className="btn btn-danger" onClick={signOut}>
              Sign out
            </button>
          </div>
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/HealthCheck" element={<HealthCheck />} />
            <Route path="/NewJobPage" element={<NewJobPage />} />
            <Route path="/ExistingJob" element={<ExistingJob />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      )}
    </Authenticator>
  );
}
