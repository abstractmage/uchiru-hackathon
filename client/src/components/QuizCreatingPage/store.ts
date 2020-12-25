import { action, makeAutoObservable } from 'mobx';

type Item = {
  index: number;
  title: string;
  preview?: string;
  selected?: boolean;
};

export class QuizCreatingPageStore {
  name = '';

  time = '20';

  items: Item[] = [
    {
      index: 0,
      title: '',
      preview: undefined,
      selected: true,
    },
  ];

  selected: number | null = null;

  selectedItem: Item | null = null;

  constructor() {
    makeAutoObservable(this, {
      handleChangeName: action,
      handleChangeTime: action,
      handleItemClick: action,
    });
  }

  handleChangeName = (name: string) => {
    this.name = name;
  };

  handleChangeTime = (time: string) => {
    this.time = time;
  };

  handleItemClick = (index: number) => {
    this.selected = index;
  };
}
