$(document).ready(function () {
    let gameId = null;
    let ws = null;
    let token = null;
    let username = localStorage.getItem('username');

    const API = {
        BASE_URL: 'https://tetris-game-api.onrender.com',
        BASE_WS_URL: 'wss://tetris-game-api.onrender.com',
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
        },
        SCORES: {
            SAVE: '/scores/save',
            TOP: '/scores/top',
            PERSONAL: '/scores/personal',
        },
    };

    // Auth Functions
    function switchAuthForm(formType) {
        $('.auth-tab').removeClass('active');
        $(`.auth-tab[data-form="${formType}"]`).addClass('active');
        $('.auth-form').hide();
        $(`#${formType}Form`).show();
    }

    async function handleLogin(event) {
        event.preventDefault();

        const $button = $('#loginForm .auth-button');
        const $spinner = $button.find('.spinner');
        const $buttonText = $button.find('.button-text');

        $button.prop('disabled', true);
        $buttonText.hide();
        $spinner.show();

        try {
            const response = await fetch(`${API.BASE_URL}${API.AUTH.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: $('#loginUsername').val(),
                    password: $('#loginPassword').val(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                token = data.token;
                username = $('#loginUsername').val();
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                showGame();
                connectWebSocket();
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            alert('Error logging in');
        } finally {
            $button.prop('disabled', false);
            $buttonText.show();
            $spinner.hide();
        }
    }


    async function handleRegister(event) {
        event.preventDefault();

        const $button = $('#registerForm .auth-button');
        const $spinner = $button.find('.spinner');
        const $buttonText = $button.find('.button-text');

        $button.prop('disabled', true);
        $buttonText.hide();
        $spinner.show();

        try {
            const response = await fetch(`${API.BASE_URL}${API.AUTH.REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: $('#regUsername').val(),
                    email: $('#regEmail').val(),
                    password: $('#regPassword').val(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                token = data.token;
                username = $('#regUsername').val();
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                showGame();
                connectWebSocket();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            alert('Error registering');
        } finally {
            $button.prop('disabled', false);
            $buttonText.show();
            $spinner.hide();
        }
    }


    async function handleLogout() {
        try {
            await fetch(`${API.BASE_URL}${API.AUTH.LOGOUT}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            token = null;
            username = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            if (ws) {
                ws.close();
                ws = null;
            }
            showAuth();
        } catch (error) {
            alert('Error logging out');
        }
    }

    function showAuth() {
        $('#authContainer').show();
        $('.main-container').hide();
    }

    function showGame() {
        $('#authContainer').hide();
        $('.main-container').show();
        $('#username').text(username + " !");
        updateScores();
    }

    // Score Functions
    async function updateScores() {
        await updateTopScores();
        await updatePersonalScores();
    }

    async function updateTopScores() {
        try {
            const response = await fetch(`${API.BASE_URL}${API.SCORES.TOP}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const scores = await response.json();
            displayScores(scores, '#topScores');
        } catch (error) {
            console.error('Error fetching top scores:', error);
        }
    }

    async function updatePersonalScores() {
        try {
            const response = await fetch(`${API.BASE_URL}${API.SCORES.PERSONAL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const scores = await response.json();
            displayScores(scores, '#personalScores');
        } catch (error) {
            console.error('Error fetching personal scores:', error);
        }
    }

    function displayScores(scores, container) {
        const $container = $(container);
        $container.empty();

        scores.forEach(score => {
            $container.append(`
                <div class="score-item">
                    <span class="username">${score.User ? score.User.username : ''}</span>
                    <span class="score-value">${score.score}</span>
                </div>
            `);
        });
    }

    function updateLevel(level) {
        $('#level').text(level);
    }

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
            ws.send(
                JSON.stringify({
                    type: 'NEW_GAME',
                    gameId: gameId,
                })
            );
        } else {
            connectWebSocket();
        }
    }

    function connectWebSocket() {
        ws = new WebSocket(`${API.BASE_WS_URL}?token=${token}`);

        ws.onopen = function () {
            console.log('Connected to server');
            initBoard();
        };

        ws.onmessage = async function (event) {
            const data = JSON.parse(event.data);

            if (data.type === 'GAME_INITIALIZED') {
                gameId = data.gameId;
            }

            if (data.gameState) {
                updateBoard(data.gameState.board);
                updateNextPiece(data.gameState.nextPiece);
                updateScore(data.gameState.score);
                updateLevel(data.gameState.level);

                if (data.type === 'GAME_OVER') {
                    await saveScore(data.gameState.score, data.gameState.level, gameId);
                    await updateScores();
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

    async function saveScore(score, level, gameId) {
        try {
            await fetch(`${API.BASE_URL}${API.SCORES.SAVE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ score, level, gameId }),
            });
        } catch (error) {
            console.error('Error saving score:', error);
        }
    }

    function handleKeyPress(event) {
        if (!gameId || !ws) return;

        const keyActions = {
            ArrowLeft: 'MOVE_LEFT',
            ArrowRight: 'MOVE_RIGHT',
            ArrowDown: 'MOVE_DOWN',
            ArrowUp: 'ROTATE',
        };

        const action = keyActions[event.key];
        if (action) {
            event.preventDefault();
            ws.send(
                JSON.stringify({
                    type: action,
                    gameId: gameId,
                })
            );
        }
    }

    // Event Listeners
    $(document).on('keydown', handleKeyPress);
    $('#newGameBtn').on('click', startNewGame);

    $('.auth-tab').on('click', function () {
        switchAuthForm($(this).data('form'));
    });
    $('#loginForm').on('submit', handleLogin);
    $('#registerForm').on('submit', handleRegister);
    $('#logoutBtn').on('click', handleLogout);

    // Check for existing token
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken && savedUsername) {
        token = savedToken;
        username = savedUsername;
        showGame();
        connectWebSocket();
    } else {
        showAuth();
    }

    // Controls
    $('#btnLeft').on('click', function () {
        sendGameCommand('MOVE_LEFT');
    });

    $('#btnRight').on('click', function () {
        sendGameCommand('MOVE_RIGHT');
    });

    $('#btnDown').on('click', function () {
        sendGameCommand('MOVE_DOWN');
    });

    $('#btnRotate').on('click', function () {
        sendGameCommand('ROTATE');
    });

    function sendGameCommand(action) {
        if (gameId && ws) {
            ws.send(
                JSON.stringify({
                    type: action,
                    gameId: gameId,
                })
            );
        }
    }

});
