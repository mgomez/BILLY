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
            "BILLY",
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
            if(!result.cancelled){
                Restaurantes.push({nombre: result.text});
                localStorage.Restaurantes = JSON.stringify(Restaurantes);
                alert("Se agrego correctamente: " + result.text);                
            }
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    }
}
function ubicacion(){
    var Map;
    var Position;
    Map = new GMaps({
        div: '#map',
        lat: 25.7235769,
        lng: -100.20161769999999
    });
    Map.addMarker({
        lat: 25.7235769,
        lng: -100.20161769999999,
        title: 'Aqui!',
        infoWindow: {
            content: '<p>Rubido #201 Col. Los Cristales Guadalupe, N.L.</p>'
        }
    });
    GMaps.geolocate({
      success: function(position) {
        Position = position;
      },
      error: function(error) {
        alert('Geolocation failed: '+error.message);
      },
      not_supported: function() {
        alert("Your browser does not support geolocation");
      }
    });
}
function buscarMesa(){
    var Restaurantes = $.Enumerable.From(Restaurantes).ToArray();
    var li = [];
    $.each(Restaurantes, function(i, index){
        li.push($("<li>", {class:"collection-item", text:index}));
    });
    $("#jetsContent").html(li).fadeIn(200, function(){
        var jets = new Jets({
          searchTag: '#jetsSearch',
          contentTag: '#jetsContent'
        });
    });
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