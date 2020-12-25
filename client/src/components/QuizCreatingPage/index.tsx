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

// axios.get('http://localhost:3001/teacher').then((res) => {
//   const { quizess } = res.data;
//   console.log('ALL QUIZESS', quizess);
// });

// axios.post('http://localhost:3001/teacher/edit/1111', {
//   pin: 1111,
//   updated: {
//     title: 'UPDATED TITLE',
//   },
// });

// axios.get('http://localhost:3001/quiz/1111').then((res) => {
//   const { quiz } = res.data;
//   console.log('SINGLE QUIZ', quiz);
// });

export type QuizCreatingPageProps = {
  quiz: {
    id: string;
    pin: number;
    name: string;
    items: Item[];
  };
  disabled?: boolean;
  onSaveClick?: (params: { id: string; pin: number; name: string; items: Item[] }) => void;
};

const colors: ('green' | 'blue' | 'orange' | 'purple')[] = ['green', 'blue', 'orange', 'purple'];

export const QuizCreatingPage: React.FC<QuizCreatingPageProps> = observer(function QuizCreatingPage(
  props,
) {
  const { quiz, onSaveClick, disabled } = props;
  const store = useLocalObservable(() => new QuizCreatingPageStore());

  React.useEffect(() => {
    store.load(quiz);
  }, [quiz, store]);

  const handleChangeQuizName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;
      store.handleChangeName(value);
    },
    [store],
  );

  const handleSaveClick = React.useCallback(() => {
    if (onSaveClick)
      onSaveClick({ id: quiz.id, pin: quiz.pin, name: store.name, items: store.items });
  }, [onSaveClick, quiz.id, quiz.pin, store.items, store.name]);

  return (
    <div className={style.main}>
      <div className={style.quizName}>
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
                  preview={item.preview}
                  selected={item.index === store.selected}
                  onClick={store.handleItemClick}
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
              file={store.selectedItem.preview}
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
    </div>
  );
});
