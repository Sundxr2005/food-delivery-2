// main.js
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/api/restaurants')
        .then(response => response.json())
        .then(data => {
            const restaurantList = document.getElementById('restaurant-list');
            restaurantList.innerHTML = ''; // Clear list

            data.forEach(restaurant => {
                const div = document.createElement('div');
                div.classList.add('restaurant-card');
                div.innerHTML = `
                    <h3><a href="restaurant-details.html?id=${restaurant.restaurant_id}">${restaurant.name}</a></h3>
                    <p><strong>📍 Address:</strong> ${restaurant.address}</p>
                    <p><strong>📞 Phone:</strong> ${restaurant.phone}</p>
                    <p><strong>⭐ Rating:</strong> ${restaurant.rating}</p>
                `;
                restaurantList.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching restaurants:', error));
});
