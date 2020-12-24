import React from 'react';
import cn from 'classnames';
import style from './index.module.scss';

export type ButtonProps = {
  children: React.ReactNode;
  color?: 'green' | 'purple' | 'white';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { children, color, onClick, className, disabled } = props;

  return (
    <div
      className={cn(
        style.main,
        style[`main_color_${color}`],
        disabled && style.main_disabled,
        className,
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </div>
  );
};

Button.defaultProps = {
  color: 'green',
};
