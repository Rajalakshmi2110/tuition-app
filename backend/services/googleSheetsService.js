const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Student Marks';

let sheetsClient = null;

const getClient = async () => {
  if (sheetsClient) return sheetsClient;
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return null;

  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
};

const ensureHeaders = async (sheets) => {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:J1`
    });
    if (!res.data.values || res.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:J1`,
        valueInputOption: 'RAW',
        resource: {
          values: [['Student Name', 'Email', 'Class', 'Subject', 'Exam Type', 'Total Marks', 'Obtained Marks', 'Percentage', 'Grade', 'Exam Date', 'Term', 'Academic Year', 'Updated At']]
        }
      });
    }
  } catch (e) {
    if (e.message?.includes('Unable to parse range')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }
      }).catch(() => {});
      await ensureHeaders(sheets);
    }
  }
};

const syncToSheet = async (performance, student) => {
  try {
    const sheets = await getClient();
    if (!sheets || !SPREADSHEET_ID) return;

    await ensureHeaders(sheets);

    const row = [
      student?.name || 'Unknown',
      student?.email || '',
      student?.className || '',
      performance.subject,
      performance.examType,
      performance.totalMarks,
      performance.obtainedMarks,
      performance.percentage?.toFixed(1) || ((performance.obtainedMarks / performance.totalMarks) * 100).toFixed(1),
      performance.grade,
      new Date(performance.examDate).toLocaleDateString('en-IN'),
      performance.term,
      performance.academicYear,
      new Date().toLocaleString('en-IN')
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'RAW',
      resource: { values: [row] }
    });
  } catch (e) {
    console.error('Google Sheets sync failed:', e.message);
  }
};

module.exports = { syncToSheet };
