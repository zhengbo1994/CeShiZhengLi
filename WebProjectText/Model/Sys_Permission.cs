using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_Permission
    {
        [Key]
        public int Id { get; set; }
        public string PermissionName { get; set; }

        [NotMapped]
        public List<Sys_Page> PageList { get; set; }
    }
}
