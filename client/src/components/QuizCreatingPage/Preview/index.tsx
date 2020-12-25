import React from 'react';
import cn from 'classnames';
import { toBase64 } from '~/shared/helpers/to-base-64';
import style from './index.module.scss';
import { ReactComponent as CloudSVG } from './svg/Cloud.svg';

export type PreviewProps = {
  file?: string;
  onSelectFile?: (obj: { name: string; base64: string } | null) => void;
};

export const Preview: React.FC<PreviewProps> = (props) => {
  const { file, onSelectFile } = props;

  const handleFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files && onSelectFile) {
        const f = e.currentTarget.files[0];

        if (!f) {
          onSelectFile(null);
          return;
        }

        const base64 = await toBase64(f);

        if (!['jpeg', 'jpg', 'png'].includes(f.name.split('.').pop() || '')) {
          return;
        }

        if (base64 === null) return;

        onSelectFile({ name: f.name, base64 });
      }
    },
    [onSelectFile],
  );

  const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('drop');
  }, []);

  return (
    <div
      className={cn(style.main, file && style.main_fileSelected)}
      onDrop={handleDrop}
      style={{ backgroundImage: `url(${file})` }}
    >
      <div className={style.cloud}>
        <CloudSVG />
      </div>
      <div className={style.hint}>Перетащите изображение сюда</div>
      <div className={style.link}>
        Загрузить с компьютера
        <input type="file" onChange={handleFileSelect} />
      </div>
    </div>
  );
};
