import React from 'react';
import './LoadingPage.css';
import logo from '../assets/logo.png';

const LoadingPage = () => {
    return (
        <div className="loading-page">
            <div className="loading-content">
                <div className="logo-container">
                    <img src={logo} alt="LocalSaathi Logo" className="loading-logo" />
                    <div className="pulse-ring"></div>
                </div>

                <h1 className="loading-title">
                    <span className="text-gradient">Local</span>Saathi
                </h1>

                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>

                <p className="loading-subtitle">Connecting you with trusted local services...</p>
            </div>
        </div>
    );
};

export default LoadingPage;
