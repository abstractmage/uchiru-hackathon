import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { Button } from '~/components/Button';
import { useFunction } from '~/shared/hooks/use-function';
import style from './index.module.scss';

export type NicknamePanelProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  onBeginClick?: (nickname: string) => void;
};

export const NicknamePanel: React.FC<NicknamePanelProps> = (props) => {
  const { shown, onBeginClick, onShowingEnd } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [nickname, setNickname] = React.useState('');
  const handleShowingEnd = useFunction(onShowingEnd);

  const handleBeginClick = React.useCallback(() => {
    if (onBeginClick) onBeginClick(nickname);
  }, [onBeginClick, nickname]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: val } = e.target;

    setNickname(val);
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
            <div className={style.label}>Введи своё имя</div>
            <div className={style.inputItem}>
              <input type="text" className={style.input} value={nickname} onChange={handleChange} />
            </div>
            <Button className={style.button} color="white" onClick={handleBeginClick}>
              Начать
            </Button>
          </div>
        </div>
      )}
    </Transition>
  );
};
