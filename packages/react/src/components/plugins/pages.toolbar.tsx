import { PdfZoomMode, Rotation } from '@unionpdf/models';
import React, { ChangeEvent, ComponentProps, useCallback } from 'react';
import { useUIComponents, useUIStrings } from '../../ui/ui.context';
import './pages.toolbar.css';
import { ErrorBoundary } from '../../ui/errorboundary';
import { usePdfDocument } from '../../core/document.context';
import { usePdfNavigator } from '../../core/navigator.context';
import classNames from 'classnames';

export const PDF_NAVIGATOR_SOURCE_PAGES_TOOLBAR = 'PdfToolbarPagesItemGroup';

export interface PdfToolbarPagesItemGroupProps extends ComponentProps<'div'> {
  scaleFactor: number;
  changeScaleFactor: (evt: ChangeEvent<HTMLInputElement>) => void;
  rotation: Rotation;
  changeRotation: (evt: ChangeEvent<HTMLSelectElement>) => void;
  toggleIsSearchPanelOpened: () => void;
}

export function PdfToolbarPagesItemGroup(props: PdfToolbarPagesItemGroupProps) {
  const {
    className,
    scaleFactor,
    changeScaleFactor,
    rotation,
    changeRotation,
    toggleIsSearchPanelOpened,
    children,
    ...rest
  } = props;
  const strings = useUIStrings();
  const {
    ButtonComponent,
    ToolbarItemGroupComponent,
    InputComponent,
    SelectComponent,
  } = useUIComponents();

  const { doc } = usePdfDocument();
  const { currPageIndex, gotoPage } = usePdfNavigator();

  const navigate = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const pageIndex = parseInt(evt.target.value, 10);
      if (!isNaN(pageIndex)) {
        gotoPage(
          {
            destination: {
              pageIndex: pageIndex - 1,
              zoom: {
                mode: PdfZoomMode.Unknown,
              },
              view: [],
            },
          },
          PDF_NAVIGATOR_SOURCE_PAGES_TOOLBAR
        );
      }
    },
    [gotoPage]
  );

  const rotationOptions = [
    {
      label: strings.rotate0Deg,
      value: '0',
    },
    {
      label: strings.rotate90Deg,
      value: '1',
    },
    {
      label: strings.rotate180Deg,
      value: '2',
    },
    {
      label: strings.rotate270Deg,
      value: '3',
    },
  ];

  return (
    <ErrorBoundary>
      <ToolbarItemGroupComponent
        className={classNames('pdf__toolbar__item__group', className)}
        {...rest}
      >
        <SelectComponent
          className="pdf__toolbar__select pdf__toolbar__select--rotation"
          value={rotation}
          onChange={changeRotation}
          options={rotationOptions}
        />
        <InputComponent
          className="pdf__toolbar__input pdf__toolbar__input--scalefactor"
          type="number"
          min="0.25"
          max="5"
          step="0.25"
          value={scaleFactor}
          onChange={changeScaleFactor}
        />
        <InputComponent
          className="pdf__toolbar__input pdf__toolbar__input--page"
          value={currPageIndex + 1}
          min="1"
          max={doc?.pageCount}
          type="number"
          onChange={navigate}
        />
        <ButtonComponent onClick={toggleIsSearchPanelOpened}>
          {strings.search}
        </ButtonComponent>
      </ToolbarItemGroupComponent>
    </ErrorBoundary>
  );
}
