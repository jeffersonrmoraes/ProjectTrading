$(document).ready(function () {

    // Ao carregar a pagina: datatable
    var table_negociacoes = $('#table_negociacoes').dataTable({
        "ajax": "data.php?job=get_negociacoes",
        "columns": [
            {"data": "negocio_id"},
            {"data": "mercadoria_name", "sClass": "mercadoria_name"},
            {"data": "descricao"},
            {"data": "tipomercadoria"},
            {"data": "preco", "sClass": "integer"},
            {"data": "quantidade", "sClass": "integer"},
            {"data": "tiponegociacao"},
            {"data": "functions", "sClass": "functions"}
        ],
        "aoColumnDefs": [
            {"bSortable": false, "aTargets": [-1]}
        ],
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "oLanguage": {
            "oPaginate": {
                "sFirst": " ",
                "sPrevious": " ",
                "sNext": " ",
                "sLast": " ",
            },
            "sLengthMenu": "Negociações por pagina: _MENU_",
            "sInfo": "Total de _TOTAL_ Registros (exibindo _START_ de _END_)",
            "sInfoFiltered": "(Filtrado do total de _MAX_ registros)"
        }
    });

    // Ao carregar a pagina: validar Form
    jQuery.validator.setDefaults({
        success: 'valid',
        rules: {
            preco: {
                required: true,
                min: 1,
                max: 10000
            }
        },
        errorPlacement: function (error, element) {
            error.insertBefore(element);
        },
        highlight: function (element) {
            $(element).parent('.field_container').removeClass('valid').addClass('error');
        },
        unhighlight: function (element) {
            $(element).parent('.field_container').addClass('valid').removeClass('error');
        }
    });
    var form_negociacao = $('#form_negociacao');
    form_negociacao.validate();

    // Exibir Mensagem
    function show_message(message_text, message_type) {
        $('#message').html('<p>' + message_text + '</p>').attr('class', message_type);
        $('#message_container').show();
        if (typeof timeout_message !== 'undefined') {
            window.clearTimeout(timeout_message);
        }
        timeout_message = setTimeout(function () {
            hide_message();
        }, 8000);
    }
    // Esconder Mensagem
    function hide_message() {
        $('#message').html('').attr('class', '');
        $('#message_container').hide();
    }

    // Mostrar Mensagem de Loading
    function show_loading_message() {
        $('#loading_container').show();
    }
    // Esconder Mensagem de Loading
    function hide_loading_message() {
        $('#loading_container').hide();
    }

    // Mostrar Lightbox
    function show_lightbox() {
        $('.lightbox_bg').show();
        $('.lightbox_container').show();
    }
    // Esconder Lightbox
    function hide_lightbox() {
        $('.lightbox_bg').hide();
        $('.lightbox_container').hide();
    }
    // Lightbox background
    $(document).on('click', '.lightbox_bg', function () {
        hide_lightbox();
    });
    // Lightbox Botão Fechar
    $(document).on('click', '.lightbox_close', function () {
        hide_lightbox();
    });
    // Escape keyboard key
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            hide_lightbox();
        }
    });

    // Esconder iPad keyboard
    function hide_ipad_keyboard() {
        document.activeElement.blur();
        $('input').blur();
    }

    // Adicionar Negociação button
    $(document).on('click', '#add_negociacao', function (e) {
        e.preventDefault();
        $('.lightbox_content h2').text('Adicionar Negociação');
        $('#form_negociacao button').text('Adicionar');
        $('#form_negociacao').attr('class', 'form add');
        $('#form_negociacao').attr('data-id', '');
        $('#form_negociacao .field_container label.error').hide();
        $('#form_negociacao .field_container').removeClass('valid').removeClass('error');

        $('#form_negociacao #mercadoria_name').val('');
        $('#form_negociacao #descricao').val('');
        $('#form_negociacao #tipomercadoria').val('');
        $('#form_negociacao #preco').val('');
        $('#form_negociacao #quantidade').val('');
        $('#form_negociacao #tiponegociacao').val('');
        show_lightbox();
    });

    // Adicionar Negociação submit form
    $(document).on('submit', '#form_negociacao.add', function (e) {
        e.preventDefault();
        // Validate form
        if (form_negociacao.valid() == true) {
            // Enviar Informações Negociação  Para o Banco de Dados
            hide_ipad_keyboard();
            hide_lightbox();
            show_loading_message();
            var form_data = $('#form_negociacao').serialize();
            var request = $.ajax({
                url: 'data.php?job=add_negociacao',
                cache: false,
                data: form_data,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                type: 'get'
            });
            request.done(function (output) {
                if (output.result == 'success') {
                    // Recarregar datable
                    table_negociacoes.api().ajax.reload(function () {
                        hide_loading_message();
                        var mercadoria_name = $('#mercadoria_name').val();
                        show_message("Negociação '" + mercadoria_name + "' adicionada com sucesso.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Add request failed', 'error');
                }
            });
            request.fail(function (jqXHR, textStatus) {
                hide_loading_message();
                show_message('Add request failed: ' + textStatus, 'error');
            });
        }
    });

    // Editar Negociacao button
    $(document).on('click', '.function_edit a', function (e) {
        e.preventDefault();
        // Get Negociacao informação do Banco de Dados
        show_loading_message();
        var id = $(this).data('id');
        var request = $.ajax({
            url: 'data.php?job=form_negociacao',
            cache: false,
            data: 'id=' + id,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'get'
        });
        request.done(function (output) {
            if (output.result == 'success') {
                $('.lightbox_content h2').text('Editar Negociacao');
                $('#form_negociacao button').text('Editar');
                $('#form_negociacao').attr('class', 'form edit');
                $('#form_negociacao').attr('data-id', id);
                $('#form_negociacao .field_container label.error').hide();
                $('#form_negociacao .field_container').removeClass('valid').removeClass('error');

                $('#form_negociacao #mercadoria_name').val(output.data[0].mercadoria_name);
                $('#form_negociacao #descricao').val(output.data[0].descricao);
                $('#form_negociacao #tipomercadoria').val(output.data[0].tipomercadoria);
                $('#form_negociacao #preco').val(output.data[0].preco);
                $('#form_negociacao #quantidade').val(output.data[0].quantidade);

                $('#form_negociacao #tiponegociacao').val(output.data[0].tiponegociacao);
                hide_loading_message();
                show_lightbox();
            } else {
                hide_loading_message();
                show_message('Information request failed', 'error');
            }
        });
        request.fail(function (jqXHR, textStatus) {
            hide_loading_message();
            show_message('Information request failed: ' + textStatus, 'error');
        });
    });

    // Editat Negociacao submit form
    $(document).on('submit', '#form_negociacao.edit', function (e) {
        e.preventDefault();
        // Validar form
        if (form_negociacao.valid() == true) {
            // Enviar Informações Negociação  Para o Banco de Dados
            hide_ipad_keyboard();
            hide_lightbox();
            show_loading_message();
            var id = $('#form_negociacao').attr('data-id');
            var form_data = $('#form_negociacao').serialize();
            var request = $.ajax({
                url: 'data.php?job=edit_negociacao&id=' + id,
                cache: false,
                data: form_data,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                type: 'get'
            });
            request.done(function (output) {
                if (output.result == 'success') {
                    // Recarregar datable
                    table_negociacoes.api().ajax.reload(function () {
                        hide_loading_message();
                        var mercadoria_name = $('#mercadoria_name').val();
                        show_message("Negociação '" + mercadoria_name + "' editada com sucesso!.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Não foi possivel editar', 'error');
                }
            });
            request.fail(function (jqXHR, textStatus) {
                hide_loading_message();
                show_message('Não foi possivel editar: ' + textStatus, 'error');
            });
        }
    });

    // Deletar Negociacao
    $(document).on('click', '.function_delete a', function (e) {
        e.preventDefault();
        var mercadoria_name = $(this).data('name');
        if (confirm("Você realmente deseja deletar a negociação '" + mercadoria_name + "'?")) {
            show_loading_message();
            var id = $(this).data('id');
            var request = $.ajax({
                url: 'data.php?job=delete_negociacao&id=' + id,
                cache: false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                type: 'get'
            });
            request.done(function (output) {
                if (output.result == 'success') {
                    // Recarregar datable
                    table_negociacoes.api().ajax.reload(function () {
                        hide_loading_message();
                        show_message("Negociação '" + mercadoria_name + "' deletada com sucesso.", 'success');
                    }, true);
                } else {
                    hide_loading_message();
                    show_message('Não foi possivel deletar', 'error');
                }
            });
            request.fail(function (jqXHR, textStatus) {
                hide_loading_message();
                show_message('Não foi possivel deletar: ' + textStatus, 'error');
            });
        }
    });

});