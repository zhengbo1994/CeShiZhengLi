using DAL;
using EFDal;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL
{
    public class RoleCtrl : IRoleCtrl
    {
         private Uow uow;
        private Sys_Account loginAccount;
        public RoleCtrl(Sys_Account account)
        {
            if (uow == null)
            {
                uow = new Uow();
            }
            loginAccount = account;
        }
       public void Assigning2Role(int accountId, string roleType)
        {
            //分配到角色
            Sys_Role role = uow.Sys_Role.GetAll().Where(r => r.RoleType == roleType).SingleOrDefault();
            Sys_RelAccountRole relAccountRole = new Sys_RelAccountRole()
            {
                AccountId = accountId,
                RoleId = role.Id
            };
            uow.Sys_RelAccountRole.Add(relAccountRole);
            uow.Commit();
        }
       public static class RoleType
       {
           public static string Admin { get { return "Admin"; } }
           public static string Enterprise { get { return "Enterprise"; } }
           public static string Employee { get { return "Employee"; } }
           public static string RP_Employee { get { return "RP_Employee"; } }
           public static string Manager { get { return "Manager"; } }
           public static string ExaminationPoint { get { return "ExaminationPoint"; } }
           public static string TrainingInstitution { get { return "TrainingInstitution"; } }
           public static string Master { get { return "Master"; } }

       }
    }
}
