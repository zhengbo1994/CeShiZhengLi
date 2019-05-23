using SqlDal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryDal.Repository
{
    /// <summary>
    /// 版 本 6.1
    /// Copyright (c) 2013-2016 
    /// 创建人：佘赐雄
    /// 日 期：2015.10.10
    /// 描 述：定义仓储模型工厂
    /// </summary>
    public class RepositoryFactory
    {
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString">连接字符串</param>
        /// <returns></returns>
        public RepositoryDal.IRepository.IRepository BaseRepository(string connString)
        {
            return new Repository(DbFactory.Base(connString, DatabaseType.SqlServer));
        }
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString">连接字符串</param>
        /// <returns></returns>
        public RepositoryDal.IRepository.IRepository BaseRepository(string connString, DatabaseType type)
        {
            return new Repository(DbFactory.Base(connString, type));
        }
        /// <summary>
        /// 定义仓储
        /// </summary>
        /// <param name="connString"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public RepositoryDal.IRepository.IRepository BaseRepository(string connString, string type)
        {
            switch (type)
            {
                case "SqlServer":
                    return new Repository(DbFactory.Base(connString, DatabaseType.SqlServer));
                case "Oracle":
                    return new Repository(DbFactory.Base(connString, DatabaseType.Oracle));
                case "MySql":
                    return new Repository(DbFactory.Base(connString, DatabaseType.MySql));
                default:
                    return new Repository(DbFactory.Base(connString, DatabaseType.SqlServer));
            }
        }

        /// <summary>
        /// 定义仓储（基础库）
        /// </summary>
        /// <returns></returns>
        public RepositoryDal.IRepository.IRepository BaseRepository()
        {
            return new Repository(DbFactory.Base());
        }
        public RepositoryDal.IRepository.IRepository DataRepository()
        {
            return new Repository(DbFactory.Data());
        }
    }
}
