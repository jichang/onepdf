import { Module, ModuleRuntimeMethods } from './emscripten';

export interface PdfiumModule extends Module, ModuleRuntimeMethods {}

export function createPdfiumModule(
  init: Partial<PdfiumModule>
): Promise<PdfiumModule>;
