import {
  PdfAnnotationObject,
  PdfAnnotationObjectStatus,
  PdfPageObject,
  Position,
  Size,
} from '@unionpdf/models';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLogger, usePdfDocument, usePdfEngine } from '../../core';

export const EDITOR_CONTEXT_LOG_SOURCE = 'PdfEditorContext';

export enum PdfEditorTool {
  Annotation,
  Extract,
  Stamp,
}

export enum PdfAnnotationTool {
  Selection,
  Pencil,
}

export type Operation =
  | {
      id: string;
      action: 'create' | 'remove';
      page: PdfPageObject;
      annotation: PdfAnnotationObject;
    }
  | {
      id: string;
      action: 'transform';
      page: PdfPageObject;
      annotation: PdfAnnotationObject;
      params: {
        offset: Position;
        scale: Size;
      };
    };

export interface PdfEditorStacks {
  undo: Operation[];
  redo: Operation[];
  pages: Record<string, Operation[]>;
}

export enum StackStatus {
  Empty,
  Pending,
}

export enum PdfAnnotationMarker {
  Dragging,
}

export interface PdfEditorContextValue {
  tool: PdfEditorTool;
  setTool: (tool: PdfEditorTool) => void;
  toggleTool: (tool: PdfEditorTool) => void;
  annotationTool: PdfAnnotationTool;
  setAnnotationTool: (tool: PdfAnnotationTool) => void;
  queryStatus: () => StackStatus;
  queryByPageIndex: (pageIndex: number) => Operation[];
  exec: (operation: Operation) => void;
  undo: () => void;
  redo: () => void;
  commit: () => void;
  discard: () => void;
}

export const PdfEditorContext = React.createContext<PdfEditorContextValue>({
  tool: PdfEditorTool.Annotation,
  setTool: (tool: PdfEditorTool) => {},
  toggleTool: (tool: PdfEditorTool) => {},
  annotationTool: PdfAnnotationTool.Selection,
  setAnnotationTool: (tool: PdfAnnotationTool) => {},
  queryStatus: () => {
    return StackStatus.Empty;
  },
  queryByPageIndex: (pageIndex: number) => {
    return [];
  },
  exec: (operation: Operation) => {},
  undo: () => {},
  redo: () => {},
  commit: () => {},
  discard: () => {},
});

export interface PdfEditorContextProviderProps {
  children: ReactNode;
}

export function PdfEditorContextProvider(props: PdfEditorContextProviderProps) {
  const { children } = props;

  const logger = useLogger();
  const { setVersion } = usePdfDocument();
  const [tool, setTool] = useState(PdfEditorTool.Annotation);

  const toggleTool = useCallback(
    (tool: PdfEditorTool) => {
      setTool((currTool) => {
        if (currTool === tool) {
          return PdfEditorTool.Annotation;
        } else {
          return tool;
        }
      });
    },
    [setTool]
  );

  const [annotationTool, setAnnotationTool] = useState(
    PdfAnnotationTool.Selection
  );

  const [stacks, setStacks] = useState<PdfEditorStacks>({
    undo: [],
    redo: [],
    pages: {},
  });

  const queryStatus = useCallback(() => {
    if (stacks.undo.length === 0) {
      return StackStatus.Empty;
    } else {
      return StackStatus.Pending;
    }
  }, [stacks]);

  const queryByPageIndex = useCallback(
    (pageIndex: number) => {
      const pageStack = stacks.pages[pageIndex];
      if (!pageStack || pageStack.length === 0) {
        return [];
      }

      return pageStack;
    },
    [stacks]
  );

  const exec = useCallback(
    (operation: Operation) => {
      logger.debug(
        EDITOR_CONTEXT_LOG_SOURCE,
        'operation',
        'exec operation: ',
        operation
      );
      setStacks((stacks) => {
        const { annotation } = operation;
        const { undo, redo, pages } = stacks;
        const pageStack = pages[annotation.pageIndex] || [];

        return {
          undo: [...undo, operation],
          redo,
          pages: {
            ...pages,
            [annotation.pageIndex]: [...pageStack, operation],
          },
        };
      });
    },
    [logger, setStacks]
  );

  const undo = useCallback(() => {
    setStacks((stacks) => {
      logger.debug(EDITOR_CONTEXT_LOG_SOURCE, 'operation', 'undo operation');
      const { undo, redo, pages } = stacks;

      if (undo.length === 0) {
        return stacks;
      }

      const operation = undo[undo.length - 1];
      const { annotation } = operation;
      const pageStack = pages[annotation.pageIndex] || [];

      return {
        undo: undo.slice(0, undo.length - 1),
        redo: [...redo, operation],
        pages: {
          ...pages,
          [annotation.pageIndex]: pageStack.filter((_operation) => {
            return _operation.id !== operation.id;
          }),
        },
      };
    });
  }, [logger, setStacks]);

  const redo = useCallback(() => {
    setStacks((stacks) => {
      logger.debug(EDITOR_CONTEXT_LOG_SOURCE, 'operation', 'redo operation');
      const { undo, redo, pages } = stacks;

      if (redo.length === 0) {
        return stacks;
      }

      const operation = redo[redo.length - 1];
      const { annotation } = operation;
      const pageStack = pages[annotation.pageIndex] || [];

      return {
        undo: [...undo, operation],
        redo: redo.slice(0, redo.length - 1),
        pages: {
          ...pages,
          [annotation.pageIndex]: [...pageStack, operation],
        },
      };
    });
  }, [logger, setStacks]);

  const engine = usePdfEngine();
  const { doc } = usePdfDocument();

  const commit = useCallback(() => {
    logger.debug(EDITOR_CONTEXT_LOG_SOURCE, 'operation', 'commit operation');
    const { undo } = stacks;

    if (!engine || !doc) {
      return;
    }

    if (undo.length === 0) {
      return;
    }

    const commitOperations = undo.reduce((operations, operation) => {
      if (operations.length === 0) {
        return [operation];
      }

      let result: Operation[] = [];
      switch (operation.action) {
        case 'create':
          result = [...operations, operation];
          break;
        case 'remove':
          {
            result = operations.filter((_operation) => {
              return _operation.annotation.id !== operation.annotation.id;
            });
            if (
              operation.annotation.status === PdfAnnotationObjectStatus.Commited
            ) {
              result = [...operations, operation];
            }
          }
          break;
        case 'transform':
          {
            const needReduce = operations.findIndex((_operation) => {
              return _operation.annotation.id === operation.annotation.id;
            });
            if (!needReduce) {
              result = [...operations, operation];
            } else {
              operations.forEach((_operation) => {
                if (operation.annotation.id !== operation.annotation.id) {
                  return _operation;
                }

                switch (_operation.action) {
                  case 'create':
                    _operation.annotation.rect = {
                      origin: {
                        x:
                          _operation.annotation.rect.origin.x +
                          operation.params.offset.x,
                        y:
                          _operation.annotation.rect.origin.y +
                          operation.params.offset.y,
                      },
                      size: {
                        width:
                          _operation.annotation.rect.size.width *
                          operation.params.scale.width,
                        height:
                          _operation.annotation.rect.size.height *
                          operation.params.scale.height,
                      },
                    };
                    break;
                  case 'remove':
                    // should not happen
                    break;
                  case 'transform':
                    _operation.params = {
                      offset: {
                        x:
                          _operation.params.offset.x +
                          operation.params.offset.x,
                        y:
                          _operation.params.offset.y +
                          operation.params.offset.y,
                      },
                      scale: {
                        width:
                          _operation.params.scale.width *
                          operation.params.scale.width,
                        height:
                          _operation.params.scale.height *
                          operation.params.scale.height,
                      },
                    };
                    break;
                }

                return result;
              });

              result = operations;
            }
          }
          break;
      }

      return result;
    }, [] as Operation[]);

    for (const commitOperation of commitOperations) {
      const { action, page, annotation } = commitOperation;
      switch (action) {
        case 'create':
          engine.createPageAnnotation(doc, page, annotation);
          break;
        case 'transform':
          const { params } = commitOperation;
          const task = engine.transformPageAnnotation(doc, page, annotation, {
            origin: {
              x: annotation.rect.origin.x + params.offset.x,
              y: annotation.rect.origin.y + params.offset.y,
            },
            size: {
              width: annotation.rect.size.width * params.scale.width,
              height: annotation.rect.size.height * params.scale.height,
            },
          });
          break;
        case 'remove':
          engine.removePageAnnotation(doc, page, annotation);
          break;
      }
    }

    setStacks({
      undo: [],
      redo: [],
      pages: {},
    });
    setVersion(Date.now());
  }, [logger, stacks, engine, doc, setVersion, setStacks]);

  const discard = useCallback(() => {
    logger.debug(EDITOR_CONTEXT_LOG_SOURCE, 'operation', 'discard operation');

    setStacks({
      undo: [],
      redo: [],
      pages: {},
    });
  }, [logger, setStacks]);

  useEffect(() => {
    return () => {
      setStacks({
        undo: [],
        redo: [],
        pages: {},
      });
    };
  }, [doc]);

  return (
    <PdfEditorContext.Provider
      value={{
        tool,
        setTool,
        toggleTool,
        annotationTool,
        setAnnotationTool,
        queryStatus,
        queryByPageIndex,
        exec,
        undo,
        redo,
        commit,
        discard,
      }}
    >
      {children}
    </PdfEditorContext.Provider>
  );
}

export function usePdfEditor() {
  return useContext(PdfEditorContext);
}
