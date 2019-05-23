using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_Role
    {
        [Key]
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public string RoleToLimit { get; set; }
        public string RoleType { get; set; }
        [NotMapped]
        public List<Sys_Permission> PermissionList { get; set; }

        [NotMapped]
        public List<Sys_DataPermissionDetail> DataPermissionDetailList { get; set; }


    }
}
