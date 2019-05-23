using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Model;
using DAL;
using System.Data.Entity;

namespace EFDal
{
    public class Uow : IDisposable
    {
        public DataBaseContext DbContext { get; set; }

        public Uow()
        {
            CreateDataBaseContext("DbContext");
        }

        public Uow(string connection)
        {
            CreateDataBaseContext(connection);
        }

        public void CreateDataBaseContext(string connection)
        {
            DbContext = new DataBaseContext();
            this.DbContext.Configuration.ProxyCreationEnabled = false;
            this.DbContext.Configuration.ValidateOnSaveEnabled = false;
            this.DbContext.Configuration.LazyLoadingEnabled = false;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public static void CreateTransaction(List<Uow> uowList)
        {
            TransactionScope scope = new TransactionScope();
            foreach (Uow uow in uowList)
            {
                uow.Commit();
            }
            scope.Complete();
        }

        public void Commit()
        {
            DbContext.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (DbContext != null)
                    DbContext.Dispose();
            }
        }

        #region  系统表模块


        private Repository<Sys_Account> _rSys_Account;
        public Repository<Sys_Account> Sys_Account
        {
            get
            {
                if (_rSys_Account == null)
                    _rSys_Account = new Repository<Sys_Account>(DbContext);
                return _rSys_Account;
            }
        }

        private Repository<Sys_Role> _rSys_Role;
        public Repository<Sys_Role> Sys_Role
        {
            get
            {
                if (_rSys_Role == null)
                    _rSys_Role = new Repository<Sys_Role>(DbContext);
                return _rSys_Role;
            }
        }

        private Repository<Sys_Permission> _rSys_Permission;
        public Repository<Sys_Permission> Sys_Permission
        {
            get
            {
                if (_rSys_Permission == null)
                    _rSys_Permission = new Repository<Sys_Permission>(DbContext);
                return _rSys_Permission;
            }
        }

        private Repository<Sys_Page> _rSys_Page;
        public Repository<Sys_Page> Sys_Page
        {
            get
            {
                if (_rSys_Page == null)
                    _rSys_Page = new Repository<Sys_Page>(DbContext);
                return _rSys_Page;
            }
        }

        private Repository<Sys_RelAccountRole> _rSys_RelAccountRole;
        public Repository<Sys_RelAccountRole> Sys_RelAccountRole
        {
            get
            {
                if (_rSys_RelAccountRole == null)
                    _rSys_RelAccountRole = new Repository<Sys_RelAccountRole>(DbContext);
                return _rSys_RelAccountRole;
            }
        }

        private Repository<Sys_RelRolePermission> _rSys_RelRolePermission;
        public Repository<Sys_RelRolePermission> Sys_RelRolePermission
        {
            get
            {
                if (_rSys_RelRolePermission == null)
                    _rSys_RelRolePermission = new Repository<Sys_RelRolePermission>(DbContext);
                return _rSys_RelRolePermission;
            }
        }

        private Repository<Sys_RelPermissionPage> _rSys_RelPermissionPage;
        public Repository<Sys_RelPermissionPage> Sys_RelPermissionPage
        {
            get
            {
                if (_rSys_RelPermissionPage == null)
                    _rSys_RelPermissionPage = new Repository<Sys_RelPermissionPage>(DbContext);
                return _rSys_RelPermissionPage;
            }
        }

        private Repository<Sys_DataPermissionHead> _rSys_DataPermissionHead;
        public Repository<Sys_DataPermissionHead> Sys_DataPermissionHead
        {
            get
            {
                if (_rSys_DataPermissionHead == null)
                    _rSys_DataPermissionHead = new Repository<Sys_DataPermissionHead>(DbContext);
                return _rSys_DataPermissionHead;
            }
        }

        private Repository<Sys_DataPermissionDetail> _rSys_DataPermissionDetail;
        public Repository<Sys_DataPermissionDetail> Sys_DataPermissionDetail
        {
            get
            {
                if (_rSys_DataPermissionDetail == null)
                    _rSys_DataPermissionDetail = new Repository<Sys_DataPermissionDetail>(DbContext);
                return _rSys_DataPermissionDetail;
            }
        }

        private Repository<Sys_RelRoleDataPermissionDetail> _rSys_RelRoleDataPermissionDetail;
        public Repository<Sys_RelRoleDataPermissionDetail> Sys_RelRoleDataPermissionDetail
        {
            get
            {
                if (_rSys_RelRoleDataPermissionDetail == null)
                    _rSys_RelRoleDataPermissionDetail = new Repository<Sys_RelRoleDataPermissionDetail>(DbContext);
                return _rSys_RelRoleDataPermissionDetail;
            }
        }

        private Repository<Sys_Area> _rSys_Area;
        public Repository<Sys_Area> Sys_Area
        {
            get
            {
                if (_rSys_Area == null)
                    _rSys_Area = new Repository<Sys_Area>(DbContext);
                return _rSys_Area;
            }
        }


        private Repository<Sys_City> _rSys_City;
        public Repository<Sys_City> Sys_City
        {
            get
            {
                if (_rSys_City == null)
                    _rSys_City = new Repository<Sys_City>(DbContext);
                return _rSys_City;
            }
        }
        #endregion

        #region  业务表模块
        #endregion
    }
}
