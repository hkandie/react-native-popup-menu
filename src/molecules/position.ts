const axisPosition = (oDim: number, wDim: number, tPos: number, tDim: number) => {
  // if options are bigger than window dimension, then render at 0
  if (oDim > wDim) {
    return 0;
  }
  // render at trigger position if possible
  if (tPos + oDim <= wDim) {
    return tPos;
  }
  // aligned to the trigger from the bottom (right)
  if (tPos + tDim - oDim >= 0) {
    return tPos + tDim - oDim;
  }
  // compute center position
  let pos = Math.round(tPos + tDim / 2 - oDim / 2);
  // check top boundary
  if (pos < 0) {
    return 0;
  }
  // check bottom boundary
  if (pos + oDim > wDim) {
    return wDim - oDim;
  }
  // if everything ok, render in center position
  return pos;
};

function fit(pos: number, len: number, minPos: number, maxPos: number) {
  if (pos === undefined) {
    return undefined;
  }
  if (pos + len > maxPos) {
    pos = maxPos - len;
  }
  if (pos < minPos) {
    pos = minPos;
  }
  return pos;
}
// fits options (position) into safeArea
export const fitPositionIntoSafeArea = (
  position: {
    top?: number;
    left?: number;
    right?: number;
  },
  layouts: any
) => {
  const { windowLayout, safeAreaLayout, optionsLayout } = layouts;
  if (!safeAreaLayout) {
    return position;
  }
  const { x: saX, y: saY, height: saHeight, width: saWidth } = safeAreaLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const { width: wWidth } = windowLayout;
  let { top, left, right } = position;
  top = fit(top!, oHeight, saY, saY + saHeight);
  left = fit(left!, oWidth, saX, saX + saWidth);
  right = fit(right!, oWidth, wWidth - saX - saWidth, saX);
  return { top, left, right };
};

export const computePosition = (
  layouts: {
    windowLayout: { x: number; y: number; width: number; height: number };
    triggerLayout: { x: number; y: number; height: number; width: number };
    optionsLayout: { height: number; width: number };
  },
  isRTL?: boolean
) => {
  const { windowLayout, triggerLayout, optionsLayout } = layouts;
  const { x: wX, y: wY, width: wWidth, height: wHeight } = windowLayout;
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const top = axisPosition(oHeight, wHeight, tY - wY, tHeight);
  const left = axisPosition(oWidth, wWidth, tX - wX, tWidth);
  const start = isRTL ? 'right' : 'left';
  const position = { top, [start]: left };
  return fitPositionIntoSafeArea(position, layouts);
};
