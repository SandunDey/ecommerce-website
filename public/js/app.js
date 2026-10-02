/**
 * Auspify Store - Main Application Logic
 * Implements complete e-commerce workflow: catalog, cart, checkout, auth, tracking, and admin dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= State Management =================
  const state = {
    user: API.getCurrentUser(),
    cart: JSON.parse(localStorage.getItem('auspify_cart') || '[]'),
    appliedCoupon: localStorage.getItem('auspify_coupon') || '',
    cartCalculations: null,
    products: [],
    categories: [],
    filters: {
      category: 'all',
      search: '',
      sort: 'featured',
      priceRange: 'all'
    },
    activeView: 'storefront',
    adminData: {
      stats: null,
      products: [],
      orders: []
    }
  };

  // ================= DOM Elements =================
  const els = {
    // Theme
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    announcementBar: document.getElementById('announcementBar'),
    closeAnnouncementBtn: document.getElementById('closeAnnouncementBtn'),

    // Navigation & Search
    brandLogo: document.getElementById('brandLogo'),
    globalSearchInput: document.getElementById('globalSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    categoryPills: document.getElementById('categoryPills'),
    sortSelect: document.getElementById('sortSelect'),
    priceRangeFilter: document.getElementById('priceRangeFilter'),
    catalogHeading: document.getElementById('catalogHeading'),
    catalogItemCount: document.getElementById('catalogItemCount'),
    productGrid: document.getElementById('productGrid'),
    emptyCatalogState: document.getElementById('emptyCatalogState'),
    resetCatalogFiltersBtn: document.getElementById('resetCatalogFiltersBtn'),

    // Views
    storefrontView: document.getElementById('storefrontView'),
    adminView: document.getElementById('adminView'),
    navAdminBtn: document.getElementById('navAdminBtn'),
    backToStorefrontBtn: document.getElementById('backToStorefrontBtn'),

    // Auth
    navAuthBtn: document.getElementById('navAuthBtn'),
    authBtnLabel: document.getElementById('authBtnLabel'),
    userDropdownMenu: document.getElementById('userDropdownMenu'),
    dropdownUserName: document.getElementById('dropdownUserName'),
    dropdownUserEmail: document.getElementById('dropdownUserEmail'),
    dropdownUserRole: document.getElementById('dropdownUserRole'),
    dropdownMyOrdersBtn: document.getElementById('dropdownMyOrdersBtn'),
    dropdownAdminBtn: document.getElementById('dropdownAdminBtn'),
    dropdownSignOutBtn: document.getElementById('dropdownSignOutBtn'),
    authModal: document.getElementById('authModal'),
    closeAuthModalBtn: document.getElementById('closeAuthModalBtn'),
    authTabLogin: document.getElementById('authTabLogin'),
    authTabRegister: document.getElementById('authTabRegister'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    demoAdminLoginBtn: document.getElementById('demoAdminLoginBtn'),
    demoCustomerLoginBtn: document.getElementById('demoCustomerLoginBtn'),

    // Cart Drawer
    navCartBtn: document.getElementById('navCartBtn'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartBackdrop: document.getElementById('cartBackdrop'),
    closeCartDrawerBtn: document.getElementById('closeCartDrawerBtn'),
    drawerCartCount: document.getElementById('drawerCartCount'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    shippingProgressBanner: document.getElementById('shippingProgressBanner'),
    shippingProgressText: document.getElementById('shippingProgressText'),
    shippingProgressBar: document.getElementById('shippingProgressBar'),
    couponCodeInput: document.getElementById('couponCodeInput'),
    applyCouponBtn: document.getElementById('applyCouponBtn'),
    couponFeedbackMessage: document.getElementById('couponFeedbackMessage'),
    cartSubtotalText: document.getElementById('cartSubtotalText'),
    cartDiscountRow: document.getElementById('cartDiscountRow'),
    cartCouponCodeTag: document.getElementById('cartCouponCodeTag'),
    cartDiscountText: document.getElementById('cartDiscountText'),
    cartShippingText: document.getElementById('cartShippingText'),
    cartTaxText: document.getElementById('cartTaxText'),
    cartTotalText: document.getElementById('cartTotalText'),
    proceedToCheckoutBtn: document.getElementById('proceedToCheckoutBtn'),
    clearCartBtn: document.getElementById('clearCartBtn'),

    // Quick View Modal
    quickViewModal: document.getElementById('quickViewModal'),
    closeQuickViewModalBtn: document.getElementById('closeQuickViewModalBtn'),
    qvProductImage: document.getElementById('qvProductImage'),
    qvProductCategory: document.getElementById('qvProductCategory'),
    qvProductName: document.getElementById('qvProductName'),
    qvProductStars: document.getElementById('qvProductStars'),
    qvReviewsCount: document.getElementById('qvReviewsCount'),
    qvCurrentPrice: document.getElementById('qvCurrentPrice'),
    qvOldPrice: document.getElementById('qvOldPrice'),
    qvStockBadge: document.getElementById('qvStockBadge'),
    qvProductDescription: document.getElementById('qvProductDescription'),
    qvTagsContainer: document.getElementById('qvTagsContainer'),
    qvQtyMinus: document.getElementById('qvQtyMinus'),
    qvQtyPlus: document.getElementById('qvQtyPlus'),
    qvQtyInput: document.getElementById('qvQtyInput'),
    qvAddToCartBtn: document.getElementById('qvAddToCartBtn'),

    // Checkout Modal
    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckoutModalBtn: document.getElementById('closeCheckoutModalBtn'),
    stepChip1: document.getElementById('stepChip1'),
    stepChip2: document.getElementById('stepChip2'),
    stepChip3: document.getElementById('stepChip3'),
    checkoutStep1: document.getElementById('checkoutStep1'),
    checkoutStep2: document.getElementById('checkoutStep2'),
    checkoutStep3: document.getElementById('checkoutStep3'),
    shippingAddressForm: document.getElementById('shippingAddressForm'),
    checkoutFullName: document.getElementById('checkoutFullName'),
    checkoutEmail: document.getElementById('checkoutEmail'),
    checkoutPhone: document.getElementById('checkoutPhone'),
    checkoutStreet: document.getElementById('checkoutStreet'),
    checkoutCity: document.getElementById('checkoutCity'),
    checkoutState: document.getElementById('checkoutState'),
    checkoutZip: document.getElementById('checkoutZip'),
    checkoutCountry: document.getElementById('checkoutCountry'),
    goToStep2Btn: document.getElementById('goToStep2Btn'),
    backToStep1Btn: document.getElementById('backToStep1Btn'),
    confirmPlaceOrderBtn: document.getElementById('confirmPlaceOrderBtn'),
    recapItemCount: document.getElementById('recapItemCount'),
    recapTotalAmount: document.getElementById('recapTotalAmount'),
    successOrderNumber: document.getElementById('successOrderNumber'),
    successTrackingNumber: document.getElementById('successTrackingNumber'),
    successPaymentMethod: document.getElementById('successPaymentMethod'),
    successTotalAmount: document.getElementById('successTotalAmount'),
    successViewOrdersBtn: document.getElementById('successViewOrdersBtn'),
    successContinueShoppingBtn: document.getElementById('successContinueShoppingBtn'),

    // My Orders Modal
    myOrdersModal: document.getElementById('myOrdersModal'),
    closeMyOrdersModalBtn: document.getElementById('closeMyOrdersModalBtn'),
    myOrdersListContainer: document.getElementById('myOrdersListContainer'),

    // Track Order Modal
    navTrackOrderBtn: document.getElementById('navTrackOrderBtn'),
    footerTrackBtn: document.getElementById('footerTrackBtn'),
    trackOrderModal: document.getElementById('trackOrderModal'),
    closeTrackOrderModalBtn: document.getElementById('closeTrackOrderModalBtn'),
    trackOrderForm: document.getElementById('trackOrderForm'),
    trackQueryInput: document.getElementById('trackQueryInput'),
    trackResultContainer: document.getElementById('trackResultContainer'),

    // Coupon Info Modal
    heroPromoBtn: document.getElementById('heroPromoBtn'),
    footerCouponsBtn: document.getElementById('footerCouponsBtn'),
    couponInfoModal: document.getElementById('couponInfoModal'),
    closeCouponInfoModalBtn: document.getElementById('closeCouponInfoModalBtn'),

    // Admin Dashboard
    adminStatsGrid: document.getElementById('adminStatsGrid'),
    adminStatRevenue: document.getElementById('adminStatRevenue'),
    adminStatOrders: document.getElementById('adminStatOrders'),
    adminStatProducts: document.getElementById('adminStatProducts'),
    adminStatLowStock: document.getElementById('adminStatLowStock'),
    adminProductsTableBody: document.getElementById('adminProductsTableBody'),
    adminOrdersTableBody: document.getElementById('adminOrdersTableBody'),
    adminProductSearchInput: document.getElementById('adminProductSearchInput'),
    adminOrderSearchInput: document.getElementById('adminOrderSearchInput'),
    adminOrderStatusFilter: document.getElementById('adminOrderStatusFilter'),
    openAddProductModalBtn: document.getElementById('openAddProductModalBtn'),
    productModal: document.getElementById('productModal'),
    closeProductModalBtn: document.getElementById('closeProductModalBtn'),
    cancelProductModalBtn: document.getElementById('cancelProductModalBtn'),
    productForm: document.getElementById('productForm'),
    productModalTitle: document.getElementById('productModalTitle'),
    adminProductId: document.getElementById('adminProductId'),
    adminProdName: document.getElementById('adminProdName'),
    adminProdCategory: document.getElementById('adminProdCategory'),
    adminProdPrice: document.getElementById('adminProdPrice'),
    adminProdOrigPrice: document.getElementById('adminProdOrigPrice'),
    adminProdStock: document.getElementById('adminProdStock'),
    adminProdImage: document.getElementById('adminProdImage'),
    adminProdDesc: document.getElementById('adminProdDesc'),
    adminProdBadge: document.getElementById('adminProdBadge'),
    adminProdTags: document.getElementById('adminProdTags'),
    adminProdFeatured: document.getElementById('adminProdFeatured'),

    // Hero quick buy
    heroQuickBuyBtn: document.getElementById('heroQuickBuyBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  let currentQvProduct = null;

  // ================= Toast Notifications =================
  function showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <span>${message}</span>
    `;

    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ================= Theme Switcher =================
  function initTheme() {
    const savedTheme = localStorage.getItem('auspify_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    els.themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('auspify_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next} mode`, 'info', 2000);
    });
  }

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      els.themeIcon.className = 'fa-solid fa-sun';
    } else {
      els.themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // ================= User Authentication UI =================
  function updateAuthUI() {
    state.user = API.getCurrentUser();
    if (state.user) {
      els.authBtnLabel.textContent = state.user.name.split(' ')[0];
      els.dropdownUserName.textContent = state.user.name;
      els.dropdownUserEmail.textContent = state.user.email;
      els.dropdownUserRole.textContent = state.user.role.toUpperCase();

      if (state.user.role === 'admin') {
        els.dropdownAdminBtn.style.display = 'flex';
        els.navAdminBtn.style.display = 'inline-flex';
      } else {
        els.dropdownAdminBtn.style.display = 'none';
        els.navAdminBtn.style.display = 'none';
      }
    } else {
      els.authBtnLabel.textContent = 'Sign In';
      els.dropdownAdminBtn.style.display = 'none';
      els.navAdminBtn.style.display = 'none';
      if (state.activeView === 'admin') {
        switchView('storefront');
      }
    }
  }

  // Toggle user dropdown or open auth modal
  els.navAuthBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.user) {
      els.userDropdownMenu.classList.toggle('active');
    } else {
      openAuthModal('login');
    }
  });

  document.addEventListener('click', (e) => {
    if (!els.userDropdownMenu.contains(e.target) && e.target !== els.navAuthBtn) {
      els.userDropdownMenu.classList.remove('active');
    }
  });

  els.dropdownSignOutBtn.addEventListener('click', () => {
    API.logout();
    updateAuthUI();
    els.userDropdownMenu.classList.remove('active');
    showToast('You have been signed out.', 'info');
  });

  els.dropdownMyOrdersBtn.addEventListener('click', () => {
    els.userDropdownMenu.classList.remove('active');
    openMyOrdersModal();
  });

  els.dropdownAdminBtn.addEventListener('click', () => {
    els.userDropdownMenu.classList.remove('active');
    switchView('admin');
  });

  els.navAdminBtn.addEventListener('click', () => {
    switchView('admin');
  });

  els.backToStorefrontBtn.addEventListener('click', () => {
    switchView('storefront');
  });

  // Auth Modal Tab switching
  els.authTabLogin.addEventListener('click', () => setAuthTab('login'));
  els.authTabRegister.addEventListener('click', () => setAuthTab('register'));

  function setAuthTab(tab) {
    if (tab === 'login') {
      els.authTabLogin.classList.add('active');
      els.authTabRegister.classList.remove('active');
      els.loginForm.style.display = 'block';
      els.registerForm.style.display = 'none';
    } else {
      els.authTabRegister.classList.add('active');
      els.authTabLogin.classList.remove('active');
      els.registerForm.style.display = 'block';
      els.loginForm.style.display = 'none';
    }
  }

  function openAuthModal(defaultTab = 'login') {
    setAuthTab(defaultTab);
    els.authModal.classList.add('active');
  }

  function closeAuthModal() {
    els.authModal.classList.remove('active');
  }

  els.closeAuthModalBtn.addEventListener('click', closeAuthModal);

  // 1-Click Demo Login Handlers
  els.demoAdminLoginBtn.addEventListener('click', async () => {
    try {
      showToast('Authenticating as Administrator...', 'info', 1500);
      const res = await API.login('admin@auspify.com', 'admin123');
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${res.user.name}! (Admin Access Granted)`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  els.demoCustomerLoginBtn.addEventListener('click', async () => {
    try {
      showToast('Authenticating as Customer...', 'info', 1500);
      const res = await API.login('demo@example.com', 'user123');
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${res.user.name}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Regular Login submit
  els.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = els.loginEmail.value.trim();
    const password = els.loginPassword.value;

    try {
      const res = await API.login(email, password);
      updateAuthUI();
      closeAuthModal();
      showToast(`Logged in successfully as ${res.user.name}`, 'success');
      els.loginForm.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Regular Register submit
  els.registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value.trim();

    try {
      const res = await API.register({ name, email, password, phone });
      updateAuthUI();
      closeAuthModal();
      showToast(`Account created! Welcome, ${res.user.name}!`, 'success');
      els.registerForm.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // ================= Catalog & Filtering =================
  async function loadProducts() {
    els.productGrid.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Refreshing catalog items...</p>
      </div>
    `;

    try {
      const params = {
        category: state.filters.category,
        search: state.filters.search,
        sort: state.filters.sort
      };

      // Handle price range filters
      if (state.filters.priceRange === 'under50') {
        params.maxPrice = 50;
      } else if (state.filters.priceRange === '50to100') {
        params.minPrice = 50;
        params.maxPrice = 100;
      } else if (state.filters.priceRange === '100to200') {
        params.minPrice = 100;
        params.maxPrice = 200;
      } else if (state.filters.priceRange === 'above200') {
        params.minPrice = 200;
      }

      const res = await API.getProducts(params);
      state.products = res.products || [];
      renderProductsGrid(state.products);
    } catch (err) {
      console.error(err);
      els.productGrid.innerHTML = `
        <div class="empty-state">
          <p class="error-msg">Failed to load catalog. Please check server connection.</p>
        </div>
      `;
    }
  }

  function renderProductsGrid(products) {
    els.catalogItemCount.textContent = `Showing ${products.length} product${products.length === 1 ? '' : 's'}`;

    if (!products.length) {
      els.productGrid.style.display = 'none';
      els.emptyCatalogState.style.display = 'block';
      return;
    }

    els.productGrid.style.display = 'grid';
    els.emptyCatalogState.style.display = 'none';

    els.productGrid.innerHTML = products.map(product => {
      const isDiscounted = product.originalPrice && product.originalPrice > product.price;
      const discountPercent = isDiscounted ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
      const isLowStock = product.stock > 0 && product.stock <= 5;
      const isOutOfStock = product.stock <= 0;

      let badgeHtml = '';
      if (product.badge) {
        badgeHtml = `<div class="card-badge">${product.badge}</div>`;
      } else if (isDiscounted) {
        badgeHtml = `<div class="card-badge">${discountPercent}% OFF</div>`;
      }

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-box">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${badgeHtml}
            <button class="quick-view-overlay-btn" data-action="quick-view" data-id="${product.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
          </div>
          <div class="product-card-body">
            <div class="product-meta-row">
              <span class="card-category">${product.category}</span>
              <div class="card-rating">
                <i class="fa-solid fa-star"></i>
                <strong>${product.rating.toFixed(1)}</strong>
                <span>(${product.reviewsCount})</span>
              </div>
            </div>
            <h3 class="card-title" title="${product.name}">${product.name}</h3>
            <p class="card-desc">${product.description}</p>
            <div class="card-footer">
              <div class="card-price-group">
                <span class="card-price">$${product.price.toFixed(2)}</span>
                ${isDiscounted ? `<span class="card-orig-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <button class="card-add-cart-btn ${isOutOfStock ? 'disabled' : ''}" 
                data-action="add-to-cart" 
                data-id="${product.id}"
                ${isOutOfStock ? 'disabled' : ''}>
                <i class="fa-solid fa-bag-shopping"></i> ${isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Category Filtering
  els.categoryPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.cat-pill');
    if (!pill) return;

    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const cat = pill.getAttribute('data-category');
    state.filters.category = cat;

    if (cat === 'all') {
      els.catalogHeading.textContent = 'Explore All Products';
    } else {
      els.catalogHeading.textContent = `${cat} Collection`;
    }

    loadProducts();
  });

  // Footer Category links
  document.querySelectorAll('.footer-cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-cat');
      const targetPill = document.querySelector(`.cat-pill[data-category="${cat}"]`);
      if (targetPill) {
        targetPill.click();
        document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Sort dropdown
  els.sortSelect.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    loadProducts();
  });

  // Price range dropdown
  els.priceRangeFilter.addEventListener('change', (e) => {
    state.filters.priceRange = e.target.value;
    loadProducts();
  });

  // Search input debounced
  let searchTimeout;
  els.globalSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value;
    els.clearSearchBtn.style.display = query ? 'block' : 'none';

    searchTimeout = setTimeout(() => {
      state.filters.search = query;
      loadProducts();
    }, 300);
  });

  els.clearSearchBtn.addEventListener('click', () => {
    els.globalSearchInput.value = '';
    els.clearSearchBtn.style.display = 'none';
    state.filters.search = '';
    loadProducts();
  });

  els.resetCatalogFiltersBtn.addEventListener('click', () => {
    state.filters = { category: 'all', search: '', sort: 'featured', priceRange: 'all' };
    els.globalSearchInput.value = '';
    els.clearSearchBtn.style.display = 'none';
    els.sortSelect.value = 'featured';
    els.priceRangeFilter.value = 'all';
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.cat-pill[data-category="all"]').classList.add('active');
    els.catalogHeading.textContent = 'Explore All Products';
    loadProducts();
  });

  // Product Grid Action Delegations (Quick View & Add to Cart)
  els.productGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const prodId = btn.getAttribute('data-id');

    if (action === 'quick-view') {
      openQuickView(prodId);
    } else if (action === 'add-to-cart') {
      addToCart(prodId, 1);
    }
  });

  // Hero Quick Buy
  els.heroQuickBuyBtn.addEventListener('click', () => {
    const prodId = els.heroQuickBuyBtn.getAttribute('data-product-id');
    addToCart(prodId, 1);
    openCartDrawer();
  });

  // ================= Quick View Modal =================
  async function openQuickView(productId) {
    try {
      const res = await API.getProductById(productId);
      const prod = res.product;
      currentQvProduct = prod;

      els.qvProductImage.src = prod.image;
      els.qvProductImage.alt = prod.name;
      els.qvProductCategory.textContent = prod.category;
      els.qvProductName.textContent = prod.name;
      els.qvReviewsCount.textContent = `(${prod.reviewsCount} verified reviews)`;

      // Star rating display
      let starHtml = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(prod.rating)) {
          starHtml += '<i class="fa-solid fa-star"></i>';
        } else if (i - prod.rating < 1) {
          starHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
          starHtml += '<i class="fa-regular fa-star"></i>';
        }
      }
      els.qvProductStars.innerHTML = starHtml;

      els.qvCurrentPrice.textContent = `$${prod.price.toFixed(2)}`;
      if (prod.originalPrice && prod.originalPrice > prod.price) {
        els.qvOldPrice.textContent = `$${prod.originalPrice.toFixed(2)}`;
        els.qvOldPrice.style.display = 'inline';
      } else {
        els.qvOldPrice.style.display = 'none';
      }

      els.qvStockBadge.textContent = prod.stock > 0 ? `In Stock (${prod.stock} units)` : 'Out of Stock';
      els.qvStockBadge.className = prod.stock > 0 ? 'stock-badge' : 'stock-badge out-of-stock';

      els.qvProductDescription.textContent = prod.description;

      if (Array.isArray(prod.tags)) {
        els.qvTagsContainer.innerHTML = prod.tags.map(t => `<span class="qv-tag-pill">#${t}</span>`).join('');
      } else {
        els.qvTagsContainer.innerHTML = '';
      }

      els.qvQtyInput.value = 1;
      els.qvQtyInput.max = prod.stock || 1;

      els.quickViewModal.classList.add('active');
    } catch (err) {
      showToast('Could not load product details.', 'error');
    }
  }

  els.closeQuickViewModalBtn.addEventListener('click', () => {
    els.quickViewModal.classList.remove('active');
  });

  els.qvQtyMinus.addEventListener('click', () => {
    let current = parseInt(els.qvQtyInput.value, 10) || 1;
    if (current > 1) {
      els.qvQtyInput.value = current - 1;
    }
  });

  els.qvQtyPlus.addEventListener('click', () => {
    let current = parseInt(els.qvQtyInput.value, 10) || 1;
    const max = currentQvProduct ? currentQvProduct.stock : 99;
    if (current < max) {
      els.qvQtyInput.value = current + 1;
    }
  });

  els.qvAddToCartBtn.addEventListener('click', () => {
    if (!currentQvProduct) return;
    const qty = parseInt(els.qvQtyInput.value, 10) || 1;
    addToCart(currentQvProduct.id, qty);
    els.quickViewModal.classList.remove('active');
    openCartDrawer();
  });

  // ================= Shopping Cart Logic =================
  function openCartDrawer() {
    els.cartDrawer.classList.add('active');
    els.cartBackdrop.classList.add('active');
    syncCart();
  }

  function closeCartDrawer() {
    els.cartDrawer.classList.remove('active');
    els.cartBackdrop.classList.remove('active');
  }

  els.navCartBtn.addEventListener('click', openCartDrawer);
  els.closeCartDrawerBtn.addEventListener('click', closeCartDrawer);
  els.cartBackdrop.addEventListener('click', closeCartDrawer);

  function saveCartLocally() {
    localStorage.setItem('auspify_cart', JSON.stringify(state.cart));
    localStorage.setItem('auspify_coupon', state.appliedCoupon);
  }

  function addToCart(productId, quantity = 1) {
    const existingIndex = state.cart.findIndex(i => i.productId === productId);
    if (existingIndex !== -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({ productId, quantity });
    }

    saveCartLocally();
    syncCart();

    const product = state.products.find(p => p.id === productId);
    const title = product ? product.name : 'Item';
    showToast(`Added "${title}" to your bag!`, 'success');
  }

  function updateCartItemQty(productId, delta) {
    const item = state.cart.find(i => i.productId === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCartLocally();
    syncCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.productId !== productId);
    saveCartLocally();
    syncCart();
    showToast('Item removed from shopping bag.', 'info');
  }

  els.clearCartBtn.addEventListener('click', () => {
    if (!state.cart.length) return;
    state.cart = [];
    state.appliedCoupon = '';
    saveCartLocally();
    syncCart();
    showToast('Your shopping bag has been cleared.', 'info');
  });

  // Sync Cart with Server for Accurate Prices & Stock
  async function syncCart() {
    // Immediate local count badge update
    const localCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    els.cartCountBadge.textContent = localCount;
    els.drawerCartCount.textContent = localCount;

    if (!state.cart.length) {
      renderEmptyCart();
      return;
    }

    try {
      const res = await API.validateCart(state.cart, state.appliedCoupon);
      state.cartCalculations = res;

      renderCartItems(res.items);
      renderCartSummary(res);
    } catch (err) {
      console.error('Error synchronizing cart:', err);
    }
  }

  function renderEmptyCart() {
    els.cartItemsContainer.innerHTML = `
      <div class="empty-state" style="padding: 40px 10px;">
        <div class="empty-icon"><i class="fa-solid fa-bag-shopping"></i></div>
        <h4>Your bag is currently empty</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          Explore our trending gadgets and apparel to start shopping.
        </p>
        <button class="btn btn-primary btn-sm" id="emptyCartBrowseBtn">
          Browse Catalog
        </button>
      </div>
    `;

    document.getElementById('emptyCartBrowseBtn')?.addEventListener('click', () => {
      closeCartDrawer();
      document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
    });

    els.cartSubtotalText.textContent = '$0.00';
    els.cartDiscountRow.style.display = 'none';
    els.cartShippingText.textContent = '$9.99';
    els.cartTaxText.textContent = '$0.00';
    els.cartTotalText.textContent = '$0.00';
    els.proceedToCheckoutBtn.disabled = true;

    // Progress bar reset
    els.shippingProgressBar.style.width = '0%';
    els.shippingProgressText.innerHTML = `<i class="fa-solid fa-truck"></i> Add $150.00 for <strong>FREE Express Shipping</strong>!`;
  }

  function renderCartItems(items) {
    els.cartItemsContainer.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.productId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <h4 title="${item.name}">${item.name}</h4>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
          <div class="cart-item-controls">
            <button class="qty-control-btn" data-action="decrease" data-id="${item.productId}">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-control-btn" data-action="increase" data-id="${item.productId}">+</button>
          </div>
        </div>
        <button class="remove-cart-item-btn" data-action="remove" data-id="${item.productId}" title="Remove item">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    els.proceedToCheckoutBtn.disabled = false;
  }

  // Cart Items Controls Delegation
  els.cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const prodId = btn.getAttribute('data-id');

    if (action === 'increase') updateCartItemQty(prodId, 1);
    if (action === 'decrease') updateCartItemQty(prodId, -1);
    if (action === 'remove') removeFromCart(prodId);
  });

  function renderCartSummary(data) {
    els.cartSubtotalText.textContent = `$${data.subtotal.toFixed(2)}`;

    if (data.discount > 0) {
      els.cartDiscountRow.style.display = 'flex';
      els.cartCouponCodeTag.textContent = data.coupon.code;
      els.cartDiscountText.textContent = `-$${data.discount.toFixed(2)}`;
    } else {
      els.cartDiscountRow.style.display = 'none';
    }

    if (data.shippingFee === 0) {
      els.cartShippingText.innerHTML = '<strong style="color: var(--success);">FREE</strong>';
    } else {
      els.cartShippingText.textContent = `$${data.shippingFee.toFixed(2)}`;
    }

    els.cartTaxText.textContent = `$${data.estimatedTax.toFixed(2)}`;
    els.cartTotalText.textContent = `$${data.total.toFixed(2)}`;

    // Free Shipping Progress calculation (threshold is $150)
    const threshold = 150;
    if (data.subtotal >= threshold || (data.coupon && data.coupon.code === 'FREESHIP')) {
      els.shippingProgressBar.style.width = '100%';
      els.shippingProgressText.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--success)"></i> <strong>Free Express Shipping</strong> unlocked!`;
    } else {
      const remaining = (threshold - data.subtotal).toFixed(2);
      const percent = Math.min(100, Math.round((data.subtotal / threshold) * 100));
      els.shippingProgressBar.style.width = `${percent}%`;
      els.shippingProgressText.innerHTML = `<i class="fa-solid fa-truck"></i> Add <strong>$${remaining}</strong> more for <strong>FREE Shipping</strong>!`;
    }

    // Coupon message feedback
    if (data.couponMessage) {
      els.couponFeedbackMessage.textContent = data.couponMessage;
      els.couponFeedbackMessage.style.display = 'block';
      els.couponFeedbackMessage.style.color = data.coupon ? 'var(--success)' : 'var(--danger)';
    } else {
      els.couponFeedbackMessage.style.display = 'none';
    }
  }

  // Apply Coupon Button
  els.applyCouponBtn.addEventListener('click', () => {
    const code = els.couponCodeInput.value.trim().toUpperCase();
    if (!code) {
      showToast('Please type a coupon code (e.g. AUSPIFY20)', 'info');
      return;
    }
    state.appliedCoupon = code;
    saveCartLocally();
    syncCart();
    showToast(`Applying voucher code "${code}"...`, 'info', 1500);
  });

  // ================= Checkout Wizard =================
  els.proceedToCheckoutBtn.addEventListener('click', () => {
    if (!state.cart.length) {
      showToast('Your bag is empty! Add products first.', 'info');
      return;
    }

    closeCartDrawer();
    openCheckoutModal();
  });

  function openCheckoutModal() {
    setCheckoutStep(1);

    // Auto-fill customer profile details if logged in
    if (state.user) {
      els.checkoutFullName.value = state.user.name || '';
      els.checkoutEmail.value = state.user.email || '';
      els.checkoutPhone.value = state.user.phone || '';
      if (state.user.address) {
        els.checkoutStreet.value = state.user.address;
      }
    }

    updateCheckoutRecap();
    els.checkoutModal.classList.add('active');
  }

  function closeCheckoutModal() {
    els.checkoutModal.classList.remove('active');
  }

  els.closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);

  function setCheckoutStep(step) {
    els.checkoutStep1.style.display = step === 1 ? 'block' : 'none';
    els.checkoutStep2.style.display = step === 2 ? 'block' : 'none';
    els.checkoutStep3.style.display = step === 3 ? 'block' : 'none';

    els.stepChip1.className = `step-chip ${step === 1 ? 'active' : ''}`;
    els.stepChip2.className = `step-chip ${step === 2 ? 'active' : ''}`;
    els.stepChip3.className = `step-chip ${step === 3 ? 'active' : ''}`;
  }

  els.shippingAddressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setCheckoutStep(2);
  });

  els.backToStep1Btn.addEventListener('click', () => {
    setCheckoutStep(1);
  });

  // Payment method selection cards
  document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;

      const method = card.getAttribute('data-method');
      document.getElementById('mockCardFields').style.display = method === 'Credit Card' ? 'block' : 'none';
    });
  });

  function updateCheckoutRecap() {
    if (!state.cartCalculations) return;
    els.recapItemCount.textContent = `${state.cartCalculations.itemCount} items`;
    els.recapTotalAmount.textContent = `$${state.cartCalculations.total.toFixed(2)}`;
  }

  // Final Order Placement
  els.confirmPlaceOrderBtn.addEventListener('click', async () => {
    const selectedMethod = document.querySelector('input[name="paymentMethodRadio"]:checked')?.value || 'Credit Card';

    const orderPayload = {
      customerName: els.checkoutFullName.value.trim(),
      customerEmail: els.checkoutEmail.value.trim(),
      phone: els.checkoutPhone.value.trim(),
      shippingAddress: {
        street: els.checkoutStreet.value.trim(),
        city: els.checkoutCity.value.trim(),
        state: els.checkoutState.value.trim(),
        zip: els.checkoutZip.value.trim(),
        country: els.checkoutCountry.value.trim()
      },
      paymentMethod: selectedMethod,
      items: state.cart,
      couponCode: state.appliedCoupon
    };

    els.confirmPlaceOrderBtn.disabled = true;
    els.confirmPlaceOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...';

    try {
      const res = await API.placeOrder(orderPayload);
      const order = res.order;

      // Populate Step 3 details
      els.successOrderNumber.textContent = order.orderNumber;
      els.successTrackingNumber.textContent = order.trackingNumber;
      els.successPaymentMethod.textContent = order.paymentMethod;
      els.successTotalAmount.textContent = `$${order.total.toFixed(2)}`;

      // Clear local cart
      state.cart = [];
      state.appliedCoupon = '';
      saveCartLocally();
      syncCart();

      setCheckoutStep(3);
      showToast(`Order ${order.orderNumber} placed successfully!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      els.confirmPlaceOrderBtn.disabled = false;
      els.confirmPlaceOrderBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Authorize & Place Order';
    }
  });

  els.successContinueShoppingBtn.addEventListener('click', () => {
    closeCheckoutModal();
    loadProducts();
  });

  els.successViewOrdersBtn.addEventListener('click', () => {
    closeCheckoutModal();
    openMyOrdersModal();
  });

  // ================= Customer Order History =================
  async function openMyOrdersModal() {
    if (!state.user) {
      openAuthModal('login');
      showToast('Please sign in to view your order history.', 'info');
      return;
    }

    els.myOrdersModal.classList.add('active');
    els.myOrdersListContainer.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading your past purchases...</p>
      </div>
    `;

    try {
      const res = await API.getMyOrders();
      const orders = res.orders || [];

      if (!orders.length) {
        els.myOrdersListContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
            <h4>No orders placed yet</h4>
            <p>Your purchases will be tracked here once you complete a checkout.</p>
          </div>
        `;
        return;
      }

      els.myOrdersListContainer.innerHTML = orders.map(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        const statusClass = `status-${order.orderStatus.toLowerCase()}`;

        return `
          <div class="order-history-card">
            <div class="order-history-header">
              <div>
                <strong>${order.orderNumber}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">${dateStr}</span>
              </div>
              <div>
                <span class="status-pill ${statusClass}">${order.orderStatus}</span>
              </div>
            </div>
            <div class="order-history-items-list">
              ${order.items.map(item => `
                <div class="order-history-item-row">
                  <img src="${item.image}" alt="${item.name}" class="order-history-item-thumb">
                  <div style="flex:1;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">Qty: ${item.quantity} &bull; $${item.price.toFixed(2)} each</div>
                  </div>
                  <strong style="font-size: 0.9rem;">$${item.itemTotal.toFixed(2)}</strong>
                </div>
              `).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:10px;">
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                Tracking: <code>${order.trackingNumber || 'Pending'}</code>
              </div>
              <div>
                Total: <strong style="font-size: 1.05rem; color: var(--text-primary);">$${order.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      els.myOrdersListContainer.innerHTML = `
        <div class="empty-state">
          <p class="error-msg">Failed to retrieve order history.</p>
        </div>
      `;
    }
  }

  els.closeMyOrdersModalBtn.addEventListener('click', () => {
    els.myOrdersModal.classList.remove('active');
  });

  // ================= Track Order Modal =================
  function openTrackOrderModal() {
    els.trackResultContainer.style.display = 'none';
    els.trackQueryInput.value = '';
    els.trackOrderModal.classList.add('active');
  }

  els.navTrackOrderBtn.addEventListener('click', openTrackOrderModal);
  els.footerTrackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openTrackOrderModal();
  });
  els.closeTrackOrderModalBtn.addEventListener('click', () => {
    els.trackOrderModal.classList.remove('active');
  });

  els.trackOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = els.trackQueryInput.value.trim();
    if (!query) return;

    try {
      const res = await API.trackOrder(query);
      const order = res.order;
      renderTrackResult(order);
    } catch (err) {
      els.trackResultContainer.style.display = 'block';
      els.trackResultContainer.innerHTML = `
        <div class="empty-state" style="padding: 20px;">
          <p style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> ${err.message}</p>
        </div>
      `;
    }
  });

  function renderTrackResult(order) {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statuses.indexOf(order.orderStatus);

    els.trackResultContainer.style.display = 'block';
    els.trackResultContainer.innerHTML = `
      <div class="track-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4>${order.orderNumber}</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">Tracking: ${order.trackingNumber}</span>
          </div>
          <span class="status-pill status-${order.orderStatus.toLowerCase()}">${order.orderStatus}</span>
        </div>

        <!-- Visual Step Timeline -->
        <div class="tracking-timeline">
          ${statuses.map((step, idx) => {
            let stepClass = '';
            if (idx < currentIdx) stepClass = 'completed';
            else if (idx === currentIdx) stepClass = 'active';

            return `
              <div class="timeline-step ${stepClass}">
                <div class="step-dot">
                  <i class="fa-solid ${idx <= currentIdx ? 'fa-check' : 'fa-clock'}"></i>
                </div>
                <span>${step}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div style="font-size:0.84rem; color:var(--text-secondary); margin-top:14px; border-top:1px solid var(--border-color); padding-top:10px;">
          Destination: <strong>${order.shippingAddress.city}, ${order.shippingAddress.country}</strong> &bull; Total: <strong>$${order.total.toFixed(2)}</strong>
        </div>
      </div>
    `;
  }

  // ================= Active Coupons Modal =================
  function openCouponsModal() {
    els.couponInfoModal.classList.add('active');
  }

  els.heroPromoBtn.addEventListener('click', openCouponsModal);
  els.footerCouponsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCouponsModal();
  });
  els.closeCouponInfoModalBtn.addEventListener('click', () => {
    els.couponInfoModal.classList.remove('active');
  });

  document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
        els.couponInfoModal.classList.remove('active');
        els.couponCodeInput.value = code;
        openCartDrawer();
      });
    });
  });

  // ================= Admin Dashboard Suite =================
  function switchView(view) {
    state.activeView = view;
    if (view === 'admin') {
      if (!state.user || state.user.role !== 'admin') {
        showToast('Administrator privileges required. Sign in as Admin.', 'error');
        openAuthModal('login');
        return;
      }
      els.storefrontView.style.display = 'none';
      els.adminView.style.display = 'block';
      loadAdminData();
    } else {
      els.adminView.style.display = 'none';
      els.storefrontView.style.display = 'block';
      loadProducts();
    }
  }

  // Admin Subtabs: Inventory vs Orders
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      document.getElementById('adminProductsPane').style.display = target === 'products' ? 'block' : 'none';
      document.getElementById('adminOrdersPane').style.display = target === 'orders' ? 'block' : 'none';
    });
  });

  async function loadAdminData() {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        API.getAdminStats(),
        API.getProducts(),
        API.getAllOrders()
      ]);

      state.adminData.stats = statsRes.stats;
      state.adminData.products = productsRes.products || [];
      state.adminData.orders = ordersRes.orders || [];

      renderAdminStats(state.adminData.stats);
      renderAdminProducts(state.adminData.products);
      renderAdminOrders(state.adminData.orders);
    } catch (err) {
      showToast('Error loading admin dashboard: ' + err.message, 'error');
    }
  }

  function renderAdminStats(stats) {
    if (!stats) return;
    els.adminStatRevenue.textContent = `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    els.adminStatOrders.textContent = stats.totalOrders;
    els.adminStatProducts.textContent = stats.totalProducts;
    els.adminStatLowStock.textContent = stats.lowStockCount;
  }

  function renderAdminProducts(products) {
    const q = els.adminProductSearchInput.value.trim().toLowerCase();
    const filtered = q
      ? products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      : products;

    els.adminProductsTableBody.innerHTML = filtered.map(p => `
      <tr>
        <td>
          <div class="table-product-meta">
            <img src="${p.image}" alt="${p.name}" class="table-product-thumb">
            <div>
              <strong>${p.name}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted);">ID: ${p.id}</div>
            </div>
          </div>
        </td>
        <td><span class="qv-tag-pill">${p.category}</span></td>
        <td><strong>$${p.price.toFixed(2)}</strong></td>
        <td>
          <span style="font-weight:700; color:${p.stock <= 5 ? 'var(--danger)' : 'var(--text-primary)'};">
            ${p.stock} units
          </span>
        </td>
        <td><i class="fa-solid fa-star" style="color:var(--warning);"></i> ${p.rating.toFixed(1)}</td>
        <td>
          <span class="status-pill ${p.stock > 0 ? 'status-delivered' : 'status-cancelled'}">
            ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
        <td>
          <div class="action-btns-group">
            <button class="btn btn-sm btn-outline" data-admin-action="edit-product" data-id="${p.id}" title="Edit product">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-sm btn-outline danger" data-admin-action="delete-product" data-id="${p.id}" title="Delete product">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderAdminOrders(orders) {
    const q = els.adminOrderSearchInput.value.trim().toLowerCase();
    const statusFilter = els.adminOrderStatusFilter.value;

    let filtered = orders;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(o => o.orderStatus.toLowerCase() === statusFilter.toLowerCase());
    }
    if (q) {
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    els.adminOrdersTableBody.innerHTML = filtered.map(o => `
      <tr>
        <td><strong>${o.orderNumber}</strong></td>
        <td>
          <div>${o.customerName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${o.customerEmail}</div>
        </td>
        <td>${o.items.length} item${o.items.length > 1 ? 's' : ''}</td>
        <td><strong>$${o.total.toFixed(2)}</strong></td>
        <td>${o.paymentMethod}</td>
        <td>
          <select class="form-select form-select-sm admin-order-status-select" data-order-id="${o.id}">
            <option value="Pending" ${o.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td><code>${o.trackingNumber || '-'}</code></td>
        <td>
          <button class="btn btn-sm btn-outline" data-admin-action="view-order-details" data-id="${o.id}">
            <i class="fa-solid fa-eye"></i> View
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Admin search inputs
  els.adminProductSearchInput.addEventListener('input', () => {
    renderAdminProducts(state.adminData.products);
  });

  els.adminOrderSearchInput.addEventListener('input', () => {
    renderAdminOrders(state.adminData.orders);
  });

  els.adminOrderStatusFilter.addEventListener('change', () => {
    renderAdminOrders(state.adminData.orders);
  });

  // Admin Order Status Update Listener
  els.adminOrdersTableBody.addEventListener('change', async (e) => {
    if (e.target.classList.contains('admin-order-status-select')) {
      const orderId = e.target.getAttribute('data-order-id');
      const newStatus = e.target.value;

      try {
        await API.updateOrderStatus(orderId, newStatus);
        showToast(`Order status updated to "${newStatus}"`, 'success');
        loadAdminData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  });

  // Admin Product Actions (Add, Edit, Delete)
  els.openAddProductModalBtn.addEventListener('click', () => {
    els.productModalTitle.textContent = 'Add New Catalog Product';
    els.productForm.reset();
    els.adminProductId.value = '';
    els.productModal.classList.add('active');
  });

  els.closeProductModalBtn.addEventListener('click', () => {
    els.productModal.classList.remove('active');
  });
  els.cancelProductModalBtn.addEventListener('click', () => {
    els.productModal.classList.remove('active');
  });

  els.adminProductsTableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-admin-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-admin-action');
    const id = btn.getAttribute('data-id');

    if (action === 'delete-product') {
      if (confirm('Are you sure you want to delete this product from the catalog?')) {
        try {
          await API.deleteProduct(id);
          showToast('Product deleted successfully.', 'info');
          loadAdminData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    } else if (action === 'edit-product') {
      const prod = state.adminData.products.find(p => p.id === id);
      if (!prod) return;

      els.productModalTitle.textContent = 'Edit Product Specifications';
      els.adminProductId.value = prod.id;
      els.adminProdName.value = prod.name;
      els.adminProdCategory.value = prod.category;
      els.adminProdPrice.value = prod.price;
      els.adminProdOrigPrice.value = prod.originalPrice || '';
      els.adminProdStock.value = prod.stock;
      els.adminProdImage.value = prod.image;
      els.adminProdDesc.value = prod.description || '';
      els.adminProdBadge.value = prod.badge || '';
      els.adminProdTags.value = Array.isArray(prod.tags) ? prod.tags.join(', ') : '';
      els.adminProdFeatured.checked = Boolean(prod.featured);

      els.productModal.classList.add('active');
    }
  });

  els.productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = els.adminProductId.value;
    const payload = {
      name: els.adminProdName.value.trim(),
      category: els.adminProdCategory.value,
      price: parseFloat(els.adminProdPrice.value),
      originalPrice: els.adminProdOrigPrice.value ? parseFloat(els.adminProdOrigPrice.value) : null,
      stock: parseInt(els.adminProdStock.value, 10),
      image: els.adminProdImage.value.trim(),
      description: els.adminProdDesc.value.trim(),
      badge: els.adminProdBadge.value.trim() || null,
      tags: els.adminProdTags.value.trim() ? els.adminProdTags.value.split(',').map(t => t.trim()) : [],
      featured: els.adminProdFeatured.checked
    };

    try {
      if (id) {
        await API.updateProduct(id, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await API.createProduct(payload);
        showToast('New product added to catalog!', 'success');
      }

      els.productModal.classList.remove('active');
      loadAdminData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Announcement Bar dismiss
  els.closeAnnouncementBtn.addEventListener('click', () => {
    els.announcementBar.style.display = 'none';
  });

  // Logo click: return to home
  els.brandLogo.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ================= Initialize App =================
  initTheme();
  updateAuthUI();
  loadProducts();
  syncCart();
});
