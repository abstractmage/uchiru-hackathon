import React from 'react';
import { Button } from '~/components/Button';
import style from './index.module.scss';
import { ReactComponent as PlusSVG } from './svg/Plus.svg';

export type AddButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const AddButton: React.FC<AddButtonProps> = (props) => {
  const { onClick, disabled } = props;

  return (
    <div className={style.main}>
      <Button className={style.button} onClick={onClick} disabled={disabled}>
        <div className={style.plus}>
          <PlusSVG />
        </div>
        <div className={style.text}>Добавить</div>
      </Button>
    </div>
  );
};
