using System;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    /// <summary>
    /// 下拉框通用选项
    /// </summary>
   public class Sys_DropdownListItem
    {
       [Key]
       public int Id { get; set; }
       public string ItemName { get; set; }
       public string ItemText { get; set; }
       public string ItemValue { get; set; }
       public int Seq { get; set; }
       public bool Status { get; set; }

    }
}
