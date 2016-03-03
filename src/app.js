import {Observable} from 'rx'
import {span, div} from '@cycle/dom'
import slides from './slides'

function intent({DOM, Keydown}) {
  const keyboard$ = Keydown.map(e => e).do((e) => { console.log(e)}).map(e => e.code)
  const nextKeys = ['ArrowDown', 'ArrowRight', 'Space']
  const goNext$ = keyboard$.filter(key => nextKeys.indexOf(key) > -1).map(() => 1)
  const prevKeys = ['ArrowLeft']
  const goPrev$ = keyboard$.filter(key => prevKeys.indexOf(key) > -1).map(() => -1)
  return {
    goNext$,
    goPrev$
  }
}

function model({goNext$, goPrev$}, slides) {
  const slideNumber$ = Observable.merge(goNext$, goPrev$).scan((acc, value) => {
      let next = acc + value;
      if (next >= slides.length) {
        return slides.length - 1
      }
      else if (next < 0) {
        return 0
      }
      return next
    }, 0).startWith(0)

  const shownSlides$ = slideNumber$.map(slideNumber => {
    const previousSlideNumber = slideNumber - 1
    const previous = previousSlideNumber >= 0 ? slides[previousSlideNumber]() : null
    const current = slides[slideNumber]()
    const nextSlideNumber = slideNumber + 1
    const next = nextSlideNumber < slides.length ? slides[nextSlideNumber]() : null
    return {
      previous,
      current,
      next
    }
  })

  return {
    slideNumber$,
    shownSlides$
  }
}

function view({slideNumber$, shownSlides$}) {
  return Observable.combineLatest(slideNumber$, shownSlides$, (slideNumber, shownSlides) => {
    const slidesVtree = Object.keys(shownSlides).map(slideKey => {
      const slide = shownSlides[slideKey]
      return div(`.slide .${slideKey}`, [slide ? slide.DOM : null])
    })
    return div([div('.slides-container', slidesVtree), span(String(slideNumber))])
  })
}

export default function app(sources) {
  const vtree$ = view(model(intent(sources), slides))
  return {
    DOM: vtree$,
    HTTP: Observable.just({})
  }
}
