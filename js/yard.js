import PieChart from "./pie.js";
import LineChart from "./line.js";
import Model from "./model.js";
import Panel from "./panel.js"
import yardZips from "./yardconfs.js"

export default class Yard {
    constructor() {
        const params = new URLSearchParams(window.location.search);
        document.querySelector('#title h3').innerHTML = params.get('name');
        var zip = yardZips[params.get('name')]
        if(zip) {
            this.model = new Model(zip);
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
        } else {
            alert(`${params.get('name')} map not found!`);
        }
    }

    load(data) {
        var racks = {};
        var forklifts = {};
        var trucks = {};
        for(var i=0;i<data.length;i++) {
            if(data[i].getName().startsWith('rack')) {
                racks[data[i].getName()] = data[i];
            } else if(data[i].getName().startsWith('forklift')) {
                forklifts[data[i].getName()] = data[i];
            } else if(data[i].getName().startsWith('truck')) {
                trucks[data[i].getName()] = data[i];
            }
        }
        var bays = {
            'Buena Park bay-1': {},
            'Buena Park bay-2': {},
            'Buena Park bay-3': {}
        };
        this.rackGroup = new Panel('#rackList', 'rack.html', racks);
        this.rackGroup.onselect(item => {
            this.model.select(item);
        });
        this.forkliftGroup = new Panel('#forkliftList', 'forklift.html', forklifts);
        this.forkliftGroup.onselect(item => {
            this.model.select(item);
        });
        this.truckGroup = new Panel('#truckList', 'truck.html', trucks);
        this.truckGroup.onselect(item => {
            this.model.select(item);
        });
        this.bayGroup = new Panel('#bayList', 'bay.html', bays);
        new LineChart();
        new PieChart();
        this.animate();
    }

    animate() {
        var startTime = Date.now();
        var timer = setInterval(() => {
            if ((Date.now() - startTime) / 1000 > 30) {
                clearInterval(timer);
            }
            if(this.forkliftGroup.data['forklift-2']) {
                this.forkliftGroup.data['forklift-2'].move(0, 20);
            }
            document.querySelector('#measure1').innerHTML = Math.round(Math.random() * 10000);
            document.querySelector('#measure2').innerHTML = Math.round(Math.random() * 10000);
            document.querySelector('#measure3').innerHTML = Math.round(Math.random() * 10000);
            document.querySelector('#measure4').innerHTML = Math.round(Math.random() * 10000);
        }, 100)
    }
}

new Yard();