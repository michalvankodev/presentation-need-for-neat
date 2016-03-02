import {Observable} from 'rx'
import {div, h1, h3, span, section} from '@cycle/dom'
import getRandomColor from './get-random-color'
export default function app({DOM, HTTP}) {

  const color$ = Observable.interval(500).map(i => getRandomColor())

  let introPageView = color$.map(color =>
    section('.intro', [
      h1([
        span('The need for '),
        span('.reactive', { style: {'color': color} }, 'reactive'),
        span(', the neat of '),
        span('.functional', 'f('),
        span('unctional'),
        span('.functional', ')')
      ]),
      h3('by Michal Vanko')

    ])
  );

  return {
    DOM: introPageView,
    HTTP: Observable.just({})
  }
}
