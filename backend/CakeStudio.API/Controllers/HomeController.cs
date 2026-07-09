using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
