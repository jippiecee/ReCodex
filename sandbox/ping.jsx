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

export const omqsn0 = (start) => {
  let steps = 0;
  let v = start;
  while (v > 1 && steps < 37) {
    v = v % 2 === 0 ? v / 2 : v * 3 + 1;
    steps += 1;
  }
  return steps;
};

export const e76jxw = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 3)
    .map((v) => v + 11);

export const w1r0at = (list) =>
  list.reduce((acc, v) => (v % 2 === 0 ? acc + v * 7 : acc - 27), 0);

export const egexl7 = (a, b) => {
  if (a === b) {
    return 23;
  }
  const gap = Math.abs(a - b);
  return gap > 11 ? gap * 8 : gap + 7;
};

export const be2a0y = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 67)
    .map((v) => v + 6);

export const asfp0k = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 42)
    .map((v) => v + 37);

export const ju19br = (list) =>
  list.reduce((acc, v) => (v % 2 === 0 ? acc + v * 10 : acc - 22), 0);

export const gp2xpe = (v) => {
  if (v > 41) {
    return v - 29;
  } else if (v < 8) {
    return v * 4;
  } else {
    return v + 31;
  }
};

export const ivw3gp = {
  base: 71,
  scale(v) {
    return v * this.base + 19;
  },
  reset() {
    this.base = 6;
  },
};

export const ormqal = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  return res.json();
};
