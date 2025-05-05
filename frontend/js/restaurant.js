document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get('id');
  
    fetch(`http://localhost:5000/api/restaurants/${restaurantId}/menu`)
      .then(res => res.json())
      .then(menuItems => {
        const container = document.getElementById('menu-list');
        menuItems.forEach(item => {
          const div = document.createElement('div');
          div.className = 'menu-item';
          div.innerHTML = `
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
          `;
          container.appendChild(div);
        });
      });
  });
  