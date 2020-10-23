const HOW_MANY_VIDEOS = 5;
const MARGIN_RIGHT = 0;
const MAX_COLUMNS = 4;
const VIDEO_CLASS = 'videoContainer__video-item';
const container = document.getElementById('videoContainer');
// const container = document.body;

if (HOW_MANY_VIDEOS) {
  let html = '';
  for (let i = 0; i < HOW_MANY_VIDEOS; i++) {
    html += `<div class="${VIDEO_CLASS}"></div>`;
  }
  container.innerHTML = html;
}

const RATIO = 9 / 16;
const LATERAL_PADDING = 0;
const TOP_PADDING = 0;
// const LATERAL_PADDING = 40;
// const TOP_PADDING = 30;
const videoItems = container.querySelectorAll(`.${VIDEO_CLASS}`);


function onResize() {
  const windowWidth = window.innerWidth - (LATERAL_PADDING * 2);
  const windowHeight = window.innerHeight - (TOP_PADDING * 2);
  console.log({
    windowWidth,
    windowHeight
  });
  let areas = [];

  for (let rows = 1; rows <= HOW_MANY_VIDEOS; rows++) {
    const areaRows = SolveForRows(rows, HOW_MANY_VIDEOS, RATIO, windowWidth, windowHeight, MARGIN_RIGHT);
    const areaCols = SolveForColumns(rows, HOW_MANY_VIDEOS, RATIO, windowWidth, windowHeight, MARGIN_RIGHT);
    areas = [...areas, ...areaRows, ...areaCols]
  }

  const maxArea = MaxArea(areas);
  if (maxArea) {
    videoItems.forEach(item => {
      item.style.width = `${maxArea.w}px`;
      item.style.height = `${maxArea.h}px`;
    });
  }
}

window.addEventListener('resize', onResize);

function SolveForRows(rows, count, ratio, viewW, viewH, margin = 0) {
  const solns = [];
  const cols = Math.ceil(count / rows);
  const h = viewH / rows - (rows /*  + 1 */ ) * margin;

  if (h < 0 /*  || cols > MAX_COLUMNS */ ) {
    return solns;
  }

  const w = h / ratio;
  const margins = (cols /*  + 1 */ ) * margin;
  const totalWidth = (w * cols) + margins;
  const isValidSize = totalWidth <= viewW;
  if (isValidSize) {
    const size = new SizeSoln(w, h);
    solns.push(size);
  }

  // console.log(solns);
  return solns;
}

function SolveForColumns( cols, count, minRatio, maxRatio, viewW, viewH, margin) {
  const solns = [];
  const rows = Math.ceil(count / cols);
  const w = viewW / cols - (cols/*  + 1 */) * margin;

  if (w < 0) {
    return solns;
  }

  const h = w * minRatio;
  const margins = (rows/*  + 1 */) * margin;
  const totalHeight = (h * rows) + margins;
  const isValidSize = totalHeight <= viewH;
  if (isValidSize) {
    const size = new SizeSoln(w, h);
    // size.ratio = minRatio;
    // Ignore if too tall for the view
    solns.push(size);
  }
  // });
  return solns;
}

function MaxArea(solns) {
  let result = null;
  solns.forEach((soln) => {
    if (!result) {
      result = soln;
    } else {
      if (soln.area > result.area) {
        result = soln;
      }
    }
  });

  return result;
}


class SizeSoln {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.ratio = w / h;
    this.area = h * w;
  }
}

onResize();