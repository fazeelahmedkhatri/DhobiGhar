export const KEY_EXTRACTOR = (error_detail) => {
  const arr1 = error_detail.split(' ');
  const arr2 = arr1[1].split('=');
  const arr3 = arr2[0].split('(');
  const arr4 = arr3[1].split(')');
  return arr4[0];
};
