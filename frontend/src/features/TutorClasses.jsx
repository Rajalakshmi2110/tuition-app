import { useEffect, useState } from "react";
import { getTutorClasses } from "./classService";

export default function TutorClasses({ tutorId }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorClasses(tutorId)
      .then(data => {
        setClasses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tutor classes:", err);
        setLoading(false);
      });
  }, [tutorId]);

  if (loading) return <p>Loading tutor classes...</p>;
  if (!classes.length) return <p>No classes found for this tutor.</p>;

  return (
    <div>
      <h2>Classes I Teach</h2>
      <ul>
        {classes.map(cls => (
          <li key={cls._id}>
            {cls.name} — {cls.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
