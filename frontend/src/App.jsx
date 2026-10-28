import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";
const emptyForm = {
  jobId: "",
  title: "",
  company: "",
  location: "",
  salary: "",
  jobType: "Full-time",
  description: ""
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) =>
      [job.title, job.company, job.location]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [jobs, search]);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function loadJobs() {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setJobs(response.data);
    } catch (error) {
      showNotice("danger", error.response?.data?.message || "Cannot connect to the backend. Check that the server is running and MongoDB is connected.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice({ type: "", text: "" });

    const payload = { ...form, salary: Number(form.salary) };
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        showNotice("success", "Job details updated successfully.");
      } else {
        await axios.post(API_URL, payload);
        showNotice("success", "New job added successfully.");
      }
      resetForm();
      await loadJobs();
    } catch (error) {
      showNotice("danger", error.response?.data?.message || "Unable to save job. Check your details and backend connection.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(job) {
    setEditingId(job._id);
    setForm({
      jobId: job.jobId,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: String(job.salary),
      jobType: job.jobType,
      description: job.description
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteJob(job) {
    const confirmed = window.confirm(`Delete "${job.title}" at ${job.company}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${job._id}`);
      showNotice("success", "Job posting deleted successfully.");
      if (editingId === job._id) resetForm();
      await loadJobs();
    } catch (error) {
      showNotice("danger", error.response?.data?.message || "Unable to delete job.");
    }
  }

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <span className="brand-mark">J</span> JobFinder
          </a>
          <span className="navbar-text text-white-50">Job Portal System</span>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">CAREERS START HERE</span>
            <h1>Find opportunities.<br /><span>Build your future.</span></h1>
            <p>Manage job postings in one simple, organised place.</p>
            <a className="btn btn-light btn-lg hero-button" href="#manage-jobs">Manage jobs <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle"></div>
            <div className="art-card art-card-one"><span className="art-icon">✦</span><div><b>New opportunity</b><small>Make your next move</small></div></div>
            <div className="art-card art-card-two"><span className="art-check">✓</span><div><b>Career growth</b><small>One step at a time</small></div></div>
            <div className="art-window"><span></span><span></span><span></span><div className="window-line long"></div><div className="window-line"></div><div className="window-button"></div></div>
          </div>
        </div>
      </header>

      <main className="container main-content" id="manage-jobs">
        {notice.text && (
          <div className={`alert alert-${notice.type} alert-dismissible`} role="alert">
            {notice.text}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotice({ type: "", text: "" })}></button>
          </div>
        )}

        <section className="stats-grid mb-4">
          <div className="stat-card"><div className="stat-icon purple">▤</div><div><span>Total postings</span><strong>{jobs.length}</strong></div></div>
          <div className="stat-card"><div className="stat-icon green">⌖</div><div><span>Job locations</span><strong>{new Set(jobs.map((job) => job.location.toLowerCase())).size}</strong></div></div>
          <div className="stat-card"><div className="stat-icon orange">◷</div><div><span>Job categories</span><strong>{new Set(jobs.map((job) => job.jobType)).size}</strong></div></div>
        </section>

        <section className="panel form-panel mb-4">
          <div className="section-heading">
            <div><span className="section-kicker">{editingId ? "EDIT POSTING" : "CREATE A POSTING"}</span><h2>{editingId ? "Update job details" : "Add a new job"}</h2><p>Fill in the details below to manage a job posting.</p></div>
            {editingId && <button className="btn btn-outline-secondary" onClick={resetForm} type="button">Cancel edit</button>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label" htmlFor="jobId">Job ID *</label>
                <input className="form-control" id="jobId" name="jobId" value={form.jobId} onChange={handleChange} placeholder="e.g. JOB001" required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="title">Job title *</label>
                <input className="form-control" id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Web Developer" required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="company">Company name *</label>
                <input className="form-control" id="company" name="company" value={form.company} onChange={handleChange} placeholder="e.g. ABC Technologies" required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="location">Job location *</label>
                <input className="form-control" id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Coimbatore" required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="salary">Salary (₹ per month) *</label>
                <input className="form-control" id="salary" name="salary" type="number" min="0" value={form.salary} onChange={handleChange} placeholder="e.g. 30000" required />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="jobType">Job type *</label>
                <select className="form-select" id="jobType" name="jobType" value={form.jobType} onChange={handleChange} required>
                  <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="description">Job description *</label>
                <textarea className="form-control" id="description" name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Describe the role and responsibilities..." required></textarea>
              </div>
              <div className="col-12 d-flex flex-wrap gap-2">
                <button className="btn btn-primary px-4" type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "+ Add job posting"}</button>
                <button className="btn btn-outline-secondary px-4" type="button" onClick={resetForm}>Clear form</button>
              </div>
            </div>
          </form>
        </section>

        <section className="panel jobs-panel">
          <div className="section-heading jobs-heading">
            <div><span className="section-kicker">OPPORTUNITIES</span><h2>All job postings <span className="count-pill">{filteredJobs.length}</span></h2><p>Search, edit or remove existing job details.</p></div>
            <div className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, company, location..." aria-label="Search jobs" /></div>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p>Loading job postings...</p></div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">▤</div><h3>{search ? "No matching jobs found" : "No job postings yet"}</h3><p>{search ? "Try a different title, company or location." : "Add your first job using the form above."}</p></div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle job-table">
                <thead><tr><th>JOB DETAILS</th><th>LOCATION</th><th>SALARY / MONTH</th><th>JOB TYPE</th><th className="text-end">ACTIONS</th></tr></thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id}>
                      <td><div className="job-title">{job.title}</div><div className="job-company">{job.company} <span>· {job.jobId}</span></div><div className="job-description">{job.description}</div></td>
                      <td><span className="location-label">⌖ {job.location}</span></td>
                      <td className="salary-label">{money(job.salary)}</td>
                      <td><span className={`type-badge type-${job.jobType.toLowerCase().replace("-", "")}`}>{job.jobType}</span></td>
                      <td><div className="d-flex justify-content-end gap-2"><button className="btn btn-sm btn-edit" onClick={() => startEdit(job)} aria-label={`Edit ${job.title}`}>Edit</button><button className="btn btn-sm btn-delete" onClick={() => deleteJob(job)} aria-label={`Delete ${job.title}`}>Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <footer className="footer-note">JobFinder · IA3 Full Stack Web Application <span>React · Express · MongoDB</span></footer>
      </main>
    </>
  );
}

export default App;
