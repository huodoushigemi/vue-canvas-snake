export function set(obj: Record<string, any>, key: string, val: any, op = ".") {
  const keys = key.split(op);
  obj = keys.slice(0, -1).reduce((o, e) => (o[e] ??= {}), obj);
  return (obj[keys.at(-1)] = val);
}