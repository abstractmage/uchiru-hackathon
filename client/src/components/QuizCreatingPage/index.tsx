import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import Scrollbars from 'react-custom-scrollbars';
import { Button } from '../Button';
import { SelectButton } from '../SelectButton';
import { AddButton } from './AddButton';
import style from './index.module.scss';
import { Preview } from './Preview';
import { QuestionHead } from './QuestionHead';
import { QuestionItem } from './QuestionItem';
import { QuizCreatingPageStore, Item } from './store';
import { ModalError } from '../ModalError';

export type QuizCreatingPageProps = {
  quiz?: {
    id: string;
    pin: number;
    name: string;
    items: Item[];
  };
  disabled?: boolean;
  onSaveClick?: (params: { id?: string; pin?: number; name: string; items: Item[] }) => void;
  onBackClick?: () => void;
};

const colors: ('green' | 'blue' | 'orange' | 'purple')[] = ['green', 'blue', 'orange', 'purple'];

export const QuizCreatingPage: React.FC<QuizCreatingPageProps> = observer(function QuizCreatingPage(
  props,
) {
  const { quiz, onSaveClick, onBackClick, disabled } = props;
  const quizId = quiz?.id;
  const quizPin = quiz?.pin;
  const store = useLocalObservable(() => new QuizCreatingPageStore());

  React.useEffect(() => {
    if (quiz) store.load(quiz);
  }, [quiz, store]);

  const handleChangeQuizName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      store.handleChangeName(value);
    },
    [store],
  );

  const handleSaveClick = React.useCallback(() => {
    if (!onSaveClick) return;

    if (!store.validate({ name: store.name, items: store.items })) return;

    onSaveClick({ id: quizId, pin: quizPin, name: store.name, items: store.items });
  }, [onSaveClick, store, quizId, quizPin]);

  const handleBackClick = React.useCallback(() => {
    if (onBackClick) onBackClick();
  }, [onBackClick]);

  return (
    <div className={style.main}>
      <div className={style.quizName}>
        <Button className={style.backButton} color="purple" onClick={handleBackClick}>
          Назад
        </Button>
        <input
          className={style.quizInput}
          placeholder="Название викторины"
          value={store.name}
          onChange={handleChangeQuizName}
        />
        <Button className={style.quizButton} onClick={handleSaveClick}>
          Сохранить
        </Button>
      </div>
      <div className={style.mainContainer}>
        <div className={style.questionListContainerWrapper}>
          <div className={style.questionListContainer}>
            <Scrollbars>
              {store.items.map((item) => (
                <QuestionItem
                  key={item.index}
                  index={item.index}
                  title={item.title}
                  preview={item.image}
                  selected={item.index === store.selected}
                  onClick={store.handleItemClick}
                  onCrossClick={store.handleItemCrossClick}
                />
              ))}
              <AddButton onClick={store.handleAddClick} disabled={disabled} />
            </Scrollbars>
          </div>
        </div>
        {store.selectedItem && (
          <div className={style.questionContainer}>
            <QuestionHead
              disabled={disabled}
              nameValue={store.selectedItem.title}
              timeValue={store.selectedItem.time}
              onChangeName={store.handleItemChangeTitle}
              onChangeTime={store.handleItemChangeTime}
            />
            <Preview
              file={store.selectedItem.image}
              onSelectFile={(result) => store.handleSelectPreview(result && result.base64)}
            />
            <div className={style.selectButtonsWrap}>
              <div className={style.selectButtonsGrid}>
                <div className={style.selectButtonsInner}>
                  {store.selectedItem.variants.map((v, i) => (
                    <div key={v.variant} className={style.selectButton}>
                      <SelectButton
                        variant={v.variant}
                        value={v.value}
                        color={colors[i]}
                        selected={v.selected}
                        editable
                        disabled={disabled}
                        onChange={(val) => store.handleChangeItemVariantValue(v.variant, val)}
                        onClick={() => store.handleSelectItemVariant(v.variant)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ModalError
        shown={store.modalError.shown}
        message={store.modalError.message || undefined}
        onCloseClick={store.handleModalCloseClick}
      />
    </div>
  );
});
