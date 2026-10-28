import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { RESUME_TEMPLATES } from '../constants/templates.config';

/**
 * Universal ATS Single-Page Resume HTML & Print Generator
 * Faithfully matches skycodex.vercel.app's exact templates and single-page A4 specs.
 */
export const generateResumeHtml = (resume) => {
  const {
    personalInfo = {},
    summary = '',
    experiences = [],
    educations = [],
    skills = [],
    projects = [],
    templateId = 'modern',
    customColor,
  } = resume || {};

  const currentTemplate =
    RESUME_TEMPLATES.find((t) => t.id === templateId) || RESUME_TEMPLATES[0];

  const primaryColor = customColor || currentTemplate.previewColor || '#4F46E5';
  const isSingleColumn = currentTemplate.isSingleColumn;
  const isSerif = currentTemplate.fontFamily === 'serif';
  const isMono = currentTemplate.fontFamily === 'monospace';

  const baseFont = isSerif
    ? 'Georgia, "Times New Roman", serif'
    : isMono
    ? '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
    : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  // 1. Single-Column ATS Master / Minimal Slate Layout
  if (isSingleColumn) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${personalInfo.fullName || 'Resume'} - sky.devX</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 14mm 10mm 14mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: ${baseFont};
      color: #111827;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      background: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      text-align: center;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #111827;
      margin-bottom: 12px;
    }
    .name {
      font-size: 22px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 2px 0;
      color: #111827;
    }
    .title {
      font-size: 12px;
      font-weight: 700;
      color: ${primaryColor};
      margin: 0 0 6px 0;
    }
    .contacts {
      font-size: 10.5px;
      color: #374151;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .contacts span { margin: 0 4px; }
    .contacts a { color: #111827; text-decoration: underline; font-weight: 600; }
    .section {
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-bottom: 1px solid #111827;
      padding-bottom: 2px;
      margin-bottom: 6px;
      color: #111827;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #111827;
    }
    .item-date {
      font-size: 10px;
      font-weight: 600;
      color: #4B5563;
    }
    .item-sub {
      font-size: 10.5px;
      font-style: italic;
      color: #374151;
      margin-bottom: 2px;
    }
    ul {
      margin: 2px 0 0 0;
      padding-left: 14px;
    }
    li {
      font-size: 10.5px;
      color: #374151;
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .skills-inline {
      font-size: 10.5px;
      color: #374151;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${personalInfo.fullName || 'SHRAWAN KUMAR YADAV'}</div>
    <div class="title">${personalInfo.jobTitle || 'Senior Full-Stack & Mobile Architect'}</div>
    <div class="contacts">
      ${personalInfo.phone ? `<span>${personalInfo.phone}</span> •` : ''}
      ${personalInfo.email ? `<span>${personalInfo.email}</span> •` : ''}
      ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
    </div>
    <div class="contacts" style="margin-top: 3px;">
      ${personalInfo.linkedin ? `<a href="https://${personalInfo.linkedin}">LinkedIn</a> •` : ''}
      ${personalInfo.website ? `<a href="${personalInfo.website}">GitHub / Portfolio</a>` : ''}
    </div>
  </div>

  ${educations && educations.length > 0 ? `
  <div class="section">
    <div class="section-title">EDUCATION</div>
    ${educations.map(e => `
      <div style="margin-bottom: 5px;">
        <div class="item-header">
          <span class="item-title">${e.school || 'ITS Engineering College'}</span>
          <span class="item-date">${e.startDate ? e.startDate + ' – ' : ''}${e.endDate || '2025'}</span>
        </div>
        <div class="item-sub">${e.degree || 'B.Tech in Computer Science'}</div>
        ${e.bullets && e.bullets.length > 0 ? `
          <ul>${e.bullets.filter(b => !!b).map(b => `<li>${b}</li>`).join('')}</ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${projects && projects.length > 0 ? `
  <div class="section">
    <div class="section-title">PROJECTS</div>
    ${projects.map(p => `
      <div style="margin-bottom: 5px;">
        <div class="item-header">
          <span class="item-title">${p.title || 'Project'}</span>
          ${p.link ? `<span class="item-date" style="color: ${primaryColor};">${p.link}</span>` : ''}
        </div>
        ${p.description ? `<div style="font-size: 10.5px; color: #4B5563;">${p.description}</div>` : ''}
        ${p.bullets && p.bullets.length > 0 ? `
          <ul>${p.bullets.filter(b => !!b).map(b => `<li>${b}</li>`).join('')}</ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${skills && skills.length > 0 ? `
  <div class="section">
    <div class="section-title">TECHNICAL SKILLS</div>
    <div class="skills-inline">
      <b>Languages & Tools:</b> ${skills.join(', ')}
    </div>
  </div>
  ` : ''}

  ${experiences && experiences.length > 0 ? `
  <div class="section">
    <div class="section-title">WORK EXPERIENCE</div>
    ${experiences.map(exp => `
      <div style="margin-bottom: 5px;">
        <div class="item-header">
          <span class="item-title">${exp.jobTitle || ''}</span>
          <span class="item-date">${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : exp.endDate || ''}</span>
        </div>
        <div class="item-sub">${exp.company || ''}${exp.location ? ' | ' + exp.location : ''}</div>
        ${exp.bullets && exp.bullets.length > 0 ? `
          <ul>${exp.bullets.filter(b => !!b).map(b => `<li>${b}</li>`).join('')}</ul>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${summary ? `
  <div class="section">
    <div class="section-title">PROFESSIONAL SUMMARY</div>
    <div style="font-size: 10.5px; color: #374151; line-height: 1.45;">${summary}</div>
  </div>
  ` : ''}
</body>
</html>`;
  }

  // 2. Modern 2-Column Matrix (Modern Indigo, Executive Purple, Creative Emerald, Developer Monospace)
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${personalInfo.fullName || 'Resume'} - sky.devX</title>
  <style>
    @page {
      size: A4;
      margin: 10mm 12mm 10mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: ${baseFont};
      color: #111827;
      margin: 0;
      padding: 0;
      line-height: 1.35;
      background: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      padding-bottom: 10px;
      border-bottom: 2px solid ${primaryColor};
      margin-bottom: 12px;
    }
    .name {
      font-size: 24px;
      font-weight: 800;
      color: ${primaryColor};
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0 0 2px 0;
    }
    .title {
      font-size: 13px;
      font-weight: 600;
      color: #4B5563;
      margin: 0 0 6px 0;
    }
    .contacts {
      font-size: 10.5px;
      color: #4B5563;
    }
    .contacts span { margin-right: 8px; }
    .contacts a { color: ${primaryColor}; text-decoration: underline; }
    .matrix {
      display: flex;
      gap: 16px;
    }
    .left-col {
      flex: 2;
    }
    .right-col {
      flex: 1.2;
    }
    .section-title {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: ${primaryColor};
      text-transform: uppercase;
      border-bottom: 1px solid ${primaryColor}40;
      padding-bottom: 2px;
      margin-bottom: 8px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 11px;
      font-weight: 700;
      color: #111827;
    }
    .item-date {
      font-size: 9.5px;
      color: #6B7280;
    }
    .item-sub {
      font-size: 10px;
      color: #4B5563;
      margin-bottom: 2px;
    }
    ul {
      margin: 2px 0 0 0;
      padding-left: 12px;
    }
    li {
      font-size: 10px;
      color: #374151;
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .skill-pill {
      font-size: 9.5px;
      font-weight: 600;
      color: ${primaryColor};
      background: #F8FAFC;
      border: 1px solid ${primaryColor}40;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${personalInfo.fullName || 'SHRAWAN KUMAR YADAV'}</div>
    <div class="title">${personalInfo.jobTitle || 'Senior Full-Stack & Mobile Architect'}</div>
    <div class="contacts">
      ${personalInfo.email ? `<span>✉️ ${personalInfo.email}</span>` : ''}
      ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
      ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
      ${personalInfo.linkedin ? `<a href="https://${personalInfo.linkedin}">LinkedIn</a>` : ''}
    </div>
  </div>

  ${summary ? `
  <div style="margin-bottom: 10px;">
    <div class="section-title">PROFESSIONAL SUMMARY</div>
    <div style="font-size: 10px; color: #374151; line-height: 1.4;">${summary}</div>
  </div>
  ` : ''}

  <div class="matrix">
    <div class="left-col">
      ${experiences && experiences.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <div class="section-title">WORK EXPERIENCE</div>
        ${experiences.map(e => `
          <div style="margin-bottom: 6px;">
            <div class="item-header">
              <span class="item-title">${e.jobTitle || ''}</span>
              <span class="item-date">${e.startDate || ''} – ${e.isCurrent ? 'Present' : e.endDate || ''}</span>
            </div>
            <div class="item-sub">${e.company || ''}</div>
            ${e.bullets && e.bullets.length > 0 ? `
              <ul>${e.bullets.filter(b => !!b).map(b => `<li>${b}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${projects && projects.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <div class="section-title">KEY PROJECTS</div>
        ${projects.map(p => `
          <div style="margin-bottom: 6px;">
            <div class="item-header">
              <span class="item-title">${p.title || ''}</span>
              ${p.link ? `<a href="${p.link}" style="font-size: 9.5px; color: ${primaryColor};">Repo/Live</a>` : ''}
            </div>
            ${p.description ? `<div style="font-size: 9.5px; color: #4B5563;">${p.description}</div>` : ''}
            ${p.bullets && p.bullets.length > 0 ? `
              <ul>${p.bullets.filter(b => !!b).map(b => `<li>${b}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <div class="right-col">
      ${skills && skills.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <div class="section-title">SKILLS & EXPERTISE</div>
        <div class="skills-wrap">
          ${skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
        </div>
      </div>
      ` : ''}

      ${educations && educations.length > 0 ? `
      <div style="margin-bottom: 10px;">
        <div class="section-title">EDUCATION</div>
        ${educations.map(e => `
          <div style="margin-bottom: 6px;">
            <div class="item-title">${e.degree || ''}</div>
            <div class="item-sub">${e.school || ''}</div>
            <div class="item-date">${e.startDate ? e.startDate + ' – ' : ''}${e.endDate || ''}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
};

export const exportOrPrintPdf = async (resume) => {
  const html = generateResumeHtml(resume);

  // 1. Mobile Phone (Android & iOS)
  if (Platform.OS !== 'web') {
    // Strategy A: Native File Copy to documentDirectory + Sharing
    try {
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      let shareUri = uri;
      try {
        const FileSystem = require('expo-file-system');
        if (FileSystem && FileSystem.documentDirectory) {
          const safeName = (resume?.title ? resume.title.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Resume') + '.pdf';
          const targetUri = `${FileSystem.documentDirectory}${safeName}`;
          await FileSystem.copyAsync({ from: uri, to: targetUri });
          shareUri = targetUri;
        }
      } catch (copyErr) {
        // Fallback to original uri
      }

      if (Sharing && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(shareUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `${resume?.title || 'Resume'} - Save PDF`,
        });
        return { success: true, message: 'PDF generated! Choose "Save to device" or files app.' };
      }
    } catch (shareErr) {
      console.warn('[PDF Export] Sharing fallback to native print spooler:', shareErr.message);
    }

    // Strategy B: Native System Print Spooler (Failsafe for Android & iOS)
    // Invokes Android's native "Save as PDF" dialog. Completely immune to Scoped Storage / FileProvider restrictions.
    try {
      await Print.printAsync({ html });
      return { success: true, message: 'System print dialog opened. Choose "Save as PDF" to download!' };
    } catch (printErr) {
      console.error('[PDF Export] Print failed:', printErr);
      return { success: false, message: printErr.message || 'Could not open PDF export dialog.' };
    }
  }

  // 2. Web browser fallback
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
      return { success: true, message: 'Print/Save dialog opened! Choose "Save as PDF".' };
    }
  }

  return { success: false, message: 'PDF generator could not open print dialog.' };
};

export default { generateResumeHtml, exportOrPrintPdf };
