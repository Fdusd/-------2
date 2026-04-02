// ГЛАВНЫЙ ФАЙЛ
import { HomePage, SkillsPage, AboutPage, ContactsPage } from './pages.js';
import { ThemeToggle } from './components.js';
import { storage, getGreetingByHour } from './utils.js';
import { GREETINGS } from './data.js';

// ОПРЕДЕЛЯЕМ, КАКАЯ СТРАНИЦА ОТКРЫТА
// Смотрим на адрес в браузере и возвращаем нужную страницу
function getCurrentPage() {
    // Получаем имя файла из адреса (main.html, ISD1.html и т.д.)
    const currentPath = window.location.pathname.split('/').pop() || 'main.html';
    
    // Соответствие между адресом и классом страницы
    const pagesMap = {
        'main.html': HomePage,
        'ISD1.html': SkillsPage,
        'ISD2.html': AboutPage,
        'contacts.html': ContactsPage
    };
    
    // Если страница найдена - создаём её, иначе главную
    const PageClass = pagesMap[currentPath] || HomePage;
    return new PageClass();
}

// ПРИВЕТСТВИЕ ПРИ ПЕРВОМ ПОСЕЩЕНИИ
function showGreeting() {
    // Проверяем, не показывали ли уже приветствие в этой сессии
    const alreadyGreeted = storage.sessionGet('greeted');
    
    if (!alreadyGreeted) {
        // Определяем время суток и выбираем приветствие
        const timeOfDay = getGreetingByHour();  // 'morning', 'afternoon' или 'evening'
        const greetingText = GREETINGS[timeOfDay];
        
        alert(greetingText);  // Показываем всплывающее сообщение
        
        // Запоминаем, что уже показали
        storage.sessionSet('greeted', true);
    }
}

// ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ
function setupScrollAnimations() {
    // Находим все секции на странице
    const allSections = document.querySelectorAll('section');
    
    // Создаём наблюдатель, который следит за появлением секций
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Если секция появилась в окне браузера
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';           // Делаем видимой
                entry.target.style.transform = 'translateY(0)'; // Возвращаем на место
            }
        });
    }, { threshold: 0.1 });  // Срабатывает, когда видно 10% секции
    
    // Для каждой секции: прячем её и начинаем следить
    allSections.forEach(section => {
        section.style.opacity = '0';                // Сначала невидима
        section.style.transform = 'translateY(20px)'; // Сдвигаем вниз
        section.style.transition = 'all 0.5s ease';   // Плавный переход
        observer.observe(section);                   // Начинаем следить
    });
}

// ЗАПУСК ВСЕГО САЙТА
function init() {
    showGreeting();              // Показываем приветствие
    
    new ThemeToggle();          // Создаём кнопку переключения темы
    
    const currentPage = getCurrentPage();  // Определяем, какая страница открыта
    currentPage.render();       // Рисуем эту страницу
    
    setupScrollAnimations();    // Настраиваем плавное появление секций
}

// Ждём, пока страница полностью загрузится, потом запускаем
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();  // Если страница уже загружена - запускаем сразу
}