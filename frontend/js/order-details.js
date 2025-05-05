document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("summary-container");
    const userId = 1; // Replace with dynamic user session if needed
  
    fetch(`http://localhost:5000/api/orders/${userId}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(order => {
          const orderDiv = document.createElement("div");
          orderDiv.classList.add("order-box");
  
          const itemList = order.items.map(item => `
            <li>${item.name} (x${item.quantity}) - ₹${item.price}</li>
          `).join("");
  
          // Format the created_at date
          const formattedDate = new Date(order.created_at).toLocaleString();
  
          orderDiv.innerHTML = `
            <h2>Order #${order.order_id}</h2>
            <p><strong>Restaurant:</strong> ${order.restaurant_name}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Ordered At:</strong> ${formattedDate}</p>
            <p><strong>Payment:</strong> ${order.payment_method} (${order.payment_status})</p>
            <p><strong>Total:</strong> ₹${order.total_price}</p>
            <p><strong>Items:</strong></p>
            <ul>${itemList}</ul>
          `;
          container.appendChild(orderDiv);
        });
      })
      .catch(err => console.error("Error loading orders:", err));
  
    // Download PDF
    document.getElementById("download-pdf").addEventListener("click", () => {
      const element = document.getElementById("order-summary");
      html2pdf().from(element).save("order-summary.pdf");
    });
  });
  