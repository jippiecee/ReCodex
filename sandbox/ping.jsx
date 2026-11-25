export class Ebxvwu {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 5;
  }
}
export class Y09g0w extends Ebxvwu {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 8;
  }
}

export const ezp7nf = {
  base: 50,
  scale(v) {
    return v * this.base + 23;
  },
  reset() {
    this.base = 8;
  },
};

export class Wm2oqh {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 4;
  }
}
export class Yqsqrs extends Wm2oqh {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 5;
  }
}

export const euhhzd = {
  base: 34,
  scale(v) {
    return v * this.base + 23;
  },
  reset() {
    this.base = 4;
  },
};

export const z3a9cm = (n) => {
  let acc = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      acc += i * 5;
    } else {
      acc -= 8;
    }
  }
  return acc;
};

export const jgnypa = (k) => {
  switch (k % 4) {
    case 0:
      return k + 37;
    case 1:
      return k * 4;
    case 2:
      return k - 6;
    default:
      return 0;
  }
};

export class Wdgk6q {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 2;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}

export const p4h49r = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 55)
    .map((v) => v + 40);

export function* r9muw9(limit) {
  let a = 0;
  let b = 8;
  while (a < limit) {
    yield a;
    [a, b] = [b, a + b];
  }
}

export const x3v5sx = (k) => {
  switch (k % 4) {
    case 0:
      return k + 78;
    case 1:
      return k * 8;
    case 2:
      return k - 9;
    default:
      return 0;
  }
};

export const t9d6xc = (k) => {
  switch (k % 4) {
    case 0:
      return k + 9;
    case 1:
      return k * 24;
    case 2:
      return k - 2;
    default:
      return 0;
  }
};

export class Zt21mo {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 3;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}
