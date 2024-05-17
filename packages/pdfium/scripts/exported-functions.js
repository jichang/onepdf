exports.functions = {
  /*
  "PDFium_Init": [
    [],
    null
  ],
  "PDFium_OpenFileWriter": [
    [],
    "number"
  ],
  "PDFium_CloseFileWriter": [
    [
      "number"
    ],
    null
  ],
  "PDFium_GetFileWriterSize": [
    [
      "number"
    ],
    "number"
  ],
  "PDFium_GetFileWriterData": [
    [
      "number",
      "number",
      "number"
    ],
    null
  ],
  "PDFium_OpenFormFillInfo": [
    [],
    "number"
  ],
  "PDFium_CloseFormFillInfo": [
    [
      "number"
    ],
    null
  ],
  "PDFium_InitFormFillEnvironment": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "PDFium_ExitFormFillEnvironment": [
    [
      "number"
    ],
    "number"
  ],
  "PDFium_SaveAsCopy": [
    [
      "number",
      "number"
    ],
    null
  ],
  */
  /*
  "FPDF_LoadMemDocument": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDF_GetPageSizeByIndexF": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDF_GetLastError": [
    [],
    "number"
  ],
  "FPDF_GetPageCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDF_CloseDocument": [
    [
      "number"
    ],
    null
  ],
  "FPDF_DestroyLibrary": [
    [],
    null
  ],*/
  /*
  "FPDF_GetMetaText": [
    [
      "number",
      "string",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_FillRect": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    null
  ],
  "FPDFBitmap_Create": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_CreateEx": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_GetBuffer": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_GetWidth": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_GetHeight": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_GetFormat": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFBitmap_Destroy": [
    [
      "number"
    ],
    null
  ],
  "FPDFPageObj_Destroy": [
    [
      "number"
    ],
    null
  ],
  "FPDFPageObj_NewImageObj": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFPageObj_GetMatrix": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPageObj_SetMatrix": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPageObj_GetBounds": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPageObj_Transform": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    null
  ],
  "FPDFImageObj_SetBitmap": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFImageObj_GetBitmap": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFPath_CountSegments": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFPath_GetPathSegment": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFPathSegment_GetType": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFPathSegment_GetPoint": [
    [
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPathSegment_GetClose": [
    [
      "number"
    ],
    "boolean"
  ],
  "FPDFFormObj_CountObjects": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFFormObj_GetObject": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBookmark_GetFirstChild": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBookmark_GetNextSibling": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBookmark_Find": [
    [
      "number",
      "string"
    ],
    "number"
  ],
  "FPDFBookmark_GetTitle": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFBookmark_GetAction": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFBookmark_GetDest": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAction_GetType": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFAction_GetFilePath": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAction_GetDest": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAction_GetURIPath": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFDest_GetDestPageIndex": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFDest_GetView": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFDest_GetLocationInPage": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDF_LoadPage": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDF_RenderPageBitmap": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    null
  ],
  "FPDF_PageToDevice": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    null
  ],
  "FPDF_DeviceToPage": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPage_GetAnnotCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFPage_GetAnnot": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFPage_CreateAnnot": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFPage_InsertObject": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPage_RemoveAnnot": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFPage_GenerateContent": [
    [
      "number"
    ],
    "boolean"
  ],
  "FPDF_ClosePage": [
    [
      "number"
    ],
    null
  ],
  "FPDFAnnot_GetSubtype": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetAP": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetObjectCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetObject": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_AppendObject": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_GetRect": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_SetRect": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_GetLink": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetFormFieldType": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetFormFieldFlags": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetFormFieldName": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetFormFieldAlternateName": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetFormFieldValue": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetOptionCount": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetOptionLabel": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_IsOptionSelected": [
    [
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_IsChecked": [
    [
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_GetStringValue": [
    [
      "number",
      "string",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetColor": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetLinkedAnnot": [
    [
      "number",
      "string"
    ],
    "number"
  ],
  "FPDFAnnot_GetInkListCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetInkListPath": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_AddInkStroke": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_RemoveInkList": [
    [
      "number"
    ],
    "boolean"
  ],
  "FPDFAnnot_GetVertices": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAnnot_GetLine": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFPageObj_GetType": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFLink_GetDest": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFLink_GetAction": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFText_LoadPage": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFText_CountChars": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFText_CountRects": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_GetRect": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDFText_GetCharIndexAtPos": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_GetFontSize": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_GetFontInfo": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_GetBoundedText": [
    [
      "number",
      "number",
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_FindStart": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFText_FindNext": [
    [
      "number"
    ],
    "boolean"
  ],
  "FPDFText_FindPrev": [
    [
      "number"
    ],
    "boolean"
  ],
  "FPDFText_GetSchResultIndex": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFText_GetSchCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFText_FindClose": [
    [
      "number"
    ],
    null
  ],
  "FPDFText_ClosePage": [
    [
      "number"
    ],
    null
  ],
  "FPDFText_GetText": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFPage_CloseAnnot": [
    [
      "number"
    ],
    null
  ],
  "FPDFDoc_GetAttachmentCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDFDoc_GetAttachment": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAttachment_GetName": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAttachment_GetStringValue": [
    [
      "number",
      "string",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFAttachment_GetFile": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDF_GetSignatureCount": [
    [
      "number"
    ],
    "number"
  ],
  "FPDF_GetSignatureObject": [
    [
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetContents": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetByteRange": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetSubFilter": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetReason": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetTime": [
    [
      "number",
      "number",
      "number"
    ],
    "number"
  ],
  "FPDFSignatureObj_GetDocMDPPermission": [
    [
      "number"
    ],
    "number"
  ],
  "FPDF_CreateNewDocument": [
    [],
    "number"
  ],
  "FPDF_ImportPagesByIndex": [
    [
      "number",
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ],
  "FPDF_ImportPages": [
    [
      "number",
      "number",
      "number",
      "number"
    ],
    "boolean"
  ]*/
}