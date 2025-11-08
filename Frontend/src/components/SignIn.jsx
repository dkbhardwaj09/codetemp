import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err) {
      let errorMessage = 'Failed to sign in.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      toast.error(errorMessage);
      console.error("Sign in error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="new-auth-form-container">
      <h2>Welcome Back</h2>
      <p>Sign in to continue your session.</p>
      <form onSubmit={handleSignIn} className="new-auth-form">
        <div className="new-form-group">
          <label htmlFor="signin-email">Email Address</label>
          <input
            type="email"
            id="signin-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="captain@sea.com"
            required
            className="new-auth-input"
          />
        </div>
        <div className="new-form-group">
          <label htmlFor="signin-password">Password</label>
          <input
            type="password"
            id="signin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="new-auth-input"
          />
        </div>
        <button type="submit" className="new-auth-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
