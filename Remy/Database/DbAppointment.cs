using Remy.Global;
using Remy.Models;
using System.Data.SqlClient;

namespace Remy.Database
{
	public class DbAppointment
	{
		public List<Appointment> GetAllAppointments()
		{
			List<Appointment> result = new List<Appointment>();

			try
			{
				DbAccess db = new DbAccess();

				using (SqlCommand cmd = new SqlCommand())
				{
					cmd.CommandText = @"USE [" + Config.dbName + "] " +
									  @"SELECT [id],[name],[date],[time],[notification_type],[description],[whatsapp],[sms],[email],[sent] FROM [dbo].[appointments] " +
									  @"WHERE [deleted] = 0;";

					using (cmd.Connection = db.OpenConnection())
					using (SqlDataReader reader = cmd.ExecuteReader())
					{
						while (reader.Read())
						{
							Appointment appointment = new Appointment();

							if (reader["id"] != DBNull.Value)
								appointment.Id = Convert.ToInt32(reader["id"]);

							if (reader["name"] != DBNull.Value)
								appointment.Name = reader["name"].ToString();

							if (reader["date"] != DBNull.Value)
								appointment.Date = Convert.ToDateTime(reader["date"]);

							if (reader["time"] != DBNull.Value)
								appointment.Time = TimeSpan.Parse(reader["time"].ToString());

							if (reader["notification_type"] != DBNull.Value)
								appointment.notificationType = reader["notification_type"].ToString();

							if (reader["description"] != DBNull.Value)
								appointment.Description = reader["description"].ToString();

							if (reader["whatsapp"] != DBNull.Value)
								appointment.Whatsapp = Convert.ToBoolean(reader["whatsapp"]);

							if (reader["sms"] != DBNull.Value)
								appointment.Sms = Convert.ToBoolean(reader["sms"]);

							if (reader["email"] != DBNull.Value)
								appointment.Email = Convert.ToBoolean(reader["email"]);

							if (reader["sent"] != DBNull.Value)
								appointment.Sent = Convert.ToBoolean(reader["sent"]);

							result.Add(appointment);
						}
					}
				}
			}
			catch (Exception ex)
			{
				Log.Add(LogType.error, "[DbAppointment.GetAllAppointments]: " + ex.Message);
			}

			return result;
		}

		public bool RegisterAppointment(Appointment appointment)
		{
			bool result = false;

			try
			{
				DbAccess db = new DbAccess();

				using (SqlCommand cmd = new SqlCommand())
				using (cmd.Connection = db.OpenConnection())
				{
					cmd.CommandText = @"USE [" + Config.dbName + "] " +
									  @"INSERT INTO [dbo].[appointments] (" +
									  @"[name],[date],[time],[notification_type],[description],[whatsapp],[email],[sms],[creation_date]) " +
									  @"VALUES (@Name,@Date,@Time,@Type,@Description,@WhatsApp,@Email,@Sms,@CreationDate);";

					cmd.Parameters.AddWithValue("@Name", appointment.Name);
					cmd.Parameters.AddWithValue("@Date", appointment.Date);
					cmd.Parameters.AddWithValue("@Time", appointment.Time);
					cmd.Parameters.AddWithValue("@Type", appointment.notificationType);
					cmd.Parameters.AddWithValue("@Description", appointment.Description);
					cmd.Parameters.AddWithValue("@WhatsApp", appointment.Whatsapp);
					cmd.Parameters.AddWithValue("@Email", appointment.Email);
					cmd.Parameters.AddWithValue("@Sms", appointment.Sms);
					cmd.Parameters.AddWithValue("@CreationDate", DateTime.Now);

					cmd.ExecuteNonQuery();
				}

				result = true;
			}
			catch (Exception ex)
			{
				Log.Add(LogType.error, "[DbAppointment.RegisterAppointment]: " + ex.Message);
			}

			return result;
		}
	}
}
