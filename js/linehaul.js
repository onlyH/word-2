function getCurvedCoordsOnSphere(start, end, heightFactor) {
    // 将地理坐标（经度、纬度、高度）转换为三维球面坐标
    function toCartesian([lon, lat, alt = 0]) {
        const radLat = (lat * Math.PI) / 180;
        const radLon = (lon * Math.PI) / 180;
        const R = 1 + alt; // 基础半径加高度
        return [
            R * Math.cos(radLat) * Math.cos(radLon),
            R * Math.cos(radLat) * Math.sin(radLon),
            R * Math.sin(radLat),
        ];
    }

    // 将三维球面坐标转换回地理坐标（经度、纬度、高度）
    function toGeo([x, y, z]) {
        const R = Math.sqrt(x * x + y * y + z * z);
        const lat = Math.asin(z / R) * (180 / Math.PI);
        const lon = Math.atan2(y, x) * (180 / Math.PI);
        const alt = R - 1; // 高度为半径减基础半径
        return [lon, lat, alt];
    }

    // 线性插值计算
    function interpolate(p1, p2, t) {
        return [
            p1[0] * (1 - t) + p2[0] * t,
            p1[1] * (1 - t) + p2[1] * t,
            p1[2] * (1 - t) + p2[2] * t,
        ];
    }

    const startCartesian = toCartesian(start);
    const endCartesian = toCartesian(end);

    // 计算中间点的球面插值
    const midCartesian = interpolate(startCartesian, endCartesian, 0.5);

    // 将中间点抬高以增加弧度
    const midLength = Math.sqrt(
        midCartesian[0] ** 2 + midCartesian[1] ** 2 + midCartesian[2] ** 2
    );
    const curvedMidCartesian = midCartesian.map(
        (coord) => (coord / midLength) * (1 + heightFactor)
    );

    // 转回地理坐标系
    return [start, toGeo(curvedMidCartesian), end];
}
export default class Linehaul {
    load(data) {
        var linehauls = {};
        for(var i=0;i<data.length;i++) {
            var objs = [];
            for(var j=0;j<data.length;j++) {
                objs.push({
                    coords: getCurvedCoordsOnSphere(
                        data[i].point, // 地球中心（或其他起点）
                        data[j].point, // 目标点
                        0.8
                    )
                });
            }
            linehauls[data[i].name] = {
                point: data[i].point,
                labelText: data[i].name,
                coords: objs
            };
        }
        var self = this;
        this.data = linehauls;
        document.querySelector('#linehaulGroupPanel').style.visibility = 'visible';
        var keys = Object.keys(linehauls);
        var html = '';
        for(var i=0;i<keys.length;i++) {
            html += `<tr>
            <td>
                <a style="color: inherit; text-decoration: none;" href="#">
                ${keys[i]}
                </a>
            </td>
            </tr>`;
        }
        document.querySelector('#linehaulList').innerHTML = html;
        document.querySelectorAll('#linehaulList tr td a').forEach(o => {
            o.onclick = function() {
                self.select(this);
            };
        });
    }

    select(e) {
        global.earth.selectLinehaul(this.data[e.innerText]);
    }
}