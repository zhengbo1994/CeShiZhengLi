using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SysDAL
{
    public class Uow:IDisposable
    {
        DataBaseContext dbContext = new DataBaseContext();
        public Uow() {
            this.dbContext.Configuration.LazyLoadingEnabled = true;
            this.dbContext.Configuration.ProxyCreationEnabled = true;
            this.dbContext.Configuration.ValidateOnSaveEnabled = true;
        }

    }
}
