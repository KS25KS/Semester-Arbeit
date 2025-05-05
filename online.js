let cart = JSON.parse(localStorage.getItem('cart')) || [];
let menuItems = [];

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');

  if (cartItems && totalPrice) {
    cartItems.innerHTML = '';

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

      cartItems.appendChild(div);
    });

    totalPrice.textContent = `CHF ${total.toFixed(2)}`;
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });

  console.log('Total Price:', cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2));
}

function displayMenu(items) {
  const container = document.getElementById('menu-items');
  container.innerHTML = "";

  items.forEach(item => {
    const project = document.createElement('div');
    project.className = 'project';

    // Create the 'Add to Cart' button
    const addToCartBtn = document.createElement('a');
    addToCartBtn.href = "#"; // No redirection
    addToCartBtn.className = "project-link";
    addToCartBtn.textContent = "Zum Warenkorb hinzufügen";
    addToCartBtn.onclick = (event) => {
      event.preventDefault();
      let existingItem = cart.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        item.quantity = 1;
        cart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      showAddedPopup(item.name); // Show confirmation popup
    };

    // Add the price below the description
    const priceContainer = document.createElement('div');
    priceContainer.className = 'price-container';
    priceContainer.innerHTML = `<span class="price">CHF ${item.price.toFixed(2)}</span>`;

    // Create the menu item card
    project.innerHTML = `
      <div class="project-image" style="background-image: url('${item.image}');"></div>
      <div class="project-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;

    // Append the price container and 'Add to Cart' button
    project.querySelector('.project-content').appendChild(priceContainer);
    project.querySelector('.project-content').appendChild(addToCartBtn);

    // Append the item to the menu container
    container.appendChild(project);
  });
}

fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    menuItems = data;
    displayMenu(menuItems);
    updateCart();
  })
  .catch(error => {
    console.error('Fehler beim Laden des Menüs:', error);
  });

document.getElementById('searchBar').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(term)
  );
  displayMenu(filtered);
});

function showAddedPopup(itemName) {
  const popup = document.createElement('div');
  popup.className = 'added-popup';
  popup.innerHTML = `✔️ <strong>${itemName}</strong> wurde zum Warenkorb hinzugefügt!`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}
