document.addEventListener('DOMContentLoaded', function() {
    // Account system variables
    let currentUser = null;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let ordersHistory = JSON.parse(localStorage.getItem('ordersHistory')) || [];

    // Initialize with a default admin account
    if (users.length === 0) {
        users.push({
            name: "Admin",
            email: "adminwellysfoodhub@gmail.com",
            password: "admin123",
            role: "admin"
        });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // DOM Elements
    const accountModal = document.getElementById('account-modal');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const accountTabs = document.querySelectorAll('.account-tab');
    const accountForms = document.querySelectorAll('.account-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Account modal functionality
    loginBtn.addEventListener('click', () => {
        accountModal.style.display = 'block';
    });

    // Close modal when clicking outside
    accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.style.display = 'none';
        }
    });

    // Tab switching
    accountTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            accountTabs.forEach(t => t.classList.remove('active'));
            accountForms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;

        const user = users.find(u => u.email === email && u.password === password && u.role === role);

        if (user) {
            currentUser = user;
            updateUIForUser();
            accountModal.style.display = 'none';
            showNotification(`Welcome back, ${user.name}!`);
        } else {
            alert('Invalid email, password, or role');
        }
    });

    // Registration form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const role = document.getElementById('register-role').value;

        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        const newUser = { name, email, password, role };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please login.');
        document.querySelector('.account-tab[data-tab="login"]').click();
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateUIForUser();
        showNotification('Logged out successfully');
    });

    // Update UI based on user login status
    function updateUIForUser() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            userNameSpan.textContent = currentUser.name;

            // Show admin features if admin
            if (currentUser.role === 'admin') {
                // Add admin navigation link if not already present
                if (!document.querySelector('.nav-link[data-section="admin-section"]')) {
                    const adminLink = document.createElement('li');
                    adminLink.innerHTML = '<a href="#" class="nav-link" data-section="admin-section">Admin</a>';
                    document.querySelector('nav ul').appendChild(adminLink);

                    // Add event listener for the new admin link
                    adminLink.querySelector('a').addEventListener('click', function(e) {
                        e.preventDefault();
                        showSection('admin-section');
                    });
                }
            } else {
                // Remove admin link if present and not admin
                const adminLink = document.querySelector('.nav-link[data-section="admin-section"]');
                if (adminLink) {
                    adminLink.parentElement.remove();
                }
            }
        } else {
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            // Remove admin link if present
            const adminLink = document.querySelector('.nav-link[data-section="admin-section"]');
            if (adminLink) {
                adminLink.parentElement.remove();
            }
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Initialize
    updateUIForUser();

    // Rest of your existing code...
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const orderIcon = document.getElementById('order-icon');
    const orderNowButton = document.getElementById('order-now');
    const productGrid = document.getElementById('product-grid');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const checkoutButton = document.getElementById('checkout');
    const checkoutPage = document.getElementById('checkout-page');
    const checkoutForm = document.getElementById('checkout-form');
    const contactForm = document.getElementById('contact-form');

    let orderItemCount = 0;
    let order = [];
    let total = 0;

    // Sample food items with categories
    const products = [
        { id: 1, name: 'Cornsilog', price: 55, image: 'pic2.jpg', description: 'Cornbeef with rice and egg', category: 'main-dishes' },
        { id: 2, name: 'Tocilog', price: 90, image: 'pic3.jpg', description: 'Tocino with rice and egg', category: 'main-dishes' },
        { id: 3, name: 'Bangsilog', price: 65, image: 'pic4.jpg', description: 'Bangus with rice and egg', category: 'main-dishes' },
        { id: 4, name: 'Chicksilog', price: 75, image: 'pic5.jpg', description: 'Fried chicken with rice and egg', category: 'main-dishes' },
        { id: 5, name: 'Porksilog', price: 50, image: 'pic6.jpg', description: 'Pork with rice and egg', category: 'main-dishes' },
        { id: 6, name: 'Longsilog', price: 50, image: 'pic7.jpg', description: 'Longganisa with rice and egg', category: 'main-dishes' },
        { id: 7, name: 'Footlongsilog', price: 60, image: 'pic8.jpg', description: 'Long longganisa with rice and egg', category: 'main-dishes' },
        { id: 8, name: 'Cantonsilog', price: 90, image: 'pic9.jpg', description: 'Pancit canton with egg', category: 'main-dishes' },
        { id: 9, name: 'Shrimpsilog', price: 55, image: 'pic10.jpg', description: 'Shrimp with egg and rice', category: 'main-dishes' },
        { id: 10, name: 'Sardsilog', price: 70, image: 'pic11.jpg', description: 'Sardines with egg and rice', category: 'main-dishes' },
        { id: 11, name: 'Sinigang na Hipon', price: 55, image: 'pic12.jpg', description: 'Sour shrimp soup', category: 'soup' },
        { id: 12, name: 'Lomi', price: 55, image: 'pic13.jpg', description: 'Thick noodle soup', category: 'soup' },
        { id: 13, name: 'Tapsilog', price: 80, image: 'pic14.jpg', description: 'Beef tapa with garlic rice and egg', category: 'main-dishes' },
        { id: 14, name: 'Sisigsilog', price: 70, image: 'pic15.jpg', description: 'Sizzling sisig with garlic rice and egg', category: 'main-dishes' },
        { id: 15, name: 'Lumpiasilog', price: 50, image: 'pic16.jpg', description: 'Lumpia with rice and egg', category: 'main-dishes' },
        { id: 16, name: 'Pepsi', price: 50, image: 'pepsi.jpg', description: 'Pepsi cola', category: 'drinks' },
        { id: 17, name: 'Coke 1.5', price: 75, image: '1.5.jpg', description: 'Coke 1.5', category: 'drinks' },
        { id: 18, name: 'Coke in a Can', price: 40, image: 'can.jpg', description: 'Coke in a can cola', category: 'drinks' },
        { id: 19, name: 'Blue Fanta', price: 50, image: 'fanta.jpg', description: 'Blue Fanta', category: 'drinks' },
        { id: 20, name: 'Miranda Orange', price: 50, image: 'miranda.jpg', description: 'Miranda Orange', category: 'drinks' },
        { id: 21, name: 'Nestea in a bottle', price: 30, image: 'nestea.jpg', description: 'Nestea', category: 'drinks' },
        { id: 22, name: 'Boiled Egg', price: 15, image: 'egg.jpg', description: 'Boiled Egg', category: 'Add Ons' },
        { id: 23, name: 'Rice', price: 10, image: 'rice.jpg', description: 'Plain Rice', category: 'Add Ons' },
    ];

    // Display all products
    function displayProducts(category = 'all') {
        productGrid.innerHTML = '';

        const filteredProducts = category === 'all'
            ? products
            : products.filter(product => product.category === category);

        // Filter admin-only products if not admin
        const visibleProducts = currentUser && currentUser.role === 'admin'
            ? filteredProducts
            : filteredProducts.filter(p => p.category !== 'admin-only');

        if (visibleProducts.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No products found in this category</p>';
            return;
        }

        visibleProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₱${product.price.toFixed(2)}</p>
                <p class="description">${product.description}</p>
                <button class="add-to-order" data-id="${product.id}">Add to Order</button>
            `;
            productGrid.appendChild(productElement);
        });

        // Add event listeners to "Add to Order" buttons
        document.querySelectorAll('.add-to-order').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToOrder(product);
            });
        });
    }

    // Add product to order
    function addToOrder(product) {
        const existingItem = order.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            order.push({ ...product, quantity: 1 });
        }
        orderItemCount++;
        updateOrderIcon();
        updateOrderList();
        showNotification(`${product.name} added to your order!`);
    }

    // Update order icon display
    function updateOrderIcon() {
        const countSpan = orderIcon.querySelector('.order-count');
        countSpan.textContent = orderItemCount;
    }

    // Update order list display
    function updateOrderList() {
        orderItems.innerHTML = '';
        total = 0;

        if (order.length === 0) {
            orderItems.innerHTML = '<p class="empty-order">Your order is empty</p>';
        } else {
            order.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const orderItemElement = document.createElement('div');
                orderItemElement.className = 'order-item';
                orderItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <h3>${item.name}</h3>
                        <p>₱${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="order-item-actions">
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                orderItems.appendChild(orderItemElement);
            });

            // Add event listeners to order item buttons
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    increaseQuantity(productId);
                });
            });

            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    decreaseQuantity(productId);
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeItem(productId);
                });
            });
        }

        document.getElementById('order-total').textContent = total.toFixed(2);
    }

    // Increase item quantity
    function increaseQuantity(productId) {
        const item = order.find(item => item.id === productId);
        if (item) {
            item.quantity++;
            orderItemCount++;
            updateOrderIcon();
            updateOrderList();
        }
    }

    // Decrease item quantity
    function decreaseQuantity(productId) {
        const item = order.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                orderItemCount--;
                updateOrderIcon();
                updateOrderList();
            } else {
                removeItem(productId);
            }
        }
    }

    // Remove item from order
    function removeItem(productId) {
        const itemIndex = order.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            orderItemCount -= order[itemIndex].quantity;
            updateOrderIcon();
            order.splice(itemIndex, 1);
            updateOrderList();
            showNotification('Item removed from your order');
        }
    }

    // Navigation functionality
    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the selected section
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
            sectionToShow.classList.add('active');
        }

        // Add active class to the clicked nav link
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Special handling for menu section
        if (sectionId === 'menu') {
            displayProducts();
        }

        // Special handling for admin section
        if (sectionId === 'admin-section') {
            document.getElementById('admin-section').innerHTML = `
                <h2>Admin Dashboard</h2>
                <div class="admin-content">
                    <h3>Welcome, ${currentUser.name}!</h3>
                    <div class="admin-tabs">
                        <button class="admin-tab active" data-tab="products">Products</button>
                        <button class="admin-tab" data-tab="orders">Orders</button>
                    </div>

                    <div class="admin-tab-content active" id="products-tab">
                        <button id="view-all-products">View All Products</button>
                    </div>

                    <div class="admin-tab-content" id="orders-tab">
                        <h4>Recent Orders</h4>
                        <div class="orders-list" id="orders-list">
                            <!-- Orders will be displayed here -->
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for admin tabs
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

                    tab.classList.add('active');
                    document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');

                    if (tab.dataset.tab === 'orders') {
                        displayOrders();
                    }
                });
            });

            // Add event listener for products button
            document.getElementById('view-all-products').addEventListener('click', () => {
                displayProducts('all');
                showSection('menu');
            });
        }
    }

    // Display orders function
    function displayOrders() {
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';

        if (ordersHistory.length === 0) {
            ordersList.innerHTML = '<p>No orders yet</p>';
            return;
        }

        ordersHistory.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-card';

            const date = new Date(order.date).toLocaleString();
            const itemsList = order.items.map(item =>
                `<li>${item.name} x ${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>`
            ).join('');

            orderElement.innerHTML = `
                <div class="order-header">
                    <h4>Order #${order.orderId}</h4>
                    <span>${date}</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customer.name}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.zip}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Items:</strong></p>
                    <ul>${itemsList}</ul>
                    <p><strong>Subtotal:</strong> ₱${order.subtotal.toFixed(2)}</p>
                    <p><strong>Delivery Fee:</strong> ₱${order.deliveryFee.toFixed(2)}</p>
                    <p><strong>Total:</strong> ₱${order.total.toFixed(2)}</p>
                </div>
            `;

            ordersList.appendChild(orderElement);
        });
    }

    // Process order function
    function processOrder() {
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;
        const phone = document.getElementById('phone').value;
        const payment = document.getElementById('payment').value;

        // Validate form
        if (!name || !email || !address || !phone || !payment) {
            alert('Please fill in all required fields');
            return;
        }

        // Get current date and time
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Generate receipt
        let receipt = `WELLY'S FOOD HUB - ORDER RECEIPT\n`;
        receipt += `================================\n`;
        receipt += `Date: ${date}\n`;
        receipt += `Time: ${time}\n`;
        receipt += `Order #: ${Math.floor(Math.random() * 1000000)}\n`;
        receipt += `Customer: ${name}\n`;
        receipt += `Email: ${email}\n`;
        receipt += `Address: ${address}, ${city}, ${zip}\n`;
        receipt += `Phone: ${phone}\n`;
        receipt += `Payment: ${payment === 'cash' ? 'Cash on Delivery' :
                   payment === 'gcash' ? 'GCash' : 'Bank Transfer'}\n\n`;
        receipt += `ITEMS ORDERED:\n`;

        order.forEach(item => {
            receipt += `- ${item.name} x ${item.quantity}: ₱${(item.price * item.quantity).toFixed(2)}\n`;
        });

        receipt += `\nSUBTOTAL: ₱${total.toFixed(2)}\n`;
        receipt += `DELIVERY FEE: ₱50.00\n`;
        receipt += `TOTAL: ₱${(total + 50).toFixed(2)}\n\n`;
        receipt += `Thank you for ordering from Welly's Food Hub!\n`;
        receipt += `Your food will be delivered within 30-45 minutes.\n`;
        receipt += `Enjoy your meal!`;

        // Store the order in history
        const orderData = {
            orderId: Math.floor(Math.random() * 1000000),
            date: now.toISOString(),
            customer: {
                name: name,
                email: email,
                address: address,
                city: city,
                zip: zip,
                phone: phone
            },
            paymentMethod: payment === 'cash' ? 'Cash on Delivery' :
                   payment === 'gcash' ? 'GCash' : 'Bank Transfer',
            items: order.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: total,
            deliveryFee: 50,
            total: total + 50
        };

        ordersHistory.push(orderData);
        localStorage.setItem('ordersHistory', JSON.stringify(ordersHistory));

        // Display receipt
        alert(receipt);

        // Reset order
        order = [];
        orderItemCount = 0;
        updateOrderIcon();
        checkoutForm.reset();
        showSection('home');
        updateOrderList();

        // Show confirmation
        showSection('home');
        alert('Order placed successfully! Thank you for your order.');
    }

    // Event listeners for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Category cards functionality
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showSection('menu');
            displayProducts(category);

            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listeners for main buttons
    orderNowButton.addEventListener('click', function() {
        showSection('menu');
    });

    orderIcon.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('order-page');
        updateOrderList();
    });

    checkoutButton.addEventListener('click', function() {
        if (order.length === 0) {
            alert('Your order is empty!');
        } else {
            showSection('checkout-page');
        }
    });

    // Checkout form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });

    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        alert(`Thank you for your message, ${name}! We'll get back to you soon at ${email}.`);

        contactForm.reset();
    });

    // Show home section by default
    showSection('home');

    mobileMenu.addEventListener('click', function() {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle('active');
    });
});
