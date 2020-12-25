import { action, makeAutoObservable } from 'mobx';

type Variant = {
  variant: string;
  value: string;
  selected: boolean;
};

type Item = {
  index: number;
  title: string;
  time: string;
  preview?: string;
  selected?: boolean;
  variants: Variant[];
};

export class QuizCreatingPageStore {
  name = '';

  items: Item[] = [
    {
      index: 0,
      title: '',
      time: '20',
      preview: undefined,
      variants: [
        {
          variant: '1',
          value: '',
          selected: false,
        },
        {
          variant: '2',
          value: '',
          selected: false,
        },
        {
          variant: '3',
          value: '',
          selected: false,
        },
        {
          variant: '4',
          value: '',
          selected: false,
        },
      ],
    },
  ];

  selected: number | null = 0;

  get selectedItem() {
    return this.selected !== null ? this.items[this.selected] : null;
  }

  constructor() {
    makeAutoObservable(this, {
      handleChangeName: action,
      handleItemChangeTime: action,
      handleItemClick: action,
      handleItemChangeTitle: action,
      handleAddClick: action,
    });
  }

  handleChangeName = (name: string) => {
    this.name = name;
  };

  handleItemChangeTime = (time: string) => {
    if (this.selectedItem) {
      this.selectedItem.time = time;
    }
  };

  handleItemChangeTitle = (title: string) => {
    if (this.selectedItem) {
      this.selectedItem.title = title;
    }
  };

  handleItemClick = (index: number) => {
    this.selected = index;
  };

  handleAddClick = () => {
    const newItem = {
      index: this.items.length,
      title: '',
      time: '20',
      preview: undefined,
      selected: true,
      variants: [
        {
          variant: '1',
          value: '',
          selected: false,
        },
        {
          variant: '2',
          value: '',
          selected: false,
        },
        {
          variant: '3',
          value: '',
          selected: false,
        },
        {
          variant: '4',
          value: '',
          selected: false,
        },
      ],
    };

    this.items.push(newItem);
  };
}
