using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Caching;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Xml;
using System.Xml.Serialization;

namespace Common
{
    public class ConfigContext
    {


        private const string ConfigContextKey = "ConfigContext.xml";
        private static readonly Cache Cache = System.Web.HttpRuntime.Cache;


        static ConfigContext()
        {
            if (!File.Exists(XmlPath))
            {
                CreateFile(new ConfigContext());
            }
        }
        private static string XmlPath
        {
            get
            {
                return AppDomain.CurrentDomain.BaseDirectory + @"\xml\" + ConfigContextKey;
            }
        }
        public static ConfigContext Instance
        {
            get
            {
                try
                {
                    var obj = Cache[ConfigContextKey];
                    if (obj == null)
                    {
                        CacheDependency dp = new CacheDependency(XmlPath);//建立缓存依赖项dp
                        using (var fs = new FileStream(XmlPath, FileMode.Open))
                        {
                            using (var sr = new StreamReader(fs))
                            {
                                var context = XmlConvert.XmlDeserialize<ConfigContext>(sr.ReadToEnd(), System.Text.Encoding.UTF8);
                                Cache.Insert(ConfigContextKey, context, dp);
                                return context;
                            }
                        }
                    }
                    return (ConfigContext)obj;
                }
                catch (Exception ex)
                {
                    throw new Exception("获取配置文件发生错误，请检查【" + ConfigContextKey + "】文件", ex);
                }
            }
        }

        public void Save()
        {
            CreateFile(Instance);
        }

        private static void CreateFile(ConfigContext context)
        {
            using (var fs = new FileStream(XmlPath, FileMode.Create))
            {
                using (var sr = new StreamWriter(fs, System.Text.Encoding.UTF8))
                {
                    var configText = XmlConvert.XmlSerialize<ConfigContext>(context);
                    sr.Write(configText);
                }
            }
        }
    }
    public class XmlConvert
    {
        /// <summary>
        /// 从XML字符串中反序列化对象
        /// </summary>
        /// <typeparam name="T">结果对象类型</typeparam>
        /// <param name="s">包含对象的XML字符串</param>
        /// <param name="encoding">编码方式</param>
        /// <returns>反序列化得到的对象</returns>
        public static T XmlDeserialize<T>(string s, Encoding encoding)
        {
            if (string.IsNullOrEmpty(s))
                throw new ArgumentNullException("s");
            if (encoding == null)
                throw new ArgumentNullException("encoding");

            XmlSerializer mySerializer = new XmlSerializer(typeof(T));
            using (MemoryStream ms = new MemoryStream(encoding.GetBytes(s)))
            {
                using (StreamReader sr = new StreamReader(ms, encoding))
                {
                    return (T)mySerializer.Deserialize(sr);
                }
            }
        }

        /// <summary>
        /// XML序列化
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="model"></param>
        /// <returns></returns>
        public static string XmlSerialize<T>(T model) where T : class,new()
        {
            using (var sw = new StringWriter())
            {
                //创建XML命名空间
                XmlSerializerNamespaces ns = new XmlSerializerNamespaces();
                ns.Add("", "");
                XmlSerializer serializer = new XmlSerializer(typeof(T));
                serializer.Serialize(sw, model, ns);
                return sw.ToString();
            }
        }


    }

}


