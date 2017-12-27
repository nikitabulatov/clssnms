const DEFAULT_OPTIONS = {
  glue: '__'
};

const buildClassNameString = (opts) => {
  return transliterate(`$block${opts.glue}${opts.element}`, opts);
};

const buildRestClassNameString = (opts, className) => {
  return transliterate(className, opts);
};

const transliterate = (string, values) => {
  if (!string) return '';
  let regexp = [];
  for (const key in values) {
    if (values.hasOwnProperty(key)) regexp.push(`\\$${key}`);
  }
  regexp = new RegExp(regexp.join('|'), 'g');
  return string.replace(regexp, (match) => values[match.replace('$', '')]);
};

const assignOptions = (block, element, opts) => {
  const result = Object.assign({}, DEFAULT_OPTIONS, opts, {
    rawBlock: block,
    rawElement: element
  });
  result.block = transliterate(block, result);
  result.element = transliterate(element, result);
  return result;
}

const buildRestClassNames = (classes, opts) => {
  const classesType = typeof classes;
  switch (classesType) {
    case 'string':
      return [buildRestClassNameString(opts, classes)];
    case 'object':
      if (Array.isArray(classes)) {
        return classes.map(buildRestClassNameString.bind(this, opts));
      } else {
        const result = [];
        for (const className in classes) {
          if (classes.hasOwnProperty(className) && classes[className]) {
            result.push(buildRestClassNameString(opts, className));
          }
        }
        return result;
      }
    default:
      return [];
  }
}

export default (block, _options) => (element, restClasses) => {
  const opts = assignOptions(block, element, _options);
  let classNames = [];
  if (element) {
    const className = buildClassNameString(opts);
    classNames.push(className);
  } else if (!restClasses){
    classNames.push(opts.block);
  }
  if (restClasses) {
    classNames = classNames.concat(buildRestClassNames(restClasses, opts))
  }
  return classNames.join(' ');
};
