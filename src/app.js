import {Observable} from 'rx'
import {div} from '@cycle/dom'

export default function app({DOM, HTTP}) {


  return {
    DOM: Observable.of(
      div('aasssa')
    ),
    HTTP: Observable.just({})
  }
}
