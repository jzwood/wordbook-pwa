import { fromEvent } from 'rxjs'
import { take } from 'rxjs/operators'

export function domReadiness() {
    return new Promise((resolve, reject) => {
        if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
            resolve()
        } else {
            fromEvent(document, 'DOMContentLoaded')
                .pipe(take(1))
                .subscribe(resolve)
        }
    })
}

export const queryDom = document.querySelector.bind(document)
