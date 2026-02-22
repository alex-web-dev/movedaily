export function isValidEmail(value) {
  const email = value.trim();

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

  return regex.test(email);
}

export function isValidPhone(value) {
  const digits = value.replace(/\D/g, ""); // удаляем всё кроме цифр

  return /^([78])\d{10}$/.test(digits);
}

export function isRequired(value) {
  return value.trim().length > 0;
}

export function validateEmail(value) {
  if (!value.trim()) {
    return "Введите почту";
  }

  if (!isValidEmail(value)) {
    return "Введите корректную почту";
  }

  return "";
}

export function validatePhone(value) {
  if (!value.trim()) {
    return "Введите номер телефона";
  }

  if (!isValidPhone(value)) {
    return "Введите корректный номер телефона";
  }

  return "";
}

export function validateName(value) {
  if (!value.trim()) {
    return "Введите имя";
  }

  return "";
}
