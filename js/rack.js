import Model from "./model.js";
import Panel from "./panel.js"

export default class Rack {
    constructor() {
        const params = new URLSearchParams(window.location.search);
        document.querySelector('#title h3').innerHTML = params.get('name');
        this.model = new Model("rack.zip");
        this.model.draw(children => {
            this.load(children);
        });
        window.onresize = function () {
            var canvas = document.getElementById("viewerCanvas");
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.getBoundingClientRect().top;
            }
        }
        window.onresize();
    }

    load(data) {
        var bays = {
            'Buena Park bay-1': {},
            'Buena Park bay-2': {},
            'Buena Park bay-3': {}
        };
        this.bayGroup = new Panel('#bayList', 'bay.html', bays);
    }
}

new Rack();