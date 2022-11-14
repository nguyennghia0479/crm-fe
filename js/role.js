$(document).ready(function () {
   
    function manageData() {
        $.ajax({
            url: "http://localhost:8080/crm/api/role",
            method: "GET"
        }).done(function (result) {
            $("#roleTable tbody").empty();
            $.each(result, function (i, val) {
                var row = `<tr>
                                <td>${i + 1}</td>
                                <td>${val.name}</td>
                                <td>${val.description}</td>
                                <td>
                                    <a href="#roleFormModal" class="btn btn-sm btn-primary btn-edit-role" data-toggle="modal"
                                        role-id="${val.id}">Sửa</a>
                                    <a href="#deleteModal" class="btn btn-sm btn-danger btn-delete" data-toggle="modal"
                                        id="${val.id}" target="role">Xóa</a>
                                </td>
                            </tr>`
                $("#roleTable tbody").append(row);
            })
        });
    }

    function getToastSuccess(result) {
        $.toast({
            heading: 'Success',
            position: 'top-center',
            text: result.message,
            showHideTransition: 'slide',
            icon: 'success'
        })
    }

    function getToastError(result) {
        $.toast({
            heading: 'Error',
            position: 'top-center',
            text: result.message,
            showHideTransition: 'fade',
            icon: 'error',
        })
    }

    function clearFormData() {
        $("#id").val('')
        $("#name").val('')
        $("#description").val('')
    }

    manageData();

    $("#btn-add-role").click(function() {
        clearFormData()
    })

    $("body").on('click', '.btn-edit-role', function (e) {
        e.preventDefault()
        var id = $(this).attr("role-id")
        var name = $(this).parent("td").prev("td").prev("td").text();
        var description = $(this).parent("td").prev("td").text();
        $("#id").val(id)
        $("#name").val(name)
        $("#description").val(description)
    })

    $("#btn-save-role").click(function (e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataName = $("#name").val()
        var dataDescription = $("#description").val()
        if (dataId == '') {
            $.ajax({
                url: "http://localhost:8080/crm/api/role",
                method: "POST",
                data: JSON.stringify({
                    name: dataName,
                    description: dataDescription
                })
            }).done(function (result) {
                if (result.isSuccess == true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData();
                }
                else {
                    getToastError(result)
                }
                $("#roleFormModal").modal('hide')
            })
        } else {
            $.ajax({
                url: "http://localhost:8080/crm/api/role",
                method: "PUT",
                data: JSON.stringify({
                    id: dataId,
                    name: dataName,
                    description: dataDescription
                })
            }).done(function (result) {
                if (result.isSuccess == true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData();
                }
                else {
                    getToastError(result)
                }
                $("#roleFormModal").modal('hide')
            })
        }
    })
});