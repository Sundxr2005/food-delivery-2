document.addEventListener('DOMContentLoaded', function() {
    // Get the order_id and amount from URL query params
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const amount = params.get('amount');

    // Display order details
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('amount').textContent = amount;

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get the selected payment method
        const paymentMethod = document.getElementById('payment-method').value;

        // Prepare payment data to send to the backend
        const paymentData = {
            order_id: orderId,
            amount: amount,
            payment_method: paymentMethod,
            payment_status: 'pending',  // Initially set to pending, this can be updated later
            paid_at: null  // This will be updated after payment completion
        };

        // Send payment data to backend via POST request
        fetch('http://localhost:5000/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Payment Successful!');
            // Optionally, redirect to the order history or confirmation page
            window.location.href = 'order-history.html';
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        });
    });
});
