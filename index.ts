interface Options {
  [key: string]: string
  glue: string
}

type RestClassesObject = { [key: string]: boolean }

type ClassValue = string | false | null | undefined

type RestClasses = RestClassesObject | ClassValue[] | string

const DEFAULT_OPTIONS = {
  glue: '__',
}

const transliterate = (string: ClassValue, values: Options) => {
  if (!string) return ''
  const regexpArr = Object.keys(values).map(key => `\\$${key}`)
  const regexp = new RegExp(regexpArr.join('|'), 'g')
  return string.replace(regexp, match => values[match.replace('$', '')])
}

const buildClassNameString = (opts: Options) =>
  transliterate(`$block${opts.glue}${opts.element}`, opts)

const buildRestClassNameString = (opts: Options, className: ClassValue) =>
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
      result = classes.reduce((acc: string[], className: ClassValue) => {
        if (className && typeof className === "string") {
          acc.push(className);
        }
        return acc;
      }, [])
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

export = (block: string, _options?: Options) => (element?: string | null, restClasses?: RestClasses) => {
  const opts = assignOptions(block, element || '', _options || DEFAULT_OPTIONS)
  let classNames = []
  if (element) {
    const className = buildClassNameString(opts)
    classNames.push(className)
  } else {
    classNames.push(opts.block)
  }
  if (restClasses) {
    classNames = classNames.concat(buildRestClassNames(restClasses, opts))
  }
  return classNames.join(' ')
}
