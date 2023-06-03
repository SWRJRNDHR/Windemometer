import React, { useEffect, useState } from "react";

function HealthCheck() {
  const endpointUrls = [
    "https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/projects/health",
    "https://1tg41k5u7h.execute-api.us-east-1.amazonaws.com/windspeeds/health",
  ];
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all(
        endpointUrls.map((url) =>
          fetch(url).then((response) => response.json()),
        ),
      );
      const formattedServices = responses.map((data, index) => ({
        name: `Service ${index + 1}`,
        healthCheckStatus: data.status === "ok" ? "OK" : "Error",
        versionNumber: data.version,
        dateDeployed: data.date_deployed,
      }));
      setServices(formattedServices);
    };

    fetchData();
  }, [endpointUrls]);

  return (
    <div>
      <h2>Health Check</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Health Check Status</th>
            <th>Version Number</th>
            <th>Date Deployed</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td>{service.name}</td>
              <td
                className={
                  service.healthCheckStatus === "OK"
                    ? "bg-success"
                    : "bg-danger"
                }
              >
                {service.healthCheckStatus}
              </td>
              <td>{service.versionNumber}</td>
              <td>{service.dateDeployed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HealthCheck;
