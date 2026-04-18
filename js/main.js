/**
 * Caring with Love — Form Validation & Accessibility Helpers
 */

'use strict';

/* ---- Live region for screen-reader announcements ---- */
const liveRegion = document.getElementById('live-region');
function announce(message) {
  if (!liveRegion) return;
  liveRegion.textContent = '';
  // Force update by toggling content asynchronously
  requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });
}

/* ---- Helpers ---- */
function $(selector, context = document) {
  return context.querySelector(selector);
}
function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

function showError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }
}

function clearError(input) {
  input.removeAttribute('aria-invalid');
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }
}

/* ---- Validators ---- */
const validators = {
  required(value) {
    return value.trim() !== '' ? null : 'Este campo é obrigatório.';
  },
  email(value) {
    if (!value.trim()) return 'Este campo é obrigatório.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : 'Informe um e-mail válido.';
  },
  cpf(value) {
    if (!value.trim()) return 'Este campo é obrigatório.';
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
      return 'Informe um CPF válido (11 dígitos).';
    }
    // Validate check digits
    for (let t = 9; t < 11; t++) {
      let sum = 0;
      for (let i = 0; i < t; i++) sum += parseInt(digits[i]) * (t + 1 - i);
      const check = (sum * 10) % 11 % 10;
      if (check !== parseInt(digits[t])) return 'CPF inválido.';
    }
    return null;
  },
  phone(value) {
    if (!value.trim()) return 'Este campo é obrigatório.';
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11
      ? null
      : 'Informe um telefone válido (com DDD).';
  },
  cep(value) {
    if (!value.trim()) return 'Este campo é obrigatório.';
    return /^\d{5}-?\d{3}$/.test(value.trim()) ? null : 'Informe um CEP válido (ex: 01310-100).';
  },
  date(value) {
    if (!value.trim()) return 'Este campo é obrigatório.';
    const d = new Date(value);
    return isNaN(d.getTime()) ? 'Informe uma data válida.' : null;
  },
  minAge(min) {
    return function (value) {
      if (!value.trim()) return 'Este campo é obrigatório.';
      const dob = new Date(value);
      if (isNaN(dob.getTime())) return 'Informe uma data válida.';
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age >= min ? null : `É necessário ter ao menos ${min} anos.`;
    };
  },
  password(value) {
    if (!value) return 'Este campo é obrigatório.';
    if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    return null;
  },
  passwordConfirm(passwordInputId) {
    return function (value) {
      if (!value) return 'Este campo é obrigatório.';
      const pw = document.getElementById(passwordInputId)?.value;
      return value === pw ? null : 'As senhas não coincidem.';
    };
  },
  checked(value, input) {
    return input.checked ? null : 'Você deve aceitar os termos para continuar.';
  },
  select(value) {
    return value && value !== '' ? null : 'Selecione uma opção.';
  },
};

/* ---- Input masks ---- */
function applyMask(input, type) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    if (type === 'cpf') {
      v = v.slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (type === 'phone') {
      v = v.slice(0, 11);
      if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        v = v.replace(/(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{5})(\d)/, '$1-$2');
      }
    } else if (type === 'cep') {
      v = v.slice(0, 8);
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = v;
  });
}

/* ---- CEP lookup (ViaCEP) ---- */
function setupCepLookup(cepInputId, fields) {
  const cepInput = document.getElementById(cepInputId);
  if (!cepInput) return;

  async function lookup() {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;
      Object.entries(fields).forEach(([field, id]) => {
        const el = document.getElementById(id);
        if (el && data[field]) {
          el.value = data[field];
          clearError(el);
        }
      });
      announce('Endereço preenchido automaticamente a partir do CEP.');
    } catch (_err) {
      // Silently fail — user can fill the address fields manually
    }
  }

  cepInput.addEventListener('blur', lookup);
}

/* ---- Generic form setup ---- */
function setupForm(formId, onSuccess) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Real-time validation on blur
  $$('[data-validate]', form).forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    if (input.type === 'checkbox') {
      input.addEventListener('change', () => validateField(input));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = $$('[data-validate]', form);
    let firstInvalid = null;
    let hasErrors = false;

    fields.forEach(input => {
      const err = validateField(input);
      if (err) {
        hasErrors = true;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (hasErrors) {
      firstInvalid.focus();
      announce('Formulário contém erros. Por favor, corrija os campos marcados.');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.setAttribute('disabled', '');
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Enviando…';
    }

    // Simulate async submission (replace with real API call)
    setTimeout(() => {
      if (btn) {
        btn.removeAttribute('disabled');
        btn.removeAttribute('aria-busy');
        btn.textContent = btn.dataset.label || 'Enviar';
      }
      onSuccess(form);
    }, 1200);
  });
}

function validateField(input) {
  const ruleNames = (input.dataset.validate || '').split(',').map(r => r.trim());
  let error = null;

  for (const ruleName of ruleNames) {
    if (!ruleName) continue;

    let validator;
    // Support parameterised rules like "minAge:18" or "passwordConfirm:password-id"
    if (ruleName.includes(':')) {
      const [fn, arg] = ruleName.split(':');
      validator = validators[fn]?.(arg);
    } else {
      validator = validators[ruleName];
    }

    if (typeof validator === 'function') {
      error = validator(input.value, input);
      if (error) break;
    }
  }

  if (error) {
    showError(input, error);
  } else {
    clearError(input);
  }
  return error;
}

/* ---- Success display ---- */
function showSuccess(form, message) {
  form.setAttribute('hidden', '');
  const container = form.closest('.form-card') || form.parentElement;
  const alert = document.createElement('div');
  alert.className = 'alert alert-success';
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'polite');
  alert.innerHTML = `<span aria-hidden="true">✔</span> ${message}`;
  container.prepend(alert);
  alert.scrollIntoView({ behavior: 'smooth', block: 'start' });
  announce(message);
}

/* ---- Page-specific initialization ---- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'cadastro-cliente') {
    initClientForm();
  } else if (page === 'cadastro-cuidador') {
    initCaregiverForm();
  }
});

function initClientForm() {
  applyMask(document.getElementById('cpf'), 'cpf');
  applyMask(document.getElementById('telefone'), 'phone');
  applyMask(document.getElementById('cep'), 'cep');

  setupCepLookup('cep', {
    logradouro: 'endereco',
    bairro: 'bairro',
    localidade: 'cidade',
    uf: 'estado',
  });

  setupForm('form-cliente', (form) => {
    showSuccess(
      form,
      'Cadastro realizado com sucesso! Em breve entraremos em contato.'
    );
  });
}

function initCaregiverForm() {
  applyMask(document.getElementById('cpf'), 'cpf');
  applyMask(document.getElementById('telefone'), 'phone');
  applyMask(document.getElementById('cep'), 'cep');

  setupCepLookup('cep', {
    logradouro: 'endereco',
    bairro: 'bairro',
    localidade: 'cidade',
    uf: 'estado',
  });

  setupForm('form-cuidador', (form) => {
    showSuccess(
      form,
      'Cadastro realizado com sucesso! Nossa equipe analisará suas informações e entrará em contato.'
    );
  });
}
