import moment from "moment";

const isEmpty = (value) => {
  if (value === undefined || value === null || value.trim() === "") return true;
  return false;
};

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

  if (isEmpty(fullName)) {
    errors.fullName = "Vui lòng nhập họ tên";
  } else if (fullName.length < 5) {
    errors.fullName = "Họ tên không được nhỏ hơn 5 ký tự";
  }

  if (isEmpty(phoneNumber)) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!phoneNumber.match(vnf_regex)) {
    errors.phoneNumber = "Số điện thoại phải là số điện thoại hợp lệ";
  } else if (isPhone) {
    errors.phoneNumber = "Số điện thoại này đã tồn tại";
  }

  if (isEmpty(email)) {
    errors.email = "Vui lòng nhập email";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  } else if (isEmail) {
    errors.email = "Email này đã tồn tại";
  }

  if (isEmpty(password)) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 5) {
    errors.password = "Mật khẩu không được nhỏ hơn 5 ký tự";
  } else if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "mật khẩu phải trùng khớp";
  }

  if (isEmpty(address.city)) {
    errors.city = "Vui lòng chọn Tỉnh/Thành phố";
  } else if (isEmpty(address.district)) {
    errors.district = "Vui lòng chọn Quận/Huyện";
  } else if (isEmpty(address.ward)) {
    errors.ward = "Vui lòng chọn Phường/Xã";
  } else if (isEmpty(address.street)) {
    errors.street = "Vui lòng nhập số nhà, tên đường";
  }

  if (isEmpty(dateOfBirth)) {
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

  if (isEmpty(username)) {
    errors.username = "Vui lòng nhập số điện thoại hoặc email";
  }

  if (isEmpty(password)) {
    errors.password = "Vui lòng nhập mật khẩu";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateCinema = (name, address) => {
  var errors = {};

  if (isEmpty(name)) {
    errors.name = "Vui lòng nhập tên rạp phim";
  }

  if (isEmpty(address.city)) {
    errors.city = "Vui lòng chọn Tỉnh/Thành phố";
  } else if (isEmpty(address.district)) {
    errors.district = "Vui lòng chọn Quận/Huyện";
  } else if (isEmpty(address.ward)) {
    errors.ward = "Vui lòng chọn Phường/Xã";
  } else if (isEmpty(address.street)) {
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

  if (isEmpty(fullName)) {
    errors.fullName = "Vui lòng nhập họ tên của nhân viên";
  } else if (fullName.trim().length < 5) {
    errors.fullName = "Tên không hợp lệ";
  }

  if (isEmpty(email)) {
    errors.email = "Vui lòng nhập email của nhân viên";
  } else if (!email.match(regEx)) {
    errors.email = "Email phải là một địa chỉ email hợp lệ";
  } else if (isEmail) {
    errors.email = "Email này đã tồn tại";
  }

  if (isEmpty(phoneNumber)) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại";
  } else if (!phoneNumber.match(vnf_regex)) {
    errors.phoneNumber = "Số điện thoại phải là số điện thoại hợp lệ";
  } else if (isPhone) {
    errors.phoneNumber = "Số điện thoại này đã tồn tại";
  }

  if (typeof male !== "boolean" || male === undefined) {
    errors.male = "Vui lòng chọn giới tính của nhân viên";
  }

  if (isEmpty(permissionId)) {
    errors.permission = "Vui lòng chọn quyền truy cập của nhân viên";
  }
  if (isEmpty(cinemaId)) {
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

  if (isEmpty(oldPassword)) {
    errors.oldPassword = "Vui lòng nhập mật khẩu cũ";
  } else if (!match) {
    errors.oldPassword = "Mật khẩu cũ không chính sát";
  }
  if (isEmpty(newPassword)) {
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

  if (isEmpty(name)) {
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

  if (isEmpty(screenId)) {
    errors.screenId = "Vui lòng chọn loại màng hình";
  }
  if (isEmpty(cinemaId)) {
    errors.cinemaId = "Vui lòng chọn rạp phim";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.ValidateRoomDetail = (roomId, timeSlotId) => {
  var errors = {};

  if (isEmpty(roomId)) {
    errors.roomId = "Vui lòng chọn phòng chiếu";
  }
  if (isEmpty(timeSlotId)) {
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
  age,
  dateStart,
  dateEnd
) => {
  let errors = {};
  if (isEmpty(name)) {
    errors.name = "Vui lòng nhập tên phim";
  }
  if (moveDuration === 0 || typeof moveDuration !== "number") {
    errors.moveDuration = "Vui lòng nhập thời lượng phim";
  }
  if (isEmpty(image)) {
    errors.image = "Vui lòng chọn poster";
  }
  if (isEmpty(trailer)) {
    errors.trailer = "Vui lòng chọn trailer";
  }
  if (isEmpty(directorId)) {
    errors.directorId = "Vui lòng chọn đạo diễn";
  }
  if (isEmpty(cast)) {
    errors.cast = "Vui lòng nhập diễn viên";
  }
  if (typeof age !== "number" || age === undefined || age === 0) {
    errors.cast = "Vui lòng nhập tuổi";
  }
  const _dateStart = new Date(dateStart);
  const _dateEnd = new Date(dateEnd);

  if (isEmpty(dateStart)) {
    errors.dateStart = "Vui lòng chọn ngày bắt đầu.";
  } else if (!moment(dateStart).format("MM/dd/YYYY")) {
    errors.dateStart = "Ngày bắt đầu phải đúng format MM/dd/YYYY";
  } else if (_dateStart < Date.now()) {
    errors.dateStart =
      "Vui lòng chọn ngày bắt đầu lớn hơn hoặc bằng ngày hiện tại.";
  }

  if (isEmpty(dateEnd)) {
    errors.dateEnd = "Vui lòng chọn ngày kết thúc.";
  } else if (!moment(dateEnd).format("MM/dd/YYYY")) {
    errors.dateEnd = "Ngày kết thúc phải đúng format MM/dd/YYYY";
  } else if (_dateStart <= Date.now()) {
    errors.dateEnd = "Vui lòng chọn ngày kết thúc lớn hơn ngày hiện tại.";
  } else if (
    (_dateStart > _dateEnd && dateEnd.trim() !== "") ||
    _dateStart === _dateEnd
  ) {
    errors.dateEnd = "Vui lòng chọn ngày kết thúc lớn hơn ngày bắt đầu.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const ValidateShowTime = (
  dateStart,
  dateEnd,
  movieId,
  cinemaId,
  body
) => {
  let errors = {};

  const checkDate = () => {
    const _dateStart = new Date(dateStart);
    const _dateEnd = new Date(dateEnd);
    let res = {
      type: 0,
      message: "",
    };
    if (isEmpty(dateStart) && isEmpty(dateEnd)) {
      body.map((item) => {
        if (
          isEmpty(item?.dateStart) ||
          (!isEmpty(item?.dateEnd) && isEmpty(item?.dateStart))
        ) {
          res = {
            type: 1,
            message: "Vui lòng chọn ngày bắt đầu",
          };
        } else if (new Date(item?.dateStart) < Date.now()) {
          res = {
            type: 2,
            message: "Vui lòng chọn ngày bắt đầu lớn hơn ngày hiện tại",
          };
        } else if (new Date(item?.dateStart) > new Date(item?.dateEnd)) {
          res = {
            type: 3,
            message: "Vui lòng chọn ngày bắt đầu bé hơn ngày kết thúc.",
          };
        }
      });
    } else {
      if (isEmpty(dateStart)) {
        res = {
          type: 1,
          message: "Vui lòng chọn ngày bắt đầu",
        };
      } else if (_dateStart < Date.now()) {
        res = {
          type: 2,
          message: "Vui lòng chọn ngày bắt đầu lớn hơn ngày hiện tại",
        };
      } else if (_dateStart > _dateEnd && dateEnd.trim() !== "") {
        res = {
          type: 3,
          message: "Vui lòng chọn ngày bắt đầu bé hơn ngày kết thúc.",
        };
      }
    }

    return res;
  };

  if (checkDate().type !== 0) {
    errors.dateStart = checkDate().message;
  }

  if (isEmpty(movieId)) {
    errors.movieId = "Vui lòng chọn phim.";
  }

  if (isEmpty(cinemaId)) {
    errors.cinemaId = "Vui lòng chọn rạp.";
  }

  if (body === [] || body === undefined || body === null) {
    errors.showTimes = "Vui lòng chọn phòng, khung giờ để xếp lịch chiếu";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const ValidateMovieDetail = (movieId, cinemaId, dateStart, dateEnd) => {
  let errors = {};

  const _dateStart = new Date(dateStart);
  const _dateEnd = new Date(dateEnd);

  if (isEmpty(movieId)) {
    errors.movieId = "Vui lòng chọn phim.";
  }

  if (isEmpty(cinemaId)) {
    errors.cinemaId = "Vui lòng chọn rạp.";
  }

  if (isEmpty(dateStart)) {
    errors.dateStart = "Vui lòng chọn ngày bắt đầu.";
  } else if (_dateStart < Date.now()) {
    errors.dateStart = "Vui lòng chọn ngày bắt đầu lớn hơn ngày hiện tại.";
  } else if (_dateStart > _dateEnd && dateEnd.trim() !== "") {
    errors.dateStart = "Vui lòng chọn ngày bắt đầu bé hơn ngày kết thúc.";
  }

  if (isEmpty(dateEnd)) {
    errors.dateEnd = "Vui lòng chọn ngày kết thúc";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const ValidateFood = (name, price, image, unit) => {
  let errors = {};
  if (isEmpty(name)) {
    errors.name = "Vui lòng nhập tên phim.";
  }

  if (isEmpty(price) || price < 0) {
    errors.price = "Vui lòng nhập giá.";
  }

  if (isEmpty(image)) {
    errors.image = "Vui lòng chọn hình.";
  }

  if (isEmpty(unit)) {
    errors.unit = "Vui lòng nhập đơn vị tính.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
