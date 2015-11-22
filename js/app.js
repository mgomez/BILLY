var Usuarios     = (localStorage.Usuarios === undefined) ? [] : JSON.parse(localStorage.Usuarios);
var Restaurantes = (localStorage.Restaurantes === undefined) ? [] : JSON.parse(localStorage.Restaurantes);
var Tarjetas     = (localStorage.Tarjetas === undefined) ? [] : JSON.parse(localStorage.Tarjetas);
var Codigos      = (localStorage.Codigos === undefined) ? [] : JSON.parse(localStorage.Codigos);
var Platillos    = (localStorage.Platillos === undefined) ? [] : JSON.parse(localStorage.Platillos);
var Amigos       = (localStorage.Amigos === undefined) ? [] : JSON.parse(localStorage.Amigos);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.alert = function(message) {
        navigator.vibrate(100);
        navigator.notification.alert(
            message,
            null,
            "SmartInvoice",
            'OK'
        );
    };
    //doble back *Andorid
    document.addEventListener("backbutton", function() {
        navigator.notification.confirm('Presione de nuevo para salir', function(button) {
            if (button == 2 || button === 0) {
                navigator.app.exitApp();
            }
        }, 'Salir de BILLY?', ['No', 'Salir']);
        return false;
    }, false);
}
$(function(){
    if(Usuarios.length > 0){
        goTo("principal");
    }else{
        index();        
    }
    $(document).on("click", ".nav-xhr", function(e){
        goTo($(this).data("href"));        
    })
});

function goTo(view){
    $("#app").hide();
    var url = "views/"+view+".html";
    $.get(url, function(html){
        $("#app").html(html).show();
        eval(view)();               
    });
}

function index(){
    setTimeout(function(){
        $("#slide").fadeOut('fast');
    }, 2000)
}

function registrarse(){
    $("#frm-NuevoUsuario").validate();
    $("#frm-NuevoUsuario").on("submit", function(){
        var $this = $(this);
        if($this.valid()){
            Usuarios.push($(this).serializeObject());
            localStorage.Usuarios = JSON.stringify(Usuarios);
            $this[0].reset();
            alert("Se creo correctamente el usuario");
            goTo("login");
        }
        return false;
    });
}
function login(){
    var $frm = $("#frm-login");
    $frm.validate();
    $frm.on("submit", function(){
        var $this = $(this);
        if($this.valid()){
            var telefono = $("#input-telefono").val();
            var password = $("#input-password").val();
            var valid    = $.Enumerable.From(Usuarios).Where(function(x){return x.telefono === telefono && x.password === password}).Count();
            if(valid > 0){
                goTo("principal");
            }else{
                alert("Usuario y/o Contraseña Incorrecta.");
            }
        }
        return false;
    });
}
function principal(){}
function nuevaMesa(){
    $("#qrCode").on("click",QRCode);
    function QRCode(){
        alert('scanning');        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan( function (result) { 
            alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    }
}
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};