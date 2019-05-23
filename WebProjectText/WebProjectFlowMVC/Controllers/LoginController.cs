using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Common.baseFn;
using BLL;
using Model;
using Common;

namespace WebProjectFlowMVC.Controllers
{
    public class LoginController : BaseController
    {
        const string loginValidateCodeKey = "LoginValidateCode";
        const string certificateSearchValidateCodeKey = "CertificateSearchValidateCode";
        const string examResultSearchValidateCodeKey = "ExamResultSearchValidateCode";
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        #region 验证用户登录是否正确
        private bool CheckValidateCode(string validateCode, string validateCodeKey)
        {
            if (validateCode.IsNull())
            {
                return false;
            }
            string key = GetValidateCode(validateCodeKey);
            return validateCode.ToLower() == key.ToLower();
        }
        private string GetValidateCode(string validateCodeKey)
        {
            string code = null;
            try
            {
                code = Session[validateCodeKey].ToString();
            }
            catch (Exception ex)
            {
                code = "";
            }
            return code;
        }
        public JsonResult UserLogin(string loginname, string password, string validateCode)
        {
            ResultMessage msg = new ResultMessage();
            try
            {
                if (!this.CheckValidateCode(validateCode, loginValidateCodeKey))
                {
                    throw new Exception("验证码错误");
                }
                IAccountCtrl accountCtrl = new AccountCtrl(null);
                bool loginFlag = accountCtrl.ValidAccount(loginname, password);
                if (loginFlag)
                {
                    Sys_Account account = accountCtrl.GetAccountByAccountName(loginname);
                    LoginAccount = account;
                    msg.IsSuccess = true;
                    msg.ErrorMessage = account.RoleList.SingleOrDefault().RoleType;
                }
                else
                {
                    msg.IsSuccess = false;
                    msg.ErrorMessage = "登录失败：用户名或密码错误！";
                }
            }
            catch (Exception ex)
            {
                msg.IsSuccess = false;
                msg.ErrorMessage = ex.Message;
            }

            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 获取登录验证码
        public FileResult GetValidateCodeImage()
        {
            try
            {
                byte[] fileContent = GenValidateCode(loginValidateCodeKey);
                return File(fileContent, "image/png");
            }
            catch { return null; }
        }

        private byte[] GenValidateCode(string validateCodeKey)
        {
            ValidateCodeImage v = new ValidateCodeImage();
            v.FontFamilies = new string[] { "微软雅黑", "Arial", "Lucida Wide" };
            string codes = v.CreateValidateCodes(4);
            Session[validateCodeKey] = codes;
            using (System.IO.MemoryStream ms = v.CreateValidateCodesImageStream(codes))
            {
                return ms.ToArray();
            }
        }
        #endregion
    }
}