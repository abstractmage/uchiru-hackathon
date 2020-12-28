/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { Button } from '~/components/Button';
import style from './index.module.scss';
import { useFunction } from '~/shared/hooks/use-function';

export type PinPanelProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  onEnterClick?: (pin: number) => void;
};

export const PinPanel: React.FC<PinPanelProps> = (props) => {
  const { shown, onShowingEnd, onEnterClick } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [pinValues, setPinValues] = React.useState(['0', '0', '0', '0', '0', '0']);

  const handleShowingEnd = React.useCallback(() => {
    setPinValues(['0', '0', '0', '0', '0', '0']);
    if (onShowingEnd) onShowingEnd();
  }, [onShowingEnd]);

  const handleEnterClick = React.useCallback(() => {
    if (onEnterClick) onEnterClick(+pinValues.join(''));
  }, [onEnterClick, pinValues]);

  const createHandleInput = React.useCallback((index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { data } = e.nativeEvent as any;

      if (data === null) return;

      if (data.match(/\D+/g)?.length) return;

      setPinValues((v) => [...v.map((val, i) => (i === index ? data : val))]);
    };
  }, []);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      onEntered={handleShowingEnd}
      onExited={handleShowingEnd}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.inner}>
            <div className={style.label}>Введи ПИН-код викторины</div>
            <div className={style.inputsWrapper}>
              {pinValues.map((v, i) => (
                <div key={i} className={style.inputItem}>
                  <input
                    type="text"
                    className={style.input}
                    value={v}
                    onChange={createHandleInput(i)}
                  />
                </div>
              ))}
            </div>
            <Button className={style.button} color="white" onClick={handleEnterClick}>
              Войти
            </Button>
          </div>
        </div>
      )}
    </Transition>
  );
};
