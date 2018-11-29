function WebWorkerSample($container, width, height, backcolor1, backcolor2) {
    var $canvas = $("<canvas/>").css("width", width + "px").css("height", height + "px");
    this.canvas = $canvas.get(0);
    this.width = width;
    this.height = height;
    $container
        .append($("<input/>").attr("name", "workerUsage").attr("type", "radio").attr("value", "nouse")
                .attr("checked", "checked"))
        .append($("<label/>").attr("for", "workerUsage").html("Single threading (using setInterval)"))
        .append($("<input/>").attr("name", "workerUsage").attr("type", "radio").attr("value", "use"))
        .append($("<label/>").attr("for", "workerUsage").html("Multi threading(using worker)"))
        .append($("<div/>").css("background-color", "#002").append($canvas));
    this.tid = null;
    this.ctx = this.canvas.getContext('2d');
    this.singleApp = new MeteorShower(this.ctx);
    this.singleApp.setWidth(width);
    this.singleApp.setHeight(height);
    this.singleApp.setBackcolor(backcolor1);
    this.singleApp.setCount(1000);
    this.singleApp.initialize();

    this.multiApp = new TransWorker();
    this.multiApp.create(
            "sampleworker.js",
            MeteorShower, this, {
            "fillRects": function(fillRects) {
                fillRects.forEach(function(rect) {
                    this.ctx.fillStyle = rect.fillColor;
                    this.ctx.fillRect(
                        rect.x, rect.y,
                        rect.w, rect.h);
                }, this);
            }
        });
    this.multiApp.setWidth(width, null);
    this.multiApp.setHeight(height, null);
    this.multiApp.setBackcolor(backcolor2, null);
    this.multiApp.setCount(1000, null);
    this.multiApp.initialize();

    this.usingWorker = false;
    $container.find("[name='workerUsage']").change((function(app) {
        return function () {
            if(app.usingWorker) {
                app.multiApp.stop(function() {
                    app.singleApp.start();
                });
            } else {
                app.singleApp.stop();
                app.multiApp.start();
            }
            app.usingWorker = ($(this).val() == 'use');
        };
    }(this)));
    this.singleApp.start();
};
