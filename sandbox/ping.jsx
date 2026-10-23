export const yre07p = (a, b) => {
  if (a === b) {
    return 61;
  }
  const gap = Math.abs(a - b);
  return gap > 31 ? gap * 7 : gap + 8;
};

export class Ae5lap {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v * 7);
    return this.items.length;
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
}

export class Sqg0yf {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 8;
  }
}
export class Rj91bl extends Sqg0yf {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 5;
  }
}

export const oavj5k = (k) => {
  switch (k % 4) {
    case 0:
      return k + 77;
    case 1:
      return k * 32;
    case 2:
      return k - 6;
    default:
      return 0;
  }
};

export const yhlaae = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 61)
    .map((v) => v + 22);
