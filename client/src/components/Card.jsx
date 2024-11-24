// FeaturesSection.js
import React from 'react';

function FeaturesSection() {
    return (
        <section className="features-section">
            <div className="features">
                <div className="feature-card">
                    <div className="feature-icon">🏆</div>
                    <h3>Організація змагань</h3>
                    <p>Створюйте та керуйте змаганнями будь-якого масштабу з легкістю.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">👥</div>
                    <h3>Управління учасниками</h3>
                    <p>Реєструйте учасників, формуйте команди та слідкуйте за їх прогресом.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Аналіз результатів</h3>
                    <p>Отримуйте детальну статистику та візуалізації для кращого розуміння результатів.</p>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
