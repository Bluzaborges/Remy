namespace Remy.Models
{
	public class Appointment
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public DateTime Date { get; set; }
		public TimeSpan Time { get; set; }
		public string Description { get; set; }
		public string notificationType { get; set; }
		public bool Whatsapp { get; set; }
		public bool Sms { get; set; }
		public bool Email { get; set; }
		public bool Sent { get; set; }
	}
}
