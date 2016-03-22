using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace RowShareExtJs.Controllers
{
    public class ListController : ApiController
    {
        [HttpGet]
        [Route("api/list/load/{listId}")]
        public HttpResponseMessage Load(string listId)
        {
            string url = string.Format("https://www.rowshare.com/api/list/load/{0}", listId);
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