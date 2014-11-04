$(function () {

    $("#registration_form").validate({
        //after validation
        submitHandler: function (form) {

            showSpinner();
            //we make ajax submit
            $(form).ajaxSubmit({success: function () {
                hideSpinner();
                //and show message
                alert("Ваши данные отправлены.");

            }});
        },
        rules: {
            name: {required: true},
            email: {required: true, email: true},
            phone: {required: true},
            org_vid_deyat: {required: true},
            org_spisok_uchastnikov: {required: true}
        },
        messages: {
            name: {required: "Введите имя"},
            email: {required: "Введите e-mail", email: "Введите правильный e-mail" },
            phone: {required: "Введите телефон"},
            org_vid_deyat: {required: "Укажите вид деятельности"},
            org_spisok_uchastnikov: {required: "Укажите список участников от организации"}
        }
    });

});

function showSpinner(){
    var send_bnt = document.getElementById("send_bnt");
    send_bnt.disabled = true;
    send_bnt.value = "Идет отправка...";
}

function hideSpinner(){
    var send_bnt = document.getElementById("send_bnt");
    send_bnt.disabled = false;
    send_bnt.value = "Отправить";
}