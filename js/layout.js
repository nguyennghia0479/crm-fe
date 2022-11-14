function changeActiveLink() {
    var currentLocation = window.location.href;
    currentLocation = currentLocation.replace('//', '/').split('/');
    var page = currentLocation[currentLocation.length - 1];    

    if(page.includes('groupwork-details.html') ) {
        page = 'groupwork.html'
    } else if(page.includes('user-details.html') ) {
        page = 'user-table.html'
    }

    $('#sidebar a[href*="' + page + '"]').addClass('active');
}
$(function () {
    $("#navbar").load('/layout/navbar.html')
    $("#sidebar").load('/layout/sidebar.html', changeActiveLink)
    $("#modal-delete").load('/layout/modal-delete.html')
})