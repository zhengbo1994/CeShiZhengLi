using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Sys_Area
    {
        [Key]
        public int Id { get; set; }

        public int CityId { get; set; }

        public string AreaName { get; set; }

        public int Seq { get; set; }
    }
}
