document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.querySelector("#order-table tbody");

    // Fetch the user's order history
    fetch("http://localhost:5000/api/orders/1")  // Replace with the actual user ID
        .then(response => response.json())
        .then(data => {
            // Clear existing table rows
            orderTableBody.innerHTML = '';

            // Insert new rows
            data.forEach(order => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td><a href="order-details.html?order_id=${order.order_id}">${order.item_names}</a></td> <!-- Display the names of the items -->
                    <td>${order.status}</td>
                    <td>${order.total_price}</td>
                    <td>
                        ${order.status === "pending" ? `<button class="cancel-btn" data-id="${order.order_id}">Cancel</button>` : ""}
                    </td>
                `;

                orderTableBody.appendChild(row);
            });

            // Add event listeners for the cancel buttons
            document.querySelectorAll(".cancel-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const orderId = e.target.getAttribute("data-id");
                    cancelOrder(orderId);
                });
            });
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
        });
});

// Function to handle order cancellation and deletion
function cancelOrder(orderId) {
    fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        location.reload();  // Reload to update the order list
    })
    .catch(error => {
        console.error("Error canceling order:", error);
    });
}
