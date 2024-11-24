import React, { useState, useEffect } from 'react';

function Header({ onLoginClick }) {

    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    return (
        <nav className={isScrolled ? 'scrolled' : ''}>
            <div className="nav-content">
                <a href="#" className="logo">
                    <span className="logo-icon">🏆</span>
                    <span className="logo-text">CompetiFlow</span>
                </a>
                <button onClick={onLoginClick} className="nav-button">Увійти</button>
            </div>
        </nav>
    );
}

export default Header;
