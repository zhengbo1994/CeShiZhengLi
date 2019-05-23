using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using System.Reflection;
using System.Configuration;
using EFBll;
using DapperBll;
using System.Transactions;
using Common.baseFn;
using BLL;

namespace WebProjectFlowMVC.Controllers
{
    public class BaseController : Controller
    {

        #region 注册Session

        public object LoginAccount
        {
            get
            {
                return GetSession("LoginAccount");
            }
            set
            {
                SetSession("LoginAccount", value);
            }

        }

        private object GetSession(string key)
        {
            return Session[key];
        }

        private void SetSession(string key, object value)
        {
            Session[key] = value;
            //System.Web.HttpContext.Current.Session[key] = value;
        }

        #endregion

        #region 获取登录用户账号，角色，权限，页面相关信息

        //自定义去重方法

        private class ClsOnlyID
        {
            public int Id { get; set; }

            public object obj { get; set; }
        }

        private class ListDistinctById : IEqualityComparer<ClsOnlyID>
        {
            public bool Equals(ClsOnlyID x, ClsOnlyID y)
            {
                if (x.Id == y.Id)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            public int GetHashCode(ClsOnlyID obj)
            {
                return 0;
            }
        }

        private List<ClsOnlyID> getDistinctList(List<ClsOnlyID> objList)
        {
            List<ClsOnlyID> clsOnlyIDListWithDistinct = objList.Distinct(new ListDistinctById()).ToList();
            return clsOnlyIDListWithDistinct;

        }

        public string LoginUserName
        {
            get
            {
                Sys_Account account = this.LoginAccount as Sys_Account;
                IAccountCtrl accountCtrl = new AccountCtrl(account);
                return accountCtrl.GetUserName(account.Id);
            }
        }
        public List<Sys_Role> LoginRoleList
        {
            get
            {
                Sys_Account loginAccount = this.LoginAccount as Sys_Account;
                List<Sys_Role> roleList = loginAccount.RoleList;
                return roleList;
            }
        }


        public List<Sys_Permission> LoginPermissionList
        {
            get
            {
                List<Sys_Permission> permissionList = new List<Sys_Permission>();
                foreach (Sys_Role role in this.LoginRoleList)
                {
                    if (!role.PermissionList.IsNull())
                    {
                        permissionList.AddRange(role.PermissionList);
                    }
                }
                //去掉重复项
                List<ClsOnlyID> permissionListOnlyID = permissionList.Select(p => new ClsOnlyID() { Id = p.Id, obj = p }).ToList();
                List<Sys_Permission> permissionListDistinct = getDistinctList(permissionListOnlyID).Select(p => p.obj as Sys_Permission).ToList();

                return permissionListDistinct;
            }
        }

        public List<Sys_DataPermissionDetail> LoginDataPermissionDetailList
        {
            get
            {
                List<Sys_DataPermissionDetail> permissionList = new List<Sys_DataPermissionDetail>();
                foreach (Sys_Role role in this.LoginRoleList)
                {
                    if (!role.DataPermissionDetailList.IsNull())
                    {
                        permissionList.AddRange(role.DataPermissionDetailList);
                    }
                }
                //去掉重复项
                List<ClsOnlyID> permissionListOnlyID = permissionList.Select(p => new ClsOnlyID() { Id = p.Id, obj = p }).ToList();
                List<Sys_DataPermissionDetail> permissionListDistinct = getDistinctList(permissionListOnlyID).Select(p => p.obj as Sys_DataPermissionDetail).ToList();

                return permissionListDistinct;
            }
        }

        public List<Sys_Page> LoginPageList
        {
            get
            {
                List<Sys_Page> pageList = new List<Sys_Page>();
                foreach (Sys_Permission permission in this.LoginPermissionList)
                {
                    if (!permission.PageList.IsNull())
                    {
                        pageList.AddRange(permission.PageList);
                    }
                }

                //去掉重复项
                List<ClsOnlyID> pageListOnlyID = pageList.Select(p => new ClsOnlyID() { Id = p.Id, obj = p }).ToList();
                List<Sys_Page> pageListDistinct = getDistinctList(pageListOnlyID).Select(p => p.obj as Sys_Page).ToList(); ;
                return pageListDistinct;
            }
        }

        #endregion

        #region 执行结果返回对象

        public class ResultMessage
        {
            public ResultMessage()
            {
                IsSuccess = true;
            }
            public bool IsSuccess { get; set; }
            public string ErrorMessage { get; set; }
        }

        #endregion

        #region IList对象转为可支持jqgrid分页的对象
        public class JqGridData
        {
            public int page { get; set; }//当前页码（1开始）
            public int total { get; set; }//总页数
            public int records { get; set; }//总记录数（不分页的记录数总和）
            public IList rows { get; set; }//当前页数据
        }

        public virtual JqGridData ConvertIListToJqGridData(int currentPage, int pageSize, int totalRecordCount, IList currentPageData)
        {
            JqGridData result = new JqGridData();
            result.page = currentPage;
            result.records = totalRecordCount;
            result.rows = currentPageData;
            result.total = (int)Math.Ceiling((double)totalRecordCount / pageSize);
            return result;
        }

        #endregion

        #region 日期时间格式枚举
        protected static class Enum_DateTimeFormatter
        {
            public const string DATEONLY = "yyyy-MM-dd";
            public const string DATEANDTIME = "yyyy-MM-dd HH:mm:ss";
            public const string TIMEONLY = "HH:mm:ss";
        }
        #endregion

        #region 获取文件保存根目录
        public string getFileRootDirectory()
        {
            string fileRootDirectoryPath = "";
            fileRootDirectoryPath = ConfigurationManager.AppSettings["FileRootDirectory"];
            return fileRootDirectoryPath;
        }

        #endregion

        #region 获取AppSetting的值
        public string GetAppSetting(string key)
        {
            string value = "";
            value = ConfigurationManager.AppSettings[key];
            return value;
        }

        #endregion

        #region 获取城市区域列表
        public JsonResult GetCityList()
        {
            Sys_Account account = this.LoginAccount as Sys_Account;
            ICityCtrl cityCtrl = new CityCtrl(account);
            List<string> cityList = cityCtrl.GetCityList();
            return Json(cityList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAreaListByCityName(string cityName)
        {
            IAreaCtrl areaCtrl = new AreaCtrl();
            List<string> areaList = areaCtrl.GetAreaListByCityName(cityName);
            return Json(areaList, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region 返回jqgrid空数据
        public static JsonResult NoDataJqGridResult
        {
            get
            {
                return new JsonResult()
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        page = 1,
                        total = 1,
                        records = 0,
                        rows = new ArrayList()
                    }
                }
                ;
            }
        }
        public JsonResult GetEmptyJqGridResult()
        {
            return NoDataJqGridResult;
        }
        #endregion

        #region 进程事务操作

        public TransactionScope CreateTransaction()
        {

            TransactionScope scope = new TransactionScope();
            return scope;
        }

        public void TransactionCommit(TransactionScope scope)
        {
            if (scope != null)
            {
                scope.Complete();
                scope.Dispose();
            }
        }

        public void TransactionRollback(TransactionScope scope)
        {
            if (scope != null)
            {
                scope.Dispose();
            }
        }
        #endregion



    }
}