<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tetris Game</title>
  <link rel="shortcut icon" href="imgs/favicon.png" type="image/png" />
  <link rel="stylesheet" href="styles/styles.css" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="scripts/app.js" defer></script>
</head>

<body>
  <!-- Auth Forms -->
  <div class="auth-container" id="authContainer">
    <div class="auth-box">
      <div class="auth-tabs">
        <button class="auth-tab active" data-form="login">Login</button>
        <button class="auth-tab" data-form="register">Register</button>
      </div>

      <!-- Login Form -->
      <form id="loginForm" class="auth-form">
        <div class="form-group">
          <label for="loginUsername">Username</label>
          <input type="text" id="loginUsername" required />
        </div>
        <div class="form-group">
          <label for="loginPassword">Password</label>
          <input type="password" id="loginPassword" required />
        </div>
        <button type="submit" class="auth-button">
          <span class="button-text">Login</span>
          <span class="spinner" style="display: none;"></span>
        </button>
      </form>

      <!-- Register Form -->
      <form id="registerForm" class="auth-form" style="display: none">
        <div class="form-group">
          <label for="regUsername">Username</label>
          <input type="text" id="regUsername" required />
        </div>
        <div class="form-group">
          <label for="regEmail">Email</label>
          <input type="email" id="regEmail" required />
        </div>
        <div class="form-group">
          <label for="regPassword">Password</label>
          <input type="password" id="regPassword" required />
        </div>
        <button type="submit" class="auth-button">
          <span class="button-text">Register</span>
          <span class="spinner" style="display: none;"></span>
        </button>
      </form>
    </div>
  </div>

  <!-- Main Game Container -->
  <div class="main-container" style="display: none">
    <div class="header">
      <div class="user-info">
        Welcome, <span id="username"></span>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </div>

    <div id="time-attack-container">
      <div class="time-panel">
        <h3>Time Remaining</h3>
        <div class="time" id="timeRemaining"></div>
      </div>
      <div class="target-score-panel">
        <h3>Target Score</h3>
        <div class="target-score" id="targetScore"></div>
      </div>
    </div>

    <div class="content">
      <div class="leaderboard">
        <h2>Top Scores</h2>
        <div id="topScores" class="scores-list"></div>
      </div>

      <div class="game-container">
        <div class="game-board" id="gameBoard"></div>
        <div class="info-panel">
          <div id="control-container">
            <div class="container">
              <h3>Next Piece</h3>
              <div class="next-piece" id="nextPiece"></div>
            </div>

            <div class="mobile-controls">
              <button class="control-btn" id="btnLeft">←</button>
              <div class="vertical-controls">
                <button class="control-btn" id="btnRotate">↻</button>
                <button class="control-btn" id="btnDown">↓</button>
              </div>
              <button class="control-btn" id="btnRight">→</button>
            </div>
          </div>
          <div class="score-panel">
            <h3>Score</h3>
            <div class="score" id="score">0</div>
          </div>
          <div class="level-panel">
            <h3>Level</h3>
            <div class="level" id="level">1</div>
          </div>

          <!-- Mode Selector -->
          <div class="controls">
            <h3>Select Game Mode</h3>
            <select id="gameModeSelector"></select>
          </div>

          <div class="controls">
            <h3>Controls</h3>
            <p>← : Move Left</p>
            <p>→ : Move Right</p>
            <p>↓ : Move Down</p>
            <p>↻ : Rotate</p>
          </div>
        </div>
      </div>

      <div class="personal-scores">
        <h2>Your History</h2>
        <div id="personalScores" class="scores-list"></div>
      </div>
    </div>
  </div>

  <div class="game-over" id="gameOver">
    <h2>Game Over!</h2>
    <p>Your Score: <span id="finalScore">0</span></p>
    <button class="new-game-btn" id="newGameBtn">New Game</button>
  </div>
</body>

</html>