// ========== ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ ==========
import { HomePage, SkillsPage, AboutPage, ContactsPage } from './pages.js';
import { ThemeToggle } from './components.js';
import { storage, getGreetingByHour } from './utils.js';
import { GREETINGS } from './data.js';

// Определение текущей страницы
const getCurrentPage = () => {
    const path = window.location.pathname.split('/').pop() || 'main.html';
    const pages = {
        'main.html': HomePage,
        'ISD1.html': SkillsPage,
        'ISD2.html': AboutPage,
        'contacts.html': ContactsPage
    };
    const PageClass = pages[path] || HomePage;
    return new PageClass();
};

// Приветствие
const showGreeting = () => {
    if (!storage.sessionGet('greeted')) {
        const greetingType = getGreetingByHour();
        alert(GREETINGS[greetingType]);
        storage.sessionSet('greeted', true);
    }
};

// Инициализация
const init = () => {
    showGreeting();
    new ThemeToggle();
    
    const page = getCurrentPage();
    page.render();
    
    // Анимация секций
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease';
        observer.observe(section);
    });
};

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}