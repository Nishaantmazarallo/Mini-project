import React, { useState, useEffect } from 'react';
import './AdminEnrollments.css';

const AdminDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [contactInquiries, setContactInquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('enrollments');

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [enrollmentsRes, inquiriesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/api/contact/inquiries', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!enrollmentsRes.ok || !inquiriesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const enrollmentsData = await enrollmentsRes.json();
      const inquiriesData = await inquiriesRes.json();
      const statsData = await statsRes.json();

      setEnrollments(enrollmentsData);
      setContactInquiries(inquiriesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="error">Error: {error}</div>
          <button onClick={fetchData} className="retry-btn">
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
          <h1>Admin Dashboard</h1>
          <p>Manage enrollments and contact inquiries</p>
          <button onClick={fetchData} className="refresh-btn">
            Refresh
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <span className="stat-number">{stats.totalEnrollments || 0}</span>
          </div>
          <div className="stat-card">
            <h3>Contact Inquiries</h3>
            <span className="stat-number">{stats.totalInquiries || 0}</span>
          </div>
          <div className="stat-card">
            <h3>Recent Enrollments</h3>
            <span className="stat-number">{stats.recentEnrollments || 0}</span>
          </div>
          <div className="stat-card">
            <h3>Recent Inquiries</h3>
            <span className="stat-number">{stats.recentInquiries || 0}</span>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
            onClick={() => setActiveTab('enrollments')}
          >
            Enrollments ({enrollments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            Contact Inquiries ({contactInquiries.length})
          </button>
        </div>

        {activeTab === 'enrollments' && (
          <div className="enrollments-table">
            <h2>Student Enrollments</h2>
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
        )}

        {activeTab === 'inquiries' && (
          <div className="enrollments-table">
            <h2>Contact Inquiries</h2>
            {contactInquiries.length === 0 ? (
              <div className="no-data">No contact inquiries found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Program</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contactInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>{inquiry.id}</td>
                      <td>{inquiry.name}</td>
                      <td>{inquiry.email}</td>
                      <td>{inquiry.phone}</td>
                      <td>{inquiry.program}</td>
                      <td className="message-cell">{inquiry.message}</td>
                      <td>{formatDate(inquiry.created_at)}</td>
                      <td>
                        <span className={`status-badge ${inquiry.status || 'pending'}`}>
                          {inquiry.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

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
            Export Enrollments
          </button>
          <button
            onClick={() => {
              const csv = contactInquiries.map(i =>
                `${i.id},${i.name},${i.email},${i.phone},${i.program},"${i.message}",${i.created_at},${i.status}`
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'contact_inquiries.csv';
              a.click();
            }}
            className="export-btn"
          >
            Export Inquiries
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
