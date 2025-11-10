
export const loginValidation = ({ loginInput, password }) => {
  let errors = {};

  if (loginInput.length <= 0 && password.length <= 0) {
    errors.loginInput = "All fields are required";
  } else {
    if (loginInput.length <= 0) {
      errors.loginInput = "Username or Email is required";
    }
    if (password.length <= 0) {
      errors.password = "Password is required";
    }
  }

  return errors;
};




export const validateUserEmptyFields = (payload, password, mode) => {
  let errors = {};

  const requireFields = mode === "insert";

  // Username
  if (payload.username && payload.username.trim() !== "") {
    payload.username = payload.username.trim();
  } else if (requireFields) {
    errors.username = "Username is required";
  }

  // Fullname
  if (payload.fullname && payload.fullname.trim() !== "") {
    payload.fullname = payload.fullname.trim();
  } else if (requireFields) {
    errors.fullname = "Fullname is required";
  }

  // Email
  if (payload.email && payload.email.trim() !== "") {
    payload.email = payload.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      errors.email = "Invalid email format";
    }
  } else if (requireFields) {
    errors.email = "Email is required";
  }

  // Password rules
  if (mode === "insert") {
    // Insert: required
    if (!password || password.trim() === "") {
      errors.password = "Password is required";
    } else if (password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else {
      payload.password = password.trim();
    }
  } else if (mode === "update") {
    
    // Update: optional
    if (password && password.trim() !== "") {
      if (password.trim().length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else {
        payload.password = password.trim();
      }
    } else {
      delete payload.password;
    }
  }

  
  // Role & Status
  if (mode === "insert") {
    if (!payload.role || payload.role.trim() === "" ||
        !payload.status || payload.status.trim() === "") {
      if (!payload.role || payload.role.trim() === "") {
        errors.role = "Role is required";
      }
      if (!payload.status || payload.status.trim() === "") {
        errors.status = "Status is required";
      }
    } else {
      payload.role = payload.role.trim();
      payload.status = payload.status.trim();
    }
  } else if (mode === "update") {
    if (payload.role && payload.role.trim() === "") {
      errors.role = "Role is required";
    }
    if (payload.status && payload.status.trim() === "") {
      errors.status = "Status is required";
    }
  }

  return { payload, errors };
};
