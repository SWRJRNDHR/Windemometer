import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AxiosMockAdapter from "axios-mock-adapter";
import { Auth } from "aws-amplify";

function NewJobPage() {
  const [showResults, setShowResults] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [showUpdateButton, setUpdateButton] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const mockAdapter = new AxiosMockAdapter(axios);
  const mock = new AxiosMockAdapter(axios);
  const [dateCreated, setDateCreated] = useState("");

  //const [ProjectId, setProjectId] = useState("");
  const [job_reference, setjob_reference] = useState("");
  const [client_first_name, setclient_first_name] = useState("");
  const [client_last_name, setclient_last_name] = useState("");
  const [client_email, setclient_email] = useState("");
  const [site_address, setsite_address] = useState("");
  const [notes, setNotes] = useState("");
  const [span, setSpan] = useState("");
  const [cardinalDirection, setCardinalDirection] = useState("");
  const [length, setLength] = useState("");
  const [average_height, setaverage_height] = useState("");
  const [elevation, setElevation] = useState("");
  const [building_class, setbuilding_class] = useState("");
  const [wind_region, setwind_region] = useState("");
  const [importance_level, setimportance_level] = useState("");
  const [regionalWindspeed, setregionalWindspeed] = useState("");
  const [shielding, setshielding] = useState("");
  const [terrainCategory, setterrainCategory] = useState("");
  const [topography, settopography] = useState("");
  const [windDirectionalMultiplier, setwindDirectionalMultiplier] =
    useState("");
  const [climateMultiplier, setclimateMultiplier] = useState("");
  const [status, setStatus] = useState("WORKING");
  const [calculatedWindspeed, setCalculatedWindspeed] = useState(null);
  const [projectId, setProjectId] = useState(null);

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

  useEffect(() => {
    const today = new Date();
    const formattedDate = formatDate(today); // Format the date if needed
    setDateCreated(formattedDate);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getUserID = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userID = user.attributes.sub;
      //console.log(userID);
      return userID;
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const user_id = await getUserID();
    const date_created = dateCreated;
    const userId = await getUserID();
    console.log(userId);
    console.log("Selected wind region:", wind_region);

    const projectRequestBody = {
      average_height,
      building_class,
      client_email,
      client_first_name,
      client_last_name,
      elevation,
      importance_level,
      job_reference,
      length,
      notes,
      site_address,
      span,
      status: "AT_REVIEW",
      user_id,
      wind_region,
    };

    // Disable the save button and make the form fields read-only

    fetch("https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectRequestBody),
    })
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        // Handle the response from the API
        console.log("Project API response:", data);
        // Extract the project ID from the response
        const projectId = data.id;

        // Create the windspeeds request body with the project ID
        const windspeedRequestBody = {
          ProjectId: projectId,
          userId,
          regionalWindspeed,
          shielding,
          terrainCategory,
          topography,
          windDirectionalMultiplier,
          climateMultiplier,
          dateCreated,
          cardinalDirection,
          status: "COMPLETED",
        };

        // Make the windspeeds API call
        return fetch(
          "https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/windspeeds/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(windspeedRequestBody),
          },
        );
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the windspeeds API
        console.log("HEY THERE Windspeed API response:", data);

        const windspeedCalculateBody = {
          projectId,
          date_created,
          cardinalDirection,
          terrainCategory,
          windDirectionalMultiplier,
          climateMultiplier,
          regionalWindspeed,
          shielding,
          topography,
          status: "CALCULATED",
          user_id,
        };
        return fetch(
          `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/windspeeds/${data.id}/calculate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(windspeedCalculateBody),
          },
        );

        // You can update the state or perform any other actions with the response data here
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the windspeeds API
        //console.log("API response:", data);
        setCalculatedWindspeed(data);
        const projectId = data.projectId;
        console.log("STATUS Windspeed: ", data);
        setShowSaveButton(false);
        setIsEditable(false);
        setShowResults(true);

        return projectId;
        // You can update the state or perform any other actions with the response data here
      })
      .then((projectId) => {
        setProjectId(projectId);
      })

      .catch((error) => {
        // Handle any errors that occurred during the API calls
        console.error("API error:", error);
      });
  };

  const handleEdit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Project id is: ", projectId);
    const user_id = await getUserID();
    console.log("Project id is: ", projectId);
    console.log("Selected wind region:", wind_region);

    const updateRequestBody = {
      average_height,
      building_class,
      client_email,
      client_first_name,
      client_last_name,
      elevation,
      importance_level,
      job_reference,
      length,
      notes,
      site_address,
      span,
      status: "WORKING",
      user_id,
      wind_region,
    };

    // Disable the save button and make the form fields read-only

    fetch(
      `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequestBody),
      },
    )
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        // Handle the response from the API
        console.log("From EDIT Button Project API response:", data);
        setUpdateButton(true);
        setIsEditable(true);
        setShowResults(false);
        setIsCompleted(false);
      })

      .catch((error) => {
        // Handle any errors that occurred during the API calls
        console.error("API error:", error);
      });
  };

  const handleUpdate = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Project id is: ", projectId);
    //const user_id = await getUserID();
    const user_id = await getUserID();
    const date_created = dateCreated;
    const userId = await getUserID();
    console.log("Project id is: ", projectId);
    console.log("Selected wind region:", wind_region);

    const updateRequestBody = {
      average_height,
      building_class,
      client_email,
      client_first_name,
      client_last_name,
      elevation,
      importance_level,
      job_reference,
      length,
      notes,
      site_address,
      span,
      status: "WORKING",
      user_id,
      wind_region,
    };

    // Disable the save button and make the form fields read-only

    fetch(
      `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequestBody),
      },
    )
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        // Handle the response from the API

        // Create the windspeeds request body with the project ID
        const windspeedRequestBody = {
          ProjectId: projectId,
          userId,
          regionalWindspeed,
          shielding,
          terrainCategory,
          topography,
          windDirectionalMultiplier,
          climateMultiplier,
          dateCreated,
          cardinalDirection,
        };

        // Make the windspeeds API call
        return fetch(
          "https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/windspeeds/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(windspeedRequestBody),
          },
        );
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the windspeeds API
        console.log("Another Windspeed API response:", data);

        const windspeedCalculateBody = {
          projectId,
          date_created,
          cardinalDirection,
          terrainCategory,
          windDirectionalMultiplier,
          climateMultiplier,
          regionalWindspeed,
          shielding,
          topography,
          status: "CALCULATED",
          user_id,
        };
        console.log("From Update Button Project API response:", data);
        setUpdateButton(false);
        setIsEditable(true);
        setShowResults(true);
        setIsCompleted(false);
        return fetch(
          `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/windspeeds/${data.id}/calculate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(windspeedCalculateBody),
          },
        );
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the windspeeds API
        //console.log("API response:", data);
        setCalculatedWindspeed(data);
        const projectId = data.projectId;
        console.log("STATUS Windspeed: ", data.status);
        setShowSaveButton(false);
        setIsEditable(false);
        setShowResults(true);

        return projectId;
        // You can update the state or perform any other actions with the response data here
      })
      .then((projectId) => {
        setProjectId(projectId);
      })

      .catch((error) => {
        // Handle any errors that occurred during the API calls
        console.error("API error:", error);
      });
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

  const handleComplete = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const user_id = await getUserID();
    const userId = await getUserID();
    console.log("Project id is: ", projectId);
    console.log("Selected wind region:", wind_region);
    const date_created = dateCreated;

    const updateRequestBody = {
      average_height,
      building_class,
      client_email,
      client_first_name,
      client_last_name,
      elevation,
      importance_level,
      job_reference,
      length,
      notes,
      site_address,
      span,
      status: "COMPLETED",
      user_id,
      wind_region,
    };

    // Disable the save button and make the form fields read-only

    fetch(
      `https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateRequestBody),
      },
    )
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        // Handle the response from the API
        console.log("Project API response:", data);
        setIsCompleted(true);
      })

      .catch((error) => {
        // Handle any errors that occurred during the API calls
        console.error("API error:", error);
      });
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    if (id === "wind_region") {
      setwind_region(value);
    } else if (id === "importance_level") {
      setimportance_level(parseFloat(e.target.value));
    } else if (id === "building_class") {
      setbuilding_class(e.target.value);
    }
  };

  /* useEffect(() => {
    // Update the status automatically from api
    const newStatus = "WORKING";

    // Update the status state
    setStatus(newStatus);
  }, []);
*/

  return (
    <div className="container">
      <h1>New Job</h1>
      <h3>Status: {status}</h3>
      <hr />
      <h2>Project Details</h2>
      <form onSubmit={handleSave}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="projectRef" className="form-label">
                Project Ref
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="job_reference"
                disabled={!isEditable}
                style={{ width: "200px" }}
                value={job_reference}
                onChange={(e) => setjob_reference(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="client_first_name" className="form-label">
                Client First Name
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="client_first_name"
                disabled={!isEditable}
                style={{ width: "200px" }}
                value={client_first_name}
                onChange={(e) => setclient_first_name(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="client_last_name" className="form-label">
                Client Last Name
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="client_last_name"
                disabled={!isEditable}
                style={{ width: "200px" }}
                value={client_last_name}
                onChange={(e) => setclient_last_name(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="client_email" className="form-label">
                Client Email
              </label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="client_email"
                disabled={!isEditable}
                style={{ width: "200px" }}
                value={client_email}
                onChange={(e) => setclient_email(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="site_address" className="form-label">
                Site Address
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="site_address"
                disabled={!isEditable}
                style={{ width: "500px" }}
                value={site_address}
                onChange={(e) => setsite_address(e.target.value)}
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
                style={{ width: "500px" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                value={dateCreated}
                readOnly
                style={{ width: "200px" }}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
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
                      value={span}
                      onChange={(e) => setSpan(parseFloat(e.target.value))}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
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
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="average_height" className="form-label">
                    Avg Height (meters)
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="average_height"
                      disabled={!isEditable}
                      style={{ width: "200px" }}
                      value={average_height}
                      onChange={(e) =>
                        setaverage_height(parseFloat(e.target.value))
                      }
                    />
                    <span className="input-group-text">meters</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
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
                      value={elevation}
                      onChange={(e) => setElevation(parseFloat(e.target.value))}
                    />

                    <span className="input-group-text">meters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="building_class" className="form-label">
                    Building Class
                  </label>
                  <select
                    className="form-control form-control-sm"
                    id="building_class"
                    disabled={!isEditable}
                    value={building_class}
                    onChange={(e) => setbuilding_class(e.target.value)}
                  >
                    <option value="">Select Building Class</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="7a">7a</option>
                    <option value="7b">7b</option>
                    <option value="8">8</option>
                    <option value="9a">9a</option>
                    <option value="9b">9b</option>
                    <option value="9c">9c</option>
                    <option value="10">10</option>
                    <option value="10a">10a</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="wind_region" className="form-label">
                    Wind Region
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="wind_region"
                    value={wind_region}
                    disabled={!isEditable}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select Wind Region</option>
                    <option value="A">A</option>
                    <option value="A0">A0</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="A3">A3</option>
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="A6">A6</option>
                    <option value="A7">A7</option>
                    <option value="B">B</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="importance_level" className="form-label">
                    Importance Level
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="importance_level"
                    value={importance_level}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select Importance Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
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
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="regionalWindspeed" className="form-label">
                      Regional Wind Speed (regionalWindspeed)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="regionalWindspeed"
                      disabled={!isEditable}
                      value={regionalWindspeed}
                      onChange={(e) => setregionalWindspeed(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="shielding" className="form-label">
                      Shielding (shielding)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="shielding"
                      disabled={!isEditable}
                      value={shielding}
                      onChange={(e) => setshielding(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="terrainCategory" className="form-label">
                      Terrain Category (terrainCategory)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="terrainCategory"
                      disabled={!isEditable}
                      value={terrainCategory}
                      onChange={(e) => setterrainCategory(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="topography" className="form-label">
                      Topography (Mt)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="topography"
                      disabled={!isEditable}
                      value={topography}
                      onChange={(e) => settopography(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label
                      htmlFor="windDirectionalMultiplier"
                      className="form-label"
                    >
                      Wind Direction Multiplier (Md)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="windDirectionalMultiplier"
                      disabled={!isEditable}
                      value={windDirectionalMultiplier}
                      onChange={(e) =>
                        setwindDirectionalMultiplier(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="climateMultiplier" className="form-label">
                      Climate Change Multiplier (climateMultiplier)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="climateMultiplier"
                      disabled={!isEditable}
                      value={climateMultiplier}
                      onChange={(e) => setclimateMultiplier(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="cardinalDirection" className="form-label">
                      cardinalDirection (cardinalDirection)
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="cardinalDirection"
                      disabled={!isEditable}
                      value={cardinalDirection}
                      onChange={(e) => setCardinalDirection(e.target.value)}
                    />
                  </div>
                </div>
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
        {showUpdateButton && (
          <button
            type="submit"
            className="btn btn-success d-block mx-auto"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </form>
      {showResults && (
        <div>
          <div className="col-md-3">
            <h4>Results</h4>
          </div>
          <div className="row mt-4">
            <div className="col-md-3">
              <div>
                <p>Terrain Category (TC)</p>
                {calculatedWindspeed && (
                  <div>{calculatedWindspeed.terrainCategory}</div>
                )}
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
                {calculatedWindspeed && (
                  <div>{calculatedWindspeed.topography}</div>
                )}
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
                {calculatedWindspeed && (
                  <div>{calculatedWindspeed.windDirectionalMultiplier}</div>
                )}
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
                {calculatedWindspeed && (
                  <div>{calculatedWindspeed.climateMultiplier}</div>
                )}
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
                {calculatedWindspeed && <div>{calculatedWindspeed.vSite1}</div>}
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
                {calculatedWindspeed && (
                  <div>
                    <h2>VSsite1 Calculation</h2>
                    <h2> {calculatedWindspeed.vSite1}</h2>
                  </div>
                )}
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
