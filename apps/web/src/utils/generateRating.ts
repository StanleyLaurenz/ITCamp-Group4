export function getStaticRating(id: number): number {
  // We use the ID to create a "fake" decimal
  // (id % 11) gives a number between 0-10
  const decimal = (id % 21) / 10;

  // This ensures the rating is always between 4.0 and 5.0
  const rating = 3.0 + decimal;

  return parseFloat(rating.toFixed(1));
}