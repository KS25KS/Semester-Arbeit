// Credit Card Validation
const creditCardInput = document.getElementById('credit-card-number');
const errorMessage = document.getElementById('credit-card-error');

// Validate Credit Card Number Input
creditCardInput.addEventListener('input', () => {
  const cardValue = creditCardInput.value;

  // Check if the card number is at least 16 digits long and contains only numbers
  if (cardValue.length >= 16 && /^\d+$/.test(cardValue)) {
    errorMessage.style.display = 'none';  // Hide error message if valid
  } else {
    errorMessage.style.display = 'block';  // Show error message if invalid
  }
});

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

// Handle checkout and show receipt modal
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    // Check if credit card number is valid (16 digits minimum)
    const cardValue = creditCardInput.value;
    if (cardValue.length < 16 || !/^\d+$/.test(cardValue)) {
      errorMessage.style.display = 'block';
      return;
    }

    errorMessage.style.display = 'none';

    const modal = document.getElementById('thankyou-modal');
    modal.style.display = 'flex';

    const orderNumber = 'CH' + Math.floor(Math.random() * 9999);
    document.getElementById('order-number').textContent = orderNumber;

    const now = new Date();
    const formattedDate = now.toLocaleString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    document.getElementById('order-date').textContent = formattedDate;

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

    const mwst = total * 0.026;
    const totalWithTax = total + mwst;

    document.getElementById('subtotal-amount').textContent = total.toFixed(2);
    document.getElementById('tax-amount').textContent = mwst.toFixed(2);
    document.getElementById('receipt-total').textContent = totalWithTax.toFixed(2);

    const receiptDelivery = document.getElementById('receipt-delivery-info');
    const orderType = localStorage.getItem("orderType");
    const deliveryData = JSON.parse(localStorage.getItem("deliveryInfo"));
    const pickupData = JSON.parse(localStorage.getItem("pickupInfo"));

    let userData = null;

    if (orderType === "Lieferung" && deliveryData) {
      userData = deliveryData;
    } else if (orderType === "Abholung" && pickupData) {
      userData = pickupData;
    }

    if (userData && receiptDelivery) {
      const { name, address, plz, deliveryOption } = userData;
      let html = `
        <hr>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Option:</strong> ${deliveryOption}</p>
      `;

      // Show address and postcode only if it's a "Lieferung" (delivery)
      if (deliveryOption === "Lieferung" && address && plz) {
        html += `
          <p><strong>Adresse:</strong> ${address}</p>
          <p><strong>PLZ:</strong> ${plz}</p>
        `;
      }

      receiptDelivery.innerHTML = html;
    }

    // Calculate estimated preparation time
    let totalPrepTime = 0;
    cart.forEach(item => {
      const quantity = item.quantity || 1;
      totalPrepTime += item.estimatedtime * quantity;
    });

    totalPrepTime = Math.min(totalPrepTime, 75);

    // Initialize buffer time based on order type
    let deliveryBuffer = 0;
    if (orderType === "Lieferung") {
      deliveryBuffer = 12; // Buffer time for delivery
    } else if (orderType === "Abholung") {
      deliveryBuffer = 5;  // Buffer time for pickup
    }

    const estimatedTime = totalPrepTime + deliveryBuffer;
    document.getElementById('estimated-time').textContent = estimatedTime;

    // 🆕 Show delivery/pickup message in modal
    const estimatedMessage = document.getElementById('estimated-message');
    if (estimatedMessage && deliveryData) {
      let message = "";
      if (deliveryData.deliveryOption === "Lieferung") {
        message = `Ihre Bestellung wird voraussichtlich in ${estimatedTime} Minuten ankommen.`;
      } else if (deliveryData.deliveryOption === "Abholung") {
        message = `Ihre Bestellung wird voraussichtlich in ${estimatedTime} Minuten bereit zur Abholung sein.`;
      }
      estimatedMessage.textContent = message;
    }

    // Show order progress section
    const orderProgress = document.getElementById('order-progress');
    orderProgress.style.display = 'block';

    const progressBar = document.getElementById('delivery-progress-bar');  // ✅ correct ID
    const truckIcon = document.getElementById('truck-icon');
    const progressText = document.getElementById('progress-text');

    let progress = 0;

    // **Option 1: Real-Time Progress** - Progress updates every 60 seconds (1 minute)
const realTimeInterval = setInterval(() => {
  progress += 100 / estimatedTime;  // Regular progress update based on estimated time (real-time)

  if (progress >= 100) {
    progress = 100;
    clearInterval(realTimeInterval);
    progressText.textContent = "Bestellung abgeschlossen!";
  }

  progressBar.style.width = progress + "%";
  truckIcon.style.left = progress + "%";

}, 60000);  // Real-time updates every 60 seconds (1 minute)

// **Option 2: Faster Progress for Presentation** - Progress updates every 15 seconds
/*
const presentationInterval = setInterval(() => {
  progress += 100 / (estimatedTime / 4);  // Update progress much faster (adjust calculation here if needed)

  if (progress >= 100) {
    progress = 100;
    clearInterval(presentationInterval);
    progressText.textContent = "Bestellung abgeschlossen!";
  }

  progressBar.style.width = progress + "%";
  truckIcon.style.left = progress + "%";

}, 15000);  // Presentation-time updates every 15 seconds (faster progress)
*/
// Presentation-time updates every 15 seconds (faster progress)

    // To switch between Real-Time and Faster Progress:
    // - ✅ For Real-Time Progress: Keep the `realTimeInterval` block uncommented
    // - ✅ For Faster Progress: Comment out `realTimeInterval` and uncomment `presentationInterval`

    // Clear the cart after processing
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
  });
}

// Close modal
const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('thankyou-modal').style.display = 'none';
  });
}

// On page load
updateCart();

// Display delivery info cleanup (no longer shown on page)
function displayDeliveryInfo() {
  const deliveryData = JSON.parse(localStorage.getItem("deliveryInfo"));
  const deliveryDiv = document.getElementById("delivery-info");

  if (!deliveryData || !deliveryDiv) return;

  const { name, address, plz, deliveryOption } = deliveryData;

  let html = `
    <h3>Lieferinformationen</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Option:</strong> ${deliveryOption}</p>
  `;

  if (deliveryOption === "Lieferung") {
    html += `
      <p><strong>Adresse:</strong> ${address}</p>
      <p><strong>PLZ:</strong> ${plz}</p>
    `;
  }

  deliveryDiv.innerHTML = '';  // No longer shown
}
displayDeliveryInfo();
