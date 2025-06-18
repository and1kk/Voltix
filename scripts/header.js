function loadHeader() {
    const style = document.createElement('style');
    style.textContent = `
    body {
        transition: background-color 0.3s ease, color 0.3s ease;
        background-color: #1e1e1e;
        color: #eee;
    }

    .light-theme {
        background-color: #f5f5f5;
        color: #111;
    }

    .main-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 15px 20px;
        background: linear-gradient(90deg, #222, #333);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        transition: background 0.3s ease;
    }

    .light-theme .main-header {
        background: linear-gradient(90deg, #f0f0f0, #e0e0e0);
    }

    .logo canvas {
        width: 160px;
        height: 50px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .logo canvas:hover {
        transform: scale(1.05) rotate(-3deg);
        filter: drop-shadow(0 4px 10px rgba(0, 120, 255, 0.7));
    }

    nav {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
    }

    nav a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 12px;
        background: #2a2a2a;
        color: #ccc;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
        box-shadow: inset 0 0 0 2px transparent;
    }

    .light-theme nav a {
        background: #ddd;
        color: #111;
    }

    nav a img {
        width: 20px;
        height: 20px;
        filter: brightness(0) invert(1);
    }

    .light-theme nav a img {
        filter: none;
    }

    nav a:hover {
        background: #0057ff;
        color: #e0eaff;
        box-shadow: inset 0 0 6px #0057ff;
    }

    .light-theme nav a:hover {
        background: #0057ff;
        color: #fff;
    }

    #searchForm {
        margin-top: 10px;
    }

    #searchInput {
        padding: 8px 14px;
        font-size: 1rem;
        border-radius: 12px;
        border: none;
        outline: none;
        width: 220px;
        background-color: #2a2a2a;
        color: #eee;
        transition: box-shadow 0.3s ease;
    }

    .light-theme #searchInput {
        background-color: #fff;
        color: #000;
    }

    #searchInput:focus {
        box-shadow: 0 0 10px #0057ff;
    }

    .burger {
        display: none;
        flex-direction: column;
        gap: 4px;
        cursor: pointer;
        margin-left: auto;
    }

    .burger span {
        width: 25px;
        height: 3px;
        background: #ccc;
        border-radius: 2px;
    }

    .theme-toggle {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #fff;
        margin-left: 15px;
        transition: transform 0.2s ease;
    }

    .theme-toggle:hover {
        transform: rotate(15deg) scale(1.1);
    }

    .light-theme .theme-toggle {
        color: #222;
    }

    #productsList {
        background-color: #2c2c2c;
        padding: 20px;
        border-radius: 12px;
        transition: background 0.3s ease;
    }

    .light-theme #productsList {
        background-color: #fff;
    }

    @media (max-width: 768px) {
        nav {
            display: none;
            flex-direction: column;
            width: 100%;
            margin-top: 10px;
        }

        nav.active {
            display: flex;
        }

        #searchForm {
            width: 100%;
            text-align: center;
        }

        #searchInput {
            width: 90%;
            max-width: 300px;
        }

        .burger {
            display: flex;
        }
    }
    `;
    document.head.appendChild(style);

    const header = document.createElement('header');
    header.className = 'main-header';

    header.innerHTML = `
      <div class="logo">
        <canvas id="logoCanvas" width="160" height="50"></canvas>
      </div>
      <div class="burger" id="burger" aria-label="Меню">
        <span></span><span></span><span></span>
      </div>
      <nav id="navMenu" role="navigation" aria-label="Главное меню">
        <a href="/pages/index.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" alt="Главная"/>Home</a>
        <a href="/pages/about.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" alt="О нас"/>About Us</a>
        <a href="/pages/contact.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/contacts.png" alt="Контакты"/>Contact</a>
        <a href="/pages/news.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/news.png" alt="Новости"/>News</a>
      </nav>
      <button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">🌙</button>
    `;

    // Добавляем поиск на главной странице
    const path = window.location.pathname;
    if (path.endsWith('/index.html') || path === '/' || path === '/pages/') {
        const form = document.createElement('form');
        form.id = 'searchForm';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'searchInput';
        input.placeholder = 'Поиск товаров...';
        input.setAttribute('aria-label', 'Поиск товаров');

        form.appendChild(input);
        header.appendChild(form);
    }

    document.body.prepend(header);
    document.body.style.paddingTop = '120px';

    // Рисуем логотип на canvas
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00aaff';
    ctx.textBaseline = 'middle';
    ctx.fillText('Voltix', 10, canvas.height / 2);

    // Логика бургера меню
    const burger = document.getElementById('burger');
    const nav = document.getElementById('navMenu');
    burger.addEventListener('click', () => nav.classList.toggle('active'));

    // Кнопка переключения темы
    const toggleBtn = document.getElementById('themeToggle');

    // Инициализация кнопки и темы из localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        toggleBtn.textContent = '🌞';
    }

    toggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        toggleBtn.textContent = isLight ? '🌞' : '🌙';
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);