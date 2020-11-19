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

window.addEventListener('mousedown', (event) => {
  if (event.altKey) {
    // Alt / Option key is down
    document.body.classList.add('no-select');

    mouseIsDown = true;
    startingX = event.clientX;
    startingY = event.clientY;

    bboxAnchor.style.top = `${startingY}px`;
    bboxAnchor.style.left = `${startingX}px`;
    bboxAnchor.style.width = `0px`;
    bboxAnchor.style.height = `0px`;
  }
});

window.addEventListener('mousemove', (event) => {
  if (mouseIsDown && startingX !== undefined && startingY !== undefined) {
    let width = Math.abs(event.clientX - startingX),
      height = Math.abs(event.clientY - startingY);

    resetBBoxAnchor();

    if (startingY <= event.clientY && startingX <= event.clientX) {
      bboxAnchor.style.top = `${startingY}px`;
      bboxAnchor.style.left = `${startingX}px`;
    } else if (startingY <= event.clientY && startingX >= event.clientX) {
      bboxAnchor.style.top = `${startingY}px`;
      bboxAnchor.style.right = `${document.body.clientWidth - startingX}px`;
    } else if (startingY >= event.clientY && startingX <= event.clientX) {
      bboxAnchor.style.bottom = `${window.innerHeight - startingY}px`;
      bboxAnchor.style.left = `${startingX}px`;
    } else if (startingY >= event.clientY && startingX >= event.clientX) {
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

  const rect = {
    x: Math.min(startingX as number, event.clientX),
    y: Math.min(startingY as number, event.clientY),
    width: Math.abs((startingX as number) - event.clientX),
    height: Math.abs((startingY as number) - event.clientY),
  };

  const windowSize = { width: window.innerWidth, height: window.innerHeight };

  mouseIsDown = false;
  startingX = undefined;
  startingY = undefined;
  document.body.classList.remove('no-select');
  resetBBoxAnchor();

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
    mouseIsDown = false;
    startingX = undefined;
    startingY = undefined;
    document.body.classList.remove('no-select');
    resetBBoxAnchor();
  } else if (event.altKey) {
    hotKeyIsDown = true;
    document.body.classList.add('no-select');
  }
});

window.addEventListener('keyup', (event) => {
  if (hotKeyIsDown && !event.altKey) {
    hotKeyIsDown = false;
    if (!mouseIsDown) {
      document.body.classList.remove('no-select');
    }
  }
});
