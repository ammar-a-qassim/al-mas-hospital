import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Menu, Search, Download, Trash2, FileText, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

const Dashboard = () => {
    const { user } = useAuth();
    const { language } = useTheme();
    const t = useTranslation(language);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchDocuments();
        }
    }, [selectedDepartment, selectedCategory, searchQuery]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/departments`);
            setDepartments(response.data);
            if (response.data.length > 0) {
                setSelectedDepartment(response.data[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        } finally {
            setLoading(false);
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

    const fetchDocuments = async () => {
        try {
            const params = {
                department_id: selectedDepartment,
                ...(selectedCategory && { category_id: selectedCategory }),
                ...(searchQuery && { search: searchQuery })
            };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, { params });
            setDocuments(response.data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        }
    };

    const handleDownload = async (docId, filename) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/download/${docId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download document:', error);
        }
    };

    const handleDelete = async (docId) => {
        if (!confirm(t('deleteConfirm'))) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${docId}`);
            fetchDocuments();
        } catch (error) {
            console.error('Failed to delete document:', error);
            alert('Failed to delete document');
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: `var(--color-background)` }}
            >
                <div
                    className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: `var(--color-primary)` }}
                ></div>
            </div>
        );
    }

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-xl transition-all hover:opacity-80"
                                style={{ backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20` }}
                            >
                                <Menu className="w-6 h-6" style={{ color: `var(--color-text)` }} />
                            </button>
                            <div>
                                <h1
                                    className="text-2xl font-bold transition-colors duration-500"
                                    style={{ color: `var(--color-primary)` }}
                                >
                                    {t('hospitalName')}
                                </h1>
                                <p style={{ color: `var(--color-textSecondary)` }} className="text-sm">
                                    {t('documentManagement')}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium" style={{ color: `var(--color-text)` }}>
                                {user?.username}
                            </p>
                            <p className="text-xs capitalize" style={{ color: `var(--color-textSecondary)` }}>
                                {user?.role === 'admin' ? t('admin') : t('user')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Department Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {departments.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => setSelectedDepartment(dept.id)}
                                className="px-6 py-3 rounded-xl font-medium transition-all shadow-sm"
                                style={
                                    selectedDepartment === dept.id
                                        ? {
                                            background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`,
                                            color: '#ffffff'
                                        }
                                        : {
                                            backgroundColor: `var(--color-surface)`,
                                            color: `var(--color-text)`,
                                            borderWidth: '1px',
                                            borderColor: `var(--color-border)`
                                        }
                                }
                            >
                                {dept.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div
                    className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 mb-6 transition-colors duration-500"
                    style={{
                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                        borderColor: `var(--color-border)`
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                style={{ color: `var(--color-textSecondary)` }}
                            />
                            <input
                                type="text"
                                placeholder={t('searchDocuments')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                style={{
                                    backgroundColor: `var(--color-surface)`,
                                    borderWidth: '1px',
                                    borderColor: `var(--color-border)`,
                                    color: `var(--color-text)`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                            />
                        </div>
                        <div className="relative">
                            <Filter
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                style={{ color: `var(--color-textSecondary)` }}
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                style={{
                                    backgroundColor: `var(--color-surface)`,
                                    borderWidth: '1px',
                                    borderColor: `var(--color-border)`,
                                    color: `var(--color-text)`,
                                    '--tw-ring-color': `var(--color-primary)`
                                }}
                            >
                                <option value="">{t('allCategories')}</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Documents List */}
                <div
                    className="backdrop-blur-xl rounded-2xl shadow-lg border overflow-hidden transition-colors duration-500"
                    style={{
                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                        borderColor: `var(--color-border)`
                    }}
                >
                    {documents.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: `var(--color-textSecondary)` }} />
                            <p className="text-lg" style={{ color: `var(--color-textSecondary)` }}>
                                {t('noDocumentsFound')}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead
                                    className="border-b"
                                    style={{
                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-background')}80`,
                                        borderColor: `var(--color-border)`
                                    }}
                                >
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                            {t('title')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                            {t('category')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                            {t('uploadedBy')}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                            {t('date')}
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: `var(--color-border)` }}>
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:opacity-80 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5" style={{ color: `var(--color-primary)` }} />
                                                    <div>
                                                        <p className="font-medium" style={{ color: `var(--color-text)` }}>
                                                            {doc.title}
                                                        </p>
                                                        <p className="text-sm" style={{ color: `var(--color-textSecondary)` }}>
                                                            {doc.filename}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: `var(--color-text)` }}>
                                                {doc.category_name}
                                            </td>
                                            <td className="px-6 py-4" style={{ color: `var(--color-text)` }}>
                                                {doc.uploaded_by_name}
                                            </td>
                                            <td className="px-6 py-4" style={{ color: `var(--color-text)` }}>
                                                {new Date(doc.upload_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(doc.id, doc.filename)}
                                                        className="p-2 rounded-lg transition-all hover:opacity-80"
                                                        style={{
                                                            color: `var(--color-primary)`,
                                                            backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20`
                                                        }}
                                                        title={t('download')}
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    {(user?.role === 'admin' || doc.uploaded_by === user?.id) && (
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="p-2 rounded-lg transition-all hover:opacity-80"
                                                            style={{
                                                                color: `var(--color-error)`,
                                                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                            }}
                                                            title={t('delete')}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
