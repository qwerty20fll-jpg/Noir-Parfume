const products = [
  { id: 1, name: "Santal 33", category: "woody", type: "Древесный", notes: "Сандал · кардамон · кожа", price: 8900, volume: "50 мл", glow: "rgba(184,132,68,.22)", dark: "#4e3824", light: "#c39a5c" },
  { id: 2, name: "Rose Noire", category: "floral", type: "Цветочный", notes: "Роза · мускус · амбра", price: 7600, volume: "50 мл", glow: "rgba(170,82,91,.22)", dark: "#4b202b", light: "#ad6b70" },
  { id: 3, name: "Bois d'Or", category: "woody", type: "Древесный", notes: "Кедр · ветивер · пачули", price: 9400, volume: "75 мл", glow: "rgba(159,126,70,.2)", dark: "#3e3525", light: "#a28a55" },
  { id: 4, name: "Neroli Air", category: "fresh", type: "Свежий", notes: "Нероли · бергамот · чай", price: 6900, volume: "50 мл", glow: "rgba(108,159,141,.2)", dark: "#23483f", light: "#7da99a" },
  { id: 5, name: "Velvet Oud", category: "woody", type: "Восточный", notes: "Уд · шафран · ваниль", price: 11200, volume: "75 мл", glow: "rgba(149,102,64,.24)", dark: "#42281b", light: "#b07b48" },
  { id: 6, name: "Fleur Blanche", category: "floral", type: "Цветочный", notes: "Жасмин · белый чай · ирис", price: 8200, volume: "50 мл", glow: "rgba(182,161,134,.18)", dark: "#73654e", light: "#c7b79a" },
  { id: 7, name: "Citrus 08", category: "fresh", type: "Цитрусовый", notes: "Юзу · лимон · имбирь", price: 6200, volume: "30 мл", glow: "rgba(179,169,78,.2)", dark: "#65632a", light: "#c4b85e" },
  { id: 8, name: "Amber Skin", category: "woody", type: "Амбровый", notes: "Амбра · бобы тонка · кашемир", price: 9900, volume: "75 мл", glow: "rgba(175,114,63,.22)", dark: "#55351f", light: "#bd8957" }
];

const money = value => new Intl.NumberFormat("ru-RU").format(value) + " сом";
const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const toast = document.getElementById("toast");
let cart = {};
let toastTimer;

function renderProducts(filter = "all") {
  const shown = products.filter(p => filter === "all" || p.category === filter);
  productGrid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-visual" style="--glow:${p.glow};--bottle-dark:${p.dark};--bottle-light:${p.light}">
        <span class="product-number">NO. 0${p.id}</span><span class="product-type">${p.type}</span>
        <div class="mini-bottle" aria-hidden="true"></div>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3 class="product-title">${p.name}</h3><span class="product-volume">${p.volume}</span></div>
        <p class="product-notes">${p.notes}</p>
        <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">＋ Добавить</button></div>
      </div>
    </article>`).join("");
}
function showToast(message) {
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart(); showToast("Аромат добавлен в корзину");
}
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeFromCart(id) { delete cart[id]; renderCart(); showToast("Товар удалён из корзины"); }
function renderCart() {
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTitleCount").textContent = `(${count})`;
  document.getElementById("subtotal").textContent = money(total);
  document.getElementById("total").textContent = money(total);
  document.getElementById("paymentTotal").textContent = money(total);
  cartEmpty.style.display = count ? "none" : "block";
  cartItemsEl.innerHTML = products.filter(p => cart[p.id]).map(p => `
    <div class="cart-row">
      <div class="cart-thumb" style="--glow:${p.glow};--bottle-dark:${p.dark};--bottle-light:${p.light}"><div class="mini-bottle"></div></div>
      <div><div class="cart-product-name">${p.name}</div><div class="cart-product-price">${money(p.price)}</div>
        <div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Уменьшить количество">−</button><span>${cart[p.id]}</span><button data-qty="${p.id}" data-delta="1" aria-label="Увеличить количество">＋</button></div>
      </div>
      <button class="remove-button" data-remove="${p.id}" aria-label="Удалить ${p.name}">×</button>
    </div>`).join("");
}
function openCart() {
  cartPanel.classList.add("open"); overlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll");
}
function closePanels() {
  cartPanel.classList.remove("open"); overlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll");
  document.getElementById("authModal").classList.remove("open");
  const paymentModal = document.getElementById("paymentModal");
  paymentModal.classList.remove("open"); paymentModal.setAttribute("aria-hidden", "true");
}
productGrid.addEventListener("click", e => {
  const button = e.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.querySelector(".filters").addEventListener("click", e => {
  const button = e.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(el => el.classList.toggle("active", el === button));
  renderProducts(button.dataset.filter);
});
cartItemsEl.addEventListener("click", e => {
  const qtyButton = e.target.closest("[data-qty]");
  const removeButton = e.target.closest("[data-remove]");
  if (qtyButton) changeQty(Number(qtyButton.dataset.qty), Number(qtyButton.dataset.delta));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});
document.getElementById("openCart").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closePanels);
overlay.addEventListener("click", closePanels);
document.getElementById("openAuth").addEventListener("click", () => {
  closePanels(); document.getElementById("authModal").classList.add("open"); overlay.classList.add("visible"); document.body.classList.add("no-scroll");
});
document.getElementById("closeAuth").addEventListener("click", closePanels);
document.getElementById("authForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  document.getElementById("formMessage").textContent = `Спасибо, ${name}! Форма работает в демо-режиме. Для настоящей регистрации подключите сервер и базу данных.`;
  e.target.querySelector('button[type="submit"]').textContent = "Готово ✓";
});
document.getElementById("checkout").addEventListener("click", () => {
  if (!Object.keys(cart).length) { showToast("Сначала добавьте аромат в корзину"); return; }
  const paymentModal = document.getElementById("paymentModal");
  document.getElementById("paymentSuccess").hidden = true;
  const payButton = document.getElementById("payButton");
  const cardSelected = document.querySelector('[data-payment-method="card"]').classList.contains("selected");
  payButton.innerHTML = cardSelected ? "Оплатить <span>↗</span>" : "Подтвердить заказ <span>↗</span>";
  payButton.hidden = false;
  paymentModal.classList.add("open");
  paymentModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("visible");
  document.body.classList.add("no-scroll");
});
document.getElementById("closePayment").addEventListener("click", closePanels);
document.querySelectorAll("[data-payment-method]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-payment-method]").forEach(method => {
    const selected = method === button;
    method.classList.toggle("selected", selected);
    method.setAttribute("aria-pressed", String(selected));
  });
  document.getElementById("payButton").innerHTML = button.dataset.paymentMethod === "card"
    ? "Оплатить <span>↗</span>"
    : "Подтвердить заказ <span>↗</span>";
}));
document.getElementById("payButton").addEventListener("click", () => {
  const isCardPayment = document.querySelector('[data-payment-method="card"]').classList.contains("selected");
  const success = document.getElementById("paymentSuccess");
  success.querySelector("strong").textContent = isCardPayment ? "Оплачено" : "Заказ подтверждён";
  success.querySelector("small").textContent = isCardPayment
    ? "Демо-операция завершена успешно"
    : "Оплата при получении · демо-режим";
  success.hidden = false;
  document.getElementById("payButton").hidden = true;
});
document.getElementById("menuToggle").addEventListener("click", () => document.querySelector(".nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => document.querySelector(".nav").classList.remove("open")));
document.addEventListener("keydown", e => { if (e.key === "Escape") closePanels(); });
renderProducts();
renderCart();
