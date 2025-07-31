// ✅ MAIN SCRIPT - All functionalities are wrapped inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  
  // =============================
  // 1️⃣ LOAD PRODUCTS FROM JSON
  // =============================
  const container = document.getElementById("products-container");

  if (container) {
    fetch("./products.json")
      .then((res) => res.json())
      .then((products) => {
        // Build product cards dynamically
        products.forEach((product) => {
          container.innerHTML += `
            <div class="p-3 col-lg-3 col-md-6 col-12 position-relative">
              <div class="position-relative overflow-hidden p-0 m-0">
                <!-- Overlay with Add to Cart & Actions -->
                <div class="overlay position-absolute text-center w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                  <button class="btn bg-white border-0 add-to-cart"> Add To Cart</button>
                  <div class="overlay-icons d-flex justify-content-center align-items-center gap-3 mt-3">
                    <!-- Share -->
                    <div class="d-flex gap-1 text-white align-items-center justify-content-center">
                      <i class="fa-solid fa-share fa-lg"></i>
                      <p class="mt-2 fw-medium">Share</p>
                    </div>
                    <!-- Like -->
                    <div class="d-flex gap-1 text-white align-items-center justify-content-center">
                      <i class="fa-solid fa-heart fa-lg"></i>
                      <p class="mt-2 fw-medium">Like</p>
                    </div>
                    <!-- Compare -->
                    <div class="d-flex gap-1 text-white align-items-center justify-content-center">
                      <i class="fa-solid fa-code-compare fa-lg"></i>
                      <p class="mt-2 fw-medium">Compare</p>
                    </div>
                  </div>
                </div>
                <!-- Product Image & Info -->
                <img src="${product.image}" alt="" class="w-100">
                <h4 class="fw-medium my-2">${product.name}</h4>
                <p class="text-muted">${product.desc}</p>
                <div class="prices d-flex justify-content-between">
                  <p class="fw-bold fs-4">${product.price}</p>
                  <p class="text-muted fs-6"><del>${product.oldPrice}</del></p>
                </div>
              </div>
            </div>
          `;
        });

        // Add "Add to Cart" functionality
        const cartButtons = document.querySelectorAll(".add-to-cart");
        cartButtons.forEach((btn, index) => {
          btn.addEventListener("click", () => {
            const product = products[index];
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.name} has been added!`);
          });
        });
      });
  }

  // =============================
  // 2️⃣ LOAD CART ITEMS INTO TABLE
  // =============================
  const tbody = document.querySelector("tbody");

  if (tbody) {
    tbody.innerHTML = ""; // Clear existing rows
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      // Show empty cart message
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Cart is empty</td></tr>`;
      return;
    }

    // Render each cart item in a row
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      let quantity = 1; // Default quantity

      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" width="60" /></td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
          <input type="number" value="${quantity}" min="1"
                 class="form-control form-control-sm text-center mx-auto"
                 style="width: 60px; height: 30px; font-size: 14px;" />
        </td>
        <td>${item.price}</td>
        <td><button class="btn btn-brown delete-item" data-index="${index}">🗑️</button></td>
      `;
      tbody.appendChild(row);
    });

    // Delete item from cart
    document.querySelectorAll(".delete-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let index = e.target.dataset.index;
        cart.splice(index, 1); // Remove item
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload(); // Refresh cart page
      });
    });
  }

  // Sync cart between tabs/windows
  window.addEventListener("storage", function () {
    location.reload();
  });

  // =============================
  // 3️⃣ Off canvas
  // =============================
  const offcanvas = document.querySelector(".offcanvas-body");

  if (offcanvas) {
    offcanvas.innerHTML = ""; // Clear existing rows
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      // Show empty cart message
      offcanvas.innerHTML = `<p>< colspan="6" class="text-center">Cart is empty</p>`;
      return;
    }

    // Render each cart item in a row
    cart.forEach((item, index) => {
      const offdiv = document.createElement("div");

      offdiv.innerHTML = `
        <div class="d-flex gap-3 my-3 align-items-center"><img src="${item.image}" alt="${item.name}" width="60"class="rounded" />
        <p>${item.name}</p>
        <p>${item.price}</p>
        <p><button class="btn btn-brown delete-item" data-index="${index}">🗑️</button></p>
        </div>
      `;
      offcanvas.appendChild(offdiv);
    });

    // Delete item from cart
    document.querySelectorAll(".delete-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let index = e.target.dataset.index;
        cart.splice(index, 1); // Remove item
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload(); // Refresh cart page
      });
    });
  }

  // Sync cart between tabs/windows
  window.addEventListener("storage", function () {
    location.reload();
  });



  // =============================
  // 4️⃣ SCROLL TO TOP BUTTON
  // =============================
  const scrollUpBtn = document.getElementById("scrollUpBtn");
  if (scrollUpBtn) {
    window.addEventListener("scroll", () => {
      // scrollUpBtn.style.display = document.documentElement.scrollTop > 100 ? "block" : "none";
  if (this.window.scrollY >= 200) {
    scrollUpBtn.classList.remove("d-none");
  } else {
    scrollUpBtn.classList.add("d-none");
  }


    });
    scrollUpBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =============================
  // 5️⃣ CART SUBTOTAL & TOTAL UPDATES
  // =============================
  const cartRows = document.querySelectorAll('tbody tr');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const taxRate = 0.14;

  function updateTotals() {
    let subtotalAll = 0;
    cartRows.forEach(row => {
      const priceCell = row.querySelector('td:nth-child(3)');
      const qtyInput = row.querySelector('input[type="number"]');
      const subtotalCell = row.querySelector('td:nth-child(5)');

      if (priceCell && qtyInput && subtotalCell) {
        const price = Number(priceCell.innerText.replace(/[^\d]/g, '')) || 0;
        const qty = Number(qtyInput.value) || 1;
        const subtotal = price * qty;
        subtotalCell.innerText = 'Rp ' + subtotal.toLocaleString('id-ID');
        subtotalAll += subtotal;
      }
    });

    const tax = subtotalAll * taxRate;
    const total = subtotalAll + tax;

    if (cartSubtotal) cartSubtotal.innerText = 'Rp ' + subtotalAll.toLocaleString('id-ID');
    if (cartTotal) cartTotal.innerText = 'Rp ' + total.toLocaleString('id-ID');
  }

  // Listen for quantity changes
  cartRows.forEach(row => {
    const qtyInput = row.querySelector('input[type="number"]');
    if (qtyInput) qtyInput.addEventListener('input', updateTotals);
  });
  updateTotals(); // Initial totals

  // =============================
  // 6️⃣ CHECKOUT BUTTON REDIRECT
  // =============================
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = function () {
      let cartProducts = JSON.parse(localStorage.getItem('cart') || '[]');
      let subtotal = document.getElementById('cart-subtotal')?.innerText.replace(/[^\d]/g, '') || 0;
      let total = document.getElementById('cart-total')?.innerText.replace(/[^\d]/g, '') || 0;

      // Redirect to checkout page with query params
      window.location.href = `checkout.html?products=${encodeURIComponent(JSON.stringify(cartProducts))}&subtotal=${subtotal}&total=${total}`;
    };
  }

  // =============================
  // 7️⃣ PRODUCT COMPARISON SECTION
  // =============================
  const productList = document.getElementById('product-list');
  const compareBtn = document.getElementById('compare-btn');
  const comparisonResult = document.getElementById('comparison-result');

  if (productList && compareBtn && comparisonResult) {
    // ✅ Static product list with fixed features
    const products = [
      { name: "Syltherine", desc: "Stylish cafe chair", price: "Rp 2.500.000", oldPrice: "Rp 3.500.000", image: "./images/Images (15).png", style: "Modern", material: "Velvet", warranty: "1 Year", color: "Gray - Brown", rating: "⭐⭐⭐" },
      { name: "Liviosa", desc: "Stylish cafe chair", price: "Rp 4.500.000", oldPrice: "Rp 5.000.000", image: "./images/Images (22).png", style: "Classic", material: "Wood", warranty: "2 Years", color: "Black", rating: "⭐⭐⭐⭐" },
      { name: "Lolito", desc: "Stylish cafe chair", price: "Rp 2.550.000", oldPrice: "Rp 3.500.000", image: "./images/Images (16).png", style: "Retro", material: "Metal", warranty: "6 Months", color: "Blue", rating: "⭐⭐⭐⭐⭐" },
      { name: "Respira", desc: "Stylish cafe chair", price: "Rp 7.500.000", oldPrice: "Rp 3.500.000", image: "./images/Images (17).png", style: "Minimalist", material: "Plastic", warranty: "1 Year", color: "Gray", rating: "⭐⭐⭐⭐" }
    ];

    // ✅ Render products in the product list
    productList.innerHTML = products.map((p, i) => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex">
      <div class="card flex-fill">
        <img src="${p.image}" class="card-img-top" style="height:250px;object-fit:cover;">
        <div class="card-body text-center">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.desc}</p>
          <small class="text-secondary d-block mb-2"><del>${p.oldPrice}</del></small>
          <b class="text-success">${p.price}</b>
          <div>
            <input type="checkbox" class="compare-checkbox mt-2" value="${i}">
            <label>Compare</label>
          </div>
        </div>
      </div>
    </div>
  `).join('');

    // ✅ Handle product comparison
    compareBtn.onclick = () => {
      // Get all checked checkboxes and map them to their corresponding products
      const checked = [...document.querySelectorAll('.compare-checkbox:checked')].map(c => products[c.value]);

      // Show a warning if less than 2 products are selected
      if (checked.length < 2) {
        comparisonResult.innerHTML = `<div class="alert alert-dark w-100">Select at least two products to compare!</div>`;
        return;
      }

      // Render selected products for comparison
      comparisonResult.innerHTML = checked.map(p => `
      <div class="card shadow p-2" style="min-width:240px;max-width:260px;flex:1;">
        <img src="${p.image}" class="card-img-top" style="height:230px;object-fit:cover;">
        <div class="card-body">
          <h6 class="fw-bold">${p.name}</h6>
          <div class="text-muted mb-2">${p.desc}</div>
          <div><b>Price:</b> <span class="text-success">${p.price}</span></div>
          <div><b>Old Price:</b> <span class="text-secondary text-decoration-line-through">${p.oldPrice}</span></div>
          <div><b>Style:</b> ${p.style}</div>
          <div><b>Material:</b> ${p.material}</div>
          <div><b>Warranty:</b> ${p.warranty}</div>
          <div><b>Color:</b> ${p.color}</div>
          <div><b>Rating:</b> ${p.rating}</div>
        </div>
      </div>
    `).join('');
    };
  }

  // =============================
  // 8️⃣ CHECKOUT SUMMARY & VALIDATION
  // =============================
  const params = new URLSearchParams(window.location.search);
  const subtotal = params.get('subtotal');
  const total = params.get('total');

  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');

  // Show subtotal & total only
  if (subtotalEl && subtotal) subtotalEl.textContent = subtotal;
  if (totalEl && total) totalEl.textContent = total;



  if (subtotalEl) subtotalEl.innerText = subtotal ? 'Rp ' + Number(subtotal).toLocaleString('id-ID') : 'Rp 0';
  if (totalEl) totalEl.innerText = total ? 'Rp ' + Number(total).toLocaleString('id-ID') : 'Rp 0';

  // Validate form and show modal
  window.validateAndCheckout = function () {
    const form = document.querySelector("form");
    if (!form) return;

    if (form.checkValidity()) {
      // Show summary modal if form is valid
      showCheckoutSummary();
      const checkoutModalEl = document.getElementById('checkoutModal');
      if (checkoutModalEl) new bootstrap.Modal(checkoutModalEl).show();
    } else {
      form.reportValidity(); // Show browser validation errors
    }
  };

  // Show checkout summary in modal
  function showCheckoutSummary() {
    const subtotalValue = Number(subtotalEl?.innerText.replace(/[^\d]/g, '')) || 0;
    const taxRate = 0.14;
    const taxValue = subtotalValue * taxRate;
    const totalValue = subtotalValue + taxValue;

    document.getElementById('modalSubtotal').innerText = 'Rp ' + subtotalValue.toLocaleString('id-ID');
    document.getElementById('modalTax').innerText = 'Rp ' + taxValue.toLocaleString('id-ID');
    document.getElementById('modalTotal').innerText = 'Rp ' + totalValue.toLocaleString('id-ID');
  }
});
// Thumbnail carousel functionality
const thumbnails = document.querySelectorAll(".thumbnail");
const mainImage = document.getElementById("mainImage");

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", function () {
    // Remove active class from all thumbnails
    thumbnails.forEach((t) => t.classList.remove("active"));

    // Add active class to clicked thumbnail
    this.classList.add("active");

    // Change main image
    const imageUrl = this.getAttribute("data-image");
    mainImage.style.backgroundImage = `url('${imageUrl}')`;
  });
});