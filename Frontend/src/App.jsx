import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const API = "http://localhost:5000/api";


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [activePage, setActivePage] = useState("Dashboard");


  const handleLogin = (data) => {

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
  };


  if (!token) {
    return <Login onLogin={handleLogin} />;
  }


  return (

    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            R
          </div>

          <div>
            <h2>RecruitFlow</h2>
            <span>Recruitment System</span>
          </div>

        </div>


        <div className="menu-title">
          MAIN MENU
        </div>


        <MenuButton
          active={activePage === "Dashboard"}
          onClick={() => setActivePage("Dashboard")}
          icon="⌂"
          text="Dashboard"
        />


        <MenuButton
          active={activePage === "Jobs"}
          onClick={() => setActivePage("Jobs")}
          icon="▣"
          text="Jobs"
        />


        <MenuButton
          active={activePage === "Candidates"}
          onClick={() => setActivePage("Candidates")}
          icon="♙"
          text="Candidates"
        />


        <MenuButton
          active={activePage === "Applications"}
          onClick={() => setActivePage("Applications")}
          icon="▤"
          text="Applications"
        />


        <MenuButton
          active={activePage === "Interviews"}
          onClick={() => setActivePage("Interviews")}
          icon="◷"
          text="Interviews"
        />


        <MenuButton
          active={activePage === "Offers"}
          onClick={() => setActivePage("Offers")}
          icon="✓"
          text="Offers"
        />


        <div className="sidebar-bottom">

          <div className="user-mini">

            <div className="avatar">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>

          </div>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <h1>{activePage}</h1>
            <p>Recruitment Management System</p>
          </div>


          <div className="top-user">

            <div className="notification">
              🔔
            </div>

            <div className="top-avatar">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>

          </div>

        </header>


        {activePage === "Dashboard" && (
          <Dashboard
            token={token}
            setActivePage={setActivePage}
          />
        )}


        {activePage === "Jobs" && (
          <JobsPage token={token} />
        )}


        {activePage === "Candidates" && (
          <CandidatesPage token={token} />
        )}


        {activePage === "Applications" && (
          <ApplicationsPage token={token} />
        )}


        {activePage === "Interviews" && (
          <InterviewsPage token={token} />
        )}


        {activePage === "Offers" && (
          <OffersPage token={token} />
        )}

      </main>

    </div>
  );
}


/* =========================================================
   MENU
========================================================= */

function MenuButton({
  active,
  onClick,
  icon,
  text
}) {

  return (

    <button
      className={
        active
          ? "menu-item active"
          : "menu-item"
      }
      onClick={onClick}
    >

      <span>{icon}</span>

      {text}

    </button>
  );
}


/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {

  const [email, setEmail] =
    useState("hr@demo.com");

  const [password, setPassword] =
    useState("password");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const login = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API}/auth/login`,
        {
          email,
          password
        }
      );

      onLogin(res.data);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">

          <div className="logo-icon">
            R
          </div>

          <h1>RecruitFlow</h1>

        </div>


        <h2>
          Manage your complete
          <span> recruitment process.</span>
        </h2>


        <p>
          From job creation to candidate selection,
          manage everything from one simple platform.
        </p>


        <div className="login-features">

          <div>✓ Job Management</div>
          <div>✓ Candidate Tracking</div>
          <div>✓ Interview Management</div>
          <div>✓ Offer Management</div>

        </div>

      </div>


      <div className="login-card">

        <div className="login-icon">
          R
        </div>

        <h2>Welcome Back</h2>

        <p>
          Sign in to your recruitment dashboard
        </p>


        <form onSubmit={login}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          {error && (
            <div className="error-box">
              {error}
            </div>
          )}


          <button
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>


        <div className="demo-login">

          <strong>Demo Login</strong>

          <span>
            HR: hr@demo.com
          </span>

          <span>
            Password: password
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  token,
  setActivePage
}) {

  const [stats, setStats] = useState({
    jobs: 0,
    candidates: 0,
    applications: 0,
    interviews: 0,
    offers: 0
  });


  const loadDashboard = async () => {

    try {

      const res = await axios.get(
        `${API}/dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setStats(res.data.data);

    } catch (error) {

      console.error(error);

    }
  };


  useEffect(() => {

    loadDashboard();

  }, []);


  return (

    <div>

      <div className="welcome-card">

        <div>

          <span className="welcome-label">
            RECRUITMENT OVERVIEW
          </span>

          <h2>
            Welcome to RecruitFlow 👋
          </h2>

          <p>
            Manage jobs, candidates, interviews
            and offers from one place.
          </p>

        </div>


        <div className="welcome-icon">
          👥
        </div>

      </div>


      <div className="stats-grid">

        <StatCard
          title="Jobs"
          value={stats.jobs}
          icon="▣"
          color="blue"
        />

        <StatCard
          title="Candidates"
          value={stats.candidates}
          icon="♙"
          color="purple"
        />

        <StatCard
          title="Applications"
          value={stats.applications}
          icon="▤"
          color="orange"
        />

        <StatCard
          title="Interviews"
          value={stats.interviews}
          icon="◷"
          color="green"
        />

        <StatCard
          title="Offers"
          value={stats.offers}
          icon="✓"
          color="pink"
        />

      </div>


      <div className="section-title">

        <div>

          <h2>Quick Actions</h2>

          <p>
            Start a recruitment activity
          </p>

        </div>

      </div>


      <div className="quick-actions">

        <QuickAction
          icon="+"
          title="Create Job"
          description="Open a new position"
          color="blue"
          onClick={() =>
            setActivePage("Jobs")
          }
        />

        <QuickAction
          icon="♙"
          title="Add Candidate"
          description="Register candidate"
          color="purple"
          onClick={() =>
            setActivePage("Candidates")
          }
        />

        <QuickAction
          icon="▤"
          title="Create Application"
          description="Apply candidate to job"
          color="orange"
          onClick={() =>
            setActivePage("Applications")
          }
        />

        <QuickAction
          icon="◷"
          title="Schedule Interview"
          description="Schedule candidate"
          color="green"
          onClick={() =>
            setActivePage("Interviews")
          }
        />

        <QuickAction
          icon="✓"
          title="Create Offer"
          description="Generate candidate offer"
          color="orange"
          onClick={() =>
            setActivePage("Offers")
          }
        />

      </div>


      <div className="section-title">

        <div>

          <h2>Recruitment Pipeline</h2>

          <p>
            Current recruitment stages
          </p>

        </div>

      </div>


      <div className="pipeline">

        <PipelineItem
          title="Applications"
          value={stats.applications}
          icon="▤"
        />

        <div className="pipeline-arrow">
          →
        </div>

        <PipelineItem
          title="Interviews"
          value={stats.interviews}
          icon="◷"
        />

        <div className="pipeline-arrow">
          →
        </div>

        <PipelineItem
          title="Offers"
          value={stats.offers}
          icon="✓"
        />

      </div>

    </div>
  );
}


/* =========================================================
   JOBS
========================================================= */

function JobsPage({ token }) {

  const [jobs, setJobs] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "Engineering",
    location: "Pune",
    employmentType: "FULL_TIME"
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadJobs = async () => {

    try {

      const res = await axios.get(
        `${API}/jobs`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setJobs(res.data.jobs || []);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load jobs"
      );

    }
  };


  useEffect(() => {

    loadJobs();

  }, []);


  const createJob = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/jobs`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);

      setError("");

      setForm({
        title: "",
        description: "",
        department: "Engineering",
        location: "Pune",
        employmentType: "FULL_TIME"
      });

      setShowForm(false);

      loadJobs();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create job"
      );

    }
  };


  return (

    <div>

      <PageHeader
        title="Jobs"
        description="Create and manage job openings"
        button="+ Create Job"
        onClick={() =>
          setShowForm(!showForm)
        }
      />


      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {showForm && (

        <FormCard
          title="Create New Job"
          subtitle="Add a new position"
        >

          <form onSubmit={createJob}>

            <div className="form-row">

              <Input
                label="Job Title"
                value={form.title}
                onChange={(v) =>
                  setForm({
                    ...form,
                    title: v
                  })
                }
                placeholder="Software Engineer"
              />

              <Input
                label="Department"
                value={form.department}
                onChange={(v) =>
                  setForm({
                    ...form,
                    department: v
                  })
                }
              />

            </div>


            <div className="form-row">

              <Input
                label="Location"
                value={form.location}
                onChange={(v) =>
                  setForm({
                    ...form,
                    location: v
                  })
                }
              />


              <div>

                <label>
                  Employment Type
                </label>

                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      employmentType:
                        e.target.value
                    })
                  }
                >

                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="PART_TIME">
                    Part Time
                  </option>

                  <option value="CONTRACT">
                    Contract
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                </select>

              </div>

            </div>


            <Input
              label="Description"
              value={form.description}
              onChange={(v) =>
                setForm({
                  ...form,
                  description: v
                })
              }
              placeholder="Enter job description"
            />


            <button className="form-btn">
              Create Job
            </button>

          </form>

        </FormCard>

      )}


      <div className="record-grid">

        {jobs.map((job) => (

          <div
            className="record-card"
            key={job.id}
          >

            <div className="record-top">

              <span className="record-code">
                {job.jobCode}
              </span>

              <span className="status-badge">
                {job.status}
              </span>

            </div>


            <h3>
              {job.title}
            </h3>

            <p className="record-description">
              {job.description}
            </p>


            <div className="record-info">

              <Info
                label="Department"
                value={job.department}
              />

              <Info
                label="Location"
                value={job.location}
              />

              <Info
                label="Employment"
                value={job.employmentType}
              />

              <Info
                label="Applications"
                value={
                  job._count?.applications || 0
                }
              />

              <Info
                label="Created By"
                value={
                  job.createdBy?.name
                }
              />

            </div>

          </div>

        ))}

      </div>


      {jobs.length === 0 && (
        <EmptyState
          text="No jobs created yet."
        />
      )}

    </div>
  );
}


/* =========================================================
   CANDIDATES
========================================================= */

function CandidatesPage({ token }) {

  const [candidates, setCandidates] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experienceYears: 0,
    location: ""
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadCandidates = async () => {

    try {

      const res = await axios.get(
        `${API}/candidates`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setCandidates(
        res.data.candidates || []
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load candidates"
      );

    }
  };


  useEffect(() => {

    loadCandidates();

  }, []);


  const createCandidate = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/candidates`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);

      setError("");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        qualification: "",
        experienceYears: 0,
        location: ""
      });

      setShowForm(false);

      loadCandidates();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create candidate"
      );

    }
  };


  return (

    <div>

      <PageHeader
        title="Candidates"
        description="Manage registered candidates"
        button="+ Add Candidate"
        onClick={() =>
          setShowForm(!showForm)
        }
      />


      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {showForm && (

        <FormCard
          title="Add Candidate"
          subtitle="Register a candidate"
        >

          <form onSubmit={createCandidate}>

            <div className="form-row">

              <Input
                label="Full Name"
                value={form.fullName}
                onChange={(v) =>
                  setForm({
                    ...form,
                    fullName: v
                  })
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(v) =>
                  setForm({
                    ...form,
                    email: v
                  })
                }
              />

            </div>


            <div className="form-row">

              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) =>
                  setForm({
                    ...form,
                    phone: v
                  })
                }
              />

              <Input
                label="Qualification"
                value={form.qualification}
                onChange={(v) =>
                  setForm({
                    ...form,
                    qualification: v
                  })
                }
              />

            </div>


            <div className="form-row">

              <Input
                label="Experience"
                type="number"
                value={form.experienceYears}
                onChange={(v) =>
                  setForm({
                    ...form,
                    experienceYears: v
                  })
                }
              />

              <Input
                label="Location"
                value={form.location}
                onChange={(v) =>
                  setForm({
                    ...form,
                    location: v
                  })
                }
              />

            </div>


            <button className="form-btn">
              Add Candidate
            </button>

          </form>

        </FormCard>

      )}


      <div className="record-grid">

        {candidates.map((candidate) => (

          <div
            className="record-card"
            key={candidate.id}
          >

            <div className="candidate-heading">

              <div className="candidate-avatar">
                {candidate.fullName?.charAt(0)}
              </div>

              <div>

                <h3>
                  {candidate.fullName}
                </h3>

                <span className="record-code">
                  {candidate.candidateCode}
                </span>

              </div>

            </div>


            <div className="record-info">

              <Info
                label="Email"
                value={candidate.email}
              />

              <Info
                label="Phone"
                value={candidate.phone}
              />

              <Info
                label="Qualification"
                value={candidate.qualification}
              />

              <Info
                label="Experience"
                value={
                  `${candidate.experienceYears} years`
                }
              />

              <Info
                label="Location"
                value={candidate.location}
              />

            </div>

          </div>

        ))}

      </div>


      {candidates.length === 0 && (
        <EmptyState
          text="No candidates added yet."
        />
      )}

    </div>
  );
}


/* =========================================================
   APPLICATIONS
========================================================= */

function ApplicationsPage({ token }) {

  const [applications, setApplications] =
    useState([]);

  const [candidates, setCandidates] =
    useState([]);

  const [jobs, setJobs] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    candidateId: "",
    jobId: ""
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadData = async () => {

    try {

      const headers = {
        Authorization:
          `Bearer ${token}`
      };


      const [
        applicationsRes,
        candidatesRes,
        jobsRes
      ] = await Promise.all([

        axios.get(
          `${API}/applications`,
          { headers }
        ),

        axios.get(
          `${API}/candidates`,
          { headers }
        ),

        axios.get(
          `${API}/jobs`,
          { headers }
        )

      ]);


      setApplications(
        applicationsRes.data.applications || []
      );

      setCandidates(
        candidatesRes.data.candidates || []
      );

      setJobs(
        jobsRes.data.jobs || []
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load applications"
      );

    }
  };


  useEffect(() => {

    loadData();

  }, []);


  const createApplication = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/applications`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(
        res.data.message
      );

      setError("");

      setForm({
        candidateId: "",
        jobId: ""
      });

      setShowForm(false);

      loadData();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create application"
      );

    }
  };


  return (

    <div>

      <PageHeader
        title="Applications"
        description="Track complete candidate applications"
        button="+ Create Application"
        onClick={() =>
          setShowForm(!showForm)
        }
      />


      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {showForm && (

        <FormCard
          title="Create Application"
          subtitle="Apply a candidate to a job"
        >

          <form onSubmit={createApplication}>

            <label>
              Candidate
            </label>

            <select
              value={form.candidateId}
              onChange={(e) =>
                setForm({
                  ...form,
                  candidateId:
                    e.target.value
                })
              }
              required
            >

              <option value="">
                Select Candidate
              </option>

              {candidates.map((candidate) => (

                <option
                  key={candidate.id}
                  value={candidate.id}
                >
                  {candidate.fullName}
                  {" - "}
                  {candidate.candidateCode}
                </option>

              ))}

            </select>


            <label>
              Job
            </label>

            <select
              value={form.jobId}
              onChange={(e) =>
                setForm({
                  ...form,
                  jobId:
                    e.target.value
                })
              }
              required
            >

              <option value="">
                Select Job
              </option>

              {jobs.map((job) => (

                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title}
                  {" - "}
                  {job.jobCode}
                </option>

              ))}

            </select>


            <button className="form-btn">
              Create Application
            </button>

          </form>

        </FormCard>

      )}


      {applications.map((application) => (

        <ApplicationCard
          key={application.id}
          application={application}
        />

      ))}


      {applications.length === 0 && (
        <EmptyState
          text="No applications created yet."
        />
      )}

    </div>
  );
}


/* =========================================================
   APPLICATION CARD
========================================================= */

function ApplicationCard({
  application
}) {

  const interview =
    application.interviews?.[0];

  const feedback =
    interview?.feedback;

  const offer =
    application.offer;


  return (

    <div className="application-card">

      <div className="application-header">

        <div>

          <span className="application-code">
            {application.applicationCode}
          </span>

          <h2>
            {application.candidate.fullName}
          </h2>

          <p>
            Applied for {application.job.title}
          </p>

        </div>


        <span className="status-badge">
          {application.status}
        </span>

      </div>


      <div className="application-sections">

        <div className="info-section">

          <h4>
            👤 Candidate Information
          </h4>

          <Info
            label="Name"
            value={
              application.candidate.fullName
            }
          />

          <Info
            label="Email"
            value={
              application.candidate.email
            }
          />

          <Info
            label="Phone"
            value={
              application.candidate.phone
            }
          />

          <Info
            label="Qualification"
            value={
              application.candidate.qualification
            }
          />

          <Info
            label="Experience"
            value={
              `${application.candidate.experienceYears} years`
            }
          />

          <Info
            label="Location"
            value={
              application.candidate.location
            }
          />

        </div>


        <div className="info-section">

          <h4>
            💼 Job Information
          </h4>

          <Info
            label="Job Code"
            value={
              application.job.jobCode
            }
          />

          <Info
            label="Position"
            value={
              application.job.title
            }
          />

          <Info
            label="Department"
            value={
              application.job.department
            }
          />

          <Info
            label="Location"
            value={
              application.job.location
            }
          />

          <Info
            label="Employment"
            value={
              application.job.employmentType
            }
          />

          <Info
            label="Openings"
            value={
              application.job.openings
            }
          />

        </div>


        <div className="info-section">

          <h4>
            📅 Interview
          </h4>

          {interview ? (

            <>

              <Info
                label="Round"
                value={
                  interview.interviewRound
                }
              />

              <Info
                label="Type"
                value={
                  interview.interviewType
                }
              />

              <Info
                label="Date"
                value={
                  new Date(
                    interview.scheduledDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Time"
                value={
                  interview.scheduledTime
                }
              />

              <Info
                label="Interviewer"
                value={
                  interview.interviewer?.name
                }
              />

              <Info
                label="Status"
                value={
                  interview.status
                }
              />

            </>

          ) : (

            <p className="muted">
              Interview not scheduled
            </p>

          )}

        </div>


        <div className="info-section">

          <h4>
            ⭐ Interview Feedback
          </h4>

          {feedback ? (

            <>

              <Info
                label="Technical"
                value={
                  `${feedback.technicalRating}/5`
                }
              />

              <Info
                label="Communication"
                value={
                  `${feedback.communicationRating}/5`
                }
              />

              <Info
                label="Problem Solving"
                value={
                  `${feedback.problemSolvingRating}/5`
                }
              />

              <Info
                label="Overall"
                value={
                  `${feedback.overallRating}/5`
                }
              />

              <Info
                label="Recommendation"
                value={
                  feedback.recommendation
                }
              />

              <Info
                label="Comments"
                value={
                  feedback.comments || "-"
                }
              />

            </>

          ) : (

            <p className="muted">
              Feedback not submitted
            </p>

          )}

        </div>


        <div className="info-section offer-section">

          <h4>
            🎉 Offer Information
          </h4>

          {offer ? (

            <div className="offer-grid">

              <Info
                label="Salary"
                value={
                  `₹${Number(
                    offer.salary
                  ).toLocaleString("en-IN")}`
                }
              />

              <Info
                label="Joining Date"
                value={
                  new Date(
                    offer.joiningDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Offer Status"
                value={
                  offer.status
                }
              />

              <Info
                label="Offer Date"
                value={
                  new Date(
                    offer.offerDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Notes"
                value={
                  offer.notes || "-"
                }
              />

            </div>

          ) : (

            <p className="muted">
              Offer not created
            </p>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INTERVIEWS
========================================================= */

function InterviewsPage({ token }) {

  const [interviews, setInterviews] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    applicationId: "",
    interviewerId: "2",
    interviewRound: "TECHNICAL",
    interviewType: "ONLINE",
    scheduledDate: "",
    scheduledTime: "",
    meetingLink: ""
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadData = async () => {

    try {

      const headers = {
        Authorization:
          `Bearer ${token}`
      };


      const [
        interviewsRes,
        applicationsRes
      ] = await Promise.all([

        axios.get(
          `${API}/interviews`,
          { headers }
        ),

        axios.get(
          `${API}/applications`,
          { headers }
        )

      ]);


      setInterviews(
        interviewsRes.data.interviews || []
      );

      setApplications(
        applicationsRes.data.applications || []
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load interviews"
      );

    }
  };


  useEffect(() => {

    loadData();

  }, []);


  const scheduleInterview = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/interviews`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);

      setError("");

      setShowForm(false);

      setForm({
        applicationId: "",
        interviewerId: "2",
        interviewRound: "TECHNICAL",
        interviewType: "ONLINE",
        scheduledDate: "",
        scheduledTime: "",
        meetingLink: ""
      });

      loadData();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to schedule interview"
      );

    }
  };


  return (

    <div>

      <PageHeader
        title="Interviews"
        description="Schedule and track candidate interviews"
        button="+ Schedule Interview"
        onClick={() =>
          setShowForm(!showForm)
        }
      />


      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {showForm && (

        <FormCard
          title="Schedule Interview"
          subtitle="Schedule an interview"
        >

          <form onSubmit={scheduleInterview}>

            <label>
              Application
            </label>

            <select
              value={form.applicationId}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicationId:
                    e.target.value
                })
              }
              required
            >

              <option value="">
                Select Application
              </option>

              {applications.map((app) => (

                <option
                  key={app.id}
                  value={app.id}
                >
                  {app.applicationCode}
                  {" - "}
                  {app.candidate.fullName}
                  {" - "}
                  {app.job.title}
                </option>

              ))}

            </select>


            <div className="form-row">

              <div>

                <label>
                  Interview Round
                </label>

                <select
                  value={
                    form.interviewRound
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      interviewRound:
                        e.target.value
                    })
                  }
                >

                  <option value="SCREENING">
                    Screening
                  </option>

                  <option value="TECHNICAL">
                    Technical
                  </option>

                  <option value="HR">
                    HR
                  </option>

                </select>

              </div>


              <div>

                <label>
                  Interview Type
                </label>

                <select
                  value={
                    form.interviewType
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      interviewType:
                        e.target.value
                    })
                  }
                >

                  <option value="ONLINE">
                    Online
                  </option>

                  <option value="OFFLINE">
                    Offline
                  </option>

                </select>

              </div>

            </div>


            <div className="form-row">

              <Input
                label="Date"
                type="date"
                value={
                  form.scheduledDate
                }
                onChange={(v) =>
                  setForm({
                    ...form,
                    scheduledDate: v
                  })
                }
              />


              <Input
                label="Time"
                type="time"
                value={
                  form.scheduledTime
                }
                onChange={(v) =>
                  setForm({
                    ...form,
                    scheduledTime: v
                  })
                }
              />

            </div>


            <Input
              label="Meeting Link"
              value={
                form.meetingLink
              }
              onChange={(v) =>
                setForm({
                  ...form,
                  meetingLink: v
                })
              }
              placeholder="https://meet.google.com/..."
            />


            <button className="form-btn">
              Schedule Interview
            </button>

          </form>

        </FormCard>

      )}


      <div className="record-grid">

        {interviews.map((interview) => (

          <div
            className="record-card"
            key={interview.id}
          >

            <div className="record-top">

              <span className="record-code">
                Interview #{interview.id}
              </span>

              <span className="status-badge">
                {interview.status}
              </span>

            </div>


            <h3>
              {
                interview.application
                  ?.candidate?.fullName
              }
            </h3>

            <p className="record-description">

              {
                interview.application
                  ?.job?.title
              }

            </p>


            <div className="record-info">

              <Info
                label="Application"
                value={
                  interview.application
                    ?.applicationCode
                }
              />

              <Info
                label="Round"
                value={
                  interview.interviewRound
                }
              />

              <Info
                label="Type"
                value={
                  interview.interviewType
                }
              />

              <Info
                label="Date"
                value={
                  new Date(
                    interview.scheduledDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Time"
                value={
                  interview.scheduledTime
                }
              />

              <Info
                label="Interviewer"
                value={
                  interview.interviewer?.name
                }
              />

              <Info
                label="Recommendation"
                value={
                  interview.feedback
                    ?.recommendation ||
                  "Pending"
                }
              />

            </div>

          </div>

        ))}

      </div>


      {interviews.length === 0 && (
        <EmptyState
          text="No interviews scheduled yet."
        />
      )}

    </div>
  );
}


/* =========================================================
   OFFERS
========================================================= */

function OffersPage({ token }) {

  const [offers, setOffers] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    applicationId: "",
    salary: "",
    joiningDate: "",
    notes: ""
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const loadData = async () => {

    try {

      const headers = {
        Authorization:
          `Bearer ${token}`
      };


      const [
        offersRes,
        applicationsRes
      ] = await Promise.all([

        axios.get(
          `${API}/offers`,
          { headers }
        ),

        axios.get(
          `${API}/applications`,
          { headers }
        )

      ]);


      setOffers(
        offersRes.data.offers || []
      );

      setApplications(
        applicationsRes.data.applications || []
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load offers"
      );

    }
  };


  useEffect(() => {

    loadData();

  }, []);


  const createOffer = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/offers`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);

      setError("");

      setShowForm(false);

      setForm({
        applicationId: "",
        salary: "",
        joiningDate: "",
        notes: ""
      });

      loadData();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create offer"
      );

    }
  };


  return (

    <div>

      <PageHeader
        title="Offers"
        description="Manage candidate offers"
        button="+ Create Offer"
        onClick={() =>
          setShowForm(!showForm)
        }
      />


      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {showForm && (

        <FormCard
          title="Create Offer"
          subtitle="Generate an offer"
        >

          <form onSubmit={createOffer}>

            <label>
              Application
            </label>

            <select
              value={
                form.applicationId
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  applicationId:
                    e.target.value
                })
              }
              required
            >

              <option value="">
                Select Application
              </option>

              {applications.map((app) => (

                <option
                  key={app.id}
                  value={app.id}
                >
                  {app.applicationCode}
                  {" - "}
                  {app.candidate.fullName}
                  {" - "}
                  {app.job.title}
                </option>

              ))}

            </select>


            <div className="form-row">

              <Input
                label="Salary"
                type="number"
                value={form.salary}
                onChange={(v) =>
                  setForm({
                    ...form,
                    salary: v
                  })
                }
                placeholder="350000"
              />


              <Input
                label="Joining Date"
                type="date"
                value={
                  form.joiningDate
                }
                onChange={(v) =>
                  setForm({
                    ...form,
                    joiningDate: v
                  })
                }
              />

            </div>


            <Input
              label="Notes"
              value={form.notes}
              onChange={(v) =>
                setForm({
                  ...form,
                  notes: v
                })
              }
              placeholder="Offer notes"
            />


            <button className="form-btn">
              Create Offer
            </button>

          </form>

        </FormCard>

      )}


      <div className="record-grid">

        {offers.map((offer) => (

          <div
            className="record-card"
            key={offer.id}
          >

            <div className="record-top">

              <span className="record-code">
                OFFER #{offer.id}
              </span>

              <span className="status-badge">
                {offer.status}
              </span>

            </div>


            <h3>
              {
                offer.application
                  ?.candidate?.fullName
              }
            </h3>


            <p className="record-description">

              {
                offer.application
                  ?.job?.title
              }

            </p>


            <div className="record-info">

              <Info
                label="Application"
                value={
                  offer.application
                    ?.applicationCode
                }
              />

              <Info
                label="Position"
                value={
                  offer.application
                    ?.job?.title
                }
              />

              <Info
                label="Salary"
                value={
                  `₹${Number(
                    offer.salary
                  ).toLocaleString("en-IN")}`
                }
              />

              <Info
                label="Joining Date"
                value={
                  new Date(
                    offer.joiningDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Offer Date"
                value={
                  new Date(
                    offer.offerDate
                  ).toLocaleDateString()
                }
              />

              <Info
                label="Notes"
                value={
                  offer.notes || "-"
                }
              />

            </div>

          </div>

        ))}

      </div>


      {offers.length === 0 && (
        <EmptyState
          text="No offers created yet."
        />
      )}

    </div>
  );
}


/* =========================================================
   COMMON COMPONENTS
========================================================= */

function PageHeader({
  title,
  description,
  button,
  onClick
}) {

  return (

    <div className="page-heading">

      <div>

        <h2>{title}</h2>

        <p>
          {description}
        </p>

      </div>


      <button
        className="form-btn"
        onClick={onClick}
      >
        {button}
      </button>

    </div>
  );
}


function FormCard({
  title,
  subtitle,
  children
}) {

  return (

    <div
      className="form-card"
      style={{
        marginBottom: "25px"
      }}
    >

      <div className="form-card-header">

        <div>

          <h2>{title}</h2>

          <p>{subtitle}</p>

        </div>

        <div className="form-card-icon">
          +
        </div>

      </div>

      {children}

    </div>
  );
}


function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}) {

  return (

    <div>

      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}


function Info({
  label,
  value
}) {

  return (

    <div className="info-row">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
}


function StatCard({
  title,
  value,
  icon,
  color
}) {

  return (

    <div className="stat-card">

      <div
        className={`stat-icon ${color}`}
      >
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <h2>
          {value}
        </h2>

      </div>

    </div>
  );
}


function QuickAction({
  icon,
  title,
  description,
  color,
  onClick
}) {

  return (

    <button
      className="quick-card"
      onClick={onClick}
    >

      <div
        className={`quick-icon ${color}`}
      >
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>

    </button>
  );
}


function PipelineItem({
  title,
  value,
  icon
}) {

  return (

    <div className="pipeline-item">

      <div className="pipeline-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


function EmptyState({
  text
}) {

  return (

    <div
      className="form-card text-center"
      style={{
        maxWidth: "100%",
        marginTop: "20px"
      }}
    >

      <div className="empty-icon">
        ▤
      </div>

      <h3>
        {text}
      </h3>

      <p
        style={{
          color: "#8994a6",
          marginTop: "8px",
          fontSize: "13px"
        }}
      >
        Create a record using the button above.
      </p>

    </div>
  );
}


export default App;