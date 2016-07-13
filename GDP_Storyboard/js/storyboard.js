function Load_Storyboard(sbnum) {
    $.ajax({
        type: "POST",
        url: 'Storyboard.aspx/ReLoad_Storyboard',
        data: { value: sbnum },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            
        },
        error: function (e) {
            alert("There was an error loading the storyboard. A message has been sent to support. Please try again later." + e.responseText);
        }
    })
}