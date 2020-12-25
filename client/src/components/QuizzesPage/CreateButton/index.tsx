import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as PlusSVG } from './svg/Plus.svg';

export type CreateButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

export const CreateButton: React.FC<CreateButtonProps> = (props) => {
  const { disabled, onClick } = props;

  return (
    <div
      className={cn(style.main, disabled && style.main_disabled)}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={style.inner}>
        <div className={style.plus}>
          <PlusSVG />
        </div>
        <div className={style.text}>Создать новую викторину</div>
      </div>
    </div>
  );
};
