import { action, makeAutoObservable } from 'mobx';

export type Variant = {
  variant: string;
  value: string;
  selected: boolean;
};

export type Item = {
  index: number;
  title: string;
  time: string;
  preview?: string;
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

  load({ name, items }: { name: string; items: Item[] }) {
    this.name = name;
    this.items = items;
  }

  handleChangeName = (name: string) => {
    if (name.length <= 84) this.name = name;
  };

  handleItemChangeTime = (time: string) => {
    if (this.selectedItem && time.length <= 2) {
      this.selectedItem.time = time.replace(/\D+/g, '');
    }
  };

  handleItemChangeTitle = (title: string) => {
    if (this.selectedItem && title.length <= 140) {
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

  handleChangeItemVariantValue = (variant: string, value: string) => {
    if (this.selectedItem && value.length <= 32) {
      const v = this.selectedItem.variants.find((currVariant) => currVariant.variant === variant)!;
      v.value = value;
    }
  };

  handleSelectItemVariant = (variant: string) => {
    if (this.selectedItem) {
      const v = this.selectedItem.variants.find((currVariant) => currVariant.variant === variant)!;
      this.selectedItem.variants.forEach((currVariant) => {
        // eslint-disable-next-line no-param-reassign
        currVariant.selected = false;
      });
      v.selected = true;
    }
  };

  handleSelectPreview = (file: string | null) => {
    if (this.selectedItem) {
      this.selectedItem.preview = file || undefined;
    }
  };
}
