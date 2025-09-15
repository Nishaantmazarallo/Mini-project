import React, { useState, useEffect } from 'react';
import './AdminEnrollments.css';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students');
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      const data = await response.json();
      setEnrollments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">Loading enrollments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="error">Error: {error}</div>
          <button onClick={fetchEnrollments} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <header className="admin-header">
          <h1>Enrollment Management</h1>
          <p>View all submitted enrollment details</p>
          <button onClick={fetchEnrollments} className="refresh-btn">
            Refresh
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <span className="stat-number">{enrollments.length}</span>
          </div>
          <div className="stat-card">
            <h3>Beginner Level</h3>
            <span className="stat-number">
              {enrollments.filter(e => e.level === 'beginner').length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Intermediate Level</h3>
            <span className="stat-number">
              {enrollments.filter(e => e.level === 'intermediate').length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Advanced Level</h3>
            <span className="stat-number">
              {enrollments.filter(e => e.level === 'advanced').length}
            </span>
          </div>
        </div>

        <div className="enrollments-table">
          <h2>All Enrollments</h2>
          {enrollments.length === 0 ? (
            <div className="no-data">No enrollments found</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Level</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.age}</td>
                    <td>{enrollment.email}</td>
                    <td>{enrollment.phone}</td>
                    <td>
                      <span className={`level-badge ${enrollment.level}`}>
                        {enrollment.level}
                      </span>
                    </td>
                    <td>{formatDate(enrollment.enrollment_date)}</td>
                    <td>
                      <span className={`status-badge ${enrollment.status}`}>
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="export-section">
          <h3>Export Data</h3>
          <button 
            onClick={() => {
              const csv = enrollments.map(e => 
                `${e.id},${e.name},${e.age},${e.email},${e.phone},${e.level},${e.enrollment_date},${e.status}`
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'enrollments.csv';
              a.click();
            }}
            className="export-btn"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollments;
