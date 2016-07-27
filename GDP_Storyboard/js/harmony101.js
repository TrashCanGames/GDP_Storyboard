//cretae canvas
var container,
    canvas,
    context,
    brush,
    menu,
    foregroundColorSelector,
backgroundColorSelector,
palette,
        COLOR = [0, 0, 0],
        BACKGROUND_COLOR = [255, 255, 255],
        isFgColorSelectorVisible = false,
isBgColorSelectorVisible = false,
SCREEN_WIDTH = window.offsetWidth,
SCREEN_HEIGHT = window.offsetHeight;

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
        this.context.strokeStyle = "rgba(" + COLOR[0] + ", " + COLOR[1] + ", " + COLOR[2] + ", 0.5)";
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

function HSB2RGB(j, d, c) {
    var e, g, l, h, k, b, a, m;
    if (c == 0) {
        return [0, 0, 0]
    }
    j *= 0.016666667;
    d *= 0.01;
    c *= 0.01;
    h = Math.floor(j);
    k = j - h;
    b = c * (1 - d);
    a = c * (1 - (d * k));
    m = c * (1 - (d * (1 - k)));
    switch (h) {
        case 0:
            e = c;
            g = m;
            l = b;
            break;
        case 1:
            e = a;
            g = c;
            l = b;
            break;
        case 2:
            e = b;
            g = c;
            l = m;
            break;
        case 3:
            e = b;
            g = a;
            l = c;
            break;
        case 4:
            e = m;
            g = b;
            l = c;
            break;
        case 5:
            e = c;
            g = b;
            l = a;
            break
    }
    return [e, g, l]
}
function RGB2HSB(c, d, k) {
    var j, h, e, g, b, a;
    j = Math.min(Math.min(c, d), k);
    a = Math.max(Math.max(c, d), k);
    if (j == a) {
        return [0, 0, a * 100]
    }
    h = (c == j) ? d - k : ((d == j) ? k - c : c - d);
    e = (c == j) ? 3 : ((d == j) ? 5 : 1);
    g = Math.floor((e - h / (a - j)) * 60) % 360; b = Math.floor(((a - j) / a) * 100);
    a = Math.floor(a * 100);
    return [g, b, a]
}

function ColorSelector(a) {
    this.init(a)
}
ColorSelector.prototype = {
    container: null,
    color: [0, 0, 0],
    hueSelector: null,
    luminosity: null,
    luminosityData: null,
    luminositySelector: null,
    luminosityPosition: null,
    dispatcher: null,
    changeEvent: null,
    init: function (k) {
        var m = this, b, g, d;
        this.container = document.createElement("div");
        this.container.style.position = "absolute";
        this.container.style.width = "250px";
        this.container.style.height = "250px";
        this.container.style.visibility = "hidden";
        this.container.style.cursor = "pointer";
        this.container.addEventListener("mousedown", l, false);
        this.container.addEventListener("touchstart", f, false);
        g = document.createElement("canvas");
        g.width = k.width;
        g.height = k.height;
        b = g.getContext("2d");
        b.drawImage(k, 0, 0, g.width, g.height);
        d = b.getImageData(0, 0, g.width, g.height).data;
        this.container.appendChild(g);
        this.luminosity = document.createElement("canvas");
        this.luminosity.style.position = "absolute";
        this.luminosity.style.left = "0px";
        this.luminosity.style.top = "0px";
        this.luminosity.width = 250;
        this.luminosity.height = 250;
        this.container.appendChild(this.luminosity);
        this.hueSelector = document.createElement("canvas");
        this.hueSelector.style.position = "absolute";
        this.hueSelector.style.left = ((g.width - 15) / 2) + "px";
        this.hueSelector.style.top = ((g.height - 15) / 2) + "px";
        this.hueSelector.width = 15;
        this.hueSelector.height = 15;
        b = this.hueSelector.getContext("2d");
        b.lineWidth = 2;
        b.strokeStyle = "rgba(0, 0, 0, 0.5)";
        b.beginPath();
        b.arc(8, 8, 6, 0, Math.PI * 2, true);
        b.stroke();
        b.strokeStyle = "rgba(256, 256, 256, 0.8)";
        b.beginPath();
        b.arc(7, 7, 6, 0, Math.PI * 2, true);
        b.stroke();
        this.container.appendChild(this.hueSelector);
        this.luminosityPosition = [(k.width - 15), (k.height - 15) / 2];
        this.luminositySelector = document.createElement("canvas");
        this.luminositySelector.style.position = "absolute";
        this.luminositySelector.style.left = (this.luminosityPosition[0] - 7) + "px";
        this.luminositySelector.style.top = (this.luminosityPosition[1] - 7) + "px";
        this.luminositySelector.width = 15;
        this.luminositySelector.height = 15;
        b = this.luminositySelector.getContext("2d");
        b.drawImage(this.hueSelector, 0, 0, this.luminositySelector.width, this.luminositySelector.height);
        this.container.appendChild(this.luminositySelector);
        this.dispatcher = document.createElement("div");
        this.changeEvent = document.createEvent("Events");
        this.changeEvent.initEvent("change", true, true);
        function l(n) {
            window.addEventListener("mousemove", c, false);
            window.addEventListener("mouseup", h, false);
            e(n.clientX - m.container.offsetLeft, n.clientY - m.container.offsetTop)
        }
        function c(n) {
            e(n.clientX - m.container.offsetLeft, n.clientY - m.container.offsetTop)
        }
        function h(n) {
            window.removeEventListener("mousemove", c, false);
            window.removeEventListener("mouseup", h, false);
            e(n.clientX - m.container.offsetLeft, n.clientY - m.container.offsetTop)
        }
        function f(n) {
            if (n.touches.length == 1) {
                n.preventDefault();
                window.addEventListener("touchmove", a, false);
                window.addEventListener("touchend", j, false);
                e(n.touches[0].pageX - m.container.offsetLeft, n.touches[0].pageY - m.container.offsetTop)
            }
        }
        function a(n) {
            if (n.touches.length == 1) {
                n.preventDefault();
                e(n.touches[0].pageX - m.container.offsetLeft, n.touches[0].pageY - m.container.offsetTop)
            }
        }
        function j(n) {
            if (n.touches.length == 0) {
                n.preventDefault();
                window.removeEventListener("touchmove", a, false);
                window.removeEventListener("touchend", j, false)
            }
        }
        function e(o, t) {
            var q, p, r, n, s;
            q = o - 125;
            p = t - 125;
            r = Math.sqrt(q * q + p * p);
            if (r < 90) {
                m.hueSelector.style.left = (o - 7) + "px";
                m.hueSelector.style.top = (t - 7) + "px";
                m.updateLuminosity([d[(o + (t * 250)) * 4], d[(o + (t * 250)) * 4 + 1], d[(o + (t * 250)) * 4 + 2]])
            }
            else {
                if (r > 100) {
                    n = q / r; s = p / r;
                    m.luminosityPosition[0] = (n * 110) + 125;
                    m.luminosityPosition[1] = (s * 110) + 125;
                    m.luminositySelector.style.left = (m.luminosityPosition[0] - 7) + "px";
                    m.luminositySelector.style.top = (m.luminosityPosition[1] - 7) + "px"
                }
            }
            o = Math.floor(m.luminosityPosition[0]);
            t = Math.floor(m.luminosityPosition[1]);
            m.color[0] = m.luminosityData[(o + (t * 250)) * 4];
            m.color[1] = m.luminosityData[(o + (t * 250)) * 4 + 1];
            m.color[2] = m.luminosityData[(o + (t * 250)) * 4 + 2];
            m.dispatchEvent(m.changeEvent)
        }
    },
    show: function () {
        this.container.style.visibility = "visible"
    },
    hide: function () {
        this.container.style.visibility = "hidden"
    },
    getColor: function () {
        return this.color
    },
    setColor: function (c) {
        var a, e, f, d, b = Math.PI / 180; this.color = c;
        a = RGB2HSB(c[0] / 255, c[1] / 255, c[2] / 255);
        e = a[0] * b;
        f = (a[1] / 100) * 90;
        this.hueSelector.style.left = ((Math.cos(e) * f + 125) - 7) + "px";
        this.hueSelector.style.top = ((Math.sin(e) * f + 125) - 7) + "px";
        d = HSB2RGB(a[0], a[1], 100);
        d[0] *= 255;
        d[1] *= 255;
        d[2] *= 255;
        this.updateLuminosity(d);
        e = (a[2] / 100) * 360 * b;
        this.luminosityPosition[0] = (Math.cos(e) * 110) + 125;
        this.luminosityPosition[1] = (Math.sin(e) * 110) + 125;
        this.luminositySelector.style.left = (this.luminosityPosition[0] - 7) + "px";
        this.luminositySelector.style.top = (this.luminosityPosition[1] - 7) + "px";
        this.dispatchEvent(this.changeEvent)
    },
    updateLuminosity: function (j) {
        var d, f, l, g, p, b, a, o = 100, h = 120, k, n = 1080 / 2, e = 1 / n, c = Math.PI / 180, m = (n / 360);
        b = this.luminosity.width / 2;
        a = this.luminosity.height / 2;
        d = this.luminosity.getContext("2d");
        d.lineWidth = 3;
        d.clearRect(0, 0, this.luminosity.width, this.luminosity.height);
        for (k = 0; k < n; k++) {
            f = k / m * c;
            l = Math.cos(f);
            g = Math.sin(f);
            p = 255 - (k * e) * 255; d.strokeStyle = "rgb(" + Math.floor(j[0] - p) + "," + Math.floor(j[1] - p) + "," + Math.floor(j[2] - p) + ")";
            d.beginPath();
            d.moveTo(l * o + b, g * o + a);
            d.lineTo(l * h + b, g * h + a);
            d.stroke()
        }
        this.luminosityData = d.getImageData(0, 0, this.luminosity.width, this.luminosity.height).data
    },
    addEventListener: function (b, c, a) {
        this.dispatcher.addEventListener(b, c, a)
    },
    dispatchEvent: function (a) {
        this.dispatcher.dispatchEvent(a)
    },
    removeEventListener: function (b, c, a) {
        this.dispatcher.removeEventListener(b, c, a)
    }
};

function Palette() {
    var e, d, b, a, n = 90, m = 1080, f = 1 / m, l = m / 360, c = Math.PI / 180, j, h, k, g, o;
    e = document.createElement("canvas");
    e.width = 250;
    e.height = 250;
    b = e.width / 2;
    a = e.height / 2;
    d = e.getContext("2d");
    d.lineWidth = 1;
    for (j = 0; j < m; j++) {
        h = j / l * c;
        k = Math.cos(h);
        g = Math.sin(h);
        d.strokeStyle = "hsl(" + Math.floor((j * f) * 360) + ", 100%, 50%)";
        d.beginPath();
        d.moveTo(k + b, g + a);
        d.lineTo(k * n + b, g * n + a);
        d.stroke()
    }
    o = d.createRadialGradient(b, b, 0, b, b, n);
    o.addColorStop(0, "rgba(255, 255, 255, 1)");
    o.addColorStop(1, "rgba(255, 255, 255, 0)");
    d.fillStyle = o;
    d.fillRect(0, 0, e.width, e.height);
    return e
}

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
        var canvs = $("#canvas");
        this.container = document.createElement("div");
        this.container.className = "menu_bg";
        this.container.style.left = canvs.offset().left + "px";
        this.container.style.top = canvs.offset().top + "px";
        this.close = document.createElement("i");
        this.close.className = "fa fa-times button";
        this.container.appendChild(this.close);
        this.save = document.createElement("i");
        this.save.className = "fa fa-floppy-o button";
        this.container.appendChild(this.save);
        this.clear = document.createElement("i");
        this.clear.className = "fa fa-refresh button";
        this.container.appendChild(this.clear);
        this.foregroundColor = document.createElement("canvas");
        this.foregroundColor.className = "color_selector";
        this.container.appendChild(this.foregroundColor);
        this.setForegroundColor(COLOR);
        this.backgroundColor = document.createElement("canvas");
        this.backgroundColor.className = "color_selector";
        this.container.appendChild(this.backgroundColor);
        this.setBackgroundColor(BACKGROUND_COLOR);
        window.addEventListener("resize", onWindowResize, false);
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
    flattenCanvas = document.createElement("canvas");
    flattenCanvas.width = 2048;
    flattenCanvas.height = 1152;
    palette = new Palette();
    foregroundColorSelector = new ColorSelector(palette);
    foregroundColorSelector.addEventListener("change", onForegroundColorSelectorChange, false);
    container.appendChild(foregroundColorSelector.container);
    backgroundColorSelector = new ColorSelector(palette);
    backgroundColorSelector.addEventListener("change", onBackgroundColorSelectorChange, false);
    container.appendChild(backgroundColorSelector.container);
    parent.appendChild(container);

    canvas.addEventListener("mousedown", onCanvasMouseDown, false);
    brush = new pencil(context);
    menu = new Menu();

    menu.foregroundColor.addEventListener("click", onMenuForegroundColor, false);
    menu.backgroundColor.addEventListener("click", onMenuBackgroundColor, false);
    menu.save.addEventListener("click", onMenuSave, false);
    menu.clear.addEventListener("click", onMenuClear, false);
    menu.close.addEventListener("click", onMenuClose, false);

    container.appendChild(menu.container);
}

function onCanvasMouseDown(b) {
    cleanPopUps();
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

function onWindowResize(e) {
    var canvs = $("#canvas");
    menu.container.style.left = canvs.offset().left + "px";
    menu.container.style.top = canvs.offset().top + "px";
}

function onForegroundColorSelectorChange(a) {
    COLOR = foregroundColorSelector.getColor();
    menu.setForegroundColor(COLOR);
}
function onBackgroundColorSelectorChange(a) {
    BACKGROUND_COLOR = backgroundColorSelector.getColor();
    menu.setBackgroundColor(BACKGROUND_COLOR);
    document.getElementById("canvas").style.backgroundColor = "rgb(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ")";
}

function onMenuForegroundColor() {
    cleanPopUps();
    foregroundColorSelector.show();
    foregroundColorSelector.container.style.left = (($("#canvas").offset().left) + 50) + "px";
    foregroundColorSelector.container.style.top = (($("#canvas").offset().top) + 300) + "px";
    isFgColorSelectorVisible = true
}
function onMenuBackgroundColor() {
    cleanPopUps();
    backgroundColorSelector.show();
    backgroundColorSelector.container.style.left = (($("#canvas").offset().left) + 50) + "px";
    backgroundColorSelector.container.style.top = (($("#canvas").offset().top) + 300) + "px";
    isBgColorSelectorVisible = true
}

function onMenuSave() {
    flatten();
    selectedElement.src = flattenCanvas.toDataURL("image/png");
}
function onMenuClear() {
    if (!confirm("Are you sure?")) {
        return
    }
    context.clearRect($("#canvas").offset().left, $("#canvas").offset().top, 2048, 1152);
    brush.destroy();
    brush = new pencil(context);
}
function onMenuClose() {
    var parent = document.getElementById("sb_form");
    parent.removeChild(document.getElementById("canvas_bg"));
    window.removeEventListener("resize", onWindowResize, false);
}

function flatten() {
    var a = flattenCanvas.getContext("2d");
    a.fillStyle = "rgb(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ")";
    a.fillRect(0, 0, canvas.width, canvas.height);
    a.drawImage(canvas, 0, 0)
}

function cleanPopUps() {
    if (isFgColorSelectorVisible) {
        foregroundColorSelector.hide();
        isFgColorSelectorVisible = false
    }
    if (isBgColorSelectorVisible) {
        backgroundColorSelector.hide();
        isBgColorSelectorVisible = false
    }
};