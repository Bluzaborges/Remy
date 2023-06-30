using Microsoft.AspNetCore.Mvc;
using Remy.Database;
using Remy.Global;
using Remy.Models;

namespace Remy.Controllers
{
    public class AppointmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Register()
        {
			Appointment appointment = new Appointment();
			appointment.Id = 0;

            return View("Register", appointment);
        }

		public IActionResult Edit(int id)
		{
			DbAppointment dbAppointment = new DbAppointment();

			Appointment appointment = dbAppointment.GetAppointmentById(id);

			return View("Register", appointment);
		}

        [HttpPost]
        public JsonResult RegisterAppointment([FromBody] Appointment appointment)
        {
            DbAppointment dbAppointment = new DbAppointment();
            bool result = false;

            try
            {
                if (string.IsNullOrEmpty(appointment.Name))
					return Json(new { success = result, message = "Nome do compromisso não preenchido." });

				if (appointment.Name.Length > 150)
					return Json(new { success = result, message = "Nome maior que o número de caracteres permitido." });

				if (appointment.Name.Length > 3000)
					return Json(new { success = result, message = "Descrição maior que o número de caracteres permitido." });

                if (appointment.Date == DateTime.MinValue)
					return Json(new { success = result, message = "Data não preenchida." });

				if (appointment.Date < DateTime.Now.Date)
					return Json(new { success = result, message = "Não é possível cadastrar compromissos com data inferior à atual." });

				if (appointment.Time == TimeSpan.Zero)
					return Json(new { success = result, message = "Hora não preenchida." });

				if (!appointment.Whatsapp && !appointment.Sms && !appointment.Email)
					return Json(new { success = result, message = "Nenhum tipo de notificação selecionado." });

				if (appointment.Id == 0)
					result = dbAppointment.RegisterAppointment(appointment);
				else
					result = dbAppointment.UpdateAppointment(appointment);

                if (!result)
					return Json(new { success = result, message = "Não foi possível inserir o compromisso." });

			} catch (Exception ex)
            {
				Log.Add(LogType.error, "[AppointmentController.RegisterAppointment]: " + ex.Message);
			}

			return new JsonResult(new { success = result, message = appointment.Name });
		}

		[HttpPost]
		public JsonResult GetAllAppointments()
		{
			DbAppointment dbAppointment = new DbAppointment();
			List<Appointment> appointments = new List<Appointment>();

			try
			{
				appointments = dbAppointment.GetAllAppointments();
			}
			catch (Exception ex)
			{
				Log.Add(LogType.error, "[AppointmentController.GetAllAppointments]: " + ex.Message);
			}

			return Json(appointments);
		}

		[HttpPost]
		public JsonResult DeleteAppointment([FromBody] int id)
		{
			DbAppointment dbAppointment = new DbAppointment();
			var result = false;

			try
			{
				if (id == 0)
					return Json(result);

				result = dbAppointment.DeleteAppointment(id);
			}
			catch (Exception ex)
			{
				Log.Add(LogType.error, "[AppointmentController.DeleteAppointment]: " + ex.Message);
			}

			return Json(result);
		}
	}
}
