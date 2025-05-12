document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    
    // 登录功能
    if (loginBtn && loginForm) {
        loginBtn.addEventListener('click', async function() {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }
            
            try {
                loginBtn.disabled = true;
                loginBtn.textContent = '登录中...';
                
                const response = await fetch('http://localhost:3002/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('admin-panel').style.display = 'block';
                    document.querySelector('.Blogin-modal').style.display = 'none';
                    localStorage.setItem('admin_username', data.username);
                    alert(`欢迎回来，${data.username}!`);
                    // 登录成功后加载商品列表
                    loadProducts();
                } else {
                    alert(data.message || '登录失败，请重试');
                }
            } catch (error) {
                console.error('登录请求错误:', error);
                alert('网络错误，请检查服务器连接');
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = '登录';
            }
        });
    }

    // 显示/隐藏添加商品表单
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const form = document.getElementById('add-product-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 处理商品表单提交
    if (productForm) {
        productForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const price = document.getElementById('product-price').value;
            const stock = document.getElementById('product-stock').value;
            const imageFile = document.getElementById('product-image').files[0];

            if (!name || !price || !stock || !imageFile) {
                alert('请填写所有必填字段并选择商品图片');
                return;
            }

            console.log('准备上传文件:', {
                name: imageFile.name,
                type: imageFile.type,
                size: imageFile.size
            });

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stock', stock);
            formData.append('image', imageFile);

            try {
                console.log('开始发送请求...');
                const response = await fetch('http://localhost:3002/admin/products', {
                    method: 'POST',
                    body: formData
                });

                console.log('收到响应:', response.status);
                const data = await response.json();
                console.log('响应数据:', data);
                
                if (data.success) {
                    alert('商品添加成功！');
                    document.getElementById('add-product-form').style.display = 'none';
                    loadProducts();
                    productForm.reset();
                } else {
                    alert(data.message || '添加商品失败');
                }
            } catch (error) {
                console.error('添加商品错误:', error);
                alert('网络错误，请重试。错误详情：' + error.message);
            }
        });
    }
});

// 加载商品列表
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3002/admin/products');
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('products-tbody');
            tbody.innerHTML = '';
            
            data.products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.name}</td>
                    <td>￥${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${product.sales}</td>
                    <td>
                        <button onclick="editProduct(${product.id})" class="btn-secondary">编辑</button>
                        <button onclick="deleteProduct(${product.id})" class="btn-danger">删除</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载商品列表错误:', error);
        alert('加载商品列表失败');
    }
}

// 删除商品
async function deleteProduct(id) {
    if (!confirm('确定要删除这个商品吗？')) return;
    
    try {
        const response = await fetch(`http://localhost:3002/admin/products/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('商品删除成功！');
            loadProducts();
        } else {
            alert(data.message || '删除商品失败');
        }
    } catch (error) {
        console.error('删除商品错误:', error);
        alert('网络错误，请重试');
    }
}

// 编辑商品
async function editProduct(id) {
    try {
        const response = await fetch(`http://localhost:3002/admin/products/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const product = data.product;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            
            const form = document.getElementById('add-product-form');
            form.style.display = 'block';
            
            // 更新表单提交处理
            const productForm = document.getElementById('product-form');
            productForm.onsubmit = async (e) => {
                e.preventDefault();
                
                const formData = new FormData();
                formData.append('name', document.getElementById('product-name').value);
                formData.append('price', document.getElementById('product-price').value);
                formData.append('stock', document.getElementById('product-stock').value);
                
                const imageFile = document.getElementById('product-image').files[0];
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                try {
                    const updateResponse = await fetch(`http://localhost:3002/admin/products/${id}`, {
                        method: 'PUT',
                        body: formData
                    });

                    const updateData = await updateResponse.json();
                    
                    if (updateData.success) {
                        alert('商品更新成功！');
                        form.style.display = 'none';
                        loadProducts();
                        productForm.reset();
                        productForm.onsubmit = null; // 重置表单提交处理
                    } else {
                        alert(updateData.message || '更新商品失败');
                    }
                } catch (error) {
                    console.error('更新商品错误:', error);
                    alert('网络错误，请重试');
                }
            };
        }
    } catch (error) {
        console.error('获取商品详情错误:', error);
        alert('获取商品详情失败');
    }
}