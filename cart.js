// Retrieve cart from localStorage, or initialize as an empty array if no data exists
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Cart loaded from localStorage:', cart);

// Function to update the cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    // Clear current items in cart
    cartItemsContainer.innerHTML = ''; 

    let total = 0;

    // Loop through all items in the cart and display them
    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;  // Default quantity to 1 if not set
        const itemTotal = item.price * quantity;
        total += itemTotal;

        // Create HTML for each cart item
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          ${item.name} x ${quantity} - CHF ${itemTotal.toFixed(2)}
          <button class="remove-btn" data-index="${index}">Entfernen</button>
        `;

        // Append the cart item to the container
        cartItemsContainer.appendChild(div);
    });

    // Update the total price
    totalPriceElement.textContent = `CHF ${total.toFixed(2)}`;
    console.log('Total Price:', total.toFixed(2));  // Debugging line

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);  // Debugging line

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1); // Remove item from the cart
            console.log('Item removed, updating cart:', cart); // Debugging line
            updateCart(); // Update the cart display
        });
    });

    // Clear cart button functionality
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            cart = []; // Clear the cart
            localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
            updateCart(); // Update the cart display
        });
    }
}

// Call updateCart on page load to display items in the cart
updateCart();

// Get the checkout button
const checkoutBtn = document.getElementById('checkout-btn');

// Event listener for the "Bestellung abschließen" button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
        } else {
            // If there are items in the cart, proceed to the info page
            window.location.href = "info.html"; // Redirect to the info page
        }
    });
}

