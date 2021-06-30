const ancho_pantalla = $(window).width();
const alto_pantalla  = $(window).height();
const year           = new Date().getFullYear();
const alto_cabecera  = $('header').outerHeight(true);

var today = new Date();
var date  = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
var time  = today.getHours() + ":" + today.getMinutes();

$(document).ready(function(){

    // Top del buscador
    $('.search').css('top', alto_cabecera+10+'px');

    // Alto de los MISC
    altos_mixtos();

    // Padding TOP del body
    $('body').css('padding-top', alto_cabecera+'px');

    // Fijamos fecha y hora en cabecera
    $('#time').html(time);
    $('#date').html(date);

    // LocalStorage para las opciones de cabecera
    activeOption();

    $('.menu a').click(function(e){
        e.preventDefault();
        let cat       = $(this).attr('data-cat');
        let cat_title = $(this).attr('title');

        catStorage(cat, cat_title);

        location.href = $(this).attr('href');
    });

    // Botón volver
    $('#back').click(function(e){
        goBack();
    });

    // Fijamos el año
    $('#year').html(year);

    // Buscar
    $('#search_trigger').click(function(){
        $(this).addClass('active');
        $('.search').addClass('on');
        $('.search input').trigger('focus');
    });

    $('#close_search').click(function(){
        $('#search_trigger').removeClass('active');
        $('.search input').trigger('blur');
        $('.search').removeClass('on');
    });

    $('.search input').keydown(function (e) {
        let search_txt = $(this).val();
        if (e.which == 13)
        {
            e.preventDefault();
            if( search_txt.length > 0 )
                $('#search_form').submit();
        }
    });

    $('#submit_search').click(function(){

        if( $('.search input').val() != '' )
            $('#search_form').submit();
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

    // Pop error
    $('.fixed_err .close').click(function(){
        $('body').removeClass('errored');
        $('.fixed_err .txt').html('');
    });

    $('#ok_err').click(function(){
        $('body').removeClass('errored');
        $('.fixed_err .txt').html('');
    });

    // Newsletter
    $('#submit_newsletter').click(function(){
        // Validaciones aquí
        let email = $('input[name="nl_email"]').val();
        let email_valid = validEmail(email);

        if( !email_valid.valid )
            fixedError('Newsletter', email_valid.msg);
        else
            $('#newsletter_form').submit();
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

    // SUBIR AL TOP DE LA PÁGINA DESDE EL PIE
    $('.btn_top').click(function() { 
        $('html, body').animate({scrollTop:0}, 1000);
        return false;
    });

    // ALTO DE LOS CONTENIDOS INTERIORES
    alto_inner_content();

    // PANTALLA DE BÚSQUEDA
    if( window.location.href.indexOf('search_txt') !== -1 )
    {
        getBusqueda();
    }

});

$(window).on('load', function(){ 
    setTimeout(function(){
        $('.loader').fadeOut('slow');
    }, 900);

    altos_mixtos();
});

let lastScrollTop = 0;
$(window).scroll(function (event) {

    let scroll         = $(window).scrollTop();
    let max_scroll     = $(document).height() - $(window).height();
    let current_scroll = $(window).scrollTop();
    let perc_scroll    = (current_scroll * 100) / max_scroll;

    // Para mostrar el botón de subir al top
    if( perc_scroll > 25 )
        $('.btn_top').addClass('on');
    else
        $('.btn_top').removeClass('on');

    // Efecto de rellenado con scroll del subir top
    let perc_fill      = 100 - perc_scroll;
    $('.fill').css('top', perc_fill + '%');

    lastScrollTop = scroll;
});

$(window).on('orientationchange', function(){
    altos_mixtos();
});

$(window).on('resize', function(){
    altos_mixtos();
});

const getBusqueda = () => {
    let url_exploded   = window.location.href.split('search_txt');
    let param_exploded = url_exploded[1].split('=');
    let search_txt     = param_exploded[1];

    $('#searched_txt').html(search_txt);
}

const altos_mixtos = () => {

    // Buscamos los modulos mixtos
    if( $('.misc').length > 0 )
    {
        if( ancho_pantalla > 1023 )
        {
            $('.misc').each(function(index){
                let item      = $('.misc').eq(index);
                // Restamos una cantidad fija que se corresponde con el margen superior e inferior de los items del grid, para igualar alturas exactas
                let alto_grid = item.children('.grid').outerHeight(true) - 30;

                item.children('.fullwidth').find('img').css('height', alto_grid+'px');
            });
        }
        else
        {
            $('.misc .fullwidth img').css('height', 'auto');
        }
    }
}

const alto_inner_content = () => {
    let alto_pie         = $('footer').outerHeight(true);
    let min_alto_content = alto_pantalla - alto_cabecera - alto_pie - 40;

    if( $('.text_content').length == 1 )
        $('.text_content').css('min-height', min_alto_content+'px');
    else if( $('.new_content').length == 1 )
        $('.new_details').css('min-height', min_alto_content+'px');
    else if( $('.search_content').length == 1 )
        $('.search_content').css('min-height', min_alto_content+'px');
}

const goBack = () => {

    localStorage.removeItem('prev_category');
    localStorage.removeItem('prev_category_title');
    localStorage.removeItem('category');
    localStorage.removeItem('category_title');
    
    window.location.href = './';
}

const catStorage = (cat, cat_title) => {

    if( localStorage.getItem('category') !== null )
    {
        let prev_cat       = localStorage.getItem('category');
        let prev_cat_title = localStorage.getItem('category_title');
        localStorage.setItem('prev_category', prev_cat);
        localStorage.setItem('prev_category_title', prev_cat_title);
    }

    // Guardamos en localStorage
    localStorage.setItem('category', cat);
    localStorage.setItem('category_title', cat_title);
}

const activeOption = () => {
    let stored_cat       = localStorage.getItem('category');
    let stored_cat_title = localStorage.getItem('category_title');

    $('.menu a').removeClass('active');
    if( window.location.href.indexOf('category') !== -1 )
    {
        if( stored_cat != '' )
            $('.menu a[data-cat="'+stored_cat+'"]').addClass('active');
    
        if( $('#cat_title').length == 1 )
            $('#cat_title').html(stored_cat_title);
    }
}

const fixedError = (title, txt) => {

    if( title == '' )
        title = 'Error';
     
    if( txt == '' )
        txt = 'Error';

    $('.fixed_err .title').html(title);
    $('.fixed_err .txt').html(txt);

    $('body').addClass('errored');
}

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