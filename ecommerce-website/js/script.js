let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || null;

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = cart.length;
}

function updateLoginUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        if (loginBtn) loginBtn.classList.add('d-none');
        if (logoutBtn) logoutBtn.classList.remove('d-none');
    } else {
        if (loginBtn) loginBtn.classList.remove('d-none');
        if (logoutBtn) logoutBtn.classList.add('d-none');
    }
}

function logout() {
    currentUser = null;
    currentAdmin = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    updateLoginUI();
    window.location.href = 'index.html';
}

function displayProducts(productsToShow = products) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = productsToShow.slice(0, 12).map(product => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="product-badge">⭐ ${product.rating}</span>
                </div>
                <div class="product-body">
                    <div class="product-category">${product.category.toUpperCase()}</div>
                    <h6 class="product-title">${product.name}</h6>
                    <div class="product-rating">
                        ${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})
                    </div>
                    <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                    <div class="product-stock">
                        ${product.stock > 20 ? '✓ In Stock' : product.stock > 0 ? '⚠ Limited Stock' : '✗ Out of Stock'}
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert(`${product.name} added to cart!`);
    } else {
        alert('Product out of stock!');
    }
}

function filterByCategory(category) {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
}

function displayCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">Your cart is empty</p>';
        return;
    }
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h6>${item.name}</h6>
                <p class="text-muted">$${item.price}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    displayCart();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) totalElement.textContent = total.toFixed(2);
}

function searchProducts(query) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filtered);
}

updateCartBadge();
updateLoginUI();
displayProducts();
