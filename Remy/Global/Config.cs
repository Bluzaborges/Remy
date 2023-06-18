using System;

namespace Remy.Global
{
	public static class Config
	{
		//Database
		public static string dbHost = null;
		public static string dbName = null;
		public static string dbUser = null;
		public static string dbPass = null;

		public static bool LoadAppSettings()
		{
			bool result = false;

			try
			{
				IConfiguration config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

				dbHost = config.GetValue<string>("Database:Host");
				dbName = config.GetValue<string>("Database:Name");
				dbUser = config.GetValue<string>("Database:User");
				dbPass = config.GetValue<string>("Database:Pass");

				result = true;
			}
			catch
			{ }

			return result;
		}
	}

	public enum LogType
	{
		success,
		info,
		error
	}
}
