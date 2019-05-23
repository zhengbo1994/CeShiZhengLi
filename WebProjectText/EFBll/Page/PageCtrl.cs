using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Model;
using DAL;
using Common.baseFn;
using EFDal;

namespace BLL
{
    public class PageCtrl : IPageCtrl
    {

        private Uow uow;
        private Sys_Account account;

        public PageCtrl(Sys_Account account)
        {
            if (uow == null)
            {
                uow = new Uow();
            }
            this.account = account;

        }

        public List<Sys_Page> GetPageListByLeafPage(List<Sys_Page> leafPageList)
        {
            List<Sys_Page> totalPageList = new List<Sys_Page>();

            List<Sys_Page> pageList = uow.Sys_Page.GetAll().ToList();

            foreach (Sys_Page leafPage in leafPageList)
            {
                AddBranchPage(totalPageList, leafPage, pageList);
            }
            return totalPageList;
        }

        private void AddBranchPage(List<Sys_Page> totalPageList, Sys_Page leafPage, List<Sys_Page> pageCollection)
        {
            if (leafPage.ParentId != 0)
            {
                //Sys_Page branchPage = uow.Sys_Page.GetAll().Where(p => p.Id == leafPage.ParentId).Single();
                Sys_Page branchPage = pageCollection.Where(p => p.Id == leafPage.ParentId).Single();

                int count = totalPageList.Where(p => p.Id == branchPage.Id).Count();
                if (count == 0)
                {
                    AddBranchPage(totalPageList, branchPage, pageCollection);
                }
            }

            totalPageList.Add(leafPage);
        }
        public List<Sys_Page> getPageList()
        {
            return uow.Sys_Page.GetAll().OrderBy(p => p.Sequence).ToList();
        }
    }
}
