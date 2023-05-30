import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { PdfEditorExtractor } from './extractor';
import { PdfApplicationContextProvider, PdfApplicationMode } from '../../core';
import { intersectionObserver } from '@shopify/jest-dom-mocks';

describe('PdfEditorExtractor', () => {
  test('should render pdf editor extractor', async () => {
    intersectionObserver.mock();
    const result = render(
      <PdfApplicationContextProvider initialMode={PdfApplicationMode.Edit}>
        <PdfEditorExtractor />
      </PdfApplicationContextProvider>
    );

    expect(document.querySelectorAll('.pdf__editor__extractor').length).toEqual(
      1
    );

    result.unmount();
  });
});
