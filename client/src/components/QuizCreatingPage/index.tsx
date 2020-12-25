import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Scrollbars from 'react-custom-scrollbars';
import { Button } from '../Button';
import { SelectButton } from '../SelectButton';
import { AddButton } from './AddButton';
import style from './index.module.scss';
import { Preview } from './Preview';
import { QuestionHead } from './QuestionHead';
import { QuestionItem } from './QuestionItem';
import { QuizCreatingPageStore } from './store';

export type QuizCreatingPageProps = {
  pin: string;
  onSaveClick: (pin: string) => void;
};

export const QuizCreatingPage = observer(function QuizCreatingPage() {
  const store = useLocalStore(() => new QuizCreatingPageStore());

  return (
    <div className={style.main}>
      <div className={style.quizName}>
        <input className={style.quizInput} placeholder="Название викторины" />
        <Button className={style.quizButton}>Сохранить</Button>
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
                  selected={item.selected}
                  onClick={store.handleItemClick}
                />
              ))}
              <AddButton onClick={() => console.log('add button click')} disabled={false} />
            </Scrollbars>
          </div>
        </div>
        <div className={style.questionContainer}>
          <QuestionHead />
          <Preview />
          <div className={style.selectButtonsWrap}>
            <div className={style.selectButtonsGrid}>
              <div className={style.selectButtonsInner}>
                {/* {new Array(4).fill(null).map((item) => (
                  <div key={item.variant} className={style.selectButton}>
                    <SelectButton
                      variant={item.variant}
                      value={item.value}
                      color={item.color as 'blue' | 'green' | 'orange' | 'purple'}
                      selected={item.selected}
                      editable={item.editable}
                      disabled={item.disabled}
                      onChange={item.onChange}
                      onClick={item.onClick}
                    />
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
