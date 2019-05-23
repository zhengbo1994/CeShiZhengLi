using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace Model
{
    public class Sys_Account
    {
        [Key]
        public int Id { get; set; }
        public string AccountName { get; set; }
        public string Password { get; set; }
        public string Sex { get; set; }
        public int Age { get; set; }
        public string Tel { get; set; }
        public string Address { get; set; }
        public int UserId { get; set; }
        public int RP_UserId { get; set; }

        [NotMapped]
        public List<Sys_Role> RoleList { get; set; }

    }
}
