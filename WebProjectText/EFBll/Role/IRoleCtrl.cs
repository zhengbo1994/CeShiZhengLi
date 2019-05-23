using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL
{
    public interface IRoleCtrl
    {
        void Assigning2Role(int accountId,string roleType);
    }
}
