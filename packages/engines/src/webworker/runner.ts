import { PdfEngine, Task } from '@unionpdf/models';

export type PdfEngineMethodName = keyof Required<PdfEngine>;
export type PdfEngineMethodArgs<P extends PdfEngineMethodName> = Readonly<
  Parameters<Required<PdfEngine>[P]>
>;
export type PdfEngineMethodReturnType<P extends PdfEngineMethodName> = Readonly<
  ReturnType<Required<PdfEngine>[P]>
>;
export type TaskResolveValueType<T> = T extends Task<infer R, infer U>
  ? R
  : never;
export type TaskRejectErrorType<T> = T extends Task<infer R, infer U>
  ? U
  : never;

export type PdfEngineMethodRequestBody = {
  [P in PdfEngineMethodName]: {
    name: P;
    args: PdfEngineMethodArgs<P>;
  };
}[PdfEngineMethodName];

export type TaskResultType<T> = T extends Task<infer R, infer E>
  ? { type: 'resolve'; result: R } | { type: 'reject'; error: E }
  : never;

export type PdfEngineMethodResponseBody = {
  [P in PdfEngineMethodName]: TaskResultType<PdfEngineMethodReturnType<P>>;
}[PdfEngineMethodName];

export interface AbortRequest {
  id: string;
  type: 'AbortRequest';
}

export interface ExecuteRequest {
  id: string;
  type: 'ExecuteRequest';
  data: PdfEngineMethodRequestBody;
}

export interface ExecuteResponse {
  id: string;
  type: 'ExecuteResponse';
  data: PdfEngineMethodResponseBody;
}

export interface ReadyResponse {
  id: string;
  type: 'ReadyResponse';
}

export type Request = ExecuteRequest | AbortRequest;

export type Response = ExecuteResponse | ReadyResponse;

export class EngineRunner {
  engine: PdfEngine | undefined;

  ready() {
    this.respond({
      id: '0',
      type: 'ReadyResponse',
    });
  }

  execute = (request: ExecuteRequest) => {
    if (!this.engine) {
      const response: ExecuteResponse = {
        id: request.id,
        type: 'ExecuteResponse',
        data: {
          type: 'reject',
          error: new Error('engine has not started yet'),
        },
      };
      this.respond(response);
      return;
    }

    const engine = this.engine;
    const { name, args } = request.data;
    if (!engine[name]) {
      const response: ExecuteResponse = {
        id: request.id,
        type: 'ExecuteResponse',
        data: {
          type: 'reject',
          error: new Error('engine method has not supported yet'),
        },
      };
      this.respond(response);
      return;
    }

    let task: PdfEngineMethodReturnType<typeof name>;
    switch (name) {
      case 'isSupport':
        task = this.engine[name]!(...args);
        break;
      case 'initialize':
        task = this.engine[name]!(...args);
        break;
      case 'destroy':
        task = this.engine[name]!(...args);
        break;
      case 'openDocument':
        task = this.engine[name]!(...args);
        break;
      case 'getBookmarks':
        task = this.engine[name]!(...args);
        break;
      case 'renderPage':
        task = this.engine[name]!(...args);
        break;
      case 'renderPageRect':
        task = this.engine[name]!(...args);
        break;
      case 'renderThumbnail':
        task = this.engine[name]!(...args);
        break;
      case 'getPageAnnotations':
        task = this.engine[name]!(...args);
        break;
      case 'closeDocument':
        task = this.engine[name]!(...args);
        break;
    }

    task.wait(
      (result) => {
        const response: ExecuteResponse = {
          id: request.id,
          type: 'ExecuteResponse',
          data: {
            type: 'resolve',
            result,
          },
        };
        this.respond(response);
      },
      (error) => {
        const response: ExecuteResponse = {
          id: request.id,
          type: 'ExecuteResponse',
          data: {
            type: 'reject',
            error,
          },
        };
        this.respond(response);
      }
    );
  };

  respond(response: Response) {
    console.log('send response: ', response);
    self.postMessage(response);
  }
}

export function handler(runner: EngineRunner) {
  return (evt: MessageEvent<Request>) => {
    console.log('receive request: ', evt.data);
    try {
      const request = evt.data as Request;
      switch (request.type) {
        case 'ExecuteRequest':
          runner.execute(request);
          break;
      }
    } catch (e) {
      console.log(e);
    }
  };
}