import React from 'react';

function Hero({onLoginClick}) {
  return (
    <section className="hero-section">
                <div className="hero-content">
                    <div className="hero">
                        <h1>Організовуйте змагання як профі</h1>
                        <p>Відстежуйте результати, керуйте учасниками та аналізуйте дані легко</p>
                        <button onClick={onLoginClick} className="cta-button">Почати безкоштовно</button>
                    </div>
                </div>
    </section>
  )
}

export default Hero;