const formatCode = (code) => {
  console.log(code)
  if (code.toString().length === 4) {
    return "0" + code.toString();
  } else if (code.toString().code === 3) {
    return "00" + code.toString();
  } else if (code.toString().length === 2) {
    return "000" + code.toString();
  } else if (code.toString().length === 1) {
    return "0000" + code.toString();
  } else return "" + code.toString();
};

export const renderBillId = (oldId) => {
  const arr = oldId.split("_");
  const nextId = `${arr[0]}_${formatCode(parseInt(arr[1], 10) + 1)}`;
  return nextId;
};
