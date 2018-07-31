interface Options {
  [key: string]: string
  glue: string
}

type RestClassesObject = { [key: string]: string }

type RestClasses = RestClassesObject | string[] | string

const DEFAULT_OPTIONS = {
  glue: '__',
}

const transliterate = (string: string, values: Options) => {
  if (!string) return ''
  const regexpArr = Object.keys(values).map(key => `\\$${key}`)
  const regexp = new RegExp(regexpArr.join('|'), 'g')
  return string.replace(regexp, match => values[match.replace('$', '')])
}

const buildClassNameString = (opts: Options) =>
  transliterate(`$block${opts.glue}${opts.element}`, opts)

const buildRestClassNameString = (opts: Options, className: string) =>
  transliterate(className, opts)

const assignOptions = (block: string, element: string, opts: Options) => {
  const result: Options = { ...DEFAULT_OPTIONS, ...opts, rawBlock: block, rawElement: element }
  result.block = transliterate(block, result)
  result.element = transliterate(element, result)
  return result
}

const buildRestClassNames = (classes: RestClasses, opts: Options): string[] => {
  const classesType = typeof classes
  let result: string[] = []
  if (classesType === 'string' || classesType === 'number') {
    result.push(buildRestClassNameString(opts, classes as string))
  } else if (classesType === 'object') {
    if (Array.isArray(classes)) {
      result = classes.map((className: string) => buildRestClassNameString(opts, className))
    } else {
      result = Object.keys(classes).reduce((acc, className: string) => {
        const values = classes as RestClassesObject
        if (values[className]) {
          return [...acc, buildRestClassNameString(opts, className)]
        }
        return acc
      }, result)
    }
  }
  return result
}

export = (block: string, _options?: Options) => (element?: string, restClasses?: RestClasses) => {
  const opts = assignOptions(block, element || '', _options || DEFAULT_OPTIONS)
  let classNames = []
  if (element) {
    const className = buildClassNameString(opts)
    classNames.push(className)
  } else if (!restClasses) {
    classNames.push(opts.block)
  }
  if (restClasses) {
    classNames = classNames.concat(buildRestClassNames(restClasses, opts))
  }
  return classNames.join(' ')
}
