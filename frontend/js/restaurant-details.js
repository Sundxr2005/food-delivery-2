document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get('id');

    fetch(`http://localhost:5000/api/restaurants/${restaurantId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('restaurant-name').innerText = data.name;

            const restaurantDetails = document.getElementById('restaurant-details');
            restaurantDetails.innerHTML = `
                <p><strong>📍 Address:</strong> ${data.address}</p>
                <p><strong>📞 Phone:</strong> ${data.phone}</p>
                <p><strong>⭐ Rating:</strong> ${data.rating}</p>
            `;

            const menuItemsContainer = document.getElementById('menu-items');
            let totalPrice = 0;

            data.menu.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('menu-card');
                card.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>Category: ${item.category}</p>
                    <p>Price: ₹${item.price}</p>
                    <input type="number" min="0" value="0" id="quantity-${item.item_id}" />
                `;
                menuItemsContainer.appendChild(card);
            });

            const updateTotalPrice = () => {
                let finalPrice = 0;
                data.menu.forEach(item => {
                    const qty = parseInt(document.getElementById(`quantity-${item.item_id}`).value) || 0;
                    finalPrice += item.price * qty;
                });
                document.getElementById('total-price').innerText = finalPrice.toFixed(2);
            };

            menuItemsContainer.addEventListener('input', updateTotalPrice);

            document.getElementById('order-form').addEventListener('submit', function (e) {
                e.preventDefault();
                const orderItems = [];
                let finalPrice = 0;

                data.menu.forEach(item => {
                    const quantity = parseInt(document.getElementById(`quantity-${item.item_id}`).value);
                    if (quantity > 0) {
                        const subtotal = item.price * quantity;
                        orderItems.push({
                            item_id: item.item_id,
                            quantity: quantity,
                            price: item.price,
                            subtotal: subtotal
                        });
                        finalPrice += subtotal;
                    }
                });

                const orderData = {
                    restaurant_id: restaurantId,
                    user_id: 1, // You can update this dynamically later
                    total_price: finalPrice,
                    items: orderItems
                };

                fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                })
                .then(response => response.json())
                .then(result => {
                    // Save order details in localStorage
                    const summaryData = {
                        restaurantName: data.name,
                        total_price: finalPrice.toFixed(2),
                        items: orderItems.map(item => ({
                            name: data.menu.find(m => m.item_id == item.item_id).name,
                            quantity: item.quantity,
                            subtotal: item.subtotal
                        }))
                    };
                    localStorage.setItem('latestOrder', JSON.stringify(summaryData));
                
                    // Redirect to order success page
                    window.location.href = "order-success.html";
                })
                
                .catch(error => {
                    console.error('Error placing order:', error);
                    alert('Failed to place order.');
                });
            });
        })
        .catch(error => console.error('Error fetching restaurant details:', error));
});
