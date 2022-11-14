$(document).ready(function() {

    function manageData() {
        $.ajax({
            url: "http://localhost:8080/crm/api/job",
            method: "GET"
        }).done(function(result) {
            $("#jobTable tbody").empty()
            $.each(result, function(i, val) {
                var row = `<tr>
                                <td>${i+1}</td>
                                <td>${val.name}</td>
                                <td>${datePatternForUser(val.startDate)}</td>
                                <td>${datePatternForUser(val.endDate)}</td>
                                <td>
                                    <a href="#jobFormModal" class="btn btn-sm btn-primary btn-edit-job" data-toggle="modal" 
                                        job-id=${val.id}>Sửa</a>
                                    <a href="#deleteModal" class="btn btn-sm btn-danger btn-delete" data-toggle="modal" 
                                        id=${val.id} target="job">Xóa</a>
                                    <a href="groupwork-details.html?id=${val.id}" class="btn btn-sm btn-info">Xem</a>
                                </td>
                            </tr>`
                $("#jobTable tbody").append(row)
            })
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
        $("#name").val('')
        $("#startDate").val('')
        $("#endDate").val('')
    }

    function datePatternForUser(date) {
        var split = date.split("-")
        var year = split[0]
        var month = split[1]
        var day = split[2]
        var pattern = day.concat("-",month.concat("-",year))
        return pattern
    }

    function datePatternForSQL(date) {
        var split = date.split("-")
        var day = split[0]
        var month = split[1]
        var year = split[2]
        var pattern = year.concat("-",month.concat("-",day))
        return pattern
    }

    manageData()

    $("#btn-add-job").click(function() {
        clearFormData()
    })

    $("body").on('click', '.btn-edit-job', function(e) {
        var id = $(this).attr('job-id')
        var name = $(this).parent('td').prev('td').prev('td').prev('td').text()
        var startDate = datePatternForSQL($(this).parent('td').prev('td').prev('td').text())
        var endDate = datePatternForSQL($(this).parent('td').prev('td').text())
        $("#id").val(id)
        $("#name").val(name)
        $("#startDate").val(startDate)
        $("#endDate").val(endDate)
    })

    $("#btn-save-job").click(function(e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataName = $("#name").val()
        var dataStartDate = $("#startDate").val()
        var dataEndDate = $("#endDate").val()
        if(dataId == '') {
            $.ajax({
                url: "http://localhost:8080/crm/api/job",
                method: "POST",
                data: JSON.stringify({
                    name : dataName,
                    startDate : dataStartDate,
                    endDate : dataEndDate
                })
            }).done(function(result) {
                if(result.isSuccess == true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $("#jobFormModal").modal('hide')
            })
        } else {
            $.ajax({
                url: "http://localhost:8080/crm/api/job",
                method: "PUT",
                data: JSON.stringify({
                    id : dataId,
                    name : dataName,
                    startDate : dataStartDate,
                    endDate : dataEndDate
                })
            }).done(function(result) {
                if(result.isSuccess == true) {
                    clearFormData()
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $("#jobFormModal").modal('hide')
            })
        }
    })
})