namespace Urgentes.Sql
{
    public class cnn
    {
        public static string cnnStr()
        {
            return "Data source=192.168.141.6; Initial Catalog=Urgentes; User ID=sa; Password=SQLS3rv3r!#";

        }
        public static string cnnStrHiss()
        {
            return "Data source=192.168.141.3; Initial Catalog=Urgentes; User ID=PlantSupport; Password=plantsupport1522";

        }
    }
}