import React from 'react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import style from './index.module.scss';
import { ReactComponent as PreloaderSVG } from './svg/Preloader.svg';

export type PreloaderProps = {
  shown?: boolean;
  visibility?: boolean;
};

export const Preloader: React.FC<PreloaderProps> = (props) => {
  const { shown, visibility } = props;
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
        <div
          ref={ref}
          className={cn(style.main, style[`main_${state}`], visibility && style.main_visibility)}
        >
          <div className={style.loader}>
            <PreloaderSVG />
          </div>
        </div>
      )}
    </Transition>
  );
};
