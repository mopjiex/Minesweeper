const createElements = () => {
    const container = document.createElement('div');
    container.classList.add('container');
    const wrapper = document.createElement('div');
    wrapper.classList.add('minesweeper__wrapper');
    container.appendChild(wrapper);
    const inputs = document.createElement('div');
    inputs.classList.add('minesweeper__inputs');
    wrapper.appendChild(inputs);
    const rows = document.createElement('div');
    rows.classList.add('rows');
    inputs.appendChild(rows);
    const rowsText = document.createElement('p');
    rowsText.classList.add('minesweeper__text');
    rowsText.textContent = 'Количество рядов';
    rows.appendChild(rowsText);
    const rowsInput = document.createElement('input');
    rowsInput.classList.add('minesweeper__row');
    rowsInput.setAttribute('type', 'number');
    rowsInput.setAttribute('value', '10');
    rows.appendChild(rowsInput);
    const cols = document.createElement('div');
    cols.classList.add('cols');
    inputs.appendChild(cols);
    const colsText = document.createElement('p');
    colsText.classList.add('minesweeper__text');
    colsText.textContent = 'Количество колонок';
    cols.appendChild(colsText);
    const colsInput = document.createElement('input');
    colsInput.classList.add('minesweeper__col');
    colsInput.setAttribute('type', 'number');
    colsInput.setAttribute('value', '10');
    cols.appendChild(colsInput);
    const bombs = document.createElement('div');
    bombs.classList.add('bombs');
    inputs.appendChild(bombs);
    const bombsText = document.createElement('p');
    bombsText.classList.add('minesweeper__text');
    bombsText.textContent = 'Количество бомб';
    bombs.appendChild(bombsText);
    const bombsInput = document.createElement('input');
    bombsInput.classList.add('minesweeper__bomb');
    bombsInput.setAttribute('type', 'number');
    bombsInput.setAttribute('value', '10');
    bombs.appendChild(bombsInput);
    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    inputs.appendChild(buttons);
    const newGameButton = document.createElement('button');
    newGameButton.classList.add('minesweeper__btn-begin');
    newGameButton.textContent = 'Новая игра';
    buttons.appendChild(newGameButton);
    const soundButton = document.createElement('button');
    soundButton.classList.add('minesweeper__sound', 'volume');
    buttons.appendChild(soundButton);
    const soundImage = document.createElement('img');
    soundImage.classList.add('sound__img');
    soundImage.setAttribute('src', './images/minus.png');
    soundImage.setAttribute('alt', '');
    soundButton.appendChild(soundImage);
    const themeButton = document.createElement('button');
    themeButton.classList.add('theme');
    buttons.appendChild(themeButton);
    const themeImage = document.createElement('img');
    themeImage.setAttribute('src', './images/moon.png');
    themeImage.setAttribute('alt', '');
    themeImage.classList.add('theme__img');
    themeButton.appendChild(themeImage);
    const count = document.createElement('p');
    count.classList.add('minesweeper__count');
    count.textContent = '0';
    container.appendChild(count);
    const timer = document.createElement('p');
    timer.classList.add('minesweeper__timer');
    timer.textContent = '0:00:00';
    container.appendChild(timer);
    const minesweeper = document.createElement('div');
    minesweeper.classList.add('minesweeper');
    container.appendChild(minesweeper);
    const gameOverText = document.createElement('p');
    gameOverText.classList.add('game-over');
    gameOverText.textContent = 'Проиграли!';
    container.appendChild(gameOverText);
    const winText = document.createElement('p');
    winText.classList.add('win');
    winText.textContent = 'Выиграли!';
    container.appendChild(winText);
    document.body.appendChild(container);
}

createElements();
const minesweeperCount = document.querySelector('.minesweeper__count');
const inputRow = document.querySelector('.minesweeper__row');
const inputCol = document.querySelector('.minesweeper__col');
const inputBomb = document.querySelector('.minesweeper__bomb');
const minesweeperBtn = document.querySelectorAll('.minesweeper__btn');
const minesweeperBtnBegin = document.querySelector('.minesweeper__btn-begin');
const audioVolume = document.querySelector('.minesweeper__sound');
const theme = document.querySelector('.theme');
let clickCount;
let startTime;
let elapsedTime = 0;
let timerInterval;
const audio = new Audio();

const startTimer = () => {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
}

const updateTimer = () => {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);
    const timer = document.querySelector('.minesweeper__timer');
    timer.textContent = formattedTime;
}

const formatTime = milliseconds => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

const padNumber = number => {
    return number.toString().padStart(2, '0');
}

const stopTimer = () => {
    clearInterval(timerInterval);
}

const resetTimer = () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    const timer = document.querySelector('.minesweeper__timer');
    timer.textContent = '0:00:00';
}

const play  = (width, height, bombsCount) => {
    const mine = '<img class="mine" src="./images/mine.png">';
    const minesweeper = document.querySelector('.minesweeper');
    const cellsCount = width * height;
    minesweeper.innerHTML = Array(cellsCount).fill('<div class="minesweeper__btn"></div>').join('');
    const cells = Array.from(minesweeper.children);
    const bombs = Array.from({ length: cellsCount }, (_, index) => index)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, bombsCount);
    let closeCount = cellsCount;

    minesweeper.addEventListener('click', (e) => {
        clickCount++;
        minesweeperCount.textContent = clickCount;
        const cell = e.target;
        audio.src = './sound/click.mp3';
        audio.play();
        if(cell.className !== 'minesweeper__btn') return;
        const index = cells.indexOf(e.target);
        const col = index % width;
        const row = Math.floor(index / width);
        handleClick(row, col);
    })

    const isCellValid = (row, col) => {
        return row >= 0 && row < height && col >= 0 && col < width;
    }
    
    const getBombCount = (row, col) => {
        let count = 0;
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) if(hasBomb(row + j, col + i)) count++;
        }
        return count;
    }

    const handleClick = (row, col)  => {
        if(!isCellValid(row, col)) return;
        const cellIndex = row * width + col;
        const cellElement = cells[cellIndex];

        if(cellElement.disabled) {
            cellElement.classList.add('background')
            return;
        }
        cellElement.disabled = true;
        if(hasBomb(row, col)) {
            cellElement.innerHTML = mine;
            gameOver();
            return;
        }
        closeCount--;
        if(closeCount <= bombsCount) {
            win();
            return;
        }

        const count = getBombCount(row, col);
        if(count !== 0) {
            cellElement.innerHTML = count;
            if(count === 1) cellElement.className = 'minesweeper__btn color__one';
            else if(count === 2) cellElement.className = 'minesweeper__btn color__two';
            else if(count === 3) cellElement.className = 'minesweeper__btn color__three';
            else cellElement.className = 'minesweeper__btn color__other';
            cellElement.classList.add('background')
            return;
        }

        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) handleClick(row + j, col + i);
        }
        
    }

    const hasBomb = (row, col) => {
        if(!isCellValid(row, col)) return false;
        const index = row * width + col;
        return bombs.includes(index);
    }

    const gameOver = () => {
        const gameOverText = document.querySelector('.game-over');
        const minesweeperBtn = document.querySelectorAll('.minesweeper__btn');
        
        minesweeperBtn.forEach(item => {
            bombs.forEach(i => {
                minesweeperBtn[i].innerHTML = mine;
            });
            item.disabled = true;
        })

        gameOverText.style.display = 'block';
        audio.src = './sound/game-over2.mp3';
        audio.play();
        stopTimer();
    }

    const win = () => {
        const win = document.querySelector('.win');
        const minesweeperBtn = document.querySelectorAll('.minesweeper__btn');
        win.style.display = 'block';
        minesweeperBtn.forEach(item => {
            bombs.forEach(i => {
                minesweeperBtn[i].innerHTML = mine;
            })
            item.disabled = true;
        })
        audio.src = './sound/win.mp3';
        audio.play();
        stopTimer();
    }
}

minesweeperBtnBegin.addEventListener('click', () => {
    clickCount = 0;
    minesweeperCount.textContent = 0;
    resetTimer();
    startTimer();
    const minesweeper = document.querySelector('.minesweeper');
    const gameOverText = document.querySelector('.game-over');
    const win = document.querySelector('.win');
    gameOverText.style.display = 'none';
    win.style.display = 'none';
    minesweeper.style.gridTemplateColumns =  `repeat(${+inputCol.value}, 1fr)`;
    play(+inputRow.value, +inputCol.value, +inputBomb.value);
})

audioVolume.addEventListener('click', () => {
    const soundImg = document.querySelector('.sound__img');
    audioVolume.classList.toggle('volume');

    if(audioVolume.classList.contains('volume')) {
        soundImg.src = './images/minus.png';
        audio.volume = 1;
    } else {
        soundImg.src = './images/plus.png';
        audio.volume = 0;
    }
    
})

theme.addEventListener('click', () => {
    const themeImg = document.querySelector('.theme__img');
    const body = document.querySelector('body');
    const minesweeperText = document.querySelectorAll('.minesweeper__text');
    const minesweeperCount = document.querySelector('.minesweeper__count');
    const minesweeperTimer = document.querySelector('.minesweeper__timer');
    themeImg.classList.toggle('theme_dark');

    if(themeImg.classList.contains('theme_dark')) {
        themeImg.src = './images/sun.png';
        body.style.backgroundImage = `url(./images/background-dark.jpg)`;
        minesweeperText.forEach(elem => elem.classList.add('minesweeper__text_dark'))
        minesweeperCount.classList.add('minesweeper__text_dark');
        minesweeperTimer.classList.add('minesweeper__text_dark');
    } else {
        themeImg.src = './images/moon.png';
        body.style.backgroundImage = `url(./images/background.jpg)`;
        minesweeperText.forEach(elem => elem.classList.remove('minesweeper__text_dark'))
        minesweeperCount.classList.remove('minesweeper__text_dark');
        minesweeperTimer.classList.remove('minesweeper__text_dark');
    }
})

startTimer();
clickCount = 0;
minesweeperCount.textContent = 0;
play(10, 10, 10);




