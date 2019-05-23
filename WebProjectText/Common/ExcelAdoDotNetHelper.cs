using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.OleDb;

namespace Common
{
    public class ExcelAdoDotNetHelper : IDisposable
    {
        private string _connectionString { get; set; }
        private OleDbConnection _conn = null;
        private OleDbCommand _cmd = null;
        public ExcelAdoDotNetHelper()
            : this("Microsoft.ACE.OLEDB.12.0", "Excel 8.0;HDR=yes;IMEX=2")
        {

        }
        public ExcelAdoDotNetHelper(string provider, string extendedProperties)
        {
            _connectionString = "Provider={provider};Data Source={0};Extended Properties='{extendedProperties}';"
                .Replace("{provider}", provider)
                .Replace("{extendedProperties}", extendedProperties);
        }

        public void Open(string filePath)
        {
            this.Close();
            string connStr = string.Format(_connectionString, filePath);
            _conn = new OleDbConnection(connStr);
            _cmd = new OleDbCommand();
            _cmd.Connection = _conn;
            _cmd.CommandTimeout = _conn.ConnectionTimeout;
            _conn.Open();
        }

        public int ExecuteNonQuery(string sql, Dictionary<string, object> para = null)
        {
            _cmd.CommandType = System.Data.CommandType.Text;
            _cmd.CommandText = sql;
            _cmd.Parameters.Clear();
            if (para != null)
            {
                foreach (KeyValuePair<string, object> kv in para)
                {
                    _cmd.Parameters.Add(kv.Key, kv.Value);
                }
            }
            return _cmd.ExecuteNonQuery();
        }

        public void Close()
        {
            try
            {
                if (null != _cmd)
                {
                    _cmd.Dispose();
                }
                if (null != _conn)
                {
                    if (_conn.State == System.Data.ConnectionState.Open)
                    {
                        _conn.Close();
                    }
                }
            }
            finally
            {
                _cmd = null;
                _conn = null;
                GC.Collect();
            }
        }

        public void Dispose()
        {
            this.Close();
        }
    }
}
