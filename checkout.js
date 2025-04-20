let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');

  cartItemsContainer.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      ${item.name} x ${quantity} - CHF ${itemTotal.toFixed(2)}
      <button class="remove-btn" data-index="${index}">Entfernen</button>
    `;

    cartItemsContainer.appendChild(div);
  });

  totalPriceElement.textContent = total.toFixed(2);
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

// ✅ Modal logic for checkout confirmation
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    // Show the thank you modal
    document.getElementById('thankyou-modal').style.display = 'flex';

    // Clear the cart
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
  });
}

const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    // Hide the modal
    document.getElementById('thankyou-modal').style.display = 'none';
  });
}

// On load
updateCart();
