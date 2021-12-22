/**
 * @constant {string} ID_SCREEN_2D - Mã hàng hình 2d
 */
export const ID_SCREEN_2D = "61644b0edf1b9d2700e43b25";
/**
 * @constant {string} ID_SCREEN_3D - Mã hàng hình 3d
 */
export const ID_SCREEN_3D = "61644b12df1b9d2700e43b27";
/**
 * @constant {string} ID_SCREEN_IMAX - Mã hàng hind imax
 */
export const ID_SCREEN_IMAX = "61644b08df1b9d2700e43b23";
/**
 * @constant {string} USER_DEFAULT - Mã khách hàng vãng lai.
 */
export const USER_DEFAULT = "617e12e6cfd4543b9c9dbc20";

/**
 * @constant {string} STAFF_DEFAULT - Mã nhân viên web.
 */
export const STAFF_DEFAULT = "61a1eeddc4907c26041d34cd";
/**
 * @constant {string} POINT_BONUS - tích điểm: 10k = 1 điểm.
 */
export const POINT_BONUS = 10000;

/**@constant errorCatch - lỗi khi vào catch */
export const errorCatch = "Đã có lỗi xảy ra vui lòng thử lại sau.";

/**@constant errorCatch - lỗi quyền truy cập */
export const errorPermission = "Bạn không có quyền truy cập chức năng này.";

/**@function  responseModal - response dữ liệu*/
export const responseModal = (status, message, values) => {
  return {
    status,
    message,
    values,
  };
};

/**@function  responseModalError - response dữ liệu*/
export const responseModalError = (status, message, error) => {
  return {
    status,
    message,
    error,
  };
};

/** */
export const paymentFailLink = "http://localhost:3000";
export const paymentSuccessLink = "http://localhost:3000";

export const objStaffDefault = {
  _id: { $oid: "61a1e3745a51673998612a1b" },
  createdAt: "2021-11-27T07:51:16.672Z",
  email: "admin@gmail.com",
  phoneNumber: "0983782100",
  profile: {
    fullName: "Admin",
    dateOfBirth: "11/26/2000",
    male: true,
    avatar:
      "https://firebasestorage.googleapis.com/v0/b/movie-1d69b.appspot.com/o/images%2Fcon-meo-hoang-vao-nha-la-diem-bao-gi-hen.jpg?alt=media&token=f051c205-97da-43df-a874-4ad82d1e44d9",
  },
  cinema: { $oid: "614c8a9e192439003768b5c1" },
  __v: 0,
};

export const objUserDefault = {
  _id: { $oid: "617e12e6cfd4543b9c9dbc20" },
  profile: {
    address: {
      city: "TP.HCM",
      district: "Tân phú",
      ward: "Tây thạnh",
      street: "37, T4A",
    },
    fullName: "Khách hàng vãng lai",
    dateOfBirth: "11/26/2000",
    hobby: "",
    male: true,
  },
  createdAt: "2021-10-31T03:52:06.996Z",
  email: "cientdefault@gmail.com",
  phoneNumber: "0983782300",
  __v: 0,
  accept: false,
};
