(() => {
  'use strict';

  const RECIPIENT_EMAIL = 'shivamswaroop786@gmail.com';
  const pdfModal = document.getElementById('pdf-modal');
  const successModal = document.getElementById('success-modal');
  const form = document.getElementById('pdf-request-form');

  if (!pdfModal || !form) return;

  const openBtns = document.querySelectorAll('[data-open-pdf-modal]');
  const closeBtn = pdfModal.querySelector('.modal-close');
  const closeSuccessBtn = document.querySelector('[data-close-success]');
  const submitBtn = document.getElementById('pdf-submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');

  const openModal = (modal) => {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('input, textarea, button');
    focusable?.focus();
  };

  const closeModal = (modal) => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('modal-overlay--open');
    if (!pdfModal.classList.contains('modal-overlay--open') &&
        !successModal?.classList.contains('modal-overlay--open')) {
      document.body.style.overflow = '';
    }
  };

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => openModal(pdfModal));
  });

  closeBtn?.addEventListener('click', () => closeModal(pdfModal));

  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closeModal(pdfModal);
  });

  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) closeModal(successModal);
  });

  closeSuccessBtn?.addEventListener('click', () => closeModal(successModal));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (pdfModal.classList.contains('modal-overlay--open')) closeModal(pdfModal);
    if (successModal?.classList.contains('modal-overlay--open')) closeModal(successModal);
  });

  const showError = (id, message) => {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  };

  const clearErrors = () => {
    showError('email-error', '');
    showError('reason-error', '');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = form.email.value.trim();
    const reason = form.reason.value.trim();
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (!reason || reason.length < 10) {
      showError('reason-error', 'Please share a brief reason (at least 10 characters).');
      valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: "Jefferson's Bourbon Case Study — PDF Request",
          _template: 'table',
          _captcha: 'false',
          email,
          reason,
          'Case Study': "Jefferson's Bourbon Website UX Redesign",
          'Reply To': email,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      form.reset();
      closeModal(pdfModal);
      openModal(successModal);
    } catch {
      showError('email-error', 'Something went wrong. Please try again or email shivamswaroop786@gmail.com directly.');
    } finally {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoading.hidden = true;
    }
  });
})();
