document.addEventListener("DOMContentLoaded", () => {

    // 1. ANIMACIONES SCROLL REVEAL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.hidden-left, .hidden-right, .hidden-up').forEach((el) => observer.observe(el));

    // 2. SISTEMA DE LISTA DE COTIZACIÓN (PERSISTENTE EN LOCALSTORAGE)
    let quoteCart = JSON.parse(localStorage.getItem('torsuinca_quote_cart')) || [];

    const updateCartUI = () => {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(b => b.textContent = quoteCart.length);

        const listContainer = document.getElementById('quote-items-list');
        if (listContainer) {
            listContainer.innerHTML = '';
            if (quoteCart.length === 0) {
                listContainer.innerHTML = '<p style="font-size:13px; color:#888;">No has añadido productos a tu solicitud aún. Explora las líneas de producto y pulsa "Añadir a Cotización".</p>';
            } else {
                quoteCart.forEach((item, index) => {
                    const div = document.createElement('div');
                    div.className = 'quote-item';
                    div.innerHTML = `
                        <span><strong>• ${item}</strong></span>
                        <button onclick="removeFromQuote(${index})">Eliminar ✕</button>
                    `;
                    listContainer.appendChild(div);
                });
            }
        }

        // Si existe el área de texto de cotización en la página, pre-llenarla si viene por parámetro
        const urlParams = new URLSearchParams(window.location.search);
        const autoFill = urlParams.get('cotizar');
        const msgBox = document.getElementById('quote-message');
        if (msgBox && autoFill && quoteCart.length > 0) {
            msgBox.value = "Solicito cotización formal para los siguientes suministros:\n- " + quoteCart.join("\n- ") + "\n\nCantidades estimadas / Especificaciones adicionales: ";
        }
    };

    window.addToQuote = (productName) => {
        if (!quoteCart.includes(productName)) {
            quoteCart.push(productName);
            localStorage.setItem('torsuinca_quote_cart', JSON.stringify(quoteCart));
            updateCartUI();
        }
        const modal = document.getElementById('quote-modal-overlay');
        if (modal) modal.classList.add('open');
    };

    window.removeFromQuote = (index) => {
        quoteCart.splice(index, 1);
        localStorage.setItem('torsuinca_quote_cart', JSON.stringify(quoteCart));
        updateCartUI();
    };

    window.toggleQuoteModal = () => {
        const modal = document.getElementById('quote-modal-overlay');
        if (modal) modal.classList.toggle('open');
    };

    window.sendQuoteToWhatsApp = () => {
        const baseText = quoteCart.length > 0
            ? "Hola TORSUINCA, deseo solicitar cotización de los siguientes productos:%0A- " + quoteCart.join("%0A- ")
            : "Hola TORSUINCA, deseo solicitar asesoría técnica y una cotización industrial.";
        window.open(`https://wa.me/584145954058?text=${baseText}`, '_blank');
    };

    updateCartUI();

    // 3. FILTRO Y BUSCADOR EN VIVO DEL CATÁLOGO
    const searchInput = document.getElementById('catalog-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');

    const filterCatalog = () => {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeBtn = document.querySelector('.filter-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

        catalogItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            const textContent = item.textContent.toLowerCase();
            const matchesCategory = (category === 'all' || itemCat === category);
            const matchesSearch = textContent.includes(query);

            item.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', filterCatalog);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCatalog();
        });
    });

    // 4. CALCULADORA TÉCNICA DE TORQUE (PARA PERNOS INDUSTRIALES)
    const calcBtn = document.getElementById('calc-torque-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const grade = document.getElementById('bolt-grade').value;
            const size = document.getElementById('bolt-size').value;
            const condition = document.getElementById('bolt-lubrication').value;

            // Matriz referencial en Libras-Pie (Ft-Lbs) para pernos secos
            const torqueMatrix = {
                'A325': { '1/2': 90, '5/8': 180, '3/4': 320, '7/8': 500, '1': 750 },
                'G8':   { '1/2': 110, '5/8': 220, '3/4': 380, '7/8': 600, '1': 900 },
                'B7':   { '1/2': 85, '5/8': 170, '3/4': 300, '7/8': 480, '1': 720 },
                '316':  { '1/2': 45, '5/8': 90, '3/4': 150, '7/8': 240, '1': 360 }
            };

            let torqueFtLbs = torqueMatrix[grade][size];
            if (condition === 'lubricated') {
                torqueFtLbs = Math.round(torqueFtLbs * 0.75); // Reducción por factor K lubricado
            }
            const torqueNm = Math.round(torqueFtLbs * 1.3558);

            document.getElementById('torque-output').innerHTML = `${torqueFtLbs} ft-lbs <small style="font-size:14px; color:#555;">(${torqueNm} Nm)</small>`;
        });
    }

    // 5. FORMULARIO DE COTIZACIÓN GENERAL
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Solicitud registrada con éxito! El departamento de ventas técnicas de TORSUINCA en Maracaibo procesará su requerimiento a la brevedad.');
            this.reset();
        });
    }
});