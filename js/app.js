var Usuarios     = (localStorage.Usuarios === undefined) ? [] : JSON.parse(localStorage.Usuarios);
var Restaurantes = (localStorage.Restaurantes === undefined) ? [] : JSON.parse(localStorage.Restaurantes);
var Tarjetas     = (localStorage.Tarjetas === undefined) ? [] : JSON.parse(localStorage.Tarjetas);
var Codigos      = (localStorage.Codigos === undefined) ? [] : JSON.parse(localStorage.Codigos);
var Platillos    = (localStorage.Platillos === undefined) ? [] : JSON.parse(localStorage.Platillos);
var Amigos       = (localStorage.Amigos === undefined) ? [] : JSON.parse(localStorage.Amigos);
$(function(){
    index();
    $(document).on("click", "#navbar a, .nav-xhr", function(e){
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
        $("#slide").slideUp('fast');
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