import React from 'react';
import cn from 'classnames';
import { toBase64 } from '~/shared/helpers/to-base-64';
import style from './index.module.scss';
import { ReactComponent as CloudSVG } from './svg/Cloud.svg';
import { ReactComponent as CrossSVG } from './svg/Cross.svg';

export type PreviewProps = {
  file?: string;
  onSelectFile?: (obj: { name: string; base64: string } | null) => void;
};

export const Preview: React.FC<PreviewProps> = (props) => {
  const { file, onSelectFile } = props;

  const setSelectedFile = React.useCallback(
    async (f: File) => {
      if (!onSelectFile) return;

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
    },
    [onSelectFile],
  );

  const handleFileSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files) {
        const f = e.currentTarget.files[0];
        setSelectedFile(f);
      }
    },
    [setSelectedFile],
  );

  const handleButtonClick = React.useCallback(() => {
    if (onSelectFile && file) onSelectFile(null);
  }, [file, onSelectFile]);

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!e.dataTransfer.files) return;

      const f = e.dataTransfer.files[0];
      setSelectedFile(f);
    },
    [setSelectedFile],
  );

  const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn(style.main, file && style.main_fileSelected)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ backgroundImage: `url(${file})` }}
    >
      <div className={cn(style.button, file && style.button_shown)} onClick={handleButtonClick}>
        <CrossSVG />
      </div>
      {!file && (
        <div className={style.inner}>
          <div className={style.cloud}>
            <CloudSVG />
          </div>
          <div className={style.hint}>Перетащите изображение сюда</div>
          <div className={style.link}>
            Загрузить с компьютера
            <input type="file" onChange={handleFileSelect} />
          </div>
        </div>
      )}
    </div>
  );
};
