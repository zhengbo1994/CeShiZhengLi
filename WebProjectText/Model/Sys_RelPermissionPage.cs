using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_RelPermissionPage
    {
        [Key]
        public int Id { get; set; }
        public int PermissionId { get; set; }
        public int PageId { get; set; }

    }
}
