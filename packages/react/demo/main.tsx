import React, {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  PdfPageObject,
  Rotation,
  PdfTextAnnoObject,
  PdfAnnotationSubtype,
  ConsoleLogger,
  Logger,
  PdfZoomMode,
  PdfEngine,
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
  PdfMetadata,
  PdfToolbar,
  PdfPagesToolbar,
  PdfToolbarDocItemGroup,
  PdfThumbnails,
  PdfPageContentComponentProps,
  PdfPages,
  PdfPageText,
  PdfPageCanvas,
  PdfPageAnnotationComponentProps,
  PdfPageAnnotations,
  PdfPageAnnotationBase,
  PdfPageLinkAnnotation,
  PdfPageWidgetAnnotation,
  PdfBookmarks,
  LoggerContextProvider,
  PdfToolbarNavigationtemGroup,
  PdfSearchPanel,
  PdfAttachments,
} from '../src/index';
import {
  createPdfiumModule,
  PdfiumEngine,
  pdfiumWasm,
} from '@unionpdf/engines';

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

function PdfPageTextAnnotationCustomize(
  props: PdfPageAnnotationComponentProps<PdfTextAnnoObject>
) {
  const { page, annotation, scaleFactor, rotation } = props;

  return (
    <PdfPageAnnotationBase
      page={page}
      annotation={annotation}
      scaleFactor={scaleFactor}
      rotation={rotation}
    >
      <p>{annotation.text}</p>
    </PdfPageAnnotationBase>
  );
}

function PdfPageAnnotation(props: PdfPageAnnotationComponentProps) {
  const { page, annotation, rotation, scaleFactor } = props;
  switch (annotation.type) {
    case PdfAnnotationSubtype.LINK:
      return (
        <PdfPageLinkAnnotation
          page={page}
          annotation={annotation}
          rotation={rotation}
          scaleFactor={scaleFactor}
        />
      );
    case PdfAnnotationSubtype.TEXT:
      return (
        <PdfPageTextAnnotationCustomize
          page={page}
          annotation={annotation}
          rotation={rotation}
          scaleFactor={scaleFactor}
        />
      );
    case PdfAnnotationSubtype.WIDGET:
      return (
        <PdfPageWidgetAnnotation
          page={page}
          annotation={annotation}
          rotation={rotation}
          scaleFactor={scaleFactor}
        />
      );
    default:
      return <PdfPageAnnotationBase {...props} />;
  }
}

function PdfPageContent(props: PdfPageContentComponentProps) {
  return (
    <>
      <PdfPageCanvas {...props} />
      <PdfPageText {...props} />
      <PdfPageAnnotations {...props} annotationComponent={PdfPageAnnotation} />
      <PdfPageNumber {...props} />
    </>
  );
}

export interface AppProps {
  logger: Logger;
  engine: PdfEngine;
}

function App(props: AppProps) {
  const { logger, engine } = props;
  const [mode, setMode] = useState(PdfApplicationMode.Read);

  const toggleMode = useCallback(() => {
    setMode((mode: PdfApplicationMode) => {
      return mode === PdfApplicationMode.Read
        ? PdfApplicationMode.Edit
        : PdfApplicationMode.Read;
    });
  }, [setMode]);

  const [pdfNavigator] = useState(() => {
    return new PdfNavigator(logger);
  });
  const pdfAppElemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pdfAppElem = pdfAppElemRef.current;
    if (pdfAppElem) {
      const style = getComputedStyle(pdfAppElem);
      console.log(style.height, style.width);
    }
  }, [pdfAppElemRef.current]);

  const [metadataIsVisible, setMetadataIsVisible] = useState(false);
  const toggleMetadataIsVisible = useCallback(() => {
    setMetadataIsVisible((isVisible) => {
      return !isVisible;
    });
  }, [setMetadataIsVisible]);

  const [bookmarksIsVisible, setBookmarksIsVisible] = useState(false);
  const toggleBookmarksIsVisible = useCallback(() => {
    setBookmarksIsVisible((isVisible) => {
      return !isVisible;
    });
  }, [setBookmarksIsVisible]);

  const [thumbnailsIsVisible, setThumbnailsIsVisible] = useState(false);
  const toggleThumbnailsIsVisible = useCallback(() => {
    setThumbnailsIsVisible((isVisible) => {
      return !isVisible;
    });
  }, [setThumbnailsIsVisible]);

  const [rotation, setRotation] = useState<Rotation>(0);
  const changeRotation = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const rotation = parseInt(evt.target.value, 10) as Rotation;
      console.log(rotation);
      setRotation(rotation);
    },
    [setRotation]
  );

  const [scaleFactor, setScaleFactor] = useState(1.0);
  const changeScaleFactor = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setScaleFactor(Number(evt.target.value));
    },
    [setScaleFactor]
  );

  const [isSearchPanelOpened, setIsSearchPanelOpened] = useState(false);

  const toggleIsSearchPanelOpened = useCallback(() => {
    setIsSearchPanelOpened((isSearchPanelOpened) => {
      return !isSearchPanelOpened;
    });
  }, [setIsSearchPanelOpened]);

  const [isAttachmentsOpened, setIsAttachmentsOpened] = useState(false);

  const toggleIsAttachmentsVisible = useCallback(() => {
    setIsAttachmentsOpened((isAttachmentsOpened) => {
      return !isAttachmentsOpened;
    });
  }, [setIsAttachmentsOpened]);

  const [file, setFile] = useState<{
    id: string;
    source: ArrayBuffer;
  } | null>(null);
  const selectFile = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const files = evt.target.files;
      if (files?.[0]) {
        const file = files[0];
        const arrayBuffer = await readFile(file);
        setFile({
          id: file.name,
          source: arrayBuffer,
        });
        setRotation(0);
        setScaleFactor(1);
        pdfNavigator.gotoPage(
          {
            destination: {
              pageIndex: 0,
              zoom: {
                mode: PdfZoomMode.Unknown,
              },
              view: [],
            },
          },
          'App'
        );
      }
    },
    [setFile, pdfNavigator]
  );

  return (
    <div className="App">
      <div className="app__toolbar">
        <input type="file" onChange={selectFile} />
        <button onClick={toggleMode}>
          {mode === PdfApplicationMode.Edit ? 'View' : 'Edit'}
        </button>
      </div>
      {file ? (
        <LoggerContextProvider logger={logger}>
          <ThemeContextProvider
            theme={{
              background: 'blue',
            }}
          >
            <PdfEngineContextProvider engine={engine}>
              <PdfApplication mode={mode}>
                <PdfNavigatorContextProvider navigator={pdfNavigator}>
                  <PdfDocument
                    id={file.id}
                    source={file.source}
                    onOpenSuccess={() => {}}
                    onOpenFailure={() => {}}
                  >
                    <PdfToolbar>
                      <PdfToolbarNavigationtemGroup
                        onToggleMetadata={toggleMetadataIsVisible}
                        onToggleOutlines={toggleBookmarksIsVisible}
                        onToggleThumbnails={toggleThumbnailsIsVisible}
                        onToggleAttachments={toggleIsAttachmentsVisible}
                      />
                      <PdfPagesToolbar
                        scaleFactor={scaleFactor}
                        changeScaleFactor={changeScaleFactor}
                        rotation={rotation}
                        changeRotation={changeRotation}
                        toggleIsSearchPanelOpened={toggleIsSearchPanelOpened}
                      />
                      <PdfToolbarDocItemGroup />
                    </PdfToolbar>
                    {metadataIsVisible ? <PdfMetadata /> : null}
                    <PdfPages
                      prerenderRange={[-1, 1]}
                      cacheRange={[-5, 5]}
                      scaleFactor={scaleFactor}
                      rotation={rotation}
                      pageContentComponent={PdfPageContent}
                    />
                    {thumbnailsIsVisible ? (
                      <PdfThumbnails
                        layout={{ direction: 'vertical', itemsCount: 2 }}
                        size={{ width: 100, height: 100 }}
                        scaleFactor={0.25}
                      />
                    ) : null}
                    {bookmarksIsVisible ? <PdfBookmarks /> : null}
                    {isSearchPanelOpened ? (
                      <div className="app__dialog">
                        <PdfSearchPanel />
                      </div>
                    ) : null}
                    {isAttachmentsOpened ? (
                      <div className="app__dialog">
                        <PdfAttachments />
                      </div>
                    ) : null}
                  </PdfDocument>
                </PdfNavigatorContextProvider>
              </PdfApplication>
            </PdfEngineContextProvider>
          </ThemeContextProvider>
        </LoggerContextProvider>
      ) : null}
    </div>
  );
}

async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      resolve(reader.result as ArrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  });
}

async function run() {
  const logger = new ConsoleLogger();
  const response = await fetch(pdfiumWasm);
  const wasmBinary = await response.arrayBuffer();
  const wasmModule = await createPdfiumModule({ wasmBinary });
  const engine = new PdfiumEngine(wasmModule, logger);
  engine.initialize();

  const appElem = document.querySelector('#root') as HTMLElement;
  const root = ReactDOM.createRoot(appElem);
  root.render(<App engine={engine} logger={logger} />);
}

run();
