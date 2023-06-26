export function getResizePath(src: string, width: number, height: number) {
  if (!src) return '';
  // 확장자가 heic 면 원본 반환
  if (src.indexOf('.heic') > -1) {
    return src;
  }
  if (!height) {
    return src + `?w=${Math.floor(width)}`;
  }
  return src + `?w=${Math.floor(width)}&h=${Math.floor(height)}`;
}
