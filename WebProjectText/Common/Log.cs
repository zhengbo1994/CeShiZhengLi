using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System;
using System.Collections.Concurrent;
using System.Linq;
using log4net;

namespace Common
{
    /// <summary>
    /// 日志
    /// </summary>
    public class Log
    {
        public static ConcurrentDictionary<long, string> dictExceptionLog = new ConcurrentDictionary<long, string>();
        private static long Max_Exception_Index = -1;

        private ILog logger;
        public Log(ILog log)
        {
            this.logger = log;
        }
        public void Debug(object message, bool isSave = false)
        {
            if (isSave)
            {
                WriteLog(message);
            }
            this.logger.Debug(message);
        }
        public void Error(object message, bool isSave = false)
        {
            this.logger.Error(message);
        }
        public void Info(object message, bool isSave = false)
        {
            this.logger.Info(message);
        }
        public void Warn(object message, bool isSave = false)
        {
            this.logger.Warn(message);
        }

        private void WriteLog(object message)
        {
            if (message == null)
            {
                return;
            }
            Max_Exception_Index++;
            bool isSu = true;
            if (Max_Exception_Index >= 1000)
            {
                long key = dictExceptionLog.Keys.Last();
                string value = string.Empty;
                isSu = dictExceptionLog.TryRemove(key, out value);
                Max_Exception_Index = 999;
            }
            if (isSu)
            {
                dictExceptionLog.TryAdd(Max_Exception_Index, message.ToString());
            }
        }
    }
}
