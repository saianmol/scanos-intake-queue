import { useEffect, useState } from "react";

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/submissions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        return response.json();
      })
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load submissions");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Loading submissions...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Intake Queue</h1>

      <p>Total submissions: {submissions.length}</p>

      {submissions.map((submission) => (
        <div key={submission._id}>
          <h3>{submission.patient_name}</h3>

          <p>Age: {submission.age}</p>

          <p>Phone: {submission.phone}</p>

          <p>Concern: {submission.primary_concern}</p>

          <p>Status: {submission.status}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;