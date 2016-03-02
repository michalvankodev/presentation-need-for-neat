import {Observable} from 'rx'
import getRandomColor from '../get-random-color'
import {div, h1, h3, span, section} from '@cycle/dom'

export default function introPage() {
  const color$ = Observable.interval(500).map(i => getRandomColor())
  const vtree$ = color$.map(color =>
    section('.intro.slide', [
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
    DOM: vtree$
  }
}
