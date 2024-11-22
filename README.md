# **Tetris Game - Frontend**

---

## **Visão Geral**

Este frontend é a interface gráfica do jogo de Tetris, permitindo aos jogadores interagir com a API WebSocket em tempo real. Ele exibe o tabuleiro, pontuação, nível atual, próxima peça e inclui controles para jogar.

---

## **Índice**

1. [Estrutura de Arquivos](#estrutura-de-arquivos)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Descrição dos Componentes](#descrição-dos-componentes)
4. [Funcionalidades](#funcionalidades)
5. [Interação com a API](#interação-com-a-api)
6. [Como Usar](#como-usar)
7. [Personalização](#personalização)
8. [Funcionalidades Futuras](#funcionalidades-futuras)

---

## **Estrutura de Arquivos**

```
/frontend
├── index.html         # Estrutura HTML principal
├── styles.css         # Estilos do frontend
├── app.js             # Lógica do jogo e interação com a API WebSocket
```

---

## **Tecnologias Utilizadas**

- **HTML5**: Estrutura do frontend.
- **CSS3**: Estilos e layout.
- **JavaScript**: Lógica de interação e manipulação do DOM.
- **jQuery**: Para facilitar a manipulação do DOM e eventos.

---

## **Descrição dos Componentes**

### **1. Tabuleiro do Jogo**

- Exibido em uma grade 10x20 (`game-board`).
- Atualizado dinamicamente com base no estado do jogo enviado pelo servidor.

### **2. Próxima Peça**

- Exibido em uma grade 4x4 (`next-piece`).
- Mostra a próxima peça que será jogada.

### **3. Painéis de Informações**

- **Pontuação (`score`)**: Exibe a pontuação atual.
- **Nível (`level`)**: Exibe o nível atual do jogo.
- **Controles (`controls`)**: Lista os controles do teclado para jogar.

### **4. Tela de Game Over**

- Aparece quando o jogo termina.
- Exibe a pontuação final e inclui um botão para iniciar um novo jogo.

---

## **Funcionalidades**

### **1. Atualização Dinâmica**

- O tabuleiro, a próxima peça, o nível e a pontuação são atualizados em tempo real com os dados recebidos da API.

### **2. Controles**

- **Teclas do teclado**:
  - **←**: Move a peça para a esquerda.
  - **→**: Move a peça para a direita.
  - **↓**: Move a peça para baixo.
  - **↑**: Rotaciona a peça.

### **3. Sistema de Níveis**

- Aumenta automaticamente o nível do jogador a cada 5 minutos.
- A velocidade de descida das peças aumenta em 10% a cada nível.

### **4. Novo Jogo**

- O botão "Novo Jogo" reinicia o jogo atual enviando a mensagem `NEW_GAME` para o servidor.

### **5. Proteção contra múltiplos salvamentos de pontuação**

- Evita que a pontuação seja salva mais de uma vez ao finalizar o jogo.

---

## **Interação com a API**

### **1. Conexão com o WebSocket**

O frontend conecta-se à API via WebSocket na inicialização:

```javascript
ws = new WebSocket('ws://localhost:3000?token=<seu-token>');
```

### **2. Mensagens Enviadas**

- **Movimentação das peças**:

  ```javascript
  ws.send(JSON.stringify({
      type: 'MOVE_LEFT', // Outros valores: 'MOVE_RIGHT', 'MOVE_DOWN', 'ROTATE'
      gameId: gameId
  }));
  ```

- **Novo Jogo**:

  ```javascript
  ws.send(JSON.stringify({
      type: 'NEW_GAME',
      gameId: gameId
  }));
  ```

### **3. Mensagens Recebidas**

O frontend processa mensagens do servidor e atualiza a interface:

```javascript
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.type === 'GAME_UPDATE') {
        updateBoard(data.gameState.board);
        updateNextPiece(data.gameState.nextPiece);
        updateScore(data.gameState.score);
        updateLevel(data.gameState.level);
    }
    if (data.type === 'GAME_OVER') {
        showGameOver(data.gameState.score);
    }
    if (data.type === 'LEVEL_UP') {
        updateLevel(data.gameState.level);
    }
};
```

---

## **Como Usar**

1. **Pré-requisitos**:
   - Um servidor WebSocket rodando em `ws://localhost:3000`.

2. **Acesse o Frontend**:
   - Abra o arquivo `index.html` em um navegador.

3. **Jogue**:
   - Use as teclas do teclado para movimentar as peças conforme os controles listados.

4. **Reinicie o Jogo**:
   - Clique no botão "Novo Jogo" ao final do jogo para reiniciar.

---

## **Personalização**

### **1. Estilos**

- Modifique o arquivo `styles.css` para alterar cores, fontes ou layout.

### **2. Layout do Tabuleiro**

- Para alterar o tamanho do tabuleiro, ajuste as dimensões no CSS:

  ```css
  .game-board {
      grid-template-columns: repeat(10, 30px); /* Altere o número de colunas */
      grid-template-rows: repeat(20, 30px);    /* Altere o número de linhas */
  }
  ```

### **3. Conexão do WebSocket**

- Altere a URL do WebSocket em `app.js` caso o servidor esteja rodando em um endereço ou porta diferente:

  ```javascript
  ws = new WebSocket('ws://<seu-servidor>:<sua-porta>?token=<seu-token>');
  ```

---

## **Funcionalidades Futuras**

- Adicionar suporte a jogos multiplayer.
- Implementar salvamento de progresso no localStorage.
- Melhorar animações e feedback visual.
- Adicionar tema customizável para o jogo.

---

Agora você possui um frontend funcional, integrado à API, pronto para proporcionar uma experiência de Tetris em tempo real! 🚀
