using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL
{
    public interface IAreaCtrl
    {
        List<string> GetAreaListByCityName(string cityName);
    }
}
