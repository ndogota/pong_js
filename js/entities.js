class Player {

    constructor(typePlayer, teamPlayer, colorPlayer = undefined) {
        this._type = typePlayer;
        this._team = teamPlayer;
        this._color = colorPlayer;
        this._moveSpeed = 20;
        this._coords = {x: undefined, y: undefined};
        this._dimensions = {width: 16, height: 80};
        if (this._type === type.PLAYER) {
            this._keys = {up: 'ArrowUp', down: 'ArrowDown'};
            this._keysPressed = {up: false, down: false};
        }
        if (!this._color) {
            this._color = color.WHITE;
        }
    }

    get type() {
        return this._type;
    }

    get team() {
        return this._team;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        return this._color = value;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get moveSpeed() {
        return this._moveSpeed;
    }

    set moveSpeed(value) {
        this._moveSpeed = value;
    }

    get coords() {
        return this._coords;
    }

    set coords(value) {
        this._coords = value;
    }

    get dimensions() {
        return this._dimensions;
    }

    set dimensions(value) {
        this._dimensions = value;
    }

    get keys() {
        return this._keys;
    }

    set keys(value) {
        return this._keys = value;
    }

    get keysPressed() {
        return this._keysPressed;
    }
}


class Ball {

    constructor(colorBall = undefined) {
        this._color = colorBall;
        this._moveSpeed = 20;
        this._maxSpeed = 110;
        this._randomValue =  2 * Math.PI * Math.random();
        this._direction = {x: Math.cos(this._randomValue), y: Math.sin(this._randomValue)};
        this._coords = {x: game.size.width / 2, y: game.size.height / 2};
        this._dimensions = {width: 14, height: 14};
        if (!this._color) {
            this._color = color.WHITE;
        }
    }

    get color() {
        return this._color;
    }

    set color(value) {
        return this._color = value;
    }

    get moveSpeed() {
        return this._moveSpeed;
    }

    set moveSpeed(value) {
        this._moveSpeed = value;
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }

    get coords() {
        return this._coords;
    }

    set coords(value) {
        this._coords = value;
    }

    get dimensions() {
        return this._dimensions;
    }

    set dimensions(value) {
        this._dimensions = value;
    }
}


class Collider {

    constructor(owner, countDown = null) {
        this._coords = {x: owner.coords.x, y: owner.coords.y};
        this._dimensions = {width: owner.dimensions.width, height: owner.dimensions.height};
        this._color = color.GREEN_A;
        this._owner = owner;
        this._countDown = countDown;
    }

    get coords() {
        return this._coords;
    }

    set coords(value) {
        this._coords = value;
    }

    get dimensions() {
        return this._dimensions;
    }

    set dimensions(value) {
        this._dimensions = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get owner() {
        return this._owner;
    }

    get countDown() {
        return this._countDown;
    }
}


class Trigger {

    constructor(owner, coords, dimensions, countDown = null) {
        this._coords = {x: coords.x, y: coords.y};
        this._dimensions = {width: dimensions.width, height: dimensions.height};
        this._color = color.RED_A;
        this._owner = owner;
        this._countDown = countDown;
    }

    get coords() {
        return this._coords;
    }

    set coords(value) {
        this._coords = value;
    }

    get dimensions() {
        return this._dimensions;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get owner() {
        return this._owner;
    }

    get countDown() {
        return this._countDown;
    }
}
