using Microsoft.AspNetCore.Mvc;
using Urgentes.Sql;
using System.Data.SqlClient;
using System.Data;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Urgentes.Models;
using NPOI.OpenXml4Net.OPC;

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
        public int AddUrgente(string SetCode, int Qty)
        {
            return select.addUrgente(SetCode, Qty);
        }

        [HttpGet]
        [Route("updateHours")]
        public string updateHours()
        {
            return select.updateHours();
        }

        [HttpPost]
        [Route("uploadFile")]
        public async Task<String> uploadFile([FromForm] LoginData Data, [FromForm] IFormFile file)
        {
            int resultado = 0;
            var httpClient = new HttpClient();
            var loginData = System.Text.Json.JsonSerializer.Serialize<LoginData>(Data);
            var token = select.GetToken();

            string _urlApi = "http://192.168.141.6:8032/api/LoginCorreo?token=" + token.Result + "&appName=49";
            HttpContent content = new StringContent(loginData, System.Text.Encoding.UTF8, "application/json");
            var httresponse = await httpClient.PostAsync(_urlApi, content);
            if (httresponse.IsSuccessStatusCode)
            {
                try
                {

                    string ruta_carpeta = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "public", "uploads");
                    if (!Directory.Exists(ruta_carpeta))
                    {
                        Directory.CreateDirectory(ruta_carpeta);
                    }
                    var ruta_guardado = Path.Combine(ruta_carpeta, file.FileName);
                    using (FileStream stream = new FileStream(ruta_guardado, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    IWorkbook MiExcel;
                    FileStream fs = new FileStream(ruta_guardado, FileMode.Open, FileAccess.Read);
                    if (ruta_guardado.EndsWith(".xlsx"))
                    {
                        MiExcel = new XSSFWorkbook(fs);
                    }
                    else
                    {
                        MiExcel = new HSSFWorkbook(fs);
                    }
                    ISheet sheet = MiExcel!.GetSheetAt(0);
                    IRow row = sheet.GetRow(0);

                    DataTable table = new DataTable();
                    table.Columns.Add("SetCode", typeof(string));
                    table.Columns.Add("D0", typeof(string));
                    table.Columns.Add("RelationType", typeof(string));

                    if (sheet != null)
                    {
                        int cantidadfilas = sheet.LastRowNum;
                        for (int i = 1; i <= cantidadfilas; i++)
                        {
                            IRow fila = sheet.GetRow(i);
                            if (fila != null)
                            {
                                var SetCode = fila.GetCell(0) == null ? "" : fila.GetCell(0).ToString()!.Trim();
                                var D0 = fila.GetCell(2) == null ? "0" : fila.GetCell(2).ToString()!.Trim();
                                var RelationTYpe = fila.GetCell(1) == null ? "" : fila.GetCell(1).ToString()!.Trim();

                                table.Rows.Add(SetCode, D0, RelationTYpe);
                            }
                        }
                        resultado = select.uploadFile(table);
                        table.Clear();
                    }
                    MiExcel.Close();
                    fs.Close();
                    System.IO.File.Delete(ruta_guardado);
                    System.IO.Directory.Delete(ruta_carpeta);
                    if (resultado != 0)
                    {
                        return "1";
                    }
                    else
                    {
                        return "0";
                    }
                }
                catch (Exception ex)
                {
                    return "Error: " + ex.Message;
                }
            }
            else
            {
                return "0";
            }
        }
    }
}
