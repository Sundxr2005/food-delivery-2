document.addEventListener('DOMContentLoaded', () => {
    const summaryData = JSON.parse(localStorage.getItem('latestOrder'));
  
    if (!summaryData) {
      document.getElementById('order-summary').innerHTML = "<p>No order found.</p>";
      return;
    }
  
    let summaryHTML = `
      <h3>Restaurant: ${summaryData.restaurantName}</h3>
      <ul>
        ${summaryData.items.map(item => `
          <li>${item.quantity} × ${item.name} — ₹${item.subtotal}</li>
        `).join('')}
      </ul>
      <p><strong>Total Price:</strong> ₹${summaryData.total_price}</p>
      <p><strong>Estimated Delivery Time:</strong> 30–45 mins</p>
    `;
  
    document.getElementById('order-summary').innerHTML = summaryHTML;
  
    // Optionally clear it after display
    localStorage.removeItem('latestOrder');
  });
  