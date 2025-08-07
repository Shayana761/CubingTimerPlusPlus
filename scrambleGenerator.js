export class ScrambleGenerator {
    constructor(possibleMoves, minLength = 15, maxLength = 25, randomSeed = null) {
    if (!possibleMoves || possibleMoves.length === 0) {
        throw new Error("possibleMoves cannot be null or empty.");
    }

    this._possibleMoves = possibleMoves;
    this._minLength = minLength;
    this._maxLength = maxLength;

    // Seeded random generator (simple implementation)
    if (randomSeed !== null) {
        this._rnd = this._seededRandom(randomSeed);
    }
    else {
        this._rnd = Math.random;
    }
    }

    // Simple seeded random generator function (returns a function that generates a random number [0,1))
    _seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return () => {
            x = Math.sin(x) * 10000;
            return x - Math.floor(x);
        };
    }

    _nextInt(min, max) {
    // returns an integer between min (inclusive) and max (exclusive)
    return Math.floor(this._rnd() * (max - min)) + min;
    }

    generateScramble() {
        const scrambleLength = this._nextInt(this._minLength, this._maxLength + 1);
        const scramble = [];

        while (scramble.length < scrambleLength) {
            let nextMove = this._possibleMoves[this._nextInt(0, this._possibleMoves.length)];
            const count = scramble.length;

            if (
            count >= 2 &&
            this._areSameMove(scramble[count - 1], nextMove) &&
            this._areSameMove(scramble[count - 2], nextMove)
            ) {
            // Triple: A A A ? A'
            scramble.splice(count - 2, 2); // remove last two moves
            scramble.push(this._toPrimeMove(nextMove));
            continue;
            }

            if (count >= 1 && this._areSameMove(scramble[count - 1], nextMove)) {
            // Double: A A ? A2
            scramble.pop();
            scramble.push(this._toDoubleMove(nextMove));
            continue;
            }

            if (count >= 1 && this._areOppositeMoves(scramble[count - 1], nextMove)) {
            // Opposite moves: Replace with safe alternative
            nextMove = this._getReplacementMove(scramble[count - 1], scramble);
            }

            if (count >= 1 && this._haveSameBaseMove(scramble[count - 1], nextMove)) {
            // Prevent consecutive moves on the same face (e.g. F2 F2)
            nextMove = this._getReplacementMove(scramble[count - 1], scramble);
            }

            scramble.push(nextMove);
    }

    return scramble.join(" ");
    }

    // === Helpers ===

    _areSameMove(move1, move2) {
    return move1 === move2 && !move1.endsWith("2");
    }

    _toDoubleMove(move) {
    if (move.endsWith("2")) return move;
    return move.replace(/'$/, "") + "2";
    }

    _toPrimeMove(move) {
    if (move.endsWith("2")) return move;
    if (move.endsWith("'")) return move.replace(/'$/, ""); // e.g. A' -> A
    return move + "'";
    }

    _areOppositeMoves(move1, move2) {
    if (move1.endsWith("2") || move2.endsWith("2")) return false;

    const base1 = move1.replace("'", "");
    const base2 = move2.replace("'", "");

    return (
        base1 === base2 &&
        ((move1.includes("'") && !move2.includes("'")) ||
        (!move1.includes("'") && move2.includes("'")))
    );
    }

    _haveSameBaseMove(move1, move2) {
    const base1 = move1.replace(/['2]$/, "");
    const base2 = move2.replace(/['2]$/, "");
    return base1 === base2;
    }

    _getReplacementMove(lastMove, scramble) {
    let replacement;
    do {
        replacement = this._possibleMoves[this._nextInt(0, this._possibleMoves.length)];
    }
    while (
        this._areOppositeMoves(lastMove, replacement) ||
        this._areSameMove(lastMove, replacement) ||
        this._haveSameBaseMove(lastMove, replacement)
    );
    return replacement;
    }
}
