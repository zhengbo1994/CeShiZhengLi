using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using EFBll;
using DapperBll;
using BLL;

namespace WebProjectFlowMVC.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        #region 获取菜单信息
        public JsonResult GetMenuList()
        {
            List<Sys_Page> leafPageList = LoginPageList.OrderBy(p => p.Sequence).ToList();

            IPageCtrl pageCtrl = new PageCtrl(LoginAccount as Sys_Account);

            List<Sys_Page> totalPageList = pageCtrl.GetPageListByLeafPage(leafPageList);

            List<GetMenuListResult> menuList = totalPageList.Select(p => new GetMenuListResult()
            {
                Id = p.Id,
                Title = p.PageName,
                Icon = p.Icon,
                Url = p.Url,
                ParentId = p.ParentId
            }).ToList();
            return Json(menuList, JsonRequestBehavior.AllowGet);
        }

        public class GetMenuListResult
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Icon { get; set; }
            public string Url { get; set; }
            public int ParentId { get; set; }

        }



        #endregion
        //获取登录用户名
        public JsonResult GetUserName()
        {
            return Json(base.LoginUserName, JsonRequestBehavior.AllowGet);
        }
        //修改密码
        public JsonResult ChangePwd(string oldPwd, string newPwd)
        {
            ResultMessage resultMessage = new ResultMessage();
            resultMessage.IsSuccess = true;
            try
            {
                Sys_Account account = LoginAccount as Sys_Account;
                IAccountCtrl accountCtrl = new AccountCtrl(account);
                accountCtrl.ChangePassword(oldPwd, newPwd);
                LogOut();
            }
            catch (Exception ex)
            {
                resultMessage.IsSuccess = false;
                resultMessage.ErrorMessage = ex.Message;
            }
            return Json(resultMessage, JsonRequestBehavior.AllowGet);
        }
        public JsonResult LogOut()
        {
            ResultMessage resultMessage = new ResultMessage();
            resultMessage.IsSuccess = true;
            try
            {
                LoginAccount = null;
                Session.Clear();
            }
            catch (Exception ex)
            {
                resultMessage.IsSuccess = false;
                resultMessage.ErrorMessage = ex.Message;
            }
            return Json(resultMessage, JsonRequestBehavior.AllowGet);
        }

    }
}