using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Common.baseFn;
using System.Data;
using System.Data.OleDb;
using Microsoft.Office.Interop.Excel;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;

namespace Common
{
    public class ExcelHelper
    {
        private string fileName = null; //文件名
        private IWorkbook workbook = null;
        private FileStream fs = null;
        private bool disposed;

        private const string CONST_CONNECTIONSTRING = "Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=Excel 8.0;data source={0}";

        public string ExcelFilePath { get; set; }

        public ExcelHelper()
        { }

        public ExcelHelper(string path)
        {
            if (!path.IsNull())
            {
                ExcelFilePath = path;
                this.fileName = path;
                disposed = false;
            }
        }

        public List<Cell> GetExcelValueList(string sheetName)
        {
            if (ExcelFilePath.IsNull())
            {
                throw new Exception("请指定Excel文件路径");
            }

            string conString = String.Format(CONST_CONNECTIONSTRING, ExcelFilePath);

            string sql = String.Format("select * from [{0}$]", sheetName);

            DataSet dataSet = new DataSet();
            OleDbDataAdapter adapter = new OleDbDataAdapter(sql, conString);
            adapter.Fill(dataSet);

            System.Data.DataTable table = dataSet.Tables[0];

            int rowNumber = 1;

            List<Cell> cellListResult = new List<Cell>();

            foreach (DataRow row in table.Rows)
            {
                foreach (DataColumn column in table.Columns)
                {
                    string columnName = column.ColumnName;
                    string columnValue = row[columnName].ToString();

                    Cell cell = new Cell()
                    {
                        RowNumber = rowNumber,
                        CellName = columnName,
                        CellValue = columnValue
                    };
                    cellListResult.Add(cell);
                }
                rowNumber += 1;
            }

            return cellListResult;
        }

        public void InsertExcelValueList(string sheetName, List<Cell> cellList)
        {
            const string script = "insert into [{0}$] ({1}) values ({2}) ";
            string sql = "";

            List<int> rowNumberList = cellList.Select(p => p.RowNumber).Distinct().ToList();

            foreach (int rowNumber in rowNumberList)
            {
                List<Cell> cellListForRow = cellList.Where(p => p.RowNumber == rowNumber).ToList();
                List<string> cellNameList = cellListForRow.Select(p => p.CellName).ToList();
                List<string> cellValueList = cellListForRow.Select(p => "'" + p.CellValue + "'").ToList();
                sql += String.Format(script, sheetName, String.Join(",", cellNameList), String.Join(",", cellValueList));
            }

            string conString = String.Format(CONST_CONNECTIONSTRING, ExcelFilePath);
            OleDbConnection con = new OleDbConnection(conString);
            OleDbCommand cmd = new OleDbCommand(sql, con);
            try
            {
                con.Open();
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                con.Close();
            }

        }

        public class Cell
        {
            public int RowNumber { get; set; }

            public string CellName { get; set; }

            public string CellValue { get; set; }
        }

        #region 文件转PDF
        public bool ConvertToPDF(string sourcePath, string targetPath)
        {
            return true;
            //return ConvertToPDF(sourcePath, targetPath, XlFixedFormatType.xlTypePDF);
        }



        //private bool ConvertToPDF(string sourcePath, string targetPath, XlFixedFormatType targetType)
        //{
        //    bool result;
        //    object missing = Type.Missing;
        //    Microsoft.Office.Interop.Excel.ApplicationClass application = null;
        //    Workbook workBook = null;
        //    try
        //    {
        //        application = new Microsoft.Office.Interop.Excel.ApplicationClass();
        //        object target = targetPath;
        //        object type = targetType;
        //        workBook = application.Workbooks.Open(sourcePath, missing, missing, missing, missing, missing,
        //            missing, missing, missing, missing, missing, missing, missing, missing, missing);

        //        workBook.ExportAsFixedFormat(targetType, target, XlFixedFormatQuality.xlQualityStandard, true, false, missing, missing, missing, missing);
        //        result = true;
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //    finally
        //    {
        //        if (workBook != null)
        //        {
        //            workBook.Close(true, missing, missing);
        //            workBook = null;
        //        }
        //        if (application != null)
        //        {
        //            application.Quit();
        //            application = null;
        //        }
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //        GC.Collect();
        //        GC.WaitForPendingFinalizers();
        //    }
        //}


        #endregion


        /// <summary>
        /// 将DataTable数据导入到excel中
        /// </summary>
        /// <param name="data">要导入的数据</param>
        /// <param name="isColumnWritten">DataTable的列名是否要导入</param>
        /// <param name="sheetName">要导入的excel的sheet的名称</param>
        /// <returns>导入数据行数(包含列名那一行)</returns>
        public int DataTableToExcel(System.Data.DataTable data, string sheetName, bool isColumnWritten)
        {
            int i = 0;
            int j = 0;
            int count = 0;
            ISheet sheet = null;

            fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite);
            if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                workbook = new XSSFWorkbook();
            else if (fileName.IndexOf(".xls") > 0) // 2003版本
                workbook = new HSSFWorkbook();

            try
            {
                if (workbook != null)
                {
                    sheet = workbook.CreateSheet(sheetName);
                }
                else
                {
                    return -1;
                }

                if (isColumnWritten == true) //写入DataTable的列名
                {
                    IRow row = sheet.CreateRow(0);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Columns[j].ColumnName);
                    }
                    count = 1;
                }
                else
                {
                    count = 0;
                }

                for (i = 0; i < data.Rows.Count; ++i)
                {
                    IRow row = sheet.CreateRow(count);
                    for (j = 0; j < data.Columns.Count; ++j)
                    {
                        row.CreateCell(j).SetCellValue(data.Rows[i][j].ToString());
                    }
                    ++count;
                }
                workbook.Write(fs); //写入到excel
                return count;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return -1;
            }
        }

        /// <summary>
        /// 将excel中的数据导入到DataTable中
        /// </summary>
        /// <param name="sheetName">excel工作薄sheet的名称</param>
        /// <param name="isFirstRowColumn">第一行是否是DataTable的列名</param>
        /// <returns>返回的DataTable</returns>
        public System.Data.DataTable ExcelToDataTable(string sheetName, bool isFirstRowColumn)
        {
            ISheet sheet = null;
            System.Data.DataTable data = new System.Data.DataTable();
            int startRow = 0;
            try
            {
                fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                if (fileName.IndexOf(".xlsx") > 0) // 2007版本
                    workbook = new XSSFWorkbook(fs);
                else if (fileName.IndexOf(".xls") > 0) // 2003版本
                    workbook = new HSSFWorkbook(fs);

                if (sheetName != null)
                {
                    sheet = workbook.GetSheet(sheetName);
                    if (sheet == null) //如果没有找到指定的sheetName对应的sheet，则尝试获取第一个sheet
                    {
                        sheet = workbook.GetSheetAt(0);
                    }
                }
                else
                {
                    sheet = workbook.GetSheetAt(0);
                }
                if (sheet != null)
                {
                    IRow firstRow = sheet.GetRow(0);
                    int cellCount = firstRow.LastCellNum; //一行最后一个cell的编号 即总的列数

                    if (isFirstRowColumn)
                    {
                        for (int i = firstRow.FirstCellNum; i < cellCount; ++i)
                        {
                            ICell cell = firstRow.GetCell(i);
                            if (cell != null)
                            {
                                string cellValue = cell.StringCellValue;
                                if (cellValue != null)
                                {
                                    DataColumn column = new DataColumn(cellValue);
                                    data.Columns.Add(column);
                                }
                            }
                        }
                        startRow = sheet.FirstRowNum + 1;
                    }
                    else
                    {
                        startRow = sheet.FirstRowNum;
                    }

                    //最后一列的标号
                    int rowCount = sheet.LastRowNum;
                    for (int i = startRow; i <= rowCount; ++i)
                    {
                        IRow row = sheet.GetRow(i);
                        if (row == null) continue; //没有数据的行默认是null　　　　　　　

                        DataRow dataRow = data.NewRow();
                        for (int j = row.FirstCellNum; j < cellCount; ++j)
                        {
                            if (row.GetCell(j) != null) //同理，没有数据的单元格都默认是null
                                dataRow[j] = row.GetCell(j).ToString();
                        }
                        data.Rows.Add(dataRow);
                    }
                }

                return data;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception: " + ex.Message);
                return null;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    if (fs != null)
                        fs.Close();
                }

                fs = null;
                disposed = true;
            }
        }
    }


}
