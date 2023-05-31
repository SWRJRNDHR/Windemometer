import React from "react";

function HealthCheck() {
  const mockServices = [
    {
      name: "API Gateway",
      healthCheckStatus: "OK",
      versionNumber: "1.0.0",
      dateDeployed: "2022-05-10",
    },
  ];

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
          {mockServices.map((service) => (
            <tr key={service.name}>
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
