import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MainApp from './components/MainApp';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
    const { currentUser, loading, logout } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);

    // Render a loading spinner while checking for an active session
    if (loading) {
        return <LoadingSpinner />;
    }

    // This is the view for logged-out users
    const AuthView = () => (
        <div className="auth-page">
            <div className="auth-wrapper">
                <header className="app-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
                    <div>
                        <h1>DocQuery</h1>
                        <p>Your AI Code Review Assistant</p>
                    </div>
                </header>
                {isSigningUp ? <SignUp /> : <SignIn />}
                <button onClick={() => setIsSigningUp(!isSigningUp)} className="toggle-auth-button">
                    {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );

    // This is the view for logged-in users
    const LoggedInView = () => (
        <div className="app-container">
            <header className="app-header">
                <h1>DocQuery</h1>
                {currentUser && (
                    <div className="user-info">
                        <span className="user-email" title={currentUser.email}>{currentUser.email}</span>
                        <button onClick={logout} className="logout-button">Sign Out</button>
                    </div>
                )}
            </header>
            <MainApp />
            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} DocQuery. Crafted with AI.</p>
            </footer>
        </div>
    );

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        border: '1px solid #555',
                    },
                }}
            />
            {currentUser ? <LoggedInView /> : <AuthView />}
        </>
    );
}

export default App;
