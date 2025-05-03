let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Cart loaded from localStorage:', cart);

// Load points menu
let pointsMenu = [];
fetch('points.json')
    .then(res => res.json())
    .then(data => {
        pointsMenu = data;
    })
    .catch(err => console.error('Failed to load points menu:', err));

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = ''; 

    let total = 0;

    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const isFree = item.isFree === true;
        const itemTotal = isFree ? 0 : item.price * quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          ${item.name} x ${quantity} - ${isFree ? 'GRATIS' : `CHF ${itemTotal.toFixed(2)}`}
          <button class="remove-btn" data-index="${index}">Entfernen</button>
          ${!isFree ? `<button class="redeem-btn" data-index="${index}">Mit Punkten einlösen</button>` : ''}
        `;
        cartItemsContainer.appendChild(div);
    });

    totalPriceElement.textContent = `CHF ${total.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart));

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });

    document.querySelectorAll('.redeem-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            const item = cart[index];
            const user = JSON.parse(localStorage.getItem("userData"));
            const pointsInfo = pointsMenu.find(p => p.name === item.name);
            if (!user || !pointsInfo) return;

            const cost = pointsInfo.points * (item.quantity || 1);
            if ((user.points || 0) >= cost) {
                if (confirm(`Möchten Sie ${item.name} für ${cost} Punkte einlösen?`)) {
                    user.points -= cost;
                    cart[index].isFree = true;
                    localStorage.setItem("userData", JSON.stringify(user));
                    updateCart();
                    updatePointsDisplay(); // update visible points
                }
            } else {
                alert("Nicht genügend Punkte, um diesen Artikel einzulösen.");
            }
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

function updatePointsDisplay() {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user && document.getElementById("points")) {
        document.getElementById("points").textContent = user.points || 0;
    }
}

updateCart();

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
        } else {
            window.location.href = "info.html";
        }
    });
}