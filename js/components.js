// ========== КОМПОНЕНТЫ ==========
import { getAllTechnologies, filterProjects, debounce } from './utils.js';
import { PROJECTS } from './data.js';

// Компонент: Панель фильтров
export class FilterBar {
    constructor(containerId, projects, onFilterChange) {
        this.container = document.getElementById(containerId);
        this.projects = projects;
        this.onFilterChange = onFilterChange;
        this.filters = { search: '', tech: [], category: 'all' };
        this.technologies = getAllTechnologies(projects);
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="filter-bar" style="margin-bottom: 20px;">
                <input type="text" id="search-input" placeholder="🔍 Поиск проектов..." 
                       style="width: 100%; padding: 10px; margin-bottom: 10px;">
                
                <select id="category-select" style="width: 100%; padding: 10px; margin-bottom: 10px;">
                    <option value="all">Все категории</option>
                    <option value="web">Веб-разработка</option>
                    <option value="desktop">Десктоп</option>
                </select>
                
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${this.technologies.map(tech => `
                        <label style="display: flex; align-items: center; gap: 5px;">
                            <input type="checkbox" value="${tech}">
                            <span>${tech}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-select');
        const techCheckboxes = document.querySelectorAll('#filter-bar input[type="checkbox"]');
        
        const handleFilterChange = debounce(() => {
            const selectedTech = Array.from(techCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            this.filters = {
                search: searchInput?.value || '',
                tech: selectedTech,
                category: categorySelect?.value || 'all'
            };
            
            const filtered = filterProjects(this.projects, this.filters);
            this.onFilterChange(filtered);
        }, 300);
        
        searchInput?.addEventListener('input', handleFilterChange);
        categorySelect?.addEventListener('change', handleFilterChange);
        techCheckboxes.forEach(cb => {
            cb.addEventListener('change', handleFilterChange);
        });
    }
}

// Компонент: Карточки проектов
export class ProjectCards {
    constructor(containerId, projects) {
        this.container = document.getElementById(containerId);
        this.projects = projects;
    }
    
    render() {
        if (!this.container) return;
        
        // Используем map для рендеринга
        const cardsHTML = this.projects.map(project => `
            <div class="card">
                <img src="${project.image}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="card-links">
                    <a href="${project.demo}">Посмотреть проект</a>
                    <a href="${project.github}">GitHub</a>
                </div>
            </div>
        `).join('');
        
        this.container.innerHTML = cardsHTML;
    }
    
    updateProjects(projects) {
        this.projects = projects;
        this.render();
    }
}

// Компонент: Модальное окно
export class Modal {
    constructor() {
        this.createModal();
    }
    
    createModal() {
        if (document.getElementById('global-modal')) return;
        
        const modalHTML = `
            <div id="global-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <p id="modal-message">✅ Спасибо за отправку!</p>
                    <button id="modal-close-btn">Закрыть</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.modal = document.getElementById('global-modal');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const closeBtn = document.getElementById('modal-close-btn');
        closeBtn?.addEventListener('click', () => this.close());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }
    
    open(message = '✅ Спасибо за отправку!') {
        const messageEl = document.getElementById('modal-message');
        if (messageEl) messageEl.textContent = message;
        if (this.modal) this.modal.style.display = 'flex';
        
        setTimeout(() => this.close(), 3000);
    }
    
    close() {
        if (this.modal) this.modal.style.display = 'none';
    }
}

// Компонент: Переключатель темы
export class ThemeToggle {
    constructor() {
        this.createButton();
        this.loadTheme();
    }
    
    createButton() {
        if (document.querySelector('.theme-toggle')) return;
        
        this.button = document.createElement('button');
        this.button.className = 'theme-toggle';
        this.button.setAttribute('aria-label', 'Переключить тему');
        document.body.appendChild(this.button);
        this.button.addEventListener('click', () => this.toggle());
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        
        if (isDark) {
            document.body.classList.add('dark-theme');
            this.button.innerHTML = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            this.button.innerHTML = '🌙';
        }
    }
    
    toggle() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.button.innerHTML = isDark ? '☀️' : '🌙';
    }
}