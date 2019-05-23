using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace SysDAL
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext()
            : base("DbContext") 
        {
        }

        public DataBaseContext(string connection)
            : base(connection)
        {
        }


    }
}
