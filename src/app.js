import {Observable} from 'rx'
import {span, div} from '@cycle/dom'
import introPage from './slides/intro'

export default function app({DOM, HTTP, Keydown}) {
  const keyboard$ = Keydown.map(e => e).do((e) => { console.log(e)}).map(e => e.code)

  const nextKeys = ['ArrowDown', 'ArrowRight', 'Space']
  const goNext$ = keyboard$.filter(key => nextKeys.indexOf(key) > -1).map(() => 1)

  const prevKeys = ['ArrowLeft']
  const goPrev$ = keyboard$.filter(key => prevKeys.indexOf(key) > -1).map(() => -1)

  const slideNumber$ = Observable.merge(goNext$, goPrev$).scan((acc, value) => {
    return acc + value;
  }, 0).startWith(0)

  const introVtree$ = introPage().DOM
  const vtree$ = introVtree$.combineLatest(slideNumber$, (intro, slide) =>
    div([intro, span(String(slide))])
  )
  return {
    DOM: vtree$,
    HTTP: Observable.just({})
  }
}
