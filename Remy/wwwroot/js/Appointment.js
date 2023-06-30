var calendar;

var KTCalendarBasic = function () {

    return {

        init: function (data) {

            var appointmentsList = [];

            for (let i = 0; i < data.length; i++) {
                let appointment = {};
                appointment.id = data[i].id;
                appointment.url = "/Appointment/Edit?id=" + data[i].id;
                appointment.title = data[i].name;
                appointment.start = data[i].date.substring(0, 10) + 'T' + data[i].time;
                appointment.description = data[i].description;
                appointment.className = "fc-event-success";
                appointmentsList.push(appointment);
            }

            var todayDate = moment().startOf('day');
            var YM = todayDate.format('YYYY-MM');
            var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            var TODAY = todayDate.format('YYYY-MM-DD');
            var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

            var calendarEl = document.getElementById('kt_calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                plugins: ['bootstrap', 'interaction', 'dayGrid', 'timeGrid', 'list'],
                themeSystem: 'bootstrap',
                locale: 'pt-br',

                isRTL: KTUtil.isRTL(),

                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },

                height: 550,
                contentHeight: 550,
                aspectRatio: 1,

                nowIndicator: true,
                now: TODAY,

                views: {
                    dayGridMonth: { buttonText: 'mês' },
                    timeGridWeek: { buttonText: 'semana' },
                    timeGridDay: { buttonText: 'dia' }
                },

                defaultView: 'dayGridMonth',
                defaultDate: TODAY,

                editable: true,
                eventLimit: true,
                navLinks: true,
                events: appointmentsList,

                eventRender: function (info) {
                    var element = $(info.el);

                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        if (element.hasClass('fc-day-grid-event')) {
                            element.data('content', info.event.extendedProps.description);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        } else if (element.hasClass('fc-time-grid-event')) {
                            element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        } else if (element.find('.fc-list-item-title').lenght !== 0) {
                            element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        }
                    }
                }
            });

            calendar.render();
        }
    };
}();

function LoadAppointmentsCalendar() {

    $.ajax({
        url: "/Appointment/GetAllAppointments",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (data) {
            KTCalendarBasic.init(data);
        }
    });
}

function LoadAppointmentsTable() {

    datatable = $('#kt_datatable').KTDatatable({

        data: {
            type: 'remote',
            source: {
                read: {
                    url: "/Appointment/GetAllAppointments",
                    timeout: 240000,
                }
            },
            pageSize: 10,
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false,
        },
        layout: {
            scroll: true,
            footer: false,
            spinner: {
                message: 'Procurando...'
            }
        },
        scrollX: true,
        translate: {
            records: {
                processing: 'Aguarde...',
                noRecords: 'Nenhum compromisso encontrado.'
            },
            toolbar: {
                pagination: {
                    items: {
                        default: {
                            first: 'Primeiro',
                            prev: 'Anterior',
                            next: 'Próximo',
                            last: 'Último',
                            more: 'Mais Páginas',
                            input: 'Número da Página',
                            select: 'Selecione a quantidade por página'
                        },
                        info: 'Mostrando {{start}} - {{end}} de {{total}} registros'
                    }
                }
            }
        },
        sortable: true,
        pagination: true,
        search: {
            input: $('#kt_datatable_search_query'),
        },
        columns: [
            {
                field: 'name',
                title: 'NOME',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                width: 250,
                template: function (row) {
                    return '<a href="/FinalClient/EditFinalClient?id=' + row.id + '" class="text-truncate text-dark-75 d-block font-size-md">' + row.name + '</a>';
                }
            },
            {
                field: 'date',
                title: 'DATA',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {

                    const splitDate = row.date.split('T')[0].split("-");
                    const newDate = splitDate[2] + "/" + splitDate[1] + "/" + splitDate[0];

                    var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">' + newDate + '</a>'

                    return output;
                }
            },
            {
                field: 'time',
                title: 'HORA',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {
                    var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">' + row.time.substring(0, 5) + '</a>'

                    return output;
                }
            },
            {
                field: 'notification_type',
                title: 'NOTIFICAÇÃO',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {

                    if (row.notificationType == "hour")
                        var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">1 hora antes</a>'
                    if (row.notificationType == "day")
                        var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">1 dia antes</a>'
                    if (row.notificationType == "week")
                        var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">1 semana antes</a>'
                    if (row.notificationType == "month")
                        var output = '\<a class="text-truncate text-dark-75 d-block font-size-md">1 mês antes</a>'

                    return output;
                }
            },
            {
                field: 'whatsapp',
                title: 'WHATSAPP',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    if (!row.whatsapp)
                        return '<span class="label font-weight-bold label-lg label-inline label-bold">não</span>';

                    return '<span class="label font-weight-bold label-lg label-light-primary label-inline label-bold">sim</span>';
                }
            },
            {
                field: 'sms',
                title: 'SMS',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    if (!row.sms)
                        return '<span class="label font-weight-bold label-lg label-inline label-bold">não</span>';

                    return '<span class="label font-weight-bold label-lg label-light-primary label-inline label-bold">sim</span>';
                }
            },
            {
                field: 'email',
                title: 'E-MAIL',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    if (!row.email)
                        return '<span class="label font-weight-bold label-lg label-inline label-bold">não</span>';

                    return '<span class="label font-weight-bold label-lg label-light-primary label-inline label-bold">sim</span>';
                }
            },
            {
                field: 'sent',
                title: 'ENVIADO',
                selector: false,
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    if (!row.sent)
                        return '<span class="label font-weight-bold label-lg label-inline label-bold">não</span>';

                    return '<span class="label font-weight-bold label-lg label-light-primary label-inline label-bold">sim</span>';
                }
            },
            {
                field: 'Actions',
                title: 'AÇÕES',
                sortable: false,
                textAlign: 'right',
                overflow: 'visible',
                autoHide: false,
                width: 80,
                template: function (row) {

                    var output = '\
	                     <a href="/Appointment/Edit?id=' + row.id + '" class="btn btn-sm btn-icon btn-bg-light btn-icon-primary btn-hover-primary mx-1" title="Editar">\
		                    <i class="fas fa-edit"></i>\
	                    </a>';

                    output += '\
                        <a class="btn btn-sm btn-icon btn-bg-light btn-icon-danger btn-hover-danger btn-delete" idAppointment = "' + row.id + '" title = "Excluir" >\
		                    <i class="flaticon-delete-1"></i>\
	                    </a>';

                    return output;
                }
            },
        ]
    });
}

jQuery(document).ready(function () {
    LoadAppointmentsCalendar();
});

$(".change-view").on("click", function () {

    const divCalendar = document.getElementById("appointment-calendar");
    const divTable = document.getElementById("appointment-table");
    const changeViewAncorToList = document.getElementById("view-list");
    const changeViewAncorToCalendar = document.getElementById("view-calendar");
    const headingTitle = document.getElementById("type-title");

    if (divCalendar.hasAttribute("hidden")) {
        headingTitle.innerHTML = "Calendário";
        divCalendar.removeAttribute("hidden");
        divTable.setAttribute("hidden", "");
        changeViewAncorToList.removeAttribute("hidden");
        changeViewAncorToCalendar.setAttribute("hidden", "");
        calendar.destroy();
        LoadAppointmentsCalendar();
    } else {
        headingTitle.innerHTML = "Lista";
        divCalendar.setAttribute("hidden", "");
        divTable.removeAttribute("hidden");
        changeViewAncorToCalendar.removeAttribute("hidden");
        changeViewAncorToList.setAttribute("hidden", "");
        LoadAppointmentsTable();
    }
});

$("#appointment-table").on("click", ".btn-delete", function (e) {

    var selectedItem = $(this);

    Swal.fire({
        title: "Deseja realmente excluir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Não, cancelar!",
        reverseButtons: true
    }).then(function (result) {
        if (result.value) {

            $.ajax({
                url: "/Appointment/DeleteAppointment",
                type: "POST",
                data: JSON.stringify($(selectedItem).attr("idAppointment")),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success: function (data) {
                    if (data) {
                        toastr.success("Excluido!", 'Sucesso!');
                        datatable.reload();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.error(xhr);
                    console.error(ajaxOptions);
                    console.error(thrownError);
                    toastr.error(thrownError, 'Atenção!');
                }
            });

        }
    });

});