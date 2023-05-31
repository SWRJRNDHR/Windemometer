import React, { useState } from "react";
import { Formik, Form } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AxiosMockAdapter from "axios-mock-adapter";

function NewJobPage({ status }) {
  const [showResults, setShowResults] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const mockAdapter = new AxiosMockAdapter(axios);
  const mock = new AxiosMockAdapter(axios);

  mock.onGet("/api/download").reply(200, {
    name: "API Gateway",
    healthCheckStatus: "OK",
    versionNumber: "1.0.0",
    dateDeployed: "2022-05-10",
  });

  const handleDownload = () => {
    axios
      .get("/api/download")
      .then((response) => {
        // Handle the response
        console.log("Download successful", response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error("Download error", error);
      });
  };

  const handleSave = () => {
    setShowResults(true);
    setShowSaveButton(false);
    setIsEditable(false);
  };

  const handleEdit = () => {
    setShowSaveButton(true);
    setIsEditable(true);
    setShowResults(false);
    setIsCompleted(false);
  };

  const calculateColor = (value) => {
    if (value === "green") {
      return "#00cc00"; // Green color
    } else if (value === "yellow") {
      return "#ffff00"; // Yellow color
    } else if (value === "red") {
      return "#ff0000"; // Red color
    }
    return "#000000"; // Default color
  };

  const navigate = useNavigate();
  const handleCloseJob = () => {
    // Handle creating a new job
    navigate("/");
    console.log("Closing");
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="container">
      <h1>New Job</h1>

      <h3>Status: {status}</h3>

      <hr />

      <h2>Project Details</h2>
      <Formik
        initialValues={{
          projectRef: "", // Set the initial value of projectRef here
        }}
        onSubmit={(values) => {
          console.log(values); // Handle form submission here
        }}
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="projectRef" className="form-label">
                    Project Ref
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="projectRef"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="clientFirstName" className="form-label">
                    Client First Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="clientFirstName"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientLastName" className="form-label">
                    Client Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="clientLastName"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="clientEmail" className="form-label">
                    Client Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    id="clientEmail"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="siteAddress" className="form-label">
                    Site Address
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="siteAddress"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="notes"
                    disabled={!isEditable}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="dateCreated" className="form-label">
                    Date Created
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="dateCreated"
                    readOnly
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="span" className="form-label">
                    Span (meters)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="span"
                      disabled={!isEditable}
                      style={{ width: "200px" }}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="length" className="form-label">
                    Length (meters)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="length"
                      disabled={!isEditable}
                      style={{ width: "200px" }}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="avgHeight" className="form-label">
                    Avg Height (meters)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="avgHeight"
                      disabled={!isEditable}
                      style={{ width: "200px" }}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="elevation" className="form-label">
                    Elevation (meters)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="elevation"
                      disabled={!isEditable}
                      style={{ width: "200px" }}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="buildingClass" className="form-label">
                    Building Class
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="buildingClass"
                  >
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="windRegion" className="form-label">
                    Wind Region
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="windRegion"
                  >
                    <option value="Region A">Region A</option>
                    <option value="Region B">Region B</option>
                    <option value="Region C">Region C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="importanceLevel" className="form-label">
                    Importance Level
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="importanceLevel"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <h4>Calculation Input</h4>
              </div>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label htmlFor="vr" className="form-label">
                      Regional Wind Speed (Vr)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="vr"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label htmlFor="ms" className="form-label">
                      Shielding (Ms)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="ms"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label htmlFor="mz" className="form-label">
                      Terrain Category (Mz)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="mz"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label htmlFor="mt" className="form-label">
                      Topography (Mt)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="mt"
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label htmlFor="md" className="form-label">
                      Wind Direction Multiplier (Md)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="md"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label htmlFor="mc" className="form-label">
                      Climate Change Multiplier (Mc)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="mc"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label htmlFor="worstDirection" className="form-label">
                      Worst Cardinal Direction
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="worstDirection"
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </div>
            </div>

            {showSaveButton && (
              <button
                type="submit"
                className="btn btn-success d-block mx-auto"
                onClick={handleSave}
              >
                Save & Request Calculation
              </button>
            )}
          </form>
        )}
      </Formik>

      {showResults && (
        <div>
          <div className="col-md-3">
            <h4>Results</h4>
          </div>
          <div className="row mt-4">
            <div className="col-md-3">
              <div>
                <p>Terrain Category (TC)</p>
                <div
                  id="tcr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
              <div>
                <p>T.C. Factor (Mz)</p>
                <div
                  id="mzr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
              <div>
                <p>Topography (Mt)</p>
                <div
                  id="mtr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
              <div>
                <p>Wind Direction Multiplier(Md)</p>
                <div
                  id="mdr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
              <div>
                <p>Climate Change Multiplier (mc)</p>
                <div
                  id="mcr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
              <div>
                <p>Vsite 1</p>
                <div
                  id="vsr"
                  style={{
                    width: "50px",
                    height: "20px",
                    backgroundColor: calculateColor("green"), // Replace with actual value from the database
                  }}
                ></div>
              </div>
            </div>
            <div className="col-md-3"></div>
            <div className="col-md-3">
              <div>
                <p>Vsite 1 (Max)</p>
                <span className="form-control-plaintext">
                  [Calculated Vsite 1 Value]
                </span>
              </div>
              {!isCompleted && (
                <div className="col-md-12" style={{ marginTop: "50px" }}>
                  <p>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    {
                      " I, Joe Bogg, as an engineer acknowledge that results have been calculated using the latest of NCC in accordance with AS/NZ1170.2"
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="row mt-4">
          <div className="col-md-12 text-center">
            {!isCompleted ? (
              <button className="btn btn-primary me-2" onClick={handleComplete}>
                Complete
              </button>
            ) : (
              <button className="btn btn-primary me-2" onClick={handleDownload}>
                Download Report
              </button>
            )}
            <button className="btn btn-secondary me-2" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn btn-danger me-2" onClick={handleCloseJob}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewJobPage;
