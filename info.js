const orderType = document.getElementById('order-type');
const deliveryFields = document.getElementById('delivery-fields');

// Handle the change of order type (pickup or delivery)
orderType.addEventListener('change', () => {
  if (orderType.value === 'pickup') {
    deliveryFields.style.display = 'none';
  } else {
    deliveryFields.style.display = 'block';
  }
});

document.getElementById('info-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const type = orderType.value;
  localStorage.setItem('orderType', type);

  if (type === 'delivery') {
    const name = document.getElementById('fullname').value.trim();
    const address = document.getElementById('address').value.trim();
    const postcode = parseInt(document.getElementById('postcode').value);

    // Validate fields
    if (!name || !address || isNaN(postcode)) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    if (postcode < 8000 || postcode > 8960) {
      alert("Lieferung ist nur in den PLZ-Bereichen 8000 bis 8960 möglich.");
      return;
    }

    // Store delivery information as an object in localStorage
    const deliveryInfo = {
      name: name,
      address: address,
      plz: postcode,
      deliveryOption: type
    };

    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));  // Save it as an object
  }

  // Redirect to checkout.html after storing data
  window.location.href = "checkout.html";
});
