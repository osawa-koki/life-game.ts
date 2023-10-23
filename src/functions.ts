/* eslint-disable @typescript-eslint/no-non-null-assertion */

export function removeChildren (parent: string | HTMLElement): void {
  const parentElement = typeof parent === 'string' ? document.getElementById(parent)! : parent
  while (parentElement.firstChild != null) {
    parentElement.removeChild(parentElement.firstChild)
  }
}

export async function sleep (ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export function emptyFunction (): void {}

/* eslint-enable @typescript-eslint/no-non-null-assertion */
