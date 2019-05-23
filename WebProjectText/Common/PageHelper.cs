using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class PageHelper
    {
        /// <summary>
        /// DataTable分页
        /// </summary>
        /// <param name="dt">DataTable</param>
        /// <param name="PageIndex">页索引,注意：从1开始</param>
        /// <param name="PageSize">每页大小</param>
        /// <param name="iFinalPageIndex">最终页码</param>
        /// <returns>分好页的DataTable数据</returns>
        public static DataTable GetPagedTable(DataTable dt, int PageIndex, int PageSize, out int iFinalPageIndex)
        {
            iFinalPageIndex = PageIndex;
            if (PageIndex == 0) { return dt; }

            DataTable newdt = dt.Copy();

            newdt.Clear();

            int rowbegin = (PageIndex - 1) * PageSize;

            int rowend = PageIndex * PageSize;


            //如果超过最后一页取最后一页
            if (rowbegin >= dt.Rows.Count)
            {
                rowbegin = dt.Rows.Count - dt.Rows.Count % PageSize;
                iFinalPageIndex = (dt.Rows.Count - 1) / PageSize + 1;
            }

            if (rowend > dt.Rows.Count)
            {
                rowend = dt.Rows.Count;
            }

            for (int i = rowbegin; i <= rowend - 1; i++)
            {

                DataRow newdr = newdt.NewRow();

                DataRow dr = dt.Rows[i];

                foreach (DataColumn column in dt.Columns)
                {

                    newdr[column.ColumnName] = dr[column.ColumnName];

                }

                newdt.Rows.Add(newdr);

            }

            return newdt;
        }

        /// <summary>

        /// 返回分页的页数

        /// </summary>

        /// <param name="count">总条数</param>

        /// <param name="pageye">每页显示多少条</param>

        /// <returns>如果 结尾为0：则返回1</returns>

        public static int PageCount(int count, int pageye)
        {

            int page = 0;

            int sesepage = pageye;

            if (count % sesepage == 0) { page = count / sesepage; }

            else { page = (count / sesepage) + 1; }

            if (page == 0) { page += 1; }

            return page;

        }


        #region 后台分页
        public static string strPage(int intCounts, int intPageSizes, int intPageCounts, int intThisPages, string strUrl)
        {
            int intCount = Convert.ToInt32(intCounts); //总记录数
            int intPageCount = Convert.ToInt32(intPageCounts); //总共页数
            int intPageSize = Convert.ToInt32(intPageSizes); //每页显示
            int intPage = 10; //数字显示
            int intThisPage = Convert.ToInt32(intThisPages); //当前页数
            int intBeginPage = 0; //开始页数
            int intCrossPage = 0; //变换页数
            int intEndPage = 0; //结束页数
            string strPage = null; //返回值

            intCrossPage = intPage / 2;
            if (intThisPage > 1)
            {
                strPage = strPage + "<li ><a class=\"leftbtn\" href=\"" + strUrl + Convert.ToString(intThisPage - 1) + "\">&laquo;</a></li>";
            }
            if (intPageCount > intPage)
            {
                if (intThisPage > intPageCount - intCrossPage)
                {
                    intBeginPage = intPageCount - intPage + 1;
                    intEndPage = intPageCount;
                }
                else
                {
                    if (intThisPage <= intPage - intCrossPage)
                    {
                        intBeginPage = 1;
                        intEndPage = intPage;
                    }
                    else
                    {
                        intBeginPage = intThisPage - intCrossPage;
                        intEndPage = intThisPage + intCrossPage;
                    }
                }
            }
            else
            {
                intBeginPage = 1;
                intEndPage = intPageCount;
            }
            if (intCount > 0)
            {

                for (int i = intBeginPage; i <= intEndPage; i++)
                {
                    if (i == intThisPage)
                    {
                        strPage = strPage + "<li><a class=\"curr\">" + i.ToString() + "</a></li>";
                    }
                    else
                    {
                        strPage = strPage + "<li> <a href=\"" + strUrl + i.ToString() + "\">" + i.ToString() + "</a></li> ";
                    }
                }
            }
            if (intThisPage < intPageCount)
            {
                strPage = strPage + "<li ><a class=\"rightbtn\" href=\"" + strUrl + Convert.ToString(intThisPage + 1) + "\">&raquo;</a></li>";
            }
            return strPage;
        }
        #endregion
    }
}
