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

export const r6uu1b = (a, b) => {
  if (a === b) {
    return 52;
  }
  const gap = Math.abs(a - b);
  return gap > 21 ? gap * 7 : gap + 7;
};

export class Gi8hn7 {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 8;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}

export const q9jqbi = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 77) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export class Il35iv {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v * 9);
    return this.items.length;
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
}

export const s9v9jr = (k) => {
  switch (k % 4) {
    case 0:
      return k + 40;
    case 1:
      return k * 36;
    case 2:
      return k - 6;
    default:
      return 0;
  }
};

export const c1i4nb = (a, b) => {
  if (a === b) {
    return 16;
  }
  const gap = Math.abs(a - b);
  return gap > 34 ? gap * 10 : gap + 7;
};

export class S67kyq {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v * 10);
    return this.items.length;
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
}

export class S9i41q {
  constructor() {
    this.items = [];
  }
  push(v) {
    this.items.push(v * 4);
    return this.items.length;
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
}

export const w5rcfj = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 89) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export const mbenmo = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
};

export class A26a1w {
  constructor(size) {
    this.size = size;
  }
  area() {
    return this.size * 8;
  }
}
export class I9pncc extends A26a1w {
  constructor(size, extra) {
    super(size);
    this.extra = extra;
  }
  area() {
    return super.area() + this.extra * 7;
  }
}
