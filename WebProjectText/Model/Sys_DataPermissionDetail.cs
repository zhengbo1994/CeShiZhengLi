using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace Model
{
    public class Sys_DataPermissionDetail
    {
        [Key]
        public int Id { get; set; }
        public int HeadId { get; set; }
        public int ParentId { get; set; }
        public string DetailName { get; set; }
        public string Description { get; set; }

    }
}
