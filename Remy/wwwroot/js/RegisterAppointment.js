
var KTSelect2 = function () {

    var demos = function () {

        $('#select-routine').select2({
            placeholder: "Escolha se o compromisso será um rotina",
            minimumResultsForSearch: Infinity
        });

        $('#select-type').select2({
            placeholder: "Escolha quando a notificação deverá ser enviada",
            minimumResultsForSearch: Infinity
        });
    }

    return {
        init: function () {
            demos();
        }
    };
}();

$("#btnSubmit").click(function () {

    var formData = {
        name: $("#appointment-name").val(),
        date: $("#appointment-date").val() == "" ? "0001-01-01" : $("#appointment-date").val(),
        time: $("#appointment-time").val() == "" ? "00:00:00" : $("#appointment-time").val() + ":00",
        notificationType: $("#select-type").val(),
        description: $("#appointment-description").val(),
        whatsapp: $("#type-whatsapp").prop('checked'),
        sms: $("#type-sms").prop('checked'),
        email: $("#type-email").prop('checked')
    };

    $.ajax({
        url: "/Appointment/RegisterAppointment",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (data) {
            if (data.success) {
                toastr.success("Adicionado!", 'Sucesso!');
                window.location.href = document.referrer;
            } else {
                Swal.fire({
                    title: "Atenção",
                    html: data.message + '<br><p style="color: silver; margin-top:12px; font-weight: normal;">Clique em ok para fechar.</p>',
                    icon: 'error',
                    timerProgressBar: true,
                    confirmButtonText: "Ok",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    }

                })
            }
        }
    });
});

jQuery(document).ready(function () {
    KTSelect2.init();
});

