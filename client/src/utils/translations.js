export const translations = {
    en: {
        // Login Page
        hospitalName: 'Al-Mas Hospital',
        documentManagementSystem: 'Document Management System',
        username: 'Username',
        password: 'Password',
        enterUsername: 'Enter your username',
        enterPassword: 'Enter your password',
        signIn: 'Sign In',
        defaultCredentials: 'Default credentials: admin / admin123',

        // Sidebar Menu
        menu: 'Menu',
        uploadDocument: 'Upload Document',
        addDepartment: 'Add Department',
        addCategory: 'Add Category',
        adminPanel: 'Admin Panel',
        settings: 'Settings',
        colorPalette: 'Color Palette',
        language: 'Language',
        backupRestore: 'Backup & Restore',
        signOut: 'Sign Out',

        // Dashboard
        documentManagement: 'Document Management',
        searchDocuments: 'Search documents...',
        allCategories: 'All Categories',
        noDocumentsFound: 'No documents found',
        title: 'Title',
        category: 'Category',
        uploadedBy: 'Uploaded By',
        date: 'Date',
        actions: 'Actions',
        download: 'Download',
        delete: 'Delete',

        // Upload Page
        uploadDocumentTitle: 'Upload Document',
        addNewDocument: 'Add a new document to the system',
        documentTitle: 'Document Title',
        enterDocumentTitle: 'Enter document title',
        department: 'Department',
        selectDepartment: 'Select Department',
        selectCategory: 'Select Category',
        file: 'File',
        uploadButton: 'Upload Document',
        cancel: 'Cancel',
        uploadSuccess: 'Document uploaded successfully!',

        // Admin Panel
        adminPanelTitle: 'Admin Panel',
        manageUsers: 'Manage users, departments, and categories',
        users: 'Users',
        departments: 'Departments',
        categories: 'Categories',
        addNewUser: 'Add New User',
        addUser: 'Add User',
        role: 'Role',
        user: 'User',
        admin: 'Admin',
        addNewDepartment: 'Add New Department',
        departmentName: 'Department name',
        addNewCategory: 'Add New Category',
        categoryName: 'Category name',
        deleteConfirm: 'Are you sure you want to delete this',

        // Notifications
        themeChanged: 'Theme changed to',
        languageChanged: 'Language changed to',
        english: 'English',
        arabic: 'العربية',

        // Theme Names
        light: 'Light',
        dark: 'Dark',
        medical: 'Medical Blue',
        purple: 'Purple',
        green: 'Green',
        rose: 'Rose',
        ocean: 'Ocean',
        sunset: 'Sunset'
    },
    ar: {
        // Login Page
        hospitalName: 'مستشفى الماس',
        documentManagementSystem: 'نظام إدارة الوثائق',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        enterUsername: 'أدخل اسم المستخدم',
        enterPassword: 'أدخل كلمة المرور',
        signIn: 'تسجيل الدخول',
        defaultCredentials: 'بيانات الدخول الافتراضية: admin / admin123',

        // Sidebar Menu
        menu: 'القائمة',
        uploadDocument: 'رفع وثيقة',
        addDepartment: 'إضافة قسم',
        addCategory: 'إضافة فئة',
        adminPanel: 'لوحة الإدارة',
        settings: 'الإعدادات',
        colorPalette: 'لوحة الألوان',
        language: 'اللغة',
        backupRestore: 'النسخ الاحتياطي والاستعادة',
        signOut: 'تسجيل الخروج',

        // Dashboard
        documentManagement: 'إدارة الوثائق',
        searchDocuments: 'البحث عن وثائق...',
        allCategories: 'جميع الفئات',
        noDocumentsFound: 'لم يتم العثور على وثائق',
        title: 'العنوان',
        category: 'الفئة',
        uploadedBy: 'رفع بواسطة',
        date: 'التاريخ',
        actions: 'الإجراءات',
        download: 'تحميل',
        delete: 'حذف',

        // Upload Page
        uploadDocumentTitle: 'رفع وثيقة',
        addNewDocument: 'إضافة وثيقة جديدة إلى النظام',
        documentTitle: 'عنوان الوثيقة',
        enterDocumentTitle: 'أدخل عنوان الوثيقة',
        department: 'القسم',
        selectDepartment: 'اختر القسم',
        selectCategory: 'اختر الفئة',
        file: 'الملف',
        uploadButton: 'رفع الوثيقة',
        cancel: 'إلغاء',
        uploadSuccess: 'تم رفع الوثيقة بنجاح!',

        // Admin Panel
        adminPanelTitle: 'لوحة الإدارة',
        manageUsers: 'إدارة المستخدمين والأقسام والفئات',
        users: 'المستخدمون',
        departments: 'الأقسام',
        categories: 'الفئات',
        addNewUser: 'إضافة مستخدم جديد',
        addUser: 'إضافة مستخدم',
        role: 'الدور',
        user: 'مستخدم',
        admin: 'مدير',
        addNewDepartment: 'إضافة قسم جديد',
        departmentName: 'اسم القسم',
        addNewCategory: 'إضافة فئة جديدة',
        categoryName: 'اسم الفئة',
        deleteConfirm: 'هل أنت متأكد من حذف هذا',

        // Notifications
        themeChanged: 'تم تغيير المظهر إلى',
        languageChanged: 'تم تغيير اللغة إلى',
        english: 'English',
        arabic: 'العربية',

        // Theme Names
        light: 'فاتح',
        dark: 'داكن',
        medical: 'أزرق طبي',
        purple: 'بنفسجي',
        green: 'أخضر',
        rose: 'وردي',
        ocean: 'محيط',
        sunset: 'غروب'
    }
};

export const useTranslation = (language) => {
    return (key) => {
        return translations[language]?.[key] || translations.en[key] || key;
    };
};
