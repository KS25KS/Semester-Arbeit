const orderType = document.getElementById('order-type');
const deliveryFields = document.getElementById('delivery-fields');
const nameField = document.getElementById('fullname');

// Show/hide delivery fields based on order type
orderType.addEventListener('change', () => {
  if (orderType.value === 'pickup') {
    deliveryFields.style.display = 'none';
  } else {
    deliveryFields.style.display = 'block';
  }
});

document.getElementById('info-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const type = orderType.value === "delivery" ? "Lieferung" : "Abholung";
  const name = nameField.value.trim();
  localStorage.setItem('orderType', type);

  // Ensure name is entered
  if (!name) {
    alert("Bitte geben Sie Ihren Namen ein.");
    return;
  }

  if (type === 'Lieferung') {
    const address = document.getElementById('address').value.trim();
    const postcode = parseInt(document.getElementById('postcode').value);

    // Ensure delivery address and postcode are entered and valid
    if (!address || isNaN(postcode)) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    if (postcode < 8000 || postcode > 8960) {
      alert("Lieferung ist nur in den PLZ-Bereichen 8000 bis 8960 möglich.");
      return;
    }

    // Save delivery info in localStorage
    const deliveryInfo = {
      name,
      address,
      plz: postcode,
      deliveryOption: type
    };

    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));

  } else {  // For 'pickup', no address needed
    const pickupInfo = {
      name,
      deliveryOption: type
    };

    localStorage.setItem('pickupInfo', JSON.stringify(pickupInfo));
  }

  // Redirect to checkout
  window.location.href = "checkout.html";
});
