var Usuarios     = (localStorage.Usuarios === undefined) ? [] : JSON.parse(localStorage.Usuarios);
var Restaurantes = (localStorage.Restaurantes === undefined) ? [] : JSON.parse(localStorage.Restaurantes);
var Tarjetas     = (localStorage.Tarjetas === undefined) ? [] : JSON.parse(localStorage.Tarjetas);
var Amigos       = [];

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
    index();
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
var Usuario;
function login(){
    var $frm = $("#frm-login");
    $frm.validate();
    $frm.on("submit", function(){
        var $this = $(this);
        if($this.valid()){
            var telefono = $("#input-telefono").val();
            var password = $("#input-password").val();
            var valid    = $.Enumerable.From(Usuarios).Where(function(x){return x.telefono === telefono && x.password === password}).ToArray();
            if(valid.length > 0){
                console.debug(valid);
                Usuario = valid[0].nombre;
                Amigos.push(Usuario);
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
    var li = [];
    $.each(Restaurantes, function(i, index){
        li.push($("<li>", {class:"collection-item", text:index.nombre}));
    });
    $("#jetsContent").html(li).fadeIn(200, function(){
        var jets = new Jets({
          searchTag: '#jetsSearch',
          contentTag: '#jetsContent'
        });
    });
}
function configuracion(){
    var $frm = $("#frm-Configuracion");
    $frm.validate();
    $frm.on("submit", function(){
        return false;
    })
}
function agregarTarjeta(){}
var Codigo;
function codigo(){
    var $frm = $("#frm-Codigo");
    $frm.validate();
    $frm.on("submit", function(){
        if($(this).valid()){
            Codigo = $("#codigo").val();
            goTo("comanda");
        }
        return false;
    });
}
var Platillos = [];
function comanda(){    
    Platillos = [];
    $("#frm-agregarPlatillo").validate();
    $("#codigo").val("Codigo "+Codigo);
    $('.modal-trigger').leanModal();
    getAmigos();
    $("#btn-guardarPlatillo").on("click", function(){
        if($("#frm-agregarPlatillo").valid()){
            var precioPlatillo = parseFloat($("#precioPlatillo").val());
            //Platillos.push({nombre:$("#nombrePlatillo").val(), precio:precioPlatillo});
            var li = $("<li>", {
                class: "collection-item",
                html: $("#nombrePlatillo").val() + " <span class='badge'>$" + precioPlatillo + "</span>",
                "data-nombre": $("#nombrePlatillo").val(),
                "data-precio": precioPlatillo
            });
            $("#Alimentos").append(li);
            $("#modal-agregarPlatillo").closeModal();
            setDroppable();
            $("#frm-agregarPlatillo")[0].reset();
        }
    });
    $("#btn-guardarAmigo").on("click", function(){
        var nuevoAmigo = $("#nombreAmigo").val();
        if(nuevoAmigo !== ""){
            Amigos.push(nuevoAmigo);
            getAmigos();
            $("#modal-agregarAmigo").closeModal();
        }
    });     
    $("#btn-subtotal").on("click", function(){
        var valid = 0;
        $("#Alimentos li").each(function(i, index){
            if($(this).data("usuario") === undefined){
                valid = valid + 1;
            }
            if(valid > 0){
                alert("Faltan Alimentos por asignar");
                return false;
            }else{
                goTo("subtotales");
            }
        });
    });
    function getAmigos(){
        var rows = [];
        $.each(Amigos, function(i, index){
            var color = getRandomColor();
            rows.push($("<li>", {html: index, "data-nombre":index, style:"background:"+color, "data-color":color}));
        });
        $("#amigos").html(rows);
        $("#amigos li").draggable({
        revert: true,
        scrollSpeed: 10
    });
    }
    function setDroppable(){
        $("#Alimentos li").droppable({
            activeClass: "ui-state-default",
            hoverClass: "ui-state-hover",
            drop: function(event, ui) {
                var $amigo = $(ui.draggable[0]);
                var $li    = $(event.target);
                Platillos.push({nombre:$li.data("nombre"), precio:$li.data("precio"), usuario:$amigo.data("nombre")});
                $li.css({
                    backgroundColor: $amigo.data("color"),
                    color: "#fff"
                }).attr("data-usuario", $amigo.data("nombre")).find(".badge").css("color","#fff");
            }
        });        
    }
}
function subtotales(){
    var pPropina = 16;
    var subtotal = $.Enumerable.From(Platillos).Select(function(x){return x.precio}).Sum();
    var propina  = subtotal * (pPropina/100);
    var total    = subtotal + propina;
    setMontos();
    $("#plusPropina").on("click", function(){
        pPropina += 1;
        actualizaMontos();
    });
    $("#lessPropina").on("click", function(){
        pPropina -= 1;
        actualizaMontos();
    });
    $("#pPropina").on("change", function(){
        pPropina = $(this).val();
        actualizaMontos();
    });
    function actualizaMontos(){
        propina  = subtotal * (pPropina/100);
        total    = subtotal + propina;
        setMontos();
    }
    function setMontos(){
        $("#subtotal").val(Math.round(subtotal));
        $("#propina").val(Math.round(propina));
        $("#total").val(Math.round(total));
        $("#pPropina").val(Math.round(pPropina));
    }
}
function totales(){
    var rows = [];
    var Total = 0;
    $.each(Amigos, function(i, index){
        var platillos = $.Enumerable.From(Platillos).Where(function(x){return x.usuario == index}).ToArray();
        var total = $.Enumerable.From(platillos).Sum(function(x){return x.precio});
        var ck = '<input id=ck-'+i+' type="checkbox" class="ckTotales" data-usuario:"'+index+'" data-total="'+total+'"/><label for="ck-'+i+'">'+index+'</label>';
        var li = $("<li>",{
            class:"collection-item",
            html:ck + " <span class='badge'>$" + total + "</span>"
        });
        rows.push(li);
        Total += total;
    });
    var ck = '<input id="ck-all"" type="checkbox" class="ckTotales" data-usuario:"0" data-total="'+Total+'"/><label for="ck-all">Yo invito</label>';
    var li = $("<li>",{
            class:"collection-item",
            html:ck + " <span class='badge bold'>$" + Total + "</span>"
        });
    rows.push(li);
    $("#totales").html(rows);
}
function metodosPago(){}
function gracias(){}

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
function getRandomColor(){
    var colors = ["#004975", "#00717F", "#006857", "#007F46", "#007520", "#36B4A0", "#00352C"];
    return colors[Math.floor(Math.random() * 6) + 1]
}
