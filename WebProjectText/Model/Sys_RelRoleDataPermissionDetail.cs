using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_RelRoleDataPermissionDetail
    {
        [Key]
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int DataPermissionDetailId { get; set; }

    }
}
