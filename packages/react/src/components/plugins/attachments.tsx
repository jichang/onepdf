import React, { useEffect, useState } from 'react';
import { ComponentProps } from 'react';
import './attachments.css';
import classNames from 'classnames';
import { ignore, PdfAttachmentObject, PdfErrorCode } from '@unionpdf/models';
import { usePdfDocument } from '../../core/document.context';
import { usePdfEngine } from '../../core/engine.context';
import { useUIComponents, useUIStrings } from '../../adapters';
import { PdfApplicatinPluginKey, PdfPlugin, PdfPluginPanel } from '../../core';

/**
 * Properties of PdfAttachments
 */
export interface PdfAttachmentsProps extends ComponentProps<'div'> {}

export const PDF_NAVIGATOR_ATTACHMENTS_PANEL = 'PdfAttachments';

/**
 * Plugin for viewing pdf attachments
 * @param props - properties of PdfAttachments
 * @returns
 */
export function PdfAttachments(props: PdfAttachmentsProps) {
  const strings = useUIStrings();

  return (
    <PdfPlugin pluginKey={PdfApplicatinPluginKey.Attachments}>
      <PdfPluginPanel
        pluginKey={PdfApplicatinPluginKey.Attachments}
        title={strings.attchments}
      >
        <PdfAttachmentsContent {...props} />
      </PdfPluginPanel>
    </PdfPlugin>
  );
}

/**
 * pdf attachments content
 * @param props - properties of PdfAttachmentsContent
 * @returns
 */
export function PdfAttachmentsContent(props: PdfAttachmentsProps) {
  const { className, children, ...rest } = props;

  const engine = usePdfEngine();
  const { doc } = usePdfDocument();
  const [attachments, setAttachments] = useState<PdfAttachmentObject[]>([]);

  useEffect(() => {
    if (engine && doc) {
      const task = engine.getAttachments(doc);
      task.wait(setAttachments, ignore);

      return () => {
        task.abort({
          code: PdfErrorCode.Cancelled,
          message: '',
        });
      };
    }
  }, [engine, doc]);

  const { Button } = useUIComponents();
  const strings = useUIStrings();

  return (
    <div
      data-testid="pdf__plugin__attachments__content"
      className={classNames('pdf__attachments', className)}
      {...rest}
    >
      <table>
        <thead>
          <tr>
            <td>{strings.fileName}</td>
            <td>{strings.fileCreationDate}</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {attachments.map((attachment) => {
            return (
              <tr key={attachment.index}>
                <td>{attachment.name}</td>
                <td>{attachment.creationDate}</td>
                <td>
                  <Button
                    scenario={{ usage: 'attachment-download' }}
                    onClick={async () => {
                      if (engine && doc) {
                        engine
                          .readAttachmentContent(doc, attachment)
                          .wait((buffer: ArrayBuffer) => {
                            const url = URL.createObjectURL(new Blob([buffer]));
                            const linkElem = document.createElement('a');
                            linkElem.download = `${attachment.name}`;
                            linkElem.href = url;
                            linkElem.click();
                          }, ignore);
                      }
                    }}
                  >
                    {strings.download}
                  </Button>
                </td>
              </tr>
            );
          })}
          {attachments.length === 0 ? (
            <tr key="no-attachemnts">
              <td colSpan={3}>{strings.noAttachments}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {children}
    </div>
  );
}
