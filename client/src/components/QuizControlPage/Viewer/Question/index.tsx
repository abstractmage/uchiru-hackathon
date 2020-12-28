/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import { SelectButton } from '~/components/SelectButton';
import style from './index.module.scss';
import { Stats } from '../Stats';
import { QuestionStore } from './store';
import { Timer } from '../Timer';

export type QuestionProps = {
  shown?: boolean;
  onShowingEnd?: () => void;
  onHidingEnd?: () => void;
  number: number;
  text: string;
  image?: string;
  answers: string[];
  result: { stats: number[]; right: number } | null;
  questionRunning?: boolean;
  timer: number;
  onTimerEnd?: () => void;
};

const colors: ('green' | 'blue' | 'orange' | 'purple')[] = ['green', 'blue', 'orange', 'purple'];

export const Question: React.FC<QuestionProps> = observer(function Question(props) {
  const {
    shown,
    onShowingEnd,
    onHidingEnd,
    number,
    text,
    image,
    answers,
    result,
    questionRunning,
    timer,
    onTimerEnd,
  } = props;
  const store = useLocalObservable(() => new QuestionStore());
  const {
    translated: [translated],
    numberShown: [numberShown],
    titleShown: [titleShown, titleShowing],
    mediaOpened: [mediaOpened],
    imageShown: [imageShown],
    statsShown: [statsShown],
    statsCalculated: [statsCalculated],
    variantsShown: [variantsShown],
  } = store;
  const ref = React.useRef<HTMLDivElement>(null);
  const numberRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);
  const variantsRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    console.log(store);
    return store.cancel;
  }, [store]);

  const handleTranslatingEnter = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (ref.current) ref.current.offsetHeight;
  }, []);

  const handleTranslatingEnd = React.useCallback(() => {
    store.handleStateChangingEnd('translated');
  }, [store]);

  const handleNumberShowingEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === numberRef.current) {
        store.handleStateChangingEnd('numberShown');
      }
    },
    [store],
  );

  const handleTitleShowingEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === titleRef.current) {
        store.handleStateChangingEnd('titleShown');
      }
    },
    [store],
  );

  const handleImageShowingEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === imageRef.current) {
        store.handleStateChangingEnd('imageShown');
      }
    },
    [store],
  );

  const handleMediaOpeningEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (mediaRef.current === e.target) {
        store.handleStateChangingEnd('mediaOpened');
      }
    },
    [store],
  );

  const handleStatsShowingEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === statsRef.current) {
        store.handleStateChangingEnd('statsShown');
      }
    },
    [store],
  );

  const handleVariantsShowingEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target === variantsRef.current) {
        store.handleStateChangingEnd('variantsShown');
      }
    },
    [store],
  );

  const handleStatsCalculatingEnd = React.useCallback(() => {
    store.handleStateChangingEnd('statsCalculated');
  }, [store]);

  const handleTimerShowingEnd = React.useCallback(() => {
    console.log('timer shown');
  }, []);

  const handleTimerEnd = React.useCallback(() => {
    if (onTimerEnd) onTimerEnd();
  }, [onTimerEnd]);

  React.useEffect(() => {
    if (mounted.current === false) {
      mounted.current = true;
      return;
    }

    if (shown) {
      store
        .show(!!image)
        .then(onShowingEnd)
        .catch(() => {});
    } else {
      store
        .hide()
        .then(onHidingEnd)
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  React.useEffect(() => {
    if (result) {
      store.showStats(!!image).catch(() => {});
    }
  }, [image, result, store]);

  return (
    <Transition
      nodeRef={ref}
      in={translated}
      onEnter={handleTranslatingEnter}
      onEntered={handleTranslatingEnd}
      onExited={handleTranslatingEnd}
      timeout={500}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <div ref={ref} className={cn(style.main, style[`main_${state}`])}>
          <div className={style.inner}>
            <div
              ref={titleRef}
              className={cn(style.title, titleShown && style.title_shown)}
              onTransitionEnd={handleTitleShowingEnd}
            >
              <div
                ref={numberRef}
                className={cn(style.number, !numberShown && style.number_hidden)}
                onTransitionEnd={handleNumberShowingEnd}
              >{`Вопрос ${number}`}</div>
              <div className={style.titleInner}>{text}</div>
            </div>
            <div
              ref={mediaRef}
              className={cn(style.media, mediaOpened && style.media_opened)}
              onTransitionEnd={handleMediaOpeningEnd}
            >
              <div className={style.mediaInner}>
                <div
                  ref={imageRef}
                  style={{ backgroundImage: image && `url(${image})` }}
                  className={cn(style.image, imageShown && style.image_shown)}
                  onTransitionEnd={handleImageShowingEnd}
                />
                <div
                  ref={statsRef}
                  className={cn(style.stats, statsShown && style.stats_shown)}
                  onTransitionEnd={handleStatsShowingEnd}
                >
                  <Stats
                    values={statsCalculated && result && result.stats ? result.stats : [0, 0, 0, 0]}
                    onCalculated={handleStatsCalculatingEnd}
                  />
                </div>
              </div>
            </div>
            <div
              ref={variantsRef}
              className={cn(style.variants, variantsShown && style.variants_shown)}
              onTransitionEnd={handleVariantsShowingEnd}
            >
              <div className={style.variantsInner}>
                {answers.map((answer, i) => (
                  <div
                    key={i}
                    className={cn(
                      style.variant,
                      result && result.right !== i && style.variant_wrong,
                    )}
                  >
                    <SelectButton variant={`${i + 1}`} value={answer} color={colors[i]} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Timer
            shown={titleShown && !result}
            onShowingEnd={handleTimerShowingEnd}
            value={questionRunning ? timer : null}
            onTimerEnd={handleTimerEnd}
          />
        </div>
      )}
    </Transition>
  );
});
