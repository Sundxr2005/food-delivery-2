document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user_id', result.user.user_id);
      localStorage.setItem('user_type', result.user.user_type);
      window.location.href = 'index.html'; // or redirect to dashboard
    } else {
      document.getElementById('message').textContent = result.message;
    }
  });