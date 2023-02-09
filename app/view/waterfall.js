const requests = [];
let intervalId;

const waterfallSvg = document.getElementById("waterfall-svg");
const barWidth = 30;
const barPadding = 10;
const barHeight = 400;
const finishTime = 5000;

function addRequest(request) {
  request.startTime = performance.now();
  requests.push(request);

  const index = requests.length - 1;
  const bar = createBar(index, requests[index]);
  waterfallSvg.appendChild(bar);
}

function finishRequest(index) {
  clearInterval(intervalId);
  const bar = createBar(index, requests[index]);
  waterfallSvg.replaceChild(bar, waterfallSvg.childNodes[index]);
}

function updateRequests() {
  requests.forEach((request, index) => {
    if (performance.now() - request.startTime >= finishTime) {
      finishRequest(index);
    }
  });
  renderWaterfall();
}

function renderWaterfall() {
  while (waterfallSvg.lastChild) {
    waterfallSvg.removeChild(waterfallSvg.lastChild);
  }

  requests.forEach((request, index) => {
    const bar = createBar(index, request);
    waterfallSvg.appendChild(bar);
  });
}

function createBar(index, request) {
  const maxEndTime = Math.max(...requests.map((request) => performance.now() - request.startTime), finishTime);
  const x = (barHeight * request.startTime) / maxEndTime;
  const y = index * (barWidth + barPadding);
  const width = (barHeight * (performance.now() - request.startTime)) / maxEndTime;
  const height = barWidth;

  const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bar.setAttribute("x", x);
  bar.setAttribute("y", y);
  bar.setAttribute("width", width);
  bar.setAttribute("height", height);
  bar.setAttribute("fill", "blue");

  return bar;
}

addRequest({ method: "GET", status: 200, size: 500 });
addRequest({ method: "POST", status: 201, size: 1000 });
setTimeout(() => addRequest({ method: "GET", status: 200, size: 500 }), 1000);
addRequest({ method: "PUT", status: 204, size: 2000 });

setTimeout(()=> finishRequest(0), 2000);

intervalId = setInterval(updateRequests, 10);