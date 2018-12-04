"use strict";

/**
 * Create a meteor shower sample application.
 * @param {HTMLElement} container A application container.
 * @param {number} width The width of canvas.
 * @param {number} height The height of canvas.
 * @param {string} backcolor1 A background color for UI-thread.
 * @param {string} backcolor2 A background color for Worker-thread.
 * @returns {undefined}
 */
function App(container, width, height, backcolor1, backcolor2) {
    container.insertAdjacentHTML("beforeend", `
        <input type="radio" id="workerUsageNoUse" name="workerUsage" value="nouse"
               checked="checked"/>
        <label for="workerUsageNoUse">Single threading (using setInterval)</label>
        <input type="radio" id="workerUsageUse" name="workerUsage" value="use" />
        <label for="workerUsageUse">Multi threading (using worker)</label>
        <div style="background-color: #002">
            <canvas style="width:${width}px;height:${height}px"></canvas>
        </div>`
    );

    const canvas = container.querySelector("canvas");
    const ctx = canvas.getContext('2d');
    const singleApp = new MeteorShower(ctx);
    singleApp.setWidth(width);
    singleApp.setHeight(height);
    singleApp.setBackcolor(backcolor1);
    singleApp.setCount(1000);
    singleApp.initialize();

    const multiApp = new TransWorker();
    multiApp.create(
        "meteor-shower-worker.js",
        MeteorShower, this, {
        "fillRects": fillRects => {
            for(const rect of fillRects) {
                ctx.fillStyle = rect.fillColor;
                ctx.fillRect(
                    rect.x, rect.y,
                    rect.w, rect.h);
            }
        }
    });
    multiApp.setWidth(width, null);
    multiApp.setHeight(height, null);
    multiApp.setBackcolor(backcolor2, null);
    multiApp.setCount(1000, null);
    multiApp.initialize();

    let usingWorker = false;
    const radios = container.querySelectorAll("[name='workerUsage']");
    for(const inp of radios) {
        inp.addEventListener("change", () => {
            if(usingWorker) {
                multiApp.stop(
                    () => singleApp.start());
            } else {
                singleApp.stop();
                multiApp.start();
            }
            usingWorker = (inp.value === "use");
        });
    }
    singleApp.start();
};
