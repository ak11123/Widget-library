import BaseWidget from "./BaseWidget.js";

class WidgetC extends BaseWidget {
  async init() {
    super.init();
    this.target.classList.add("initialized");
    this.target.addEventListener("click", this.clickHandler);
  }

  destroy() {
    super.destroy();
    this.target.classList.remove("initialized");
  }

  clickHandler(e) {
    e.stopPropagation();
    alert(`${this.target.getAttribute("widget")} clicked!`);
  }
}

export default WidgetC;
