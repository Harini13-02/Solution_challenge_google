import { BrowserRouter, Route, Routes } from "react-router-dom";

function LandingPage() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Community AI Platform</h1>
      <h2>Google Solution Challenge Project</h2>

      <p>
        A platform connecting citizens, NGOs, volunteers, and donors
        to solve real-world community problems.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li>Citizen issue reporting</li>
        <li>Volunteer contribution (time / money / both)</li>
        <li>NGO request management</li>
        <li>Donor support system</li>
        <li>Admin monitoring dashboard</li>
        <li>Google Gemini AI powered verification</li>
      </ul>

      <h3>Technology Used</h3>
      <ul>
        <li>Frontend: React + Vite</li>
        <li>Backend: Node.js + Express</li>
        <li>Database: MongoDB Atlas</li>
        <li>Cloud Deployment: Vercel</li>
        <li>AI Service: Google Gemini API</li>
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
