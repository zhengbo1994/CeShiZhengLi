using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Common
{
    /// <summary>
    /// 日志帮助类
    /// </summary>
    public class LogHelper
    {
        /// <summary>
        /// 最大日志文件大小（字节）
        /// </summary>
        public int MaxFileSize = 100 * 1024 * 1024;
        /// <summary>
        /// 日志文件夹路径
        /// </summary>
        public string LogFileFolderPath = "";

        private int _fileRemainDays = 7;
        /// <summary>
        /// 日志文件保留天数
        /// </summary>
        public int FileRemainDays
        {
            get
            {
                return this._fileRemainDays;
            }
            set
            {
                if (value < 1)
                {
                    throw new ArgumentException("必须大于等于1", "FileRemainDays");
                }
                this._fileRemainDays = value;
            }
        }
        private static object objlck = new object();

        /// <summary>
        /// 当前日志文件名
        /// </summary>
        public string CurrentLogFileName
        {
            get
            {
                return DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
            }
        }

        /// <summary>
        /// 当前日志文件全路径
        /// </summary>
        public string CurrentLogFilePath
        {
            get
            {
                return LogFileFolderPath.TrimEnd('\\') + "\\" + CurrentLogFileName;
            }
        }

        /// <summary>
        /// 初始化LogHelper类，读取"LogFolderPath"配置节点作为日志文件夹路径
        /// </summary>
        public LogHelper()
        {
            try
            {
                LogFileFolderPath = System.Configuration.ConfigurationManager.AppSettings["LogFolderPath"];
                if (string.IsNullOrEmpty(LogFileFolderPath))
                {
                    throw new Exception("未找到日志路径配置：\"LogFolderPath\"");
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logFileFolderPath">日志文件夹路径</param>
        public LogHelper(string logFileFolderPath)
        {
            try
            {
                if (string.IsNullOrEmpty(logFileFolderPath))
                {
                    throw new ArgumentException("参数错误", "logFileFolderPath");
                }
                this.LogFileFolderPath = logFileFolderPath;
            }
            catch { throw; }
        }

        /// <summary>
        /// 记录日志
        /// </summary>
        /// <param name="exception"></param>
        public void WriteLog(Exception exception)
        {
            try
            {
                string logContent = string.Format("{0}\r\n{1}\r\n{2}\r\n{3}", exception.Message, exception.Source, exception.TargetSite, exception.StackTrace);
                this.WriteLog(CurrentLogFilePath, logContent);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 记录日志
        /// </summary>
        /// <param name="msg"></param>
        public void WriteLog(string msg)
        {
            this.WriteLog(CurrentLogFilePath, msg);
        }

        /// <summary>
        /// 记录日志
        /// </summary>
        /// <param name="logFilePath"></param>
        /// <param name="msg"></param>
        public void WriteLog(string logFilePath, string msg)
        {
            string filePostfix = logFilePath.Substring(logFilePath.LastIndexOf('.') + 1);
            try
            {
                System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(this.LogFileFolderPath);
                if (!dir.Exists)
                {
                    System.Security.AccessControl.DirectorySecurity ds = new System.Security.AccessControl.DirectorySecurity();

                    //Everyone账户
                    System.Security.Principal.SecurityIdentifier sid = new System.Security.Principal.SecurityIdentifier(System.Security.Principal.WellKnownSidType.WorldSid, null);
                    System.Security.Principal.NTAccount acct = sid.Translate(typeof(System.Security.Principal.NTAccount)) as System.Security.Principal.NTAccount;
                    ds.AddAccessRule(
                        new System.Security.AccessControl.FileSystemAccessRule(
                            acct
                            , System.Security.AccessControl.FileSystemRights.FullControl
                            , System.Security.AccessControl.AccessControlType.Allow)
                        );
                    dir.Create(ds);
                }
                else
                {
                    System.Threading.Thread t = new System.Threading.Thread(new System.Threading.ThreadStart(() =>
                    {
                        DeleteOldFiles();
                    }));
                    t.Start();
                    t.Join();
                }
                if (!string.Equals("txt", filePostfix, StringComparison.OrdinalIgnoreCase))
                {
                    throw new Exception("仅支持txt文件");
                }
                bool bAppend = true;
                System.IO.FileInfo f = new System.IO.FileInfo(logFilePath);
                if (!f.Exists || f.Length > this.MaxFileSize)//文件太大，清空旧内容
                {
                    bAppend = false;
                }

                lock (objlck)
                {
                    using (System.IO.StreamWriter sw = new System.IO.StreamWriter(logFilePath, bAppend))
                    {
                        string logContent = string.Format("\r\n======================="
                                       + "\r\n{0}"
                                       + "\r\n{1}"
                                       + "\r\n=======================\r\n", DateTime.Now.ToString("[yyyy-MM-dd HH:mm:ss] "), msg);
                        sw.Write(logContent);
                        sw.Flush();
                        sw.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 清理旧文件
        /// </summary>
        public void DeleteOldFiles()
        {
            System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(LogFileFolderPath);
            try
            {
                IEnumerable<System.IO.FileInfo> files = dir.EnumerateFiles("*.txt", System.IO.SearchOption.TopDirectoryOnly);
                foreach (var f in files)
                {
                    if (f.CreationTime.AddDays(FileRemainDays) < DateTime.Now)
                    {
                        try
                        {
                            f.Attributes = System.IO.FileAttributes.Normal;
                            f.Delete();
                        }
                        catch { continue; }
                    }
                }
            }
            catch { throw; }
        }
    }
}