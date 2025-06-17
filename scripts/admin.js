$(document).ready(function() {
    // Добавить поле характеристики
    $('#addCharacteristicBtn').click(function() {
        const charDiv = $(`
            <div class="characteristic">
                <input type="text" placeholder="Название" class="char-name" required />
                <input type="text" placeholder="Значение" class="char-value" required />
                <button type="button" class="remove-char">Удалить</button>
            </div>
        `);
        $('#charList').append(charDiv);
    });

    // Удалить характеристику
    $('#charList').on('click', '.remove-char', function() {
        $(this).parent().remove();
    });

    // Очистить форму
    $('#resetFormBtn').click(function() {
        resetForm();
    });

    // Сброс формы и очистка характеристик
    function resetForm() {
        $('#productId').val('');
        $('#productForm')[0].reset();
        $('#charList').find('.characteristic').remove();
    }

    // Загрузка всех товаров
    async function showAllProducts() {
        try {
            const products = await $.getJSON('/products');
            if (products.length === 0) {
                $('#productsList').html('<p>Товары не найдены.</p>');
                return;
            }
            let html = '';
            products.forEach(p => {
                html += `
                <div class="product" data-id="${p.id}">
                    <img src="${p.image || 'https://via.placeholder.com/150'}" width="100" />
                    <p><strong>ID: ${p.id} - ${p.name}</strong></p>
                    <p>Категория: ${p.category}</p>
                    <p>Цена: ${p.price} грн</p>
                    <p>${p.description}</p>
                    <button class="edit-btn" data-id="${p.id}">Редактировать</button>
                </div>
                `;
            });
            $('#productsList').html(html);
        } catch (e) {
            alert('Ошибка при загрузке товаров');
        }
    }

    // Удалить товар по ID
    $('#deleteByIdBtn').click(async function() {
        const id = $('#deleteId').val().trim();
        if (!id) return alert('Введите ID');
        try {
            await $.ajax({ url: `/products/${id}`, method: 'DELETE' });
            $('#deleteId').val('');
            showAllProducts();
        } catch {
            alert('Ошибка при удалении по ID');
        }
    });

    // Удалить товар по названию
    $('#deleteByNameBtn').click(async function() {
        const name = $('#deleteName').val().trim();
        if (!name) return alert('Введите название');
        try {
            await $.ajax({
                url: `/products/name/${encodeURIComponent(name)}`,
                method: 'DELETE'
            });
            $('#deleteName').val('');
            showAllProducts();
        } catch {
            alert('Ошибка при удалении по названию');
        }
    });

    // Показать все товары
    $('#showAllBtn').click(showAllProducts);

    // Редактировать товар: загрузка данных в форму
    $('#productsList').on('click', '.edit-btn', async function() {
        const id = $(this).data('id');
        try {
            const product = await $.getJSON(`/products/${id}`);

            $('#productId').val(product.id);
            $('#productName').val(product.name);
            $('#productCategory').val(product.category);
            $('#productPrice').val(product.price);
            $('#productImage').val(product.image);
            $('#productDescription').val(product.description);

            // Очистить характеристики и загрузить из товара
            $('#charList').find('.characteristic').remove();
            if (product.characteristics && product.characteristics.length) {
                product.characteristics.forEach(c => {
                    const charDiv = $(`
                        <div class="characteristic">
                            <input type="text" placeholder="Название" class="char-name" required value="${c.name}" />
                            <input type="text" placeholder="Значение" class="char-value" required value="${c.value}" />
                            <button type="button" class="remove-char">Удалить</button>
                        </div>
                    `);
                    $('#charList').append(charDiv);
                });
            }
        } catch {
            alert('Ошибка при загрузке товара');
        }
    });

    // Сохранение товара и характеристик (добавление и обновление)
    async function saveProductAndCharacteristics(id, product) {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/products/${id}` : '/products';

        // Сохраняем товар (без характеристик)
        const res = await $.ajax({
            url,
            method,
            contentType: 'application/json',
            data: JSON.stringify(product)
        });

        // Если новый товар, нужно получить id последнего добавленного
        let productId = id;
        if (!id) {
            const products = await $.getJSON('/products');
            productId = products.length ? products[products.length - 1].id : null;
        }

        // Удаляем старые характеристики (для обновления)
        if (id) {
            await $.ajax({
                url: `/products/${productId}/characteristics`,
                method: 'DELETE'
            });
        }

        // Собираем новые характеристики
        const characteristics = [];
        $('#charList .characteristic').each(function() {
            const name = $(this).find('.char-name').val().trim();
            const value = $(this).find('.char-value').val().trim();
            if (name && value) {
                characteristics.push({ name, value });
            }
        });

        if (characteristics.length > 0) {
            await $.ajax({
                url: `/products/${productId}/characteristics`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ characteristics })
            });
        }
    }

    // Обработка формы: добавление или обновление
    $('#productForm').submit(async function(e) {
        e.preventDefault();

        const id = $('#productId').val();
        const name = $('#productName').val().trim();
        const category = $('#productCategory').val().trim();
        const price = parseFloat($('#productPrice').val());
        const image = $('#productImage').val().trim() || 'https://via.placeholder.com/150';
        const description = $('#productDescription').val().trim();

        if (!name || !category || isNaN(price)) {
            return alert('Пожалуйста, заполните все обязательные поля корректно');
        }

        try {
            await saveProductAndCharacteristics(id, { name, category, price, image, description });
            alert('Товар успешно сохранён');
            resetForm();
            showAllProducts();
        } catch {
            alert('Ошибка при сохранении товара');
        }
    });

    // Инициализация
    showAllProducts();
});