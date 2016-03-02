import Cycle from '@cycle/core'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {restart, restartable} from 'cycle-restart';
import {Observable} from 'rx'
import app from './app'

const container = document.getElementById('app')

const drivers = {
  DOM: restartable(makeDOMDriver(container), {pauseSinksWhileReplaying: false}),
  HTTP: restartable(makeHTTPDriver()),
  Keydown: restartable(() => Observable.fromEvent(document.body, 'keydown'))
}

const {sinks, sources} = Cycle.run(app, drivers)

if (module.hot) {
  module.hot.accept('./app', () => {
    let updated = require('./app').default
    restart(updated, drivers, {sinks, sources})
  })
}
