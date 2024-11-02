import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function AuthModal({ isOpen, closeModal }) {
    const { login } = useAuth(); // Use login function from context
    const navigate = useNavigate(); 
    const [formType, setFormType] = useState('login');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email?.value; // Use optional chaining for email
        const username = e.target.username.value;
        const password = e.target.password.value;
    
        const endpoint = formType === 'login' ? '/api/auth/login' : '/api/auth/register';
    
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    formType === 'login' ? { username, password } : { email, username, password }
                ),
            });
    
            const data = await response.json();
            if (response.ok) {
                // Save the token and user info after successful authentication
                const { token, userData } = data; // Assuming your server responds with { token, userData }
                login(userData, token); // Pass user data and token to the login function

                setErrorMessage(''); // Clear error message
                
                // If the user just registered, switch to the login form
                if (formType === 'register') {
                    setFormType('login'); // Switch to the login form
                } else {
                    closeModal(); // Close modal and navigate if logging in
                    navigate('/main'); // Navigate to the main page
                }
            } else {
                // Set error message from server response
                setErrorMessage(data.message || 'Не вдалося увійти. Зареєструйтеся спочатку.');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Login/Registration error:', error);
            setErrorMessage('Помилка під час входу.');
        }
    };

    return (
        <main className={`modal-overlay ${isOpen ? 'active' : ''}`}>
            <div className={`auth-modal ${styles.authModal}`}>
                <button className="modal-close" onClick={closeModal}>×</button>
                <h2>{formType === 'login' ? 'Авторизація' : 'Реєстрація'}</h2>

                {errorMessage && <span className="input-error">{errorMessage}</span>}

                <form id="authForm" onSubmit={handleFormSubmit}>
                    {formType === 'register' && (
                        <div className="input-group">
                            <input type="email" name="email" placeholder=" " required />
                            <label htmlFor="email">Email</label>
                        </div>
                    )}
                    <div className="input-group">
                        <input type="text" name="username" placeholder=" " required />
                        <label htmlFor="username">Логін</label>
                    </div>
                    <div className="input-group">
                        <input type="password" name="password" placeholder=" " required />
                        <label htmlFor="password">Пароль</label>
                    </div>
                    <div className="auth-buttons">
                        <button type="submit" className="auth-button primary">
                            {formType === 'login' ? 'Увійти' : 'Зареєструватися'}
                        </button>
                        <button
                            type="button"
                            className="auth-button secondary"
                            onClick={() => {
                                setFormType(formType === 'login' ? 'register' : 'login');
                                setErrorMessage(''); // Clear error message when switching forms
                            }}
                        >
                            {formType === 'login' ? 'Реєстрація' : 'Назад до входу'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default AuthModal;
