import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as CrossSVG } from './svg/Cross.svg';

export type QuestionItemProps = {
  index: number;
  title: string;
  preview?: string | ArrayBuffer;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (index: number) => void;
  onCrossClick?: (index: number) => void;
};

export const QuestionItem: React.FC<QuestionItemProps> = (props) => {
  const { preview, title, selected, disabled, index, onClick, onCrossClick } = props;

  const handleClick = React.useCallback(() => {
    if (onClick) onClick(index);
  }, [index, onClick]);

  const handleCrossClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      if (onCrossClick) onCrossClick(index);
    },
    [index, onCrossClick],
  );

  return (
    <div
      className={cn(style.main, selected && style.main_selected)}
      onClick={disabled ? undefined : handleClick}
    >
      <div className={style.preview} style={{ backgroundImage: preview && `url(${preview})` }}>
        <div className={style.button} onClick={handleCrossClick}>
          <CrossSVG />
        </div>
        {!preview && <div className={style.previewText}>{title}</div>}
      </div>
      <div className={style.number}>{`Вопрос ${index + 1}`}</div>
    </div>
  );
};
