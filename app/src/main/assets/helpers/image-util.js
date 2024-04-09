function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */
import Compressor from '../lib/compressor.esm.js';

/* global-module */
class ImageUtil {
  constructor() {
    _defineProperty(this, "__imageCompressor", (source, options) => {
      return new Promise((resolve, reject) => {
        var opt = {
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          convertSize: options.convertSize,
          // 이 용량을 초과하는 이미지는 JPEG 확장자로 변환되며 용량이 90% 수준으로 압축됨.
          quality: options.quality,
          success: function success(compressedImage) {
            resolve(compressedImage);
          },
          error: function error(err) {
            console.error(err);
            reject(err);
          }
        };
        new Compressor(source, opt);
      });
    });
  }
  compressImage(blobFile, options) {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var constantNumber = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : 0.12;
      if (blobFile.size <= options.targetCompressVolume) {
        console.log("skip to compress image : volume (".concat(blobFile.size, " byte)"));
        return blobFile;
      }
      var count = 0;
      var compressedImage;
      var targetCompressionRatio = Math.round(options.targetCompressVolume / blobFile.size * 100) / 100;
      var startQuality = targetCompressionRatio + constantNumber; // 상수값을 더해주는 이유: 과도하게 압축되는 것을 보정하는 수치. (클수록 압축률 떨어지고 이미지 품질은 좋아짐.)
      startQuality = startQuality > 0.8 ? 0.8 : startQuality;
      options.quality = startQuality;
      console.log("target compression ratio: ".concat(options.targetCompressVolume, " / ").concat(blobFile.size, " = ").concat(targetCompressionRatio));
      console.log("calculated start quality: ".concat(startQuality));
      while (!(((_compressedImage = compressedImage) === null || _compressedImage === void 0 ? void 0 : _compressedImage.size) < options.targetCompressVolume)) {
        var _compressedImage;
        count++;
        compressedImage = yield _this.__imageCompressor(blobFile, options);
        console.log("compressed image's info : volume (".concat(compressedImage.size, " byte), quality (").concat(options.quality, ")"));
        var compressionRatio = Math.round((1 - compressedImage.size / blobFile.size) * 10000) / 100;
        console.log("Image Compression Done. #".concat(count, ": ").concat(compressedImage.size, " / ").concat(blobFile.size, " = ").concat(compressionRatio, "%. from ").concat(Math.round(blobFile.size / 1024), "KB to ").concat(Math.round(compressedImage.size / 1024), "KB"));
        options.quality = Math.round((options.quality - 0.1) * 100) / 100;
      }
      return compressedImage;
    })();
  }
}
export default new ImageUtil();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy9pbWFnZS11dGlsLmpzIiwibmFtZXMiOlsiQ29tcHJlc3NvciIsIkltYWdlVXRpbCIsImNvbnN0cnVjdG9yIiwiX2RlZmluZVByb3BlcnR5Iiwic291cmNlIiwib3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib3B0IiwibWF4V2lkdGgiLCJtYXhIZWlnaHQiLCJjb252ZXJ0U2l6ZSIsInF1YWxpdHkiLCJzdWNjZXNzIiwiY29tcHJlc3NlZEltYWdlIiwiZXJyb3IiLCJlcnIiLCJjb25zb2xlIiwiY29tcHJlc3NJbWFnZSIsImJsb2JGaWxlIiwiX2FyZ3VtZW50cyIsImFyZ3VtZW50cyIsIl90aGlzIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJjb25zdGFudE51bWJlciIsImxlbmd0aCIsInVuZGVmaW5lZCIsInNpemUiLCJ0YXJnZXRDb21wcmVzc1ZvbHVtZSIsImxvZyIsImNvbmNhdCIsImNvdW50IiwidGFyZ2V0Q29tcHJlc3Npb25SYXRpbyIsIk1hdGgiLCJyb3VuZCIsInN0YXJ0UXVhbGl0eSIsIl9jb21wcmVzc2VkSW1hZ2UiLCJfX2ltYWdlQ29tcHJlc3NvciIsImNvbXByZXNzaW9uUmF0aW8iXSwic291cmNlcyI6WyJoZWxwZXJzL2ltYWdlLXV0aWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCBDb21wcmVzc29yIGZyb20gJy4uL2xpYi9jb21wcmVzc29yLmVzbS5qcyc7XG5cbi8qIGdsb2JhbC1tb2R1bGUgKi9cbmNsYXNzIEltYWdlVXRpbCB7XG4gIGFzeW5jIGNvbXByZXNzSW1hZ2UoYmxvYkZpbGUsIG9wdGlvbnMsIGNvbnN0YW50TnVtYmVyID0gMC4xMikge1xuICAgIGlmIChibG9iRmlsZS5zaXplIDw9IG9wdGlvbnMudGFyZ2V0Q29tcHJlc3NWb2x1bWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBza2lwIHRvIGNvbXByZXNzIGltYWdlIDogdm9sdW1lICgke2Jsb2JGaWxlLnNpemV9IGJ5dGUpYCk7XG4gICAgICByZXR1cm4gYmxvYkZpbGU7XG4gICAgfVxuXG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBsZXQgY29tcHJlc3NlZEltYWdlO1xuXG4gICAgY29uc3QgdGFyZ2V0Q29tcHJlc3Npb25SYXRpbyA9IE1hdGgucm91bmQoKG9wdGlvbnMudGFyZ2V0Q29tcHJlc3NWb2x1bWUgLyBibG9iRmlsZS5zaXplKSAqIDEwMCkgLyAxMDA7XG4gICAgbGV0IHN0YXJ0UXVhbGl0eSA9IHRhcmdldENvbXByZXNzaW9uUmF0aW8gKyBjb25zdGFudE51bWJlcjsgLy8g7IOB7IiY6rCS7J2EIOuNlO2VtOyjvOuKlCDsnbTsnKA6IOqzvOuPhO2VmOqyjCDslZXstpXrkJjripQg6rKD7J2EIOuztOygle2VmOuKlCDsiJjsuZguICjtgbTsiJjroZ0g7JWV7LaV66WgIOuWqOyWtOyngOqzoCDsnbTrr7jsp4Ag7ZKI7KeI7J2AIOyii+yVhOynkC4pXG4gICAgc3RhcnRRdWFsaXR5ID0gc3RhcnRRdWFsaXR5ID4gMC44ID8gMC44IDogc3RhcnRRdWFsaXR5O1xuICAgIG9wdGlvbnMucXVhbGl0eSA9IHN0YXJ0UXVhbGl0eTtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGB0YXJnZXQgY29tcHJlc3Npb24gcmF0aW86ICR7b3B0aW9ucy50YXJnZXRDb21wcmVzc1ZvbHVtZX0gLyAke2Jsb2JGaWxlLnNpemV9ID0gJHt0YXJnZXRDb21wcmVzc2lvblJhdGlvfWBcbiAgICApO1xuICAgIGNvbnNvbGUubG9nKGBjYWxjdWxhdGVkIHN0YXJ0IHF1YWxpdHk6ICR7c3RhcnRRdWFsaXR5fWApO1xuXG4gICAgd2hpbGUgKCEoY29tcHJlc3NlZEltYWdlPy5zaXplIDwgb3B0aW9ucy50YXJnZXRDb21wcmVzc1ZvbHVtZSkpIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBjb21wcmVzc2VkSW1hZ2UgPSBhd2FpdCB0aGlzLl9faW1hZ2VDb21wcmVzc29yKGJsb2JGaWxlLCBvcHRpb25zKTtcbiAgICAgIGNvbnNvbGUubG9nKGBjb21wcmVzc2VkIGltYWdlJ3MgaW5mbyA6IHZvbHVtZSAoJHtjb21wcmVzc2VkSW1hZ2Uuc2l6ZX0gYnl0ZSksIHF1YWxpdHkgKCR7b3B0aW9ucy5xdWFsaXR5fSlgKTtcbiAgICAgIGNvbnN0IGNvbXByZXNzaW9uUmF0aW8gPSBNYXRoLnJvdW5kKCgxIC0gY29tcHJlc3NlZEltYWdlLnNpemUgLyBibG9iRmlsZS5zaXplKSAqIDEwMDAwKSAvIDEwMDtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgSW1hZ2UgQ29tcHJlc3Npb24gRG9uZS4gIyR7Y291bnR9OiAke2NvbXByZXNzZWRJbWFnZS5zaXplfSAvICR7XG4gICAgICAgICAgYmxvYkZpbGUuc2l6ZVxuICAgICAgICB9ID0gJHtjb21wcmVzc2lvblJhdGlvfSUuIGZyb20gJHtNYXRoLnJvdW5kKGJsb2JGaWxlLnNpemUgLyAxMDI0KX1LQiB0byAke01hdGgucm91bmQoXG4gICAgICAgICAgY29tcHJlc3NlZEltYWdlLnNpemUgLyAxMDI0XG4gICAgICAgICl9S0JgXG4gICAgICApO1xuXG4gICAgICBvcHRpb25zLnF1YWxpdHkgPSBNYXRoLnJvdW5kKChvcHRpb25zLnF1YWxpdHkgLSAwLjEpICogMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcHJlc3NlZEltYWdlO1xuICB9XG5cbiAgX19pbWFnZUNvbXByZXNzb3IgPSAoc291cmNlLCBvcHRpb25zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IG9wdCA9IHtcbiAgICAgICAgbWF4V2lkdGg6IG9wdGlvbnMubWF4V2lkdGgsXG4gICAgICAgIG1heEhlaWdodDogb3B0aW9ucy5tYXhIZWlnaHQsXG4gICAgICAgIGNvbnZlcnRTaXplOiBvcHRpb25zLmNvbnZlcnRTaXplLCAvLyDsnbQg7Jqp65+J7J2EIOy0iOqzvO2VmOuKlCDsnbTrr7jsp4DripQgSlBFRyDtmZXsnqXsnpDroZwg67OA7ZmY65CY66mwIOyaqeufieydtCA5MCUg7IiY7KSA7Jy866GcIOyVley2leuQqC5cbiAgICAgICAgcXVhbGl0eTogb3B0aW9ucy5xdWFsaXR5LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoY29tcHJlc3NlZEltYWdlKSB7XG4gICAgICAgICAgcmVzb2x2ZShjb21wcmVzc2VkSW1hZ2UpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIG5ldyBDb21wcmVzc29yKHNvdXJjZSwgb3B0KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlVXRpbCgpO1xuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsT0FBT0EsVUFBVSxNQUFNLDBCQUEwQjs7QUFFakQ7QUFDQSxNQUFNQyxTQUFTLENBQUM7RUFBQUMsWUFBQTtJQUFBQyxlQUFBLDRCQXNDTSxDQUFDQyxNQUFNLEVBQUVDLE9BQU8sS0FBSztNQUN2QyxPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxPQUFPLEVBQUVDLE1BQU0sS0FBSztRQUN0QyxJQUFNQyxHQUFHLEdBQUc7VUFDVkMsUUFBUSxFQUFFTCxPQUFPLENBQUNLLFFBQVE7VUFDMUJDLFNBQVMsRUFBRU4sT0FBTyxDQUFDTSxTQUFTO1VBQzVCQyxXQUFXLEVBQUVQLE9BQU8sQ0FBQ08sV0FBVztVQUFFO1VBQ2xDQyxPQUFPLEVBQUVSLE9BQU8sQ0FBQ1EsT0FBTztVQUN4QkMsT0FBTyxFQUFFLFNBQUFBLFFBQVVDLGVBQWUsRUFBRTtZQUNsQ1IsT0FBTyxDQUFDUSxlQUFlLENBQUM7VUFDMUIsQ0FBQztVQUNEQyxLQUFLLEVBQUUsU0FBQUEsTUFBVUMsR0FBRyxFQUFFO1lBQ3BCQyxPQUFPLENBQUNGLEtBQUssQ0FBQ0MsR0FBRyxDQUFD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
