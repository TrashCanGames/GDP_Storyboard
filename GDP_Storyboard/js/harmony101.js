//cretae canvas
var container,
    canvas,
    context,
    brush,
    menu,
        COLOR = [0, 0, 0],
        BACKGROUND_COLOR = [255, 255, 255];

function pencil(a) {
    this.init(a)
}
pencil.prototype = {
    context: null,
    prevMouseX: null,
    prevMouseY: null,
    points: null,
    count: null,
    init: function (a) {
        this.context = a;
        this.context.globalCompositeOperation = "source-over";
        this.points = new Array();
        this.count = 0
    },
    destroy: function () {
    },
    strokeStart: function (b, a) {
        this.prevMouseX = b;
        this.prevMouseY = a
    },
    stroke: function (f, c) {
        var e, b, a, g;
        this.points.push([f, c]);
        this.context.lineWidth = 3;
        this.context.strokeStyle = "rgba(0,0,0,0.5)";
        this.context.beginPath();
        this.context.moveTo(this.prevMouseX, this.prevMouseY);
        this.context.lineTo(f, c);
        this.context.stroke();
        this.prevMouseX = f;
        this.prevMouseY = c;
        this.count++
    },
    strokeEnd: function () {
    }
};

function Menu() {
    this.init()
}
Menu.prototype = {
    container: null,
    foregroundColor: null,
    backgroundColor: null,
    selector: null,
    save: null,
    clear: null,
    close: null,
    init: function () {
        var b, c, d, e = 15, a = 15;
        this.container = document.createElement("div");
        this.container.className = "menu_bg";
        this.container.attributes("style", "left:" + )
        this.foregroundColor = document.createElement("canvas");
        this.foregroundColor.style.marginBottom = "-3px";
        this.foregroundColor.style.cursor = "pointer";
        this.foregroundColor.width = e;
        this.foregroundColor.height = a;
        this.container.appendChild(this.foregroundColor);
        this.setForegroundColor(COLOR);
        c = document.createTextNode(" ");
        this.container.appendChild(c);
        this.backgroundColor = document.createElement("canvas");
        this.backgroundColor.style.marginBottom = "-3px";
        this.backgroundColor.style.cursor = "pointer";
        this.backgroundColor.width = e;
        this.backgroundColor.height = a;
        this.container.appendChild(this.backgroundColor);
        this.setBackgroundColor(BACKGROUND_COLOR);
        c = document.createTextNode(" ");
        this.container.appendChild(c);
        c = document.createTextNode(" ");
        this.container.appendChild(c);
        this.save = document.createElement("span");
        this.save.className = "button";
        this.save.innerHTML = "Save";
        this.container.appendChild(this.save);
        c = document.createTextNode(" ");
        this.container.appendChild(c);
        this.clear = document.createElement("Clear");
        this.clear.className = "button";
        this.clear.innerHTML = "Clear";
        this.container.appendChild(this.clear);
        d = document.createTextNode(" | ");
        this.container.appendChild(d);
        this.close = document.createElement("Close");
        this.close.className = "button";
        this.close.innerHTML = "Close";
        this.container.appendChild(this.close);
    },
    setForegroundColor: function (a) {
        var b = this.foregroundColor.getContext("2d");
        b.fillStyle = "rgb(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
        b.fillRect(0, 0, this.foregroundColor.width, this.foregroundColor.height);
        b.fillStyle = "rgba(0, 0, 0, 0.1)";
        b.fillRect(0, 0, this.foregroundColor.width, 1)
    },
    setBackgroundColor: function (a) {
        var b = this.backgroundColor.getContext("2d");
        b.fillStyle = "rgb(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
        b.fillRect(0, 0, this.backgroundColor.width, this.backgroundColor.height);
        b.fillStyle = "rgba(0, 0, 0, 0.1)";
        b.fillRect(0, 0, this.backgroundColor.width, 1)
    }
};

function init_canvas() {
    var parent = document.getElementById("sb_form");
    container = document.createElement("div");
    container.id = "canvas_bg";
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 2048;
    canvas.height = 1152;
    context = canvas.getContext("2d");

    container.appendChild(canvas);
    parent.appendChild(container);

    canvas.addEventListener("mousedown", onCanvasMouseDown, false);
    brush = new pencil(context);
    menu = new Menu();
    container.appendChild(menu.container);
}

function onCanvasMouseDown(b) {
    var screen_width = window.innerWidth;
    var c, a;
    var canvas = document.getElementById('canvas');
    var mousePos = getMousePos(canvas, b);
    brush.strokeStart(mousePos.x, mousePos.y);//b.clientX, b.clientY);
    window.addEventListener("mousemove", onCanvasMouseMove, false);
    window.addEventListener("mouseup", onCanvasMouseUp, false)
}

function onCanvasMouseMove(a) {
    var canvas = document.getElementById('canvas');
    var mousePos = getMousePos(canvas, a);
    brush.stroke(mousePos.x, mousePos.y)//a.clientX, a.clientY)
}

function onCanvasMouseUp() {
    brush.strokeEnd();
    window.removeEventListener("mousemove", onCanvasMouseMove, false);
    window.removeEventListener("mouseup", onCanvasMouseUp, false);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
        y: Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
    };
}