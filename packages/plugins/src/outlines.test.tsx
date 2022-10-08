import '@testing-library/jest-dom';
import React from 'react';
import { act, render } from '@testing-library/react';
import { PdfDocument, PdfEngineContextProvider } from '@unionpdf/core';
import { createMockPdfDocument, createMockPdfEngine } from '@unionpdf/mocks';
import { PdfOutlines } from './outlines';

describe('PdfOutline', () => {
  test('should render pdf outline', async () => {
    const pdf = createMockPdfDocument();
    const engine = createMockPdfEngine();
    const result = render(
      <PdfEngineContextProvider engine={engine}>
        <PdfDocument
          source="https://localhost"
          onOpenSuccess={jest.fn()}
          onOpenFailure={jest.fn()}
        >
          <PdfOutlines />
        </PdfDocument>
      </PdfEngineContextProvider>
    );

    await act(async () => {
      engine.openDefer.resolve(pdf);
      await engine.openDefer.promise;
    });

    expect(document.querySelector('.pdf__outlines')).toBeDefined();
    expect(document.querySelectorAll('.pdf__outlines__entry').length).toEqual(
      2
    );

    result.unmount();
  });
});
