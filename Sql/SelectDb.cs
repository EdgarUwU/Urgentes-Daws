using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace Urgentes.Sql
{
    public class SelectDb
    {

        private static SqlConnection cnnLocal = new SqlConnection(cnn.cnnStr());

        public string getUrgentes()
        {
            DataTable dt = new DataTable();
            SqlCommand cmd = new SqlCommand("SELECT [ID],[Linea],[SetCode],[Qty],CONVERT(time(0),[ResultDate]) as ResultDate,[RelationType],[D0],[InTransit],[InBranch],[Inventary],[Plant],[ProcessHour],[CutHour],[CurrentDate] FROM [UrgentPlan] WHERE ((Plant = 'NDD' OR Plant = 'S/N') AND (InBranch + InTransit) = 0 AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21) AND D0 != 0) OR " +
                                            "(Plant = 'DGO' AND Inventary = 0 AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21) AND D0 != 0 )" +
                                            "ORDER BY ResultDate ASC", cnnLocal);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            cmd.Connection.Close();
            SqlCommand cmd2 = new SqlCommand("SELECT [ID],[Linea],[SetCode],[Qty],CONVERT(time(0),[ResultDate]) as ResultDate,[RelationType],[D0],[InTransit],[InBranch],[Inventary],[Plant],[ProcessHour],[CutHour],[CurrentDate] FROM [UrgentPlan] WHERE ((Plant = 'NDD' OR Plant = 'S/N') AND D0 > (InBranch + InTransit) AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21) AND (InBranch + InTransit) != 0) OR" +
                             "(Plant = 'DGO' AND D0 > Inventary AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21)AND Inventary != 0)" +
                             "ORDER BY ResultDate ASC", cnnLocal);
            SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
            da2.Fill(dt);
            cmd2.Connection.Close();
            SqlCommand cmd3 = new SqlCommand("SELECT [ID],[Linea],[SetCode],[Qty],CONVERT(time(0),[ResultDate]) as ResultDate,[RelationType],[D0],[InTransit],[InBranch],[Inventary],[Plant],[ProcessHour],[CutHour],[CurrentDate] FROM [UrgentPlan] WHERE ((Plant = 'NDD' OR Plant = 'S/N') AND D0 <= (InBranch + InTransit) AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21)) OR " +
                                            "(Plant = 'DGO' AND D0 <= Inventary AND CurrentDate = CONVERT(VARCHAR(10), GETDATE(), 21))" +
                                            "ORDER BY ResultDate ASC", cnnLocal);
            SqlDataAdapter da3 = new SqlDataAdapter(cmd3);
            da3.Fill(dt);
            cmd3.Connection.Close();
            return JsonConvert.SerializeObject(dt);
        }

        public int addUrgente(string SetCode, int Qty)
        {
            int resultado = 0;
            try
            {
                SqlCommand cmd = new("SP_Get", cnnLocal);
                cmd.Parameters.Add("SetCode", SqlDbType.VarChar).Value = SetCode;
                cmd.Parameters.Add("Qty", SqlDbType.Int).Value = Qty;
                cmd.Parameters.Add("Resultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                resultado = Convert.ToInt32(cmd.Parameters["Resultado"].Value);
                cmd.Connection.Close();
            }
            catch (Exception ex)
            {

                string mensaje = ex.Message.ToString();
                resultado = 0;
            }

            return resultado;
        }


        public string updateHours()
        {
            DataTable dt = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_UPDATEHOURS", cnnLocal);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 180000;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            cmd.Connection.Close();
            return JsonConvert.SerializeObject(dt);
        }

        public int uploadFile(DataTable table)
        {
            int resultado = 0;
            try
            {
                SqlCommand cmd = new("SP_UploadFile", cnnLocal);
                cmd.Parameters.Add("EstructuraCarga", SqlDbType.Structured).Value = table;
                cmd.Parameters.Add("Resultado", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                resultado = Convert.ToInt32(cmd.Parameters["Resultado"].Value);
                cmd.Connection.Close();
            }
            catch (Exception ex)
            {

                string mensaje = ex.Message.ToString();
                resultado = 0;
            }

            return resultado;
        }

        public Task<string?> GetToken()
        {
            string? token = "";
            var query = "SELECT token FROM [Usuarios].[dbo].[Tokens] WHERE id = 10 and expires > GETDATE()";
            using (SqlDataAdapter sda = new(query, cnnLocal))
            {
                SqlCommand cmd = new(query, cnnLocal);
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();
                sda.SelectCommand = cmd;
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    token = reader["token"].ToString();
                }
                cmd.Connection.Close();
            }
            return Task.FromResult(token);
        }
    }
}