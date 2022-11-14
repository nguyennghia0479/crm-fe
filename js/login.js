$(document).ready(function() {

    function setCookie(id, fullName, email, role) {
        $.cookie('id', id)
        $.cookie('fullName', fullName)
        $.cookie('email', email)
        $.cookie('role', role)
    }

    function clearCookie() {
        $.removeCookie("id", '')
        $.removeCookie("fullName", '')
        $.removeCookie("email", '')
        $.removeCookie("role", '')
    }


    $("#login").click(function(e) {
        e.preventDefault()
        var dataEmail = $("input[name='email']").val()
        var dataPassword = $("input[name='password']").val()
        $.ajax({
            url : "http://localhost:8080/crm/api/login",
            method : "POST",
            data: JSON.stringify({
                email : dataEmail,
                password : dataPassword
            })
        }).done(function(result) {
            if(result != null) {
                setCookie(result.id, result.fullName, result.email, result.roleName)
                window.location.href = "/index.html"
            } else {
                $('.alert').css('display', 'block')
            }
        })
        
    })

    $("#logout").on('click', function() {
        clearCookie()
        window.location.href = "/login.html"
    })
})