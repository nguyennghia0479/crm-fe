$(document).ready(function() {
    function manageProgress() {
        console.log("INDEX")
        $.ajax({
            url : "http://localhost:8080/crm/api/tasks-progress",
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
                $(".backlog").text(result.backLog)
                $(".backlog").css("width", + backlog  +"%")
                $(".inProgress").text(result.inProgress)
                $(".inProgress").css("width", + inProgress +"%")
                $(".done").text(result.done)
                $(".done").css("width", + done +"%")
            }
        })
    }
    
    manageProgress()
})