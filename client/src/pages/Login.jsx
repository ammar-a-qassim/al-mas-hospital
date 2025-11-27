import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import { LogIn, Hospital } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { language } = useTheme();
    const navigate = useNavigate();
    const t = useTranslation(language);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br transition-colors duration-500"
            style={{
                background: `linear-gradient(to bottom right, var(--color-background), var(--color-surface))`
            }}
        >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

            <div className="relative w-full max-w-md px-6">
                <div
                    className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 border transition-colors duration-500"
                    style={{
                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                        borderColor: `var(--color-border)`
                    }}
                >
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg transition-colors duration-500"
                            style={{
                                background: `linear-gradient(to bottom right, var(--color-primary), var(--color-primaryHover))`
                            }}
                        >
                            <Hospital className="w-10 h-10 text-white" />
                        </div>
                        <h1
                            className="text-3xl font-bold mb-2 transition-colors duration-500"
                            style={{ color: `var(--color-text)` }}
                        >
                            {t('hospitalName')}
                        </h1>
                        <p
                            className="text-sm transition-colors duration-500"
                            style={{ color: `var(--color-textSecondary)` }}
                        >
                            {t('documentManagementSystem')}
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div
                                className="px-4 py-3 rounded-xl text-sm animate-shake border"
                                style={{
                                    backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`,
                                    borderColor: `var(--color-error)`,
                                    color: `var(--color-error)`
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium mb-2 transition-colors duration-500"
                                style={{ color: `var(--color-text)` }}
                            >
                                {t('username')}
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                                style={{
                                    backgroundColor: `var(--color-surface)`,
                                    borderWidth: '1px',
                                    borderColor: `var(--color-border)`,
                                    color: `var(--color-text)`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                                placeholder={t('enterUsername')}
                                required
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-2 transition-colors duration-500"
                                style={{ color: `var(--color-text)` }}
                            >
                                {t('password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 transition-all outline-none"
                                style={{
                                    backgroundColor: `var(--color-surface)`,
                                    borderWidth: '1px',
                                    borderColor: `var(--color-border)`,
                                    color: `var(--color-text)`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                                placeholder={t('enterPassword')}
                                required
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            style={{
                                background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`,
                                '--tw-ring-color': `var(--color-primary)`
                            }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    {t('signIn')}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
