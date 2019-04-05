import { PRODUCTION } from './environment'
import { fromEvent } from 'rxjs'
import { switchMap, mapTo, map, take, takeUntil, pairwise} from 'rxjs/operators'

let env = PRODUCTION() ? 'DEV' : 'PROD'

fromEvent(self, 'install')
    .pipe(take(1))
    .subscribe(event => {
        console.log(`service worker running in ${env}`)
    })

