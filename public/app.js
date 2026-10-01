// Shared frontend logic

// Render product cards
function productCard(p) {
  return `
    <div class="product-card">
      <img src="${p.image || 'https://placehold.co/400x300/222/e11?text=Galaxy'}" alt="${p.name}">
      <div class="body">
        <h3>${p.name}</h3>
        <span class="badge">${p.category} · ${p.branch}</span>
        <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
        <p style="color:#888;font-size:.85rem;margin:6px 0">${(p.description || '').slice(0, 80)}</p>
        <a class="btn" style="padding:8px 16px;font-size:.9rem"
           href="contact.html?product=${encodeURIComponent(p.name)}">Enquire</a>
      </div>
    </div>`;
}

// Featured products on home page
if (document.getElementById('featured-grid')) {
  fetch('/api/products')
    .then(r => r.json())
    .then(products => {
      document.getElementById('featured-grid').innerHTML =
        products.slice(0, 4).map(productCard).join('') ||
        '<p>No products yet. Add some from the admin panel.</p>';
    });
}

// Products page with filters
if (document.getElementById('product-grid')) {
  const grid = document.getElementById('product-grid');
  function loadProducts(cat) {
    fetch('/api/products' + (cat ? '?category=' + cat : ''))
      .then(r => r.json())
      .then(products => {
        grid.innerHTML = products.map(productCard).join('') ||
          '<p>No products in this category yet.</p>';
      });
  }
  document.getElementById('filters').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    loadProducts(e.target.dataset.cat);
  });
  loadProducts('');
}

// Blog page
if (document.getElementById('blog-list')) {
  fetch('/api/blogs')
    .then(r => r.json())
    .then(blogs => {
      document.getElementById('blog-list').innerHTML = blogs.map(b => `
        <article class="blog-post">
          <h3>${b.title}</h3>
          <span class="date">${new Date(b.createdAt).toLocaleDateString('en-IN')}${b.author ? ' · by ' + b.author : ''}</span>
          <p>${b.content.slice(0, 300)}${b.content.length > 300 ? '...' : ''}</p>
        </article>`).join('') || '<p>No blog posts yet.</p>';
    });
}

// Contact form
if (document.getElementById('inquiry-form')) {
  // Pre-fill message if coming from a product "Enquire" button
  const params = new URLSearchParams(location.search);
  if (params.get('product')) {
    document.getElementById('message').value = `I'm interested in: ${params.get('product')}`;
  }

  document.getElementById('inquiry-form').addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      })
    });
    if (res.ok) {
      status.textContent = '✅ Enquiry sent! We will contact you soon.';
      e.target.reset();
    } else {
      status.textContent = '❌ Something went wrong. Please try again.';
      status.style.color = '#e11';
    }
  });
}
