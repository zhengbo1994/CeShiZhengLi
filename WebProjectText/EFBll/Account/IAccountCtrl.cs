using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;

namespace BLL
{
    public interface IAccountCtrl
    {
        bool ValidAccount(string accountName, string password);

        Sys_Account GetAccountByAccountName(string accountName);

        List<Sys_Account> GetAccountByAccountIdList(List<int> accountIdList);
        Sys_Account GetAccountByAccountId(int accountId);

        void ChangePassword(string oldPassword, string newPassword);

        void AddAccount(Sys_Account account);
        #region 获取用户名称
        string GetUserName(int accountId);
        #endregion


    }
}
