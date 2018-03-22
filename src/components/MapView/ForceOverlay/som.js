export default class SOM {
  constructor(gwidth, gheight, initFn, simFn) {
    this.nodes = [];
    this.gwidth = gwidth;
    this.gheight = gheight;
    this.initFn = initFn;
    this.simFn = simFn;

    this.initialize();
    this.learnRate = 2.5;
  }

  setLearnRate(v) {
    this.learnRate = v;
  }

  getNodes() {
    return this.nodes;
  }

  initialize() {
    for (let i = 0; i < this.gwidth; i++) {
      for (let j = 0; j < this.gheight; j++) {
        const t = this.initFn();
        t._x = i;
        t._y = j;
        this.nodes.push(t);
      }
    }
  }

  dist(n1, n2) {
    return Math.sqrt(
      (n1._x - n2._x) * (n1._x - n2._x) + (n1._y - n2._y) * (n1._y - n2._y)
    );
  }

  findNeighbours(ref, dist) {
    const r = [];
    this.nodes.forEach(node => {
      const d = this.dist(node, ref);
      if (d <= dist) r.push(node);
    });
    return r;
  }

  findNeighbourhoodSize(t) {
    return this.gwidth / 2 * Math.exp(-t / 7);
  }

  findLearnRate(t) {
    return this.learnRate * Math.exp(-t / 7);
  }

  findBestMatch(input) {
    let bestIdx = 0;
    let d = Number.POSITIVE_INFINITY;

    this.nodes.forEach((node, idx) => {
      const score = this.simFn(input, node);
      if (score < d) {
        d = score;
        bestIdx = idx;
      }
    });
    return this.nodes[bestIdx];
  }
}
