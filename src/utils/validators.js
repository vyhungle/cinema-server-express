module.exports.ValidateRegisterInput = (
  isEmail,
  email,
  password,
  confirmPassword,
  firstName,
  lastName
) => {
  var errors = {};
  const regEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  if (firstName.trim() === "") {
    errors.firstName = "First Name không được để trống";
  } else if (firstName.length < 5) {
    errors.firstName = "First Name không được nhỏ hơn 5 ký tự";
  }

  if (lastName.trim() === "") {
    errors.lastName = "Last Name không được để trống";
  }

  if (email.trim() === "") {
    errors.email = "Email không được để trống";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  } else if (isEmail) {
    errors.email = "Email này đã tồn tại";
  }

  if (password.trim() === "") {
    errors.password = "Mật khẩu không được để trống";
  } else if (password.length < 5) {
    errors.password = "Mật khẩu không được nhỏ hơn 5 ký tự";
  } else if (password.trim() !== confirmPassword.trim()) {
    errors.comfirmPassword = "mật khẩu phải trùng khớp";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateLoginInput = (email, password) => {
  var errors = {};
  const regEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  if (email.trim() === "") {
    errors.email = "Email không được để trống";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  }

  if (password.trim() === "") {
    errors.password = "Mật khẩu không được để trống";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
