$(document).ready(function () {

    $('.auth-submit').on('click', function(e) {
        e.preventDefault();
        let data = {};
        let form = $(this).closest('form');
        data.username = $('#username').val();
        data.password = $('#password').val();

        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: data
        }).done((data, textStatus, jqXHR) => {
            if(data.success) {
                localStorage.setItem('token', data.token);
                swal({
                    title: "Login Successful",
                    text: "Your token is: " + data.token,
                    type: "success"
                }, function() {
                    window.location.replace('/');
                });
            } else {
                swal({   
                    title: "Login Failed",
                    type: "error",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });

    });

    $('.create, .edit').on('click', function(e) {
        e.preventDefault();
        
        let form = $(this).closest('form');
        let inputs = form.find('input');
        let data = {};
        
        // Text Inputs
        inputs.each((i, input) => { 
            let name = $(input).attr('name');
            let value = $(input).val();
            
            if(/\[\]$/.test(name))  {
                name = name.slice(0, -2);
                if(data[name] === undefined) data[name] = [];
                data[name].push(value);
            } else {
                data[name] = value;
            }
         });

         // Multiple Select Inputs
         let selects = $(form).find('select[multiple]');
         selects.each((i, select) => {
             let name = $(select).attr('name');
             let options = $(select).find('option:selected');

             data[name] = $.map(options, function(option) {
                 return $(option).val();
             });
         });

         // CheckBox Inputs
         let checkboxes = $(form).find('input[type=checkbox]');
         checkboxes.each((i, checkbox) => {
             let name = $(checkbox).attr('name');
             data[name] = $(checkbox).is(':checked');
         });
         
        $.ajax({
            url: form.attr('action'),
            method: form.attr('method'),
            data: data
        }).done((data, textStatus, jqXHR) => {
            if(data.errors != null) {
                swal({   
                    title: "An Error Has Occured!",   
                    text: data.message,
                    type: "error",
                    timer: 2000,   
                    showConfirmButton: false 
                });
                return;
            }
            swal({   
                title: $(this).text() + "d!",
                text: `Document ${$(this).text()}d`,
                type: "success",
                timer: 2000,
                showConfirmButton: false
            });
        }).fail(function(jqXHR, textStatus, errorThrown) { 
            swal({   
                title: "An Error Has Occured!",   
                text: errorThrown,   
                type: "error",
                timer: 2000,   
                showConfirmButton: false 
            });
        });
    });

    $('.mass-delete').on('click', function(e) {
        let trArray = $('tbody:first').find('tr').filter(':has(:checkbox:checked)');
        let ids = $.map(trArray, tr => $(tr).data('id'));
        
        swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete them!",
            closeOnConfirm: false
        },
        isConfirmed => {
            if(isConfirmed) {
                let dataName = $($('.panel-title')[0]).text();
                let data = {};
                data[dataName.toLowerCase()] = ids;
                $.ajax({
                    url: $('table:first').data('uri') + '?_method=DELETE',
                    method: 'POST',
                    data: data
                }).done((data, textStatus, jqXHR) => {
                    
                    trArray.fadeOut(function() {
                        trArray.remove();
                    });
                    swal({   
                        title: "Deleted!",   
                        text: "Documents deleted", 
                        type: "success",  
                        timer: 2000,   
                        showConfirmButton: false 
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    swal({   
                        title: "An Error Has Occured!",   
                        text: errorThrown,   
                        type: "error",
                        timer: 2000,   
                        showConfirmButton: false 
                    });
                });
            }
        });
    });

    $('.delete-button').on('click', function(e) {
        swal({
            title: "Are you sure?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        isConfirmed => {
            if(isConfirmed) {
                $.ajax({
                    url: $(this).data('uri'),
                    method: 'POST'
                }).done((data, textStatus, jqXHR) => {
                    $(this).closest('tr').fadeOut(function() {
                        $(this).remove();
                    });
                    swal({   
                        title: "Deleted!",   
                        text: "Document deleted",   
                        type: "success",
                        timer: 2000,   
                        showConfirmButton: false 
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    swal({
                        title: "An Error Has Occured!",  
                        text: errorThrown,   
                        type: "error",
                        timer: 2000,   
                        showConfirmButton: false 
                    });
                });
            }
        });
    });

    // Get Token from localStorage and fill the input named token with it
    let tokenInputArr = $(document).find('input[name=token]');
    if(tokenInputArr.length > 0) tokenInputArr[0].value = localStorage.getItem('token');
    
    $('.back-button').on('click', function(e) {
        window.location.replace($(this).data('uri'));
    });

    $('#filter').keyup(function () {

        let rex = new RegExp($(this).val(), 'i');
        $('.searchable tr').hide();
        $('.searchable tr').filter(function () {
            return rex.test($(this).text());
        }).show();

    });

    $('#select-all').change(function() {
        let checkboxes = $(this).closest('table').find(':checkbox:visible');
        if($(this).is(':checked')) {
            checkboxes.prop('checked', true);
        } else {
            checkboxes.prop('checked', false);
        }
    });

    $(document).on('click', '.btn-add', function(e) {
        e.preventDefault();

        var controlForm = $(this).closest('.controls'),
            currentEntry = $(this).closest('.entry'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
        newEntry.find('input').focus();
    }).on('click', '.btn-remove', function(e) {
        e.preventDefault();

        $(this).closest('.controls').find('.entry:last input').focus();
		$(this).parents('.entry:first').remove();
        
		return false;
	});

});