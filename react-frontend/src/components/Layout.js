import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUserTie, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import './Layout.css';

const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <div className="logo-container">
                        <img src="/ofppt-logo.png" alt="OFPPT Logo" className="logo" />
                    </div>
                    <nav className="main-nav">
                        <Link to="/" className="nav-link">Home</Link>
                        {token && (
                            <>
                                <Link to="/dashboard" className="nav-link">
                                    <FaChartBar className="nav-icon" />
                                    Dashboard
                                </Link>
                                <Link to="/dashboard/plan" className="nav-link">
                                    <FaCalendarAlt className="nav-icon" />
                                    Plan Training
                                </Link>
                                <Link to="/dashboard/trainers" className="nav-link">
                                    <FaUserTie className="nav-icon" />
                                    Track Trainers
                                </Link>
                            </>
                        )}
                    </nav>
                    {token && (
                        <button onClick={handleLogout} className="logout-btn">
                            <FaSignOutAlt /> Logout
                        </button>
                    )}
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <img src="/ofppt-logo.png" alt="OFPPT Logo" className="footer-logo" />
                        <p>Office de la Formation Professionnelle et de la Promotion du Travail</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <Link to="/">Home</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/about">About</Link>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p>Email: contact@ofppt.ma</p>
                        <p>Phone: +212 5XX-XXXXXX</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 OFPPT. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout; 