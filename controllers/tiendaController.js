const crearProducto = (producto) => {
    const article = document.createElement('article');
    article.className = 'product-card';

    const imagen = producto.imagen
        ? `<img class="product-image" src="${producto.imagen}" alt="${producto.nombre}">`
        : '<div class="product-image" aria-hidden="true">🏊</div>';

    article.innerHTML = `
        ${imagen}
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="product-price">${producto.precio}</p>
        <button class="button button-primary" type="button" data-producto="${producto.id}">Comprar</button>
    `;

    return article;
};

window.iniciarTienda = () => {
    const catalogo = document.querySelector('[data-catalogo]');
    if (!catalogo) return;

    productos.forEach((producto) => catalogo.appendChild(crearProducto(producto)));

    catalogo.addEventListener('click', (event) => {
        const button = event.target.closest('[data-producto]');
        if (!button) return;
        const producto = productos.find(({ id }) => id === button.dataset.producto);
        window.alert(`${producto.nombre} agregado a tu selección.`);
    });
};
