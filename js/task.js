$(document).ready(function() {

    function manageData() {
        $.ajax({
            url: "http://localhost:8080/crm/api/task",
            method: "GET"
        }).done(function(result) {
            $("#taskTable tbody").empty();
            $.each(result, function(i, val) {
                var row = `<tr>
                                <td>${i+1}</td>
                                <td>${val.name}</td>
                                <td>${val.jobName}</td>
                                <td>${val.fullName}</td>
                                <td>${datePatternForUser(val.startDate)}</td>
                                <td>${datePatternForUser(val.endDate)}</td>
                                <td>${val.statusName}</td>
                                <td>
                                    <a href="#taskFormModal" class="btn btn-sm btn-primary btn-edit-task" data-toggle="modal"
                                        task-id=${val.id}>Sửa</a>
                                    <a href="#deleteModal" class="btn btn-sm btn-danger btn-delete" data-toggle="modal"
                                        id=${val.id} target="task">Xóa</a>
                                    <a href="#" class="btn btn-sm btn-info">Xem</a>
                                </td>
                            </tr>`
                $("#taskTable tbody").append(row)
            })
        })
    }

    function getJobSelect(jobId) {
        $.ajax({
            url: "http://localhost:8080/crm/api/select-job",
            method: "GET"
        }).done(function(result) {
            $("#jobSelect").empty()
            $.each(result, function(i, val) {
                var option = `<option value=${val.id}>${val.name}</option>`
                $("#jobSelect").append(option)
                if(jobId != null)
                    $("#jobSelect").val(jobId)
            })
        })
    }

    function getUserSelect(userId) {
        $.ajax({
            url: "http://localhost:8080/crm/api/select-user",
            method: "GET"
        }).done(function(result) {
            $("#userSelect").empty()
            $.each(result, function(i, val) {
                var option = `<option value=${val.id}>${val.fullName}</option>`
                $("#userSelect").append(option)
                if(userId != null)
                    $("#userSelect").val(userId)
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

    function datePatternForUser(date) {
        var split = date.split("-")
        var year = split[0]
        var month = split[1]
        var day = split[2]
        var pattern = day.concat("-", month.concat("-", year))
        return pattern
    }

    function clearFormData() {
        $("#id").val('')
        $("#name").val('')
        $("#startDate").val('')
        $("#endDate").val('')
    }

    manageData()

    $("#btn-add-task").click(function() {
        clearFormData()
        getJobSelect(null)
        getUserSelect(null)
    })

    $("body").on('click', '.btn-edit-task', function() {
        var taskId = $(this).attr('task-id')
        $.ajax({
            url: `http://localhost:8080/crm/api/task?id=${taskId}`,
            method: "GET"
        }).done(function(result) {
            $("#id").val(result.id)
            $("#name").val(result.name)
            $("#startDate").val(result.startDate)
            $("#endDate").val(result.endDate)
            getJobSelect(result.jobId)
            getUserSelect(result.userId)
        })
    })

    $("#btn-save-task").click(function(e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataName = $("#name").val()
        var dataStartDate = $("#startDate").val()
        var dataEndDate = $("#endDate").val()
        var dataJobId = $("#jobSelect").val()
        var dataUserId = $("#userSelect").val()
        var dataStatusId = $("#statusSelect").val()
        if(dataId == '') {
            $.ajax({
                url: "http://localhost:8080/crm/api/task",
                method: "POST",
                data: JSON.stringify({
                    name : dataName,
                    startDate : dataStartDate,
                    endDate : dataEndDate,
                    jobId : dataJobId,
                    userId : dataUserId
                })
            }).done(function(result) {
                if(result.isSuccess == true) {
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $("#taskFormModal").modal('hide')
            })
        } else {
            $.ajax({
                url: "http://localhost:8080/crm/api/task",
                method: "PUT",
                data: JSON.stringify({
                    id: dataId,
                    name : dataName,
                    startDate : dataStartDate,
                    endDate : dataEndDate,
                    jobId : dataJobId,
                    userId : dataUserId,
                    statusId : dataStatusId
                })
            }).done(function(result) {
                if(result.isSuccess == true) {
                    getToastSuccess(result)
                    manageData()
                } else {
                    getToastError(result)
                }
                $("#taskFormModal").modal('hide')
            })
        }
    })
})