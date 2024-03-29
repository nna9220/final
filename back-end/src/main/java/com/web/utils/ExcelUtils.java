package com.web.utils;

import com.web.entity.Subject;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.lang.reflect.Field;
import java.util.List;

import static com.web.utils.FileFactory.PATH_TEMPLATE;
@Slf4j
@Component
public class ExcelUtils {
    public static ByteArrayInputStream exportSubject(List<Subject> subjects, String fileName) throws IOException {
        XSSFWorkbook xssfWorkbook = new XSSFWorkbook();
        File file;
        FileInputStream fileInputStream;
        try {
            file = ResourceUtils.getFile(PATH_TEMPLATE + fileName);
            fileInputStream = new FileInputStream(file);

        }catch (Exception e){
            log.info("FILE NOT FOUND");
            file = FileFactory.createFile(fileName, xssfWorkbook);
            fileInputStream = new FileInputStream(file);
        }
        XSSFSheet newSheet = xssfWorkbook.createSheet("sheet1");
        newSheet.createFreezePane(4,2,4,2);
        XSSFFont titleFont = xssfWorkbook.createFont();
        titleFont.setFontName("Arial");
        titleFont.setBold(true);
        titleFont.setFontHeight((short)14);
        XSSFCellStyle titleCellStyle = xssfWorkbook.createCellStyle();
        titleCellStyle.setAlignment(HorizontalAlignment.CENTER);
        titleCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        titleCellStyle.setFillForegroundColor(IndexedColors.SKY_BLUE.index);
        titleCellStyle.setBorderBottom(BorderStyle.MEDIUM);
        titleCellStyle.setBorderLeft(BorderStyle.MEDIUM);
        titleCellStyle.setBorderRight(BorderStyle.MEDIUM);
        titleCellStyle.setBorderTop(BorderStyle.MEDIUM);
        titleCellStyle.setFont(titleFont);
        titleCellStyle.setWrapText(true);

        XSSFFont dataFont = xssfWorkbook.createFont();
        dataFont.setFontName("Arial");
        dataFont.setBold(false);
        dataFont.setFontHeightInPoints((short) 10);

        XSSFCellStyle dataCellStyle = xssfWorkbook.createCellStyle();
        dataCellStyle.setAlignment(HorizontalAlignment.CENTER);
        dataCellStyle.setBorderBottom(BorderStyle.THIN);
        dataCellStyle.setBorderLeft(BorderStyle.THIN);
        dataCellStyle.setBorderRight(BorderStyle.THIN);
        dataCellStyle.setBorderTop(BorderStyle.THIN);
        dataCellStyle.setFont(dataFont);
        dataCellStyle.getCoreXf().unsetBorderId();
        dataCellStyle.getCoreXf().unsetFillId();
        dataCellStyle.setWrapText(true);

        insertFieldNameAsTitleToWorkbook(ExportConfig.subjectExport.getCellExportConfigList(),newSheet, titleCellStyle);

        insertDataToWork(xssfWorkbook, ExportConfig.subjectExport, subjects, dataCellStyle);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        xssfWorkbook.write(outputStream);
        outputStream.close();
        fileInputStream.close();
        return new ByteArrayInputStream(outputStream.toByteArray());

    }

    private static <T> void insertDataToWork(Workbook workbook, ExportConfig exportConfig, List<T> datas,
                                             XSSFCellStyle dataCellStyle){
        int startRowIndex = exportConfig.getStartRow();
        int sheetIndex = exportConfig.getSheetIndex();
        Class clazz = exportConfig.getDataClazz();
        List<CellConfig> cellConfigs = exportConfig.getCellExportConfigList();
        Sheet sheet = workbook.getSheetAt(sheetIndex);
        int currentRowIndex = startRowIndex;
        for (T data:datas){
            Row currentRow = sheet.getRow(currentRowIndex);
            if (ObjectUtils.isEmpty(currentRow)){
                currentRow = sheet.createRow(currentRowIndex);
            }
            insertDataToCell(data,currentRow,cellConfigs,clazz,sheet,dataCellStyle);
            currentRowIndex++;
        }
    }
    private static <T> void insertFieldNameAsTitleToWorkbook(List<CellConfig> cellConfigs,
                                                             Sheet sheet,
                                                             XSSFCellStyle titleCellStyle){
        int currentRow = sheet.getTopRow();
        Row row = sheet.createRow(currentRow);
        int i = 0;
        sheet.autoSizeColumn(currentRow);
        for (CellConfig cellConfig:cellConfigs){
            Cell currentCell = row.createCell(i);
            String fieldName = cellConfig.getFieldName();
            currentCell.setCellValue(fieldName);
            currentCell.setCellStyle(titleCellStyle);
            sheet.autoSizeColumn(i);
            i++;
        }
    }

    private static <T> void insertDataToCell(T data, Row currentRow,
                                             List<CellConfig> cellConfigs,
                                             Class clazz,
                                             Sheet sheet,
                                             XSSFCellStyle dataStyle){
        for (CellConfig cellConfig:cellConfigs){
            Cell currentCell = currentRow.getCell(cellConfig.getColumnIndex());
            if (ObjectUtils.isEmpty(currentCell)){
                currentCell = currentRow.createCell(cellConfig.getColumnIndex());
            }
            String cellValue = getCellValue(data,cellConfig,clazz);

            currentCell.setCellValue(cellValue);
            sheet.autoSizeColumn(cellConfig.getColumnIndex());
            currentCell.setCellStyle(dataStyle);

        }
    }

    private static <T> String getCellValue(T data, CellConfig cellConfig,Class clazz){
        String fieldName = cellConfig.getFieldName();
        try {
            Field field = getDeclaredField(clazz,fieldName);
            if (ObjectUtils.isEmpty(field)){
                field.setAccessible(true);
                return !ObjectUtils.isEmpty(field.get(data)) ? field.get(data).toString() :"";
            }
            return "";
        }catch (Exception e){
            log.info("" + e);
            return "";
        }
    }

    private static Field getDeclaredField(Class clazz,String fieldName){
        if (ObjectUtils.isEmpty(clazz) || ObjectUtils.isEmpty(fieldName)){
            return null;

        }
        do {
            try {
                Field field = clazz.getDeclaredField(fieldName);
                field.setAccessible(true);
                return field;
            }catch (Exception e){
                log.info("" + e);
            }
        }while ((clazz = clazz.getSuperclass()) != null);
        return null;
    }
}
