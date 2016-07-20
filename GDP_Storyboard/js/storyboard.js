var selectedSB = 0;
var currentSB = 0;

function Create_Storyboard(jsonData) {
    //Local globals
    var container = document.getElementById("container");
    var currentScene = 0;
    var currentShot = 0;
    var currentPanel = 0;
    var jsonData1 = jsonData.d;
    var data = JSON.parse(jsonData1);

    var sbMainUL = document.createElement("ul");
    sbMainUL.id = selectedSB;
    sbMainUL.className = "storyboard";

    for (i = 0; i < data.length; i++) {
        //Create parent scene
        var scene = document.createElement("li");
        scene.id = data[i].ID;
        scene.className = "scene";
        var movesc = document.createElement("i");
        movesc.className = "fa fa-arrows move";
        var addsh = document.createElement("i");
        addsh.className = "fa fa-plus add";
        var delsc = document.createElement("i");
        delsc.className = "fa fa-trash delete";
        scene.appendChild(movesc);
        scene.appendChild(addsh);
        scene.appendChild(delsc);

        for (j = 0; j < data[i].shots.length; j++) {
            //Create shots for this scene
            var shot = document.createElement("ul");
            shot.id = data[i].shots[j].ID;
            shot.className = "shot";
            var movesh = document.createElement("i");
            movesh.className = "fa fa-arrows move";
            var addpan = document.createElement("i");
            addpan.className = "fa fa-plus add";
            var delsh = document.createElement("i");
            delsh.className = "fa fa-trash delete";
            shot.appendChild(movesh);
            shot.appendChild(addpan);
            shot.appendChild(delsh);

            for (k = 0; k < data[i].shots[j].panels.length; k++) {
                //Create panels for this shot
                var img = document.createElement("IMG");
                img.className = "image";
                img.src = data[i].shots[j].panels[k].src;
                var pan = document.createElement("li");
                pan.id = data[i].shots[j].panels[k].ID;
                pan.className = "panel";
                var movepan = document.createElement("i");
                movepan.className = "fa fa-arrows move";
                var editpan = document.createElement("i");
                editpan.className = "fa fa-pencil-square-o edit";
                var delpan = document.createElement("i");
                delpan.className = "fa fa-trash delete";
                pan.appendChild(movepan);
                pan.appendChild(editpan);
                pan.appendChild(delpan);
                pan.appendChild(img);
                shot.appendChild(pan);
            }
            scene.appendChild(shot);
        }
        sbMainUL.appendChild(scene);
    }
    container.appendChild(sbMainUL);
}

function Load_Storyboard(sbnum) {
    currentSB = sbnum;
    var data1 = "{value:" + sbnum + "}";
    document.getElementById("container").innerHTML = "";
    $.ajax({
        type: "POST",
        url: 'Storyboard.aspx/Load_Storyboard',
        data: data1,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            Create_Storyboard(msg);
            $('.storyboard').attr("id", currentSB);
        },
        error: function (e) {
            alert("There was an error loading the storyboard. A message has been sent to support. Please try again later." + e.responseText);
        }
    });
}

function Update_Default(sbnum) {
    var data1 = "{value:" + sbnum + "}";
    $.ajax({
        type: "POST",
        url: 'Storyboard.aspx/Set_Default',
        data: data1,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
        },
        error: function (e) {
            alert("There was an error loading the storyboard. A message has been sent to support. Please try again later." + e.responseText);
        }
    });
}

window.onload = function (e) {
    init_drags();
};
$(document).ready(function () {
    $('select').select2();
    $('select').change(function () {
        Load_Storyboard(this.options[this.selectedIndex].value);
    });
    $('.menubtns').click(function (e) {
        if ($(e.target).hasClass("fa-plus")) {
            alert("adding new storyboard");
        } else if ($(e.target).hasClass("fa-trash")) {
            alert("deleting storyboard");
        }
    });
    $('#save-default').click(function () {
        Update_Default($("#sb_selector").val());
    });
    selectedSB = $("#sb_selector").val();
    Load_Storyboard(selectedSB);
});

//All of the dragging stuff
var sourceType = "desktop";
var droppableElms;
var dragWidth = 0;
var dragHeight = 0;
var index = 0;
var blankExists = false;
var selectedElement;

function dragStart(event) {
    event.dataTransfer.setData("ID", event.target.parentNode.id);
    event.dataTransfer.setData("Class", event.target.parentNode.className);
    dragWidth = event.target.parentNode.offsetWidth;
    dragHeight = event.target.parentNode.offsetHeight;
    sourceType = event.target.parentNode.className;

    if (sourceType == "panel") {
        droppableElms = document.getElementsByClassName("panel");
    } else if (sourceType == "shot") {
        droppableElms = document.getElementsByClassName("shot");
    } else if (sourceType == "scene") {
        droppableElms = document.getElementsByClassName("scene");
    }

    for (i = 0; i < droppableElms.length; i++) {
        if (droppableElms.item(i) == event.target.parentNode) {
            continue;
        }
        droppableElms[i].addEventListener("dragenter", dragEnter, false);
    }
}

function dragOver(event) {
    event.preventDefault();
}

function dragLeave(event) {
    event.preventDefault();
    if (event.target.id == "blankChild") {
        var deleteMe = document.getElementById("blankChild");
        deleteMe.removeEventListener("drop", onDropsy);
        deleteMe.parentNode.removeChild(deleteMe);
        blankExists = false;
    }
}

function dragEnter(event) {
    if (sourceType == "panel") {
        if (event.target.className == "panel") {
            Create_Blank(event.target);
        } else if (event.target.tagName == "IMG") {
            Create_Blank(event.target.parentNode);
        }
    } else if (sourceType == "shot") {
        if (event.target.className == "shot") {
            Create_Blank(event.target.parentNode);
        }
    } else if (sourceType == "scene") {
        if (event.target.className == "scene") {
            Create_Blank(event.target.parentNode);
        }
    }
}

function onDropsy(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("ID");
    if (sourceType == "panel" && event.target.className == "blank_panel" || sourceType == "shot" && event.target.className == "blank_shot" || sourceType == "scene" && event.target.className == "blank_scene") {
        event.target.parentNode.insertBefore(document.getElementById(data), event.target.parentNode.childNodes[index]);
        var elm = document.getElementById("blankChild");
        elm.parentNode.removeChild(elm);
        blankExists = false;
        for (i = 0; i < droppableElms.length; i++) {
            droppableElms[i].removeEventListener("dragenter", dragEnter);
        }
        droppableElms = null;
        var ids = new Array();
        var order = new Array();
        var getIds = event.target.parentNode.getElementsByClassName(sourceType);

        for (i = 0; i < getIds.length; i++) {
            ids[i] = (getIds[i].id).substring((getIds[i].id).lastIndexOf("_") + 1);
            order[i] = i;
        }
        return;
    } 
}

function checkBlank(event) {
    event.preventDefault();
    if (document.getElementById("blankChild") && event.target.id != "blankChild") {
        var deleteMe = document.getElementById("blankChild");
        deleteMe.removeEventListener("drop", onDropsy);
        deleteMe.parentNode.removeChild(deleteMe);
        blankExists = false;
        for (i = 0; i < droppableElms.length; i++) {
            droppableElms[i].removeEventListener("dragenter", dragEnter);
        }
        for (i = 0; i < droppableElmss.length; i++) {
            droppableElmss[i].removeEventListener("dragenter", dragEnter);
        }
        droppableElms = null;
        droppableElmss = null;
    }
}

function Create_Blank(elm) {
    if (elm.tagName == "IMG") {
        elm = elm.parentNode;
    }
    var type = elm.tagName.toLowerCase();
    var parent = elm.parentNode;
    var children = parent.childNodes;
    for (i = 0; i < children.length; i++) {
        if (children.item(i) == elm && blankExists == false) {
            var selClassName = "blank_" + elm.className;
            var blankChild = document.createElement(type);
            blankChild.className = selClassName;
            blankChild.id = "blankChild";
            blankChild.setAttribute("style", "height: " + dragHeight + "px; width: " + dragWidth + "px;");
            parent.insertBefore(blankChild, parent.childNodes[i]);
            index = i;
            document.getElementById("blankChild").addEventListener("drop", onDropsy, false);
            blankExists = true;
            break;
        }
    }
}

function removeDrop(event) {
    event.target.removeEventListener("drop", onDropsy);
    event.target.removeEventListener("dragLeave", removeDrop);
}

function openImage(elm) {
    localStorage.canvas = elm.src;
    init();
}

function init_drags() {
    // Global Listeners
    document.addEventListener("dragstart", dragStart, false);
    document.addEventListener("dragover", dragOver, false);
    document.addEventListener("dragleave", dragLeave, false);
    document.addEventListener("drop", checkBlank, false);
    $(".edit").click(function (e) {
        selectedElement = e.target.parentNode;
        selectedElement = selectedElement.getElementsByTagName("IMG");
        openImage(selectedElement);
    });
    $(".delete").click(function (e) {
        $(e.target).parent().remove();
    });
}