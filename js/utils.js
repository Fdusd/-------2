// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Получение приветствия по времени
export const getGreetingByHour = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
};

// Фильтрация проектов (функциональное программирование)
export const filterProjects = (projects, filters) => {
    return projects.filter(project => {
        const matchesSearch = !filters.search || 
            project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            project.description.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesTech = !filters.tech || filters.tech.length === 0 ||
            filters.tech.some(tech => project.technologies.includes(tech));
        
        const matchesCategory = !filters.category || filters.category === 'all' ||
            project.category === filters.category;
        
        return matchesSearch && matchesTech && matchesCategory;
    });
};

// Получение всех технологий (используем reduce)
export const getAllTechnologies = (projects) => {
    return projects.reduce((techs, project) => {
        project.technologies.forEach(tech => {
            if (!techs.includes(tech)) techs.push(tech);
        });
        return techs;
    }, []);
};

// Подсчет среднего уровня навыков (используем reduce)
export const getAverageSkillLevel = (skills) => {
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return (total / skills.length).toFixed(1);
};

// Debounce для оптимизации поиска
export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

// Работа с хранилищем
export const storage = {
    get: (key, defaultValue = null) => {
        const value = localStorage.getItem(key);
        try {
            return JSON.parse(value) ?? defaultValue;
        } catch {
            return value ?? defaultValue;
        }
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    sessionGet: (key, defaultValue = null) => {
        const value = sessionStorage.getItem(key);
        try {
            return JSON.parse(value) ?? defaultValue;
        } catch {
            return value ?? defaultValue;
        }
    },
    sessionSet: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
};

// Валидация формы
export const validateForm = (data) => {
    const errors = [];
    
    if (!data.fio || data.fio.trim().length < 2) {
        errors.push('ФИО должно содержать минимум 2 символа');
    }
    
    if (!data.phone) {
        errors.push('Введите номер телефона');
    } else {
        const phoneClean = data.phone.replace(/[\s+\-()]/g, '');
        if (phoneClean.length < 10 || phoneClean.length > 12) {
            errors.push('Введите корректный номер телефона (10-12 цифр)');
        }
    }
    
    if (!data.date) {
        errors.push('Выберите дату');
    } else {
        const today = new Date().toISOString().split('T')[0];
        if (data.date < today) {
            errors.push('Дата не может быть раньше сегодняшней');
        }
    }
    
    return { valid: errors.length === 0, errors };
};