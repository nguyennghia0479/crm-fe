$(document).ready(function () {

    function manageData() {
        $.ajax({
            url: "http://localhost:8080/crm/api/user",
            method: "GET"
        }).done(function(result){
            $("#userTable tbody").empty()
            $.each(result, function(i, val){
                var fullname = `${val.fullName}`
                var firstName = fullname.split(' ').slice(0, -1).join(' ')
                var lastName = fullname.split(' ').slice(-1).join(' ')
                var row = `<tr>
                                <td>${i+1}</td>
                                <td>${firstName}</td>
                                <td>${lastName}</td>
                                <td>${val.email}</td>
                                <td>${val.roleName}</td>
                                <td>
                                    <a href="#userFormModal" class="btn btn-sm btn-primary btn-edit-user" data-toggle="modal" 
                                        user-id=${val.id}>Sửa</a>
                                    <a href="#deleteModal" class="btn btn-sm btn-danger btn-delete" data-toggle="modal" 
                                        id=${val.id} target="user">Xóa</a>
                                    <a href="user-details.html?id=${val.id}" class="btn btn-sm btn-info">Xem</a>
                                </td>
                            </tr>`
                $("#userTable tbody").append(row)
            })
        })
    }

    function getSelectRole(roleId) {
        $.ajax({
            url: "http://localhost:8080/crm/api/role",
            method: "GET"
        }).done(function(result){
            $("#roleSelect").empty()
            $.each(result, function(i, val){
                var option = `<option value="${val.id}">${val.name}</option>`
                $("#roleSelect").append(option)
            })
            if(roleId != null)
                $("#roleSelect").val(roleId)
        })
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
        $("#fullName").val('')
        $("#email").val('')
        $("#password").val('')
        getSelectRole(null)
    }

    manageData()

    $("#btn-add-user").click(function() {
        clearFormData()
    })

    $("body").on('click', '.btn-edit-user', function() {
        var userId = $(this).attr("user-id")
        $.ajax({
            url : `http://localhost:8080/crm/api/user?id=${userId}`,
            method : "GET"
        }).done(function(result){
            $("#id").val(result.id)
            $("#fullName").val(result.fullName)
            $("#email").val(result.email)
            $("#password").val(result.password)
            getSelectRole(result.roleId)
        })
    })

    $("#btn-save-user").click(function(e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataFullName = $("#fullName").val()
        var dataEmail = $("#email").val()
        var dataPassword = $("#password").val()
        var dataRoleId = $("#roleSelect").val()
        if(dataId == '') {
            $.ajax({
                url : "http://localhost:8080/crm/api/user",
                method : "POST",
                data : JSON.stringify({
                    fullName : dataFullName,
                    email : dataEmail,
                    password : dataPassword,
                    roleId : dataRoleId
                })
            }).done(function(result){
                if(result.isSuccess = true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $('#userFormModal').modal('hide')
            })
        } else {
            $.ajax({
                url : "http://localhost:8080/crm/api/user",
                method : "PUT",
                data : JSON.stringify({
                    id : dataId,
                    fullName : dataFullName,
                    email : dataEmail,
                    password : dataPassword,
                    roleId : dataRoleId
                })
            }).done(function(result){
                if(result.isSuccess = true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $('#userFormModal').modal('hide')
            })
        }
    })
})