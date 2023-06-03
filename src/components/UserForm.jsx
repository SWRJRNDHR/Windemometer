import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserForm({ userName }) {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    fetch("https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/")
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  const navigate = useNavigate();
  const handleCreateJob = () => {
    // Handle creating a new job
    navigate("/NewJobPage");
    console.log("Creating new job");
  };

  const handleOpenReport = (projectId) => {
    // Handle opening the job report for the selected project
    console.log("Opening job report for project ID:", projectId);
  };

  return (
    <div className="container">
      <h1 className="mt-5">Welcome Username {userName}</h1>
      <div className="row mt-5">
        <div className="col-md-6">
          <label htmlFor="jobField" className="form-label">
            Job Field
          </label>
          <input type="text" className="form-control" id="jobField" />
        </div>
        <div className="col-md-6">
          <label htmlFor="clientName" className="form-label">
            Client Name
          </label>
          <input type="text" className="form-control" id="clientName" />
        </div>
      </div>
      <div className="mt-3">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="completed" />
          <label className="form-check-label" htmlFor="completed">
            Completed
          </label>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSearch}>
        Search
      </button>

      {searchResults.length > 0 && (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Project Reference</th>
              <th>Date Created</th>
              <th>Client Name</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result) => (
              <tr key={result.id}>
                <td>{result.projectReference}</td>
                <td>{result.dateCreated}</td>
                <td>{result.clientName}</td>
                <td>{result.address}</td>
                <td>{result.status}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenReport(result.id)}
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn btn-success mt-3" onClick={handleCreateJob}>
        Create New Job
      </button>
    </div>
  );
}

export default UserForm;
