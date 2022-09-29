import {
  PdfNavigatorEvent,
  usePdfDocument,
  usePdfEngine,
  usePdfNavigator,
} from "@onepdf/core";
import { PdfPageModel, Rotation, Size } from "@onepdf/models";
import { useCallback, useEffect, useState } from "react";

export interface Layout {
  colsCount: number;
  rowsCount: number;
}

export interface PdfThumbnailsProps {
  layout: Layout;
  size: Size;
  scale?: number;
  rotation?: Rotation;
}

export const PDF_NAVIGATOR_SOURCE_THUMBNAILS = "PdfThumbnails";

export function PdfThumbnails(props: PdfThumbnailsProps) {
  const { layout, size, scale = 1, rotation = 0 } = props;
  const doc = usePdfDocument();
  const pdfNavigator = usePdfNavigator();
  const [currPageIndex, setCurrPageIndex] = useState(
    pdfNavigator?.currPageIndex || 0
  );

  useEffect(() => {
    if (pdfNavigator) {
      const handle = (evt: PdfNavigatorEvent, source: string) => {
        switch (evt.kind) {
          case "Change":
            if (source !== PDF_NAVIGATOR_SOURCE_THUMBNAILS) {
              setCurrPageIndex(evt.data.pageIndex);
            }
            break;
        }
      };
      pdfNavigator.addEventListener(PDF_NAVIGATOR_SOURCE_THUMBNAILS, handle);

      return () => {
        pdfNavigator.removeEventListener(
          PDF_NAVIGATOR_SOURCE_THUMBNAILS,
          handle
        );
      };
    }
  }, [pdfNavigator]);

  const gotoPage = useCallback(
    (page: PdfPageModel) => {
      pdfNavigator?.gotoPage(page.index, PDF_NAVIGATOR_SOURCE_THUMBNAILS);
    },
    [pdfNavigator]
  );

  return (
    <div className="pdf__thumbnails">
      {doc?.pages.map((page, index) => {
        const isCurrent = page.index === currPageIndex;
        return (
          <PdfThumbnail
            key={index}
            page={page}
            scale={scale}
            rotation={rotation}
            isCurrent={isCurrent}
            onClick={gotoPage}
          />
        );
      })}
    </div>
  );
}

export interface PdfThumbnailProps {
  page: PdfPageModel;
  scale: number;
  rotation: Rotation;
  isCurrent: boolean;
  onClick: (page: PdfPageModel) => void;
}

export function PdfThumbnail(props: PdfThumbnailProps) {
  const engine = usePdfEngine();
  const { page, scale, rotation, isCurrent, onClick } = props;
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (engine && page) {
      const load = async () => {
        const result = await engine.renderThumbnail(page, scale, rotation);
        if (result instanceof Promise) {
          result.then(() => {
            setSrc(imageDataToDataUrl(result));
          });
        } else {
          setSrc(imageDataToDataUrl(result));
        }
      };

      load();
    }
  }, [engine, page, scale, rotation]);

  return (
    <img
      className={`pdf__thumbnail ${isCurrent ? "pdf__thumbnail--current" : ""}`}
      alt={`page ${page.index}`}
      src={src}
      onClick={() => {
        onClick(page);
      }}
    />
  );
}

function imageDataToDataUrl(imageData: ImageData) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context?.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}
