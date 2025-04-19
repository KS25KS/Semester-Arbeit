let cart = JSON.parse(localStorage.getItem('cart')) || [];
let menuItems = [];

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  console.log('Total Price:', total);  // Debug: log the total price

  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      ${item.name} - CHF ${item.price.toFixed(2)}
      <button class="remove-btn" data-index="${index}">Entfernen</button>
    `;

    cartItems.appendChild(div);
  });

  totalPrice.textContent = `CHF ${total.toFixed(2)}`;
  localStorage.setItem('cart', JSON.stringify(cart));

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });
}

function displayMenu(items) {
  const container = document.getElementById('menu-items'); //  use consistent ID
  container.innerHTML = "";

  items.forEach(item => {
    const project = document.createElement('div');
    project.className = 'project';

    const addToCartBtn = document.createElement('a');
    addToCartBtn.href = "#cart";
    addToCartBtn.className = "project-link";
    addToCartBtn.textContent = "Zum Warenkorb hinzufügen";
    addToCartBtn.onclick = () => {
      cart.push(item);
      console.log(cart);  // Log the cart when an item is added
      updateCart();
    };

    project.innerHTML = `
      <div class="project-image" style="background-image: url('${item.image}');"></div>
      <div class="project-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
    project.querySelector('.project-content').appendChild(addToCartBtn);

    container.appendChild(project);
  });
}

// ✅ Only one fetch
fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    menuItems = data;
    displayMenu(menuItems); // initial render
    updateCart(); // load cart from localStorage
  })
  .catch(error => {
    console.error('Fehler beim Laden des Menüs:', error);
  });

// 🔍 Search filtering
document.getElementById('searchBar').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(term)
  );
  displayMenu(filtered); // re-render filtered items
});

