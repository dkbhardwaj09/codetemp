import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      toast.success('Welcome! Your account has been created.');
    } catch (err) {
      let errorMessage = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Your password must be at least 6 characters long.';
      }
      toast.error(errorMessage);
      console.error("Sign up error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="new-auth-form-container">
      <h2>Create Your Account</h2>
      <p>Join us and start reviewing your code.</p>
      <form onSubmit={handleSignUp} className="new-auth-form">
        <div className="new-form-group">
          <label htmlFor="signup-email">Email Address</label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="captain@sea.com"
            required
            className="new-auth-input"
          />
        </div>
        <div className="new-form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength="6"
            className="new-auth-input"
          />
        </div>
        <button type="submit" className="new-auth-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
