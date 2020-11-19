const bboxAnchor = document.body.appendChild(document.createElement('div'));
bboxAnchor.id = 'screenshot-bbox';
bboxAnchor.style.zIndex = '9999999';
bboxAnchor.style.position = 'fixed';
bboxAnchor.style.top = '0px';
bboxAnchor.style.left = '0px';
bboxAnchor.style.width = `0px`;
bboxAnchor.style.height = `0px`;

let hotKeyIsDown = false,
  mouseIsDown = false;
let startingX: number | undefined = undefined,
  startingY: number | undefined = undefined;

const resetBBoxAnchor = () => {
  bboxAnchor.style.removeProperty('top');
  bboxAnchor.style.removeProperty('left');
  bboxAnchor.style.removeProperty('bottom');
  bboxAnchor.style.removeProperty('right');
  bboxAnchor.style.removeProperty('width');
  bboxAnchor.style.removeProperty('height');
};

const resetEverything = () => {
  hotKeyIsDown = false;
  mouseIsDown = false;
  startingX = undefined;
  startingY = undefined;
  document.body.classList.remove('no-select');
  // document.body.style.removeProperty('cursor');
  resetBBoxAnchor();
  bboxAnchor.classList.remove('active');
};

window.addEventListener('mousedown', (event) => {
  if (event.altKey) {
    // Alt / Option key is down
    document.body.classList.add('no-select');
    // document.body.style.cursor = `url(${chrome.extension.getURL(
    //   'cross-32.png'
    // )}), auto`;

    mouseIsDown = true;
    startingX = event.clientX;
    startingY = event.clientY;

    bboxAnchor.style.top = `${startingY}px`;
    bboxAnchor.style.left = `${startingX}px`;
    bboxAnchor.style.width = `0px`;
    bboxAnchor.style.height = `0px`;

    bboxAnchor.classList.add('active');
  }
});

const rectifyCursorCoordinates = (clientX: number, clientY: number) => {
  let currX = clientX < 0 ? 0 : clientX,
    currY = clientY < 0 ? 0 : clientY;
  return [currX, currY];
};

window.addEventListener('mousemove', (event) => {
  if (mouseIsDown && startingX !== undefined && startingY !== undefined) {
    const [currX, currY] = rectifyCursorCoordinates(
      event.clientX,
      event.clientY
    );

    const width = Math.abs(currX - startingX),
      height = Math.abs(currY - startingY);

    resetBBoxAnchor();

    if (startingY <= currY && startingX <= currX) {
      bboxAnchor.style.top = `${startingY}px`;
      bboxAnchor.style.left = `${startingX}px`;
    } else if (startingY <= currY && startingX >= currX) {
      bboxAnchor.style.top = `${startingY}px`;
      bboxAnchor.style.right = `${document.body.clientWidth - startingX}px`;
    } else if (startingY >= currY && startingX <= currX) {
      bboxAnchor.style.bottom = `${window.innerHeight - startingY}px`;
      bboxAnchor.style.left = `${startingX}px`;
    } else if (startingY >= currY && startingX >= currX) {
      bboxAnchor.style.bottom = `${window.innerHeight - startingY}px`;
      bboxAnchor.style.right = `${document.body.clientWidth - startingX}px`;
    }

    bboxAnchor.style.width = `${width}px`;
    bboxAnchor.style.height = `${height}px`;
  }
});

window.addEventListener('mouseup', (event) => {
  if (!mouseIsDown || startingX === undefined || startingY === undefined) {
    return;
  }

  const [currX, currY] = rectifyCursorCoordinates(event.clientX, event.clientY);
  const rect = {
    x: Math.min(startingX, currX),
    y: Math.min(startingY, currY),
    width: Math.abs(startingX - currX),
    height: Math.abs(startingY - currY),
  };
  const windowSize = { width: window.innerWidth, height: window.innerHeight };

  resetEverything();

  // avoid screenshoting the bbox
  setTimeout(() => {
    chrome.runtime.sendMessage({
      msg: 'SCREENSHOT_WITH_COORDINATES',
      rect,
      windowSize,
    });
  }, 1);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    resetEverything();
  } else if (event.altKey) {
    hotKeyIsDown = true;
    document.body.classList.add('no-select');
    // document.body.style.cursor = `url(${chrome.extension.getURL(
    //   'cross-32.png'
    // )}), auto`;
  }
});

window.addEventListener('keyup', (event) => {
  if (hotKeyIsDown && !event.altKey) {
    hotKeyIsDown = false;
    if (!mouseIsDown) {
      document.body.classList.remove('no-select');
      // document.body.style.removeProperty('cursor');
    }
  }
});
