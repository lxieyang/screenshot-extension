import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import imageClipper from './image-clipper.js';

const getImageDimensions = (file) => {
  return new Promise(function (resolved, rejected) {
    var img = new Image();
    img.onload = function () {
      resolved({ w: img.width, h: img.height });
    };
    img.src = file;
  });
};

chrome.browserAction.setTitle({
  title:
    'Hold the Option/Alt key and drag the mouse to create partial screenshots.\nClick the icon to create full-page screenshots.',
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    chrome.storage.sync.get(['download', 'openInTab'], (result) => {
      // download image
      if (result.download) {
        chrome.downloads.download({
          url: screenshotUrl,
          filename: `${new Date().getTime().toString()}.jpg`,
        });
      }

      // see for yourself the screenshot during testing
      if (result.openInTab) {
        chrome.tabs.create({
          url: screenshotUrl,
        });
      }
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'SCREENSHOT_WITH_COORDINATES') {
    let rect = request.rect;
    let windowSize = request.windowSize;
    chrome.tabs.captureVisibleTab(function (screenshotUrl) {
      getImageDimensions(screenshotUrl).then((imageDimensions) => {
        let scale = imageDimensions.w / windowSize.width;
        let x = Math.floor(rect.x * scale);
        let y = Math.floor(rect.y * scale);
        let width = Math.floor(rect.width * scale);
        let height = Math.floor(rect.height * scale);
        imageClipper(screenshotUrl, function () {
          this.crop(x, y, width, height).toDataURL((dataUrl) => {
            chrome.storage.sync.get(['download', 'openInTab'], (result) => {
              // download image
              if (result.download) {
                chrome.downloads.download({
                  url: dataUrl,
                  filename: `${new Date().getTime().toString()}.jpg`,
                });
              }

              // see for yourself the screenshot during testing
              if (result.openInTab) {
                chrome.tabs.create({
                  url: dataUrl,
                });
              }
            });

            // get dimensions
            // getImageDimensions(dataUrl).then((croppedImageDimensions) => {
            //   let dimensions = {
            //     trueWidth: croppedImageDimensions.w,
            //     trueHeight: croppedImageDimensions.h,
            //     rectWidth: rect.width,
            //     rectHeight: rect.height,
            //     rectX: rect.x,
            //     rectY: rect.y,
            //   };
            //   console.log(dimensions);
            // });
          });
        });
      });
    });
  }
});
