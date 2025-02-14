export default class Model {
  constructor(url) {
    this.url = url;
  }

  release() {
    if (document.querySelector('#viewerCanvas')) document.querySelector('#viewerCanvas').remove();
  };

  draw(callback) {
    this.clear();
    var onerror = err => {
      if (err == "No WebGL") {
        alert("Sorry, your browser doesn't support WebGL.");
      } else {
        console.log(err.stack);
        alert("Error: " + (err.message ? err.constructor.name + " " + err.message : err)
          + (window.location.href.indexOf("file://") === 0 ? "\nCheck your browser is allowed to access local files." : ""));
      }
    };
    document.getElementById("viewerProgressDiv").style.visibility = "visible";
    var onprogression = (part, info, percentage) => {
      var progress = document.getElementById("viewerProgress");
      if (part === HomeRecorder.READING_HOME) {
        progress.value = percentage * 100;
        info = info.substring(info.lastIndexOf('/') + 1);
      } else if (part === Node3D.READING_MODEL) {
        progress.value = 100 + percentage * 100;
        if (percentage === 1) {
          document.getElementById("viewerProgressDiv").style.visibility = "hidden";
          var home = Model.homeComponent.getHome();
          this.home = home;
          var homePieceOfFurnitures = home.getFurniture();
          this.setUserPreferences();
          if (callback) {
            callback(homePieceOfFurnitures);
          }
        }
      }

      document.getElementById("viewerProgressLabel").innerHTML =
        (percentage ? Math.floor(percentage * 100) + "% " : "") + part + " " + info;
    };

    Model.homeComponent = viewHome("viewerCanvas", this.url, onerror, onprogression, {
      roundsPerMinute: 1.0,
      navigationPanel: "none",
      //   navigationPanel: (!/ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase()) || !!window.MSStream) ? "default" : "none",             
      aerialViewButtonId: "aerialView",
      virtualVisitButtonId: "virtualVisit",
      // levelsAndCamerasListId: "levelsAndCameras",
      activateCameraSwitchKey: true
    });
  };

  setUserPreferences() {
    var userPreferences = Model.homeComponent.getUserPreferences();
    userPreferences.setEditingIn3DViewEnabled(true);
    userPreferences.setAerialViewCenteredOnSelectionEnabled(true);
    userPreferences.setObserverCameraSelectedAtChange(true);
  }

  select(selectItems) {
    if(selectItems instanceof Array) {
      this.home.setSelectedItems(selectItems);
    } else {
      var array = [];
      array.push(selectItems);
      this.home.setSelectedItems(array);
    }
  }

  clear() {
    if (Model.homeComponent) {
      Model.homeComponent.dispose();
    }
  }
}


