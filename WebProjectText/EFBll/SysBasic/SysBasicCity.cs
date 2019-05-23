using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using EFDal;

namespace EFBll.SysBasic
{
    public class SysBasicCity
    {

        private Uow uow;
        private Sys_Account loginAccount;
        public SysBasicCity(Sys_Account account)
        {
            if (uow == null)
            {
                uow = new Uow();
            }
            loginAccount = account;
        }




    }
}
