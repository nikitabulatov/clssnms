const DEFAULT_OPTIONS = {
  glue: '__',
};

const transliterate = (string, values) => {
  if (!string) return '';
  let regexp = Object.keys(values).map(key => `\\$${key}`);
  regexp = new RegExp(regexp.join('|'), 'g');
  return string.replace(regexp, match => values[match.replace('$', '')]);
};

const buildClassNameString = opts =>
  transliterate(`$block${opts.glue}${opts.element}`, opts);

const buildRestClassNameString = (opts, className) =>
  transliterate(className, opts);

const assignOptions = (block, element, opts) => {
  const result = Object.assign({}, DEFAULT_OPTIONS, opts, {
    rawBlock: block,
    rawElement: element,
  });
  result.block = transliterate(block, result);
  result.element = transliterate(element, result);
  return result;
};

const buildRestClassNames = (classes, opts) => {
  const classesType = typeof classes;
  let result = [];
  if (classesType === 'string' || classesType === 'number') {
    result.push(buildRestClassNameString(opts, classes));
  } else if (classesType === 'object') {
    if (Array.isArray(classes)) {
      result = classes.map(buildRestClassNameString.bind(this, opts));
    } else {
      Object.keys(classes).forEach((className) => {
        if (classes[className]) {
          result.push(buildRestClassNameString(opts, className));
        }
      });
    }
  }
  return result;
};

module.exports = (block, _options) => (element, restClasses) => {
  const opts = assignOptions(block, element, _options);
  let classNames = [];
  if (element) {
    const className = buildClassNameString(opts);
    classNames.push(className);
  } else if (!restClasses) {
    classNames.push(opts.block);
  }
  if (restClasses) {
    classNames = classNames.concat(buildRestClassNames(restClasses, opts));
  }
  return classNames.join(' ');
};
