import { fromEvent, combineLatest } from 'rxjs'
import { startWith, map } from 'rxjs/operators'


export function initObservables() {
    const isWordInput = document.getElementById('is-word')

    const startsWithInput = document.getElementById('start')
    const endsWithInput = document.getElementById('end')
    const includesInput = document.getElementById('includes')
    const lettersInput = document.getElementById('letters')

    const [
        isWordSource$,
        startsSource$,
        endsSource$,
        includesSource$,
        lettersSource$
    ] = [
        fromEvent(isWordInput, 'keyup'),
        fromEvent(startsWithInput, 'keyup'),
        fromEvent(endsWithInput, 'keyup'),
        fromEvent(includesInput, 'keyup'),
        fromEvent(lettersInput, 'change')
    ]
        .map(map(e => e.target.value.replace(/[\W\d]/g, '')))
        .map(stream => stream.pipe(startWith('')))

    const filterSource$ = combineLatest(
        startsSource$,
        endsSource$,
        includesSource$,
        lettersSource$
    )

    return {
        isInDictionary: isWordSource$,
        wordFilter: filterSource$
    }
}
