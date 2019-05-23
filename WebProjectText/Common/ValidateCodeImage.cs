using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Common
{
    /// <summary>
    /// 验证码类
    /// </summary>
    public class ValidateCodeImage
    {
        private string _strImageFileFolder = "C:\\tmpImages\\";
        /// <summary>
        /// 存放图片的临时文件夹
        /// </summary>
        public string ImageFileFolder
        {
            get
            {
                return _strImageFileFolder;
            }
            set { _strImageFileFolder = value; }
        }
        private string[] _arrValidateCodes = new string[] { 
            /*"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",*/ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" 
        };
        /// <summary>
        /// 验证码字符
        /// </summary>
        public string[] ValidateCodes
        {
            get
            {
                return _arrValidateCodes ?? new string[0];
            }
            set
            {
                _arrValidateCodes = value;
            }
        }

        private string[] _arrFontFamilies = new string[] { "Arial", "Times New Roman" };
        /// <summary>
        /// 验证码字体
        /// </summary>
        public string[] FontFamilies
        {
            get
            {
                return _arrFontFamilies ?? new string[0];
            }
            set
            {
                _arrFontFamilies = value;
            }
        }
        private int _fontSize = 24;
        /// <summary>
        /// 字体大小，像素
        /// </summary>
        public int FontSize
        {
            get
            {
                return _fontSize;
            }
            set
            {
                _fontSize = value;
            }
        }
        /// <summary>
        /// 字体大小，磅，只读
        /// </summary>
        public float EMFontSize
        {
            get { return _fontSize * 1.0f / 96 * 72; }
        }
        private int _fontPadding = 5;
        /// <summary>
        /// 字体间隙，像素
        /// </summary>
        public int FontPadding
        {
            get
            {
                return _fontPadding;
            }
            set
            {
                _fontPadding = value;
            }
        }
        private System.Drawing.Color[] _fontColors = new System.Drawing.Color[] { System.Drawing.Color.Black, System.Drawing.Color.Gray, System.Drawing.Color.Red, System.Drawing.Color.Blue };
        /// <summary>
        /// 字体颜色
        /// </summary>
        public System.Drawing.Color[] FontColors
        {
            get
            {
                return _fontColors;
            }
            set
            {
                _fontColors = value;
            }
        }

        public ValidateCodeImage()
        {
        }
        /// <summary>
        /// 生成随机字母
        /// </summary>
        /// <param name="length">长度</param>
        /// <returns></returns>
        public string CreateValidateCodes(int length)
        {
            try
            {
                if (length <= 0 || length > 10)
                {
                    throw new ArgumentException("长度length应该在1-10之间");
                }
                //System.Threading.Thread.Sleep(300);

                Random rnd = new Random();
                string[] arrCodes = new string[length];
                string strCode = null;
                System.Text.StringBuilder sbValidateCodes = new StringBuilder();
                for (int i = 0; i < length; i++)
                {
                    //初始状态或者已包含该数字
                    while (strCode == null || arrCodes.Contains(strCode))
                    {
                        strCode = ValidateCodes[rnd.Next(0, ValidateCodes.Length)];
                    }
                    arrCodes[i] = strCode;
                    sbValidateCodes.Append(strCode);
                }

                return sbValidateCodes.ToString();
            }
            catch { throw; }
        }

        /// <summary>
        /// 根据验证码生成图片
        /// </summary>
        /// <param name="validatecodes">验证码</param>
        /// <returns></returns>
        public string CreateValidateCodesImage(string validatecodes)
        {
            try
            {
                if (string.IsNullOrEmpty(validatecodes))
                {
                    throw new ArgumentException("验证码validatecodes不能为空");
                }

                string fileName = Guid.NewGuid().ToString() + ".png";
                string saveFileName = ImageFileFolder + fileName;

                using (System.IO.MemoryStream ms = CreateValidateCodesImageStream(validatecodes))
                {
                    System.IO.DirectoryInfo d = new System.IO.DirectoryInfo(ImageFileFolder);
                    if (!d.Exists)
                    {
                        d.Create();
                    }
                    using (System.IO.FileStream fs = new System.IO.FileStream(saveFileName, System.IO.FileMode.Create))
                    {
                        ms.CopyTo(fs);
                        fs.Flush();
                        fs.Close();
                    }
                }

                //删除旧文件
                System.Threading.Thread t = new System.Threading.Thread(new System.Threading.ThreadStart(() =>
                {
                    DeleteOldFiles(ImageFileFolder, DateTime.Now.AddDays(-1));
                }));
                t.Start();
                return saveFileName;
            }
            catch { throw; }
        }

        /// <summary>
        /// 根据验证码生成图片
        /// </summary>
        /// <param name="validatecodes">验证码</param>
        /// <returns></returns>
        public System.IO.MemoryStream CreateValidateCodesImageStream(string validatecodes)
        {
            try
            {
                if (string.IsNullOrEmpty(validatecodes))
                {
                    throw new ArgumentException("验证码validatecodes不能为空");
                }
            }
            catch { throw; }
            System.Drawing.Bitmap image = null;
            System.Drawing.Graphics grap = null;
            try
            {
                int imgWidth = validatecodes.Length * (FontSize + 2 * FontPadding);
                int imgHeight = FontSize + 2 * FontPadding;
                image = new System.Drawing.Bitmap(imgWidth, imgHeight);
                grap = System.Drawing.Graphics.FromImage(image);
                //设置高质量查值法
                grap.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.Low;

                //设置高质量，低速度呈现平滑程度
                grap.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.Default;
                grap.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighSpeed;
                //清空画布并以透明背景色填充
                grap.Clear(System.Drawing.Color.Transparent);
                Random rnd = new Random();

                System.Drawing.Font font = null;
                System.Drawing.Brush brush = null;
                System.Drawing.Pen pen = null;

                int iFontFamilyIndex = 0;//字体序号
                int iFontColorIndex = 0;//字体颜色
                int codeLeft = 0;//字符左边距
                int codeTop = FontPadding; ;//字符上边距
                int iStartX, iEndX, iStartY, iEndY;//干扰线起始点

                //绘制干扰线
                for (int i = 0; i < validatecodes.Length * 2; i++)
                {
                    iStartX = rnd.Next(imgWidth);
                    iEndX = rnd.Next(iStartX, iStartX + FontSize * 2 < imgWidth ? iStartX + FontSize * 2 : imgWidth);
                    iStartY = rnd.Next(imgHeight);
                    iEndY = rnd.Next(iStartY, iStartY + FontSize * 2 < imgHeight ? iStartY + FontSize * 2 : imgHeight);

                    iFontColorIndex = rnd.Next(FontColors.Length);
                    brush = new System.Drawing.SolidBrush(FontColors[iFontColorIndex]);
                    pen = new System.Drawing.Pen(brush);
                    grap.DrawLine(pen, new System.Drawing.Point(iStartX, iStartY), new System.Drawing.Point(iEndX, iEndY));
                }

                //依次绘制字符
                for (int i = 0; i < validatecodes.Length; i++)
                {
                    iFontFamilyIndex = rnd.Next(FontFamilies.Length);
                    iFontColorIndex = rnd.Next(FontColors.Length);
                    font = new System.Drawing.Font(FontFamilies[iFontFamilyIndex], EMFontSize);
                    brush = new System.Drawing.SolidBrush(FontColors[iFontColorIndex]);
                    codeLeft = FontPadding + i * (FontPadding * 2 + FontSize);

                    grap.DrawString(validatecodes[i].ToString(), font, brush, new System.Drawing.PointF(codeLeft, codeTop));
                }
                System.IO.MemoryStream ms = new System.IO.MemoryStream();
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

                return ms;
            }
            catch { throw; }
            finally
            {
                if (null != image)
                {
                    image.Dispose();
                }
                if (null != grap)
                {
                    grap.Dispose();
                }
            }
        }

        private void DeleteOldFiles(string folderPath, DateTime dt)
        {
            try
            {
                System.IO.DirectoryInfo d = new System.IO.DirectoryInfo(folderPath);
                if (!d.Exists)
                {
                    return;
                }

                System.IO.FileInfo[] arrFiles = d.GetFiles("*", System.IO.SearchOption.AllDirectories);
                foreach (var f in arrFiles)
                {
                    try
                    {
                        if (f.CreationTime < dt)
                        {
                            f.Delete();
                        }
                    }
                    catch { continue; }
                }
            }
            catch { return; }
        }
    }
}
