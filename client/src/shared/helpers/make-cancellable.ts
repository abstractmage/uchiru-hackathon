export function makeCancelable<T>(promise: Promise<T>): Promise<T> & { cancel(): void } {
  let cancel = null;
  const promiseWrapper: any = new Promise((resolve, reject) => {
    promise.then(resolve).catch(reject);

    // eslint-disable-next-line prefer-promise-reject-errors
    cancel = () => reject('CANCELLED');
  });

  promiseWrapper.cancel = cancel;

  return promiseWrapper;
}
