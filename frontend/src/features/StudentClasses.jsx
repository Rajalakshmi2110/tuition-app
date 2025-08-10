import { useEffect, useState } from "react";
import { getStudentClasses } from "./classService";

export default function StudentClasses({ studentId }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentClasses(studentId)
      .then(data => {
        setClasses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching student classes:", err);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>Loading student classes...</p>;
  if (!classes.length) return <p>No classes found for this student.</p>;

  return (
    <div>
      <h2>My Classes</h2>
      <ul>
        {classes.map(cls => (
          <li key={cls._id}>
            {cls.name} — {cls.tutor?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
