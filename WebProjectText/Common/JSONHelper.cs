using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Common
{
    public static class JSONHelper
    {
        #region  JSON、String 互转
        public static List<T> JSONStringToList<T>(this string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            return objs;
        }

        public static T JSONStringToObj<T>(this string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            T obj = Serializer.Deserialize<T>(JsonStr);
            return obj;
        }

        public static string ObjToJSONString<T>(this T obj)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            string result = Serializer.Serialize(obj);
            return result;
        }
        #endregion
    }
}
