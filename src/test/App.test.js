import React from "react";
import { render, screen } from "@testing-library/react";
import HealthCheck from "../components/HealthCheck.jsx";

describe("HealthCheck", () => {
  it("should render the health check table with mock service data", () => {
    // Render the component
    render(<HealthCheck />);

    // Check if the component renders the table with the correct headers
    expect(screen.getByText("Health Check")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Health Check Status")).toBeInTheDocument();
    expect(screen.getByText("Version Number")).toBeInTheDocument();
    expect(screen.getByText("Date Deployed")).toBeInTheDocument();

    // Check if the component renders the mock service data
    expect(screen.getByText("API Gateway")).toBeInTheDocument();
    expect(screen.getByText("OK")).toHaveClass("bg-success");
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
    expect(screen.getByText("2022-05-10")).toBeInTheDocument();
  });
});
