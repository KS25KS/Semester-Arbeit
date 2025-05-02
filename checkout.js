// Credit Card Validation
const creditCardInput = document.getElementById('credit-card-number');
const errorMessage = document.getElementById('credit-card-error');

// Validate Credit Card Number Input
creditCardInput.addEventListener('input', () => {
  const cardValue = creditCardInput.value;
  if (cardValue.length >= 16 && /^\d+$/.test(cardValue)) {
    errorMessage.style.display = 'none';
  } else {
    errorMessage.style.display = 'block';
  }
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let pointsMenu = [];  // Declare a variable to hold the points menu data

// Load the points menu from the JSON file
fetch('menu_points.json') // Adjust the path as needed
  .then(res => res.json())
  .then(data => {
    pointsMenu = data;  // Save the points menu data
  })
  .catch(err => console.error('Failed to load points menu:', err));

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
    const isFree = item.isFree === true;  // Check if the item is free (redeemed with points)
    const itemTotal = isFree ? 0 : item.price * quantity;  // If it's free, set total to 0
    total += itemTotal;

    const itemHTML = `
      ${item.name} x ${quantity} - ${isFree ? 'GRATIS' : `CHF ${itemTotal.toFixed(2)}`}
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

// --- PAYMENT METHOD TOGGLE LOGIC ---
let selectedPaymentMethod = null;

document.querySelectorAll('.payment-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    // Hide all
    document.querySelectorAll('.payment-details').forEach(detail => {
      detail.classList.add('hidden');
    });

    // Set and show selected
    const method = toggle.getAttribute('data-method');
    selectedPaymentMethod = method;

    const details = toggle.parentElement.querySelector('.payment-details');
    if (details) {
      details.classList.remove('hidden');
    }
  });
});

// Handle checkout and show receipt modal
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cardValue = creditCardInput.value;
    if (selectedPaymentMethod === 'Kreditkarte') {
      if (cardValue.length < 16 || !/^\d+$/.test(cardValue)) {
        errorMessage.style.display = 'block';
        return;
      }
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
      const isFree = item.isFree === true;
      const itemTotal = isFree ? 0 : item.price * quantity;  // If it's free, set total to 0
      total += itemTotal;

      const p = document.createElement('p');
      p.textContent = `${item.name} x ${quantity} – CHF ${isFree ? 'GRATIS' : itemTotal.toFixed(2)}`;
      receiptContainer.appendChild(p);
    });

    const mwst = total * 0.026;
    const totalWithTax = total + mwst;

    document.getElementById('subtotal-amount').textContent = total.toFixed(2);
    document.getElementById('tax-amount').textContent = mwst.toFixed(2);
    document.getElementById('receipt-total').textContent = totalWithTax.toFixed(2);

    document.getElementById('receipt-payment-method').textContent = selectedPaymentMethod || 'Nicht angegeben';

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

    totalPrepTime = Math.min(totalPrepTime, 75); // Max 75 minutes

    let deliveryBuffer = 0;
    if (orderType === "Lieferung") {
      deliveryBuffer = 12;
    } else if (orderType === "Abholung") {
      deliveryBuffer = 5;
    }

    const estimatedTime = totalPrepTime + deliveryBuffer;
    document.getElementById('estimated-time').textContent = estimatedTime;

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
    const progressBar = document.getElementById('progress-bar');
    const truckIcon = document.getElementById('truck-icon');
    const progressText = document.getElementById('progress-text');

    orderProgress.style.display = 'block';

    let progress = 0;
    let currentTime = estimatedTime;

    // **Option 1: Real-Time Progress** - Updates every 60 seconds (1 minute)
    const realTimeInterval = setInterval(() => {
      progress += 100 / estimatedTime;
      currentTime--;

      if (progress >= 100 || currentTime <= 0) {
        progress = 100;
        currentTime = 0;
        clearInterval(realTimeInterval);
        progressText.textContent = "Bestellung abgeschlossen!";
      }

      progressBar.style.width = progress + "%";
      truckIcon.style.left = progress + "%";

      // Only update the live countdown message (not the "geschätzte Zeit" value)
      const estimatedMessage = document.getElementById('estimated-message');
      const orderType = localStorage.getItem("orderType");

      if (estimatedMessage) {
        let message = "";

        if (orderType === "Lieferung") {
          message = `Ihre Bestellung wird voraussichtlich in ${currentTime} Minuten ankommen.`;
        } else if (orderType === "Abholung") {
          message = `Ihre Bestellung wird voraussichtlich in ${currentTime} Minuten fertig sein.`;
        }

        estimatedMessage.textContent = message;
      }

    }, 2000);

    // **Option 2: Faster Progress for Presentation** - Updates every 15 seconds
    /*
    const presentationInterval = setInterval(() => {
      progress += 100 / (estimatedTime * 4); // Faster updates

      currentTime -= 0.25; // Each 15 seconds is 0.25 minute

      if (progress >= 100 || currentTime <= 0) {
        progress = 100;
        currentTime = 0;
        clearInterval(presentationInterval);
        progressText.textContent = "Bestellung abgeschlossen!";
      }

      progressBar.style.width = progress + "%";
      truckIcon.style.left = progress + "%";
      document.getElementById('estimated-time').textContent = Math.ceil(currentTime);

    }, 15000);
    */

    addPointsForOrder(10); // or any value you want to reward

    // Clear the cart
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

// Display delivery info cleanup (hidden on page now)
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

  deliveryDiv.innerHTML = '';
}
displayDeliveryInfo();

function showPointsEarnedPopup(points = 10) {
  const popup = document.createElement('div');
  popup.className = 'points-popup';
  popup.innerHTML = `
    🔥 <strong>Sie haben ${points} Punkte erhalten!</strong>
    <div class="checkmark"></div>
  `;
  document.body.appendChild(popup);

  // Animate checkmark after 1s
  setTimeout(() => {
    const checkmark = popup.querySelector('.checkmark');
    if (checkmark) {
      checkmark.innerHTML = '✔️';
      checkmark.style.animation = 'checkmark-animation 1s ease-in-out forwards';
    }
  }, 1000);

  // Remove popup after 2.5s
  setTimeout(() => popup.remove(), 2500);
}

