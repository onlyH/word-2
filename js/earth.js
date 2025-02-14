export default class EarthViewer {
    constructor() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NGM1ZjZmMS1lNGRlLTRmY2EtYmFlNy05OTM0M2VjYTMzMGYiLCJpZCI6MjcyNTg4LCJpYXQiOjE3MzgzMzY3MTh9.0e6I7FploPHIKY1Dru7toQRhzwu0rxHvgEeFnXxJ55k';
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            terrain: Cesium.Terrain.fromWorldTerrain(),
            animation: true,
            shouldAnimate: true,
            timeline: true
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        // this.viewer.camera.lookAt(
        //     Cesium.Cartesian3.fromDegrees(-98.0, 40.0),
        //     new Cesium.Cartesian3(0.0, -4790000.0, 3930000.0),
        // );
        this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(event => {
            if (event === 0) { // When the terrain has fully loaded
                document.querySelector('.loading-screen').style.display = 'none';
            }
        });
    }

    selectLinehaul(item) {
        // 设置两点的经纬度坐标
        const startPoint = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883); // 第一个点（经度, 纬度）
        const endPoint = Cesium.Cartesian3.fromDegrees(-80.50, 35.14); // 第二个点（经度, 纬度）

        // 创建线条
        const line = this.viewer.entities.add({
            polyline: {
                positions: [startPoint, endPoint], // 定义起点和终点
                width: 5, // 线宽
                material: Cesium.Color.RED // 线的颜色
            }
        });

        this.viewer.zoomTo(line);
    }

    selectYard(item) {
        var entity = null;
        if(item.geofence.polygon) {
            var array = [];
            item.geofence.polygon.vertices.forEach(o => {
                array.push(o.longitude); 
                array.push(o.latitude);
            });
            entity = this.viewer.entities.add({
                name: item.name,
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(array),
                    ),
                    material: Cesium.Color.RED.withAlpha(0.2),
                    outline: true, // 是否显示边框
                    outlineColor: Cesium.Color.RED, // 边框颜色
                },
            });
            var boundingSphere = Cesium.BoundingSphere.fromPoints(Cesium.Cartesian3.fromDegreesArray(array)); // 计算包围球
            this.viewer.camera.flyToBoundingSphere(boundingSphere, {
                duration: 2,  // 2秒飞行
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), boundingSphere.radius * 1.5) // 适当的高度
            });
        } else if(item.geofence.circle) {
            // 添加圆形实体（透明红色填充）
            entity = this.viewer.entities.add({
                name: item.name,
                position: Cesium.Cartesian3.fromDegrees(item.geofence.circle.longitude, item.geofence.circle.latitude), // 圆心坐标（北京天安门）
                ellipse: {
                    semiMajorAxis: item.geofence.circle.radiusMeters, // 长半轴（单位：米）
                    semiMinorAxis: item.geofence.circle.radiusMeters, // 短半轴（单位：米）= 圆形
                    material: Cesium.Color.RED.withAlpha(0.2), // 透明红色填充
                    outline: true, // 是否显示边框
                    outlineColor: Cesium.Color.RED // 边框颜色
                }
            });
            this.viewer.camera.flyTo({
                destination: entity.position.getValue(Cesium.JulianDate.now()), // 获取实体位置
                orientation: {
                    heading: Cesium.Math.toRadians(0),   // 方向（默认朝北）
                    pitch: Cesium.Math.toRadians(-90),   // 俯视视角
                    roll: 0
                },
                duration: 2 // 飞行持续时间（秒）
            });
        }
        
        // 监听点击事件
        // var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // handler.setInputAction(movement => {
        //     var pickedObject = this.viewer.scene.pick(movement.position);
        //     if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
        //         location.href = `bay.html?name=${entity.name}`;
        //     }
        // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    
    load(data) {
        data.forEach((item, index) => {
            if(item.geofence.polygon) {
                var position = Cesium.Cartesian3.fromDegrees(
                    item.longitude, 
                    item.latitude, 
                    100);
                // var labelEntity = this.viewer.entities.add({
                //     position: position,
                //     label: {
                //         text: item.name,
                //         font: "8pt Michroma",
                //         outlineColor: Cesium.Color.RED,
                //         outlineWidth: 2
                //     },
                // });
                // var offset = new Cesium.Cartesian3(1000 * (index + 1), 0, 0); // 增加偏移量
                // labelEntity.position = Cesium.Cartesian3.add(labelEntity.position.getValue(Cesium.JulianDate.now()), offset, new Cesium.Cartesian3());
                // 添加小圆点实体（红色）
                this.viewer.entities.add({
                    position: position,
                    point: {
                        pixelSize: 8, // 圆点大小
                        color: Cesium.Color.RED // 红色
                    }
                });

            }
        });

        (async () => {
            const tileset = await Cesium.createGooglePhotorealistic3DTileset({
            // Only the Google Geocoder can be used with Google Photorealistic 3D Tiles.  Set the `geocode` property of the viewer constructor options to IonGeocodeProviderType.GOOGLE.
                onlyUsingWithGoogleGeocoder: true,
            });
            this.viewer.scene.primitives.add(tileset);
        })()
        
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                data[0].longitude, 
                data[0].latitude, 
                10000000),
            duration: 3,  // 2秒完成动画
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90), // 从上往下看
                roll: 0.0
            }
        });
        // 设置时间模拟
        const clock = this.viewer.clock;
        clock.shouldAnimate = true; // 启用时间模拟

        // 设置时间流逝的速率（地球自转的速度）
        clock.multiplier = 10;  // 每秒钟地球转动多少圈，设置为 10

        // 设置默认的时间范围
        clock.startTime = Cesium.JulianDate.now();
        clock.currentTime = Cesium.JulianDate.now();
        clock.stopTime = Cesium.JulianDate.addSeconds(clock.startTime, 60, new Cesium.JulianDate()); // 自动时间流逝60秒

        // 如果你不希望用户控制时间
        this.viewer.timeline.zoomTo(clock.startTime, clock.stopTime);
    }
}