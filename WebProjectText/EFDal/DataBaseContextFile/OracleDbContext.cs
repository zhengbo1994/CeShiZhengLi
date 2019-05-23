using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using Oracle.ManagedDataAccess.Client;
using System;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Reflection;

namespace EFDal.DataBaseContextFile
{
    /// <summary>
    /// 描 述：数据访问(oracle) 上下文
    /// </summary>
    public class OracleDbContext : DbContext, IDisposable, IObjectContextAdapter
    {
        #region 构造函数
        private static OracleConnection GetEFConnctionString(string connString)
        {
            var obj = ConfigurationManager.ConnectionStrings[connString];

            OracleConnection con;
            if (obj != null)
            {
                con = new OracleConnection(obj.ConnectionString);
            }
            else
            {
                con = new OracleConnection(connString);
            }

            return con;

        }
        /// <summary>
        /// 初始化一个 使用指定数据连接名称或连接串 的数据访问上下文类 的新实例
        /// </summary>
        /// <param name="connString"></param>
        public OracleDbContext(string connString)
            : base(GetEFConnctionString(connString), true)
        {
            this.Configuration.AutoDetectChangesEnabled = false;
            this.Configuration.ValidateOnSaveEnabled = false;
            this.Configuration.LazyLoadingEnabled = true;
            this.Configuration.ProxyCreationEnabled = true;

        }
        #endregion

        #region 重载
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            string assembleFileName = Assembly.GetExecutingAssembly().CodeBase.Replace("LeaRun.Data.EF.DLL", "LeaRun.Application.Mapping.dll").Replace("file:///", "");
            Assembly asm = Assembly.LoadFile(assembleFileName);
            var typesToRegister = asm.GetTypes()
            .Where(type => !String.IsNullOrEmpty(type.Namespace))
            .Where(type => type.BaseType != null && type.BaseType.IsGenericType && type.BaseType.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>));
            foreach (var type in typesToRegister)
            {
                dynamic configurationInstance = Activator.CreateInstance(type);
                modelBuilder.Configurations.Add(configurationInstance);
            }
            string schema = System.Configuration.ConfigurationManager.AppSettings["OracleSchema"];
            if (string.IsNullOrEmpty(schema))
            {
                modelBuilder.HasDefaultSchema("CP_SSO");//这里写默认表空间名称
            }
            else
            {
                modelBuilder.HasDefaultSchema(schema);//这里写默认表空间名称
            }
            base.OnModelCreating(modelBuilder);
        }
        #endregion
    }
}
