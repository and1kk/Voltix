async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) return;

    const res = await fetch(`/products/${id}`);
    if (!res.ok) return; // обработка ошибки

    const product = await res.json();

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productImage').src = product.image || 'https://via.placeholder.com/600x400?text=No+Image';
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productDescription').textContent = product.description;

    const resChar = await fetch(`/products/${id}/characteristics`);
    if (!resChar.ok) return;

    const characteristics = await resChar.json();

    const tbody = document.querySelector('#characteristicsTable tbody');
    tbody.innerHTML = ''; // очистить перед вставкой

    characteristics.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${c.name}</td><td>${c.value}</td>`;
        tbody.appendChild(tr);
    });
}

loadProductDetails();