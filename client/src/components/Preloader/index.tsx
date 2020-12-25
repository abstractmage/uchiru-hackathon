import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as PreloaderSVG } from './svg/Preloader.svg';

export type PreloaderProps = {
  shown?: boolean;
};

export const Preloader: React.FC<PreloaderProps> = (props) => {
  const { shown } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Transition
      nodeRef={ref}
      in={shown}
      timeout={500}
      onEnter={() => ref.current?.offsetHeight}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.loader}>
            <PreloaderSVG />
          </div>
        </div>
      )}
    </Transition>
  );
};
