import { makeCancelable } from './make-cancellable';

export class Promiser {
  promise: (Promise<void> & { cancel(): void }) | null = null;

  setPromise(value: Promise<void>) {
    this.promise = makeCancelable(value);
    return this.promise;
  }

  cancel() {
    if (this.promise) {
      this.promise.cancel();
      this.promise = null;
    }
  }
}
