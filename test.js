import test from 'ava'
import Clss from './dist/index'

test('simple usage', (t) => {
  const clss = Clss('nav$foo', { foo: 'bar', glue: '---' })
  t.deepEqual(clss(), 'navbar')
  t.deepEqual(clss('item'), 'navbar---item')
})

test('transliterate element', (t) => {
  const clss = Clss('navbar', { abc: 'test' })
  t.deepEqual(clss('item-$block-$abc'), 'navbar__item-navbar-test')
})

test('append rest classes passed by string with null element argument', (t) => {
  const clss = Clss('navbar')
  t.deepEqual(clss(null, '--is-active'), 'navbar --is-active')
})

test('transliterate rest classes', (t) => {
  const clss = Clss('nav$foo', { foo: 'bar' })
  t.deepEqual(clss('item-$block', {
    '--is-active-$block-$element-$foo': true,
  }), 'navbar__item-navbar --is-active-navbar-item-navbar-bar')
})

test('append rest classes passed by object', (t) => {
  const clss = Clss('navbar')
  t.deepEqual(
    clss('item', { '--is-active': true, '--strong': false, '--with-animation': true }),
    'navbar__item --is-active --with-animation',
  )
})

test('append rest classes passed by array with null element argument', (t) => {
  const clss = Clss('navbar')
  t.deepEqual(clss(null, ['--is-active', false, null, undefined, false, '--strong']), 'navbar --is-active --strong')
  t.deepEqual(clss(null, []), 'navbar')
  t.deepEqual(clss(null, [false, null, undefined]), 'navbar')
})
