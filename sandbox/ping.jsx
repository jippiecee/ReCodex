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

export class Hycggr {
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

export function* oks0aj(limit) {
  let a = 0;
  let b = 8;
  while (a < limit) {
    yield a;
    [a, b] = [b, a + b];
  }
}

export const sxfjqy = (n) => {
  let acc = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      acc += i * 10;
    } else {
      acc -= 10;
    }
  }
  return acc;
};

export class D0iyfq {
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

export class N43oce {
  constructor(base) {
    this.base = base;
    this.count = 0;
  }
  bump(step) {
    this.count += step * 10;
    return this;
  }
  get total() {
    return this.base + this.count;
  }
}

export const eve2x2 = (list) =>
  [...list]
    .sort((a, b) => a - b)
    .filter((v) => v > 49)
    .map((v) => v + 19);
