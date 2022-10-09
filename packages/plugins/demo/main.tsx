import React, {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  PdfEngine,
  PdfPageObject,
  PdfSource,
  PdfDocumentObject,
  PdfLinkAnnoObject,
  Rotation,
  swap,
} from '@unionpdf/models';
import * as ReactDOM from 'react-dom/client';
import {
  PdfApplicationMode,
  PdfEngineContextProvider,
  PdfDocument,
  PdfNavigator,
  ThemeContextProvider,
  PdfNavigatorContextProvider,
  PdfApplication,
} from '@unionpdf/core';
import { PdfThumbnails } from '../src/thumbnails';
import { PdfPageContentProps, PdfPages } from '../src/pages';
import { PdfOutlines } from '../src/outlines';
import { PdfPageCanvas } from '../src/layers/canvas';
import {
  PdfPageAnnotationComponentProps,
  PdfPageAnnotations,
} from '../src/layers/annotations';
import { PdfPageAnnotation } from '../src/annotations/annotation';

function PdfPageNumber(props: { page: PdfPageObject }) {
  const { page } = props;

  return (
    <div
      className="pdf__page__number"
      style={{
        color: 'white',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {page.index + 1}
    </div>
  );
}

export interface PdfPageLinkAnnoTestProps
  extends PdfPageAnnotationComponentProps<'link'> {}

function PdfPageLinkAnnoTest(props: PdfPageLinkAnnoTestProps) {
  const { annotation, scaleFactor, rotation } = props;

  return (
    <PdfPageAnnotation
      annotation={annotation}
      scaleFactor={scaleFactor}
      rotation={rotation}
    >
      <p>{annotation.text}</p>
    </PdfPageAnnotation>
  );
}

const components = {
  link: PdfPageLinkAnnoTest,
};

function PdfPageContent(props: PdfPageContentProps) {
  return (
    <>
      <PdfPageCanvas {...props} />
      <PdfPageAnnotations
        {...props}
        components={components}
      ></PdfPageAnnotations>
      <PdfPageNumber {...props} />
    </>
  );
}
const rgbValues = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255],
  [127, 0, 0, 255],
  [0, 128, 0, 255],
  [0, 0, 127, 255],
  [63, 0, 0, 255],
  [0, 63, 0, 255],
  [0, 0, 63, 255],
];

function createMockPdfEngine(engine?: Partial<PdfEngine>) {
  const pageCount = 10;
  const pageWidth = 640;
  const pageHeight = 480;
  const pages: PdfPageObject[] = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push({
      index: i,
      size: {
        width: pageWidth,
        height: pageHeight,
      },
    });
  }
  return {
    open: async (url: PdfSource) => {
      return {
        pageCount: pageCount,
        size: {
          width: pageWidth,
          height: pageHeight,
        },
        pages: pages,
      };
    },
    getOutlines: () => {
      return {
        entries: [
          {
            text: 'Page 1',
            pageIndex: 0,
          },
          {
            text: 'Page 2',
            pageIndex: 1,
            children: [
              {
                text: 'Page 3',
                pageIndex: 2,
              },
            ],
          },
        ],
      };
    },
    renderPage: (
      page: PdfPageObject,
      scaleFactor: number,
      rotation: Rotation
    ) => {
      const pageSize = rotation % 2 === 0 ? page.size : swap(page.size);
      const imageSize = {
        width: Math.ceil(pageSize.width * scaleFactor),
        height: Math.ceil(pageSize.height * scaleFactor),
      };
      const pixelCount = imageSize.width * imageSize.height;
      const array = new Uint8ClampedArray(pixelCount * 4);
      const rgbValue = rgbValues[page.index % 9];
      const alphaValue = 255;
      for (let i = 0; i < pixelCount; i++) {
        for (let j = 0; j < 3; j++) {
          const index = i * 4 + j;
          array[index] = rgbValue[j];
        }
        array[i * 4 + 3] = alphaValue;
      }

      return new ImageData(array, imageSize.width, imageSize.height);
    },
    renderThumbnail: (page: PdfPageObject) => {
      const thumbnailWidth = page.size.width / 4;
      const thumbnailHeight = page.size.height / 4;
      const pixelCount = thumbnailWidth * thumbnailHeight;
      const array = new Uint8ClampedArray(pixelCount * 4);
      const rgbValue = rgbValues[page.index % rgbValues.length];
      for (let i = 0; i < pixelCount; i++) {
        for (let j = 0; j < 4; j++) {
          const index = i * 4 + j;
          array[index] = rgbValue[j];
        }
      }

      return new ImageData(array, thumbnailWidth, thumbnailHeight);
    },
    getPageAnnotations: (page: PdfPageObject) => {
      const pdfLinkAnnoObject: PdfLinkAnnoObject = {
        type: 'link',
        target: {
          url: 'https://localhost',
        },
        text: 'localhost',
        rect: {
          origin: {
            x: 0,
            y: 0,
          },
          size: {
            width: 100,
            height: 50,
          },
        },
      };

      return [pdfLinkAnnoObject];
    },
    close: async (pdf: PdfDocumentObject) => {},
    ...engine,
  };
}

function App() {
  const [mode, setMode] = useState(PdfApplicationMode.Read);

  const toggleMode = useCallback(() => {
    setMode((mode) => {
      return mode === PdfApplicationMode.Read
        ? PdfApplicationMode.Edit
        : PdfApplicationMode.Read;
    });
  }, [setMode]);

  const [pdfNavigator] = useState(() => {
    return new PdfNavigator();
  });
  const engine = createMockPdfEngine();
  const pdfAppElemRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 640, height: 480 });

  useLayoutEffect(() => {
    const pdfAppElem = pdfAppElemRef.current;
    if (pdfAppElem) {
      const style = getComputedStyle(pdfAppElem);
      console.log(style.height, style.width);
    }
  }, [pdfAppElemRef.current]);

  const [outlinesIsVisible, setOutlinesIsVisible] = useState(false);
  const toggleOutlinesIsVisible = useCallback(() => {
    setOutlinesIsVisible((isVisible) => {
      return !isVisible;
    });
  }, [setOutlinesIsVisible]);

  const [thumbnailsIsVisible, setThumbnailsIsVisible] = useState(false);
  const toggleThumbnailsIsVisible = useCallback(() => {
    setThumbnailsIsVisible((isVisible) => {
      return !isVisible;
    });
  }, [setThumbnailsIsVisible]);

  const [rotation, setRotation] = useState<Rotation>(0);
  const rotate = useCallback(() => {
    setRotation((rotation) => {
      return ((rotation + 1) % 4) as Rotation;
    });
  }, [setRotation]);

  const [scaleFactor, setScaleFactor] = useState(1.0);
  const updateScaleFactor = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setScaleFactor(Number(evt.target.value));
    },
    [setScaleFactor]
  );

  return (
    <div className="App">
      <PdfApplication mode={mode}>
        <div className="pdf__app__toolbar">
          <button onClick={toggleThumbnailsIsVisible}>Thumbnails</button>
          <button onClick={toggleOutlinesIsVisible}>Outlines</button>
          <button onClick={rotate}>Rotate</button>
          <input
            type="number"
            min="0.5"
            max="3.0"
            step="0.1"
            value={scaleFactor}
            onChange={updateScaleFactor}
          />
          <div className="fill"></div>
          <button onClick={toggleMode}>
            {mode === PdfApplicationMode.Read ? 'Edit' : 'Save'}
          </button>
        </div>
        <ThemeContextProvider
          theme={{
            background: 'blue',
          }}
        >
          <PdfEngineContextProvider engine={engine}>
            <PdfDocument
              source="https://localhost"
              onOpenSuccess={() => {}}
              onOpenFailure={() => {}}
            >
              <PdfNavigatorContextProvider navigator={pdfNavigator}>
                <PdfPages
                  visibleRange={[-1, 1]}
                  viewport={viewport}
                  scaleFactor={scaleFactor}
                  rotation={rotation}
                  content={PdfPageContent}
                />
                {thumbnailsIsVisible ? (
                  <PdfThumbnails
                    layout={{ direction: 'vertical', itemsCount: 5 }}
                    size={{ width: 100, height: 100 }}
                  />
                ) : null}
                {outlinesIsVisible ? <PdfOutlines /> : null}
              </PdfNavigatorContextProvider>
            </PdfDocument>
          </PdfEngineContextProvider>
        </ThemeContextProvider>
      </PdfApplication>
    </div>
  );
}

const appElem = document.querySelector('#root') as HTMLElement;
const root = ReactDOM.createRoot(appElem);
root.render(<App />);
