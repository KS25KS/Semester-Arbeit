
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
      const cartItems = document.getElementById('cart-items');
      const totalPrice = document.getElementById('total-price');
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

      totalPrice.textContent = total.toFixed(2);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          cart.splice(index, 1);
          updateCart();
        });
      });
    }

    fetch('menu.json')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('menu-items');

        data.forEach(item => {
          const project = document.createElement('div');
          project.className = 'project';

          const addToCartBtn = document.createElement('a');
          addToCartBtn.href = "#cart";
          addToCartBtn.className = "project-link";
          addToCartBtn.textContent = "Zum Warenkorb hinzufügen";
          addToCartBtn.onclick = () => {
            cart.push(item);
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

        updateCart(); // Load cart from localStorage on page load
      })
      .catch(error => {
        console.error('Fehler beim Laden des Menüs:', error);
      });
