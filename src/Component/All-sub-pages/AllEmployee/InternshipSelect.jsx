import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const InternshipSelect = ({ matchedType }) => {
  const [internshipOptions, setInternshipOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternshipOptions = async () => {
      const db = getDatabase();
      const internshipRef = ref(db, 'Internship_Programs');
      try {
        const snapshot = await get(internshipRef);
        if (snapshot.exists()) {
          setInternshipOptions(Object.entries(snapshot.val()));
        } else {
          console.log("No data available");
          setInternshipOptions([]);
        }
      } catch (error) {
        console.error("Error fetching internship options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipOptions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <select
      className="form-select"
      name="internship_prog"
      aria-label="Default select example"
      required
    >
      <option value="">Select Internship</option>
      {internshipOptions.map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default InternshipSelect;
