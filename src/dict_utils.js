import { takeWhile, takeRightWhile } from 'lodash'

Array.prototype.takeWhile = function(predicate) {
    return takeWhile(this, predicate)
}

Array.prototype.takeRightWhile = function(predicate) {
    return takeRightWhile(this, predicate)
}

//returns true iff word is in wordList
export function isWord(word, wordList) {
    const index = ~~(wordList.length / 2)
    const pointerWord = wordList[index]
    if (word === pointerWord) return true
    if (wordList.length <= 1) return false
    return isWord(word, word < pointerWord ?
        wordList.slice(0, index) : wordList.slice(index + 1))
}

function reverse(letters) {
    if (letters.length < 1) return ''
    return reverse(letters.slice(1)) + letters[0]
}

function getStartsWith(wordStart, wordList) {
    if (wordList.length <= 1) return []
    const index = ~~(wordList.length / 2)
    const pointerWord = wordList[index]
    if (pointerWord.startsWith(wordStart)) {
        const startsWithFilter = w => w.startsWith(wordStart)
        const left = wordList
            .slice(0, index)
            .takeRightWhile(startsWithFilter)
        const right = wordList
            .slice(index + 1)
            .takeWhile(startsWithFilter)
        return [...left, pointerWord, ...right]
    }
    return getStartsWith(wordStart, wordStart < pointerWord ?
        wordList.slice(0, index) : wordList.slice(index + 1))
}

export function getMatches({front='', back='', has='A-Z', numLetters=-1, wordList=[], reversedWordList=[]}={}) {

    const hasRE = new RegExp(`^[${has}]*$`,'i')
    return getStartsWith(front.toUpperCase(), wordList)
        .filter(w => w.endsWith(back.toUpperCase()))
        .filter(w => hasRE.test(w))
        .filter(w => numLetters < 0 || w.length === numLetters)
}
