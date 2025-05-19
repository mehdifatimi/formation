import React from 'react';
import { FaCalendarAlt, FaUserClock, FaFileAlt, FaChartBar, FaArrowRight } from 'react-icons/fa';
import './Features.css';

const Features = () => {
    const features = [
        {
            title: 'Training Planning',
            description: 'Efficiently manage and schedule training sessions with an intuitive calendar interface.',
            icon: <FaCalendarAlt />,
            link: '/training-planning',
            color: '#4CAF50'
        },
        {
            title: 'Absence Tracking',
            description: 'Monitor and manage participant attendance with detailed tracking and reporting.',
            icon: <FaUserClock />,
            link: '/absence-tracking',
            color: '#2196F3'
        },
        {
            title: 'Document Management',
            description: 'Organize and access all training materials and documentation in one secure location.',
            icon: <FaFileAlt />,
            link: '/documents',
            color: '#FF9800'
        },
        {
            title: 'Evaluation & Reporting',
            description: 'Generate comprehensive reports and evaluate training effectiveness with advanced analytics.',
            icon: <FaChartBar />,
            link: '/evaluation',
            color: '#9C27B0'
        }
    ];

    return (
        <div className="features-dashboard">
            <div className="features-header">
                <h2>System Features</h2>
                <p>Explore the powerful tools available in our training management system</p>
            </div>
            <div className="features-grid">
                {features.map((feature, index) => (
                    <a href={feature.link} key={index} className="feature-card">
                        <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                            {feature.icon}
                        </div>
                        <div className="feature-content">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                        <FaArrowRight className="feature-arrow" />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Features; 