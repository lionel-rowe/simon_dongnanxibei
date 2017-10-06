document.addEventListener('DOMContentLoaded', function() {

  let activationTimeout;
  let playSequenceTimeouts = [];

  const state = {
    init: function() {
      this.inProgress = false;
      this.userInputAllowed = true;
      this.sequence = [];
      this.idxToCheck = -1; //of sequence 
    }
  };

  const winningMove = 20;
  document.querySelector('#winningMove').textContent = winningMove;

  //logging state: `console.log(`\`state\` at line [line]: ${JSON.stringify(state)}`);

  const audioDong = new Audio('audio/dong.mp3');
  const audioNan = new Audio('audio/nan.mp3');
  const audioXi = new Audio('audio/xi.mp3');
  const audioBei = new Audio('audio/bei.mp3');

  //audio files from forvo.com

  const directions = [
    {letter: 'd', char: '东', audio: audioDong}
    , {letter: 'n', char: '南', audio: audioNan}
    , {letter: 'x', char: '西', audio: audioXi}
    , {letter: 'b', char: '北', audio: audioBei}
  ];

  function activate(char) {
    const pieces = document.querySelectorAll('.mahjong');
    const currentPiece = document.querySelector(`.mahjong[value=${char}]`);
    pieces.forEach(function(piece) {
      piece.classList.remove('activated');
    });

    setTimeout(function() {
      currentPiece.classList.add('activated');
      if (document.querySelector('#sound').checked) {
        const audio = directions.filter((el) => el.char === char)[0].audio.cloneNode(true);
        audio.play();
      }
    }, 10);

    currentPiece.focus();
    clearTimeout(activationTimeout);
    activationTimeout = setTimeout(function() {
      currentPiece.classList.remove('activated');
    }, 600);
  }

  document.querySelectorAll('.mahjong').forEach(function(el) {
    el.addEventListener('click', function() {
      if (state.userInputAllowed) {
        handleUserInput(el.value);
      }
    });
  });

  window.addEventListener('keydown', function(e) {

    const direction = directions.filter(direction => direction.letter === e.key)[0];

    if (direction && state.userInputAllowed) {
      handleUserInput(direction.char);
    }

  });

  document.querySelector('.container').addEventListener('scroll', function() {
    this.scrollLeft = 0;
    this.scrollTop = 0;
  });

  function addNewMove() {
    const newMove = Math.floor(Math.random() * 4);
    state.sequence.push(newMove);
    document.querySelector('#moveCounter').textContent = state.sequence.length;
    state.idxToCheck++;
  }

  function playSequence() {
    state.userInputAllowed = false;
    state.idxToCheck = 0;
    state.sequence.forEach(function(el, idx) {
      playSequenceTimeouts.push(
        setTimeout(function() {
          activate(directions[el].char);
        }, 1500 * idx)
      );
    });
    document.querySelector('#statusDisplay').textContent = 'Watch carefully...';
    playSequenceTimeouts.push(
      setTimeout(function() {
        document.querySelector('#statusDisplay').textContent = 'Now repeat the sequence!';
        state.userInputAllowed = true;
      }, 1500 * state.sequence.length)
    );
  }

  function handleUserInput(char) {
    activate(char);

    if (state.inProgress) {
      if (char === directions[state.sequence[state.idxToCheck]].char) {
        if (state.idxToCheck === state.sequence.length - 1) {
          if (state.sequence.length === winningMove) {
            document.querySelector('#overlay').classList.remove('hidden');
          } else {
            continueGame();
          }
        }
        state.idxToCheck++;
      } else {
        if (document.querySelector('#strict').checked) {
          strictModeRestart();
        } else {
          state.userInputAllowed = false;
          setTimeout(playSequence, 2000);
          document.querySelector('#statusDisplay').textContent = 'Sorry, that’s the wrong sequence!';
        }
      }
    }
  }

  function start() {
    state.init();
    state.inProgress = true;
    addNewMove();
    playSequence();
    document.querySelector('#start').value = 'End Game';
  }

  function turnOff() {
    playSequenceTimeouts.forEach(function(el) {
      clearTimeout(el);
    });
    playSequenceTimeouts = [];
    state.init();
    state.inProgress = false;
    document.querySelector('#start').value = 'Start';
    document.querySelector('#statusDisplay').textContent = 'Game stopped';
    document.querySelector('#moveCounter').textContent = state.sequence.length;
  }

  function continueGame() {
    state.userInputAllowed = false;
    addNewMove();
    setTimeout(playSequence, 1500);
  }

  function strictModeRestart() {
    state.userInputAllowed = false;
    document.querySelector('#statusDisplay').textContent = 'Sorry, that’s the wrong sequence! Game restarted';
    
    setTimeout(function() {
      start();
    } , 3000);

  }

  document.querySelector('#start').addEventListener('click', function() {

    if (!state.inProgress) {
      start();
    } else {
      turnOff();
    }
  });

  document.querySelector('#continue').addEventListener('click', function() {
    document.querySelector('#overlay').classList.add('hidden');
    continueGame();
  });

  document.querySelector('#restart').addEventListener('click', function() {
    document.querySelector('#overlay').classList.add('hidden');
    start();
  });

  state.init();

});
