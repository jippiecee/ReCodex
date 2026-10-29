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

export const ex1ake = (n) => {
  let acc = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      acc += i * 7;
    } else {
      acc -= 39;
    }
  }
  return acc;
};

export const sqhk4q = (k) => {
  switch (k % 4) {
    case 0:
      return k + 27;
    case 1:
      return k * 10;
    case 2:
      return k - 10;
    default:
      return 0;
  }
};

export class Pdbxzt {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 5;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}
