import React, { ComponentProps, useMemo } from 'react';
import { PdfAnnotationObject, PdfPageObject, Rotation } from '@unionpdf/models';
import './annotation.css';
import { calculateRectStyle } from '../helpers/annotation';
import classNames from 'classnames';

export interface PdfPageAnnotationProps extends ComponentProps<'div'> {
  page: PdfPageObject;
  annotation: PdfAnnotationObject;
  scaleFactor: number;
  rotation: Rotation;
}

export function PdfPageAnnotation(props: PdfPageAnnotationProps) {
  const {
    page,
    annotation,
    scaleFactor,
    rotation,
    children,
    className,
    style: styleProp,
    ...rest
  } = props;

  const style = useMemo(() => {
    return {
      ...styleProp,
      ...calculateRectStyle(annotation.rect, scaleFactor, rotation),
    };
  }, [annotation, rotation, scaleFactor, styleProp]);

  return (
    <div
      style={style}
      data-subtype={annotation.type}
      className={classNames('pdf__annotation', className)}
      data-page-index={page.index}
      {...rest}
    >
      {children}
    </div>
  );
}