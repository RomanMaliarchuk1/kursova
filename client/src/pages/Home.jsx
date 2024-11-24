import React, { useState } from 'react';
import '../index.css';
import AuthModal from '../components/Auth/AuthModal';
import Card from '../components/Card';
import Hero from '../components/Hero';
import Header from '../components/Header';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header onLoginClick={handleLoginClick}/>
            <Hero onLoginClick={handleLoginClick} />
            <Card />
            <AuthModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}