using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Dapper;
using System.Configuration;
using System.Data;
using System.Reflection;
using System.Web;

namespace DapperDal
{
    public class BaseService<TEntity> : IDisposable, IBaseService<TEntity> where TEntity : class, new()
    {
        public BaseService()
        {
            _dbBase = new DbBase(System.Configuration.ConfigurationManager.AppSettings["DbContext"], DBType.Oracle);
        }
        public BaseService(string connectionStringName)
        {
            _dbBase = new DbBase(connectionStringName);
        }

        public BaseService(string connectionString, DBType dbType)
        {
            _dbBase = new DbBase(connectionString, dbType);
        }

        public bool Transaction(Action<IDbTransaction> action, Action successCallback = null, Action<Exception> failCallback = null)
        {


            using (var dbTransaction = DbConnection.BeginTransaction())
            {
                try
                {
                    action(dbTransaction);
                    dbTransaction.Commit();
                    if (successCallback != null)
                    {
                        successCallback();
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    if (failCallback != null)
                    {
                        failCallback(ex);
                    }
                    return false;
                }
            }
        }

        private DbBase _dbBase;
        public DbBase DbBase
        {
            get
            {
                if (_dbBase == null)
                {
                    throw new NullReferenceException("dbBase is null");
                }

                return _dbBase;
            }
        }

        public Tuple<bool, string> Create(TEntity model)
        {

            var sql = GenerateInsertSql();
            DbConnection.Execute(sql, model);
            return new Tuple<bool, string>(true, "");
        }

        public Tuple<bool, string> Create(TEntity model, IDbTransaction transaction)
        {


            var sql = GenerateInsertSql();
            transaction.Connection.Execute(sql, model, transaction);
            return new Tuple<bool, string>(true, "");
        }
        public IDbConnection DbConnection
        {
            get
            {
                return _dbBase.DbConnecttion;
            }
        }


        public virtual void Dispose()
        {
            if (DbConnection.State == ConnectionState.Open)
            {
                DbConnection.Close();
            }
            if (_dbBase != null)
            {
                _dbBase = null;
            }
        }

        public IList<TEntity> GetAllList()
        {


            var sql = string.Format("SELECT * FROM {0} WHERE 1=1 ", typeof(TEntity).Name);
            return DbConnection.Query<TEntity>(sql).ToList();
        }

        private Type _type;
        public Type Type
        {
            get
            {
                if (_type == null)
                {
                    _type = typeof(TEntity);
                }
                return _type;
            }
        }

        private PropertyInfo[] _props;
        public PropertyInfo[] Props
        {
            get
            {
                if (_props == null)
                {
                    _props = Type.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.GetProperty | BindingFlags.SetProperty);
                    if (_props == null
                    || !_props.Any())
                    {
                        throw new Exception(Type.Name + "未找到任何属性");
                    }
                }
                return _props;
            }
        }


        // <summary>
        /// 生成Sql语句
        /// </summary>
        /// <returns></returns>
        private string GenerateInsertSql()
        {
            var sql = new StringBuilder();
            sql.AppendFormat("INSERT INTO {0}", Type.Name);
            sql.Append("(");
            sql.Append(string.Join(",", Props.Select(p => "" + p.Name + "")));
            sql.Append(")");
            sql.Append("VALUES");
            sql.Append("(");
            sql.Append(string.Join(",", Props.Select(p => _dbBase.ParamPrefix + p.Name)));
            sql.Append(")");
            return sql.ToString();
        }

        // <summary>
        /// 生成Sql语句
        /// </summary>
        /// <returns></returns>
        private string GenerateUpdateSql()
        {
            var sql = new StringBuilder();
            sql.AppendFormat("UPDATE {0}", Type.Name);
            sql.Append(" SET ");
            sql.Append(string.Join(",", Props.Select(p => p.Name + "=" + _dbBase.ParamPrefix + p.Name)));
            sql.AppendFormat(" WHERE {0}=" + _dbBase.ParamPrefix + "{0}", GetPrimaryProp().Name);
            return sql.ToString();
        }


        public virtual IList<TEntity> GetPagesList(string where, int pageSize, int pageIndex, string sortField, string direction, out int total)
        {
            #region SqlServer
            //var sql = new StringBuilder();
            //var alias = "A";
            ////获取总记录数
            //sql.AppendFormat("SELECT COUNT(1) FROM [{0}] WHERE 1=1 ", Type.Name);
            //if (!string.IsNullOrEmpty(where))
            //{
            // sql.Append(where);
            //}
            //total = Convert.ToInt32(DbConnection.ExecuteScalar(sql.ToString()));
            //sql.Clear();

            //sql.AppendFormat("WITH [{0}] AS", alias);
            //sql.Append("(");
            //var sort = "";
            //if (!string.IsNullOrEmpty(sortField)
            // && !string.IsNullOrEmpty(direction))
            //{
            // sort += string.Format(" OVER(ORDER BY {0} {1}) ", sortField, direction);
            //}
            //else
            //{
            // sort += string.Format(" OVER(ORDER BY {0} DESC)", GetPrimaryProp().Name);
            //}
            //sql.AppendFormat(" SELECT ROW_NUMBER() {0} AS RowNumber,*", sort);
            //sql.AppendFormat(" FROM [{0}] WHERE 1=1 ", Type.Name);
            //if (!string.IsNullOrEmpty(where))
            //{
            // sql.Append(where);
            //}
            //sql.Append(")");
            //sql.AppendFormat("SELECT * FROM [{0}] WHERE RowNumber", alias);

            //var startIndex = pageSize * (pageIndex - 1) + 1;
            //var endIndex = pageSize * pageIndex;
            //sql.AppendFormat(" BETWEEN {0} AND {1}", startIndex, endIndex);
            //return DbConnection.Query<TEntity>(sql.ToString()).ToList();
            #endregion

            #region Oracle
            var sql = new StringBuilder();
            //获取总记录数
            sql.AppendFormat("SELECT COUNT(1) FROM {0} WHERE 1=1 ", Type.Name);
            if (!string.IsNullOrEmpty(where))
            {
                sql.Append(where);
            }
            total = Convert.ToInt32(DbConnection.ExecuteScalar(sql.ToString()));
            sql.Clear();

            var startIndex = pageSize * (pageIndex - 1);
            var endIndex = pageSize * pageIndex;
            sql.Append(" SELECT * FROM");
            sql.Append(" (SELECT A.*, rownum r");
            sql.Append(" FROM");
            sql.AppendFormat(" (SELECT * FROM {0} where 1=1 ", Type.Name);
            if (!string.IsNullOrEmpty(where))
            {
                sql.Append(where);
            }
            if (!string.IsNullOrEmpty(sortField)
            && !string.IsNullOrEmpty(direction))
            {
                sql.Append(string.Format(" ORDER BY {0} {1}) ", sortField, direction));
            }
            sql.Append(" A ");
            sql.AppendFormat(" WHERE rownum <={0} ", endIndex);
            sql.Append(" ) B");
            sql.AppendFormat(" WHERE r >{0} ", startIndex);
            return DbConnection.Query<TEntity>(sql.ToString()).ToList();
            #endregion
        }


        public bool Execute(string sql, object param = null, IDbTransaction transaction = null)
        {


            return DbConnection.Execute(sql, param, transaction) > 0;
        }

        public Tuple<bool, string> Remove(object primaryKey)
        {


            var fieldName = GetPrimaryProp().Name;
            var sql = string.Format("DELETE FROM {0} WHERE {1}=" + _dbBase.ParamPrefix + "Key", Type.Name, fieldName);
            var flag = DbConnection.Execute(sql, new
            {
                Key = primaryKey
            }) > 0;
            return new Tuple<bool, string>(flag, flag ? "" : "删除失败");
        }

        private PropertyInfo GetPrimaryProp()
        {
            var primaryProp = Props.FirstOrDefault(m => m.GetCustomAttributes(true).FirstOrDefault(p => p.GetType().Equals(typeof(PrimaryKeyAttribute))) != null);
            if (primaryProp == null)
            {
                if (!Type.Name.StartsWith("V_"))
                {
                    throw new Exception(Type.Name + "未定义PrimaryKeyAttribute特性");
                }
                else
                {
                    return Props.FirstOrDefault();
                }
            }
            return primaryProp;
        }

        public Tuple<bool, string> Update(TEntity model)
        {


            var flag = false;
            var sql = GenerateUpdateSql();
            flag = DbConnection.Execute(sql, model) > 0;
            return new Tuple<bool, string>(flag, flag ? "" : "更新失败");
        }

        public Tuple<bool, string> Update(TEntity model, IDbTransaction transaction)
        {


            var flag = false;
            var sql = GenerateUpdateSql();
            flag = transaction.Connection.Execute(sql, model, transaction) > 0;
            return new Tuple<bool, string>(flag, flag ? "" : "更新失败");
        }
        public TEntity Get(string primaryKey)
        {


            var fieldName = GetPrimaryProp().Name;
            var sql = string.Format("SELECT * FROM [{0}] WHERE {1}=" + _dbBase.ParamPrefix + "Key", Type.Name, fieldName);
            return DbConnection.Query<TEntity>(sql, new
            {
                Key = primaryKey
            }).FirstOrDefault();
        }




        public string GetUpdateDetail(TEntity newModel)
        {


            var primaryKey = GetPrimaryProp().GetValue(newModel, null);
            if (primaryKey == null)
            {
                throw new Exception("未能获取到主键的值");
            }

            var model = Get(primaryKey.ToString());
            var sb = new StringBuilder();
            foreach (var prop in Props)
            {
                var oldValue = Convert.ToString(prop.GetValue(model, null));
                var newValue = Convert.ToString(prop.GetValue(newModel, null));
                if (!oldValue.Equals(newValue))
                {
                    sb.AppendFormat("[{0}]:{1}=>{2}\r\n", prop.Name, oldValue, newValue);
                }
            }
            return sb.ToString();
        }



    }
}
