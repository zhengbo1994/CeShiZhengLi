using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Dapper;
using System.Web;
using System.Data;

namespace DapperDal
{
    public interface IBaseService<TEntity> : IDisposable where TEntity : class,new()
    {
        /// <summary>
        /// 获取数据库对象
        /// </summary>
        DbBase DbBase { get; }

        /// <summary>
        /// 获取数据库连接字符串
        /// </summary>
        /// <returns></returns>
        IDbConnection DbConnection { get; }

        Tuple<bool, string> Create(TEntity model);

        Tuple<bool, string> Create(TEntity model, IDbTransaction transaction);

        Tuple<bool, string> Update(TEntity model);

        Tuple<bool, string> Update(TEntity model, IDbTransaction transaction);
        IList<TEntity> GetAllList();

        /// <summary>
        /// 获取分页列表
        /// </summary>
        /// <param name="where">where 1=1后面的and.....</param>
        /// <param name="pageSize">每页显示多少条</param>
        /// <param name="pageIndex">当前页面索引</param>
        /// <param name="sortField">排序字段</param>
        /// <param name="direction">排序方向[asc,desc]</param>
        /// <param name="total">总共多少条符合条件的记录</param>
        /// <returns></returns>
        IList<TEntity> GetPagesList(string where, int pageSize, int pageIndex, string sortField, string direction, out int total);


        bool Execute(string sql, object param = null, IDbTransaction transaction = null);

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="primaryKey">主键</param>
        /// <returns></returns>
        Tuple<bool, string> Remove(object primaryKey);

        /// <summary>
        /// 获取模型
        /// </summary>
        /// <param name="primaryKey">主键</param>
        /// <returns></returns>
        TEntity Get(string primaryKey);


        /// <summary>
        /// 获取更新详细信息
        /// </summary>
        /// <param name="newModel"></param>
        /// <returns></returns>
        string GetUpdateDetail(TEntity newModel);

    }
}
