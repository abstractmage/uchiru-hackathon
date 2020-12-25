import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';

export type QuestionItemProps = {
  index: number;
  title: string;
  preview?: string | ArrayBuffer;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (index: number) => void;
};

export const QuestionItem: React.FC<QuestionItemProps> = (props) => {
  const { preview, title, selected, disabled, index, onClick } = props;

  const handleClick = React.useCallback(() => {
    if (onClick) onClick(index);
  }, [index, onClick]);

  return (
    <div
      className={cn(style.main, selected && style.main_selected)}
      onClick={disabled ? undefined : handleClick}
    >
      <div className={style.preview} style={{ backgroundImage: preview && `url(${preview})` }}>
        {!preview && <div className={style.previewText}>{title}</div>}
      </div>
      <div className={style.number}>{`Вопрос ${index + 1}`}</div>
    </div>
  );
};
