using RepositoryDal.IRepository.T;
using RepositoryDal.Repository.T;
using SqlDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryDal.Repository
{
    /// <summary>
    /// 描 述：定义仓储模型工厂
    /// </summary>
    /// <typeparam name="T">动态实体类型</typeparam>
    public class RepositoryFactory<T> where T : class,new()
    {
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString">连接字符串</param>
        /// <returns></returns>
        public IRepository<T> BaseRepository(string connString)
        {
            return new Repository<T>(DbFactory.Base(connString, DatabaseType.SqlServer));
        }
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString">连接字符串</param>
        /// <returns></returns>
        public IRepository<T> BaseRepository(string connString, DatabaseType type)
        {
            return new Repository<T>(DbFactory.Base(connString, type));
        }
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public IRepository<T> BaseRepository(string connString, string type)
        {
            switch (type)
            {
                case "SqlServer":
                    return new Repository<T>(DbFactory.Base(connString, DatabaseType.SqlServer));
                case "Oracle":
                    return new Repository<T>(DbFactory.Base(connString, DatabaseType.Oracle));
                case "MySql":
                    return new Repository<T>(DbFactory.Base(connString, DatabaseType.MySql));
                default:
                    return new Repository<T>(DbFactory.Base(connString, DatabaseType.SqlServer));
            }
        }
        /// <summary>
        /// 定义仓储（基础库）
        /// </summary>
        /// <returns></returns>
        public IRepository<T> BaseRepository()
        {
            return new Repository<T>(DbFactory.Base());
        }

        /// <summary>
        /// 定义仓储（数据库）
        /// </summary>
        /// <returns></returns>
        public IRepository<T> DataRepository()
        {
            return new Repository<T>(DbFactory.Data());
        }
    }
}
