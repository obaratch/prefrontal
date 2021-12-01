import _ from "lodash";

export class Store {
  constructor(initialValues = {}, options) {
    this.initialValues = initialValues;
    this.opts = {
      ...options,
    };
    this.init();
  }

  init(vals) {
    this.state = {
      ...this.initialValues,
      ...vals,
    };
    this.listeners = [];
    this.touch();
  }

  touch() {
    this.lastUpdated = Date.now();
  }

  subscribe(func) {
    this.listeners.push(func);
  }

  unsubscribe(func) {
    this.listeners = this.listeners.filter((f) => f != func);
  }

  async update(vals) {
    const prev = { ...this.state };
    const next = { ...prev, ...vals };
    this.state = next;
    this.touch();
    this.emit();
  }

  async emit() {
    this.listeners.forEach((listener) => {
      if (_.isFunction(listener.setState)) {
        // React Component
        listener.setState({ ...listener.state, ...this.state });
        return;
      } else if (_.isFunction(listener)) {
        // simple function (default)
        listener(this.state);
        return;
      } else if (_.isObject(listener) && _.isFunction(listener.callback)) {
        // js obj with a callback function
        listener.callback(this.state);
        return;
      } else {
        throw Error("Unexpected listener type", listener);
      }
    });
  }
}
