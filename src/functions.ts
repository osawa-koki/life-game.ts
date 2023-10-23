/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * 指定した要素の子要素を全て削除します。
 * @param parent
 * @returns void
 */
export function removeChildren (parent: string | HTMLElement): void {
  const parentElement = typeof parent === 'string' ? document.getElementById(parent)! : parent
  while (parentElement.firstChild != null) {
    parentElement.removeChild(parentElement.firstChild)
  }
}

/**
 * 指定したミリ秒だけ待機します。
 * @param ms
 * @returns Promise<void>
 */
export async function sleep (ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 空の関数です。
 */
export function emptyFunction (): void {}

/* eslint-enable @typescript-eslint/no-non-null-assertion */
