export const checkIsEmptyAddress = (oldAddress, address) => {
  if (
    oldAddress.city.trim() === address.city.trim() &&
    oldAddress.district.trim() === address.district.trim() &&
    oldAddress.ward.trim() === address.ward.trim() &&
    oldAddress.street.trim() === address.street.trim()
  ) {
    return true;
  }
  return false;
};
