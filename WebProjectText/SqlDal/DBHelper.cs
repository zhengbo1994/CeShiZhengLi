using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;

namespace SqlDal
{
    public class DBHelper
    {
        public static class SqlHelper
        {
            private static readonly string conStr = ConfigurationManager.ConnectionStrings["sql"].ConnectionString;

            //insert delete update
            public static int ExecuteNonQuery(string sql, CommandType cmdType, params SqlParameter[] pms)
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.CommandType = cmdType;
                        if (pms != null)
                        {
                            cmd.Parameters.AddRange(pms);
                        }
                        con.Open();
                        return cmd.ExecuteNonQuery();
                    }
                }
            }

            //返回单个值
            public static object ExecuteScalar(string sql, CommandType cmdType, params SqlParameter[] pms)
            {
                using (SqlConnection con = new SqlConnection(conStr))
                {
                    using (SqlCommand cmd = new SqlCommand(sql, con))
                    {
                        cmd.CommandType = cmdType;
                        if (pms != null)
                        {
                            cmd.Parameters.AddRange(pms);
                        }
                        con.Open();
                        return cmd.ExecuteScalar();
                    }
                }
            }

            //执行返回DataReader
            public static SqlDataReader ExecuteReader(string sql, CommandType cmdType, params SqlParameter[] pms)
            {
                SqlConnection con = new SqlConnection(conStr);
                using (SqlCommand cmd = new SqlCommand(sql, con))
                {
                    cmd.CommandType = cmdType;
                    if (pms != null)
                    {
                        cmd.Parameters.AddRange(pms);
                    }
                    //con.Open();
                    try
                    {
                        if (con.State == ConnectionState.Closed)
                        {
                            con.Open();
                        }
                        return cmd.ExecuteReader(CommandBehavior.CloseConnection);
                    }
                    catch
                    {
                        con.Close();
                        con.Dispose();
                        throw;
                    }
                }
            }

            public static DataTable ExecuteDataTable(string sql, CommandType cmdType, params SqlParameter[] pms)
            {
                DataTable dt = new DataTable();
                using (SqlDataAdapter adapter = new SqlDataAdapter(sql, conStr))
                {
                    adapter.SelectCommand.CommandType = cmdType;
                    if (pms != null)
                    {
                        adapter.SelectCommand.Parameters.AddRange(pms);
                    }
                    adapter.Fill(dt);
                }
                return dt;
            }

            public static DataSet ExecuteDataSet(string sql, CommandType cmdType)
            {
                DataSet ds = new DataSet();
                using (SqlDataAdapter adapter = new SqlDataAdapter(sql, conStr))
                {
                    adapter.SelectCommand.CommandType = cmdType;
                    adapter.Fill(ds);
                }
                return ds;
            }
        }
    }
}
