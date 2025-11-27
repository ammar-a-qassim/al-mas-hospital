import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Menu, Upload as UploadIcon, FileText, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

const Upload = () => {
    const navigate = useNavigate();
    const { language } = useTheme();
    const t = useTranslation(language);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        department_id: '',
        category_id: '',
        file: null
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchDepartments();
        fetchCategories();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/departments`);
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setUploading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('department_id', formData.department_id);
        data.append('category_id', formData.category_id);
        data.append('file', formData.file);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/documents/upload`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: t('uploadSuccess') });
            setFormData({ title: '', department_id: '', category_id: '', file: null });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to upload document'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="min-h-screen transition-colors duration-500"
            style={{ backgroundColor: `var(--color-background)` }}
        >
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header */}
            <div
                className="backdrop-blur-xl border-b sticky top-0 z-30 shadow-sm transition-colors duration-500"
                style={{
                    backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                    borderColor: `var(--color-border)`
                }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl transition-all hover:opacity-80"
                            style={{ backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20` }}
                        >
                            <Menu className="w-6 h-6" style={{ color: `var(--color-text)` }} />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-xl transition-all hover:opacity-80"
                            style={{ backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20` }}
                        >
                            <ArrowLeft className="w-6 h-6" style={{ color: `var(--color-text)` }} />
                        </button>
                        <div>
                            <h1
                                className="text-2xl font-bold transition-colors duration-500"
                                style={{ color: `var(--color-primary)` }}
                            >
                                {t('uploadDocumentTitle')}
                            </h1>
                            <p className="text-sm" style={{ color: `var(--color-textSecondary)` }}>
                                {t('addNewDocument')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div
                    className="backdrop-blur-xl rounded-2xl shadow-lg border p-8 transition-colors duration-500"
                    style={{
                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                        borderColor: `var(--color-border)`
                    }}
                >
                    {message.text && (
                        <div
                            className="mb-6 px-4 py-3 rounded-xl border"
                            style={
                                message.type === 'success'
                                    ? {
                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-success')}20`,
                                        borderColor: `var(--color-success)`,
                                        color: `var(--color-success)`
                                    }
                                    : {
                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`,
                                        borderColor: `var(--color-error)`,
                                        color: `var(--color-error)`
                                    }
                            }
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-text)` }}>
                                {t('documentTitle')} *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                style={{
                                    backgroundColor: `var(--color-surface)`,
                                    borderWidth: '1px',
                                    borderColor: `var(--color-border)`,
                                    color: `var(--color-text)`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                                placeholder={t('enterDocumentTitle')}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-text)` }}>
                                    {t('department')} *
                                </label>
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                >
                                    <option value="">{t('selectDepartment')}</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-text)` }}>
                                    {t('category')} *
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                >
                                    <option value="">{t('selectCategory')}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-text)` }}>
                                {t('file')} *
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                    className="w-full px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium hover:file:opacity-80"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`,
                                        '--file-bg': `${document.documentElement.style.getPropertyValue('--color-primary')}20`,
                                        '--file-color': `var(--color-primary)`
                                    }}
                                    required
                                />
                            </div>
                            {formData.file && (
                                <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: `var(--color-textSecondary)` }}>
                                    <FileText className="w-4 h-4" />
                                    <span>{formData.file.name}</span>
                                    <span className="opacity-60">
                                        ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 text-white py-3 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:opacity-90"
                                style={{
                                    background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                            >
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <UploadIcon className="w-5 h-5" />
                                        {t('uploadButton')}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 rounded-xl font-medium transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: `${document.documentElement.style.getPropertyValue('--color-border')}`,
                                    color: `var(--color-text)`
                                }}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Upload;
