export const shortNumber = (number: number | bigint) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
    compactDisplay: "short",
  }).format(number);
};
