const type = {
    PLAYER: 'player',
    COMPUTER: 'computer'
}

const state = {
    LOAD: 'Loaded',
    START: 'Started',
    RUN: 'Running',
    STOP: 'Stopped',
    END: 'End game',
    QUIT: 'Quit'
}

const color = {
    BLUE: '#12c2e9',
    ORANGE: 'rgba(230, 92, 0, 1)',
    GREEN: 'rgba(51, 102, 0, 1)',
    GREEN_A: 'rgba(51, 102, 0, 0.7)',
    RED: 'rgba(255, 0, 0, 1)',
    RED_A: 'rgba(255, 0, 0, 0.15)',
    WHITE: 'rgba(255, 255, 255, 1)',
    BLACK: 'rgba(0, 0, 0, 1)',
    BLACK_5: 'rgba(13, 13, 13, 1)',
    BLACK_5A: 'rgba(13, 13, 13, 0.5)',
    PINK: '#f64f59'
}

const team = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
}


///////////////////////////////////////////////////////////////////////////
/////////////////// External Display functions ////////////////////////////
///////////////////////////////////////////////////////////////////////////

function displayRectCenterForm(entity, mode = 'fill') {
    if (mode === 'fill' || mode === 'both') {
        context.fillStyle = entity.color;
    }
    if (mode === 'stroke' || mode === 'both') {
        context.strokeStyle = entity.color;
    }

    context.beginPath();
    context.moveTo(entity.coords.x, entity.coords.y);
    context.rect(entity.coords.x - (entity.dimensions.width / 2), entity.coords.y - (entity.dimensions.height / 2), entity.dimensions.width, entity.dimensions.height);
    if (mode === 'fill' || mode === 'both') {
        context.fill();
    }
    if (mode === 'stroke' || mode === 'both') {
        context.stroke();
    }
}

function displayText(text, x, y, color = color.WHITE, size = 48, mode = 'fill') {
    context.font = size + 'px Silkscreen';
    if (mode === 'fill' || mode === 'both') {
        context.fillStyle = color;
        context.fillText(text, x, y);
    }
    if (mode === 'stroke' || mode === 'both') {
        context.strokeStyle = color;
        context.strokeText(text, x, y);
    }
}

function displayBackgroundAlpha() {
    context.fillStyle = color.BLACK_5A;
    context.beginPath();
    context.moveTo(0, 0);
    context.rect(0, 0, game.size.width, game.size.height);
    context.fill();
    context.fillStyle = color.WHITE;
}

function roundRect(x, y, w, h, radius) {
    let r = x + w;
    let b = y + h;
    context.beginPath();
    context.fillStyle = color.BLACK_5A;
    context.moveTo(x+radius, y);
    context.lineTo(r-radius, y);
    context.quadraticCurveTo(r, y, r, y+radius);
    context.lineTo(r, y+h-radius);
    context.quadraticCurveTo(r, b, r-radius, b);
    context.lineTo(x+radius, b);
    context.quadraticCurveTo(x, b, x, b-radius);
    context.lineTo(x, y+radius);
    context.quadraticCurveTo(x, y, x+radius, y);
    context.fill();
}


///////////////////////////////////////////////////////////////////////////
//////////////////// External tools functions /////////////////////////////
///////////////////////////////////////////////////////////////////////////

function detectCollide(entity1, entity2) {
        return entity1.coords.x - entity1.dimensions.width / 2 < entity2.coords.x + entity2.dimensions.width / 2 && entity1.coords.x + entity1.dimensions.width / 2 > entity2.coords.x - entity2.dimensions.width / 2 &&
            entity1.coords.y - entity1.dimensions.height / 2 < entity2.coords.y + entity2.dimensions.height / 2 && entity1.coords.y + entity1.dimensions.height / 2 > entity2.coords.y - entity2.dimensions.height / 2;
}

// Return random float number between interval with min included and max included
function getRandomInt(min = -1, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// Change color ball for smooth effect
function smoothRgbBall() {
    let nbrColorsMaxValue = 0;
    if (redColor > 254) {
        nbrColorsMaxValue += 1;
    }
    if (greenColor > 254) {
        nbrColorsMaxValue += 1;
    }
    if (blueColor > 254) {
        nbrColorsMaxValue += 1;
    }

    if (nbrColorsMaxValue >= 3) {
        redColor = getRandomInt(0, 254);
        greenColor = getRandomInt(0, 254);
        blueColor = getRandomInt(0, 254);
    }

    if (nbrColorsMaxValue === 0) {
        redColor += 5;
    } else if (nbrColorsMaxValue === 1) {
        greenColor += 5;
    } else if (nbrColorsMaxValue === 2) {
        blueColor += 5;
    }

    return {
        red: redColor,
        green: greenColor,
        blue: blueColor,
    };
}
