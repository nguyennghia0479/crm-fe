$(document).ready(function () {

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName;

        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }

    function manageData() {
        var userId = getUrlParameter("id")
        $.ajax({
            url: `http://localhost:8080/crm/api/profile?id=${userId}`,
            method: "GET"
        }).done(function (result) {
            $("#profileTable tbody").empty()
            $.each(result, function (i, val) {
                var row = `<tr>
                                <td>${i + 1}</td>
                                <td>${val.name}</td>
                                <td>${val.jobName}</td>
                                <td>${datePatternForUser(val.startDate)}</td>
                                <td>${datePatternForUser(val.endDate)}</td>
                                <td>${val.statusName}</td>
                                <td>
                                    <a href="#profileFormModal" class="btn btn-sm btn-primary btn-edit-profile" data-toggle="modal" 
                                        task-id=${val.id} status=${val.statusId}>Cập nhật</a>
                                </td>
                            </tr>`
                $("#profileTable tbody").append(row)
            })
        })
    }

    function manageProgress() {
        var userId = $.cookie("id")
        $.ajax({
            url: `http://localhost:8080/crm/api/profile-progress?id=${userId}`,
            method: "GET"
        }).done(function (result) {
            var amount = result.amount
            var backlog, inProgress, done
            if (amount == 0) {
                $(".backlog").text("0%")
                $(".backlog").css("width", "0%")
                $(".inProgress").text("0%")
                $(".inProgress").css("width", "0%")
                $(".done").text("0%")
                $(".done").css("width", "0%")
            } else {
                backlog = (result.backLog / amount * 100).toFixed(2)
                inProgress = (result.inProgress / amount * 100).toFixed(2)
                done = (result.done / amount * 100).toFixed(2)
                $(".backlog").text(backlog + "%")
                $(".backlog").css("width", + backlog + "%")
                $(".inProgress").text(inProgress + "%")
                $(".inProgress").css("width", + inProgress + "%")
                $(".done").text(done + "%")
                $(".done").css("width", + done + "%")
            }
        })
    }

    function getAvatar() {
        var userId = $.cookie("id")
        $.ajax({
            url: `http://localhost:8080/crm/api/download-file?id=${userId}`,
            method: "GET"
        }).done(function () {
            $("#avatar").attr('src', `http://localhost:8080/crm/api/download-file?id=${userId}`)
            $("#navbar-avatar").attr('src', `http://localhost:8080/crm/api/download-file?id=${userId}`)
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

    manageData()
    manageProgress()
    getAvatar()
    $("#name").text($.cookie('fullName'))
    $("#email").text($.cookie('email'))

    $("body").on('click', '.btn-edit-profile', function () {
        var taskId = $(this).attr("task-id")
        var statusId = $(this).attr("status")
        var name = $(this).parent("td").prev("td").prev("td").prev("td").prev("td").prev("td").text()
        var job = $(this).parent("td").prev("td").prev("td").prev("td").prev("td").text()
        var startDate = $(this).parent("td").prev("td").prev("td").prev("td").text()
        var endDate = $(this).parent("td").prev("td").prev("td").text()
        $("#id").val(taskId)
        $("#name").val(name)
        $("#job").val(job)
        $("#startDate").val(startDate)
        $("#endDate").val(endDate)
        $("#statusSelect").val(statusId)
    })

    $("#btn-save-profile").click(function (e) {
        e.preventDefault()
        var dataId = $("#id").val()
        var dataStatusId = $("#statusSelect").val()
        $.ajax({
            url: "http://localhost:8080/crm/api/profile",
            method: "PUT",
            data: JSON.stringify({
                id: dataId,
                statusId: dataStatusId
            })
        }).done(function (result) {
            if (result.isSuccess == true) {
                getToastSuccess(result)
                manageData()
                manageProgress()
            } else {
                getToastError(result)
            }
            $("#profileFormModal").modal('hide')
        })
    })

    $("#uploadFile").click(function () {
        $("#file").val('')
        
        
    })

    $("#btn-upload").click(function (e) {
        e.preventDefault()
        
        var fd = new FormData();
        var files = $('#file')[0].files;
        if (files.length > 0) {
            fd.append('file', files[0]);
        }

        var dataId = $.cookie('id')
        $.ajax({
            url: "http://localhost:8080/crm/api/upload",
            method: "POST",
            data: { id: dataId }
        })

        $.ajax({
            url: "http://localhost:8080/crm/api/upload-file",
            method: "POST",
            data: fd,
            contentType: false,
            processData: false,
        }).done(function (result) {
            if (result.isSuccess == true) {
                getToastSuccess(result)
                manageData()
                manageProgress()
                getAvatar()
            } else {
                getToastError(result)
            }
        }).fail(function (jqXHR, textStatus) {
            alert("Error: " + textStatus)
        });
        $("#profileAvatarModal").modal('hide')
    })

})