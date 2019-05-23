using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Security.Cryptography;
using System.Drawing;
using System.Web.Script.Serialization;
using System.Configuration;

namespace Common.baseFn
{
    public static class AppFn
    {
        /// <summary>
        /// 判断是否为空，为空返回true
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static bool IsNull(this object data)
        {
            //如果为null
            if (data == null)
            {
                return true;
            }

            //如果为""
            if (data.GetType() == typeof(String))
            {
                if (string.IsNullOrEmpty(data.ToString().Trim()))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 判断是否为空，为空返回true
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static bool IsNull(string data)
        {
            //如果为null
            if (data == null)
            {
                return true;
            }

            //如果为""
            if (data.GetType() == typeof(String))
            {
                if (string.IsNullOrEmpty(data.ToString().Trim()))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 将obj类型转换为string
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string ConvertToString(this object s)
        {
            if (s == null)
            {
                return "";
            }
            else
            {
                return Convert.ToString(s);
            }
        }

        /// <summary>
        /// 将obj类型转换为string
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static int ConvertToInt(this object s)
        {
            if (s == null)
            {
                return -1;
            }
            else
            {
                return Convert.ToInt32(s);
            }
        }

        /// <summary>
        /// 将字符串转int32
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static Int32 ConvertToInt32(this string s)
        {
            int i = 0;
            if (s == null)
            {
                return 0;
            }
            else
            {
                int.TryParse(s, out i);
            }
            return i;
        }

        /// <summary>
        /// 将字符串转double
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static double ConvertToDouble(this string s)
        {
            double i = 0;
            if (s == null)
            {
                return 0;
            }
            else
            {
                double.TryParse(s, out i);
            }
            return i;
        }

        /// <summary>
        /// 转换为datetime类型
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static DateTime ConvertToDateTime(this object s)
        {
            DateTime dt = new DateTime();
            DateTime.TryParse(s.ConvertToString(), out dt);
            return dt;
        }

        /// <summary>
        /// 转换为datetime类型的格式字符串
        /// </summary>
        /// <param name="s">要转换的对象</param>
        /// <param name="y">格式化字符串</param>
        /// <returns></returns>
        public static string ConvertToDateTimeString(this object s, string y)
        {
            DateTime dt = new DateTime();
            DateTime.TryParse(s.ConvertToString(), out dt);
            return dt.ToString(y);
        }

        public static string ConvertToDateString(this object date)
        {
            string dateType = "yyyy-MM-dd";
            DateTime dt = new DateTime();
            DateTime.TryParse(date.ConvertToString(), out dt);
            return dt.ToString(dateType);
        }

        /// <summary>
        /// 将复杂对象集合转换成ArrayList
        /// </summary>
        /// <param name="source"></param>
        /// <param name="datetimeformatter">时间格式</param>
        /// <returns></returns>
        public static Dictionary<string, object>[] ConvertToDictionaryArray<T>(List<T> source, string datetimeformatter = null) where T : class,new()
        {
            if (source == null)
            {
                return null;
            }

            //结果
            Dictionary<string, object>[] result = new Dictionary<string, object>[source.Count];

            for (int i = 0; i < source.Count; i++)
            {
                result[i] = new Dictionary<string, object>();
            }

            List<PropertyInfo> propList = typeof(T).GetProperties().ToList();

            //循环列
            foreach (var prop in propList)
            {
                //如果是时间格式，按指定格式转换
                if (prop.PropertyType == typeof(DateTime) && !string.IsNullOrEmpty(datetimeformatter))
                {
                    //循环行，给结果赋值
                    for (int i = 0; i < source.Count; i++)
                    {
                        object propVal = prop.GetValue(source[i], null);
                        DateTime dtValue = new DateTime();
                        //尝试转换格式
                        if (null != propVal && DateTime.TryParse(Convert.ToString(propVal), out dtValue))//转换成功
                        {
                            result[i].Add(prop.Name, dtValue.ToString(datetimeformatter));
                        }
                        else//转换失败，放入原值
                        {
                            result[i].Add(prop.Name, propVal);
                        }
                    }
                }
                else
                {
                    //循环行，给结果赋值
                    for (int i = 0; i < source.Count; i++)
                    {
                        object propVal = prop.GetValue(source[i], null);
                        result[i].Add(prop.Name, propVal);
                    }
                }
            }
            return result;
        }

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

        public static void CopyToStream(this System.IO.Stream sourceStream, System.IO.Stream targetStream, int bufferSize = 0)
        {
            if (null == sourceStream)
            {
                throw new ArgumentException("参数sourceStream不能为null");
            }
            if (null == targetStream)
            {
                throw new ArgumentException("参数targetStream不能为null");
            }
            bufferSize = bufferSize <= 0 ? 1024 * 1024 * 16 : bufferSize;
            byte[] buffer = new byte[bufferSize];
            long lPos = 0;
            int readLength = bufferSize;
            while (readLength > 0)
            {
                sourceStream.Seek(lPos, System.IO.SeekOrigin.Begin);
                readLength = sourceStream.Read(buffer, 0, buffer.Length);
                targetStream.Seek(lPos, System.IO.SeekOrigin.Begin);
                targetStream.Write(buffer, 0, readLength);
                lPos += readLength;
            }
        }

        public static byte[] GetFileBytes(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentException("参数filePath不能为空");
            }

            FileStream fs = null;
            MemoryStream ms = null;

            try
            {
                fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                ms = new MemoryStream();
                fs.CopyToStream(ms);
                byte[] result = ms.ToArray();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (null != fs) fs.Close();
                if (null != ms) ms.Close();
            }
        }
        public static string MD5(this string encryptString)
        {
            byte[] result = Encoding.Default.GetBytes(encryptString);
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] output = md5.ComputeHash(result);
            string encryptResult = BitConverter.ToString(output).Replace("-", "");
            return encryptResult;
        }

        //图片 转为    base64编码的文本
        public static string ImgToBase64String(string Imagefilename)
        {
            string base64 = "";
            MemoryStream ms = new MemoryStream();
            try
            {
                Bitmap bmp = new Bitmap(Imagefilename);

                System.Drawing.Imaging.ImageFormat imgFormat = System.Drawing.Imaging.ImageFormat.Jpeg;
                string extension = Imagefilename.Substring(Imagefilename.LastIndexOf("."));
                if (extension.ToLower() == "png")
                {
                    imgFormat = System.Drawing.Imaging.ImageFormat.Png;
                }
                else if (extension.ToLower() == "gif")
                {
                    imgFormat = System.Drawing.Imaging.ImageFormat.Gif;
                }
                bmp.Save(ms, imgFormat);
                byte[] bytes = ms.GetBuffer();
                base64 = Convert.ToBase64String(bytes);
                bmp.Dispose();
            }
            catch (Exception ex)
            {
                base64 = "";
            }
            finally
            {
                ms.Close();
            }
            return base64;
        }

        /// <summary>  
        /// Files the content.  
        /// </summary>  
        /// <param name="fileName">Name of the file.</param>  
        /// <returns></returns>  
        public static byte[] FileContent(string fileName)
        {
            FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            try
            {
                byte[] buffur = new byte[fs.Length];
                fs.Read(buffur, 0, (int)fs.Length);
                return buffur;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (fs != null)
                {
                    //关闭资源  
                    fs.Close();
                    fs.Dispose();
                }
            }
        }
      
        public static string GetAppSettingsValue(string appSettingKey)
        {
            string value = null;
            if (System.Web.Configuration.WebConfigurationManager.AppSettings.AllKeys.Contains(appSettingKey))
            {
                value = System.Web.Configuration.WebConfigurationManager.AppSettings[appSettingKey];
            }
            return value;
        }
    }
}
