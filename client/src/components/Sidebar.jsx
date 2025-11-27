import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import {
    Upload,
    FolderPlus,
    Tag,
    Palette,
    Languages,
    Database,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { currentTheme, changeTheme, themes, language, setLanguage } = useTheme();
    const navigate = useNavigate();
    const [notification, setNotification] = React.useState('');
    const t = useTranslation(language);

    const menuItems = [
        { icon: Upload, label: t('uploadDocument'), path: '/upload', adminOnly: false },
        { icon: FolderPlus, label: t('addDepartment'), path: '/admin/departments', adminOnly: true },
        { icon: Tag, label: t('addCategory'), path: '/admin/categories', adminOnly: true },
        { icon: Users, label: t('adminPanel'), path: '/admin', adminOnly: true },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleThemeChange = (themeName) => {
        changeTheme(themeName);
        const themeLabelKey = themeName.toLowerCase();
        setNotification(`${t('themeChanged')} ${t(themeLabelKey)}`);
        setTimeout(() => setNotification(''), 2000);
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        const langName = lang === 'en' ? t('english') : t('arabic');
        setNotification(`${t('languageChanged')} ${langName}`);
        setTimeout(() => setNotification(''), 2000);
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                style={{
                    backgroundColor: `var(--color-sidebarBg)`,
                    color: `var(--color-sidebarText)`
                }}
                className={`fixed top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-full w-80 shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Notification Toast */}
                    {notification && (
                        <div
                            className="absolute top-4 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-xl shadow-lg z-10 animate-bounce"
                            style={{ backgroundColor: `var(--color-primary)` }}
                        >
                            {notification}
                        </div>
                    )}

                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">{t('menu')}</h2>
                            <p className="text-sm opacity-70 mt-1">
                                {user?.username} ({user?.role === 'admin' ? t('admin') : t('user')})
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {language === 'ar' ? (
                                <ChevronRight className="w-5 h-5" />
                            ) : (
                                <ChevronLeft className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item, index) => {
                            if (item.adminOnly && user?.role !== 'admin') return null;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                    <item.icon
                                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                                        style={{ color: `var(--color-primary)` }}
                                    />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}

                        {/* Settings Section */}
                        <div className="pt-4 mt-4 border-t border-white/10">
                            <div className="px-4 py-2 text-sm opacity-70 font-semibold">
                                {t('settings')}
                            </div>

                            {/* Theme Selector Dropdown */}
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Palette className="w-4 h-4" style={{ color: `var(--color-primary)` }} />
                                    <span className="text-sm font-medium">{t('colorPalette')}</span>
                                </div>
                                <select
                                    value={currentTheme}
                                    onChange={(e) => handleThemeChange(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-all"
                                    style={{
                                        color: `var(--color-sidebarText)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                >
                                    {Object.entries(themes).map(([key, value]) => (
                                        <option key={key} value={key} className="bg-slate-800 text-white">
                                            {t(key.toLowerCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Language Selector */}
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Languages className="w-4 h-4" style={{ color: `var(--color-primary)` }} />
                                    <span className="text-sm font-medium">{t('language')}</span>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-all"
                                    style={{
                                        color: `var(--color-sidebarText)`,
                                        '--tw-ring-color': `var(--color-primary)`
                                    }}
                                >
                                    <option value="en" className="bg-slate-800 text-white">{t('english')}</option>
                                    <option value="ar" className="bg-slate-800 text-white">{t('arabic')}</option>
                                </select>
                            </div>

                            {/* Backup */}
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => {
                                        window.open(`${import.meta.env.VITE_API_URL}/api/admin/backup`, '_blank');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group"
                                >
                                    <Database
                                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                                        style={{ color: `var(--color-primary)` }}
                                    />
                                    <span className="font-medium">{t('backupRestore')}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
                            style={{ backgroundColor: `var(--color-error)` }}
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
                            <span className="font-medium text-white">{t('signOut')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
