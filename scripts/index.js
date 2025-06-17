function loadProducts(filters = {}) {
    $.ajax({
                url: '/products',
                method: 'GET',
                data: filters,
                dataType: 'json',
                success: function(products) {
                        const $productsList = $('#productsList');
                        $productsList.empty();

                        if (products.length === 0) {
                            $productsList.html('<p>Товары не найдены.</p>');
                            return;
                        }

                        products.forEach(product => {
                                    const productHtml = `
                    <div class="product-card" onclick="window.location.href='/pages/product.html?id=${product.id}'">
                        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                        <h3>${product.name}</h3>
                        <p class="price">${product.price} грн.</p>
                        <p>${product.description || ''}</p>
                    </div>
                `;
                $productsList.append(productHtml);
            });
        },
        error: function () {
            $('#productsList').html('<p>Ошибка загрузки товаров.</p>');
        }
    });
}

$(function () {
    const $filters = $('#filtersPanel');
    const $toggle = $('#toggleFilters');
    const $overlay = $('#overlay');

    function openFilters() {
        $filters.addClass('open').removeClass('closed');
        $overlay.addClass('show');
        $toggle.html('&#x25C0;'); // стрелка влево
    }

    function closeFilters() {
        $filters.removeClass('open').addClass('closed');
        $overlay.removeClass('show');
        $toggle.html('&#x25B6;'); // стрелка вправо
    }

    // Кнопка открытия/закрытия на мобилках
    $toggle.on('click', () => {
        if ($filters.hasClass('open')) {
            closeFilters();
        } else {
            openFilters();
        }
    });

    // Клик по оверлею закрывает фильтры
    $overlay.on('click', closeFilters);

    // Применение фильтров
    $('#applyFilters').on('click', () => {
        loadProducts({
            category: $('#categoryFilter').val().trim(),
            maxPrice: $('#priceFilter').val().trim(),
            minScreen: $('#screenFilter').val().trim()
        });

        if ($(window).width() <= 768) closeFilters();
    });

    // Выдвижение фильтров при наведении (десктоп)
    $filters.on('mouseenter', () => {
        if ($(window).width() > 768) {
            openFilters();
        }
    });

    $filters.on('mouseleave', () => {
        if ($(window).width() > 768) {
            closeFilters();
        }
    });

    // Адаптация при ресайзе
    function handleResize() {
        if ($(window).width() <= 768) {
            $toggle.show();
            closeFilters();
            $('#productsList').css('margin-left', '0');
        } else {
            $toggle.hide();
            $filters.removeClass('open closed');
            $overlay.removeClass('show');
            $('#productsList').css('margin-left', '270px');
        }
    }

    $(window).on('resize', handleResize);
    handleResize();

    loadProducts();
});