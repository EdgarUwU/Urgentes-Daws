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
            SqlCommand cmd = new SqlCommand("SELECT * FROM [UrgentPlan] WHERE Total = 0 order by ResultDate ASC", cnnLocal);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            cmd.Connection.Close();
            SqlCommand cmd2 = new SqlCommand("SELECT * FROM [UrgentPlan] WHERE Total <   D0 order by ResultDate ASC", cnnLocal);
            SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
            da2.Fill(dt);
            cmd2.Connection.Close();
            SqlCommand cmd3 = new SqlCommand("SELECT * FROM [UrgentPlan] WHERE Total > D0 order by ResultDate ASC", cnnLocal);
            SqlDataAdapter da3 = new SqlDataAdapter(cmd3);
            da3.Fill(dt);
            cmd3.Connection.Close();
            return JsonConvert.SerializeObject(dt);
        }

        public string addUrgente(string SetCode, int Qty)
        {
            DataTable dt = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_Get", cnnLocal);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@SetCode", SetCode);
            cmd.Parameters.AddWithValue("@Qty", Qty);
            cmd.Parameters.Add("@Resultado", SqlDbType.Int).Direction = ParameterDirection.Output;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            cmd.Connection.Close();
            return JsonConvert.SerializeObject(dt);
        }


        public string updateHours()
        {
            DataTable dt = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_UPDATEHOURS", cnnLocal);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 90000;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            cmd.Connection.Close();
            return JsonConvert.SerializeObject(dt);
        }
    }
}