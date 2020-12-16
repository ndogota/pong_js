class Game {

    constructor(width, height) {
        this._players = [];
        this._balls = [];
        this._colliders = [];
        this._triggers = [];
        this._size = {width: width, height: height};
        this._background = color.BLACK_5;
        this._state = state.LOAD;
        this._score = {left: 0, right: 0};
        this._maxScoreByRound = 5;
        this._keys = {restart: 'r', stop: 'p', quit: 'Escape'}
    }

    addPlayer(typePlayer, teamPlayer, colorPlayer) {
        let player = new Player(typePlayer, teamPlayer, colorPlayer);
        this._players.push(player);
        return player;
    }

    addBall(colorBall) {
        let ball = new Ball(colorBall);
        this._balls.push(ball);
        return ball;
    }

    addCollider(ownerCollider, countDownCollider = null) {
        let collider = new Collider(ownerCollider, countDownCollider);
        this._colliders.push(collider);
        return collider;
    }

    addTrigger(ownerTrigger, coordsTrigger, widthTrigger, heightTrigger, countDownTrigger = null) {
        let trigger = new Trigger(ownerTrigger, coordsTrigger, widthTrigger, heightTrigger, countDownTrigger);
        this._triggers.push(trigger);
        return trigger;
    }

    resetRound() {
        this._balls = [];
        this._colliders = [];
        this._triggers = [];
    }

    get players() {
        return this._players;
    }

    get nbPlayers() {
        return this._players.length;
    }

    get balls() {
        return this._balls;
    }

    get colliders() {
        return this._colliders;
    }

    get triggers() {
        return this._triggers;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get background() {
        return this._background;
    }

    set background(value) {
        this._background = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }
    get maxScoreByRound() {
        return this._maxScoreByRound;
    }

    get keys() {
        return this._keys;
    }
}

