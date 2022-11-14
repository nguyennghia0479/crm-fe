$(document).ready(function() {
    if(!$.cookie('email')) {
        window.location.href="/login.html"
    }
})