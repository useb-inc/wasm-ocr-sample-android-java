function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/** 아래 정보는 UseB 도메인에서만 동작하는 정보로 테스트를 위해서는 테스트 라이센스 키를 발급받고, TARGET_ORIGIN 과 URL 은 변경해야합니다. */
// const OCR_TARGET_ORIGIN = "*";     // 보안적으로 취약하니 *을 사용하는것은 권장하지 않습니다. (refer : https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#:~:text=serialize%20them%20yourself.-,targetOrigin,-Specifies%20what%20the)
var OCR_TARGET_ORIGIN = 'https://ocr.useb.co.kr';
var OCR_URL = 'https://ocr.useb.co.kr/ocr.html';
var OCR_LICENSE_KEY = 'FPkTB86ym/u+5Gr2Ffvg5BnN8Jh2J64u8l920gwXmvv5/dxlwtGKhNiw9/aeBXRRSYE+5ylxEWRzk4sD8wAbS5xHeZXBw7o9H2fsoxx0FicsaNh0=';
var OCR_RESOURCE_BASE_URL = 'https://ocr.useb.co.kr/';

/** localhost에서 'npm run start'로 실행 시 사용 참고 */
// const OCR_TARGET_ORIGIN = 'https://127.0.0.1:8090'
// const OCR_URL = 'https://127.0.0.1:8090/sdk/ocr.html'
// const OCR_LICENSE_KEY = 'SHOULD BE ENTER LICENSE KEY';
// const OCR_RESOURCE_BASE_URL = 'https://127.0.0.1:8090/sdk/';

/** webstorm에서 'Javascript Debugger' 사용 시 참고 */
// const OCR_TARGET_ORIGIN = 'https://localhost:63342/useb-ocr-wasm-sdk-sample';
// const OCR_URL = 'https://localhost:63342/useb-ocr-wasm-sdk-sample/build/sdk/ocr.html';
// const OCR_LICENSE_KEY = 'SHOULD BE ENTER LICENSE KEY';
// const OCR_RESOURCE_BASE_URL = 'https://localhost:63342/useb-ocr-wasm-sdk-sample/build/sdk/';

var PRELOAD_TYPE = {
  PRELOAD_TYPE_BROWSER: 1,
  PRELOAD_TYPE_WEBVIEW: 2,
}

var ocrIframe = document.getElementById('resolution-simulation-iframe');
var ocrDefaultSettings = {
  licenseKey: OCR_LICENSE_KEY,
  resourceBaseUrl: OCR_RESOURCE_BASE_URL,
  // preloadingUITextMsg: '신분증인증 모듈을 불러오는 중 입니다 ~~<br />잠시만 기다려주세요 ~~',
};
window.globalParams = null;

var preloaded = false;
// 버튼 클릭하여 시작시 호출되는 함수
var onClickStartCallback = () => {
  var postMessageImpl = function postMessageImpl() {
    delete window.globalParams.preloading; // preloading 이 완료된 상태이기 때문에 버튼클릭하여 시작 시 preloading 값 불필요
    delete window.globalParams.preloadType;
    var encodedParams = btoa(encodeURIComponent(JSON.stringify(window.globalParams)));
    ocrIframe.contentWindow.postMessage(encodedParams, OCR_TARGET_ORIGIN);
    hideLoadingUI();
    showOCRIframeUI();
    startOCR();
  };
  if (preloaded) {
    postMessageImpl();
  } else {
    ocrIframe.onload = function () {
      postMessageImpl();
      ocrIframe.onload = null;
    };
    ocrIframe.src = OCR_URL;
    showLoadingUI();
  }
};
var onClickRestartCallback = () => {
  document.getElementById('ocr_result').innerHTML = '';
  document.getElementById('ocr_status').innerHTML = '';
  hideOCRIframeUI();
//  ui_simulator.resetButton();
  startOCR();
};

// preLoading Start Button Event Bind
//document.getElementById('btnPreloadingStart').addEventListener('click', onPreloadStartCallback);
//import UISimulator from './js/ui_simulator.js';
//var ui_simulator = new UISimulator(onClickStartCallback, onClickRestartCallback);
var postMessageListener = event => {
  console.debug('message response', event.data); // base64 encoded된 JSON 메시지이므로 decoded해야 함
  console.debug('origin :', event.origin);
  try {
    var decodedData = decodeURIComponent(atob(event.data));
    console.debug('decoded', decodedData);
    var json = JSON.parse(decodedData);
    console.debug('json', json);
    console.log(json.result + ' 처리 필요');
    var json2 = _.cloneDeep(json);
    if (json2 !== null && json2 !== void 0 && json2.review_result) {
      var review_result = json2.review_result;
      if (review_result.ocr_masking_image) {
        review_result.ocr_masking_image = stringShortener(review_result.ocr_masking_image, 50);
      }
      if (review_result.ocr_origin_image) {
        review_result.ocr_origin_image = stringShortener(review_result.ocr_origin_image, 50);
      }
      if (review_result.ocr_face_image) {
        review_result.ocr_face_image = stringShortener(review_result.ocr_face_image, 50);
      }
      if (review_result.encrypted) {
        if (review_result.encrypted.ocr_masking_image) {
          review_result.encrypted.ocr_masking_image = stringShortener(review_result.encrypted.ocr_masking_image, 50);
        }
        if (review_result.encrypted.ocr_origin_image) {
          review_result.encrypted.ocr_origin_image = stringShortener(review_result.encrypted.ocr_origin_image, 50);
        }
        if (review_result.encrypted.ocr_face_image) {
          review_result.encrypted.ocr_face_image = stringShortener(review_result.encrypted.ocr_face_image, 50);
        }
      }
      if (review_result.encrypted_overall) {
        review_result.encrypted_overall = stringShortener(review_result.encrypted_overall, 50);
      }
    }
    var str = JSON.stringify(json2, undefined, 4);
    var strHighlight = syntaxHighlight(str);
    if (json.result === 'success') {
      updateDebugWin(strHighlight);
      updateOCRResult(strHighlight, json);
      updateOCRStatus('OCR이 완료되었습니다.');
      endOCR();
    } else if (json.result === 'failed') {
      updateDebugWin(strHighlight);
      updateOCRResult(strHighlight, json);
      updateOCRStatus('OCR이 실패되었습니다.');
      endOCR();
    } else if (json.result === 'preloaded') {
      console.debug('wasm preloaded callback ! need remove loading ui');
      preloaded = true;
      setPreloadingStatus('End');
      hideLoadingUI();
    } else if (json.result === 'error') {
      console.debug('wasm preloaded callback ! need remove loading ui');
      updateOCRStatus("OCR\uC911 \uC5D0\uB7EC\uAC00 \uBC1C\uC0DD\uB418\uC5C8\uC2B5\uB2C8\uB2E4 (".concat(json.error_message, ")"));
      setPreloadingStatus('');
      hideLoadingUI();
      endOCR();
    } else {
      // invalid result
      endOCR();
    }
  } catch (error) {
    console.log('wrong data', error);
  } finally {
    // endOCR();
  }
};

// webview onPageFinsished 에서 호출하는 함수
// webview 에서 넘겨준 idType 등 파라미터를 window.globalParams 에 저장.
var preloadMessageListener = event => {
  console.debug('message response', event.data); // base64 encoded된 JSON 메시지이므로 decoded해야 함
  console.debug('origin :', event.origin);
  try {
    var decodedData = decodeURIComponent(atob(event));
    console.debug('decoded', decodedData);
    var json = JSON.parse(decodedData);
    console.debug('json', json);

    ocrIframe.onload = function () {
        window.globalParams = _objectSpread({
           preloading: true,
           preloadType: PRELOAD_TYPE["PRELOAD_TYPE_WEBVIEW"]
         }, json);
        window.globalParams.settings = _objectSpread(ocrDefaultSettings, json.settings);

        var encodedParams = btoa(encodeURIComponent(JSON.stringify(window.globalParams)));
        console.debug('window.globalParams', window.globalParams);

        ocrIframe.contentWindow.postMessage(encodedParams, OCR_TARGET_ORIGIN);
        ocrIframe.onload = null;
      };
      ocrIframe.src = OCR_URL;
      setPreloadingStatus('Started');

  } catch (error) {
    console.log('wrong data', error);
  } finally {
    // endOCR();
  }
};

//ios
window.addEventListener('message', postMessageListener);
//android
document.addEventListener('message', postMessageListener);
window.usebwasmocrpreload = preloadMessageListener;

function setPreloadingStatus(status) {
  document.getElementById('preloading-status-text').value = status;
}
function showLoadingUI() {
  document.getElementById('loading-ui').style.display = 'flex';
}
function hideLoadingUI() {
  document.getElementById('loading-ui').style.display = 'none';
}
function showOCRIframeUI() {
  ocrIframe.style.display = 'block';
}
function hideOCRIframeUI() {
  ocrIframe.style.display = 'none';
}
function startOCR() {
//  document.getElementById('simulator-section').style.display = 'flex';
  document.getElementById('result-section').style.display = 'none';
}
function endOCR() {
//  document.getElementById('simulator-section').style.display = 'none';
  document.getElementById('result-section').style.display = 'block';
}
function updateOCRResult(data, json) {
  var OCRResult = document.getElementById('ocr_result');
  OCRResult.innerHTML = '';
  var title1 = document.createElement('h3');
  title1.innerHTML = '<h3 class="custom--headline">최종 결과</h3>';
  var result1 = document.createElement('div');
  result1.className = 'syntaxHighlight bright';
  result1.style.textAlign = 'center';
  var detail = json.review_result;
  var content = '';
  if (detail) {
    var _detail$ocr_data;
    var ocr_type_txt = 'N/A';
    if (detail.ocr_type.indexOf('idcard') > -1) {
      ocr_type_txt = '주민등록증/운전면허증';
    } else if (detail.ocr_type.indexOf('passport') > -1) {
      ocr_type_txt = '국내/해외여권';
    } else if (detail.ocr_type.indexOf('alien-back') > -1) {
      ocr_type_txt = '외국인등록증 뒷면';
    } else if (detail.ocr_type.indexOf('alien') > -1) {
      ocr_type_txt = '외국인등록증';
    } else if (detail.ocr_type.indexOf('credit') > -1) {
      ocr_type_txt = '신용카드';
    } else if (detail.ocr_type.indexOf('idcard-ssa') > -1) {
      ocr_type_txt += ' + 사본탐지';
    } else {
      ocr_type_txt = 'INVALID_TYPE(' + detail.ocr_type + ')';
    }
    title1.innerHTML += '- OCR 결과 : ' + (json.result === 'success' ? "<span style='color:blue'>성공</span>" : "<span style='color:red'>실패</span>") + ' </br>';
    title1.innerHTML += '- OCR 종류 : ' + "<span style='color:blue'>" + ocr_type_txt + '</span></br>';
    if (detail.ocr_type.indexOf('-ssa') > -1 && (_detail$ocr_data = detail.ocr_data) !== null && _detail$ocr_data !== void 0 && _detail$ocr_data.truth) {
      title1.innerHTML += '- 사본판별 결과 : ' + "<span style='color:blue'>" + detail.ocr_data.truth + '</span></br>';
    }
    if (detail.ocr_type.indexOf('credit') > -1) {
      if (detail.ocr_origin_image) {
        content += "<br/> - 신용카드 원본 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" + detail.ocr_origin_image + "' /><br/>";
      }
    } else {
      var piiEncryptMode = document.querySelector('#encrypt-type').value === 'piiEncrypt';
      if (detail.ocr_masking_image) {
        content += piiEncryptMode ? '<br/> - 신분증 마스킹 사진<br/>Encrypted' : "<br/> - 신분증 마스킹 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" + detail.ocr_masking_image + "' /><br/>";
      }
      if (detail.ocr_origin_image) {
        content += piiEncryptMode ? '<br/> - 신분증 원본 사진<br/>Encrypted' : "<br/> - 신분증 원본 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" + detail.ocr_origin_image + "' /><br/>";
      }
      if (detail.ocr_face_image) {
        content += piiEncryptMode ? '<br/> - 신분증 얼굴 사진<br/>Encrypted' : "<br/> - 신분증의 얼굴 사진<br/>&nbsp;&nbsp;&nbsp;<img style='max-height:200px;' src='" + detail.ocr_face_image + "' /><br/>";
      }
    }
  }
  result1.innerHTML = content;
  OCRResult.appendChild(title1);
  OCRResult.appendChild(result1);
  var title2 = document.createElement('h3');
  title2.innerHTML = '<h3 class="custom--headline">PostMessage 상세</h3>';
  var result2 = document.createElement('pre');
  result2.className = 'syntaxHighlight bright';
  result2.innerHTML = data;
  OCRResult.appendChild(title2);
  OCRResult.appendChild(result2);
}
function updateOCRStatus(msg) {
  var div = document.getElementById('ocr_status');
  div.innerHTML = msg;
}


document.querySelector("#startOcrButton").addEventListener("click", onClickStartCallback);
document.getElementById('restart_btn').addEventListener('click', onClickRestartCallback);