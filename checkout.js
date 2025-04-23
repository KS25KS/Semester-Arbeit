let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutPrice = document.getElementById('checkout-price');

  if (cartItemsContainer) cartItemsContainer.innerHTML = '';
  if (checkoutItems) checkoutItems.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const itemHTML = `
      ${item.name} x ${quantity} - CHF ${itemTotal.toFixed(2)}
    `;

    if (cartItemsContainer) {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `${itemHTML}
        <button class="remove-btn" data-index="${index}">Entfernen</button>`;
      cartItemsContainer.appendChild(div);
    }

    if (checkoutItems) {
      const p = document.createElement('p');
      p.textContent = itemHTML;
      checkoutItems.appendChild(p);
    }
  });

  if (totalPriceElement) totalPriceElement.textContent = total.toFixed(2);
  if (checkoutPrice) checkoutPrice.textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  }
}

// ✅ Handle checkout and show receipt modal
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const modal = document.getElementById('thankyou-modal');
    modal.style.display = 'flex';

    // Generate random order number
    const orderNumber = 'CH' + Math.floor(Math.random() * 9999);
    document.getElementById('order-number').textContent = orderNumber;

    // Set date and time
    const now = new Date();
    const formattedDate = now.toLocaleString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    document.getElementById('order-date').textContent = formattedDate;

    // Render receipt items
    const receiptContainer = document.getElementById('receipt-items');
    receiptContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      total += itemTotal;

      const p = document.createElement('p');
      p.textContent = `${item.name} x ${quantity} – CHF ${itemTotal.toFixed(2)}`;
      receiptContainer.appendChild(p);
    });
    

    // MWST 2.6%
    const mwst = total * 0.026;
    const totalWithTax = total + mwst;

    document.getElementById('subtotal-amount').textContent = total.toFixed(2);
    document.getElementById('tax-amount').textContent = mwst.toFixed(2);
    document.getElementById('receipt-total').textContent = totalWithTax.toFixed(2);

    // Clear the cart
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
  });
}

// ✅ Close modal
const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('thankyou-modal').style.display = 'none';
  });
}

// ✅ On page load
updateCart();
