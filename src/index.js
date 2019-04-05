import * as utils from './dict_utils'
import { domReadiness, queryDom } from './utils'
import { fromEvent } from 'rxjs'

import { words } from './resources/word_list_test'
import { initObservables } from './observables'

(async function main() {

    await domReadiness()
    await setupServer()

    const rx = initObservables()
    const lookupWorker = new Worker('worker.js')
    const lookupOutput = queryDom('#is-in-dictionary')

    rx.isInDictionary.subscribe(e => {
        lookupWorker.postMessage({'lookup': e})
    })
    fromEvent(lookupWorker, 'message')
        .subscribe(result => {
            lookupOutput.value = result.data
        })

    let filterWorker
    rx.wordFilter.subscribe(([starts, ends, includes, length]) => {
        if (typeof(filterWorker) !== 'undefined') {
            filterWorker.terminate()
            filterWorker = undefined
        }
        filterWorker = new Worker('worker.js')
        filterWorker.postMessage({
            'filterBy': {
                starts,
                ends,
                includes,
                length
            }})
    })

})()

async function setupServer() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/src/server.js')
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
            self.addEventListener('install', function(event) {
                // Perform install steps
                console.log('cat')
            })

        } catch (err) {
            console.log('ServiceWorker registration failed: ', err)
        }
    }
}
