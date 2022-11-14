$(document).ready(function() {

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
        var jobId = getUrlParameter("id")
        $.ajax({
            url : `http://127.0.0.1:8080/crm/api/job-details?id=${jobId}`,
            method: "GET"
        }).done(function(result) {
            $("#job-details").empty()
            $.each(result, function(index, value) {
               var row = `<div id=${value.id} class="row">
                                <div class="col-xs-12">
                                    <a href="#" class="group-title">
                                        <img width="30" src="http://localhost:8080/crm/api/download-file?id=${value.id}"
                                            class="img-circle" />
                                        <span>${value.fullName}</span>
                                    </a>
                                </div>
                                <div class="col-md-4">
                                    <div class="white-box">
                                        <h3 class="box-title">Chưa thực hiện</h3>
                                        <div class="message-center task-not-start-yet">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="white-box">
                                        <h3 class="box-title">Đang thực hiện</h3>
                                        <div class="message-center task-in-progress">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="white-box">
                                        <h3 class="box-title">Đã hoàn thành</h3>
                                        <div class="message-center task-is-completed">
                                        </div>
                                    </div>
                                </div>
                            </div>`
                $("#job-details").append(row)
                $.each(value.taskModels, function(i, val) {
                    var task = `<a href="#">
                                <div class="mail-contnet">
                                    <h5>${val.name}</h5> <span class="mail-desc">Just see the my admin!</span> <span
                                        class="time">9:30 AM</span>
                                </div>
                            </a>`
                    if(val.statusId == 1) {
                        $("[id=" + val.userId +"] .task-not-start-yet").append(task)
                    } else if(val.statusId == 2) {
                        $("[id=" + val.userId +"] .task-in-progress").append(task)
                    } else if(val.statusId == 3) {
                        $("[id=" + val.userId +"] .task-is-completed").append(task)
                    }
                })
            })
        })
    }

    function manageProgress() {
        var jobId = getUrlParameter("id")
        $.ajax({
            url : `http://localhost:8080/crm/api/job-progress?id=${jobId}`,
            method : "GET"
        }).done(function(result) {
            var amount = result.amount
            var backlog, inProgress, done
            if(amount == 0) {
                $(".backlog").text("0%")
                $(".backlog").css("width","0%")
                $(".inProgress").text("0%")
                $(".inProgress").css("width","0%")
                $(".done").text("0%")
                $(".done").css("width","0%")
            } else {
                backlog = (result.backLog / amount * 100).toFixed(2)
                inProgress = (result.inProgress / amount * 100).toFixed(2)
                done = (result.done / amount * 100).toFixed(2)
                $(".backlog").text(backlog + "%")
                $(".backlog").css("width", + backlog  +"%")
                $(".inProgress").text(inProgress + "%")
                $(".inProgress").css("width", + inProgress +"%")
                $(".done").text(done + "%")
                $(".done").css("width", + done +"%")
            }
        })
    }

  manageData()
  manageProgress()
})