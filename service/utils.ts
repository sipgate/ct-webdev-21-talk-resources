export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}


export async function sleepRandom(maxMs: number): Promise<void> {
    await sleep(Math.random() * maxMs)
}