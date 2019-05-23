using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data;
using Model;

namespace EFDal
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext() 
            : base("DbContext") { }

        public DataBaseContext(string connection) 
            : base(connection) { }


        public DbSet<Sys_Account> Sys_Account { get; set; }
        public DbSet<Sys_Role> Sys_Role { get; set; }
        public DbSet<Sys_Permission> Sys_Permission { get; set; }
        public DbSet<Sys_Page> Sys_Page { get; set; }
        public DbSet<Sys_DataPermissionHead> Sys_DataPermissionHead { get; set; }
        public DbSet<Sys_DataPermissionDetail> Sys_DataPermissionDetail { get; set; }
        public DbSet<Sys_RelAccountRole> Sys_RelAccountRole { get; set; }
        public DbSet<Sys_RelRolePermission> Sys_RelRolePermission { get; set; }
        public DbSet<Sys_RelPermissionPage> Sys_RelPermissionPage { get; set; }
        public DbSet<Sys_RelRoleDataPermissionDetail> Sys_RelRoleDataPermissionDetail { get; set; }
        public DbSet<Sys_City> Sys_City { get; set; }
        public DbSet<Sys_Area> Sys_Area { get; set; }
    }
}
