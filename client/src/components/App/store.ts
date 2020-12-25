import { makeAutoObservable } from 'mobx';

export class AppStore {
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }
}
