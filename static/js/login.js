const cabang = $("#cabang").selectize({
    maxItems:null
})
const token = document.querySelector("[name=csrfmiddlewaretoken]").value
$("#editButton").on("click",function(e){

    const password = $("#ePassword").val()
    if(password == "") return 
    const id = $("#id").val()
    $.ajax({
        url:`/atk/editPassword/`,
        data:{password,id},
        method:"post",
        headers:{"X-CSRFToken":token},
        success(e){
            window.location.href = `/atk/logout`
            $("#msg").append(`<p class="alert alert-success">${e.message}</p>`)
        }
    })
})

$("#tambahButton").on("click",function(e){
    
    const password = $("#password").val()
    const username = $("#username").val()
    const email = $("#email").val()
    const cbg = $("#cabang").val()
    if(username == "" || password == "") return 
    $.ajax({
        url:`/atk/tambahUser/`,
        data:{password,username,email,cabang:cbg},
        method:"post",
        headers:{"X-CSRFToken":token},
        success(e){
            $("#msgT").append(`<p class="alert alert-success">${e.message}</p>`)
            $("#username").val("")
            $("#email").val("")
            $("#password").val("")
        },
        error(err){
            console.log(err)
            $("#msgT").append(`<p class="alert alert-danger">${err.responseJSON.message}</p>`)
        }
    })
})

$("#ePassword").off("keydown").on("keydown",function(e){
    if(e.key == "Enter"){
        $("#editButton").click()
    }
})
$("#username").off("keydown").on("keydown",function(e){
    if(e.key == "Enter"){
    $("#email").focus()
    }
})
$("#email").off("keydown").on("keydown",function(e){
    if(e.key == "Enter"){
    $("#password").focus()
    }
})
$("#password").off("keydown").on("keydown",function(e){
    if(e.key == "Enter"){
        cabang[0].selectize.focus()
    }
})

