import {
  calculateSize,
  PdfActionObject,
  PdfAnnotationObject,
  PdfZoomMode,
} from '@unionpdf/models';
import { PdfDestinationObject } from '@unionpdf/models';
import {
  PdfBookmarkObject,
  PdfDocumentObject,
  PdfEngine,
  PdfError,
  PdfPageObject,
  PdfActionType,
  Rect,
  Rotation,
} from '@unionpdf/models';
import { WasmModule } from './wasm';
import { WrappedModule, wrap } from './wrapper';
import { readString } from './helper';

export type PdfiumPdfDocumentObject = PdfDocumentObject<number>;

export enum BitmapFormat {
  Bitmap_Gray = 1,
  Bitmap_BGR = 2,
  Bitmap_BGRx = 3,
  Bitmap_BGRA = 4,
}

export enum RenderFlag {
  ANNOT = 0x01, // Set if annotations are to be rendered.
  LCD_TEXT = 0x02, // Set if using text rendering optimized for LCD display.
  NO_NATIVETEXT = 0x04, // Don't use the native text output available on some platforms
  GRAYSCALE = 0x08, // Grayscale output.
  DEBUG_INFO = 0x80, // Set if you want to get some debug info. Please discuss with Foxit first if you need to collect debug info.
  NO_CATCH = 0x100, // Set if you don't want to catch exception.
  RENDER_LIMITEDIMAGECACHE = 0x200, // Limit image cache size.
  RENDER_FORCEHALFTONE = 0x400, // Always use halftone for image stretching.
  PRINTING = 0x800, // Render for printing.
  REVERSE_BYTE_ORDER = 0x10, // Set whether render in a reverse Byte order, this flag only.
}

export const wrappedModuleMethods = {
  UTF8ToString: ['string' as const, ['number'] as const] as const,
  UTF16ToString: ['string', ['number'] as const] as const,
  UTF32ToString: ['string', ['number'] as const] as const,
  AsciiToString: ['string', ['number'] as const] as const,
  PDFium_Init: ['', [] as const] as const,
  FPDF_LoadMemDocument: [
    'number' as const,
    ['number', 'number', 'string'] as const,
  ] as const,
  FPDF_GetPageSizeByIndex: [
    'number',
    ['number', 'number', 'number', 'number'] as const,
  ] as const,
  FPDF_GetLastError: ['number', [] as const] as const,
  FPDF_GetPageCount: ['number', ['number'] as const] as const,
  FPDF_CloseDocument: ['', ['number'] as const] as const,
  FPDF_DestroyLibrary: ['', [] as const] as const,
  FPDFBitmap_FillRect: [
    '',
    ['number', 'number', 'number', 'number', 'number', 'number'] as const,
  ] as const,
  FPDFBitmap_CreateEx: [
    'number',
    ['number', 'number', 'number', 'number', 'number'] as const,
  ] as const,
  FPDFBitmap_Destroy: ['', ['number'] as const] as const,
  FPDFBookmark_GetFirstChild: [
    'number',
    ['number', 'number'] as const,
  ] as const,
  FPDFBookmark_GetNextSibling: [
    'number',
    ['number', 'number'] as const,
  ] as const,
  FPDFBookmark_GetTitle: [
    'number',
    ['number', 'number', 'number'] as const,
  ] as const,
  FPDFBookmark_GetAction: ['number', ['number'] as const] as const,
  FPDFBookmark_GetDest: ['number', ['number', 'number'] as const] as const,
  FPDFAction_GetType: ['number', ['number'] as const] as const,
  FPDFAction_GetFilePath: [
    'number',
    ['number', 'number', 'number'] as const,
  ] as const,
  FPDFAction_GetDest: ['number', ['number', 'number'] as const] as const,
  FPDFAction_GetURIPath: [
    'number',
    ['number', 'number', 'number'] as const,
  ] as const,
  FPDFDest_GetDestPageIndex: ['number', ['number', 'number'] as const] as const,
  FPDFDest_GetView: [
    'number',
    ['number', 'number', 'number'] as const,
  ] as const,
  FPDF_LoadPage: ['number', ['number', 'number'] as const] as const,
  FPDF_RenderPageBitmap: [
    '',
    [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number',
      'number',
      'number',
    ] as const,
  ] as const,
  FPDFPage_GetAnnotCount: ['number', ['number'] as const] as const,
  FPDFPage_GetAnnot: ['number', ['number', 'number'] as const] as const,
  FPDF_ClosePage: ['', ['number'] as const] as const,
  FPDFAnnot_GetSubtype: ['number', ['number'] as const] as const,
  FPDFPage_CloseAnnot: ['', ['number'] as const] as const,
};

export class PdfiumEngine implements PdfEngine<number> {
  wasmModuleWrapper: WrappedModule<typeof wrappedModuleMethods>;

  constructor(private wasmModule: WasmModule) {
    this.wasmModuleWrapper = wrap(wasmModule, wrappedModuleMethods);
  }

  initialize() {
    this.wasmModuleWrapper.PDFium_Init();
  }

  destroy() {
    this.wasmModuleWrapper.FPDF_DestroyLibrary();
  }

  openDocument(
    arrayBuffer: ArrayBuffer,
    signal?: AbortSignal
  ): PdfiumPdfDocumentObject {
    const array = new Uint8Array(arrayBuffer);
    const length = array.length;
    const ptr = this.wasmModule._malloc(length);
    this.wasmModule.HEAPU8.set(array, ptr);

    const docPtr = this.wasmModuleWrapper.FPDF_LoadMemDocument(ptr, length, '');
    if (this.wasmModuleWrapper.FPDF_GetLastError()) {
      this.wasmModule._free(ptr);
      throw new PdfError('');
    }

    const pageCount = this.wasmModuleWrapper.FPDF_GetPageCount(docPtr);

    const pages: PdfPageObject[] = [];
    const widthPtr = this.wasmModule._malloc(8);
    const heightPtr = this.wasmModule._malloc(8);
    for (let index = 0; index < pageCount; index++) {
      const result = this.wasmModuleWrapper.FPDF_GetPageSizeByIndex(
        docPtr,
        index,
        widthPtr,
        heightPtr
      );
      if (result === 0) {
        this.wasmModule._free(ptr);
        this.wasmModule._free(docPtr);
        this.wasmModule._free(widthPtr);
        this.wasmModule._free(heightPtr);
        throw new PdfError('');
      }

      const page = {
        index,
        size: {
          width: this.wasmModule.getValue(widthPtr, 'double'),
          height: this.wasmModule.getValue(heightPtr, 'double'),
        },
      };

      pages.push(page);
    }
    this.wasmModule._free(ptr);
    this.wasmModule._free(widthPtr);
    this.wasmModule._free(heightPtr);

    return {
      id: docPtr,
      pageCount,
      pages,
    };
  }

  getBookmarks(doc: PdfiumPdfDocumentObject, signal?: AbortSignal) {
    const bookmarks = this.readPdfBookmarks(doc.id, 0);
    return {
      bookmarks,
    };
  }

  renderPage(
    doc: PdfDocumentObject<number>,
    page: PdfPageObject,
    scaleFactor: number,
    rotation: Rotation,
    rect?: Rect | undefined,
    signal?: AbortSignal | undefined
  ) {
    const format = BitmapFormat.Bitmap_BGRA; // RGBA
    const bytesPerPixel = 4;
    const pagePtr = this.wasmModuleWrapper.FPDF_LoadPage(doc.id, page.index);
    const bitmapSize = calculateSize(page.size, scaleFactor, rotation);
    const bitmapHeapLength =
      bitmapSize.width * bitmapSize.height * bytesPerPixel;
    const bitmapHeap = this.wasmModule._malloc(bitmapHeapLength);
    const bitmapPtr = this.wasmModuleWrapper.FPDFBitmap_CreateEx(
      bitmapSize.width,
      bitmapSize.height,
      format,
      bitmapHeap,
      bitmapSize.width * bytesPerPixel
    );
    this.wasmModuleWrapper.FPDFBitmap_FillRect(
      bitmapPtr,
      0,
      0,
      bitmapSize.width,
      bitmapSize.height,
      0xffffffff
    );
    const flags = RenderFlag.REVERSE_BYTE_ORDER | RenderFlag.ANNOT;
    this.wasmModuleWrapper.FPDF_RenderPageBitmap(
      bitmapPtr,
      pagePtr,
      0,
      0,
      bitmapSize.width,
      bitmapSize.height,
      rotation,
      flags
    );

    this.wasmModuleWrapper.FPDFBitmap_Destroy(bitmapPtr);
    this.wasmModuleWrapper.FPDF_ClosePage(pagePtr);

    const arrayBuffer = new ArrayBuffer(bitmapHeapLength);
    const view = new DataView(arrayBuffer);
    for (let i = 0; i < bitmapHeapLength; i++) {
      view.setUint8(i, this.wasmModule.getValue(bitmapHeap + i, 'i8'));
    }
    this.wasmModule._free(bitmapHeap);

    const uint8Array = new Uint8ClampedArray(arrayBuffer);
    return new ImageData(uint8Array, bitmapSize.width, bitmapSize.height);
  }

  getPageAnnotations(
    doc: PdfDocumentObject<number>,
    page: PdfPageObject,
    signal?: AbortSignal | undefined
  ) {
    const pagePtr = this.wasmModuleWrapper.FPDF_LoadPage(doc.id, page.index);
    const annotationCount =
      this.wasmModuleWrapper.FPDFPage_GetAnnotCount(pagePtr);

    const annotations: PdfAnnotationObject[] = [];
    for (let i = 0; i < annotationCount; i++) {
      const annotationPtr = this.wasmModuleWrapper.FPDFPage_GetAnnot(
        pagePtr,
        i
      );

      this.wasmModuleWrapper.FPDFPage_CloseAnnot(annotationPtr);
    }

    return annotations;
  }

  renderThumbnail(
    doc: PdfDocumentObject<number>,
    page: PdfPageObject,
    scaleFactor: number,
    rotation: Rotation,
    signal?: AbortSignal | undefined
  ) {
    return this.renderPage(doc, page, scaleFactor, rotation, undefined, signal);
  }

  closeDocument(
    pdf: PdfiumPdfDocumentObject,
    signal?: AbortSignal | undefined
  ) {
    this.wasmModuleWrapper.FPDF_CloseDocument(pdf.id);
    this.wasmModule._free(pdf.id);
  }

  readPdfBookmarks(docPtr: number, rootBookmarkPtr = 0) {
    let bookmarkPtr = this.wasmModuleWrapper.FPDFBookmark_GetFirstChild(
      docPtr,
      rootBookmarkPtr
    );

    const bookmarks: PdfBookmarkObject[] = [];
    while (bookmarkPtr) {
      const bookmark = this.readPdfBookmark(docPtr, bookmarkPtr);
      bookmarks.push(bookmark);

      const nextBookmarkPtr =
        this.wasmModuleWrapper.FPDFBookmark_GetNextSibling(docPtr, bookmarkPtr);

      this.wasmModule._free(bookmarkPtr);

      bookmarkPtr = nextBookmarkPtr;
    }

    return bookmarks;
  }

  private readPdfBookmark(
    docPtr: number,
    bookmarkPtr: number
  ): PdfBookmarkObject {
    const title = readString(
      this.wasmModule,
      (buffer, bufferLength) => {
        return this.wasmModuleWrapper.FPDFBookmark_GetTitle(
          bookmarkPtr,
          buffer,
          bufferLength
        );
      },
      this.wasmModule.UTF16ToString
    );

    const bookmarks = this.readPdfBookmarks(docPtr, bookmarkPtr);

    const actionPtr =
      this.wasmModuleWrapper.FPDFBookmark_GetAction(bookmarkPtr);
    if (!actionPtr) {
      const action = this.readPdfAction(docPtr, actionPtr);
      this.wasmModule._free(actionPtr);
      return {
        title,
        target: {
          type: 'action',
          action,
        },
        children: bookmarks,
      };
    } else {
      const destinationPtr = this.wasmModuleWrapper.FPDFBookmark_GetDest(
        docPtr,
        bookmarkPtr
      );
      const destination = this.readPdfDestination(docPtr, destinationPtr);
      this.wasmModule._free(destinationPtr);
      return {
        title,
        target: {
          type: 'destination',
          destination,
        },
        children: bookmarks,
      };
    }
  }

  private readPdfAction(docPtr: number, actionPtr: number): PdfActionObject {
    const actionType = this.wasmModuleWrapper.FPDFAction_GetType(
      actionPtr
    ) as PdfActionType;
    switch (actionType) {
      case PdfActionType.Unsupported:
        return {
          type: PdfActionType.Unsupported,
        };
      case PdfActionType.Goto: {
        const destinationPtr = this.wasmModuleWrapper.FPDFAction_GetDest(
          docPtr,
          actionPtr
        );
        const destination = this.readPdfDestination(docPtr, destinationPtr);
        this.wasmModule._free(destinationPtr);
        return {
          type: PdfActionType.Goto,
          destination,
        };
      }
      case PdfActionType.RemoteGoto: {
        // In case of remote goto action,
        // the application should first use FPDFAction_GetFilePath
        // to get file path, then load that particular document,
        // and use its document handle to call this
        return {
          type: PdfActionType.Unsupported,
        };
      }
      case PdfActionType.URI: {
        const uri = readString(
          this.wasmModule,
          (buffer, bufferLength) => {
            return this.wasmModuleWrapper.FPDFAction_GetURIPath(
              actionPtr,
              buffer,
              bufferLength
            );
          },
          this.wasmModuleWrapper.UTF16ToString
        );
        return {
          type: PdfActionType.URI,
          uri,
        };
      }
      case PdfActionType.LaunchAppOrOpenFile: {
        const path = readString(
          this.wasmModule,
          (buffer, bufferLength) => {
            return this.wasmModuleWrapper.FPDFAction_GetFilePath(
              actionPtr,
              buffer,
              bufferLength
            );
          },
          this.wasmModuleWrapper.UTF16ToString
        );
        return {
          type: PdfActionType.LaunchAppOrOpenFile,
          path,
        };
      }
    }
  }

  private readPdfDestination(
    docPtr: number,
    destinationPtr: number
  ): PdfDestinationObject {
    const pageIndex = this.wasmModuleWrapper.FPDFDest_GetDestPageIndex(
      docPtr,
      destinationPtr
    );
    // Every params is a float value
    const paramsCountPtr = this.wasmModule._malloc(4);
    const paramsPtr = this.wasmModule._malloc(4 * 4);
    const zoomMode = this.wasmModuleWrapper.FPDFDest_GetView(
      destinationPtr,
      paramsCountPtr,
      paramsPtr
    ) as PdfZoomMode;
    const paramsCount = this.wasmModule.getValue(paramsCountPtr, 'i32');
    const params: number[] = [];
    for (let i = 0; i < paramsCount; i++) {
      const paramPtr = paramsPtr + i * 4;
      params.push(this.wasmModule.getValue(paramPtr, 'float'));
    }
    this.wasmModule._free(paramsCountPtr);
    this.wasmModule._free(paramsPtr);

    return {
      pageIndex,
      zoom: {
        mode: zoomMode,
        params,
      },
    };
  }
}
