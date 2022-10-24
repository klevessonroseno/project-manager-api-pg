export function generatePassword(): string {
  return Math.random().toString(36).slice(-8);
}