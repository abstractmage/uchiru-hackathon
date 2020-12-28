import React from 'react';
import cn from 'classnames';
import { Transition } from 'react-transition-group';
import style from './index.module.scss';
import { ReactComponent as EmptyRadioSVG } from './svg/EmptyRadio.svg';
import { ReactComponent as CheckMarkSVG } from './svg/CheckMark.svg';

export type SelectButtonProps = {
  classNames?: {
    main?: string;
    variant?: string;
    content?: string;
    contentInner?: string;
  };
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
  const {
    classNames,
    variant,
    value,
    color,
    selected,
    editable,
    onChange,
    onClick,
    disabled,
  } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);

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

  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);

  return (
    <div
      className={cn(
        style.main,
        style[`main_color_${color}`],
        disabled && style.main_disabled,
        editable && style.main_editable,
        focused && style.main_focused,
        classNames?.main,
      )}
      onClick={handleClick}
    >
      <div className={cn(style.variant, classNames?.variant)}>{variant}</div>
      <div className={cn(style.content, classNames?.content)}>
        {editable ? (
          <input
            className={cn(style.contentInner, classNames?.contentInner)}
            onChange={handleChange}
            value={value}
            placeholder="Введите ответ"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <div className={cn(style.contentInner, classNames?.contentInner)}>{value}</div>
        )}
      </div>
      {editable && (
        <div className={style.radioWrapper}>
          <div className={style.radio}>
            <div className={cn(style.radioInner)}>
              <EmptyRadioSVG />
            </div>
            <Transition nodeRef={ref} in={selected} timeout={200}>
              {(transitionState) => (
                <div
                  ref={ref}
                  className={cn(style.radioInner, style[`radioInner_${transitionState}`])}
                >
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
