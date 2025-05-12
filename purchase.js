document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const productsGrid = document.getElementById('products-grid');
    const cartModal = document.getElementById('cart-modal');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // 加载商品列表
    async function loadProducts() {
        try {
            console.log('开始加载商品列表...');
            const response = await fetch('http://localhost:3002/admin/products');
            console.log('收到响应:', response.status);
            const data = await response.json();
            console.log('商品数据:', data);
            
            if (data.success) {
                productsGrid.innerHTML = '';
                if (data.products && data.products.length > 0) {
                    console.log('找到商品数量:', data.products.length);
                    data.products.forEach(product => {
                        console.log('处理商品:', product);
                        if (product.stock > 0) {
                            const productCard = createProductCard(product);
                            productsGrid.appendChild(productCard);
                        }
                    });
                } else {
                    console.log('没有找到商品');
                    productsGrid.innerHTML = '<p class="no-products">暂无商品</p>';
                }
            } else {
                console.error('加载商品失败:', data.message);
                productsGrid.innerHTML = '<p class="error-message">加载商品失败</p>';
            }
        } catch (error) {
            console.error('加载商品列表错误:', error);
            productsGrid.innerHTML = '<p class="error-message">加载商品失败，请检查网络连接</p>';
        }
    }

    // 创建商品卡片
    function createProductCard(product) {
        console.log('创建商品卡片:', product);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='placeholder.jpg'">
            <h3>${product.name}</h3>
            <p class="price">￥${product.price}</p>
            <p class="stock">库存: ${product.stock}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">加入购物车</button>
        `;

        // 添加购物车按钮事件
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => addToCart(product));

        return card;
    }

    // 添加到购物车
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert('库存不足！');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                stock: product.stock
            });
        }
        updateCartUI();
    }

    // 更新购物车UI
    function updateCartUI() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        
        cartItems.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>￥${item.price}</span>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})">删除</button>
            `;
            cartItems.appendChild(itemElement);
            
            total += item.price * item.quantity;
            count += item.quantity;
        });

        cartCount.textContent = count;
        cartTotalAmount.textContent = total.toFixed(2);
    }

    // 更新商品数量
    window.updateQuantity = function(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0 && newQuantity <= item.stock) {
                item.quantity = newQuantity;
                updateCartUI();
            } else if (newQuantity <= 0) {
                removeFromCart(id);
            } else {
                alert('库存不足！');
            }
        }
    };

    // 从购物车移除商品
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    // 结算
    async function checkout() {
        if (cart.length === 0) {
            alert('购物车为空！');
            return;
        }

        try {
            for (const item of cart) {
                const response = await fetch(`http://localhost:3002/admin/products/${item.id}/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: item.quantity })
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
            }

            alert('购买成功！');
            cart = [];
            updateCartUI();
            loadProducts();
            cartModal.style.display = 'none';
        } catch (error) {
            console.error('结算错误:', error);
            alert('结算失败：' + error.message);
        }
    }

    // 事件监听器
    viewCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    checkoutBtn.addEventListener('click', checkout);

    // 初始加载商品
    loadProducts();
});