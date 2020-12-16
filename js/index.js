const context = document.getElementById('canvas').getContext('2d')
let game = undefined;
let redColor = 50, greenColor = 150, blueColor = 200;
let debug = false;

// Simulate 1000 ms / 30 FPS = 8.3335 ms per frame every time we run update()
let time_step = 1000 / 30,
    delta = 0,
    last_frame_time_ms = 0, // The last time the loop was run
    max_FPS = 60; // The maximum FPS we want to allow

///////////////////////////////////////////////////////////////////////////
//////////////////////// Primary functions ////////////////////////////////
///////////////////////////////////////////////////////////////////////////


function gameMenu() {
    game = new Game(window.innerWidth, window.innerHeight);
    document.getElementById('canvas').style.backgroundColor = game.background;
    resizeCanvas();
    context.clearRect(0, 0, game.size.width, game.size.height);
    window.onkeydown = function(event) {
        if (event.key === 'Enter') {
            window.onkeydown = null;
            clearInterval(updateInterval);
            clearInterval(renderInterval);
            loadRound();
        }
    }

    // Just for fun
    let animationMode = getRandomInt(0, 2);
    for (let i =0; i < 150; i++){
        let ball = game.addBall()
        if (animationMode >= 1) {
            ball.coords = {x: getRandomInt(0, game.size.width), y: getRandomInt(0, game.size.height)};
        }
        ball.color = "rgb(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ")";
        game.addCollider(ball);
    }

    let updateInterval = window.setInterval(function () {
            updateBalls();
        }, 100);

    let renderInterval = window.setInterval(function() {
        roundRect(game.size.width / 2 - 450, game.size.height / 2 - 200, 950, 120, 30);
        displayText("Pongo Game !", game.size.width / 2 - 450, game.size.height / 2 - 100, color.WHITE, 120);
        roundRect(game.size.width / 2 - 255, game.size.height / 2 + 40, 520, 70, 20);
        displayText("Press Enter", game.size.width / 2 - 250, game.size.height / 2 + 100, color.WHITE, 70);
        game.balls.forEach(ball => {
            displayRectCenterForm(ball);
        })
    }, 100);
}

// Called when page is loaded
function loadRound(startAuto = true, fps = 30) {
    if (startAuto) {
        game = new Game(window.innerWidth, window.innerHeight);
    }
    window.onkeydown = function(event) {keyDown(event)};
    window.onkeyup = function(event) {keyUp(event)};

    requestAnimationFrame(gameLoopSystem);
    if (startAuto) {
        startGame();
    }
}

function gameLoopSystem(timestamp) {
    if (game.state !== state.QUIT) {
        // Throttle the frame rate.
        if (timestamp < last_frame_time_ms + (1000 / max_FPS)) {
            requestAnimationFrame(gameLoopSystem);
            return;
        }

        delta += timestamp - last_frame_time_ms;
        last_frame_time_ms = timestamp;

        let num_update_steps = 0;
        while (delta >= time_step) {
            // update our game logic before draw things to canvas
            update();
            delta -= time_step;
        }

        // Call draw function to draw our logo to canvas
        render();

        // Call gameLoop recursively
        requestAnimationFrame(gameLoopSystem);
    }
}


// Remove call for functions called automatically
function unloadRound() {
    document.onkeydown = null;
    document.onkeyup = null;
}

// Start new game
function startGame() {
    game = new Game(window.innerWidth, window.innerHeight);
    document.getElementById('canvas').style.backgroundColor = game.background;

    // Create players
    let player1 = game.addPlayer(type.PLAYER, team.LEFT, color.BLUE);
    player1.coords = {x: 70, y: game.size.height / 2};
    player1.keys = {up: 'z', down: 's'};
    let player2 = game.addPlayer(type.PLAYER, team.RIGHT, color.PINK);
    player2.coords = {x: game.size.width - 70, y: game.size.height / 2};

    startRound();
}

function startRound() {
    game.resetRound();

    // Add ball to game
    game.addBall();

    // Add colliders for each player
    game.players.forEach(player => {
        let playerCollider = game.addCollider(player);
        if (player.team === team.LEFT) {
            playerCollider.coords = {x: (player.coords.x / 2) + (player.dimensions.width / 4), y: player.coords.y};
            playerCollider.dimensions = {width: player.coords.x + (player.dimensions.width / 2), height: player.dimensions.height};
        } else {
            playerCollider.coords = {x: game.size.width - ((game.size.width - player.coords.x) / 2) - (player.dimensions.width / 4), y: player.coords.y};
            playerCollider.dimensions = {width: (game.size.width - player.coords.x) + (player.dimensions.width / 2), height: player.dimensions.height};
        }
    })
    game.balls.forEach(ball => {
        game.addCollider(ball);
    })

    // Add triggers behind each racket of player for ball
    game.addTrigger(game.players[0], {x: (game.players[0].coords.x - game.players[0].dimensions.width) / 2 - 50, y: game.size.height / 2}, {width: game.players[0].coords.x, height: game.size.height});
    game.addTrigger(game.players[1],  {x: game.size.width - 70 + ((game.size.width - game.players[1].coords.x) / 2) + 50, y: game.size.height / 2}, {width: game.size.width - game.players[1].coords.x - game.players[1].dimensions.width, height: game.size.height});

    game.state = state.START;
}

// Stop temporarily the game
function stopRound() {
    if (game.state === state.START || game.state === state.RUN) {
        game.state = state.STOP;
        unloadRound();
        window.onkeydown = function(event) {
            if (event.key === game.keys.stop) {
                stopRound();
            }
        };
    } else if (game.state === state.STOP) {
        window.onkeydown = null;
        loadRound(false);
        game.state = state.RUN;
    }

}

// Quit game
function quitGame() {
    unloadRound();
    game.state = state.QUIT;
    gameMenu();
}


///////////////////////////////////////////////////////////////////////////
//////////////////////// Update functions /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Main function for update values in game
function update() {
    if (game.state !== state.STOP && game.state !== state.END) {
        updateBalls();
        updatePlayers();
        updateColliders();
        checkBallsColliders();
        checkBallsTriggers();
    }
}

function updateBalls() {
    game.balls.forEach(ball => {
        ball.coords.x += ball.direction.x * ball.moveSpeed;
        ball.coords.y += ball.direction.y * ball.moveSpeed;
    })
}

function updatePlayers() {
    game.players.forEach(player => {
        if(player.type === type.PLAYER) {
            if (player.keysPressed.up) {
                player.coords.y -= player.moveSpeed;
            } else if (player.keysPressed.down) {
                player.coords.y += player.moveSpeed;
            }
        }

        if (player.coords.y < player.dimensions.height / 2) {
            player.coords.y = player.dimensions.height / 2;
        } else if (player.coords.y > game.size.height - (player.dimensions.height / 2)) {
            player.coords.y = game.size.height - (player.dimensions.height / 2)
        }
    })
}

function updateColliders() {
    game.colliders.forEach(collider => {
        if (collider.owner.type === type.PLAYER) {
            if (collider.owner.team === team.LEFT) {
                collider.coords = {x: (collider.owner.coords.x / 2) + (collider.owner.dimensions.width / 4), y: collider.owner.coords.y};
                collider.dimensions = {width: collider.owner.coords.x + (collider.owner.dimensions.width / 2), height: collider.owner.dimensions.height};
            } else {
                collider.coords = {x: game.size.width - ((game.size.width - collider.owner.coords.x) / 2) - (collider.owner.dimensions.width / 4), y: collider.owner.coords.y};
                collider.dimensions = {width: (game.size.width - collider.owner.coords.x) + (collider.owner.dimensions.width / 2), height: collider.owner.dimensions.height};
            }
        } else {
            collider.coords = collider.owner.coords;
            collider.dimensions = collider.owner.dimensions;
        }
    })
}

function checkBallsColliders() {
    game.colliders.forEach(collider1 => {
        if (collider1.owner.constructor.name === 'Ball') {
            // Check balls collisions with game borders
            if (collider1.coords.x < collider1.owner.dimensions.width / 2 || collider1.coords.x > game.size.width - collider1.owner.dimensions.width / 2) {
                collider1.owner.direction.x = -collider1.owner.direction.x;
            }
            if (collider1.coords.y < collider1.owner.dimensions.height / 2 || collider1.coords.y > game.size.height - collider1.owner.dimensions.height / 2) {
                collider1.owner.direction.y = -collider1.owner.direction.y;
            }

            // Check balls collisions with other colliders
            game.colliders.forEach(collider2 => {
                if (collider1 !== collider2 && detectCollide(collider2, collider1)) {
                    //collider1.owner.direction.x = -collider1.owner.direction.x;
                    //collider1.owner.moveSpeed += 0.2;
                    if (collider1.owner.moveSpeed < collider1.owner.maxSpeed) {
                        collider1.owner.moveSpeed += 3;
                    }
                    collider1.owner.direction.x = -collider1.owner.direction.x;
                    beep1.play();
                    if (collider1.owner.direction.x > 0) {
                        collider1.owner.coords.x = collider2.owner.coords.x;
                    } else {
                        collider1.owner.coords.x = collider2.owner.coords.x - (collider2.owner.dimensions.width / 2);
                    }
                }
            })
        }
    })
}

function checkBallsTriggers() {
    game.triggers.forEach(trigger => {
        game.balls.forEach(ball => {
            if (detectCollide(trigger, ball)) {
                if (trigger.owner.team === team.LEFT) {
                    game.score.right += 1;
                } else if (trigger.owner.team === team.RIGHT) {
                    game.score.left += 1;
                }
                stopRound();
                unloadRound();
                loadRound(false);
                startRound();
            }
        })
    })
}


///////////////////////////////////////////////////////////////////////////
//////////////////////// Refresh functions ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Main function of game display
function render() {
    context.clearRect(0, 0, game.size.width, game.size.height);

    displayBalls();
    displayPlayers();
    displayHUD();
    checkScore();

    if (debug) {
        displayTriggers();
        displayColliders();
    }
    if (game.state === state.STOP) {
        displayBackgroundAlpha();
        displayText("Pause", game.size.width / 2.4, game.size.height / 2, color.WHITE, 100);
        displayText("Press any key to resume.", game.size.width / 3.1, (game.size.height / 2) + (game.size.height / 4), color.WHITE);
    }

}

function checkScore() {
    if (game.score.left >= game.maxScoreByRound || game.score.right >= game.maxScoreByRound) {
        game.state = state.END;
        unloadRound();
        window.onkeydown = function (event) {loadRound();};
        displayBackgroundAlpha();
        displayText("Press any key to restart.", game.size.width / 3.1, (game.size.height / 2) + (game.size.height / 4), color.WHITE);
        if (game.score.left >= game.maxScoreByRound) {
            displayText(team.LEFT + " team won !!", game.size.width / 3.7, game.size.height / 2, color.BLUE, 100);
        } else {
            displayText(team.RIGHT + " team won !!", game.size.width / 3.7, game.size.height / 2, color.PINK, 100);
        }
    }
}

function displayPlayers() {
    game.players.forEach(player => {
        displayRectCenterForm(player);
    })
}

function displayBalls() {
    let colors = smoothRgbBall();
    game.balls.forEach(ball => {
        ball.color = "rgba(" + colors.red + ", " + colors.green + ", " + colors.blue + ")";
        displayRectCenterForm(ball);
    })
}

function displayTriggers() {
    game.triggers.forEach(trigger => {
        displayRectCenterForm(trigger);
    })
}

function displayColliders() {
    game.colliders.forEach(collider => {
        displayRectCenterForm(collider);
    })
}

function displayHUD() {
    context.fillStyle = color.WHITE;
    displayText(game.score.left, game.size.width / 4, 50, game.players[0].color);
    displayText(game.score.right, (game.size.width / 2) + (game.size.width / 4.2), 50, game.players[1].color);
    displayMiddleLine();
}

function displayMiddleLine() {
    context.beginPath();
    context.strokeStyle = color.WHITE;
    context.setLineDash([10, 30]);
    context.lineWidth = 5;
    context.moveTo(game.size.width / 2, 0);
    context.lineTo(game.size.width / 2, game.size.height);
    context.stroke();
}


///////////////////////////////////////////////////////////////////////////
//////////////// Called when an event is triggered ////////////////////////
///////////////////////////////////////////////////////////////////////////

function resizeCanvas() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    game.size = {width: context.canvas.width, height: context.canvas.height};
}

function keyDown(event) {
    game.players.forEach(player => {
        if (player.type === type.PLAYER) {
            if (player.keys.up === event.key) {
                player.keysPressed.up = true;
            } else if (player.keys.down === event.key) {
                player.keysPressed.down = true;
            }
        }
    })

    if (event.key === game.keys.restart) {
        startGame();
    } else if (event.key === game.keys.stop) {
        stopRound();
    } else if (event.key === game.keys.quit) {
        quitGame();
    }
}

function keyUp(event) {
    game.players.forEach(player => {
        if (player.type === type.PLAYER) {
            if (player.keys.up === event.key) {
                player.keysPressed.up = false;
            } else if (player.keys.down === event.key) {
                player.keysPressed.down = false;
            }
        }
    })
}

