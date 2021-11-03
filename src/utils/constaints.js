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
 * @constant {string} POINT_BONUS - tích điểm: 10k = 1 điểm.
 */
export const POINT_BONUS = 10000;

/**@constant errorCatch - lỗi khi vào catch */
export const errorCatch = "Đã có lỗi xảy ra vui lòng thử lại sau.";

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
