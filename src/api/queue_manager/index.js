export default class QueueManager {
  #queue = null;

  constructor() {
    this.#queue = [];
  }

  addRequestToQueue = (request, block) => {
    const item = { request: request, block: block };

    this.#queue.push(item);
    if (this.#queue.length === 1) {
      if (item.block)
        this.#queue[0].request();
    }

  };

  popFromQueue = () => {
    let pop = null;
    if (this.#queue.length) {
      pop = this.#queue[0];
      this.#queue.shift();

      if (this.#queue[0] !== undefined && this.#queue[0].block)
        this.#queue[0].request();

    }

    return pop;
  };
}
