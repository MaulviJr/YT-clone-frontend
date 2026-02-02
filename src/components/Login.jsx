import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import authService from '../api/auth.service.js';
import { useState } from 'react';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setApiError('');
        try {
            const response = await authService.login(data);
            
            // Store token and user data in Redux
            // dispatch(setAuthToken(response.accessToken));
            // dispatch(setUser(response.data.user));
            dispatch(login(response.data.user))
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            setApiError(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Login</h2>
                
                {apiError && <div className="error-message">{apiError}</div>}
                
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                        })}
                        placeholder="Enter your password"
                    />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}