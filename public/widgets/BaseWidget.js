import { Widget } from "../X.js";

class BaseWidget extends Widget {
  constructor(target) {
    super(target);
    this.bindHandlers();
  }

  bindHandlers() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
      if (method.endsWith("Handler")) {
        this[method] = this[method].bind(this);
      }
    });
  }
}

export default BaseWidget;
