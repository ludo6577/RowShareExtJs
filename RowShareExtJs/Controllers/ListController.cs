using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace RowShareExtJs.Controllers
{
    public class RowController : ApiController
    {
        [HttpGet]
        [Route("api/row/loadforparent/{listId}")]
        public HttpResponseMessage LoadForParent(string listId)
        {
            string url = string.Format("https://www.rowshare.com/api/row/loadForParent/{0}", listId);
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