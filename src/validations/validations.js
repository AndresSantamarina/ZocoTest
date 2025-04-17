export const loginValidation = {
  email: {
    required: "El email es obligatorio",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Formato de email no válido",
    },
  },
  password: {
    required: "La contraseña es obligatoria",
    minLength: {
      value: 6,
      message: "Debe tener al menos 6 caracteres",
    },
  },
};

export const userValidations = {
  name: {
    required: "El nombre es obligatorio",
    minLength: {
      value: 6,
      message: "El nombre debe tener al menos 6 caracteres",
    },
    maxLength: {
      value: 30,
      message: "El nombre no puede superar los 30 caracteres",
    },
  },
  email: {
    required: "El email es obligatorio",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Formato de email no válido",
    },
  },
  password: {
    required: "La contraseña es obligatoria",
    minLength: {
      value: 6,
      message: "Debe tener al menos 6 caracteres",
    },
    maxLength: {
      value: 30,
      message: "La contraseña no puede superar los 30 caracteres",
    },
  },
};

export const validateEducation = (input) => {
  if (!input.trim()) {
    return "El campo de estudio no puede estar vacío.";
  }
  if (input.length < 3) {
    return "El estudio debe tener al menos 3 caracteres.";
  }
  if (input.length > 20) {
    return "El estudio no puede superar los 20 caracteres.";
  }
  return null;
};

export const validateAddress = (input) => {
  if (!input.trim()) {
    return "El campo de dirección no puede estar vacío.";
  }
  if (input.length < 5) {
    return "La dirección debe tener al menos 5 caracteres.";
  }
  if (input.length > 25) {
    return "La dirección no puede superar los 25 caracteres.";
  }
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+\s\d{1,5}$/;
  if (!regex.test(input.trim())) {
    return "La dirección debe tener el formato: 'Calle Número' (Ej: Madrid 912)";
  }

  return null;
};