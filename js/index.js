import EarthViewer from './earth.js';
import yardZips from "./yardconfs.js"

global.earth = new EarthViewer();
var yards = {};

window.onload = function () {
    document.querySelector('.cesium-viewer-toolbar').style.zIndex = 100;
    document.querySelector('#password input').focus();
    document.querySelector('#password input').onkeydown = e => {
        if (e.keyCode == 13) {
            login();
        }
    };
    document.querySelector('#loginButton').onclick = () => {
        login();
    };
};

function login() {
    if (document.querySelector('#username input').value == 'admin' && document.querySelector('#password input').value == 'admin') {
        fadeOut('#loginPanel');
        load();
    } else {
        document.querySelector('#username').style.border = '1px solid red';
        document.querySelector('#password').style.border = '1px solid red';
    }
}

function load() {
    document.querySelector('#yardGroupPanel').style.visibility = 'visible';
    fetch('https://kk2j6nl1s0.execute-api.us-west-2.amazonaws.com/prd/trailers/samsara/query/facility-list').then(
        response => response.json()
    ).then(data => {
        data.data.forEach(item => {
            yards[item.name.trim()] = item;
        });
        global.earth.load(data.data);
        var keys = Object.keys(yards).filter(o => yardZips[o]);
        var html = '';
        for (var i = 0; i < keys.length; i++) {
            html += `<tr>
            <td width="90%">
                <a style="color: inherit; text-decoration: none;" class="selectLink" href="#">
                ${keys[i]}
                </a>
            </td>
            <td width="10%">
                <a style="color: inherit; text-decoration: none;" class="forwardLink" href="#">
                view
                </a>
            </td>
            </tr>`;
        }
        document.querySelector('#yardList').innerHTML = html;
        document.querySelectorAll('#yardList tr td .selectLink').forEach(o => {
            o.onclick = function () {
                select(this.innerText);
            };
        });
        document.querySelectorAll('#yardList tr td .forwardLink').forEach(o => {
            o.onclick = function () {
                forwardYardPage(this.parentElement.previousElementSibling.innerText);
            };
        });
        document.querySelector('#yardGroupPanel .skeleton-container').remove();
    });
}

function forwardYardPage(name) {
    if (yardZips[name]) {
        location.href = `yard.html?name=${name}`;
    } else {
        alert(`${name} map not found!`);
    }
}

function select(name) {
    document.querySelector("#title h3").innerHTML = name;
    global.earth.selectYard(yards[name]);
}
