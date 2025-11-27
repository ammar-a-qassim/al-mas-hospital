import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Menu, UserPlus, Users as UsersIcon, FolderPlus, Tag, Trash2, ArrowLeft, Edit2, Check, X, Database, Upload, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

const Admin = () => {
    const { user } = useAuth();
    const { language } = useTheme();
    const t = useTranslation(language);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const [newDept, setNewDept] = useState('');
    const [newCat, setNewCat] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingDept, setEditingDept] = useState(null);
    const [editingCat, setEditingCat] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
        fetchDepartments();
        fetchCategories();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

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

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, newUser);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setNewUser({ username: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create user' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/departments`, { name: newDept });
            setMessage({ type: 'success', text: 'Department created successfully!' });
            setNewDept('');
            fetchDepartments();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create department' });
        }
    };

    const handleEditDepartment = async (deptId) => {
        if (!editValue.trim()) return;
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/departments/${deptId}`, { name: editValue });
            setMessage({ type: 'success', text: 'Department updated successfully!' });
            setEditingDept(null);
            setEditValue('');
            fetchDepartments();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update department' });
        }
    };

    const handleDeleteDepartment = async (deptId) => {
        if (!confirm('Are you sure? This may affect existing documents.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/departments/${deptId}`);
            fetchDepartments();
        } catch (error) {
            alert('Failed to delete department');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/categories`, { name: newCat });
            setMessage({ type: 'success', text: 'Category created successfully!' });
            setNewCat('');
            fetchCategories();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create category' });
        }
    };

    const handleEditCategory = async (catId) => {
        if (!editValue.trim()) return;
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/categories/${catId}`, { name: editValue });
            setMessage({ type: 'success', text: 'Category updated successfully!' });
            setEditingCat(null);
            setEditValue('');
            fetchCategories();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update category' });
        }
    };

    const handleDeleteCategory = async (catId) => {
        if (!confirm('Are you sure? This may affect existing documents.')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/categories/${catId}`);
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    const startEditDept = (dept) => {
        setEditingDept(dept.id);
        setEditValue(dept.name);
    };

    const startEditCat = (cat) => {
        setEditingCat(cat.id);
        setEditValue(cat.name);
    };

    const cancelEdit = () => {
        setEditingDept(null);
        setEditingCat(null);
        setEditValue('');
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                                {t('adminPanelTitle')}
                            </h1>
                            <p className="text-sm" style={{ color: `var(--color-textSecondary)` }}>
                                {t('manageUsers')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="mb-6 flex gap-2">
                    {[
                        { id: 'users', label: t('users'), icon: UsersIcon },
                        { id: 'departments', label: t('departments'), icon: FolderPlus },
                        { id: 'categories', label: t('categories'), icon: Tag },
                        { id: 'backup', label: 'Backup & Restore', icon: Database }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm"
                            style={
                                activeTab === tab.id
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
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

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

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: `var(--color-text)` }}>
                                <UserPlus className="w-5 h-5" style={{ color: `var(--color-primary)` }} />
                                {t('addNewUser')}
                            </h2>
                            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder={t('username')}
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder={t('password')}
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                >
                                    <option value="user">{t('user')}</option>
                                    <option value="admin">{t('admin')}</option>
                                </select>
                                <button
                                    type="submit"
                                    className="text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:opacity-90"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`
                                    }}
                                >
                                    {t('addUser')}
                                </button>
                            </form>
                        </div>

                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border overflow-hidden transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
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
                                                {t('username')}
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                                {t('role')}
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: `var(--color-text)` }}>
                                                {t('actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: `var(--color-border)` }}>
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:opacity-80 transition-all">
                                                <td className="px-6 py-4 font-medium" style={{ color: `var(--color-text)` }}>
                                                    {u.username}
                                                </td>
                                                <td className="px-6 py-4 capitalize" style={{ color: `var(--color-text)` }}>
                                                    {u.role === 'admin' ? t('admin') : t('user')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {u.id !== user?.id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-2 rounded-lg transition-all hover:opacity-80"
                                                            style={{
                                                                color: `var(--color-error)`,
                                                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                            }}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Departments Tab */}
                {activeTab === 'departments' && (
                    <div className="space-y-6">
                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: `var(--color-text)` }}>
                                <FolderPlus className="w-5 h-5" style={{ color: `var(--color-primary)` }} />
                                {t('addNewDepartment')}
                            </h2>
                            <form onSubmit={handleAddDepartment} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder={t('departmentName')}
                                    value={newDept}
                                    onChange={(e) => setNewDept(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:opacity-90"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`
                                    }}
                                >
                                    {t('addNewDepartment')}
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {departments.map((dept) => (
                                <div
                                    key={dept.id}
                                    className="backdrop-blur-xl rounded-xl shadow-lg border p-4 flex items-center justify-between transition-colors duration-500"
                                    style={{
                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                        borderColor: `var(--color-border)`
                                    }}
                                >
                                    {editingDept === dept.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-2 py-1 rounded outline-none"
                                                style={{
                                                    backgroundColor: `var(--color-background)`,
                                                    borderWidth: '1px',
                                                    borderColor: `var(--color-border)`,
                                                    color: `var(--color-text)`
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex gap-1 ml-2">
                                                <button
                                                    onClick={() => handleEditDepartment(dept.id)}
                                                    className="p-1 rounded transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-success)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-success')}20`
                                                    }}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-1 rounded transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-error)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-medium" style={{ color: `var(--color-text)` }}>
                                                {dept.name}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => startEditDept(dept)}
                                                    className="p-2 rounded-lg transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-primary)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20`
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDepartment(dept.id)}
                                                    className="p-2 rounded-lg transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-error)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: `var(--color-text)` }}>
                                <Tag className="w-5 h-5" style={{ color: `var(--color-primary)` }} />
                                {t('addNewCategory')}
                            </h2>
                            <form onSubmit={handleAddCategory} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder={t('categoryName')}
                                    value={newCat}
                                    onChange={(e) => setNewCat(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl focus:ring-2 outline-none transition-all"
                                    style={{
                                        backgroundColor: `var(--color-surface)`,
                                        borderWidth: '1px',
                                        borderColor: `var(--color-border)`,
                                        color: `var(--color-text)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:opacity-90"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`
                                    }}
                                >
                                    {t('addNewCategory')}
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="backdrop-blur-xl rounded-xl shadow-lg border p-4 flex items-center justify-between transition-colors duration-500"
                                    style={{
                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                        borderColor: `var(--color-border)`
                                    }}
                                >
                                    {editingCat === cat.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-2 py-1 rounded outline-none"
                                                style={{
                                                    backgroundColor: `var(--color-background)`,
                                                    borderWidth: '1px',
                                                    borderColor: `var(--color-border)`,
                                                    color: `var(--color-text)`
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex gap-1 ml-2">
                                                <button
                                                    onClick={() => handleEditCategory(cat.id)}
                                                    className="p-1 rounded transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-success)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-success')}20`
                                                    }}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-1 rounded transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-error)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-medium" style={{ color: `var(--color-text)` }}>
                                                {cat.name}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => startEditCat(cat)}
                                                    className="p-2 rounded-lg transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-primary)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-primary')}20`
                                                    }}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="p-2 rounded-lg transition-all hover:opacity-80"
                                                    style={{
                                                        color: `var(--color-error)`,
                                                        backgroundColor: `${document.documentElement.style.getPropertyValue('--color-error')}20`
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Backup Tab */}
                {activeTab === 'backup' && (
                    <div className="space-y-6">
                        {/* Backup Section */}
                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: `var(--color-text)` }}>
                                <Download className="w-5 h-5" style={{ color: `var(--color-primary)` }} />
                                Download Backup
                            </h2>
                            <p className="mb-4 text-sm" style={{ color: `var(--color-textSecondary)` }}>
                                Download a full backup of the database (as readable JSON) and all uploaded files.
                            </p>
                            <button
                                onClick={() => window.open(`${import.meta.env.VITE_API_URL}/api/admin/backup`, '_blank')}
                                className="flex items-center gap-2 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:opacity-90"
                                style={{
                                    background: `linear-gradient(to right, var(--color-primary), var(--color-primaryHover))`
                                }}
                            >
                                <Download className="w-5 h-5" />
                                Download Backup Zip
                            </button>
                        </div>

                        {/* Restore Section */}
                        <div
                            className="backdrop-blur-xl rounded-2xl shadow-lg border p-6 transition-colors duration-500"
                            style={{
                                backgroundColor: `${document.documentElement.style.getPropertyValue('--color-surface')}dd`,
                                borderColor: `var(--color-border)`
                            }}
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: `var(--color-text)` }}>
                                <Upload className="w-5 h-5" style={{ color: `var(--color-error)` }} />
                                Restore Backup
                            </h2>
                            <div className="p-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 mb-6">
                                <p className="font-medium">⚠️ Warning</p>
                                <p className="text-sm mt-1">
                                    Restoring a backup will merge data into the current database. Existing files with the same name will be overwritten.
                                </p>
                            </div>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const file = e.target.backupFile.files[0];
                                    if (!file) return;

                                    if (!confirm('Are you sure you want to restore this backup? This action cannot be undone.')) return;

                                    const formData = new FormData();
                                    formData.append('backup', file);

                                    try {
                                        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/restore`, formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        setMessage({ type: 'success', text: 'Backup restored successfully!' });
                                        e.target.reset();
                                    } catch (error) {
                                        setMessage({ type: 'error', text: error.response?.data?.error || 'Restore failed' });
                                    }
                                }}
                                className="flex gap-4 items-end"
                            >
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-2" style={{ color: `var(--color-text)` }}>
                                        Select Backup Zip File
                                    </label>
                                    <input
                                        type="file"
                                        name="backupFile"
                                        accept=".zip"
                                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all"
                                        style={{
                                            backgroundColor: `var(--color-surface)`,
                                            borderColor: `var(--color-border)`,
                                            color: `var(--color-text)`,
                                            '--tw-ring-color': `var(--color-primary)`
                                        }}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg hover:opacity-90"
                                    style={{
                                        backgroundColor: `var(--color-error)`
                                    }}
                                >
                                    Restore Data
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
