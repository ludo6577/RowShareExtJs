using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace RowShareExtJs.Controllers
{
    public class ColumnController : ApiController
    {
        [HttpGet]
        [Route("api/column/loadforparent/{listId}")]
        public HttpResponseMessage LoadForParent(string listId)
        {
            string url = string.Format("https://www.rowshare.com/api/column/loadforparent/{0}", listId);
            WebClient client = new WebClient();
            var json = client.DownloadString(url);

            return new HttpResponseMessage()
            {
                Content = new StringContent(
                    json,
                    Encoding.UTF8,
                    "text/json"
                )
            };
        }
    }
}