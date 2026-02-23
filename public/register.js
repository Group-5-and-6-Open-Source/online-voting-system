document.getElementById('regForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  msg.className = 'msg';

  const fd = new FormData(form);
  const pw = fd.get('password');
  const cpw = fd.get('confirmPassword');
  if (pw !== cpw) {
    msg.textContent = 'Passwords do not match.';
    msg.classList.add('error');
    return;
  }

  try {
    const res = await fetch('/api/register', { method: 'POST', body: fd });
    const j = await res.json();
    if (j.success) {
      msg.textContent = j.message || 'Registered.';
      msg.classList.add('success');
      form.reset();
    } else {
      msg.textContent = j.message || 'Registration failed.';
      msg.classList.add('error');
    }
  } catch (err) {
    msg.textContent = 'Network error.';
    msg.classList.add('error');
  }
});
