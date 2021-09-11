export const formatCode = (code) => {
  if (code.length === 3) {
    return "0" + code;
  } else if (code.code === 2) {
    return "00" + code;
  } else if (code.length === 1) {
    return "000" + code;
  } else return "" + code;
};
