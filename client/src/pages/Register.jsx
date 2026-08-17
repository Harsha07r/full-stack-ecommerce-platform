import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-4xl">Create an account</h1>
      <p className="mt-3 max-w-[46ch] text-sm text-muted">
        Save your details for faster checkout and order tracking.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
        <FormField label="Name" type="text" name="name" autoComplete="name" value={form.name} onChange={handleChange} required />
        <FormField
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={6}
          value={form.password}
          onChange={handleChange}
          required
        />
        <FormField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={6}
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="text-sm text-sale">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
