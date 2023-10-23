/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { WIDTH, HEIGHT } from './const.js'
import { emptyFunction, removeChildren, sleep } from './functions.js'

const boardDiv = document.getElementById('board')! as HTMLDivElement

const startButton = document.getElementById('start')! as HTMLButtonElement
const stopButton = document.getElementById('stop')! as HTMLButtonElement
const resetButton = document.getElementById('reset')! as HTMLButtonElement

const templateSelect = document.getElementById('template')! as HTMLSelectElement
const setTemplateButton = document.getElementById('set-template')! as HTMLButtonElement

/** セルの状態を保持する配列。 */
const cells: boolean[] = []

/**
 * ボードの初期化(リセット)を行います。
 * @param width - ボードの幅。
 * @param height - ボードの高さ。
 * @returns void - なし。
 */
function setBoardSize (width: number, height: number): void {
  cells.splice(0)
  removeChildren('board')
  boardDiv.style.display = 'grid'
  boardDiv.style.gridTemplateColumns = `repeat(${width}, 10px)`
  boardDiv.style.gridTemplateRows = `repeat(${height}, 10px)`
  for (let i = 0; i < width * height; i++) {
    cells.push(false)
    const cell = document.createElement('div')
    cell.style.border = '1px solid black'
    cell.classList.add('cell')
    cell.dataset.position = i.toString()
    cell.addEventListener('click', () => {
      if (cell.classList.contains('alive')) {
        cell.classList.remove('alive')
        cells[i] = false
      } else {
        cell.classList.add('alive')
        cells[i] = true
      }
      // -----
      const idxes = []
      for (let i = 0; i < cells.length; i++) {
        if (cells[i]) {
          idxes.push(i)
        }
      }
      console.log(idxes)
      // -----
    })
    boardDiv.appendChild(cell)
  }
}
setBoardSize(WIDTH, HEIGHT)

startButton.addEventListener('click', () => {
  startButton.disabled = true
  stopButton.disabled = false
  resetButton.disabled = true
  start()
    .then(emptyFunction)
    .catch(emptyFunction)
})

stopButton.addEventListener('click', () => {
  startButton.disabled = false
  stopButton.disabled = true
  resetButton.disabled = false
})

resetButton.addEventListener('click', () => {
  startButton.disabled = false
  stopButton.disabled = true
  resetButton.disabled = false
  cells.splice(0)
  removeChildren('board')
  setBoardSize(WIDTH, HEIGHT)
})

/**
 * ライフゲームを開始します。
 * @global cells - セルの状態を保持する配列。
 * @returns Promise<void> - ライフゲームの開始を表すPromise。
 */
async function start (): Promise<void> {
  // ライフゲームの開始
  while (startButton.disabled) {
    await sleep(100)
    const _cells = [...cells]
    for (let i = 0; i < cells.length; i++) {
      const cell = document.querySelector(`[data-position="${i}"]`)!
      if (checkAlive(i)) {
        cell.classList.add('alive')
        _cells[i] = true
      } else {
        cell.classList.remove('alive')
        _cells[i] = false
      }
    }
    cells.splice(0)
    cells.push(..._cells)
  }
}

/**
 * 指定した位置のセルが生きているかどうかを返します。
 * @global cells - セルの状態を保持する配列。
 * @param position - セルの位置。
 * @returns boolean - 生きているかどうか。
 */
function checkAlive (position: number): boolean {
  let aliveCount = 0
  const x = position % WIDTH
  const y = Math.floor(position / WIDTH)
  // 左上
  if (x > 0 && y > 0 && cells[position - WIDTH - 1]) {
    aliveCount++
  }
  // 上
  if (y > 0 && cells[position - WIDTH]) {
    aliveCount++
  }
  // 右上
  if (x < WIDTH - 1 && y > 0 && cells[position - WIDTH + 1]) {
    aliveCount++
  }
  // 左
  if (x > 0 && cells[position - 1]) {
    aliveCount++
  }
  // 右
  if (x < WIDTH - 1 && cells[position + 1]) {
    aliveCount++
  }
  // 左下
  if (x > 0 && y < HEIGHT - 1 && cells[position + WIDTH - 1]) {
    aliveCount++
  }
  // 下
  if (y < HEIGHT - 1 && cells[position + HEIGHT]) {
    aliveCount++
  }
  // 右下
  if (x < WIDTH - 1 && y < HEIGHT - 1 && cells[position + WIDTH + 1]) {
    aliveCount++
  }
  // 生誕
  if (!cells[position] && aliveCount === 3) {
    return true
  }
  // 生存
  if (cells[position] && (aliveCount === 2 || aliveCount === 3)) {
    return true
  }
  return false
}

const templates: Record<string, number[]> = {
  'space-ship': [203, 206, 257, 303, 307, 354, 355, 356, 357],
  glider: [154, 205, 253, 254, 255],
  'glider-gun': [26, 74, 76, 114, 115, 122, 123, 136, 137, 163, 167, 172, 173, 186, 187, 202, 203, 212, 218, 222, 223, 252, 253, 262, 266, 268, 269, 274, 276, 312, 318, 326, 363, 367, 414, 415],
  'straight-line': [305, 306, 307, 308, 309, 310, 311, 312, 313, 314]
}

setTemplateButton.addEventListener('click', () => {
  const templateValue = templateSelect.value
  if (templateValue === 'none') {
    return
  }
  const templateCells = templates[templateValue]
  removeChildren('board')
  cells.splice(0)
  setBoardSize(WIDTH, HEIGHT)
  for (const cell of templateCells) {
    const cellElement = document.querySelector(`[data-position="${cell}"]`)!
    cellElement.classList.add('alive')
    cells[cell] = true
  }
})

/* eslint-enable @typescript-eslint/no-non-null-assertion */
