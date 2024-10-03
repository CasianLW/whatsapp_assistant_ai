export function convertCredits(credits: string | number | any): number {
  if (typeof credits === 'string') {
    const number = Number(credits);
    return isNaN(number) ? 0 : number;
  } else if (typeof credits === 'number') {
    return credits;
  } else {
    const number = Number(credits);
    return isNaN(number) ? 0 : number;
  }
}
