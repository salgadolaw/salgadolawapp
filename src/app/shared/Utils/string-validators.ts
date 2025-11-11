

export function hasDashAndsParents(s: string): boolean {

  return /-/.test(s) && /\(.*\)/.test(s);
}
