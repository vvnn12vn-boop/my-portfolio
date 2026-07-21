/*
  auth.js
  منطق فرم‌های ورود و ثبت‌نام (احراز هویت سمت کلاینت - فقط برای دمو، جایگزین بک‌اند واقعی نیست)
*/

document.addEventListener('DOMContentLoaded', () => {

  seedInitialData();

  // اگر از قبل لاگین کرده، مستقیم بره داشبورد
  if (getCurrentUser() && (document.getElementById('loginForm') || document.getElementById('registerForm'))) {
    window.location.href = 'index.html';
    return;
  }

  /* ---------- نمایش/مخفی‌کردن رمز عبور ---------- */
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  /* ---------- فرم ورود ---------- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {

    // پیام موفقیت بعد از ثبت‌نام
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
      showAlert('loginAlert', 'ثبت‌نام با موفقیت انجام شد. حالا وارد شوید.', 'success');
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');
      let valid = true;

      if (!isValidEmail(email.value.trim())) {
        setError(email, 'ایمیل معتبر وارد کنید.');
        valid = false;
      }
      if (password.value.trim().length < 6) {
        setError(password, 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
        valid = false;
      }
      if (!valid) return;

      const user = findUserByEmail(email.value.trim());
      if (!user || user.password !== password.value) {
        showAlert('loginAlert', 'ایمیل یا رمز عبور اشتباه است.', 'danger');
        return;
      }

      setCurrentUser(user);
      window.location.href = 'index.html';
    });
  }

  /* ---------- فرم ثبت‌نام ---------- */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(registerForm);

      const name = document.getElementById('registerName');
      const email = document.getElementById('registerEmail');
      const password = document.getElementById('registerPassword');
      const confirm = document.getElementById('registerConfirmPassword');
      const terms = document.getElementById('registerTerms');
      let valid = true;

      if (name.value.trim().length < 3) {
        setError(name, 'نام باید حداقل ۳ کاراکتر باشد.');
        valid = false;
      }
      if (!isValidEmail(email.value.trim())) {
        setError(email, 'ایمیل معتبر وارد کنید.');
        valid = false;
      }
      if (password.value.length < 6) {
        setError(password, 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
        valid = false;
      }
      if (confirm.value !== password.value) {
        setError(confirm, 'رمز عبور و تکرار آن یکسان نیستند.');
        valid = false;
      }
      if (!terms.checked) {
        showAlert('registerAlert', 'برای ادامه باید قوانین را بپذیرید.', 'danger');
        valid = false;
      }
      if (!valid) return;

      if (findUserByEmail(email.value.trim())) {
        showAlert('registerAlert', 'این ایمیل قبلاً ثبت شده است.', 'danger');
        return;
      }

      addUser({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value
      });

      window.location.href = 'login.html?registered=1';
    });
  }

  /* ---------- توابع کمکی اعتبارسنجی ---------- */

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(inputEl, message) {
    inputEl.classList.add('is-invalid');
    const feedback = inputEl.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    const alerts = form.parentElement.querySelectorAll('.alert');
    alerts.forEach(a => a.classList.add('d-none'));
  }

  function showAlert(id, message, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.className = `alert alert-${type}`;
  }
});
