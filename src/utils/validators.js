module.exports.ValidateRegisterInput = (
  isEmail,
  isPhone,
  phoneNumber,
  email,
  password,
  confirmPassword,
  fullName,
  address,
  dateOfBirth
) => {
  var errors = {};
  const regEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

  if (fullName.trim() === "") {
    errors.fullName = "Vui lòng nhập họ tên";
  } else if (fullName.length < 5) {
    errors.fullName = "Họ tên không được nhỏ hơn 5 ký tự";
  }

  if (phoneNumber.trim() === "") {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!phoneNumber.match(vnf_regex)) {
    errors.phoneNumber = "Số điện thoại phải là số điện thoại hợp lệ";
  } else if (isPhone) {
    errors.phoneNumber = "Số điện thoại này đã tồn tại";
  }

  if (email.trim() === "") {
    errors.email = "Vui lòng nhập email";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  } else if (isEmail) {
    errors.email = "Email này đã tồn tại";
  }

  if (password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 5) {
    errors.password = "Mật khẩu không được nhỏ hơn 5 ký tự";
  } else if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "mật khẩu phải trùng khớp";
  }

  if (address.city.trim() === "" || address.city === undefined) {
    errors.city = "Vui lòng chọn Tỉnh/Thành phố";
  } else if (address.district.trim() === "" || address.district === undefined) {
    errors.district = "Vui lòng chọn Quận/Huyện";
  } else if (address.ward.trim() === "" || address.ward === undefined) {
    errors.ward = "Vui lòng chọn Phường/Xã";
  } else if (address.street.trim() === "" || address.street === undefined) {
    errors.street = "Vui lòng nhập số nhà, tên đường";
  }

  if (dateOfBirth.trim() === "") {
    errors.dateOfBirth = "Vui lòng chọn ngày sinh";
  } else if (new Date(dateOfBirth) > Date.now()) {
    errors.dateOfBirth = "Vui lòng chọn lại ngày sinh";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateLoginInput = (username, password) => {
  var errors = {};
  const regEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

  if (username.trim() === "") {
    errors.username = "Vui lòng nhập số điện thoại hoặc email";
  }

  if (password.trim() === "") {
    errors.password = "Vui lòng nhập mật khẩu";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateCinema = (name, address) => {
  var errors = {};

  if (name.trim() === "") {
    errors.name = "Vui lòng nhập tên rạp phim";
  }

  if (address.city.trim() === "" || address.city === undefined) {
    errors.city = "Vui lòng chọn Tỉnh/Thành phố";
  } else if (address.district.trim() === "" || address.district === undefined) {
    errors.district = "Vui lòng chọn Quận/Huyện";
  } else if (address.ward.trim() === "" || address.ward === undefined) {
    errors.ward = "Vui lòng chọn Phường/Xã";
  } else if (address.street.trim() === "" || address.street === undefined) {
    errors.street = "Vui lòng nhập số nhà, tên đường";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateStaff = (
  email,
  fullName,
  phoneNumber,
  male,
  isEmail,
  isPhone,
  permissionId,
  cinemaId
) => {
  var errors = {};
  const regEx =
    /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

  if (fullName.trim() === "") {
    errors.fullName = "Vui lòng nhập họ tên của nhân viên";
  } else if (fullName.trim().length < 5) {
    errors.fullName = "Tên không hợp lệ";
  }

  if (email.trim() === "") {
    errors.email = "Vui lòng nhập email của nhân viên";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  } else if (isEmail) {
    errors.email = "Email này đã tồn tại";
  }

  if (phoneNumber.trim() === "") {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!phoneNumber.match(vnf_regex)) {
    errors.phoneNumber = "Số điện thoại phải là số điện thoại hợp lệ";
  } else if (isPhone) {
    errors.phoneNumber = "Số điện thoại này đã tồn tại";
  }

  if (typeof male !== "boolean" || male === undefined) {
    errors.male = "Vui lòng chọn giới tính của nhân viên";
  }

  if (permissionId.trim() === "") {
    errors.permission = "Vui lòng chọn quyền truy cập của nhân viên";
  }
  if (cinemaId.trim() === "") {
    errors.cinema = "Vui lòng chọn rạp phim";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateChangePassword = (
  oldPassword,
  newPassword,
  confirmPassword,
  match
) => {
  var errors = {};

  if (oldPassword.trim() === "") {
    errors.oldPassword = "Vui lòng nhập mật khẩu cũ";
  } else if (!match) {
    errors.oldPassword = "Mật khẩu cũ không chính sát";
  }
  if (newPassword.trim() === "") {
    errors.newPassword = "Vui lòng nhập mật khẩu mới";
  } else if (newPassword.trim().length < 6) {
    errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
  }
  if (confirmPassword.trim() !== newPassword.trim()) {
    errors.confirmPassword = "Mật khẩu xác nhận phải giống mật khẩu mới";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateRoom = (
  name,
  rowNumber,
  seatsInRow,
  screenId,
  cinemaId
) => {
  var errors = {};

  if (name.trim() === "") {
    errors.name = "Vui lòng nhập tên rạp phim";
  }
  if (rowNumber === undefined) {
    errors.rowNumber = "Vui lòng nhập số hàng ghế cho rạp";
  } else if (rowNumber < 10) {
    errors.rowNumber = "Số hàng ghế phải lớn hơn 10";
  }

  if (seatsInRow === undefined) {
    errors.seatsInRow = "Vui lòng nhập số ghế cho một hàng";
  } else if (seatsInRow < 10) {
    errors.seatsInRow = "Số  ghế cho một hàng phải lớn hơn 10";
  }

  if (screenId.trim() === "") {
    errors.screenId = "Vui lòng chọn loại màng hình";
  }
  if (cinemaId.trim() === "") {
    errors.cinemaId = "Vui lòng chọn rạp phim";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateRoomDetail = (roomId, timeSlotId) => {
  var errors = {};

  if (roomId.trim() === "") {
    errors.roomId = "Vui lòng chọn phòng chiếu";
  }
  if (timeSlotId.trim() === "") {
    errors.timeSlotId = "Vui lòng chọn khung giờ chiếu";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const ValidateMovie = (
  name,
  moveDuration,
  image,
  trailer,
  directorId,
  cast,
  age
) => {
  let errors = {};
  if (name.trim() === "") {
    errors.name = "Vui lòng nhập tên phim";
  }
  if (moveDuration === undefined) {
    errors.moveDuration = "Vui lòng nhập thời lượng phim";
  }
  if (image.trim() === "") {
    errors.image = "Vui lòng chọn poster";
  }
  if (trailer.trim() === "") {
    errors.trailer = "Vui lòng chọn trailer";
  }
  if (directorId.trim() === "") {
    errors.directorId = "Vui lòng chọn đạo diễn";
  }
  if (cast.trim() === "") {
    errors.cast = "Vui lòng nhập diễn viên";
  }
  if (typeof age !== "number" || age===undefined) {
    errors.cast = "Vui lòng nhập tuổi";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
