import React from 'react';
import { PdfPageObject, PdfTextAnnoObject, Rotation } from '@unionpdf/models';
import './text.css';
import { PdfPageAnnotationBase } from './annotation';

export interface PdfPageTextAnnotationProps {
  page: PdfPageObject;
  annotation: PdfTextAnnoObject;
  scaleFactor: number;
  rotation: Rotation;
}

export function PdfPageTextAnnotation(props: PdfPageTextAnnotationProps) {
  const { annotation, scaleFactor, rotation } = props;

  return (
    <PdfPageAnnotationBase
      className="pdf__annotation--text"
      annotation={annotation}
      scaleFactor={scaleFactor}
      rotation={rotation}
    >
      <span>{annotation.text}</span>
    </PdfPageAnnotationBase>
  );
}