import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { ConsentTemplate } from './_consent.js';

interface PdfInput {
  template: ConsentTemplate;
  bookingNumber: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  answers: Record<string, unknown>;
  signaturePngBytes: Uint8Array;
  filledAt: Date;
}

function answerToString(field: ConsentTemplate['fields'][number], value: unknown): string {
  if (field.type === 'note') return '';
  if (value == null) return '—';
  if (field.type === 'yesno') return value === true || value === 'yes' || value === 'Yes' ? 'Yes' : 'No';
  if (field.type === 'checklist') {
    if (Array.isArray(value)) return value.length === 0 ? '—' : value.join(', ');
    return String(value);
  }
  const s = String(value).trim();
  return s.length === 0 ? '—' : s;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildConsentPdf(input: PdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const sigImage = await pdf.embedPng(input.signaturePngBytes);

  let page = pdf.addPage([612, 792]);
  const margin = 48;
  const width = 612 - margin * 2;
  let y = 792 - margin;

  const draw = (text: string, opts: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {}) => {
    const size = opts.size ?? 10;
    const f = opts.bold ? bold : font;
    const lineHeight = size * 1.35;
    const maxChars = Math.floor(width / (size * 0.52));
    const lines = wrapText(text, maxChars);
    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdf.addPage([612, 792]);
        y = 792 - margin;
      }
      page.drawText(line, {
        x: margin,
        y: y - size,
        size,
        font: f,
        color: rgb(...(opts.color ?? [0.07, 0.09, 0.15])),
      });
      y -= lineHeight;
    }
    if (opts.gap) y -= opts.gap;
  };

  draw('RD Harmony Med Spa', { size: 16, bold: true, color: [0.06, 0.6, 0.39] });
  draw(input.template.title, { size: 14, bold: true, gap: 8 });

  draw(`Booking #: ${input.bookingNumber}`, { size: 10 });
  draw(`Service: ${input.serviceName}`, { size: 10 });
  draw(`Appointment: ${input.appointmentDate} at ${input.appointmentTime}`, { size: 10, gap: 8 });

  draw(input.template.intro, { size: 10, color: [0.4, 0.4, 0.45], gap: 12 });

  draw('Patient Information & Medical History', { size: 12, bold: true, gap: 6 });

  for (const field of input.template.fields) {
    if (field.type === 'note') {
      draw(field.text, { size: 9, color: [0.4, 0.4, 0.45], gap: 4 });
      continue;
    }
    const ans = answerToString(field, (input.answers as Record<string, unknown>)[field.key]);
    draw(field.label, { size: 9, bold: true });
    draw(ans, { size: 10, gap: 6 });
  }

  y -= 8;
  draw('Acknowledgment', { size: 12, bold: true, gap: 6 });
  draw(input.template.acknowledgment, { size: 9, gap: 12 });

  const sigDims = sigImage.scale(120 / sigImage.height);
  if (y < margin + sigDims.height + 60) {
    page = pdf.addPage([612, 792]);
    y = 792 - margin;
  }
  draw('Patient Signature:', { size: 9, bold: true, gap: 4 });
  if (y - sigDims.height < margin) {
    page = pdf.addPage([612, 792]);
    y = 792 - margin;
  }
  page.drawImage(sigImage, { x: margin, y: y - sigDims.height, width: sigDims.width, height: sigDims.height });
  y -= sigDims.height + 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: margin + 240, y },
    thickness: 0.5,
    color: rgb(0.5, 0.5, 0.55),
  });
  y -= 16;
  draw(`Signed: ${input.filledAt.toISOString().slice(0, 10)} ${input.filledAt.toISOString().slice(11, 16)} UTC`, { size: 9, color: [0.4, 0.4, 0.45] });

  return await pdf.save();
}
