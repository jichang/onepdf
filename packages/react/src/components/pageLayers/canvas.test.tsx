import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import {
  createMockPdfDocument,
  createMockPdfEngine,
  createMockPdfFile,
} from '@unionpdf/engines';
import { PdfPages } from '../plugins/pages';
import { PdfPageCanvasLayer } from './canvas';
import {
  PdfTaskHelper,
  PdfDocumentObject,
  PdfEngineError,
  PdfErrorReason,
  Task,
} from '@unionpdf/models';
import { PdfEngineContextProvider } from '../../core/engine.context';
import { PdfDocument } from '../../core/document';
import { intersectionObserver } from '../../mocks/intersectionObserver';

describe('PdfPageCanvasLayer', () => {
  test('should render pdf canvas', async () => {
    intersectionObserver.mock();
    const pdf = createMockPdfDocument();
    const openDocumentTask = new Task<PdfDocumentObject, PdfErrorReason>();
    const closeDocumentTask = PdfTaskHelper.resolve<boolean>(true);
    const engine = createMockPdfEngine({
      openDocument: jest.fn(() => {
        return openDocumentTask;
      }),
      closeDocument: jest.fn(() => {
        return closeDocumentTask;
      }),
    });
    const result = render(
      <PdfEngineContextProvider engine={engine}>
        <PdfDocument
          file={createMockPdfFile()}
          password=""
          onOpenSuccess={jest.fn()}
          onOpenFailure={jest.fn()}
        >
          <PdfPages pageGap={8} pageLayers={[PdfPageCanvasLayer]} />
        </PdfDocument>
      </PdfEngineContextProvider>,
    );

    act(() => {
      openDocumentTask.resolve(pdf);
    });

    act(() => {
      intersectionObserver.simulate([{ isIntersecting: true }]);
    });

    expect(
      document.querySelectorAll('.pdf__page__layer--canvas').length,
    ).toEqual(10);

    result.unmount();
    intersectionObserver.restore();
  });
});
