using System.Data.SqlClient;
using Remy.Database;

namespace Remy.Global
{
	public static class Log
	{
		public static void Add(LogType type, string message)
		{
			DbAccess db = new DbAccess();

			using (SqlCommand cmd = new SqlCommand())
			{
				cmd.CommandText = @"USE [" + Config.dbName + "] " +
								  @"INSERT INTO [dbo].[logs] ([creation_date], [type], [message]) " +
								  @"VALUES (@creationDate, @type, @message);";

				cmd.Parameters.AddWithValue("@creationDate", DateTime.Now);
				cmd.Parameters.AddWithValue("@type", type.ToString());
				cmd.Parameters.AddWithValue("@message", message);

				using (cmd.Connection = db.OpenConnection())
				{
					cmd.ExecuteNonQuery();
				}
			}
		}
	}
}
