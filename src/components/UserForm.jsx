import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserForm({ userName }) {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const jobField = document.getElementById("jobField").value;
    const clientName = document.getElementById("clientName").value;

    if (jobField.trim() === "" && clientName.trim() === "") {
      setSearchResults([]);
      return;
    }

    fetch("https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/")
      .then((response) => response.json())
      .then((data) => {
        // Filter the search results based on job_reference and client_first_name
        const filteredResults = data.filter(
          (result) =>
            result.job_reference.includes(jobField) &&
            result.client_first_name.includes(clientName),
        );
        setSearchResults(filteredResults);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  const navigate = useNavigate();

  const handleOpenReport = (projectId) => {
    // Handle opening the job report for the selected project
    console.log("Opening job report for project ID:", projectId);

    // Call the projects/id API and navigate to NewJobPage with the project data
    fetch(
      `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/${projectId}`,
    )
      .then((response) => response.json())
      .then((data) => {
        // Navigate to NewJobPage and pass the project data as state
        navigate("/ExistingJob", { state: { projectData: data } });
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      });
  };

  const handleCreateJob = () => {
    // Handle creating a new job
    navigate("/NewJobPage");
    console.log("Creating new job");
  };

  return (
    <div className="container">
      <h1 className="mt-5">Welcome </h1>
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
                <td>{result.job_reference}</td>
                <td>{result.date_created}</td>
                <td>{result.client_first_name}</td>
                <td>{result.site_address}</td>
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
