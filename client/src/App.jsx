import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.css'; // Import styles
import Home from './pages/Home';
import Main from './pages/Main';
import UserProfilePage from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import TournamentPage from './pages/TournamentPage';


function App() {
    const location = useLocation(); // Get the current location

    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
            >
                <Routes location={location}>
                    <Route index element={<Home />} />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/main" 
                        element={
                            <ProtectedRoute>
                                <Main />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/tournament/:tournamentId" 
                        element={
                            <ProtectedRoute>
                                <TournamentPage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

const MainApp = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default MainApp;
