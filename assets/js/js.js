const ancho_pantalla = $(window).width();
const year           = new Date().getFullYear();
const alto_cabecera  = $('header').outerHeight(true);

var today = new Date();
var date  = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
var time  = today.getHours() + ":" + today.getMinutes();

$(document).ready(function(){

    // Top del menú
    $('nav.menu').css('top', alto_cabecera+'px');

    // Fijamos fecha y hora en cabecera
    $('#time').html(time);
    $('#date').html(date);

    // Fijamos el año
    $('#year').html(year);

    // Submit contacto
    $('#submit').click(function(){
        validarContacto();
    });

    // Pop política
    $('#abrir_politica').click(function(e){
        // // Para evitar que abrir la política marque/desmarque el check
        e.stopPropagation();
        e.preventDefault();

        $('body').addClass('popuped');
    });

    $('.cerrar_popup').click(function(){
        $('body').removeClass('popuped');
    });

    // PARA MÓVIL
    if( ancho_pantalla < 768 )
    {
        $('.toggle_menu').click(function(){
            $('.menu').addClass('on');
        });

        $('.cerrar_menu').click(function(){
            $('.menu').removeClass('on');
        });
    }
    else
    {
        $('.menu').removeClass('on');
    }

});

$(window).on('load', function(){ 
    setTimeout(function(){
        $('.loader').fadeOut('slow');
    }, 900);
});

$(window).scroll(function (event) {
    // GESTIÓN DE OPCIONES DEL MENÚ
    let scroll = $(window).scrollTop();
    let opcion = '';

    // HSCROLL
    let max_scroll     = $(document).height() - $(window).height();
    let current_scroll = $(window).scrollTop();
    let perc_fill      = (current_scroll * 100) / max_scroll;
    $('.hscroll').css('width', perc_fill + '%');
});

$(window).on('orientationchange', function(){

});

$(window).on('resize', function(){

});

const validarContacto = () => {

    let nombre   = $('#contacto input[name="nombre"]');
    let telefono = $('#contacto input[name="telefono"]');
    let email    = $('#contacto input[name="email"]');
    let mensaje  = $('#contacto textarea[name="mensaje"]');
    let politica = $('#contacto input[name="politica"]');

    // Nombre
    if( nombre.val() == '' || nombre.val().length < 2 )
    {
        nombre.addClass('errored');
        nombre.parent().append('<span class="error_form">Introduce tu nombre</span>');
    }
    else
        nombre.removeClass('errored');

    // Teléfono
    if( telefono.val().length > 0 && telefono.val().length < 9 )
    {
        telefono.addClass('errored');
        telefono.parent().append('<span class="error_form">El teléfono no es válido</span>');
    }
    else
        telefono.removeClass('errored');

    // Email
    if( email.val() == '' )
    {
        email.addClass('errored');
        email.parent().append('<span class="error_form">Introduce tu email</span>');
    }
    else
    {
        emailValido = validEmail(email.val());
        if( !emailValido.valid )
        {
            email.parent().append('<span class="error_form">'+ emailValido.msg +'</span>');
            email.addClass('errored');
        }
        else
            email.removeClass('errored'); 
    }

    // Mensaje
    if( mensaje.val() == '' && mensaje.val().length < 5 )
    {
        mensaje.addClass('errored');
        mensaje.parent().append('<span class="error_form">El mensaje es obligatorio (Min. 5 caracteres)</span>');
    }
    else
        mensaje.removeClass('errored');

    // Política
    if( !politica.prop('checked') )
        politica.siblings('.checkbox').addClass('errored');
    else
        politica.siblings('.checkbox').removeClass('errored');

    // Limpiamos los errores flotantes al cabo de 4 segundos
    if( $('.error_form').length > 0 )
    {
        setTimeout(function(){
            $('.error_form').remove();
            $('#contacto input').removeClass('errored');
            $('#contacto textarea').removeClass('errored');
            $('#contacto .checkbox').removeClass('errored');
        }, 4000);
    }
    else
        $('#form_contacto').submit();
}

const validEmail = (email) => {

    let resp = {
        valid: true,
        msg  : ''
    };

    if( email.length < 7 )
        resp.valid = false;
    else
    {
        let index_arroba = email.indexOf('@');
        let index_punto  = email.indexOf('.');

        if( index_arroba === -1 || index_punto === -1 )
            resp.valid = false;
        else
        {
            let division = email.split('@');
            if( division[1].indexOf('.') === -1 )
                resp.valid = false;
        }
    }

    if( !resp.valid )
        resp.msg = 'Email no válido';

    return resp;
}