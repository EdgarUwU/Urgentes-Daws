using Microsoft.AspNetCore.Mvc;
using Urgentes.Sql;
using System.Data.SqlClient;


namespace Urgentes.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private readonly SelectDb select = new SelectDb();
        private SqlConnection? cnnLocal = new SqlConnection();

        [HttpGet]
        [Route("getUrgentes")]
        public string GetUrgentes()
        {
            return select.getUrgentes();
        }

        [HttpGet]
        [Route("addUrgente:{SetCode}:{Qty}")]
        public string AddUrgente(string SetCode, int Qty)
        {
            return select.addUrgente(SetCode, Qty);
        }

        [HttpGet]
        [Route("updateHours")]
        public string updateHours()
        {
            return select.updateHours();
        }
    }
}
