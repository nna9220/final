package com.web.utils;

import com.web.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExportConfig {
    private int sheetIndex;
    private int startRow;
    private Class dataClazz;
    private List<CellConfig> cellExportConfigList;
    public static final ExportConfig subjectExport;
    static {
        subjectExport = new ExportConfig();
        subjectExport.setSheetIndex(0);
        subjectExport.setStartRow(1);
        subjectExport.setDataClazz(Subject.class);
        List<CellConfig> subjectCellConfig = new ArrayList<>();
        subjectCellConfig.add(new CellConfig(0,"subjectId"));
        subjectCellConfig.add(new CellConfig(1,"subjectName"));
        subjectCellConfig.add(new CellConfig(2,"major"));
        /*subjectCellConfig.add(new CellConfig(3,"instructorId"));
        subjectCellConfig.add(new CellConfig(4,"thesisAdvisorId"));*/
        subjectCellConfig.add(new CellConfig(3,"score"));
        subjectCellConfig.add(new CellConfig(4,"review"));
        subjectCellConfig.add(new CellConfig(5,"requirement"));
        subjectCellConfig.add(new CellConfig(6,"expected"));/*
        subjectCellConfig.add(new CellConfig(9,"typeSubject"));
        subjectCellConfig.add(new CellConfig(10,"student1"));
        subjectCellConfig.add(new CellConfig(11,"student2"));*/
        subjectExport.setCellExportConfigList(subjectCellConfig);
    }
/*    static {
        subjectExport = new ExportConfig();
        subjectExport.setSheetIndex(0);
        subjectExport.setStartRow(1);
        subjectExport.setDataClazz(Subject.class);
        List<CellConfig>
    }*/
}
