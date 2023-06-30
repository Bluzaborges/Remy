using Remy.Global;
using System.Data.SqlClient;

namespace Remy.Database
{
	public class DbAccess
	{
		public SqlConnection OpenConnection()
		{
			SqlConnection result = new SqlConnection();

			try
			{
				string connectionString = String.Format(@"Server={0};Database={1};User Id={2};Password={3};",
														Config.dbHost, Config.dbName, Config.dbUser, Config.dbPass);

				result = new SqlConnection(connectionString);
				result.Open();
			}
			catch (Exception ex)
			{
				Log.Add(LogType.error, "[DbAccess.OpenConnection]: " + ex.Message);
			}

			return result;
		}
	}
}
