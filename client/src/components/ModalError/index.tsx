import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as AlertSVG } from './svg/Alert.svg';
import { Button } from '../Button';
import { useFunction } from '~/shared/hooks/use-function';

export type ModalErrorProps = {
  shown?: boolean;
  message?: string;
  onShowingEnd?: () => void;
  onCloseClick?: () => void;
};

export const ModalError: React.FC<ModalErrorProps> = (props) => {
  const { shown, message, onShowingEnd, onCloseClick } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const handleShowingEnd = useFunction(onShowingEnd);
  const handleCloseClick = useFunction(onCloseClick);

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
          <div className={style.overlay} />
          <div className={style.panel}>
            <div className={style.alert}>
              <AlertSVG />
            </div>
            <div className={style.message}>{message}</div>
            <div className={style.buttonWrapper}>
              <Button className={style.button} color="purple" onClick={handleCloseClick}>
                Понятно
              </Button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};
