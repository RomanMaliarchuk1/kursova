import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function AuthModal({ isOpen, closeModal }) {
    const { login } = useAuth();
    const navigate = useNavigate(); 
    const [formType, setFormType] = useState('login');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email?.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
    
        const endpoint = formType === 'login' ? '/api/auth/login' : '/api/auth/register';
    
        try {
            // Clear any previous error message
            setErrorMessage('');
    
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    formType === 'login' ? { username, password } : { email, username, password }
                ),
            });
    
            const data = await response.json();
            if (response.ok) {
                // Check if the response contains a token and userId (login response)
                if (formType === 'login') {
                    const { token, userId } = data;
                    if (userId && token) {
                        login({ id: userId }, token);
                        closeModal();
                        navigate('/main');
                    } else {
                        console.error('Invalid userId or token:', data);
                        setErrorMessage('Помилка авторизації.');
                    }
                }
                
                // Handle successful registration response
                if (formType === 'register') {
                    if (data.message === 'User registered successfully') {
                        setFormType('login');
                        setErrorMessage(''); // Clear any error message
                    } else {
                        setErrorMessage(data.message || 'Не вдалося зареєструвати користувача.');
                    }
                }
            } else {
                setErrorMessage(data.message || 'Не вдалося увійти. Зареєструйтеся спочатку.');
            }
        } catch (error) {
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
                                setErrorMessage('');
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
