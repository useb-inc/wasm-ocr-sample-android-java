function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
import UseBOCR from './ocr.js';
var ocr = new UseBOCR();
var targetOrigin = null;
var messageHandler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (e) {
    try {
      var response = e.data ? e.data : e;
      if (targetOrigin !== e.origin) {
        console.info("[WARNING] origin is replaced : '" + targetOrigin + "' -> '" + e.origin + "'");
        targetOrigin = e.origin;
      }
      console.debug('targetOrigin', targetOrigin);
      if (!response) {
        console.info('[INFO] messageHandler() is skipped, cause : response is undefined');
        return;
      }
      if (response.type === 'webpackOk') {
        console.info('[INFO] messageHandler() is skipped, cause : webpackOk type');
        return;
      }
      console.debug('messageHandler()', response);
      var data;
      if (typeof response === 'string' && response !== 'undefined') {
        try {
          data = JSON.parse(decodeURIComponent(atob(response)));
        } catch (err) {
          console.debug('[WARNING] parameter parsing error');
          throw new Error('parameter format is invalid');
        }
        if (!!!data.settings) {
          throw new Error('settings info is empty');
        }
        if (data.preloading) {
          try {
            ocr.init(data.settings);
            yield ocr.preloading(onPreloaded);
            return;
          } catch (err) {
            console.debug('[WARNING] preloading error');
            throw new Error("preloading error");
          }
        }
        switch (data.ocrType) {
          // OCR
          case 'idcard':
          case 'passport':
          case 'alien':
          case 'alien-back':
          case 'credit':
          // SSA
          case 'idcard-ssa':
          case 'passport-ssa':
          case 'alien-ssa':
            ocr.init(data.settings);
            yield ocr.startOCR(data.ocrType, sendResult, sendResult, onInProgressChange);
            break;
          default:
            new Error('Invalid ocrType');
            break;
        }
      }
    } catch (e) {
      console.error('[usebwasmocr] error', e);
      if (!(e instanceof SyntaxError && e.message.includes('JSON'))) {
        console.error('[usebwasmocr] error code', e.errorCode);
        console.error('[usebwasmocr] error message', e.message);
      }
      sendErrorResult('error', e.message);
    }
  });
  return function messageHandler(_x) {
    return _ref.apply(this, arguments);
  };
}();

//ios
window.addEventListener('message', messageHandler);
//android
document.addEventListener('message', messageHandler);
window.usebwasmocrreceive = messageHandler;
function sendErrorResult(result, errorMessage) {
  sendResult({
    result: 'error',
    error_message: errorMessage
  });
}
function getPlatformInfomation() {
  window.platform.isWebViewIOSReactNative = false;
  window.platform.isWebViewAndroidReactNative = false;
  window.platform.isWebviewIOS = false;
  window.platform.isWebviewAndroid = false;
  window.platform.isWebBrowser = false;
  var agentInfo = window.navigator.userAgent.toLowerCase();
  window.platform.iOS = /iphone|ipod|ipad/.test(agentInfo);
  window.platform.android = /android/i.test(agentInfo);
  window.platform.chromeVer = 0;
  try {
    var chromeVer = parseInt(agentInfo.match(/chrome\/([0-9]*)./)[1]);
    if (!isNaN(chromeVer)) {
      window.platform.chromeVer = chromeVer;
    }
  } catch (e) {
    console.error('getPlatformInfomation() in error : ', e);
  }
  if (window.ReactNativeWebView) {
    // android + react-native cli + webview
    // android + react-native expo + webview
    // iOS + react-native cli + webview
    // iOS + react-native expo + webview
    if (window.platform.iOS) {
      window.platform.isWebViewIOSReactNative = true;
      window.platform.isWebViewAndroidReactNative = false;
    } else {
      window.platform.isWebViewIOSReactNative = false;
      window.platform.isWebViewAndroidReactNative = true;
    }
  } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.usebwasmocr) {
    // iOS + swift + WebView
    window.platform.isWebviewIOS = true;
  } else if (window['usebwasmocr']) {
    // android + webview
    window.platform.isWebviewAndroid = true;
  } else if (window.parent) {
    // web browser + iframe
    window.platform.isWebBrowser = true;
  }
}
window.platform = {};
getPlatformInfomation();
function sendResult(result) {
  console.debug('sendResult', result);
  var returnMessage = btoa(encodeURIComponent(JSON.stringify(result)));
  if (window.platform.isWebViewIOSReactNative || window.platform.isWebViewAndroidReactNative) {
    // android + react-native cli + webview
    // android + react-native expo + webview
    // iOS + react-native cli + webview
    // iOS + react-native expo + webview
    window.ReactNativeWebView.postMessage(returnMessage);
  } else if (window.platform.isWebviewIOS) {
    // iOS + swift + WebView
    window.webkit.messageHandlers.usebwasmocr && window.webkit.messageHandlers.usebwasmocr.postMessage(returnMessage);
  } else if (window.platform.isWebviewAndroid) {
    // android + webview
    window['usebwasmocr'] && window['usebwasmocr']['receive'] && window['usebwasmocr']['receive'](returnMessage);
  } else if (window.platform.isWebBrowser) {
    // web browser + iframe
    window.parent.postMessage(returnMessage, targetOrigin);
  }
}

// function sendResult(result) {
//   console.debug('sendResult', result);
//   const returnMessage = btoa(encodeURIComponent(JSON.stringify(result)));
//   if (window.parent) {
//     // Browser iframe
//     window.parent.postMessage(returnMessage, targetOrigin);
//   }
//
//   if (window.ReactNativeWebView) {
//     // react-native webview
//     window.ReactNativeWebView.postMessage(returnMessage);
//   }
//
//   if (window.webkit && window.webkit.messageHandlers) {
//     // iOS: WKScriptMessageHandler WKScriptMessage name(usebwasmocr)
//     window.webkit.messageHandlers.usebwasmocr && window.webkit.messageHandlers.usebwasmocr.postMessage(returnMessage);
//   } else if (window['usebwasmocr']) {
//     // Android: WebView JavascriptInterface name(usebwasmocr) and JS function(result)
//     window['usebwasmocr'] && window['usebwasmocr']['receive'] && window['usebwasmocr']['receive'](returnMessage);
//   }
// }

function onPreloaded() {
  console.log('ocr-wasm-sdk onPreloaded');
  sendResult({
    result: 'preloaded'
  });
}
function __onInProgressChangeWASM(_x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10) {
  return _onInProgressChangeWASM.apply(this, arguments);
}
function _onInProgressChangeWASM() {
  _onInProgressChangeWASM = _asyncToGenerator(function* (ocrMode, ocrType, inProgress, customUI, uiPosition, useTextMsg, useCaptureUI, usePreviewUI, recognizedImage) {
    var isCreditCard = ocrType.indexOf('credit') > -1;
    var cardTypeString = isCreditCard ? '신용카드' : '신분증';
    var showLoadingUI = false;
    var showCaptureUI = false;

    // customUI
    if (customUI && useTextMsg) {
      var textMsg = '';
      switch (inProgress) {
        case ocr.IN_PROGRESS.NOT_READY:
          showLoadingUI = true;
          textMsg = "".concat(cardTypeString, " \uCD2C\uC601\uC744 \uC704\uD574 \uCE74\uBA54\uB77C\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.READY:
          textMsg = "\uC601\uC5ED \uC548\uC5D0 ".concat(cardTypeString, "\uC774 \uAF49 \uCC28\uB3C4\uB85D \uC704\uCE58\uC2DC\uD0A4\uBA74 \uC790\uB3D9 \uCD2C\uC601\uB429\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.CARD_DETECT_SUCCESS:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uAC10\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC815\uBCF4\uB97C \uC790\uB3D9\uC73C\uB85C \uC778\uC2DD(OCR) \uC911 \uC785\uB2C8\uB2E4.");
          showCaptureUI = true;
          break;
        case ocr.IN_PROGRESS.CARD_DETECT_FAILED:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uAC10\uC9C0\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC601\uC5ED \uC548\uC5D0 ").concat(cardTypeString, "\uC744 \uC704\uCE58\uC2DC\uCF1C \uC8FC\uC138\uC694.");
          break;
        case ocr.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS:
          showLoadingUI = true;
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uCD2C\uC601\uB418\uC5C8\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC815\uBCF4\uB97C \uC778\uC2DD(OCR) \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.MANUAL_CAPTURE_FAILED:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uAC10\uC9C0\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC601\uC5ED \uC548\uC5D0 ").concat(cardTypeString, "\uC744 \uC704\uCE58\uC2DC\uD0A8 \uD6C4 \uCD2C\uC601 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694.");
          break;
        case ocr.IN_PROGRESS.OCR_RECOGNIZED:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uC815\uBCF4\uAC00 \uC790\uB3D9\uC73C\uB85C \uC778\uC2DD(OCR) \uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uC815\uBCF4\uAC00 <br/>\uC790\uB3D9\uC73C\uB85C \uC778\uC2DD(OCR) \uB418\uC5C8\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80\uB97C <br/>\uD310\uBCC4 \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_SUCCESS:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD\uC774 \uC644\uB8CC \uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_SUCCESS_WITH_SSA:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD \uBC0F \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80 \uD310\uBCC4\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_FAILED:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD\uC5D0 \uC2E4\uD328\uD558\uC600\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
          break;
      }
      var loadingUIHTML;
      var textMsgUI, loadingUI;
      textMsgUI = customUI.querySelector("#".concat(uiPosition, "-ui-text-msg"));
      loadingUI = customUI.querySelector("#".concat(uiPosition, "-ui-loading"));
      loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#FFF'));
      if (textMsgUI) {
        textMsgUI.innerHTML = textMsg;
      }
      if (loadingUI) {
        loadingUI.innerHTML = loadingUIHTML;
      }

      // PreviewUI
      if (usePreviewUI) {
        switch (inProgress) {
          case ocr.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uC815\uBCF4 \uC778\uC2DD(OCR) \uC911 ...<br/>");
            break;
          case ocr.IN_PROGRESS.MANUAL_CAPTURE_FAILED:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uAC10\uC9C0 \uC2E4\uD328! \uB2E4\uC2DC \uCD2C\uC601\uD574\uC8FC\uC138\uC694.<br/>(\uC7A0\uC2DC \uD6C4 \uC790\uB3D9\uC73C\uB85C \uC54C\uB9BC\uC774 \uB2EB\uD799\uB2C8\uB2E4.)<br/>");
            break;
          case ocr.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80 \uD310\uBCC4 \uC911...<br/>");
            break;
        }
        if (textMsgUI) textMsgUI.innerHTML = textMsg;
        if (loadingUI) loadingUI.innerHTML = loadingUIHTML;
      }

      // captureUI
      if (useCaptureUI) {
        if (showCaptureUI) {
          ocr.__setStyle(ocr.__captureUIWrap, {
            display: 'flex'
          });
        } else {
          ocr.__setStyle(ocr.__captureUIWrap, {
            display: 'none'
          });
        }
      }
      yield ocr.__sleep(1); // for UI update
    }
  });
  return _onInProgressChangeWASM.apply(this, arguments);
}
function __onInProgressChangeServer(_x11, _x12, _x13, _x14, _x15, _x16, _x17, _x18, _x19) {
  return _onInProgressChangeServer.apply(this, arguments);
}
function _onInProgressChangeServer() {
  _onInProgressChangeServer = _asyncToGenerator(function* (ocrMode, ocrType, inProgress, customUI, uiPosition, useTextMsg, useCaptureUI, usePreviewUI, recognizedImage) {
    var isCreditCard = ocrType.indexOf('credit') > -1;
    var cardTypeString = isCreditCard ? '신용카드' : '신분증';
    var showLoadingUI = false;
    var showCaptureUI = false;

    // customUI
    if (customUI && useTextMsg) {
      var textMsg = '';
      switch (inProgress) {
        case ocr.IN_PROGRESS.NOT_READY:
          showLoadingUI = true;
          textMsg = "".concat(cardTypeString, " \uCD2C\uC601\uC744 \uC704\uD574 \uCE74\uBA54\uB77C\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.READY:
          textMsg = "\uC601\uC5ED \uC548\uC5D0 ".concat(cardTypeString, "\uC774 \uAF49 \uCC28\uB3C4\uB85D \uC704\uCE58\uC2DC\uD0A8 \uD6C4 \uCD2C\uC601 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694.");
          showCaptureUI = true;
          break;
        case ocr.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS:
          showLoadingUI = true;
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uCD2C\uC601\uB418\uC5C8\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC815\uBCF4\uB97C \uC778\uC2DD(OCR) \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.MANUAL_CAPTURE_FAILED:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uAC10\uC9C0\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC601\uC5ED \uC548\uC5D0 ").concat(cardTypeString, "\uC744 \uC704\uCE58\uC2DC\uD0A8 \uD6C4 \uCD2C\uC601 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694.");
          showCaptureUI = true;
          break;
        case ocr.IN_PROGRESS.OCR_RECOGNIZED:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uC815\uBCF4\uAC00 \uC790\uB3D9\uC73C\uB85C \uC778\uC2DD(OCR) \uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA:
          textMsg = "".concat(cardTypeString, "\uC774(\uAC00) \uC815\uBCF4\uAC00 <br/>\uC790\uB3D9\uC73C\uB85C \uC778\uC2DD(OCR) \uB418\uC5C8\uC2B5\uB2C8\uB2E4. <br/>").concat(cardTypeString, " \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80\uB97C <br/>\uD310\uBCC4 \uC911 \uC785\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_SUCCESS:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD\uC774 \uC644\uB8CC \uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_SUCCESS_WITH_SSA:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD \uBC0F \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80 \uD310\uBCC4\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
          break;
        case ocr.IN_PROGRESS.OCR_FAILED:
          textMsg = "".concat(cardTypeString, " \uC778\uC2DD\uC5D0 \uC2E4\uD328\uD558\uC600\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.");
          break;
      }
      var loadingUIHTML;
      var textMsgUI, loadingUI;
      textMsgUI = customUI.querySelector("#".concat(uiPosition, "-ui-text-msg"));
      loadingUI = customUI.querySelector("#".concat(uiPosition, "-ui-loading"));
      loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#FFF'));
      if (textMsgUI) {
        textMsgUI.innerHTML = textMsg;
      }
      if (loadingUI) {
        loadingUI.innerHTML = loadingUIHTML;
      }

      // PreviewUI
      if (usePreviewUI) {
        switch (inProgress) {
          case ocr.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uC815\uBCF4 \uC778\uC2DD(OCR) \uC911 ...<br/>");
            break;
          case ocr.IN_PROGRESS.MANUAL_CAPTURE_FAILED:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uAC10\uC9C0 \uC2E4\uD328! \uB2E4\uC2DC \uCD2C\uC601\uD574\uC8FC\uC138\uC694.<br/>(\uC7A0\uC2DC \uD6C4 \uC790\uB3D9\uC73C\uB85C \uC54C\uB9BC\uC774 \uB2EB\uD799\uB2C8\uB2E4.)<br/>");
            break;
          case ocr.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA:
            textMsgUI = document.getElementById("preview-ui-text-msg");
            loadingUI = document.getElementById("preview-ui-loading");
            loadingUIHTML = "".concat(getLoadingUIHTML(uiPosition, showLoadingUI, '#000'));
            textMsg = "<br/>".concat(cardTypeString, " \uC0AC\uBCF8(\uB3C4\uC6A9) \uC5EC\uBD80 \uD310\uBCC4 \uC911...<br/>");
            break;
        }
        if (textMsgUI) textMsgUI.innerHTML = textMsg;
        if (loadingUI) loadingUI.innerHTML = loadingUIHTML;
      }

      // captureUI
      if (useCaptureUI) {
        if (showCaptureUI) {
          ocr.__setStyle(ocr.__captureUIWrap, {
            display: 'flex'
          });
        } else {
          ocr.__setStyle(ocr.__captureUIWrap, {
            display: 'none'
          });
        }
      }
      yield ocr.__sleep(1); // for UI update
    }
  });
  return _onInProgressChangeServer.apply(this, arguments);
}
function onInProgressChange(_x20, _x21, _x22, _x23, _x24, _x25, _x26, _x27, _x28) {
  return _onInProgressChange.apply(this, arguments);
}
function _onInProgressChange() {
  _onInProgressChange = _asyncToGenerator(function* (ocrMode, ocrType, inProgress, customUI, uiPosition, useTextMsg, useCaptureUI, usePreviewUI, recognizedImage) {
    if (ocrMode === 'wasm') {
      yield __onInProgressChangeWASM.apply(this, arguments);
    } else if (ocrMode === 'server') {
      yield __onInProgressChangeServer.apply(this, arguments);
    } else {
      console.error("invalid ocrMode : ".concat(ocrMode));
      return;
    }
  });
  return _onInProgressChange.apply(this, arguments);
}
function getLoadingUIHTML(uiPosition, showLoadingUI, fillColor) {
  return "" + "<svg xmlns='http://www.w3.org/2000/svg' id='".concat(uiPosition, "-ui-loading' xmlns:xlink='http://www.w3.org/1999/xlink' style='margin: auto; background: none; display: ").concat(showLoadingUI ? 'block' : 'none', "; shape-rendering: auto;' width='32px' height='32px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'>\n") + "  <circle cx='84' cy='50' r='10' fill='".concat(fillColor, "'>\n") + "    <animate attributeName='r' repeatCount='indefinite' dur='0.5555555555555556s' calcMode='spline' keyTimes='0;1' values='10;0' keySplines='0 0.5 0.5 1' begin='0s'></animate>\n" + "    <animate attributeName='fill' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='discrete' keyTimes='0;0.25;0.5;0.75;1' values='#86868600;#86868600;#86868600;#86868600;#86868600' begin='0s'></animate>\n" + "  </circle>" + "  <circle cx='16' cy='50' r='10' fill='".concat(fillColor, "'>\n") + "    <animate attributeName='r' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='0;0;10;10;10' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='0s'></animate>\n" + "    <animate attributeName='cx' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='16;16;16;50;84' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='0s'></animate>\n" + "  </circle>" + "  <circle cx='50' cy='50' r='10' fill='".concat(fillColor, "'>\n") + "    <animate attributeName='r' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='0;0;10;10;10' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-0.5555555555555556s'></animate>\n" + "    <animate attributeName='cx' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='16;16;16;50;84' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-0.5555555555555556s'></animate>\n" + "  </circle>" + "  <circle cx='84' cy='50' r='10' fill='".concat(fillColor, "'>\n") + "    <animate attributeName='r' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='0;0;10;10;10' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-1.1111111111111112s'></animate>\n" + "    <animate attributeName='cx' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='16;16;16;50;84' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-1.1111111111111112s'></animate>\n" + "  </circle>" + "  <circle cx='16' cy='50' r='10' fill='".concat(fillColor, "'>\n") + "    <animate attributeName='r' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='0;0;10;10;10' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-1.6666666666666665s'></animate>\n" + "    <animate attributeName='cx' repeatCount='indefinite' dur='2.2222222222222223s' calcMode='spline' keyTimes='0;0.25;0.5;0.75;1' values='16;16;16;50;84' keySplines='0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1' begin='-1.6666666666666665s'></animate>\n" + "  </circle>\n" + "</svg>";
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlYi1vY3Itd2FzbS1zZGsuanMiLCJuYW1lcyI6WyJVc2VCT0NSIiwib2NyIiwidGFyZ2V0T3JpZ2luIiwibWVzc2FnZUhhbmRsZXIiLCJfcmVmIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJlIiwicmVzcG9uc2UiLCJkYXRhIiwib3JpZ2luIiwiY29uc29sZSIsImluZm8iLCJkZWJ1ZyIsInR5cGUiLCJKU09OIiwicGFyc2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJhdG9iIiwiZXJyIiwiRXJyb3IiLCJzZXR0aW5ncyIsInByZWxvYWRpbmciLCJpbml0Iiwib25QcmVsb2FkZWQiLCJvY3JUeXBlIiwic3RhcnRPQ1IiLCJzZW5kUmVzdWx0Iiwib25JblByb2dyZXNzQ2hhbmdlIiwiZXJyb3IiLCJTeW50YXhFcnJvciIsIm1lc3NhZ2UiLCJpbmNsdWRlcyIsImVycm9yQ29kZSIsInNlbmRFcnJvclJlc3VsdCIsIl94IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJ1c2Vid2FzbW9jcnJlY2VpdmUiLCJyZXN1bHQiLCJlcnJvck1lc3NhZ2UiLCJlcnJvcl9tZXNzYWdlIiwiZ2V0UGxhdGZvcm1JbmZvbWF0aW9uIiwicGxhdGZvcm0iLCJpc1dlYlZpZXdJT1NSZWFjdE5hdGl2ZSIsImlzV2ViVmlld0FuZHJvaWRSZWFjdE5hdGl2ZSIsImlzV2Vidmlld0lPUyIsImlzV2Vidmlld0FuZHJvaWQiLCJpc1dlYkJyb3dzZXIiLCJhZ2VudEluZm8iLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImlPUyIsInRlc3QiLCJhbmRyb2lkIiwiY2hyb21lVmVyIiwicGFyc2VJbnQiLCJtYXRjaCIsImlzTmFOIiwiUmVhY3ROYXRpdmVXZWJWaWV3Iiwid2Via2l0IiwibWVzc2FnZUhhbmRsZXJzIiwidXNlYndhc21vY3IiLCJwYXJlbnQiLCJyZXR1cm5NZXNzYWdlIiwiYnRvYSIsImVuY29kZVVSSUNvbXBvbmVudCIsInN0cmluZ2lmeSIsInBvc3RNZXNzYWdlIiwibG9nIiwiX19vbkluUHJvZ3Jlc3NDaGFuZ2VXQVNNIiwiX3gyIiwiX3gzIiwiX3g0IiwiX3g1IiwiX3g2IiwiX3g3IiwiX3g4IiwiX3g5IiwiX3gxMCIsIl9vbkluUHJvZ3Jlc3NDaGFuZ2VXQVNNIiwib2NyTW9kZSIsImluUHJvZ3Jlc3MiLCJjdXN0b21VSSIsInVpUG9zaXRpb24iLCJ1c2VUZXh0TXNnIiwidXNlQ2FwdHVyZVVJIiwidXNlUHJldmlld1VJIiwicmVjb2duaXplZEltYWdlIiwiaXNDcmVkaXRDYXJkIiwiaW5kZXhPZiIsImNhcmRUeXBlU3RyaW5nIiwic2hvd0xvYWRpbmdVSSIsInNob3dDYXB0dXJlVUkiLCJ0ZXh0TXNnIiwiSU5fUFJPR1JFU1MiLCJOT1RfUkVBRFkiLCJjb25jYXQiLCJSRUFEWSIsIkNBUkRfREVURUNUX1NVQ0NFU1MiLCJDQVJEX0RFVEVDVF9GQUlMRUQiLCJNQU5VQUxfQ0FQVFVSRV9TVUNDRVNTIiwiTUFOVUFMX0NBUFRVUkVfRkFJTEVEIiwiT0NSX1JFQ09HTklaRUQiLCJPQ1JfUkVDT0dOSVpFRF9XSVRIX1NTQSIsIk9DUl9TVUNDRVNTIiwiT0NSX1NVQ0NFU1NfV0lUSF9TU0EiLCJPQ1JfRkFJTEVEIiwibG9hZGluZ1VJSFRNTCIsInRleHRNc2dVSSIsImxvYWRpbmdVSSIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRMb2FkaW5nVUlIVE1MIiwiaW5uZXJIVE1MIiwiZ2V0RWxlbWVudEJ5SWQiLCJfX3NldFN0eWxlIiwiX19jYXB0dXJlVUlXcmFwIiwiZGlzcGxheSIsIl9fc2xlZXAiLCJfX29uSW5Qcm9ncmVzc0NoYW5nZVNlcnZlciIsIl94MTEiLCJfeDEyIiwiX3gxMyIsIl94MTQiLCJfeDE1IiwiX3gxNiIsIl94MTciLCJfeDE4IiwiX3gxOSIsIl9vbkluUHJvZ3Jlc3NDaGFuZ2VTZXJ2ZXIiLCJfeDIwIiwiX3gyMSIsIl94MjIiLCJfeDIzIiwiX3gyNCIsIl94MjUiLCJfeDI2IiwiX3gyNyIsIl94MjgiLCJfb25JblByb2dyZXNzQ2hhbmdlIiwiZmlsbENvbG9yIl0sInNvdXJjZXMiOlsidXNlYi1vY3Itd2FzbS1zZGsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVzZUJPQ1IgZnJvbSAnLi9vY3IuanMnO1xuXG5jb25zdCBvY3IgPSBuZXcgVXNlQk9DUigpO1xubGV0IHRhcmdldE9yaWdpbiA9IG51bGw7XG5cbmNvbnN0IG1lc3NhZ2VIYW5kbGVyID0gYXN5bmMgKGUpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGUuZGF0YSA/IGUuZGF0YSA6IGU7XG5cbiAgICBpZiAodGFyZ2V0T3JpZ2luICE9PSBlLm9yaWdpbikge1xuICAgICAgY29uc29sZS5pbmZvKFwiW1dBUk5JTkddIG9yaWdpbiBpcyByZXBsYWNlZCA6ICdcIiArIHRhcmdldE9yaWdpbiArIFwiJyAtPiAnXCIgKyBlLm9yaWdpbiArIFwiJ1wiKTtcbiAgICAgIHRhcmdldE9yaWdpbiA9IGUub3JpZ2luO1xuICAgIH1cbiAgICBjb25zb2xlLmRlYnVnKCd0YXJnZXRPcmlnaW4nLCB0YXJnZXRPcmlnaW4pO1xuXG4gICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5pbmZvKCdbSU5GT10gbWVzc2FnZUhhbmRsZXIoKSBpcyBza2lwcGVkLCBjYXVzZSA6IHJlc3BvbnNlIGlzIHVuZGVmaW5lZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChyZXNwb25zZS50eXBlID09PSAnd2VicGFja09rJykge1xuICAgICAgY29uc29sZS5pbmZvKCdbSU5GT10gbWVzc2FnZUhhbmRsZXIoKSBpcyBza2lwcGVkLCBjYXVzZSA6IHdlYnBhY2tPayB0eXBlJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5kZWJ1ZygnbWVzc2FnZUhhbmRsZXIoKScsIHJlc3BvbnNlKTtcblxuICAgIGxldCBkYXRhO1xuXG4gICAgaWYgKHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycgJiYgcmVzcG9uc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoYXRvYihyZXNwb25zZSkpKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdbV0FSTklOR10gcGFyYW1ldGVyIHBhcnNpbmcgZXJyb3InKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJhbWV0ZXIgZm9ybWF0IGlzIGludmFsaWQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEhIWRhdGEuc2V0dGluZ3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXR0aW5ncyBpbmZvIGlzIGVtcHR5Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLnByZWxvYWRpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBvY3IuaW5pdChkYXRhLnNldHRpbmdzKTtcbiAgICAgICAgICBhd2FpdCBvY3IucHJlbG9hZGluZyhvblByZWxvYWRlZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCdbV0FSTklOR10gcHJlbG9hZGluZyBlcnJvcicpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcHJlbG9hZGluZyBlcnJvcmApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoZGF0YS5vY3JUeXBlKSB7XG4gICAgICAgIC8vIE9DUlxuICAgICAgICBjYXNlICdpZGNhcmQnOlxuICAgICAgICBjYXNlICdwYXNzcG9ydCc6XG4gICAgICAgIGNhc2UgJ2FsaWVuJzpcbiAgICAgICAgY2FzZSAnYWxpZW4tYmFjayc6XG4gICAgICAgIGNhc2UgJ2NyZWRpdCc6XG4gICAgICAgIC8vIFNTQVxuICAgICAgICBjYXNlICdpZGNhcmQtc3NhJzpcbiAgICAgICAgY2FzZSAncGFzc3BvcnQtc3NhJzpcbiAgICAgICAgY2FzZSAnYWxpZW4tc3NhJzpcbiAgICAgICAgICBvY3IuaW5pdChkYXRhLnNldHRpbmdzKTtcbiAgICAgICAgICBhd2FpdCBvY3Iuc3RhcnRPQ1IoZGF0YS5vY3JUeXBlLCBzZW5kUmVzdWx0LCBzZW5kUmVzdWx0LCBvbkluUHJvZ3Jlc3NDaGFuZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG5ldyBFcnJvcignSW52YWxpZCBvY3JUeXBlJyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignW3VzZWJ3YXNtb2NyXSBlcnJvcicsIGUpO1xuICAgIGlmICghKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvciAmJiBlLm1lc3NhZ2UuaW5jbHVkZXMoJ0pTT04nKSkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1t1c2Vid2FzbW9jcl0gZXJyb3IgY29kZScsIGUuZXJyb3JDb2RlKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1t1c2Vid2FzbW9jcl0gZXJyb3IgbWVzc2FnZScsIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIHNlbmRFcnJvclJlc3VsdCgnZXJyb3InLCBlLm1lc3NhZ2UpO1xuICB9XG59O1xuXG4vL2lvc1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBtZXNzYWdlSGFuZGxlcik7XG4vL2FuZHJvaWRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBtZXNzYWdlSGFuZGxlcik7XG53aW5kb3cudXNlYndhc21vY3JyZWNlaXZlID0gbWVzc2FnZUhhbmRsZXI7XG5cbmZ1bmN0aW9uIHNlbmRFcnJvclJlc3VsdChyZXN1bHQsIGVycm9yTWVzc2FnZSkge1xuICBzZW5kUmVzdWx0KHtcbiAgICByZXN1bHQ6ICdlcnJvcicsXG4gICAgZXJyb3JfbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGxhdGZvcm1JbmZvbWF0aW9uKCkge1xuICB3aW5kb3cucGxhdGZvcm0uaXNXZWJWaWV3SU9TUmVhY3ROYXRpdmUgPSBmYWxzZTtcbiAgd2luZG93LnBsYXRmb3JtLmlzV2ViVmlld0FuZHJvaWRSZWFjdE5hdGl2ZSA9IGZhbHNlO1xuICB3aW5kb3cucGxhdGZvcm0uaXNXZWJ2aWV3SU9TID0gZmFsc2U7XG4gIHdpbmRvdy5wbGF0Zm9ybS5pc1dlYnZpZXdBbmRyb2lkID0gZmFsc2U7XG4gIHdpbmRvdy5wbGF0Zm9ybS5pc1dlYkJyb3dzZXIgPSBmYWxzZTtcblxuICBjb25zdCBhZ2VudEluZm8gPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICB3aW5kb3cucGxhdGZvcm0uaU9TID0gL2lwaG9uZXxpcG9kfGlwYWQvLnRlc3QoYWdlbnRJbmZvKTtcbiAgd2luZG93LnBsYXRmb3JtLmFuZHJvaWQgPSAvYW5kcm9pZC9pLnRlc3QoYWdlbnRJbmZvKTtcblxuICB3aW5kb3cucGxhdGZvcm0uY2hyb21lVmVyID0gMDtcbiAgdHJ5IHtcbiAgICBjb25zdCBjaHJvbWVWZXIgPSBwYXJzZUludChhZ2VudEluZm8ubWF0Y2goL2Nocm9tZVxcLyhbMC05XSopLi8pWzFdKTtcbiAgICBpZiAoIWlzTmFOKGNocm9tZVZlcikpIHtcbiAgICAgIHdpbmRvdy5wbGF0Zm9ybS5jaHJvbWVWZXIgPSBjaHJvbWVWZXI7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcignZ2V0UGxhdGZvcm1JbmZvbWF0aW9uKCkgaW4gZXJyb3IgOiAnLCBlKTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuUmVhY3ROYXRpdmVXZWJWaWV3KSB7XG4gICAgLy8gYW5kcm9pZCArIHJlYWN0LW5hdGl2ZSBjbGkgKyB3ZWJ2aWV3XG4gICAgLy8gYW5kcm9pZCArIHJlYWN0LW5hdGl2ZSBleHBvICsgd2Vidmlld1xuICAgIC8vIGlPUyArIHJlYWN0LW5hdGl2ZSBjbGkgKyB3ZWJ2aWV3XG4gICAgLy8gaU9TICsgcmVhY3QtbmF0aXZlIGV4cG8gKyB3ZWJ2aWV3XG4gICAgaWYgKHdpbmRvdy5wbGF0Zm9ybS5pT1MpIHtcbiAgICAgIHdpbmRvdy5wbGF0Zm9ybS5pc1dlYlZpZXdJT1NSZWFjdE5hdGl2ZSA9IHRydWU7XG4gICAgICB3aW5kb3cucGxhdGZvcm0uaXNXZWJWaWV3QW5kcm9pZFJlYWN0TmF0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5wbGF0Zm9ybS5pc1dlYlZpZXdJT1NSZWFjdE5hdGl2ZSA9IGZhbHNlO1xuICAgICAgd2luZG93LnBsYXRmb3JtLmlzV2ViVmlld0FuZHJvaWRSZWFjdE5hdGl2ZSA9IHRydWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKHdpbmRvdy53ZWJraXQgJiYgd2luZG93LndlYmtpdC5tZXNzYWdlSGFuZGxlcnMgJiYgd2luZG93LndlYmtpdC5tZXNzYWdlSGFuZGxlcnMudXNlYndhc21vY3IpIHtcbiAgICAvLyBpT1MgKyBzd2lmdCArIFdlYlZpZXdcbiAgICB3aW5kb3cucGxhdGZvcm0uaXNXZWJ2aWV3SU9TID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh3aW5kb3dbJ3VzZWJ3YXNtb2NyJ10pIHtcbiAgICAvLyBhbmRyb2lkICsgd2Vidmlld1xuICAgIHdpbmRvdy5wbGF0Zm9ybS5pc1dlYnZpZXdBbmRyb2lkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICh3aW5kb3cucGFyZW50KSB7XG4gICAgLy8gd2ViIGJyb3dzZXIgKyBpZnJhbWVcbiAgICB3aW5kb3cucGxhdGZvcm0uaXNXZWJCcm93c2VyID0gdHJ1ZTtcbiAgfVxufVxuXG53aW5kb3cucGxhdGZvcm0gPSB7fTtcbmdldFBsYXRmb3JtSW5mb21hdGlvbigpO1xuXG5mdW5jdGlvbiBzZW5kUmVzdWx0KHJlc3VsdCkge1xuICBjb25zb2xlLmRlYnVnKCdzZW5kUmVzdWx0JywgcmVzdWx0KTtcbiAgY29uc3QgcmV0dXJuTWVzc2FnZSA9IGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpKTtcbiAgaWYgKHdpbmRvdy5wbGF0Zm9ybS5pc1dlYlZpZXdJT1NSZWFjdE5hdGl2ZSB8fCB3aW5kb3cucGxhdGZvcm0uaXNXZWJWaWV3QW5kcm9pZFJlYWN0TmF0aXZlKSB7XG4gICAgLy8gYW5kcm9pZCArIHJlYWN0LW5hdGl2ZSBjbGkgKyB3ZWJ2aWV3XG4gICAgLy8gYW5kcm9pZCArIHJlYWN0LW5hdGl2ZSBleHBvICsgd2Vidmlld1xuICAgIC8vIGlPUyArIHJlYWN0LW5hdGl2ZSBjbGkgKyB3ZWJ2aWV3XG4gICAgLy8gaU9TICsgcmVhY3QtbmF0aXZlIGV4cG8gKyB3ZWJ2aWV3XG4gICAgd2luZG93LlJlYWN0TmF0aXZlV2ViVmlldy5wb3N0TWVzc2FnZShyZXR1cm5NZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW5kb3cucGxhdGZvcm0uaXNXZWJ2aWV3SU9TKSB7XG4gICAgLy8gaU9TICsgc3dpZnQgKyBXZWJWaWV3XG4gICAgd2luZG93LndlYmtpdC5tZXNzYWdlSGFuZGxlcnMudXNlYndhc21vY3IgJiYgd2luZG93LndlYmtpdC5tZXNzYWdlSGFuZGxlcnMudXNlYndhc21vY3IucG9zdE1lc3NhZ2UocmV0dXJuTWVzc2FnZSk7XG4gIH0gZWxzZSBpZiAod2luZG93LnBsYXRmb3JtLmlzV2Vidmlld0FuZHJvaWQpIHtcbiAgICAvLyBhbmRyb2lkICsgd2Vidmlld1xuICAgIHdpbmRvd1sndXNlYndhc21vY3InXSAmJiB3aW5kb3dbJ3VzZWJ3YXNtb2NyJ11bJ3JlY2VpdmUnXSAmJiB3aW5kb3dbJ3VzZWJ3YXNtb2NyJ11bJ3JlY2VpdmUnXShyZXR1cm5NZXNzYWdlKTtcbiAgfSBlbHNlIGlmICh3aW5kb3cucGxhdGZvcm0uaXNXZWJCcm93c2VyKSB7XG4gICAgLy8gd2ViIGJyb3dzZXIgKyBpZnJhbWVcbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHJldHVybk1lc3NhZ2UsIHRhcmdldE9yaWdpbik7XG4gIH1cbn1cblxuLy8gZnVuY3Rpb24gc2VuZFJlc3VsdChyZXN1bHQpIHtcbi8vICAgY29uc29sZS5kZWJ1Zygnc2VuZFJlc3VsdCcsIHJlc3VsdCk7XG4vLyAgIGNvbnN0IHJldHVybk1lc3NhZ2UgPSBidG9hKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShyZXN1bHQpKSk7XG4vLyAgIGlmICh3aW5kb3cucGFyZW50KSB7XG4vLyAgICAgLy8gQnJvd3NlciBpZnJhbWVcbi8vICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHJldHVybk1lc3NhZ2UsIHRhcmdldE9yaWdpbik7XG4vLyAgIH1cbi8vXG4vLyAgIGlmICh3aW5kb3cuUmVhY3ROYXRpdmVXZWJWaWV3KSB7XG4vLyAgICAgLy8gcmVhY3QtbmF0aXZlIHdlYnZpZXdcbi8vICAgICB3aW5kb3cuUmVhY3ROYXRpdmVXZWJWaWV3LnBvc3RNZXNzYWdlKHJldHVybk1lc3NhZ2UpO1xuLy8gICB9XG4vL1xuLy8gICBpZiAod2luZG93LndlYmtpdCAmJiB3aW5kb3cud2Via2l0Lm1lc3NhZ2VIYW5kbGVycykge1xuLy8gICAgIC8vIGlPUzogV0tTY3JpcHRNZXNzYWdlSGFuZGxlciBXS1NjcmlwdE1lc3NhZ2UgbmFtZSh1c2Vid2FzbW9jcilcbi8vICAgICB3aW5kb3cud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy51c2Vid2FzbW9jciAmJiB3aW5kb3cud2Via2l0Lm1lc3NhZ2VIYW5kbGVycy51c2Vid2FzbW9jci5wb3N0TWVzc2FnZShyZXR1cm5NZXNzYWdlKTtcbi8vICAgfSBlbHNlIGlmICh3aW5kb3dbJ3VzZWJ3YXNtb2NyJ10pIHtcbi8vICAgICAvLyBBbmRyb2lkOiBXZWJWaWV3IEphdmFzY3JpcHRJbnRlcmZhY2UgbmFtZSh1c2Vid2FzbW9jcikgYW5kIEpTIGZ1bmN0aW9uKHJlc3VsdClcbi8vICAgICB3aW5kb3dbJ3VzZWJ3YXNtb2NyJ10gJiYgd2luZG93Wyd1c2Vid2FzbW9jciddWydyZWNlaXZlJ10gJiYgd2luZG93Wyd1c2Vid2FzbW9jciddWydyZWNlaXZlJ10ocmV0dXJuTWVzc2FnZSk7XG4vLyAgIH1cbi8vIH1cblxuZnVuY3Rpb24gb25QcmVsb2FkZWQoKSB7XG4gIGNvbnNvbGUubG9nKCdvY3Itd2FzbS1zZGsgb25QcmVsb2FkZWQnKTtcbiAgc2VuZFJlc3VsdCh7IHJlc3VsdDogJ3ByZWxvYWRlZCcgfSk7XG59XG5hc3luYyBmdW5jdGlvbiBfX29uSW5Qcm9ncmVzc0NoYW5nZVdBU00oXG4gIG9jck1vZGUsXG4gIG9jclR5cGUsXG4gIGluUHJvZ3Jlc3MsXG4gIGN1c3RvbVVJLFxuICB1aVBvc2l0aW9uLFxuICB1c2VUZXh0TXNnLFxuICB1c2VDYXB0dXJlVUksXG4gIHVzZVByZXZpZXdVSSxcbiAgcmVjb2duaXplZEltYWdlXG4pIHtcbiAgY29uc3QgaXNDcmVkaXRDYXJkID0gb2NyVHlwZS5pbmRleE9mKCdjcmVkaXQnKSA+IC0xO1xuICBjb25zdCBjYXJkVHlwZVN0cmluZyA9IGlzQ3JlZGl0Q2FyZCA/ICfsi6DsmqnsubTrk5wnIDogJ+yLoOu2hOymnSc7XG4gIGxldCBzaG93TG9hZGluZ1VJID0gZmFsc2U7XG4gIGxldCBzaG93Q2FwdHVyZVVJID0gZmFsc2U7XG5cbiAgLy8gY3VzdG9tVUlcbiAgaWYgKGN1c3RvbVVJICYmIHVzZVRleHRNc2cpIHtcbiAgICBsZXQgdGV4dE1zZyA9ICcnO1xuICAgIHN3aXRjaCAoaW5Qcm9ncmVzcykge1xuICAgICAgY2FzZSBvY3IuSU5fUFJPR1JFU1MuTk9UX1JFQURZOlxuICAgICAgICBzaG93TG9hZGluZ1VJID0gdHJ1ZTtcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfSDstKzsmIHsnYQg7JyE7ZW0IOy5tOuplOudvOulvCDrtojrn6zsmKTripQg7KSRIOyeheuLiOuLpC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLlJFQURZOlxuICAgICAgICB0ZXh0TXNnID0gYOyYgeyXrSDslYjsl5AgJHtjYXJkVHlwZVN0cmluZ33snbQg6r2JIOywqOuPhOuhnSDsnITsuZjsi5ztgqTrqbQg7J6Q64+ZIOy0rOyYgeuQqeuLiOuLpC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLkNBUkRfREVURUNUX1NVQ0NFU1M6XG4gICAgICAgIHRleHRNc2cgPSBgJHtjYXJkVHlwZVN0cmluZ33snbQo6rCAKSDqsJDsp4DrkJjsl4jsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7KCV67O066W8IOyekOuPmeycvOuhnCDsnbjsi50oT0NSKSDspJEg7J6F64uI64ukLmA7XG4gICAgICAgIHNob3dDYXB0dXJlVUkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLkNBUkRfREVURUNUX0ZBSUxFRDpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfeydtCjqsIApIOqwkOyngOuQmOyngCDslYrsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7JiB7JetIOyViOyXkCAke2NhcmRUeXBlU3RyaW5nfeydhCDsnITsuZjsi5zsvJwg7KO87IS47JqULmA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvY3IuSU5fUFJPR1JFU1MuTUFOVUFMX0NBUFRVUkVfU1VDQ0VTUzpcbiAgICAgICAgc2hvd0xvYWRpbmdVSSA9IHRydWU7XG4gICAgICAgIHRleHRNc2cgPSBgJHtjYXJkVHlwZVN0cmluZ33snbQo6rCAKSDstKzsmIHrkJjsl4jsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7KCV67O066W8IOyduOyLnShPQ1IpIOykkSDsnoXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5NQU5VQUxfQ0FQVFVSRV9GQUlMRUQ6XG4gICAgICAgIHRleHRNc2cgPSBgJHtjYXJkVHlwZVN0cmluZ33snbQo6rCAKSDqsJDsp4DrkJjsp4Ag7JWK7Iq164uI64ukLiA8YnIvPiR7Y2FyZFR5cGVTdHJpbmd9IOyYgeyXrSDslYjsl5AgJHtjYXJkVHlwZVN0cmluZ33snYQg7JyE7LmY7Iuc7YKoIO2bhCDstKzsmIEg67KE7Yq87J2EIOuIjOufrOyjvOyEuOyalC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9SRUNPR05JWkVEOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd97J20KOqwgCkg7KCV67O06rCAIOyekOuPmeycvOuhnCDsnbjsi50oT0NSKSDrkJjsl4jsirXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfUkVDT0dOSVpFRF9XSVRIX1NTQTpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfeydtCjqsIApIOygleuztOqwgCA8YnIvPuyekOuPmeycvOuhnCDsnbjsi50oT0NSKSDrkJjsl4jsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7IKs67O4KOuPhOyaqSkg7Jes67aA66W8IDxici8+7YyQ67OEIOykkSDsnoXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfU1VDQ0VTUzpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfSDsnbjsi53snbQg7JmE66OMIOuQmOyXiOyKteuLiOuLpC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9TVUNDRVNTX1dJVEhfU1NBOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd9IOyduOyLnSDrsI8g7IKs67O4KOuPhOyaqSkg7Jes67aAIO2MkOuzhOydtCDsmYTro4zrkJjsl4jsirXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfRkFJTEVEOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd9IOyduOyLneyXkCDsi6TtjKjtlZjsmIDsirXri4jri6QuIOuLpOyLnCDsi5zrj4TtlbTso7zshLjsmpQuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbGV0IGxvYWRpbmdVSUhUTUw7XG4gICAgbGV0IHRleHRNc2dVSSwgbG9hZGluZ1VJO1xuXG4gICAgdGV4dE1zZ1VJID0gY3VzdG9tVUkucXVlcnlTZWxlY3RvcihgIyR7dWlQb3NpdGlvbn0tdWktdGV4dC1tc2dgKTtcbiAgICBsb2FkaW5nVUkgPSBjdXN0b21VSS5xdWVyeVNlbGVjdG9yKGAjJHt1aVBvc2l0aW9ufS11aS1sb2FkaW5nYCk7XG4gICAgbG9hZGluZ1VJSFRNTCA9IGAke2dldExvYWRpbmdVSUhUTUwodWlQb3NpdGlvbiwgc2hvd0xvYWRpbmdVSSwgJyNGRkYnKX1gO1xuXG4gICAgaWYgKHRleHRNc2dVSSkge1xuICAgICAgdGV4dE1zZ1VJLmlubmVySFRNTCA9IHRleHRNc2c7XG4gICAgfVxuXG4gICAgaWYgKGxvYWRpbmdVSSkge1xuICAgICAgbG9hZGluZ1VJLmlubmVySFRNTCA9IGxvYWRpbmdVSUhUTUw7XG4gICAgfVxuXG4gICAgLy8gUHJldmlld1VJXG4gICAgaWYgKHVzZVByZXZpZXdVSSkge1xuICAgICAgc3dpdGNoIChpblByb2dyZXNzKSB7XG4gICAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX1NVQ0NFU1M6XG4gICAgICAgICAgdGV4dE1zZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktdGV4dC1tc2dgKTtcbiAgICAgICAgICBsb2FkaW5nVUkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgcHJldmlldy11aS1sb2FkaW5nYCk7XG4gICAgICAgICAgbG9hZGluZ1VJSFRNTCA9IGAke2dldExvYWRpbmdVSUhUTUwodWlQb3NpdGlvbiwgc2hvd0xvYWRpbmdVSSwgJyMwMDAnKX1gO1xuICAgICAgICAgIHRleHRNc2cgPSBgPGJyLz4ke2NhcmRUeXBlU3RyaW5nfSDsoJXrs7Qg7J247IudKE9DUikg7KSRIC4uLjxici8+YDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBvY3IuSU5fUFJPR1JFU1MuTUFOVUFMX0NBUFRVUkVfRkFJTEVEOlxuICAgICAgICAgIHRleHRNc2dVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBwcmV2aWV3LXVpLXRleHQtbXNnYCk7XG4gICAgICAgICAgbG9hZGluZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktbG9hZGluZ2ApO1xuICAgICAgICAgIGxvYWRpbmdVSUhUTUwgPSBgJHtnZXRMb2FkaW5nVUlIVE1MKHVpUG9zaXRpb24sIHNob3dMb2FkaW5nVUksICcjMDAwJyl9YDtcbiAgICAgICAgICB0ZXh0TXNnID0gYDxici8+JHtjYXJkVHlwZVN0cmluZ30g6rCQ7KeAIOyLpO2MqCEg64uk7IucIOy0rOyYge2VtOyjvOyEuOyalC48YnIvPijsnqDsi5wg7ZuEIOyekOuPmeycvOuhnCDslYzrprzsnbQg64ur7Z6Z64uI64ukLik8YnIvPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9SRUNPR05JWkVEX1dJVEhfU1NBOlxuICAgICAgICAgIHRleHRNc2dVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBwcmV2aWV3LXVpLXRleHQtbXNnYCk7XG4gICAgICAgICAgbG9hZGluZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktbG9hZGluZ2ApO1xuICAgICAgICAgIGxvYWRpbmdVSUhUTUwgPSBgJHtnZXRMb2FkaW5nVUlIVE1MKHVpUG9zaXRpb24sIHNob3dMb2FkaW5nVUksICcjMDAwJyl9YDtcbiAgICAgICAgICB0ZXh0TXNnID0gYDxici8+JHtjYXJkVHlwZVN0cmluZ30g7IKs67O4KOuPhOyaqSkg7Jes67aAIO2MkOuzhCDspJEuLi48YnIvPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXh0TXNnVUkpIHRleHRNc2dVSS5pbm5lckhUTUwgPSB0ZXh0TXNnO1xuICAgICAgaWYgKGxvYWRpbmdVSSkgbG9hZGluZ1VJLmlubmVySFRNTCA9IGxvYWRpbmdVSUhUTUw7XG4gICAgfVxuXG4gICAgLy8gY2FwdHVyZVVJXG4gICAgaWYgKHVzZUNhcHR1cmVVSSkge1xuICAgICAgaWYgKHNob3dDYXB0dXJlVUkpIHtcbiAgICAgICAgb2NyLl9fc2V0U3R5bGUob2NyLl9fY2FwdHVyZVVJV3JhcCwgeyBkaXNwbGF5OiAnZmxleCcgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvY3IuX19zZXRTdHlsZShvY3IuX19jYXB0dXJlVUlXcmFwLCB7IGRpc3BsYXk6ICdub25lJyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBvY3IuX19zbGVlcCgxKTsgLy8gZm9yIFVJIHVwZGF0ZVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIF9fb25JblByb2dyZXNzQ2hhbmdlU2VydmVyKFxuICBvY3JNb2RlLFxuICBvY3JUeXBlLFxuICBpblByb2dyZXNzLFxuICBjdXN0b21VSSxcbiAgdWlQb3NpdGlvbixcbiAgdXNlVGV4dE1zZyxcbiAgdXNlQ2FwdHVyZVVJLFxuICB1c2VQcmV2aWV3VUksXG4gIHJlY29nbml6ZWRJbWFnZVxuKSB7XG4gIGNvbnN0IGlzQ3JlZGl0Q2FyZCA9IG9jclR5cGUuaW5kZXhPZignY3JlZGl0JykgPiAtMTtcbiAgY29uc3QgY2FyZFR5cGVTdHJpbmcgPSBpc0NyZWRpdENhcmQgPyAn7Iug7Jqp7Lm065OcJyA6ICfsi6DrtoTspp0nO1xuICBsZXQgc2hvd0xvYWRpbmdVSSA9IGZhbHNlO1xuICBsZXQgc2hvd0NhcHR1cmVVSSA9IGZhbHNlO1xuXG4gIC8vIGN1c3RvbVVJXG4gIGlmIChjdXN0b21VSSAmJiB1c2VUZXh0TXNnKSB7XG4gICAgbGV0IHRleHRNc2cgPSAnJztcbiAgICBzd2l0Y2ggKGluUHJvZ3Jlc3MpIHtcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk5PVF9SRUFEWTpcbiAgICAgICAgc2hvd0xvYWRpbmdVSSA9IHRydWU7XG4gICAgICAgIHRleHRNc2cgPSBgJHtjYXJkVHlwZVN0cmluZ30g7LSs7JiB7J2EIOychO2VtCDsubTrqZTrnbzrpbwg67aI65+s7Jik64qUIOykkSDsnoXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5SRUFEWTpcbiAgICAgICAgdGV4dE1zZyA9IGDsmIHsl60g7JWI7JeQICR7Y2FyZFR5cGVTdHJpbmd97J20IOq9iSDssKjrj4TroZ0g7JyE7LmY7Iuc7YKoIO2bhCDstKzsmIEg67KE7Yq87J2EIOuIjOufrOyjvOyEuOyalC5gO1xuICAgICAgICBzaG93Q2FwdHVyZVVJID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5NQU5VQUxfQ0FQVFVSRV9TVUNDRVNTOlxuICAgICAgICBzaG93TG9hZGluZ1VJID0gdHJ1ZTtcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfeydtCjqsIApIOy0rOyYgeuQmOyXiOyKteuLiOuLpC4gPGJyLz4ke2NhcmRUeXBlU3RyaW5nfSDsoJXrs7Trpbwg7J247IudKE9DUikg7KSRIOyeheuLiOuLpC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX0ZBSUxFRDpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfeydtCjqsIApIOqwkOyngOuQmOyngCDslYrsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7JiB7JetIOyViOyXkCAke2NhcmRUeXBlU3RyaW5nfeydhCDsnITsuZjsi5ztgqgg7ZuEIOy0rOyYgSDrsoTtirzsnYQg64iM65+s7KO87IS47JqULmA7XG4gICAgICAgIHNob3dDYXB0dXJlVUkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9SRUNPR05JWkVEOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd97J20KOqwgCkg7KCV67O06rCAIOyekOuPmeycvOuhnCDsnbjsi50oT0NSKSDrkJjsl4jsirXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfUkVDT0dOSVpFRF9XSVRIX1NTQTpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfeydtCjqsIApIOygleuztOqwgCA8YnIvPuyekOuPmeycvOuhnCDsnbjsi50oT0NSKSDrkJjsl4jsirXri4jri6QuIDxici8+JHtjYXJkVHlwZVN0cmluZ30g7IKs67O4KOuPhOyaqSkg7Jes67aA66W8IDxici8+7YyQ67OEIOykkSDsnoXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfU1VDQ0VTUzpcbiAgICAgICAgdGV4dE1zZyA9IGAke2NhcmRUeXBlU3RyaW5nfSDsnbjsi53snbQg7JmE66OMIOuQmOyXiOyKteuLiOuLpC5gO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9TVUNDRVNTX1dJVEhfU1NBOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd9IOyduOyLnSDrsI8g7IKs67O4KOuPhOyaqSkg7Jes67aAIO2MkOuzhOydtCDsmYTro4zrkJjsl4jsirXri4jri6QuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG9jci5JTl9QUk9HUkVTUy5PQ1JfRkFJTEVEOlxuICAgICAgICB0ZXh0TXNnID0gYCR7Y2FyZFR5cGVTdHJpbmd9IOyduOyLneyXkCDsi6TtjKjtlZjsmIDsirXri4jri6QuIOuLpOyLnCDsi5zrj4TtlbTso7zshLjsmpQuYDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbGV0IGxvYWRpbmdVSUhUTUw7XG4gICAgbGV0IHRleHRNc2dVSSwgbG9hZGluZ1VJO1xuXG4gICAgdGV4dE1zZ1VJID0gY3VzdG9tVUkucXVlcnlTZWxlY3RvcihgIyR7dWlQb3NpdGlvbn0tdWktdGV4dC1tc2dgKTtcbiAgICBsb2FkaW5nVUkgPSBjdXN0b21VSS5xdWVyeVNlbGVjdG9yKGAjJHt1aVBvc2l0aW9ufS11aS1sb2FkaW5nYCk7XG4gICAgbG9hZGluZ1VJSFRNTCA9IGAke2dldExvYWRpbmdVSUhUTUwodWlQb3NpdGlvbiwgc2hvd0xvYWRpbmdVSSwgJyNGRkYnKX1gO1xuXG4gICAgaWYgKHRleHRNc2dVSSkge1xuICAgICAgdGV4dE1zZ1VJLmlubmVySFRNTCA9IHRleHRNc2c7XG4gICAgfVxuXG4gICAgaWYgKGxvYWRpbmdVSSkge1xuICAgICAgbG9hZGluZ1VJLmlubmVySFRNTCA9IGxvYWRpbmdVSUhUTUw7XG4gICAgfVxuXG4gICAgLy8gUHJldmlld1VJXG4gICAgaWYgKHVzZVByZXZpZXdVSSkge1xuICAgICAgc3dpdGNoIChpblByb2dyZXNzKSB7XG4gICAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX1NVQ0NFU1M6XG4gICAgICAgICAgdGV4dE1zZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktdGV4dC1tc2dgKTtcbiAgICAgICAgICBsb2FkaW5nVUkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgcHJldmlldy11aS1sb2FkaW5nYCk7XG4gICAgICAgICAgbG9hZGluZ1VJSFRNTCA9IGAke2dldExvYWRpbmdVSUhUTUwodWlQb3NpdGlvbiwgc2hvd0xvYWRpbmdVSSwgJyMwMDAnKX1gO1xuICAgICAgICAgIHRleHRNc2cgPSBgPGJyLz4ke2NhcmRUeXBlU3RyaW5nfSDsoJXrs7Qg7J247IudKE9DUikg7KSRIC4uLjxici8+YDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBvY3IuSU5fUFJPR1JFU1MuTUFOVUFMX0NBUFRVUkVfRkFJTEVEOlxuICAgICAgICAgIHRleHRNc2dVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBwcmV2aWV3LXVpLXRleHQtbXNnYCk7XG4gICAgICAgICAgbG9hZGluZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktbG9hZGluZ2ApO1xuICAgICAgICAgIGxvYWRpbmdVSUhUTUwgPSBgJHtnZXRMb2FkaW5nVUlIVE1MKHVpUG9zaXRpb24sIHNob3dMb2FkaW5nVUksICcjMDAwJyl9YDtcbiAgICAgICAgICB0ZXh0TXNnID0gYDxici8+JHtjYXJkVHlwZVN0cmluZ30g6rCQ7KeAIOyLpO2MqCEg64uk7IucIOy0rOyYge2VtOyjvOyEuOyalC48YnIvPijsnqDsi5wg7ZuEIOyekOuPmeycvOuhnCDslYzrprzsnbQg64ur7Z6Z64uI64ukLik8YnIvPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugb2NyLklOX1BST0dSRVNTLk9DUl9SRUNPR05JWkVEX1dJVEhfU1NBOlxuICAgICAgICAgIHRleHRNc2dVSSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBwcmV2aWV3LXVpLXRleHQtbXNnYCk7XG4gICAgICAgICAgbG9hZGluZ1VJID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHByZXZpZXctdWktbG9hZGluZ2ApO1xuICAgICAgICAgIGxvYWRpbmdVSUhUTUwgPSBgJHtnZXRMb2FkaW5nVUlIVE1MKHVpUG9zaXRpb24sIHNob3dMb2FkaW5nVUksICcjMDAwJyl9YDtcbiAgICAgICAgICB0ZXh0TXNnID0gYDxici8+JHtjYXJkVHlwZVN0cmluZ30g7IKs67O4KOuPhOyaqSkg7Jes67aAIO2MkOuzhCDspJEuLi48YnIvPmA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXh0TXNnVUkpIHRleHRNc2dVSS5pbm5lckhUTUwgPSB0ZXh0TXNnO1xuICAgICAgaWYgKGxvYWRpbmdVSSkgbG9hZGluZ1VJLmlubmVySFRNTCA9IGxvYWRpbmdVSUhUTUw7XG4gICAgfVxuXG4gICAgLy8gY2FwdHVyZVVJXG4gICAgaWYgKHVzZUNhcHR1cmVVSSkge1xuICAgICAgaWYgKHNob3dDYXB0dXJlVUkpIHtcbiAgICAgICAgb2NyLl9fc2V0U3R5bGUob2NyLl9fY2FwdHVyZVVJV3JhcCwgeyBkaXNwbGF5OiAnZmxleCcgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvY3IuX19zZXRTdHlsZShvY3IuX19jYXB0dXJlVUlXcmFwLCB7IGRpc3BsYXk6ICdub25lJyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBvY3IuX19zbGVlcCgxKTsgLy8gZm9yIFVJIHVwZGF0ZVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uSW5Qcm9ncmVzc0NoYW5nZShcbiAgb2NyTW9kZSxcbiAgb2NyVHlwZSxcbiAgaW5Qcm9ncmVzcyxcbiAgY3VzdG9tVUksXG4gIHVpUG9zaXRpb24sXG4gIHVzZVRleHRNc2csXG4gIHVzZUNhcHR1cmVVSSxcbiAgdXNlUHJldmlld1VJLFxuICByZWNvZ25pemVkSW1hZ2Vcbikge1xuICBpZiAob2NyTW9kZSA9PT0gJ3dhc20nKSB7XG4gICAgYXdhaXQgX19vbkluUHJvZ3Jlc3NDaGFuZ2VXQVNNLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSBpZiAob2NyTW9kZSA9PT0gJ3NlcnZlcicpIHtcbiAgICBhd2FpdCBfX29uSW5Qcm9ncmVzc0NoYW5nZVNlcnZlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoYGludmFsaWQgb2NyTW9kZSA6ICR7b2NyTW9kZX1gKTtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TG9hZGluZ1VJSFRNTCh1aVBvc2l0aW9uLCBzaG93TG9hZGluZ1VJLCBmaWxsQ29sb3IpIHtcbiAgcmV0dXJuIChcbiAgICBgYCArXG4gICAgYDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyBpZD0nJHt1aVBvc2l0aW9ufS11aS1sb2FkaW5nJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgc3R5bGU9J21hcmdpbjogYXV0bzsgYmFja2dyb3VuZDogbm9uZTsgZGlzcGxheTogJHtcbiAgICAgIHNob3dMb2FkaW5nVUkgPyAnYmxvY2snIDogJ25vbmUnXG4gICAgfTsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOycgd2lkdGg9JzMycHgnIGhlaWdodD0nMzJweCcgdmlld0JveD0nMCAwIDEwMCAxMDAnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaWRZTWlkJz5cXG5gICtcbiAgICBgICA8Y2lyY2xlIGN4PSc4NCcgY3k9JzUwJyByPScxMCcgZmlsbD0nJHtmaWxsQ29sb3J9Jz5cXG5gICtcbiAgICBgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9J3InIHJlcGVhdENvdW50PSdpbmRlZmluaXRlJyBkdXI9JzAuNTU1NTU1NTU1NTU1NTU1NnMnIGNhbGNNb2RlPSdzcGxpbmUnIGtleVRpbWVzPScwOzEnIHZhbHVlcz0nMTA7MCcga2V5U3BsaW5lcz0nMCAwLjUgMC41IDEnIGJlZ2luPScwcyc+PC9hbmltYXRlPlxcbmAgK1xuICAgIGAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nZmlsbCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMi4yMjIyMjIyMjIyMjIyMjIzcycgY2FsY01vZGU9J2Rpc2NyZXRlJyBrZXlUaW1lcz0nMDswLjI1OzAuNTswLjc1OzEnIHZhbHVlcz0nIzg2ODY4NjAwOyM4Njg2ODYwMDsjODY4Njg2MDA7Izg2ODY4NjAwOyM4Njg2ODYwMCcgYmVnaW49JzBzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgPC9jaXJjbGU+YCArXG4gICAgYCAgPGNpcmNsZSBjeD0nMTYnIGN5PSc1MCcgcj0nMTAnIGZpbGw9JyR7ZmlsbENvbG9yfSc+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdyJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScgZHVyPScyLjIyMjIyMjIyMjIyMjIyMjNzJyBjYWxjTW9kZT0nc3BsaW5lJyBrZXlUaW1lcz0nMDswLjI1OzAuNTswLjc1OzEnIHZhbHVlcz0nMDswOzEwOzEwOzEwJyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49JzBzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdjeCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMi4yMjIyMjIyMjIyMjIyMjIzcycgY2FsY01vZGU9J3NwbGluZScga2V5VGltZXM9JzA7MC4yNTswLjU7MC43NTsxJyB2YWx1ZXM9JzE2OzE2OzE2OzUwOzg0JyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49JzBzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgPC9jaXJjbGU+YCArXG4gICAgYCAgPGNpcmNsZSBjeD0nNTAnIGN5PSc1MCcgcj0nMTAnIGZpbGw9JyR7ZmlsbENvbG9yfSc+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdyJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScgZHVyPScyLjIyMjIyMjIyMjIyMjIyMjNzJyBjYWxjTW9kZT0nc3BsaW5lJyBrZXlUaW1lcz0nMDswLjI1OzAuNTswLjc1OzEnIHZhbHVlcz0nMDswOzEwOzEwOzEwJyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0wLjU1NTU1NTU1NTU1NTU1NTZzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdjeCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMi4yMjIyMjIyMjIyMjIyMjIzcycgY2FsY01vZGU9J3NwbGluZScga2V5VGltZXM9JzA7MC4yNTswLjU7MC43NTsxJyB2YWx1ZXM9JzE2OzE2OzE2OzUwOzg0JyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0wLjU1NTU1NTU1NTU1NTU1NTZzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgPC9jaXJjbGU+YCArXG4gICAgYCAgPGNpcmNsZSBjeD0nODQnIGN5PSc1MCcgcj0nMTAnIGZpbGw9JyR7ZmlsbENvbG9yfSc+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdyJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScgZHVyPScyLjIyMjIyMjIyMjIyMjIyMjNzJyBjYWxjTW9kZT0nc3BsaW5lJyBrZXlUaW1lcz0nMDswLjI1OzAuNTswLjc1OzEnIHZhbHVlcz0nMDswOzEwOzEwOzEwJyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0xLjExMTExMTExMTExMTExMTJzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdjeCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMi4yMjIyMjIyMjIyMjIyMjIzcycgY2FsY01vZGU9J3NwbGluZScga2V5VGltZXM9JzA7MC4yNTswLjU7MC43NTsxJyB2YWx1ZXM9JzE2OzE2OzE2OzUwOzg0JyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0xLjExMTExMTExMTExMTExMTJzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgPC9jaXJjbGU+YCArXG4gICAgYCAgPGNpcmNsZSBjeD0nMTYnIGN5PSc1MCcgcj0nMTAnIGZpbGw9JyR7ZmlsbENvbG9yfSc+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdyJyByZXBlYXRDb3VudD0naW5kZWZpbml0ZScgZHVyPScyLjIyMjIyMjIyMjIyMjIyMjNzJyBjYWxjTW9kZT0nc3BsaW5lJyBrZXlUaW1lcz0nMDswLjI1OzAuNTswLjc1OzEnIHZhbHVlcz0nMDswOzEwOzEwOzEwJyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0xLjY2NjY2NjY2NjY2NjY2NjVzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSdjeCcgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnIGR1cj0nMi4yMjIyMjIyMjIyMjIyMjIzcycgY2FsY01vZGU9J3NwbGluZScga2V5VGltZXM9JzA7MC4yNTswLjU7MC43NTsxJyB2YWx1ZXM9JzE2OzE2OzE2OzUwOzg0JyBrZXlTcGxpbmVzPScwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMScgYmVnaW49Jy0xLjY2NjY2NjY2NjY2NjY2NjVzJz48L2FuaW1hdGU+XFxuYCArXG4gICAgYCAgPC9jaXJjbGU+XFxuYCArXG4gICAgYDwvc3ZnPmBcbiAgKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPQSxPQUFPLE1BQU0sVUFBVTtBQUU5QixJQUFNQyxHQUFHLEdBQUcsSUFBSUQsT0FBTyxDQUFDLENBQUM7QUFDekIsSUFBSUUsWUFBWSxHQUFHLElBQUk7QUFFdkIsSUFBTUMsY0FBYztFQUFBLElBQUFDLElBQUEsR0FBQUMsaUJBQUEsQ0FBRyxXQUFPQyxDQUFDLEVBQUs7SUFDbEMsSUFBSTtNQUNGLElBQU1DLFFBQVEsR0FBR0QsQ0FBQyxDQUFDRSxJQUFJLEdBQUdGLENBQUMsQ0FBQ0UsSUFBSSxHQUFHRixDQUFDO01BRXBDLElBQUlKLFlBQVksS0FBS0ksQ0FBQyxDQUFDRyxNQUFNLEVBQUU7UUFDN0JDLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLGtDQUFrQyxHQUFHVCxZQUFZLEdBQUcsUUFBUSxHQUFH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
