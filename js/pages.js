// ========== PAGE OBJECTS ==========
import { PROJECTS, SKILLS, ACHIEVEMENTS, CONTACT_INFO, WORKING_HOURS, USEFUL_LINKS, GREETINGS } from './data.js';
import { getGreetingByHour, getAverageSkillLevel, storage, validateForm } from './utils.js';
import { FilterBar, ProjectCards, Modal } from './components.js';

// Базовый класс для всех страниц
class BasePage {
    render() {
        throw new Error('Метод render должен быть реализован');
    }
}

// Главная страница
export class HomePage extends BasePage {
    render() {
        this.renderHero();
        this.renderPhoto();
        this.renderPreviews();
        this.renderLinks();
        this.initProjects();
    }
    
    renderHero() {
        const container = document.getElementById('hero-content');
        if (container) {
            container.innerHTML = `
                <p><strong>Привет.</strong> Это мой сайт. Это мой персональный сайт.</p>
                <p>Я изучаю программирование и развиваюсь в IT.</p>
            `;
        }
    }
    
    renderPhoto() {
        const container = document.getElementById('photo-section');
        if (container) {
            container.innerHTML = `
                <figure class="photo-figure">
                    <img src="static/images/image [VQ6mzO].png" alt="Мое фото" class="profile-img">
                    <figcaption>Это я во время работы над сайтом</figcaption>
                </figure>
            `;
        }
    }
    
    renderPreviews() {
        const skillsContainer = document.getElementById('skills-preview');
        if (skillsContainer) {
            skillsContainer.innerHTML = `
                <a href="ISD1.html" class="section-link"><h2>Скиллы →</h2></a>
                <div><p>Я умею: разрабатывать веб-сайты, программировать на C#, работать с базами данных</p></div>
            `;
        }
        
        const aboutContainer = document.getElementById('about-preview');
        if (aboutContainer) {
            aboutContainer.innerHTML = `
                <a href="ISD2.html" class="section-link"><h2>Обо мне →</h2></a>
                <div><p>Я хочу: стать профессиональным разработчиком, создавать полезные проекты, постоянно учиться</p></div>
            `;
        }
    }
    
    renderLinks() {
        const container = document.getElementById('links-container');
        if (container) {
            container.innerHTML = USEFUL_LINKS.map(link => `
                <a href="${link.url}" target="_blank" class="external-link">${link.icon} ${link.title}</a>
            `).join('');
        }
    }
    
    initProjects() {
        this.projectCards = new ProjectCards('projects-container', PROJECTS);
        this.projectCards.render();
        
        this.filterBar = new FilterBar('filter-bar', PROJECTS, (filtered) => {
            this.projectCards.updateProjects(filtered);
        });
        this.filterBar.render();
    }
}

// Страница навыков
export class SkillsPage extends BasePage {
    render() {
        this.renderSkillsIntro();
        this.renderSkillsTable();
        this.renderCalculator();
        this.renderCurrencyConverter();
        this.renderVisitsCounter();
        this.renderAchievements();
    }
    
    renderSkillsIntro() {
        const container = document.getElementById('skills-intro');
        if (container) {
            const avgLevel = getAverageSkillLevel(SKILLS);
            container.innerHTML = `
                <img src="static/images/Heh.jpg" alt="Навыки" class="skills-img">
                <p>Я умею жить и учиться новому. Постоянно развиваюсь и осваиваю современные технологии.</p>
                <p><strong>Средний уровень навыков: ${avgLevel} / 5</strong></p>
            `;
        }
    }
    
    renderSkillsTable() {
        const container = document.getElementById('skills-table');
        if (container) {
            container.innerHTML = `
                <div class="table-wrapper">
                    <table>
                        <thead><tr><th>Навык</th><th>Уровень</th><th>Годы опыта</th></tr></thead>
                        <tbody>
                            ${SKILLS.map(skill => `
                                <tr>
                                    <td>${skill.name}</td>
                                    <td>${'★'.repeat(skill.level)}${'☆'.repeat(skill.maxLevel - skill.level)}</td>
                                    <td>${skill.years}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    renderCalculator() {
        const container = document.getElementById('calculator');
        if (container) {
            container.innerHTML = `
                <div class="calc-container">
                    <div class="calc-inputs">
                        <input type="number" id="calc-a" placeholder="Число A">
                        <select id="calc-op">
                            <option value="+">+ Сложение</option>
                            <option value="-">- Вычитание</option>
                            <option value="*">* Умножение</option>
                            <option value="/">/ Деление</option>
                        </select>
                        <input type="number" id="calc-b" placeholder="Число B">
                    </div>
                    <button id="calc-btn">Вычислить</button>
                    <p id="calc-result" class="result-display"></p>
                </div>
            `;
            
            document.getElementById('calc-btn')?.addEventListener('click', () => {
                const a = parseFloat(document.getElementById('calc-a')?.value);
                const b = parseFloat(document.getElementById('calc-b')?.value);
                const op = document.getElementById('calc-op')?.value;
                const resultEl = document.getElementById('calc-result');
                
                if (isNaN(a) || isNaN(b)) {
                    resultEl.innerText = '❌ Введите оба числа';
                    return;
                }
                
                let result;
                switch(op) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': 
                        if (b === 0) { resultEl.innerText = '❌ Деление на ноль'; return; }
                        result = a / b; break;
                    default: result = a + b;
                }
                resultEl.innerText = `✅ Результат: ${result}`;
            });
        }
    }
    
    renderCurrencyConverter() {
        const container = document.getElementById('currency-converter');
        if (container) {
            container.innerHTML = `
                <div class="currency-container">
                    <input type="number" id="curr-amount" placeholder="Сумма">
                    <div class="currency-selects">
                        <select id="curr-from">
                            <option value="RUB">RUB</option><option value="USD">USD</option><option value="EUR">EUR</option>
                        </select>
                        <span>→</span>
                        <select id="curr-to">
                            <option value="USD">USD</option><option value="EUR">EUR</option><option value="RUB">RUB</option>
                        </select>
                    </div>
                    <button id="curr-btn">Конвертировать</button>
                    <p id="curr-result" class="result-display"></p>
                </div>
            `;
            
            const rates = { RUB: 1, USD: 94.5, EUR: 102.3 };
            document.getElementById('curr-btn')?.addEventListener('click', () => {
                const amount = parseFloat(document.getElementById('curr-amount')?.value);
                const from = document.getElementById('curr-from')?.value;
                const to = document.getElementById('curr-to')?.value;
                const resultEl = document.getElementById('curr-result');
                
                if (isNaN(amount) || amount <= 0) {
                    resultEl.innerText = '❌ Введите сумму';
                    return;
                }
                const result = (amount * rates[from]) / rates[to];
                resultEl.innerText = `💱 ${amount} ${from} = ${result.toFixed(2)} ${to}`;
            });
        }
    }
    
    renderVisitsCounter() {
        const container = document.getElementById('visits-counter');
        if (container) {
            if (!storage.sessionGet('visit')) {
                let visits = storage.get('visits', 0);
                storage.set('visits', ++visits);
                storage.sessionSet('visit', true);
            }
            const visits = storage.get('visits', 0);
            
            container.innerHTML = `
                <div><p>Вы посетили страницу <span id="visits-count">${visits}</span> раз</p>
                <button id="reset-visits" class="reset-btn">Сбросить</button></div>
            `;
            
            document.getElementById('reset-visits')?.addEventListener('click', () => {
                if (confirm('Сбросить счётчик?')) {
                    storage.set('visits', 0);
                    storage.sessionSet('visit', false);
                    document.getElementById('visits-count').textContent = '0';
                }
            });
        }
    }
}

// Страница "Обо мне"
export class AboutPage extends BasePage {
    render() {
        this.renderContent();
        this.renderAchievements();
        this.renderDownload();
    }
    
    renderContent() {
        const container = document.getElementById('about-content');
        if (container) {
            container.innerHTML = `
                <p>Я студент. И я <strong>изучаю программирование</strong>.</p>
                <p>Мне нравится изучать веб-технологии и писать код.</p>
                <p>Сейчас я активно учу <em>HTML, CSS и C#</em>.</p>
                <div class="quote-block">
                    <blockquote>"Код сам себя не напишет. Садись и делай."</blockquote>
                </div>
            `;
        }
    }
    
    renderAchievements() {
        const container = document.getElementById('about-achievements');
        if (container) {
            container.innerHTML = `
                <div class="achievements">
                    ${ACHIEVEMENTS.map(ach => `
                        <div class="achievement-card">
                            <span class="achieve-num">${ach.number}</span>
                            <p>${ach.label}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    renderDownload() {
        const container = document.getElementById('resume-download');
        if (container) {
            container.innerHTML = `<a href="static/images/Kiwi.jpg" download class="download-btn">📄 Скачать резюме</a>`;
        }
    }
}

// Страница контактов
export class ContactsPage extends BasePage {
    constructor() {
        super();
        this.modal = new Modal();
    }
    
    render() {
        this.renderContactInfo();
        this.renderWorkingHours();
        this.renderForm();
    }
    
    renderContactInfo() {
        const container = document.getElementById('contact-info');
        if (container) {
            container.innerHTML = `
                <ul class="contacts-list">
                    ${CONTACT_INFO.map(c => `<li>${c.icon} ${c.label}: ${c.value}</li>`).join('')}
                </ul>
            `;
        }
    }
    
    renderWorkingHours() {
        const container = document.getElementById('working-hours');
        if (container) {
            container.innerHTML = `
                <div class="table-wrapper">
                    <table>
                        <thead><tr><th>День</th><th>Часы</th></tr></thead>
                        <tbody>
                            ${WORKING_HOURS.map(h => `<tr><td>${h.day}</td><td>${h.hours}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    
    renderForm() {
        const container = document.getElementById('contact-form');
        if (container) {
            container.innerHTML = `
                <form id="contactForm">
                    <div class="form-group"><label>ФИО</label><input type="text" id="fio" placeholder="Иванов Иван Иванович"></div>
                    <div class="form-group"><label>Телефон</label><input type="tel" id="phone" placeholder="+7 900 123-45-67"></div>
                    <div class="form-group"><label>Дата</label><input type="date" id="date"></div>
                    <div class="form-group"><label>Фото</label><input type="file" id="photo" accept="image/*"><img id="preview" width="100" style="margin-top:10px"></div>
                    <button type="submit">Отправить</button>
                </form>
            `;
            this.setupForm();
            this.setupPhotoPreview();
        }
    }
    
    setupForm() {
        const form = document.getElementById('contactForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                fio: document.getElementById('fio')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                date: document.getElementById('date')?.value || ''
            };
            
            const validation = validateForm(formData);
            if (!validation.valid) {
                alert('❌ Ошибки:\n' + validation.errors.join('\n'));
                return;
            }
            
            this.modal.open();
            form.reset();
            const preview = document.getElementById('preview');
            if (preview) preview.src = '';
        });
    }
    
    setupPhotoPreview() {
        const photoInput = document.getElementById('photo');
        photoInput?.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.getElementById('preview');
                    if (preview) preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}