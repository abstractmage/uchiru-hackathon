import { IReactionDisposer, IReactionOptions, IReactionPublic, reaction } from 'mobx';

export class Reaction {
  disposer: IReactionDisposer | null = null;

  expression: (r: IReactionPublic) => boolean;

  effect: (arg: boolean, prev: boolean, r: IReactionPublic) => void;

  opts?: IReactionOptions;

  /**
   * @param {(r: import('mobx').IReactionPublic) => boolean} expression
   * @param {(arg: boolean, r: import('mobx').IReactionPublic) => void} effect
   * @param {import('mobx').IReactionOptions} [opts]
   * */
  constructor(
    expression: (r: IReactionPublic) => boolean,
    effect: (arg: boolean, prev: boolean, r: IReactionPublic) => void,
    opts?: IReactionOptions,
  ) {
    this.expression = expression;
    this.effect = effect;
    this.opts = opts;
  }

  init() {
    this.disposer = reaction(this.expression, this.effect, this.opts);
  }

  dispose() {
    if (this.disposer) this.disposer();
  }
}
