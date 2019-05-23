using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_DataPermissionHead
    {
        [Key]
        public int Id { get; set; }
        public string HeadName { get; set; }


    }
}
