import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './allemployee.css';
import Nav from '../../Nav/Nav';
import Footer from '../../footer/Footer';
import student from '../../../assets/student.gif'
import PointConfetti from './PointConfetti';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Preloader from './Preloader';
import Swal from 'sweetalert2';
import { db } from '../../../FirebaseConfig';
import { get, push, ref, set } from "firebase/database";

const courseAvailability = {
  "Data Science": ["Janurary 2025", "February 2025"],
  "Artificial Intelligence": ["Janurary 2025", "February 2025"],
  "Web development": ["Janurary 2025", "February 2025"],
  "Cyber Security": ["Janurary 2025", "February 2025"],
  "Digital Marketing": ["Janurary 2025", "February 2025"],
  "Genetic Engineering": ["February 2025", "April 2025"],
  // "Bioinformatics": ["December 2024"],
  "Machine Learning": ["Janurary 2025", "February 2025"],
  "Business Analytics": ["February 2025", "April 2025"],
  "Stock Marketing": ["February 2025", "April 2025"],
  "Robotics": ["February 2025", "April 2025"],
  // "Finance": ["December 2024"],
  // "Car Designing": [],
  "AutoCad": ["February 2025", "April 2025"],
  // "Nano Science": [],
  "AWS": ["February 2025", "April 2025"],
  "App Development": ["February 2025", "April 2025"],
  // "Human Resource": [],
  // "Embedded System": [],
  // "Data Structure & Algorithm": ["Janurary 2025"],
  // "Java": ["Janurary 2025"],
}

const ObForm = ({ enteredEmail }) => {

  const [load, setLoad] = useState(true);
  const [data, setData] = useState('');
  const [months, setMonths] = useState([]);
  const [matchedName, setMatchedName] = useState('');
  const [matchedEmaild, setmatchedEmaild] = useState('');
  const [matchedPhone, setmatchedPhone] = useState('');
  const [matchedAddOn, setmatchedAddOn] = useState('');
  const [matchedType, setmatchedType] = useState('');
  const [availableMonths, setAvailableMonths] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [internshipPrograms, setInternshipPrograms] = useState([]);
  const [internshipProgramsSelf, setInternshipProgramsSelf] = useState([]);

  //State for firebase
  const [userData, setUserData] = useState({
    college_email: "",
    college_name: "",
    alternative_phone: "",
    whatsapp_phone: "",
    branch_of_study: "",
    year_of_study: "",
    internship_prog: "",
    internship_month: "",
    // reg_id: "",
    add_on: "",
  });

  const [errors, setErrors] = useState({
    college_email: "",
    whatsapp_phone: "",
    alternative_phone: "",
    // reg_id: "",
    add_on: "",
    college_name: "",
  });

  const postUserData = (event) => {
    const { name, value } = event.target;

    // Update userData state
    setUserData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'internship_prog') {
      // Update the available months based on the selected course
      const availableMonths = courseAvailability[value] || [];
      setAvailableMonths(availableMonths);
    }

    // Validate the field
    validateField(name, value);
  };

  const validatewhatsapp_phone = (whatsapp_phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!whatsapp_phone.match(phonePattern)) {
      return 'Please enter a 10-digit number starting with 6, 7, 8, or 9.';
    }
    return '';
  };

  const validatealternative_phone = (alternative_phone) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!alternative_phone.match(phonePattern)) {
      return 'Please enter a 10-digit number starting with 6, 7, 8, or 9.';
    }
    return '';
  };

  const validateEmail = (college_email) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
    if (!college_email.match(emailPattern)) {
      return 'Invalid college email address.';
    }
    return '';
  };

  const validateCollegeName = (college_name) => {
    if (college_name == "") {
      return 'College name should not be blank.';
    }
    return '';
  };

  const validateAddOn = (add_on) => {
    if (add_on == "") {
      return 'Please enter valid Series No.';
    }
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'alternative_phone':
        setErrors({ ...errors, alternative_phone: validatealternative_phone(value) });
        break;
      case 'whatsapp_phone':
        setErrors({ ...errors, whatsapp_phone: validatewhatsapp_phone(value) });
        break;
      case 'college_name':
        setErrors({ ...errors, college_name: validateCollegeName(value) });
        break;
      // case 'reg_id':
      //   setErrors({ ...errors, reg_id: validateRegId(value) });
      //   break;
      case 'college_email':
        setErrors({ ...errors, college_email: validateEmail(value) });
        break;
      case 'add_on':
        setErrors({ ...errors, add_on: validateAddOn(value) });
        break;
      default:
        break;
    }
  };

  const navigate = useNavigate();

  // Connect with Google Firebase
  const submitObData = async (event) => {
    event.preventDefault();
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);
    try {
      const currentDateTime = new Date().toLocaleString();
      // Check if any required field is empty
      if (
        !userData.college_email ||
        !userData.whatsapp_phone ||
        !userData.alternative_phone ||
        !userData.college_name ||
        !userData.branch_of_study ||
        !userData.year_of_study ||
        // !userData.reg_id ||
        !userData.internship_month ||
        !userData.internship_prog ||
        (matchedAddOn == "Yes" && !userData.add_on)
      ) {
        throw new Error('Please fill in all required fields.');
      }

      if (errors.college_email || errors.whatsapp_phone || errors.alternative_phone || errors.college_name) {
        throw new Error('Please fix validation errors before submitting.');
      }

      // Check if reg_id matches matchedreg_id
      // else if (userData.reg_id !== matchedreg_id) {
      //   throw new Error('Registration ID does not match.');
      // }

      const userRef = push(ref(db, 'OB Form Data'));
      await set(userRef, {
        student_name: matchedName,
        student_email: matchedEmaild,
        Student_phone: matchedPhone,
        college_email: userData.college_email,
        college_name: userData.college_name,
        alternative_phone: userData.alternative_phone,
        whatsapp_phone: userData.whatsapp_phone,
        branch_of_study: userData.branch_of_study,
        year_of_study: userData.year_of_study,
        internship_prog: userData.internship_prog,
        internship_month: userData.internship_month,
        // reg_id: userData.reg_id,
        Opted_AddOn: matchedAddOn,
        add_on: userData.add_on,
        date: currentDateTime,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'OB Form filled successfully!',
      });

      // Clear the form after successful submission
      setUserData({
        college_email: "",
        college_name: "",
        alternative_phone: "",
        whatsapp_phone: "",
        branch_of_study: "",
        year_of_study: "",
        internship_prog: "",
        internship_month: "",
        // reg_id: "",
        add_on: "",
      });
      navigate('/Openform', { replace: true });  // Use navigate to redirect
    } catch (error) {
      console.error('Error submitting data: ', error.message);

      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.message || 'There was an error submitting the data. Please try again later.',
      });
      setIsDisabled(false);
    }
  };


  useEffect(() => {
    const apiData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_DATA);
        setData(response.data);
      } catch (error) {
        setLoad(error.message);
      } finally {
        setLoad(false);
      }
    };
    apiData();
  }, []);

  //Checking array(True | False)
  const findObjectByEmail = (dataArray, email) => {
    if (Array.isArray(dataArray)) {
      return dataArray.find(obj => obj.student_email && obj.student_email.toLowerCase() === email.toLowerCase());
    }
    return null;
  };


  useEffect(() => {
    const matchedObject = findObjectByEmail(data, enteredEmail);
    if (matchedObject) {
      setMatchedName(matchedObject.student_name || '');
      setmatchedEmaild(matchedObject.student_email || '');
      setmatchedPhone(matchedObject.phone || '');
      setmatchedAddOn(matchedObject.add_on || '');
      setmatchedType(matchedObject.TYPE || '');
    } else {
      setMatchedName('');
      setmatchedEmaild('');
      setmatchedPhone('');
      setmatchedAddOn('');
      setmatchedType('');
    }
  }, [data, enteredEmail]);


  // Fetching months from firebase
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        if (matchedType === "SELF LED" || matchedType === "SELF LED WITH ADD ON") {
          const monthsRef = ref(db, 'Internship_months');
          const snapshot = await get(monthsRef);

          if (snapshot.exists()) {
            const fetchedMonths = snapshot.val();

            if (Array.isArray(fetchedMonths)) {
              setMonths(fetchedMonths);
            } else {
              console.error("Fetched data is not an array: ", fetchedMonths);
            }
          } else {
            console.log("No data available");
          }
        }
      } catch (error) {
        console.error("Error fetching months:", error);
      }
    };

    fetchMonths();
  }, [matchedType]);


  // Fetching Internship Programs for Expert && ADD ON from firebase
  useEffect(() => {
    const fetchInternshipPrograms = async () => {
      const dbRef = ref(db, 'Internship_Programs(EXPERT && ADD ON)');
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const programs = Object.values(data);
          setInternshipPrograms(programs);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching internship programs:', error);
      }
    };

    fetchInternshipPrograms();
  }, []);

    // Fetching Internship Programs for SELF && ADD ON from firebase
    useEffect(() => {
      const fetchInternshipPrograms = async () => {
        const dbRef = ref(db, 'Internship_Programs(SELF && ADD ON)');
        try {
          const snapshot = await get(dbRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const programs = Object.values(data);
            setInternshipProgramsSelf(programs);
          } else {
            console.log('No data available');
          }
        } catch (error) {
          console.error('Error fetching internship programs:', error);
        }
      };
  
      fetchInternshipPrograms();
    }, []);


  const words = matchedName.toLowerCase().split(' ');
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  return (
    <>
      {!enteredEmail && <Navigate to="/Openform" replace={true}></Navigate>}
      {load ? (
        <Preloader />
      ) : (
        <>
          <PointConfetti />
          <Nav />
          <section className="section_gap">
            <div className="d-flex justify-content-center align-items-center vh-auto mb-5">
              <div className="container">
                <form className="registration-form p-3 rounded border overflow-auto w-100">
                  <h4>Fill your OnBoarding</h4>
                  <hr />
                  <div className="alert onboarding_info" role="alert">
                    <h4 className="alert-heading opacity-75 fs-5" style={{ display: 'inline-block' }}>Hello {matchedName && firstWord}!
                      <img src={student} alt="" style={{ width: "50px" }} /></h4>
                    <p>Congratulations once again on joining our vibrant community at EdiGlobe Student Community! As you settle into your new role, we're eager to create a dynamic and engaging experience for you.</p>
                    <hr id='alert_line' />
                    <p className="mb-1 text-light text-decoration-underline">Points to Remember:</p>
                    <ol className='list-group'>
                      <li class="list-group-item">&#9755;&nbsp;Please fill all the details below properly as those will be used in all further communications.</li>
                      <li class="list-group-item">&#9755;&nbsp;Make sure to use same emails and contact number which you have used at the time of registration.</li>
                      <li class="list-group-item">&#9755;&nbsp;Details cannot changed further.</li>
                    </ol>
                  </div>
                  <div className='rounded border py-2'>
                    <label htmlFor="fullName">Full Name:
                      <span className='badge text-bg-danger w-auto py-1  ms-2 bg-opacity-25 text-dark'>
                        {matchedName && matchedName}
                      </span></label>

                    <label htmlFor="reg_email">Registered Email:
                      <span className='badge text-bg-success w-auto ms-2 py-1 bg-opacity-25 text-dark'>
                        {matchedEmaild && matchedEmaild}</span></label>

                    <label htmlFor="phone ">Phone:
                      <span className='badge text-bg-info w-auto ms-2 py-1 bg-opacity-25 text-dark'>
                        {matchedPhone && matchedPhone}</span></label>

                    <label htmlFor="phone ">Opted for AddOn:
                      <span className='badge text-bg-dark w-auto ms-2 py-1 bg-opacity-25 text-dark'>
                        {matchedAddOn && matchedAddOn}</span></label>

                    <label htmlFor="TYPE ">Course Type:
                      <span className='badge text-bg-dark w-auto ms-2 py-1 bg-opacity-25 text-dark'>
                        {matchedType && matchedType}</span></label>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* First Column for OB form */}
                      <label htmlFor="email">College Email ID:</label>
                      <input type="email"
                        placeholder="College Email"
                        name="college_email"
                        className="form-control"
                        value={userData.college_email}
                        required
                        onChange={postUserData}
                        pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$" />
                      {errors.college_email && <div className="error">{errors.college_email}</div>}

                      <label htmlFor="college">College Name:</label>
                      <input type="text"
                        name="college_name"
                        className="form-control"
                        placeholder="College Name"
                        value={userData.college_name}
                        onChange={postUserData}
                        required
                        pattern="[A-Za-z ]*" />
                      {errors.college_name && <div className="error">{errors.college_name}</div>}

                      <label htmlFor="branch">Year of Study:</label>
                      <div className="custom-dropdown d-flex inline-block">
                        <select
                          name="year_of_study"
                          className="form-select"
                          required
                          value={userData.year_of_study}
                          onChange={postUserData}
                        >
                          <option value="" disabled>Select Year</option>
                          <option value="1st_year">1st Year</option>
                          <option value="2nd_year">2nd Year</option>
                          <option value="3rd_year">3rd Year</option>
                          <option value="4th_year">4th Year</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <label htmlFor="phone">Alternative Number:</label>
                      <input
                        placeholder="Alternative Number"
                        name="alternative_phone"
                        className="form-control"
                        value={userData.alternative_phone}
                        onChange={postUserData}
                        required pattern="[6-9][0-9]{9}" />
                      {errors.alternative_phone && <div className="error">{errors.alternative_phone}</div>}

                    </div>

                    <div className="col-sm-6">
                      {/* Second Column */}
                      <label htmlFor="phone">Whatsapp Number:</label>
                      <input
                        placeholder="Whatsapp Number"
                        name="whatsapp_phone"
                        className="form-control"
                        value={userData.whatsapp_phone}
                        onChange={postUserData}
                        required
                        pattern="[6-9][0-9]{9}" />
                      {errors.whatsapp_phone && <div className="error">{errors.whatsapp_phone}</div>}

                      <label htmlFor="branch">Branch Of Study:</label>
                      <select
                        name="branch_of_study"
                        className="form-select"
                        aria-label="Default select example"
                        required
                        value={userData.branch_of_study}
                        onChange={postUserData}
                      >
                        <option selected>Select Stream</option>
                        <option value="CSE">CSE</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="Civil">Civil</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Management">Management</option>
                        <option value="Bio_Technology">Bio Technology</option>
                        <option value="Other">Other</option>
                      </select>

                      <label htmlFor="internship">Internship Program:</label>
                      <select
                        className="form-select"
                        name='internship_prog'
                        aria-label="Default select example"
                        required
                        value={userData.internship_prog}
                        onChange={postUserData}
                      >
                        {matchedType === "EXPERT LED WITH ADD ON" || matchedType === "EXPERT LED" ? (
                          <>
                            <option value="">Select Internship</option>
                            {/* Show the list of internship programs for "EXPERT LED" and "EXPERT LED WITH ADD ON" */}
                            {internshipPrograms.map(program => (
                              <option key={program} value={program}>{program}</option>
                            ))}
                          </>
                        ) : (
                          <>
                            <option value="">Select Internship</option>
                            {/* Handle cases where matchedType is not "EXPERT LED" or "EXPERT LED WITH ADD ON" */}
                            {internshipProgramsSelf .map(program => (
                              <option key={program} value={program}>{program}</option>
                            ))}
                          </>
                        )}
                      </select>

                      <label htmlFor="branch">Which month you want to start with the program?</label>
                      <select
                        className="form-select"
                        name="internship_month"
                        aria-label="Default select example"
                        required
                        value={userData.internship_month}
                        onChange={postUserData}
                        disabled={!userData.internship_prog} // Disable if no course is selected
                      >
                        <option value="">Select Month</option>
                        {matchedType === "SELF LED" || matchedType === "SELF LED WITH ADD ON"
                          ? months.map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))
                          : availableMonths.map((month) => (
                            <option key={month} value={month}>{month}</option>
                          ))
                        }
                      </select>
                    </div>

                    {matchedAddOn === "Yes" ? (
                      <div className="col-sm-6 add_on_certificate mt-3">
                        <label htmlFor="certificate" id='remove-margin'>Add On Certificate:</label>
                        <small className='font-monospace mb-2'>Mention only Certificate <b className='text-dark'>Series Number</b> from
                          <Link
                            to="https://drive.google.com/file/d/1FH3o0K1Xt0N51z1eTZ6SQ0o1oh6vniJ6/view"
                            style={{ color: 'dodgerblue' }}
                            target="_blank" rel="noopener noreferrer"> Certification PDF Link
                          </Link></small>
                        <input
                          type='text'
                          placeholder="Series Number"
                          name="add_on"
                          required
                          pattern="[A-Za-z0-9]+"
                          className="form-control"
                          value={userData.add_on}
                          onChange={postUserData}
                        />
                        {errors.add_on && <div className="error">{errors.add_on}</div>}
                      </div>
                    ) : null}
                  </div>
                  <div className="clearfix mt-3">
                    <button type="submit" className="primary-btn2" onClick={submitObData}>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </>
  );
};

export default ObForm;
