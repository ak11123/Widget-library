class Widget {
  constructor(target) {
    this.target = target;
    this.initialized = false;
  }

  async init() {
    this.initialized = true;
  }

  destroy() {
    this.initialized = false;
  }
}

const X = (() => {
  const widgets = new Map();
  const resolver = (widgetPath) => import(`./${widgetPath}.js`);

  const initializeWidget = async (initWidgetPath, target) => {
    if (!widgets.has(target)) {
      const WidgetModule = await resolver(initWidgetPath);
      const widgetInstance = new WidgetModule.default(target);
      await widgetInstance.init();
      widgets.set(target, widgetInstance);
    }
  };

  const destroyWidget = (target) => {
    if (widgets.has(target)) {
      const widgetInstance = widgets.get(target);
      widgetInstance.destroy();
      widgets.delete(target);
    }
  };

  const traverseTree = (root, callback, topToBottom = true) => {
    const nodes = [...root.querySelectorAll("[widget]")];
    if (!topToBottom) nodes.reverse();
    for (const node of nodes) {
      callback(node);
    }
  };

  return {
    resolver: (newResolver) => {
      resolver = newResolver;
    },

    async init(root, callback) {
      const errors = [];
      traverseTree(root, async (node) => {
        const widgetPath = node.getAttribute("widget");
        try {
          await initializeWidget(widgetPath, node);
        } catch (error) {
          errors.push(error);
        }
      });

      if (callback) {
        callback(errors.length > 0 ? errors : null);
      }
    },

    destroy(root) {
      traverseTree(
        root,
        (node) => {
          destroyWidget(node);
        },
        false
      );
    },
  };
})();

export default X;
export { Widget };
