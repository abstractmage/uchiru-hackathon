import { makeAutoObservable, when } from 'mobx';
import { makeCancelable } from '~/shared/helpers/make-cancellable';
import { wait } from '~/shared/helpers/wait';

export class QuestionStore {
  promise: (Promise<void> & { cancel(): void }) | null = null;

  translated = [false, false];

  numberShown = [true, false];

  titleShown = [false, false];

  mediaOpened = [false, false];

  imageShown = [false, false];

  statsShown = [false, false];

  statsCalculated = [false, false];

  variantsShown = [false, false];

  constructor() {
    makeAutoObservable(this);
  }

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

  async show(withImage: boolean) {
    this.setState('translated', [true, true]);

    await this.setPromise(when(() => !this.translated[1]));

    await this.setPromise(wait(500));

    if (withImage) {
      this.setState('mediaOpened', [true, true]);
    }

    this.setState('numberShown', [false, true]);
    this.setState('variantsShown', [true, true]);
    this.setState('titleShown', [true, true]);

    await this.setPromise(
      when(
        () =>
          !this.numberShown[1] &&
          !this.mediaOpened[1] &&
          !this.variantsShown[1] &&
          !this.titleShown[1],
      ),
    );

    if (withImage) {
      this.setState('imageShown', [true, true]);

      await this.setPromise(when(() => !this.imageShown[1]));
    }
  }

  async showStats(withImage: boolean) {
    if (!withImage) {
      this.setState('mediaOpened', [true, true]);
      await this.setPromise(when(() => !this.mediaOpened[1]));
      this.setState('statsShown', [true, true]);
      await this.setPromise(when(() => !this.statsShown[1]));
      this.setState('statsCalculated', [true, true]);
      await this.setPromise(when(() => !this.statsCalculated[1]));

      return;
    }

    this.setState('imageShown', [false, true]);
    await this.setPromise(when(() => !this.imageShown[1]));
    this.setState('statsShown', [true, true]);
    await this.setPromise(when(() => !this.statsShown[1]));
    this.setState('statsCalculated', [true, true]);
    await this.setPromise(when(() => !this.statsCalculated[1]));
  }

  async hide() {
    this.setState('translated', [false, true]);

    await this.setPromise(when(() => !this.translated[1]));
  }

  setState = (
    name:
      | 'translated'
      | 'numberShown'
      | 'titleShown'
      | 'mediaOpened'
      | 'imageShown'
      | 'statsShown'
      | 'statsCalculated'
      | 'variantsShown',
    values: [boolean, boolean],
  ) => {
    this[name] = values;
  };

  handleStateChangingEnd = (
    name:
      | 'translated'
      | 'numberShown'
      | 'titleShown'
      | 'mediaOpened'
      | 'imageShown'
      | 'statsShown'
      | 'statsCalculated'
      | 'variantsShown',
  ) => {
    this[name] = [this[name][0], false];
  };
}
