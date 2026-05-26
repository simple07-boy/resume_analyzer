import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePDF = (data) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.text('AI Resume Analyzer Report', 20, 20);

  // Date
  const currentDate = new Date().toLocaleString();

  doc.setFontSize(12);
  doc.text(`Generated On: ${currentDate}`, 20, 30);

  // ATS Score
  doc.setFontSize(16);
  doc.text(`ATS Score: ${data.ats_score}%`, 20, 45);

  // Matched Skills
  doc.setFontSize(14);
  doc.text('Matched Skills', 20, 60);

  autoTable(doc, {
    startY: 65,
    head: [['Skills']],
    body: data.matched_skills.map((skill) => [skill]),
  });

  // Missing Skills
  const missingStartY = doc.lastAutoTable.finalY + 15;

  doc.text('Missing Skills', 20, missingStartY);

  autoTable(doc, {
    startY: missingStartY + 5,
    head: [['Skills']],
    body: data.missing_skills.map((skill) => [skill]),
  });

  // Suggestions
  const suggestionStartY = doc.lastAutoTable.finalY + 15;

  doc.text('Suggestions', 20, suggestionStartY);

  autoTable(doc, {
    startY: suggestionStartY + 5,
    head: [['Suggestions']],
    body: data.suggestions.map((suggestion) => [suggestion]),
  });

  // Interview Questions
  const questionStartY = doc.lastAutoTable.finalY + 15;

  doc.text('Interview Questions', 20, questionStartY);

  autoTable(doc, {
    startY: questionStartY + 5,
    head: [['Questions']],
    body: data.interview_questions.map((question) => [question]),
  });

  // Save PDF
  doc.save('ATS_Report.pdf');
};

export default generatePDF;
