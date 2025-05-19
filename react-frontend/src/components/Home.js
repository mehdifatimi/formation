import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserTie, FaChartLine, FaUsers, FaFileAlt, FaClipboardCheck, FaChartBar, FaUserClock } from 'react-icons/fa';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './Home.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  // Sample data for charts
  const participantsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Number of Participants',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(26, 35, 126, 0.6)',
        borderColor: 'rgba(26, 35, 126, 1)',
        borderWidth: 1,
      },
    ],
  };

  const absenteeismData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Absenteeism Rate (%)',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(255, 87, 34, 0.6)',
        borderColor: 'rgba(255, 87, 34, 1)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const satisfactionData = {
    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: [
          'rgba(76, 175, 80, 0.6)',
          'rgba(33, 150, 243, 0.6)',
          'rgba(255, 152, 0, 0.6)',
          'rgba(244, 67, 54, 0.6)',
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to OFPPT Trainer Formation Management</h1>
          <p>Streamline your training planning, tracking, and evaluation processes</p>
          <div className="hero-buttons">
            <Link to="/dashboard/plan" className="btn btn-primary">
              <FaCalendarAlt /> Plan a Training
            </Link>
            <Link to="/dashboard/trainers" className="btn btn-secondary">
              <FaUserTie /> Track Trainers
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <h2>Training Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h3>Active Trainers</h3>
            <p className="stat-number">150+</p>
          </div>
          <div className="stat-card">
            <FaCalendarAlt className="stat-icon" />
            <h3>Training Sessions</h3>
            <p className="stat-number">75+</p>
          </div>
          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <h3>Success Rate</h3>
            <p className="stat-number">95%</p>
          </div>
        </div>
        
        <div className="charts-container">
          <div className="chart-card">
            <h3>Participant Attendance</h3>
            <Bar data={participantsData} options={{ responsive: true }} />
          </div>
          <div className="chart-card">
            <h3>Absenteeism Rate</h3>
            <Line data={absenteeismData} options={{ responsive: true }} />
          </div>
          <div className="chart-card">
            <h3>Training Satisfaction</h3>
            <Doughnut data={satisfactionData} options={{ responsive: true }} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="about-content">
          <div className="about-image">
            <img src="/training-center.jpg" alt="Training Center" />
          </div>
          <div className="about-text">
            <h2>About Our Platform</h2>
            <p>
              The OFPPT Trainer Formation Management System is designed to streamline
              and enhance the training process for our professional trainers. Our
              platform provides comprehensive tools for:
            </p>
            <ul>
              <li>Planning and scheduling training sessions</li>
              <li>Tracking trainer performance and attendance</li>
              <li>Evaluating training effectiveness</li>
              <li>Managing training resources and materials</li>
            </ul>
            <Link to="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Training Planning</h3>
            <p>Efficiently schedule and manage training sessions with our intuitive planning tools</p>
          </div>
          <div className="feature-card">
            <FaUserClock className="feature-icon" />
            <h3>Absence Tracking</h3>
            <p>Monitor attendance and track absences to ensure training quality</p>
          </div>
          <div className="feature-card">
            <FaFileAlt className="feature-icon" />
            <h3>Document Management</h3>
            <p>Organize and access all training materials and resources in one place</p>
          </div>
          <div className="feature-card">
            <FaClipboardCheck className="feature-icon" />
            <h3>Evaluation & Reporting</h3>
            <p>Generate comprehensive reports and evaluate training effectiveness</p>
          </div>
          <div className="feature-card">
            <FaUserTie className="feature-icon" />
            <h3>Trainer Tracking</h3>
            <p>Monitor trainer performance and professional development</p>
          </div>
          <div className="feature-card">
            <FaChartBar className="feature-icon" />
            <h3>Performance Analytics</h3>
            <p>Track and analyze training outcomes with detailed analytics</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 