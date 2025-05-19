import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { FaUsers, FaUserClock, FaClipboardCheck, FaChartLine } from 'react-icons/fa';
import './Statistics.css';

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('participants');
  const [timeRange, setTimeRange] = useState('month');

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

  const evaluationData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        data: [30, 40, 20, 10],
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

  const renderChart = () => {
    switch (activeTab) {
      case 'participants':
        return <Bar data={participantsData} options={{ responsive: true }} />;
      case 'absenteeism':
        return <Line data={absenteeismData} options={{ responsive: true }} />;
      case 'satisfaction':
        return <Doughnut data={satisfactionData} options={{ responsive: true }} />;
      case 'evaluation':
        return <Pie data={evaluationData} options={{ responsive: true }} />;
      default:
        return <Bar data={participantsData} options={{ responsive: true }} />;
    }
  };

  return (
    <div className="statistics-dashboard">
      <div className="statistics-header">
        <h2>Training Statistics</h2>
        <div className="time-range-selector">
          <button 
            className={timeRange === 'week' ? 'active' : ''} 
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''} 
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="statistics-tabs">
        <button 
          className={`tab-button ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          <FaUsers className="tab-icon" />
          Participants
        </button>
        <button 
          className={`tab-button ${activeTab === 'absenteeism' ? 'active' : ''}`}
          onClick={() => setActiveTab('absenteeism')}
        >
          <FaUserClock className="tab-icon" />
          Absenteeism
        </button>
        <button 
          className={`tab-button ${activeTab === 'satisfaction' ? 'active' : ''}`}
          onClick={() => setActiveTab('satisfaction')}
        >
          <FaClipboardCheck className="tab-icon" />
          Satisfaction
        </button>
        <button 
          className={`tab-button ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          <FaChartLine className="tab-icon" />
          Evaluation
        </button>
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>

      <div className="statistics-summary">
        <div className="summary-card">
          <h3>Total Participants</h3>
          <p className="summary-number">396</p>
          <p className="summary-change positive">+12% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Average Attendance</h3>
          <p className="summary-number">92%</p>
          <p className="summary-change positive">+5% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Satisfaction Rate</h3>
          <p className="summary-number">80%</p>
          <p className="summary-change positive">+3% from last month</p>
        </div>
        <div className="summary-card">
          <h3>Evaluation Score</h3>
          <p className="summary-number">4.2/5</p>
          <p className="summary-change positive">+0.2 from last month</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 