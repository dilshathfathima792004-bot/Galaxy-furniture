let adminKey = sessionStorage.getItem('adminKey') || '';

function login() {
  adminKey = document.getElementById('admin-key').value;
  sessionStorage.setItem('adminKey', adminKey);
  showPanel();
}

async function showPanel() {
  if (!adminKey) return;
  const res = await fetch('/api/inquiries', { headers: { 'x-admin-key': adminKey } });
  if (!res.ok) { alert('Wrong admin key'); sessionStorage.removeItem('adminKey'); adminKey = ''; return; }
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  loadInquiries();
}

async function loadInquiries() {
  const inquiries = await (await fetch('/api/inquiries', { headers: { 'x-admin-key': adminKey } })).json();
  document.getElementById('inquiry-list').innerHTML = inquiries.map(i => `
    <div class="inquiry-item">
      <strong>${i.name}</strong> · ${i.phone} ${i.email ? '· ' + i.email : ''}
      <p>${i.message}</p>
      <span class="meta">${new Date(i.createdAt).toLocaleString('en-IN')}</span><br>
      <select onchange="updateStatus('${i._id}', this.value)">
        <option ${i.status === 'new' ? 'selected' : ''}>new</option>
        <option ${i.status === 'contacted' ? 'selected' : ''}>contacted</option>
        <option ${i.status === 'closed' ? 'selected' : ''}>closed</option>
      </select>
    </div>`).join('') || '<p>No inquiries yet.</p>';
}

async function updateStatus(id, status) {
  await fetch('/api/inquiries/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ status })
  });
}

// Add product (with image upload)
document.getElementById('add-product-form').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('name', document.getElementById('p-name').value);
  fd.append('category', document.getElementById('p-category').value);
  fd.append('price', document.getElementById('p-price').value);
  fd.append('branch', document.getElementById('p-branch').value);
  fd.append('description', document.getElementById('p-desc').value);
  const img = document.getElementById('p-image').files[0];
  if (img) fd.append('image', img);

  const res = await fetch('/api/products', {
    method: 'POST', headers: { 'x-admin-key': adminKey }, body: fd
  });
  alert(res.ok ? '✅ Product added!' : '❌ Failed to add product');
  if (res.ok) e.target.reset();
});

// Add blog post
document.getElementById('add-blog-form').addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({
      title: document.getElementById('b-title').value,
      content: document.getElementById('b-content').value
    })
  });
  alert(res.ok ? '✅ Blog published!' : '❌ Failed to publish');
  if (res.ok) e.target.reset();
});

// Auto-login if key exists
showPanel();
