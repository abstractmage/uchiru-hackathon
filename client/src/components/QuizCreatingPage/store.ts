/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { makeAutoObservable } from 'mobx';

export type Variant = {
  variant: string;
  value: string;
  selected: boolean;
};

export type Item = {
  index: number;
  title: string;
  time: string;
  image?: string;
  variants: Variant[];
};

export class QuizCreatingPageStore {
  name = '';

  items: Item[] = [
    {
      index: 0,
      title: '',
      time: '20',
      image: undefined,
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

  modalError: { shown: boolean; message: null | string } = {
    shown: false,
    message: null,
  };

  get selectedItem() {
    return this.selected !== null ? this.items[this.selected] : null;
  }

  constructor() {
    makeAutoObservable(this);
  }

  load({ name, items }: { name: string; items: Item[] }) {
    this.name = name;
    this.items = items;
  }

  showModalError(message: string) {
    this.modalError = { shown: true, message };
  }

  hideModalError() {
    this.modalError.shown = false;
  }

  validate({ name, items }: { name: string; items: Item[] }) {
    const nameFilled = !!name;

    if (!nameFilled) {
      this.showModalError('Необходимо ввести название викторины.');
      return false;
    }

    for (const index in items) {
      const item = items[index];
      const itemTitleFilled = !!item.title;

      if (!itemTitleFilled) {
        this.showModalError(`Вопрос ${+index + 1}: необходимо ввести текст.`);
        return false;
      }

      const timeFilled = !!item.time;

      if (!timeFilled) {
        this.showModalError(`Вопрос ${+index + 1}: необходимо ввести время для вопроса.`);
        return false;
      }

      const everyVariantsFilled = item.variants.every((v) => !!v.value);

      if (!everyVariantsFilled) {
        this.showModalError(`Вопрос ${+index + 1}: необходимо ввести все варианты ответа.`);
        return false;
      }

      const rightAnswerSelected = !!item.variants.find((v) => v.selected);

      if (!rightAnswerSelected) {
        this.showModalError(`Вопрос ${+index + 1}: необходимо выбрать правильный вариант ответа.`);
        return false;
      }
    }

    return true;
  }

  handleModalCloseClick = () => {
    this.hideModalError();
  };

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

  handleItemCrossClick = (index: number) => {
    this.items = this.items
      .filter((item) => item.index !== index)
      .map((item, i) => ({ ...item, index: i }));

    if (this.items.length) this.selected = 0;
    else this.selected = null;
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

    this.selected = newItem.index;

    this.items = this.items.concat(newItem);
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
      this.selectedItem.image = file || undefined;
    }
  };
}
