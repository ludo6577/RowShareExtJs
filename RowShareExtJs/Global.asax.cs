﻿using System.Web.Http;
using RowShareExtJsApp;

namespace RowShareExtJs
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
