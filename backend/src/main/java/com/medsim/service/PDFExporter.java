package com.medsim.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.medsim.model.EvaluationReport;
import com.medsim.model.Session;
import com.medsim.model.Student;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

/**
 * PDFExporter — Generates a formatted PDF evaluation report using iText 7.
 *
 * Called from the API layer when the student clicks "Save Report as PDF".
 * The student chooses where to save it via the React frontend file dialog.
 */
public class PDFExporter {

    // Brand colors
    private static final DeviceRgb COLOR_PRIMARY    = new DeviceRgb(30, 90, 160);   // Deep blue
    private static final DeviceRgb COLOR_PASS       = new DeviceRgb(39, 174, 96);   // Green
    private static final DeviceRgb COLOR_FAIL       = new DeviceRgb(231, 76, 60);   // Red
    private static final DeviceRgb COLOR_LIGHT_GREY = new DeviceRgb(245, 245, 245);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    /**
     * Exports an evaluation report to a PDF file.
     *
     * @param report      the completed evaluation report from groq
     * @param session     the session data (patient, department, timestamps)
     * @param student     the student who completed the session
     * @param outputPath  absolute path where the PDF should be saved
     * @throws RuntimeException if PDF creation fails
     */
    public void export(EvaluationReport report, Session session, Student student, String outputPath) {
        try (PdfWriter writer = new PdfWriter(outputPath);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document doc = new Document(pdfDoc)) {

            doc.setMargins(40, 50, 40, 50);

            addHeader(doc, student, session);
            addScoreSummary(doc, report);
            addDimensionScores(doc, report);
            addFeedback(doc, report);
            addFooter(doc);

            System.out.println("[PDFExporter] Report saved to: " + outputPath);

        } catch (IOException e) {
            throw new RuntimeException("[PDFExporter] Failed to write PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Generates the PDF in memory and returns the bytes for HTTP streaming.
     */
    public byte[] exportToBytes(EvaluationReport report, Session session, Student student) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdfDoc = new PdfDocument(writer);
             Document doc = new Document(pdfDoc)) {

            doc.setMargins(40, 50, 40, 50);
            addHeader(doc, student, session);
            addScoreSummary(doc, report);
            addDimensionScores(doc, report);
            addFeedback(doc, report);
            addFooter(doc);

        } catch (IOException e) {
            throw new RuntimeException("[PDFExporter] Failed to generate PDF bytes: " + e.getMessage(), e);
        }
        return baos.toByteArray();
    }

    // ── Private sections ──────────────────────────────────────────────────

    private void addHeader(Document doc, Student student, Session session) {
        // Title
        doc.add(new Paragraph("MedSim")
            .setFontSize(28).setBold()
            .setFontColor(COLOR_PRIMARY)
            .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("Clinical Evaluation Report")
            .setFontSize(14)
            .setFontColor(ColorConstants.DARK_GRAY)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(20));

        // Student info table
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        addInfoCell(infoTable, "Student Name", student.getFullName());
        addInfoCell(infoTable, "Student ID", student.getStudentId());
        addInfoCell(infoTable, "University", student.getUniversityName());
        addInfoCell(infoTable, "Patient", session.getPatientCharacter());
        addInfoCell(infoTable, "Department", session.getDepartment());
        addInfoCell(infoTable, "Date", session.getStartedAt() != null
                ? session.getStartedAt().format(DATE_FMT) : "N/A");

        doc.add(infoTable);
        doc.add(new Paragraph("\n"));
    }

    private void addScoreSummary(Document doc, EvaluationReport report) {
        boolean passed = report.isPassed();
        DeviceRgb scoreColor = passed ? COLOR_PASS : COLOR_FAIL;

        doc.add(new Paragraph("Overall Score: " + String.format("%.1f", report.getTotalScore()) + " / 100")
            .setFontSize(22).setBold()
            .setFontColor(scoreColor)
            .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("Grade: " + report.getGrade() + "   |   " + (passed ? "PASSED ✓" : "FAILED ✗"))
            .setFontSize(14).setBold()
            .setFontColor(scoreColor)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginBottom(20));
    }

    private void addDimensionScores(Document doc, EvaluationReport report) {
        doc.add(new Paragraph("Score Breakdown")
            .setFontSize(14).setBold()
            .setFontColor(COLOR_PRIMARY)
            .setMarginBottom(8));

        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        // Header row
        addTableHeader(table, "Dimension");
        addTableHeader(table, "Score");
        addTableHeader(table, "Max");

        addScoreRow(table, "History Taking",       report.getScoreHistoryTaking(), 25);
        addScoreRow(table, "Physical Examination", report.getScorePhysicalExam(),  20);
        addScoreRow(table, "Investigation Ordering", report.getScoreInvestigation(), 20);
        addScoreRow(table, "Diagnosis Accuracy",   report.getScoreDiagnosis(),     20);
        addScoreRow(table, "Prescription Quality", report.getScorePrescription(),  15);

        doc.add(table);
        doc.add(new Paragraph("\n"));
    }

    private void addFeedback(Document doc, EvaluationReport report) {
        // AI Feedback
        doc.add(new Paragraph("AI Feedback")
            .setFontSize(14).setBold().setFontColor(COLOR_PRIMARY));
        doc.add(new Paragraph(report.getAiFeedback() != null ? report.getAiFeedback() : "N/A")
            .setFontSize(11).setMarginBottom(12));

        // Model Answer
        doc.add(new Paragraph("Expert Model Answer")
            .setFontSize(14).setBold().setFontColor(COLOR_PRIMARY));
        doc.add(new Paragraph(report.getModelAnswer() != null ? report.getModelAnswer() : "N/A")
            .setFontSize(11).setMarginBottom(12));

        // Correct Actions
        if (report.getCorrectActionsJson() != null) {
            doc.add(new Paragraph("✓ Correct Actions")
                .setFontSize(12).setBold().setFontColor(COLOR_PASS));
            doc.add(new Paragraph(report.getCorrectActionsJson().replace("[\"", "").replace("\"]", "").replace("\",\"", "\n"))
                .setFontSize(10).setFontColor(COLOR_PASS).setMarginBottom(10));
        }

        // Missed Actions
        if (report.getMissedActionsJson() != null) {
            doc.add(new Paragraph("✗ Missed / Incorrect Actions")
                .setFontSize(12).setBold().setFontColor(COLOR_FAIL));
            doc.add(new Paragraph(report.getMissedActionsJson().replace("[\"", "").replace("\"]", "").replace("\",\"", "\n"))
                .setFontSize(10).setFontColor(COLOR_FAIL).setMarginBottom(10));
        }
    }

    private void addFooter(Document doc) {
        doc.add(new Paragraph("\nGenerated by MedSim — AI Virtual Patient Training System")
            .setFontSize(9)
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.CENTER));
    }

    // ── Table helpers ─────────────────────────────────────────────────────

    private void addInfoCell(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold().setFontSize(10))
                .setBackgroundColor(COLOR_LIGHT_GREY).setPadding(6));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "N/A").setFontSize(10))
                .setPadding(6));
    }

    private void addTableHeader(Table table, String text) {
        table.addHeaderCell(new Cell()
            .add(new Paragraph(text).setBold().setFontColor(ColorConstants.WHITE).setFontSize(11))
            .setBackgroundColor(COLOR_PRIMARY).setPadding(8));
    }

    private void addScoreRow(Table table, String dimension, double score, int max) {
        DeviceRgb rowColor = (score / max >= 0.7) ? COLOR_PASS : COLOR_FAIL;
        table.addCell(new Cell().add(new Paragraph(dimension).setFontSize(10)).setPadding(6));
        table.addCell(new Cell().add(new Paragraph(String.format("%.1f", score))
                .setFontColor(rowColor).setBold().setFontSize(10)).setPadding(6));
        table.addCell(new Cell().add(new Paragraph(String.valueOf(max)).setFontSize(10)).setPadding(6));
    }
}
