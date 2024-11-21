$(document).ready(function () {
    let gameId = null;
    let ws = null;

    function initBoard() {
        const board = $('#gameBoard');
        board.empty();
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                board.append($('<div>').addClass('cell'));
            }
        }

        const nextPiece = $('#nextPiece');
        nextPiece.empty();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                nextPiece.append($('<div>').addClass('cell'));
            }
        }
    }

    function updateBoard(boardData) {
        const cells = $('.game-board .cell');
        boardData.forEach((row, i) => {
            row.forEach((cell, j) => {
                const index = i * 10 + j;
                cells.eq(index).css('background-color', cell || '#000');
            });
        });
    }

    function updateNextPiece(nextPiece) {
        const cells = $('.next-piece .cell');
        cells.css('background-color', '#000');

        if (nextPiece) {
            const shape = nextPiece.shape;
            const color = nextPiece.color;

            shape.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (cell) {
                        const index = i * 4 + j;
                        cells.eq(index).css('background-color', color);
                    }
                });
            });
        }
    }

    function updateScore(score) {
        $('#score').text(score);
    }

    function showGameOver(score) {
        $('#finalScore').text(score);
        $('#gameOver').fadeIn();
    }

    function startNewGame() {
        $('#gameOver').fadeOut();
        if (ws) {
            ws.send(JSON.stringify({
                type: 'NEW_GAME',
                gameId: gameId
            }));
        } else {
            connectWebSocket();
        }
    }

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:3000');

        ws.onopen = function () {
            console.log('Connected to server');
            initBoard();
        };

        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);

            if (data.type === 'GAME_INITIALIZED') {
                gameId = data.gameId;
            }

            if (data.gameState) {
                updateBoard(data.gameState.board);
                updateNextPiece(data.gameState.nextPiece);
                updateScore(data.gameState.score);

                if (data.type === 'GAME_OVER') {
                    showGameOver(data.gameState.score);
                }
            }
        };

        ws.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        ws.onclose = function () {
            console.log('Disconnected from server');
        };
    }

    function handleKeyPress(event) {
        if (!gameId || !ws) return;

        const keyActions = {
            'ArrowLeft': 'MOVE_LEFT',
            'ArrowRight': 'MOVE_RIGHT',
            'ArrowDown': 'MOVE_DOWN',
            'ArrowUp': 'ROTATE'
        };

        const action = keyActions[event.key];
        if (action) {
            event.preventDefault();
            ws.send(JSON.stringify({
                type: action,
                gameId: gameId
            }));
        }
    }

    // Event Listeners
    $(document).on('keydown', handleKeyPress);
    $('#newGameBtn').on('click', startNewGame);

    // Iniciar o jogo
    connectWebSocket();
});