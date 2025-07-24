       // Cart functionality
        let cart = [];
        
        // DOM Elements
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');
        const overlay = document.getElementById('overlay');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartItemsCount = document.getElementById('cart-items-count');
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        // Toggle Cart
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Add to Cart
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.getAttribute('data-name');
                const productPrice = parseFloat(productCard.getAttribute('data-price'));
                const productImage = productCard.getAttribute('data-image');
                
                addToCart(productId, productName, productPrice, productImage);
                
                // Show notification
                showNotification(`${productName} added to cart!`);
            });
        });
        
        // Add to Cart Function
        function addToCart(id, name, price, image) {
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
        }
        
        // Update Cart
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartItemsCount.textContent = totalItems;
            
            // Update cart items
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-message"><p>Your cart is empty</p></div>';
                cartTotal.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = '';
                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });
                
                // Show cart total
                cartTotal.style.display = 'block';
                
                // Calculate totals
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                cartTotalPrice.textContent = `$${subtotal.toFixed(2)}`;
            }
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    updateQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const id = input.getAttribute('data-id');
                    const newQuantity = parseInt(input.value);
                    
                    if (newQuantity > 0) {
                        const item = cart.find(item => item.id === id);
                        if (item) {
                            item.quantity = newQuantity;
                            updateCart();
                        }
                    } else {
                        input.value = 1;
                    }
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = button.getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }
        
        // Update Quantity
        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                
                if (item.quantity < 1) {
                    item.quantity = 1;
                }
                
                updateCart();
            }
        }
        
        // Remove from Cart
        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
            
            // Show notification
            showNotification('Item removed from cart');
        }
        
        // Show Notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'var(--primary)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = 'var(--border-radius)';
            notification.style.boxShadow = 'var(--shadow)';
            notification.style.zIndex = '1002';
            notification.style.animation = 'slideUp 0.3s ease';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        // Mobile Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Back to Top Button
        const backToTop = document.querySelector('.back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                // Here you would typically send the email to your server
                showNotification(`Thank you for subscribing with ${email}! You'll hear from us soon.`);
                this.querySelector('input').value = '';
            });
        }
        
        // Initialize cart
        updateCart();