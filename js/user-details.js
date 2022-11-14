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

    function datePatternForUser(date) {
        var split = date.split("-")
        var year = split[0]
        var month = split[1]
        var day = split[2]
        var pattern = day.concat("-", month.concat("-", year))
        return pattern
    }

    function manageData() {
        var userId = getUrlParameter("id")
        $("#avatar").attr('src', `http://localhost:8080/crm/api/download-file?id=${userId}`)
        $.ajax({
            url : `http://127.0.0.1:8080/crm/api/user-details?id=${userId}`,
            method: "GET"
        }).done(function(result) {
            $(".task-not-start-yet").empty()
            $(".task-in-progress").empty()
            $(".task-is-completed").empty()
            $.each(result, function(i, val) {
                var row = `<a href="#">
                                <div class="mail-contnet">
                                    <h5>${val.name}</h5>
                                    <span class="mail-desc">${val.jobName}</span>
                                    <span class="time">Bắt đầu: ${datePatternForUser(val.startDate)}</span>
                                    <span class="time">Kết thúc: ${datePatternForUser(val.endDate)}</span>
                                </div>
                            </a>`
                if(val.statusId == 1) {
                    $(".task-not-start-yet").append(row)
                } else if(val.statusId == 2) {
                    $(".task-in-progress").append(row)
                } else {
                    $(".task-is-completed").append(row)
                }
            })
        })
    }

    function manageProgress() {
        var userId = getUrlParameter("id")
        $.ajax({
            url : `http://localhost:8080/crm/api/profile-progress?id=${userId}`,
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

    manageProgress()
    manageData()
})