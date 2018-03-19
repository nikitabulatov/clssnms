# clssnms
Simple BEM-like class names tool.

First of all [learn about BEM naming](http://getbem.com/naming/)

## Simple usage:
```javascript
  import clssnms from 'clssnms'
 
  // it returns function with future classes adapted for 'foo' block name
  const classNames = clssnms('foo', <options>) 
  
  // it returns block name
  classNames() // 'foo'
  
  classNames('bar') // foo__bar
```

You can specify the following parameters:
* ***Required** `String` specify block class name
* `Object` Options object. Now avialable only one string-option `glue` which using as concatination of block and element name. Default glue option is `__`.

Also, you can specify any binding in "option" parametr for your future class name and use it with `$` character

Example:
```javascript
  const classNames = clssnms('foo', {
    glue: '---',
    bar: 'bazz'
  })
  
  classNames('item-$bar') // foo--item-bazz
```

Also, you can feel free to use pre-defined bindings for $block, $element and $glue strings

Example:
```javascript
  const classNames = clssnms('foo')
  
  classNames('item', '$block$glue$element--modifier') // 'foo__item foo__item--modifier'
```

Have you noticed that you can specify as second parametr of class name as BEM modifier (actually as any different class name). It's might be a `Object` for boolean names, `Array` for list of names and `String`.

Example:
```javascript
  const classNames = clssnms('foo', {barState: 'bazz'})
  
  classNames('item', {
    'is-active': false,
    'bar-$barState': true
  }) // foo__item bar-bazz
  
  classNames('item', ['bar-$barState']) // foo__item bar-bazz
  
  classNames('item', 'bar') // foo__item bar
```
