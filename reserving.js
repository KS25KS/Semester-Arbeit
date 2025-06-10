document.getElementById('reservedForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const telefon = document.getElementById('telefon').value;
    const email = document.getElementById('email').value;
    const begin = document.getElementById('begin').value;
    const quantity = document.getElementById('quantity').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Show loading message
    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.success-message').style.display = 'none';
    document.querySelector('.error-message').style.display = 'none';

    // Format message for Discord webhook
    const webhookBody = {
        embeds: [{
            title: "New Reservation Form Submission",
            color: 0x7289DA, // Discord blue color
            fields: [
                {
                    name: "Name",
                    value: name,
                    inline: true
                },
                {
                    name: "Telefon",
                    value: telefon,
                    inline: true
                },
                {
                    name: "Email",
                    value: email,
                    inline: true
                },
                {
                    name: "Datum",
                    value: begin,
                    inline: true 
                },
                {
                    name: "Quantity",
                    value: quantity,
                    inline: true
                },
                {
                    name: "Subject",
                    value: subject
                },
                {
                    name: "Message",
                    value: message
                }
            ],
            footer: {
                text: "Reservation Form Submission • " + new Date().toLocaleString()
            }
        }]
    };

    const webhookUrl = 'https://discord.com/api/webhooks/1382048834598735992/2sSXHpx6F8CBj9aKnAJaCIKu2vMng0q6mxkQIe6FTMAXq58Qq-18IQnYjRrGZb8I2YYM';

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookBody)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector('.success-message').style.display = 'block';
            document.getElementById('reservedForm').reset();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        document.querySelector('.error-message').style.display = 'block';
        console.error('Error:', error);
    })
    .finally(() => {
        document.querySelector('.loading').style.display = 'none';
    });
});