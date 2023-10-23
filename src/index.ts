/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { WIDTH, HEIGHT } from './const.js'
import { emptyFunction, removeChildren, sleep } from './functions.js'

const boardDiv = document.getElementById('board')! as HTMLDivElement

const startButton = document.getElementById('start')! as HTMLButtonElement
const stopButton = document.getElementById('stop')! as HTMLButtonElement
const resetButton = document.getElementById('reset')! as HTMLButtonElement

const cells: boolean[] = []

function setBoardSize (width: number, height: number): void {
  cells.splice(0)
  removeChildren('board')
  boardDiv.style.display = 'grid'
  boardDiv.style.gridTemplateColumns = `repeat(${width}, 15px)`
  boardDiv.style.gridTemplateRows = `repeat(${height}, 15px)`
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

function checkAlive (position: number): boolean {
  // 指定した位置のセルが生きているかどうかを返す
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

/* eslint-enable @typescript-eslint/no-non-null-assertion */
