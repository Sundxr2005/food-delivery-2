document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      const messageEl = document.getElementById('message');
      messageEl.textContent = result.message;
      messageEl.style.color = response.ok ? 'green' : 'red';
    } catch (error) {
      console.error('Fetch error:', error);
      document.getElementById('message').textContent = 'An error occurred during registration.';
    }
  });
  