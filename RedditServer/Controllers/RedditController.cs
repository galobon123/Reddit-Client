using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RedditProxy.Controllers
{
    [Route("api/[controller]")]
    public class RedditController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> RedditGet(string subreddit)
        {
            try
            {
                var result = await RedditRequest(subreddit);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<string> RedditRequest(string subreddit)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.UserAgent.ParseAdd("RedditProxy/1.0");
            var res = await client.GetAsync($"https://www.reddit.com/r/{subreddit}.json");
            var json = await res.Content.ReadAsStringAsync();

            return json;
        }
    }
}
