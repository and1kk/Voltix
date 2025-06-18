function loadHeader() {
    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = `
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

    nav a img {
        width: 20px;
        height: 20px;
        filter: brightness(0) invert(1);
    }

    nav a:hover {
        background: #0057ff;
        color: #e0eaff;
        box-shadow: inset 0 0 6px #0057ff;
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

    // Создаём HTML хедера
    const header = document.createElement('header');
    header.className = 'main-header';

    header.innerHTML = `
      <div class="logo">
        <canvas id="logoCanvas" width="160" height="50"></canvas>
      </div>
      <div class="burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav id="navMenu">
        <a href="/pages/index.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" />Home</a>
        <a href="/pages/about.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" />About Us</a>
        <a href="/pages/contact.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/contacts.png" />Contact</a>
        <a href="/pages/news.html"><img src="https://img.icons8.com/ios-filled/50/ffffff/partly-cloudy-day.png" />Electronik news</a>
      </nav>
    `;

    // Поиск — только на главной
    const path = window.location.pathname;
    if (path.endsWith('/index.html') || path === '/' || path === '/pages/') {
        const form = document.createElement('form');
        form.id = 'searchForm';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'searchInput';
        input.placeholder = 'Поиск товаров...';

        form.appendChild(input);
        header.appendChild(form);
    }

    // Вставляем header и отступ для фиксированной шапки
    document.body.prepend(header);
    document.body.style.paddingTop = '120px';

    // Инициализируем логотип
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#00aaff';
    ctx.textBaseline = 'middle';
    ctx.fillText('Voltix', 10, canvas.height / 2);

    // Адаптивное бургер-меню
    const burger = document.getElementById('burger');
    const nav = document.getElementById('navMenu');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);