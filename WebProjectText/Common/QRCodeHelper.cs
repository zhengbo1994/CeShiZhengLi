using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Drawing;
using ThoughtWorks.QRCode.Codec;
using System.Text.RegularExpressions;
using System.IO;
using System.Drawing.Drawing2D;
using System.Web;

namespace CLSLibrary
{
    public class QRCodeHelper
    {
        /// <summary>
        /// 根据字符串生成二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="FileFolder">保存二维码的路径</param>
        /// <param name="size">图片大小</param>
        /// <returns>返回绝对路径</returns>
        public string GetQRCODEByString(string strCode, string FileFolder, int? size=null)
        {
            string txt_qr = ConverToGB(strCode.Trim(), 16);//输入的字符串
            string qrEncoding = "Byte";
            string Level = "M";
            string txt_ver = "0";
            string txt_size = "2";

            QRCodeEncoder qrCodeEncoder = new QRCodeEncoder();
            String encoding = qrEncoding;
            if (encoding == "Byte")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
            }
            else if (encoding == "AlphaNumeric")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.ALPHA_NUMERIC;
            }
            else if (encoding == "Numeric")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.NUMERIC;
            }
            try
            {
                int scale = Convert.ToInt16(txt_size);
                qrCodeEncoder.QRCodeScale = scale;
            }
            catch
            {
                return "";
            }
            try
            {
                int version = Convert.ToInt16(txt_ver);
                qrCodeEncoder.QRCodeVersion = version;
            }
            catch
            {
                return "";
            }
            string errorCorrect = Level;
            if (errorCorrect == "L")
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.L;
            else if (errorCorrect == "M")
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.M;
            else if (errorCorrect == "Q")
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.Q;
            else if (errorCorrect == "H")
                qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.H;

            Image image;
            String data = txt_qr;
            image = qrCodeEncoder.Encode(data);
            if (null != size)
            {
                image = new Bitmap(image, new Size((int)size, (int)size));
            }
            string filename = DateTime.Now.ToString("yyyyMMddHHmmssffff") + ".png";

            string filepath = FileFolder + "\\" + filename;//文件完整路径
            System.IO.FileStream fs = new System.IO.FileStream(filepath, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.Write);
            image.Save(fs, System.Drawing.Imaging.ImageFormat.Png);
            fs.Close();
            image.Dispose();
            image.Dispose();
            return filepath;
        }

        /// <summary>
        /// 根据字符串生成二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="filePath">保存二维码的路径</param>
        /// <param name="size">图片大小</param>
        public void CreateQRCodeFileByString(string strCode, string filePath, int? size = null)
        {
            System.IO.FileStream fs = null;
            Image image = null;
            try
            {
                string txt_qr = ConverToGB(strCode.Trim(), 16);//输入的字符串
                string qrEncoding = "Byte";
                string Level = "M";
                string txt_ver = "0";
                string txt_size = "2";

                QRCodeEncoder qrCodeEncoder = new QRCodeEncoder();
                String encoding = qrEncoding;
                if (encoding == "Byte")
                {
                    qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
                }
                else if (encoding == "AlphaNumeric")
                {
                    qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.ALPHA_NUMERIC;
                }
                else if (encoding == "Numeric")
                {
                    qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.NUMERIC;
                }
                try
                {
                    int scale = Convert.ToInt16(txt_size);
                    qrCodeEncoder.QRCodeScale = scale;
                }
                catch
                {
                    throw;
                }
                try
                {
                    int version = Convert.ToInt16(txt_ver);
                    qrCodeEncoder.QRCodeVersion = version;
                }
                catch
                {
                    throw;
                }
                string errorCorrect = Level;
                if (errorCorrect == "L")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.L;
                else if (errorCorrect == "M")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.M;
                else if (errorCorrect == "Q")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.Q;
                else if (errorCorrect == "H")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.H;

                String data = txt_qr;
                image = qrCodeEncoder.Encode(data);
                if (null != size)
                {
                    image = new Bitmap(image, new Size((int)size, (int)size));
                }
                string filename = DateTime.Now.ToString("yyyyMMddHHmmssffff") + ".png";

                FileInfo file = new FileInfo(filePath);//文件完整路径
                if (!file.Directory.Exists)
                {
                    file.Directory.Create();
                }
                fs = new System.IO.FileStream(filePath, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.Write);
                image.Save(fs, System.Drawing.Imaging.ImageFormat.Png);
            }
            catch { throw; }
            finally
            {
                if (null != fs) fs.Close();
                if (null != image) image.Dispose();
            }
        }

        /// <summary>
        /// 10进制或16进制转换为中文
        /// </summary>
        /// <param name="name">要转换的字符串</param>
        /// <param name="fromBase">进制（10或16）</param>
        /// <returns></returns>
        private static string ConverToGB(string text, int fromBase)
        {
            string value = text;
            MatchCollection mc;
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            switch (fromBase)
            {
                case 10:

                    MatchCollection mc1 = Regex.Matches(text, @"&#([\d]{5})", RegexOptions.Compiled | RegexOptions.IgnoreCase);
                    foreach (Match _v in mc1)
                    {
                        string w = _v.Value.Substring(2);
                        w = Convert.ToString(int.Parse(w), 16);
                        byte[] c = new byte[2];
                        string ss = w.Substring(0, 2);
                        int c1 = Convert.ToInt32(w.Substring(0, 2), 16);
                        int c2 = Convert.ToInt32(w.Substring(2), 16);
                        c[0] = (byte)c2;
                        c[1] = (byte)c1;
                        sb.Append(Encoding.Unicode.GetString(c));
                    }
                    value = sb.ToString();

                    break;
                case 16:
                    mc = Regex.Matches(text, @"\\u([\w]{2})([\w]{2})", RegexOptions.Compiled | RegexOptions.IgnoreCase);
                    if (mc != null && mc.Count > 0)
                    {

                        foreach (Match m2 in mc)
                        {
                            string v = m2.Value;
                            string w = v.Substring(2);
                            byte[] c = new byte[2];
                            int c1 = Convert.ToInt32(w.Substring(0, 2), 16);
                            int c2 = Convert.ToInt32(w.Substring(2), 16);
                            c[0] = (byte)c2;
                            c[1] = (byte)c1;
                            sb.Append(Encoding.Unicode.GetString(c));
                        }
                        value = sb.ToString();
                    }
                    break;
            }
            return value;
        }

        /// <summary>
        /// 根据字符串生成二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="size">图片大小</param>
        /// <returns>返回文件流</returns>
        public Image GetQRCodeImageFromString(string strCode, int? size = null)
        {
            string txt_qr = ConverToGB(strCode.Trim(), 16);//输入的字符串
            string qrEncoding = "Byte";
            string Level = "M";
            string txt_ver = "0";
            string txt_size = "2";

            QRCodeEncoder qrCodeEncoder = new QRCodeEncoder();
            String encoding = qrEncoding;
            if (encoding == "Byte")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.BYTE;
            }
            else if (encoding == "AlphaNumeric")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.ALPHA_NUMERIC;
            }
            else if (encoding == "Numeric")
            {
                qrCodeEncoder.QRCodeEncodeMode = QRCodeEncoder.ENCODE_MODE.NUMERIC;
            }

            try
            {
                try
                {
                    int scale = Convert.ToInt16(txt_size);
                    qrCodeEncoder.QRCodeScale = scale;
                }
                catch
                {
                    throw;
                }
                try
                {
                    int version = Convert.ToInt16(txt_ver);
                    qrCodeEncoder.QRCodeVersion = version;
                }
                catch
                {
                    throw;
                }
                string errorCorrect = Level;
                if (errorCorrect == "L")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.L;
                else if (errorCorrect == "M")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.M;
                else if (errorCorrect == "Q")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.Q;
                else if (errorCorrect == "H")
                    qrCodeEncoder.QRCodeErrorCorrect = QRCodeEncoder.ERROR_CORRECTION.H;


                string data = txt_qr;
                Image image = qrCodeEncoder.Encode(data);
                if (null != size)
                {
                    image = new Bitmap(image, new Size((int)size, (int)size));
                }
                return image;
            }
            catch { return null; }
        }

        /// <summary>
        /// 根据字符串生成带logo的二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="size">图片大小</param>
        /// <param name="logoPath">logo的路径（不要logo则为null）</param>
        /// <returns>返回文件流</returns>
        public Image GetQRCodeImageFromString(string strCode, int? size, string logoPath = null)
        {
            try
            {
                Image image = this.GetQRCodeImageFromString(strCode, size);
                Image newImage = null;
                if (!string.IsNullOrEmpty(logoPath))
                {
                    System.IO.FileInfo fInfo = new FileInfo(logoPath);
                    if (fInfo.Exists)
                    {
                        newImage = CombinImage(image, logoPath);
                    }
                }
                return newImage ?? image;
            }
            catch { return null; }
        }

        /// <summary>
        /// 根据字符串生成带logo的二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="size">图片大小</param>
        /// <param name="logoPath">logo的路径（不要logo则为null）</param>
        /// <returns>返回文件流</returns>
        public MemoryStream GetQRCodeStreamFromString(string strCode, int? size = null, string logoPath = null)
        {
            Image img = null;
            MemoryStream ms = new MemoryStream();
            try
            {
                img = this.GetQRCodeImageFromString(strCode, size, logoPath);
                img.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                return ms;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (img != null)
                {
                    img.Dispose();
                }
            }
        }

        /// <summary>
        /// 根据字符串生成带logo的二维码图片
        /// </summary>
        /// <param name="strCode">要生成二维码的字符串</param>
        /// <param name="size">图片大小</param>
        /// <param name="FileFolder">保存二维码的路径</param>
        /// /// <param name="logoPath">logo路径</param>
        /// <returns>返回绝对路径</returns>
        public string GetQRCodeWithLogoByString(string strCode, string FileFolder, int size, string logoPath = null)
        {
            Image image = null;
            System.IO.FileStream fs = null;
            try
            {
                if (string.IsNullOrEmpty(logoPath))
                {
                    image = GetQRCodeImageFromString(strCode, size);
                }
                else
                {
                    image = GetQRCodeImageFromString(strCode, size, logoPath);
                }
                image = new Bitmap(image, new Size(size, size));
                string filename = DateTime.Now.ToString("yyyyMMddHHmmssffff") + ".png";
                string filepath = FileFolder + "\\" + filename;//文件完整路径

                fs = new System.IO.FileStream(filepath, System.IO.FileMode.OpenOrCreate, System.IO.FileAccess.Write);
                image.Save(fs, System.Drawing.Imaging.ImageFormat.Png);
                return filepath;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (null != image) image.Dispose();
                if (null != fs) fs.Close();
            }
        }

        /// <summary>    
        /// 调用此函数后使此两种图片合并，类似相册，有个    
        /// 背景图，中间贴自己的目标图片    
        /// </summary>    
        /// <param name="imgBack">粘贴的源图片</param>    
        /// <param name="destImg">粘贴的目标图片</param>    
        public static Image CombinImage(Image imgBack, string destImg)
        {
            Image img = Image.FromFile(destImg);        //照片图片      
            if (img.Height != 30 || img.Width != 30)
            {
                img = KiResizeImage(img, 30, 30, 0);
            }
            Graphics g = Graphics.FromImage(imgBack);

            g.DrawImage(imgBack, 0, 0, imgBack.Width, imgBack.Height);      //g.DrawImage(imgBack, 0, 0, 相框宽, 相框高);     

            //g.FillRectangle(System.Drawing.Brushes.White, imgBack.Width / 2 - img.Width / 2 - 1, imgBack.Width / 2 - img.Width / 2 - 1,1,1);//相片四周刷一层黑色边框    

            //g.DrawImage(img, 照片与相框的左边距, 照片与相框的上边距, 照片宽, 照片高);    

            g.DrawImage(img, imgBack.Width / 2 - img.Width / 2, imgBack.Width / 2 - img.Width / 2, img.Width, img.Height);
            GC.Collect();
            return imgBack;
        }

        /// <summary>    
        /// Resize图片    
        /// </summary>    
        /// <param name="bmp">原始Bitmap</param>    
        /// <param name="newW">新的宽度</param>    
        /// <param name="newH">新的高度</param>    
        /// <param name="Mode">保留着，暂时未用</param>    
        /// <returns>处理以后的图片</returns>    
        public static Image KiResizeImage(Image bmp, int newW, int newH, int Mode)
        {
            try
            {
                Image b = new Bitmap(newW, newH);
                Graphics g = Graphics.FromImage(b);
                // 插值算法的质量    
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.DrawImage(bmp, new Rectangle(0, 0, newW, newH), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
                g.Dispose();
                return b;
            }
            catch
            {
                return null;
            }
        }
    }
}
