import { fromEvent } from 'rxjs'

//console.log(words)
//console.log(utils)
//window.words = words
//window.utils = utils

//const a = utils.getMatches({front: 'AA', wordList:words})
//const c = utils.getMatches({front: 'ABA', wordList:words})
//console.log(a,c)
// webworker.js
fromEvent(self, 'message')
    .subscribe(event => {
        self.postMessage(Boolean(event.data.lookup))
    })
