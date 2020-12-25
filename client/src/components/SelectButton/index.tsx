import React from 'react';
import cn from 'classnames';
import { Transition } from 'react-transition-group';
import style from './index.module.scss';
import { ReactComponent as EmptyRadioSVG } from './svg/EmptyRadio.svg';
import { ReactComponent as CheckMarkSVG } from './svg/CheckMark.svg';

export type SelectButtonProps = {
  variant: string;
  value?: string;
  color?: 'green' | 'blue' | 'orange' | 'purple';
  selected?: boolean;
  editable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onClick?: (variant: string) => void;
};

export const SelectButton: React.FC<SelectButtonProps> = (props) => {
  const { variant, value, color, selected, editable, onChange, onClick, disabled } = props;
  const ref = React.useRef<Transition<HTMLElement | undefined> | null>();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange && !disabled) onChange(e.currentTarget.value);
    },
    [disabled, onChange],
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target instanceof HTMLInputElement) return;

      if (onClick && !disabled) onClick(variant);
    },
    [disabled, onClick, variant],
  );

  return (
    <div
      className={cn(style.main, style[`main_color_${color}`], disabled && style.main_disabled)}
      onClick={handleClick}
    >
      <div className={style.variant}>{variant}</div>
      <div className={style.content}>
        {editable ? (
          <input
            className={style.contentInner}
            onChange={handleChange}
            value={value}
            placeholder="Введите ответ"
          />
        ) : (
          <div className={style.contentInner}>{value}</div>
        )}
      </div>
      {editable && (
        <div className={style.radioWrapper}>
          <div className={style.radio}>
            <div className={cn(style.radioInner)}>
              <EmptyRadioSVG />
            </div>
            <Transition ref={ref as any} in={selected} timeout={200}>
              {(transitionState) => (
                <div className={cn(style.radioInner, style[`radioInner_${transitionState}`])}>
                  <CheckMarkSVG />
                </div>
              )}
            </Transition>
          </div>
        </div>
      )}
    </div>
  );
};

SelectButton.defaultProps = {
  color: 'green',
};
