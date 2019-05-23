using System.Web.Http;
using WebActivatorEx;
using WebApi;
using Swashbuckle.Application;
using WebApi.App_Start;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace WebApi
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                    {
                        c.SingleApiVersion("v1", "WebApi");

                        c.IncludeXmlComments(GetXmlCommentsPath());

                        c.CustomProvider((defaultProvider) => new CachingSwaggerProvider(defaultProvider));

                        //c.GroupActionsBy(apiDesc => apiDesc.GetControllerAndActionAttributes<ControllerGroupAttribute>().Any() ?
                        //apiDesc.GetControllerAndActionAttributes<ControllerGroupAttribute>().First().GroupName + "_" +
                        //apiDesc.GetControllerAndActionAttributes<ControllerGroupAttribute>().First().Useage : "无模块归类");

                    })
                .EnableSwaggerUi(c =>
                    {
                        c.InjectJavaScript(System.Reflection.Assembly.GetExecutingAssembly(), "WebApi.Public.js.swagger.js");
                    });
        }

        /// <summary>
        /// 获取xml路径
        /// </summary>
        /// <returns></returns>
        protected static string GetXmlCommentsPath()
        {
            return System.String.Format(@"{0}\bin\WebApi.xml", System.AppDomain.CurrentDomain.BaseDirectory);
        }
    }
}
