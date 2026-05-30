type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter((x) => x !== null && x !== undefined && x !== false)
    .flat(Infinity)
    .join(" ");
}
