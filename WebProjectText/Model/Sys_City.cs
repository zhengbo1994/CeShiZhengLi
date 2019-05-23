using System;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    public class Sys_City
    {
        [Key]
        public int Id { get; set; }

        public string CityName { get; set; }
        public string CityCode { get; set; }

        public int Seq { get; set; }
    }
}
