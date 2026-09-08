const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => [...ctx.querySelectorAll(q)];

const PRODUCTS = {
  'cloud-nine-notebook': { id: 'cloud-nine-notebook', name: 'Cloud Nine Notebook', category: 'NOTEBOOK', price: 1699, image: 'img/notebook.jpg', description: 'A cheerful notebook made for ideas, lesson notes, lists, doodles and the thoughts you do not want to lose.' },
  'tiny-triumphs-sticky-set': { id: 'tiny-triumphs-sticky-set', name: 'Tiny Triumphs Sticky Set', category: 'STICKY NOTES', price: 799, image: 'img/sticky set.png', description: 'Small colorful notes for reminders, page markers, quick ideas and the tiny tasks that are easier when you can see them.' },
  'doodle-juice-gel-pens': { id: 'doodle-juice-gel-pens', name: 'Doodle Juice Gel Pens', category: 'GEL PENS', price: 1299, image: 'img/gel pens.png', description: 'A bright gel pen set for smooth notes, headings, doodles and colorful details that make pages easier to scan.' },
  'highlighter-juice-trio': { id: 'highlighter-juice-trio', name: 'Highlighter Juice Trio', category: 'HIGHLIGHTERS', price: 899, image: 'img/highlighters.png', description: 'Three useful highlighters for marking key ideas, organizing revision and making important information stand out.' },
  'bright-ideas-desk-pad': { id: 'bright-ideas-desk-pad', name: 'Bright Ideas Desk Pad', category: 'DESK PAD', price: 1499, image: 'img/pad.png', description: 'A roomy desk pad for planning, quick notes, small reminders and keeping today’s most important ideas in view.' },
  'wobbly-washi-tape-set': { id: 'wobbly-washi-tape-set', name: 'Wobbly Washi Tape Set', category: 'WASHI TAPE', price: 999, image: 'img/tape sets.png', description: 'Decorative tape for notebooks, projects, labels and crafts when plain pages need a little Scribbly personality.' },
  'ready-for-school-pencil-pouch': { id: 'ready-for-school-pencil-pouch', name: 'Ready-for-School Pencil Pouch', category: 'PENCIL POUCH', price: 1799, image: 'img/pouch.png', description: 'A simple pouch that keeps pens, pencils, markers and small desk tools together instead of disappearing into the bottom of a bag.' }
};

const formatPKR = value => `PKR ${Number(value).toLocaleString('en-PK')}`;
const readJSON = (key, fallback) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getCart = () => readJSON('scribblyCart', []);
const saveCart = cart => {
  writeJSON('scribblyCart', cart);
  updateBagCounts();
};
const getUser = () => readJSON('scribblyUser', null);
const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

let toastTimer;
let toastActionHandler;
function showToast(message, actionLabel = '', actionHandler = null) {
  const toast = $('[data-toast]');
  if (!toast) return;
  const messageEl = $('[data-toast-message]', toast);
  const action = $('[data-toast-action]', toast);
  if (messageEl) messageEl.textContent = message;
  if (action) {
    action.hidden = !actionLabel;
    action.textContent = actionLabel || '';
    if (toastActionHandler) action.removeEventListener('click', toastActionHandler);
    toastActionHandler = actionHandler;
    if (actionHandler) action.addEventListener('click', actionHandler, { once: true });
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), actionLabel ? 5000 : 2200);
}

function updateBagCounts() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  $$('[data-bag-count]').forEach(el => el.textContent = String(count));
  const dashCount = $('[data-dashboard-bag-count]');
  if (dashCount) dashCount.textContent = String(count);
}

function addToCart(id, qty = 1) {
  if (!PRODUCTS[id]) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty = Math.min(10, existing.qty + qty);
  else cart.push({ id, qty: Math.min(10, Math.max(1, qty)) });
  saveCart(cart);
  const prefix = qty > 1 ? `${qty}× ` : '';
  showToast(`${prefix}${PRODUCTS[id].name} added to cart ✦`, 'View cart', () => {
    location.href = 'cart.html';
  });
}

function syncAuthUI() {
  const user = getUser();
  $$('[data-auth="guest"]').forEach(el => el.hidden = Boolean(user));
  $$('[data-auth="member"]').forEach(el => el.hidden = !user);
}

function logout() {
  localStorage.removeItem('scribblyUser');
  syncAuthUI();
  showToast('You are logged out. See you soon ✦');
  setTimeout(() => location.href = 'index.html', 450);
}

$$('[data-logout]').forEach(btn => btn.addEventListener('click', logout));

const menuToggle = $('[data-menu-toggle]');
const nav = $('#mainNav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));
  document.addEventListener('click', event => {
    if (!nav.classList.contains('mobile-open')) return;
    if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
    nav.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
}

const reveals = $$('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

const pageSections = $$('main section[id]');
const anchorNavLinks = $$('#mainNav a[href^="index.html#"], #mainNav a[href^="#"]');
if ('IntersectionObserver' in window && pageSections.length && anchorNavLinks.length && location.pathname.endsWith('index.html')) {
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    anchorNavLinks.forEach(link => {
      const href = link.getAttribute('href').replace('index.html', '');
      link.classList.toggle('active', href === `#${entry.target.id}`);
    });
  }), { rootMargin: '-35% 0px -55% 0px' });
  pageSections.forEach(section => sectionObserver.observe(section));
}

$$('.faq-item button').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  $$('.faq-item').forEach(faq => {
    faq.classList.remove('open');
    const btn = $('button', faq);
    const icon = $('i', faq);
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = '＋';
  });
  if (!wasOpen) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    const icon = $('i', item);
    if (icon) icon.textContent = '−';
  }
}));

const searchOverlay = $('[data-search-overlay]');
const searchInput = $('[data-search-input]');
const searchHint = $('[data-search-hint]');
function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput?.focus(), 80);
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  searchOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$$('[data-search-open]').forEach(btn => btn.addEventListener('click', openSearch));
$('[data-search-close]')?.addEventListener('click', closeSearch);
searchOverlay?.addEventListener('click', event => { if (event.target === searchOverlay) closeSearch(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSearch(); });
searchInput?.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const matches = Object.values(PRODUCTS).filter(p => `${p.name} ${p.category}`.toLowerCase().includes(q));
  if (!searchHint) return;
  searchHint.textContent = q ? (matches.length ? `Matching: ${matches.map(p => p.name).join(' · ')}` : 'No exact match. Try notebook, gel pens, sticky notes, highlighter, tape or pouch.') : 'Popular: notebook, gel pens, sticky notes, pouch';
});
searchInput?.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const q = encodeURIComponent(searchInput.value.trim());
  location.href = `products.html${q ? `?q=${q}` : ''}`;
});

$$('[data-add-to-cart]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.addToCart;
  const card = button.closest('.product-card');
  const qtyOutput = card ? card.querySelector('[data-card-qty]') : null;
  const qty = qtyOutput ? parseInt(qtyOutput.textContent, 10) || 1 : 1;
  addToCart(id, qty);
  const label = $('span', button);
  const icon = $('strong', button);
  const originalText = label ? label.textContent : 'Add to cart';
  button.classList.add('added');
  if (label) label.textContent = 'Added';
  if (icon) icon.textContent = '✓';
  setTimeout(() => {
    button.classList.remove('added');
    if (label) label.textContent = originalText;
    if (icon) icon.textContent = '＋';
    if (qtyOutput) qtyOutput.textContent = '1';
  }, 1300);
}));

$$('[data-newsletter-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('input[type="email"]', form);
  const msg = $('[data-newsletter-msg]', form);
  if (!input || !input.validity.valid) {
    if (msg) msg.textContent = 'Add a valid email first — your entry is still here.';
    input?.focus();
    return;
  }
  if (msg) msg.textContent = 'You are on our list. Tiny celebration! ✦';
  form.reset();
}));

function setError(input, message) {
  if (!input) return;
  const error = document.querySelector(`[data-error-for="${input.id}"]`);
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function clearErrorOnInput(input) {
  if (!input) return;
  const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
  input.addEventListener(eventName, () => setError(input, ''));
}

$$('input[id], select[id], textarea[id]').forEach(clearErrorOnInput);

$$('.show-password').forEach(button => button.addEventListener('click', () => {
  const input = document.getElementById(button.dataset.target);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  button.textContent = isHidden ? 'Hide' : 'Show';
  button.setAttribute('aria-label', `${isHidden ? 'Hide' : 'Show'} password`);
}));

function validateEmail(input) {
  if (!input.value.trim()) return 'Please enter your email address.';
  if (!input.validity.valid) return 'Use an email like name@example.com.';
  return '';
}

function validateRequired(input, label) {
  return input.value.trim() ? '' : `Please enter ${label}.`;
}

$('#loginForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#loginEmail');
  const password = $('#loginPassword');
  const status = $('[data-auth-status]');
  const emailError = validateEmail(email);
  const passwordError = password.value.length < 6 ? 'Password needs at least 6 characters.' : '';
  setError(email, emailError);
  setError(password, passwordError);
  if (emailError || passwordError) {
    if (status) { status.textContent = 'Check the highlighted field and try again. Nothing you typed was cleared.'; status.className = 'form-status error'; }
    (emailError ? email : password).focus();
    return;
  }
  const existing = getUser();
  const derivedName = email.value.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  writeJSON('scribblyUser', existing || { firstName: derivedName || 'Scribbly', lastName: 'Friend', email: email.value.trim() });
  if (status) { status.textContent = 'Login successful. Opening your dashboard…'; status.className = 'form-status success'; }
  showToast('Welcome back ✦');
  setTimeout(() => location.href = 'dashboard.html', 700);
});

$('#signupForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const firstName = $('#signupFirstName');
  const lastName = $('#signupLastName');
  const email = $('#signupEmail');
  const password = $('#signupPassword');
  const confirm = $('#signupConfirm');
  const terms = $('#termsCheck');
  const status = $('[data-auth-status]');
  const errors = [
    [firstName, validateRequired(firstName, 'your first name')],
    [lastName, validateRequired(lastName, 'your last name')],
    [email, validateEmail(email)],
    [password, password.value.length < 6 ? 'Use at least 6 characters.' : ''],
    [confirm, !confirm.value ? 'Please type the password again.' : confirm.value !== password.value ? 'The two passwords do not match yet.' : ''],
    [terms, terms.checked ? '' : 'Please agree before creating your account.']
  ];
  errors.forEach(([input, message]) => setError(input, message));
  const firstInvalid = errors.find(([, message]) => message)?.[0];
  if (firstInvalid) {
    if (status) { status.textContent = 'A few details need attention. Your other entries have been kept.'; status.className = 'form-status error'; }
    firstInvalid.focus();
    return;
  }
  writeJSON('scribblyUser', { firstName: firstName.value.trim(), lastName: lastName.value.trim(), email: email.value.trim() });
  if (status) { status.textContent = 'Account created. Opening your dashboard…'; status.className = 'form-status success'; }
  showToast(`Welcome, ${firstName.value.trim()} ✦`);
  setTimeout(() => location.href = 'dashboard.html', 700);
});

$('[data-forgot-password]')?.addEventListener('click', () => {
  const email = $('#loginEmail');
  if (!email?.value.trim() || !email.validity.valid) {
    setError(email, 'Enter your email first so we know where to send a reset link.');
    email?.focus();
    return;
  }
  showToast(`Reset link sent to ${email.value.trim()} ✦`);
});

$$('[data-social-provider]').forEach(button => button.addEventListener('click', () => {
  const provider = button.dataset.socialProvider;
  writeJSON('scribblyUser', { firstName: 'Scribbly', lastName: 'Friend', email: `${provider.toLowerCase()}@scribbly.store` });
  showToast(`${provider} sign-in complete ✦`);
  setTimeout(() => location.href = 'dashboard.html', 650);
}));

$$('.qty-pill').forEach(button => button.addEventListener('click', () => {
  $$('.qty-pill').forEach(pill => {
    pill.classList.remove('active');
    pill.setAttribute('aria-pressed', 'false');
  });
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
}));

$('#bulkForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const first = $('#bulkFirstName');
  const last = $('#bulkLastName');
  const email = $('#bulkEmail');
  const product = $('#bulkProduct');
  const status = $('[data-bulk-status]');
  const errors = [
    [first, validateRequired(first, 'your first name')],
    [last, validateRequired(last, 'your last name')],
    [email, validateEmail(email)],
    [product, product.value ? '' : 'Please choose a product or mixed bundle.']
  ];
  errors.forEach(([input, message]) => setError(input, message));
  const firstInvalid = errors.find(([, message]) => message)?.[0];
  if (firstInvalid) {
    if (status) { status.textContent = 'Please fix the highlighted field. The rest of your request is still here.'; status.className = 'form-status error'; }
    firstInvalid.focus();
    return;
  }
  if (status) { status.textContent = `Thanks, ${first.value.trim()}! Your request has been received.`; status.className = 'form-status success'; }
  showToast('School-order request submitted ✦');
  event.target.reset();
  const firstPill = $('.qty-pill');
  $$('.qty-pill').forEach(pill => { pill.classList.remove('active'); pill.setAttribute('aria-pressed', 'false'); });
  if (firstPill) { firstPill.classList.add('active'); firstPill.setAttribute('aria-pressed', 'true'); }
});

function initShop() {
  const grid = $('[data-shop-grid]');
  if (!grid) return;
  const buttons = $$('.filter-btn');
  const search = $('#shopSearch');
  const count = $('[data-shop-count]');
  const empty = $('[data-shop-empty]');
  let filter = 'all';
  const initialQuery = new URLSearchParams(location.search).get('q') || '';
  if (search && initialQuery) search.value = initialQuery;
  function apply() {
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    $$('.product-card', grid).forEach(card => {
      const matchesFilter = filter === 'all' || card.dataset.category === filter;
      const matchesQuery = !q || `${card.dataset.productName} ${card.dataset.category}`.toLowerCase().includes(q);
      const show = matchesFilter && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    if (empty) empty.hidden = visible !== 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    buttons.forEach(btn => { btn.classList.toggle('active', btn === button); btn.setAttribute('aria-pressed', String(btn === button)); });
    apply();
  }));
  search?.addEventListener('input', apply);
  $('[data-clear-filters]')?.addEventListener('click', () => {
    filter = 'all';
    if (search) search.value = '';
    buttons.forEach(btn => { const active = btn.dataset.filter === 'all'; btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active)); });
    apply();
    search?.focus();
  });
  apply();
}

function initProductDetail() {
  const root = $('[data-product-detail]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const id = PRODUCTS[params.get('id')] ? params.get('id') : 'cloud-nine-notebook';
  const product = PRODUCTS[id];
  const image = $('[data-detail-image]');
  if (image) { image.src = product.image; image.alt = product.name; }
  $('[data-detail-category]').textContent = product.category;
  $('[data-detail-name]').textContent = product.name;
  $('[data-detail-price]').textContent = formatPKR(product.price);
  $('[data-detail-description]').textContent = product.description;
  document.title = `${product.name} — Scribbly`;
  let qty = 1;
  const output = $('[data-detail-qty]');
  const renderQty = () => { if (output) output.textContent = String(qty); };
  $('[data-qty-minus]')?.addEventListener('click', () => { if (qty > 1) qty -= 1; else showToast('Quantity is already at 1 ✦'); renderQty(); });
  $('[data-qty-plus]')?.addEventListener('click', () => { if (qty < 10) qty += 1; else showToast('Maximum quantity is 10 per order ✦'); renderQty(); });
  $('[data-detail-add]')?.addEventListener('click', () => addToCart(id, qty));
}

function cartTotals(cart = getCart()) {
  const subtotal = cart.reduce((sum, item) => sum + (PRODUCTS[item.id]?.price || 0) * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const delivery = count === 0 ? 0 : subtotal >= 4999 ? 0 : 250;
  return { subtotal, count, delivery, total: subtotal + delivery };
}

function renderCartPage() {
  const list = $('[data-cart-list]');
  if (!list) return;
  const cart = getCart().filter(item => PRODUCTS[item.id]);
  if (cart.length === 0) {
    list.innerHTML = '<div class="empty-cart"><div class="empty-icon">✎</div><h2>Your bag is ready for an idea.</h2><p>Nothing is in it yet. Browse the shelf and add something you like.</p><a class="btn btn-primary" href="products.html">Browse products</a></div>';
  } else {
    list.innerHTML = cart.map(item => {
      const p = PRODUCTS[item.id];
      return `<article class="cart-item" data-cart-id="${p.id}"><a class="cart-item-media" href="product.html?id=${p.id}"><img src="${p.image}" alt="${escapeHTML(p.name)}"></a><div class="cart-item-copy"><h2><a href="product.html?id=${p.id}">${escapeHTML(p.name)}</a></h2><p>${formatPKR(p.price)} each</p></div><div class="cart-item-actions"><div class="quantity-control"><button type="button" data-cart-minus aria-label="Decrease ${escapeHTML(p.name)} quantity">−</button><output aria-live="polite">${item.qty}</output><button type="button" data-cart-plus aria-label="Increase ${escapeHTML(p.name)} quantity">＋</button></div><button class="cart-remove" type="button" data-cart-remove>Remove</button></div></article>`;
    }).join('');
  }
  const totals = cartTotals(cart);
  $('[data-summary-items]').textContent = String(totals.count);
  $('[data-summary-subtotal]').textContent = formatPKR(totals.subtotal);
  $('[data-summary-delivery]').textContent = totals.delivery === 0 && totals.count ? 'FREE' : formatPKR(totals.delivery);
  $('[data-summary-total]').textContent = formatPKR(totals.total);
  const checkout = $('[data-checkout-link]');
  if (checkout) {
    checkout.setAttribute('aria-disabled', String(cart.length === 0));
    checkout.style.pointerEvents = cart.length === 0 ? 'none' : '';
    checkout.style.opacity = cart.length === 0 ? '.48' : '';
  }
  $$('[data-cart-id]').forEach(row => {
    const id = row.dataset.cartId;
    $('[data-cart-minus]', row)?.addEventListener('click', () => changeCartQty(id, -1));
    $('[data-cart-plus]', row)?.addEventListener('click', () => changeCartQty(id, 1));
    $('[data-cart-remove]', row)?.addEventListener('click', () => removeCartItem(id));
  });
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const next = item.qty + delta;
  if (next < 1) {
    showToast('Use Remove if you want to take this item out ✦');
    return;
  }
  if (next > 10) {
    showToast('Maximum quantity is 10 per item ✦');
    return;
  }
  item.qty = next;
  saveCart(cart);
  renderCartPage();
}

function removeCartItem(id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index < 0) return;
  const removed = cart[index];
  const product = PRODUCTS[id];
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  showToast(`${product.name} removed`, 'Undo', () => {
    const current = getCart();
    current.splice(Math.min(index, current.length), 0, removed);
    saveCart(current);
    renderCartPage();
    showToast(`${product.name} is back in your bag ✦`);
  });
}

function renderCheckout() {
  const items = $('[data-checkout-items]');
  if (!items) return;
  const cart = getCart().filter(item => PRODUCTS[item.id]);
  const totals = cartTotals(cart);
  if (!cart.length) {
    items.innerHTML = '<p class="summary-note">Your bag is empty. Add a product before using checkout.</p>';
    const button = $('#checkoutForm button[type="submit"]');
    if (button) { button.disabled = true; button.style.opacity = '.5'; button.style.cursor = 'not-allowed'; }
  } else {
    items.innerHTML = cart.map(item => { const p = PRODUCTS[item.id]; return `<div class="checkout-line"><img src="${p.image}" alt=""><div><b>${escapeHTML(p.name)}</b><small>Qty ${item.qty}</small></div><strong>${formatPKR(p.price * item.qty)}</strong></div>`; }).join('');
  }
  $('[data-checkout-total]').textContent = formatPKR(totals.total);
  const user = getUser();
  if (user) {
    const name = $('#checkoutName');
    const email = $('#checkoutEmail');
    if (name && !name.value) name.value = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (email && !email.value) email.value = user.email || '';
  }
}

function validateCheckout() {
  const name = $('#checkoutName');
  const phone = $('#checkoutPhone');
  const address = $('#checkoutAddress');
  const city = $('#checkoutCity');
  const email = $('#checkoutEmail');
  const errors = [
    [name, validateRequired(name, 'your full name')],
    [phone, !phone.value.trim() ? 'Please enter a phone number.' : !phone.validity.valid ? 'Use 10–15 digits. Spaces, + and - are okay.' : ''],
    [address, validateRequired(address, 'your delivery address')],
    [city, validateRequired(city, 'your city')],
    [email, validateEmail(email)]
  ];
  errors.forEach(([input, message]) => setError(input, message));
  return errors.find(([, message]) => message)?.[0] || null;
}

$('#checkoutForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const invalid = validateCheckout();
  const status = $('[data-checkout-status]');
  if (invalid) {
    if (status) { status.textContent = 'Please correct the highlighted detail. Nothing you entered was cleared.'; status.className = 'form-status error'; }
    invalid.focus();
    return;
  }
  if (!getCart().length) {
    if (status) { status.textContent = 'Your bag is empty. Add a product before checkout.'; status.className = 'form-status error'; }
    return;
  }
  const totals = cartTotals();
  const payment = $('input[name="payment"]:checked')?.value || 'Cash on delivery';
  const details = $('[data-review-details]');
  details.innerHTML = `<p><span>Name</span><strong>${escapeHTML($('#checkoutName').value)}</strong></p><p><span>Address</span><strong>${escapeHTML($('#checkoutAddress').value)}, ${escapeHTML($('#checkoutCity').value)}</strong></p><p><span>Phone</span><strong>${escapeHTML($('#checkoutPhone').value)}</strong></p><p><span>Email</span><strong>${escapeHTML($('#checkoutEmail').value)}</strong></p><p><span>Payment</span><strong>${escapeHTML(payment)}</strong></p><p><span>Total</span><strong>${formatPKR(totals.total)}</strong></p>`;
  const panel = $('[data-review-panel]');
  panel.hidden = false;
  document.body.style.overflow = 'hidden';
  $('[data-confirm-order]')?.focus();
  if (status) { status.textContent = 'Review opened. You can go back and edit before confirming.'; status.className = 'form-status success'; }
});

$$('[data-review-edit]').forEach(button => button.addEventListener('click', () => {
  const panel = $('[data-review-panel]');
  if (panel) panel.hidden = true;
  document.body.style.overflow = '';
  $('#checkoutName')?.focus();
}));

$('[data-confirm-order]')?.addEventListener('click', () => {
  const totals = cartTotals();
  const cart = getCart().filter(item => PRODUCTS[item.id]);
  const payment = $('input[name="payment"]:checked')?.value || 'Cash on delivery';
  const nameVal = ($('#checkoutName')?.value || '').trim();
  const phoneVal = ($('#checkoutPhone')?.value || '').trim();
  const addressVal = ($('#checkoutAddress')?.value || '').trim();
  const cityVal = ($('#checkoutCity')?.value || '').trim();
  const emailVal = ($('#checkoutEmail')?.value || '').trim();
  const user = getUser();

  const order = {
    ref: `SCR-${String(Date.now()).slice(-6)}`,
    date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: totals.count,
    subtotal: totals.subtotal,
    delivery: totals.delivery,
    total: totals.total,
    status: 'Order confirmed',
    customer: {
      name: nameVal || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Customer'),
      phone: phoneVal,
      address: addressVal,
      city: cityVal,
      email: emailVal || (user ? user.email : ''),
      payment: payment
    },
    products: cart.map(item => {
      const p = PRODUCTS[item.id];
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        qty: item.qty
      };
    })
  };

  writeJSON('scribblyOrder', order);
  saveCart([]);
  const panel = $('[data-review-panel]');
  if (panel) panel.hidden = true;
  document.body.style.overflow = '';
  showToast('Order confirmed ✦');
  setTimeout(() => {
    location.href = 'order-success.html';
  }, 450);
});

function initOrderSuccess() {
  const page = $('[data-order-success-page]');
  if (!page) return;

  let order = readJSON('scribblyOrder', null);

  // If page is loaded without prior checkout, use realistic default stationery order
  if (!order || !order.products || !order.products.length) {
    const defaultProduct1 = PRODUCTS['cloud-nine-notebook'];
    const defaultProduct2 = PRODUCTS['doodle-juice-gel-pens'];
    order = {
      ref: 'SCR-482910',
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: 2,
      subtotal: defaultProduct1.price + defaultProduct2.price,
      delivery: 250,
      total: defaultProduct1.price + defaultProduct2.price + 250,
      status: 'Order confirmed',
      customer: {
        name: 'Ayesha Khan',
        phone: '0300 1234567',
        address: 'House 14, Street 7, Block 4, Clifton',
        city: 'Karachi',
        email: 'ayesha.khan@example.com',
        payment: 'Cash on delivery'
      },
      products: [
        {
          id: defaultProduct1.id,
          name: defaultProduct1.name,
          category: defaultProduct1.category,
          price: defaultProduct1.price,
          image: defaultProduct1.image,
          qty: 1
        },
        {
          id: defaultProduct2.id,
          name: defaultProduct2.name,
          category: defaultProduct2.category,
          price: defaultProduct2.price,
          image: defaultProduct2.image,
          qty: 1
        }
      ]
    };
  }

  // Populate order number & metadata
  $$('[data-success-ref]').forEach(el => el.textContent = order.ref);
  const dateEl = $('[data-success-date]');
  if (dateEl) dateEl.textContent = order.date;

  const paymentEl = $('[data-success-payment]');
  if (paymentEl) paymentEl.textContent = order.customer?.payment || 'Cash on delivery';

  const countEl = $('[data-success-items-count]');
  const totalItemCount = order.products ? order.products.reduce((acc, p) => acc + (p.qty || 1), 0) : (order.items || 1);
  if (countEl) countEl.textContent = String(totalItemCount);

  // Populate customer details
  const nameEl = $('[data-success-name]');
  if (nameEl) nameEl.textContent = order.customer?.name || 'Customer';

  const phoneEl = $('[data-success-phone]');
  if (phoneEl) phoneEl.textContent = order.customer?.phone || '—';

  const addressEl = $('[data-success-address]');
  if (addressEl) addressEl.textContent = order.customer?.address || '—';

  const cityEl = $('[data-success-city]');
  if (cityEl) cityEl.textContent = order.customer?.city || '—';

  const emailEl = $('[data-success-email]');
  if (emailEl) emailEl.textContent = order.customer?.email || '—';

  // Populate financial breakdown
  const subtotal = typeof order.subtotal === 'number'
    ? order.subtotal
    : (order.products ? order.products.reduce((acc, p) => acc + (p.price * p.qty), 0) : order.total);
  const delivery = typeof order.delivery === 'number'
    ? order.delivery
    : (subtotal >= 4999 ? 0 : 250);
  const total = typeof order.total === 'number' ? order.total : (subtotal + delivery);

  const subtotalEl = $('[data-success-subtotal]');
  if (subtotalEl) subtotalEl.textContent = formatPKR(subtotal);

  const deliveryEl = $('[data-success-delivery]');
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE' : formatPKR(delivery);

  const totalEl = $('[data-success-total]');
  if (totalEl) totalEl.textContent = formatPKR(total);

  // Populate purchased products list
  const listEl = $('[data-success-products-list]');
  if (listEl && order.products && order.products.length) {
    listEl.innerHTML = order.products.map(item => {
      const lineTotal = (item.price || 0) * (item.qty || 1);
      return `
        <article class="success-product-row">
          <div class="success-product-media">
            <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">
          </div>
          <div class="success-product-details">
            <span class="success-product-tag">${escapeHTML(item.category || 'STATIONERY')}</span>
            <h3 class="success-product-title">
              <a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHTML(item.name)}</a>
            </h3>
            <p class="success-product-meta">Qty: <strong>${item.qty || 1}</strong> × ${formatPKR(item.price)}</p>
          </div>
          <div class="success-product-total">
            ${formatPKR(lineTotal)}
          </div>
        </article>
      `;
    }).join('');
  }

  // Print receipt event
  $('[data-print-order]')?.addEventListener('click', () => {
    window.print();
  });
}

function initDashboard() {
  if (!$('.dashboard-main')) return;
  const user = getUser();
  if (!user) {
    location.replace('login.html');
    return;
  }
  $('[data-dashboard-name]').textContent = user.firstName || 'friend';
  $('[data-dashboard-email]').textContent = user.email || 'Member account';
  const order = readJSON('scribblyOrder', null);
  const box = $('[data-dashboard-order]');
  if (box && order) {
    box.innerHTML = `<div class="order-chip"><b>${escapeHTML(order.ref)}</b><span>${escapeHTML(order.date)} · ${order.items} item${order.items === 1 ? '' : 's'} · ${formatPKR(order.total)}</span><span>${escapeHTML(order.status)}</span><a class="text-link" href="order-success.html" style="margin-top:6px;display:inline-block;font-size:13px;font-weight:700;">View full order details</a></div>`;
  }
}

function initTermsPage() {
  const links = $$('.terms-nav-link');
  const sections = $$('.terms-section');
  if (!links.length || !sections.length) return;

  if (links[0]) links[0].classList.add('active');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-10% 0px -60% 0px' });

  sections.forEach(sec => observer.observe(sec));
}

$$('.terms-link').forEach(link => {
  link.addEventListener('click', e => e.stopPropagation());
});

function initCardQuantityControls() {
  $$('.product-card').forEach(card => {
    const minusBtn = card.querySelector('[data-card-qty-minus]');
    const plusBtn = card.querySelector('[data-card-qty-plus]');
    const output = card.querySelector('[data-card-qty]');
    if (!output || !minusBtn || !plusBtn) return;

    const getQty = () => Math.max(1, Math.min(10, parseInt(output.textContent, 10) || 1));
    const setQty = val => { output.textContent = String(Math.max(1, Math.min(10, val))); };

    minusBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const current = getQty();
      if (current > 1) {
        setQty(current - 1);
      } else {
        showToast('Quantity is already at 1 ✦');
      }
    });

    plusBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const current = getQty();
      if (current < 10) {
        setQty(current + 1);
      } else {
        showToast('Maximum quantity is 10 per order ✦');
      }
    });
  });
}

initShop();
initProductDetail();
initCardQuantityControls();
renderCartPage();
renderCheckout();
initDashboard();
initTermsPage();
initOrderSuccess();
updateBagCounts();
syncAuthUI();

