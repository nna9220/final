package com.web.utils;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

import java.io.*;

@Component
public class FileFactory {
    public static final String PATH_TEMPLATE = "C:/Users/DELL/Pictures/";
    public static File createFile(String fileName, Workbook workbook) throws IOException {
        workbook =  new XSSFWorkbook();
        OutputStream out = new FileOutputStream(PATH_TEMPLATE + fileName);
        workbook.write(out);
        return ResourceUtils.getFile(PATH_TEMPLATE + fileName);
    }
}
