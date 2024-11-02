// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // Import styles
import Home from './pages/Home';
import Main from './pages/Main';
import UserProfilePage from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} /> {/* Public Route */}
                    
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
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;