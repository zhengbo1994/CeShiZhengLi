using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;

namespace BLL
{
    public interface IPageCtrl
    {
         List<Sys_Page> GetPageListByLeafPage(List<Sys_Page> leafPageList);
         List<Sys_Page> getPageList();
    }
}
