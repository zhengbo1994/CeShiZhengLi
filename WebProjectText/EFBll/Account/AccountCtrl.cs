using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL;
using Model;
using EFDal;

namespace BLL
{
    public class AccountCtrl : IAccountCtrl
    {
        private Uow uow;
        private Sys_Account loginAccount;
        public AccountCtrl(Sys_Account account)
        {
            if (uow == null)
            {
                uow = new Uow();
            }
            loginAccount = account;
        }

        public bool ValidAccount(string accountName, string password)
        {
            bool validResult = false;
            int accountCount = uow.Sys_Account.GetAll().Where(p => p.AccountName == accountName && p.Password == password).Count();
            if (accountCount == 1)
            {
                validResult = true;
            }
            return validResult;
        }

        public Sys_Account GetAccountByAccountName(string accountName)
        {
            Sys_Account account = uow.Sys_Account.GetAll().Where(p => p.AccountName == accountName).FirstOrDefault();
            if (account != null)
            {
                List<int> roleIdList = uow.Sys_RelAccountRole.GetAll().Where(p => p.AccountId == account.Id).Select(p => p.RoleId).ToList();
                List<Sys_Role> roleList = uow.Sys_Role.GetAll().Where(p => roleIdList.Contains(p.Id)).ToList();

                foreach (Sys_Role role in roleList)
                {
                    List<int> permissionIdList = uow.Sys_RelRolePermission.GetAll().Where(p => p.RoleId == role.Id).Select(p => p.PermissionId).ToList();
                    List<Sys_Permission> permissionList = uow.Sys_Permission.GetAll().Where(p => permissionIdList.Contains(p.Id)).ToList();

                    foreach (var permission in permissionList)
                    {
                        List<int> pageIdList = uow.Sys_RelPermissionPage.GetAll().Where(p => p.PermissionId == permission.Id).Select(p => p.PageId).ToList();
                        List<Sys_Page> pageList = uow.Sys_Page.GetAll().Where(p => pageIdList.Contains(p.Id)).ToList();
                        permission.PageList = pageList;
                    }
                    role.PermissionList = permissionList;

                    List<int> dataPermissionDetailIdList = uow.Sys_RelRoleDataPermissionDetail.GetAll().Where(p => p.RoleId == role.Id).Select(p => p.DataPermissionDetailId).ToList();
                    List<Sys_DataPermissionDetail> dataPermissionDetailList = uow.Sys_DataPermissionDetail.GetAll().Where(p => dataPermissionDetailIdList.Contains(p.Id)).ToList();
                    role.DataPermissionDetailList = dataPermissionDetailList;
                }
                account.RoleList = roleList;
            }

            return account;
        }

        public List<Sys_Account> GetAccountByAccountIdList(List<int> accountIdList)
        {
            return uow.Sys_Account.GetAll().Where(p => (accountIdList.Contains(p.Id))).ToList();
        }
        public Sys_Account GetAccountByAccountId(int accountId)
        {
            return uow.Sys_Account.GetAll().Where(p => p.Id == accountId).SingleOrDefault();
        }
        public void ChangePassword(string oldPassword, string newPassword)
        {
            Sys_Account oldaccount = uow.Sys_Account.GetById(loginAccount.Id);
            if (oldaccount.Password.ToLower() == oldPassword.ToLower())
            {
                oldaccount.Password = newPassword;
            }
            else
            {
                throw new Exception("原密码不正确");
            }
            uow.Sys_Account.Update(oldaccount);
            uow.Commit();
        }
        public void AddAccount(Sys_Account account)
        {
            int exists = uow.Sys_Account.GetAll().Where(p => p.AccountName == account.AccountName).Count();
            if (exists > 0)
            {
                throw new Exception("账户名称已存在");
            }
            uow.Sys_Account.Add(account);
            uow.Commit();
        }
        #region 获取用户名称
        public string GetUserName(int accountId)
        {
            if (accountId == 0)
            {
                return "系统";
            }
            string userName = "";
            Sys_Account oldaccount = uow.Sys_Account.GetById(accountId);
            if (oldaccount == null)
            {
                return "账户不存在";
            }
            Sys_RelAccountRole relAccountRole = uow.Sys_RelAccountRole.GetAll().Where(q => q.AccountId == oldaccount.Id).First();
            Sys_Role role = uow.Sys_Role.GetAll().Where(p => p.Id == relAccountRole.RoleId).First();
            if (RoleCtrl.RoleType.Admin == role.RoleType)
            {
                userName = "超级管理员";
            }
            else if (RoleCtrl.RoleType.Master == role.RoleType)
            {
                userName = "省总站";
            }
            else if (RoleCtrl.RoleType.Manager == role.RoleType)
            {
                userName = role.RoleName;
            }
            //else if (RoleCtrl.RoleType.Employee == role.RoleType)
            //{
            //    IWorkFlowCtrl workFlowCtrl = new WorkFlowCtrl(loginAccount);
            //    Biz_Employee employee = workFlowCtrl.GetEmployeeInfoById(oldaccount.UserId);
            //    userName = employee.EmployeeName;
            //}
            //else if (RoleCtrl.RoleType.Enterprise == role.RoleType)
            //{

            //    IEnterpriseCtrl enterpriseCtrl = new EnterpriseCtrl(loginAccount);
            //    Biz_Enterprise enterprise = enterpriseCtrl.GetEnterpriseById(oldaccount.UserId);
            //    userName = enterprise.EnterpriseName;
            //}
            //else if (RoleCtrl.RoleType.ExaminationPoint == role.RoleType)
            //{

            //    IExaminationPointCtrl examinationPointCtrl = new ExaminationPointCtrl(loginAccount);
            //    Biz_ExaminationPoint trainingInstitution = examinationPointCtrl.GetExaminationPointById(oldaccount.UserId);
            //    userName = trainingInstitution.InstitutionName;
            //}
            //else if (RoleCtrl.RoleType.TrainingInstitution == role.RoleType)
            //{

            //    ITrainingInstitutionCtrl trainingInstitutionCtrl = new TrainingInstitutionCtrl(loginAccount);
            //    Biz_TrainingInstitution trainingInstitution = trainingInstitutionCtrl.GetTrainingInstitutionById(oldaccount.UserId);
            //    userName = trainingInstitution.InstitutionName;
            //}
            //else if (RoleCtrl.RoleType.RP_Employee == role.RoleType)
            //{

            //    IRP_EmployeeCtrl rpEmployeeCtrl = new RP_EmployeeCtrl(loginAccount);
            //    userName = rpEmployeeCtrl.GetRP_EmployeeRegistrationById(oldaccount.RP_UserId).EmployeeName;
            //}
            else
            {
                userName = "无角色账户";
            }
            return userName;
        }
        #endregion
        public static class RoleType
        {
            public static string Admin { get { return "Admin"; } }
            public static string Enterprise { get { return "Enterprise"; } }
            public static string Employee { get { return "Employee"; } }
            public static string RP_Employee { get { return "RP_Employee"; } }
            public static string Manager { get { return "Manager"; } }
            public static string TrainingInstitution { get { return "TrainingInstitution"; } }
            public static string Master { get { return "Master"; } }

        }
    }
}
