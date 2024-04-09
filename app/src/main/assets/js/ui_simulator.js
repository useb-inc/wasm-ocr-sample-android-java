function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var instance;
class UISimulator {
  /** constructor */
  constructor(onClickStartCallback, onClickRestartCallback, onClickStartPreloadingCallback) {
    /** private properties */
    _defineProperty(this, "__onClickStartCallback", void 0);
    _defineProperty(this, "__onClickRestartCallback", void 0);
    _defineProperty(this, "__type", void 0);
    _defineProperty(this, "__settings", {
      ssaRetryType: 'ENSEMBLE'
    });
    _defineProperty(this, "__ocrResultIdcardKeys", [{
      title: '신분증 종류',
      value: 'result_scan_type'
    }, {
      title: '이름',
      value: 'name'
    }, {
      title: '주민등록번호',
      value: 'jumin'
    }, {
      title: '발급일자',
      value: 'issued_date'
    }, {
      title: '발행처',
      value: 'region'
    }, {
      title: '재외국민 주민등록증',
      value: 'overseas_resident'
    }, {
      title: '운전면허번호',
      value: 'driver_number'
    }, {
      title: '운전면허번호',
      value: 'driver_serial'
    }, {
      title: '운전면허번호',
      value: 'driver_type'
    }, {
      title: '적성검사 갱신기간 시작일',
      value: 'aptitude_test_date_start'
    }, {
      title: '적성검사 갱신기간 종료일',
      value: 'aptitude_test_date_end'
    },
    // { title: '생년월일', value: 'birth' },                     // js 레벨에서 생성하는 값
    // { title: '운전면허증인경우 면허번호 형식이 구형(제주-XXXX-XX)인지 여부', value: 'is_old_format_driver_number' },    // js 레벨에서 생성하는 값

    {
      title: '컬러 검출 점수',
      value: 'color_point'
    }, {
      title: '얼굴 검출 점수',
      value: 'found_face'
    }, {
      title: '눈 검출 점수',
      value: 'found_eye'
    }, {
      title: '빛 반사율',
      value: 'specular_ratio'
    }, {
      title: '스캔 시작 시간',
      value: 'start_time'
    }, {
      title: '스캔 완료 시간',
      value: 'end_time'
    }, {
      title: '원본 신분증 이미지',
      value: 'ocr_origin_image'
    }, {
      title: '마스킹된 신분증 이미지',
      value: 'ocr_masking_image'
    }, {
      title: '신분증 상의 얼굴 크롭 이미지',
      value: 'ocr_face_image'
    }

    // { title: '사본판별 활성화 여부', value: 'ssa_mode' },
    // { title: '신분증 사본탐지 신뢰도', value: 'fd_confidence' },
    // { title: '신분증 사본탐지 결과 (REAL : 실물, FAKE : 가짜)', value: 'id_truth' },
    ]);
    _defineProperty(this, "__ocrResultPassportKeys", [{
      title: '신분증 종류',
      value: 'result_scan_type'
    }, {
      title: '이름',
      value: 'name'
    }, {
      title: '성',
      value: 'sur_name'
    }, {
      title: '이름',
      value: 'given_name'
    }, {
      title: '여권 종류',
      value: 'passport_type'
    }, {
      title: '발행국',
      value: 'issuing_country'
    }, {
      title: '여권번호',
      value: 'passport_number'
    }, {
      title: '소속국',
      value: 'nationality'
    }, {
      title: '발행일자',
      value: 'issued_date'
    }, {
      title: '성별',
      value: 'sex'
    }, {
      title: '만료일',
      value: 'expiry_date'
    }, {
      title: '여권개인번호',
      value: 'personal_number'
    }, {
      title: '주민등록번호',
      value: 'jumin'
    }, {
      title: '생년월일',
      value: 'birthday'
    }, {
      title: '한글 이름',
      value: 'name_kor'
    }, {
      title: 'mrz1',
      value: 'mrz1'
    }, {
      title: 'mrz2',
      value: 'mrz2'
    }, {
      title: '컬러 검출 점수',
      value: 'color_point'
    }, {
      title: '얼굴 검출 점수',
      value: 'found_face'
    }, {
      title: '눈 검출 점수',
      value: 'found_eye'
    }, {
      title: '빛 반사율',
      value: 'specular_ratio'
    }, {
      title: '스캔 시작 시간',
      value: 'start_time'
    }, {
      title: '스캔 완료 시간',
      value: 'end_time'
    }, {
      title: '원본 신분증 이미지',
      value: 'ocr_origin_image'
    }, {
      title: '마스킹된 신분증 이미지',
      value: 'ocr_masking_image'
    }, {
      title: '신분증 상의 얼굴 크롭 이미지',
      value: 'ocr_face_image'
    }

    // { title: '사본판별 활성화 여부', value: 'ssa_mode' },
    // { title: '신분증 사본탐지 신뢰도', value: 'fd_confidence' },
    // { title: '신분증 사본탐지 결과 (REAL : 실물, FAKE : 가짜)', value: 'id_truth' },
    ]);
    _defineProperty(this, "__ocrResultAlienKeys", [{
      title: '이름',
      value: 'name'
    }, {
      title: '외국인등록번호',
      value: 'jumin'
    }, {
      title: '발행일자',
      value: 'issued_date'
    }, {
      title: '국가지역',
      value: 'nationality'
    }, {
      title: '체류자격',
      value: 'visa_type'
    }, {
      title: '한글 이름',
      value: 'name_kor'
    }, {
      title: '컬러 검출 점수',
      value: 'color_point'
    }, {
      title: '얼굴 검출 점수',
      value: 'found_face'
    }, {
      title: '눈 검출 점수',
      value: 'found_eye'
    }, {
      title: '빛 반사율',
      value: 'specular_ratio'
    }, {
      title: '스캔 시작 시간',
      value: 'start_time'
    }, {
      title: '스캔 완료 시간',
      value: 'end_time'
    }, {
      title: '원본 신분증 이미지',
      value: 'ocr_origin_image'
    }, {
      title: '마스킹된 신분증 이미지',
      value: 'ocr_masking_image'
    }, {
      title: '신분증 상의 얼굴 크롭 이미지',
      value: 'ocr_face_image'
    }

    // { title: '사본판별 활성화 여부', value: 'ssa_mode' },
    // { title: '신분증 사본탐지 신뢰도', value: 'fd_confidence' },
    // { title: '신분증 사본탐지 결과 (REAL : 실물, FAKE : 가짜)', value: 'id_truth' },
    ]);

    if (!!!onClickStartCallback || !!!onClickRestartCallback) {
      throw new Error('onClick callback function parameter is not exist');
    }
    if (instance) return instance;
    instance = this;
    this.__onClickStartCallback = onClickStartCallback;
    this.__onClickRestartCallback = onClickRestartCallback;
    this.__onClickStartPreloadingCallback = onClickStartPreloadingCallback;
    this.__bindEventListener();
    return instance;
  }
  __bindEventListener() {
    window.onload = () => {
      document.querySelectorAll('.settings-section input').forEach(input => {
        input.addEventListener('keyup', this.__saveSettingsHandler);
        input.addEventListener('change', this.__saveSettingsHandler);
      });
      document.querySelector('#onboarding-start').addEventListener('click', () => {
        document.querySelector('.onboarding-section').style.display = 'none';
        document.querySelector('#card-select-section').style.display = 'flex';
        if (this.__onClickStartPreloadingCallback) {
          this.__onClickStartPreloadingCallback();
        }
      });
      document.querySelector('#card-select-section #prev').addEventListener('click', function () {
        // document.querySelector('.onboarding-section').style.display = 'flex';
        // document.querySelector('#card-select-section').style.display = 'none';
        location.reload();
      });
      document.querySelector('#simulator-section .prev').addEventListener('click', function () {
        document.querySelector('#card-select-section').style.display = 'flex';
        document.querySelector('#simulator-section').style.display = 'none';
      });
      var collapsedToggle = function collapsedToggle(event) {
        var _event$target$id;
        var toggleElement = (_event$target$id = event.target.id) !== null && _event$target$id !== void 0 && _event$target$id.includes('toggle') ? event.target : event.target.parentElement;
        var section = toggleElement.parentElement;
        var label = toggleElement.querySelector('span');
        var chevron = toggleElement.querySelector('.chevron');
        // const settingsSection = document.querySelector(selector)
        // const label = document.querySelector(selector + ' span')
        // const chevron = document.querySelector(selector + ' .chevron')
        if (section.classList.contains('collapsed')) {
          section.classList.remove('collapsed');
          chevron.classList.remove('fa-chevron-up');
          chevron.classList.add('fa-chevron-down');
          label.textContent = '[접기]';
        } else {
          section.classList.add('collapsed');
          chevron.classList.remove('fa-chevron-down');
          chevron.classList.add('fa-chevron-up');
          label.textContent = '[펼치기]';
        }
      };

      // document.getElementById('type-toggle').addEventListener('click', collapsedToggle);
      document.getElementById('settings-toggle').addEventListener('click', collapsedToggle);
      document.getElementById('ssa-max-retry-count').addEventListener('change', e => {
        this.__settings.ssaMaxRetryCount = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
        this.__saveSettingsHandler();
      });
      var setSsaType = e => {
        this.__settings.ssaRetryType = e.target.value;
      };
      document.getElementById('ssa-type').querySelectorAll('input').forEach(el => {
        el.addEventListener('change', setSsaType);
      });
      var toggleCustomUI = (position, event) => {
        switch (position) {
          case 'top':
            this.__settings.useTopUI = event.target.checked;
            break;
          case 'middle':
            this.__settings.useMiddleUI = event.target.checked;
            break;
          case 'bottom':
            this.__settings.useBottomUI = event.target.checked;
            break;
          case 'preview':
            this.__settings.usePreviewUI = event.target.checked;
            break;
        }
        var text = document.getElementById("use-".concat(position, "-ui-text-msg"));
        if (!event.target.checked && text !== null && text !== void 0 && text.checked) {
          text.click();
        }
        this.__saveSettingsHandler();
      };
      var toggleCustomUITextMsg = (position, event) => {
        switch (position) {
          case 'top':
            this.__settings.useTopUITextMsg = event.target.checked;
            break;
          case 'middle':
            this.__settings.useMiddleUITextMsg = event.target.checked;
            break;
          case 'bottom':
            this.__settings.useBottomUITextMsg = event.target.checked;
            break;
        }
        var ui = document.getElementById("use-".concat(position, "-ui"));
        if (event.target.checked && !ui.checked) {
          ui.click();
        }
        this.__saveSettingsHandler();
      };
      document.getElementById('use-top-ui').addEventListener('change', e => {
        toggleCustomUI('top', e);
      });
      document.getElementById('use-top-ui-text-msg').addEventListener('change', e => {
        toggleCustomUITextMsg('top', e);
      });
      document.getElementById('use-middle-ui').addEventListener('change', e => {
        toggleCustomUI('middle', e);
      });
      document.getElementById('use-middle-ui-text-msg').addEventListener('change', e => {
        toggleCustomUITextMsg('middle', e);
      });
      document.getElementById('use-bottom-ui').addEventListener('change', e => {
        toggleCustomUI('bottom', e);
      });
      document.getElementById('use-bottom-ui-text-msg').addEventListener('change', e => {
        toggleCustomUITextMsg('bottom', e);
      });
      document.getElementById('use-preview-ui').addEventListener('change', e => {
        toggleCustomUI('preview', e);
      });
      document.getElementById('use-force-complete-ui').addEventListener('change', e => {
        this.__settings.useForceCompleteUI = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-auto-switch').addEventListener('change', e => {
        this.__settings.useAutoSwitchToServerMode = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('switch-to-server-threshold').addEventListener('change', e => {
        this.__settings.switchToServerThreshold = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-manual-switch').addEventListener('change', e => {
        this.__settings.useManualSwitchToServerMode = e.target.checked;
        this.__saveSettingsHandler();
      });
      var setEncryptOptionUI = (showKeylistUI, setKeylist) => {
        if (showKeylistUI) {
          // document.getElementById('use-encrypt-mode-div').style.display = 'none';
          // document.getElementById('use-encrypt-all-mode-div').style.display = 'none';
          document.getElementById('ocr-result-keylist-div').style.display = 'flex';
          this.__settings.ocrResultIdcardKeylist = setKeylist ? this.__ocrResultIdcardKeys.map(k => k.value).join(',') : ''; // prettier-ignore
          this.__settings.encryptedOcrResultIdcardKeylist = setKeylist ? this.__ocrResultIdcardKeys.map(k => k.value).join(',') : ''; // prettier-ignore
          this.__settings.ocrResultPassportKeylist = setKeylist ? this.__ocrResultPassportKeys.map(k => k.value).join(',') : ''; // prettier-ignore
          this.__settings.encryptedOcrResultPassportKeylist = setKeylist ? this.__ocrResultPassportKeys.map(k => k.value).join(',') : ''; // prettier-ignore
          this.__settings.ocrResultAlienKeylist = setKeylist ? this.__ocrResultAlienKeys.map(k => k.value).join(',') : ''; // prettier-ignore
          this.__settings.encryptedOcrResultAlienKeylist = setKeylist ? this.__ocrResultAlienKeys.map(k => k.value).join(',') : ''; // prettier-ignore
        } else {
          // document.getElementById('use-encrypt-mode-div').style.display = 'block';
          // document.getElementById('use-encrypt-all-mode-div').style.display = 'block';
          document.getElementById('ocr-result-keylist-div').style.display = 'none';
          delete this.__settings.ocrResultIdcardKeylist;
          delete this.__settings.encryptedOcrResultIdcardKeylist;
          delete this.__settings.ocrResultPassportKeylist;
          delete this.__settings.encryptedOcrResultPassportKeylist;
          delete this.__settings.ocrResultAlienKeylist;
          delete this.__settings.encryptedOcrResultAlienKeylist;
        }
      };
      var resetEncryptSettings = () => {
        delete this.__settings.useEncryptMode;
        delete this.__settings.useEncryptValueMode;
        delete this.__settings.useEncryptOverallMode;

        // all check option 을 모두 checked 상태로 강제로 만들어서 keylist 전체를 초기 상태인 on 상태로 셋팅
        var allCheckOpts = ['idcard-plain-all-check', 'idcard-encrypt-all-check', 'passport-plain-all-check', 'passport-encrypt-all-check', 'alien-plain-all-check', 'alien-encrypt-all-check'];
        allCheckOpts.forEach(name => {
          document.getElementsByName(name)[0].checked = false;
          document.getElementsByName(name)[0].click();
        });
      };
      document.getElementById('encrypt-type').addEventListener('change', e => {
        resetEncryptSettings(); // 암호화 방식 변경시 옵션 초기화

        console.log("encrypt mode: ".concat(e.target.value));
        var showKeylistUI = false,
          setKeylist = false;
        if (e.target.value === 'disableEncrypt') {} else if (e.target.value === 'piiEncrypt') {
          this.__settings.useEncryptMode = true;
        } else if (e.target.value === 'valueEncrypt') {
          this.__settings.useEncryptValueMode = true;
          showKeylistUI = true;
          setKeylist = true;
        } else if (e.target.value === 'overallEncrypt') {
          this.__settings.useEncryptOverallMode = true;
          showKeylistUI = true;
          setKeylist = true;
        } else {
          throw new Error('invalid encrypt type');
        }
        setEncryptOptionUI(showKeylistUI, setKeylist);
        this.__saveSettingsHandler();
      });
      document.getElementById('use-legacy-format').addEventListener('change', e => {
        this.__settings.useLegacyFormat = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-image-correction').addEventListener('change', e => {
        if (e.target.value === 'useImageCropping') {
          this.__settings.useImageCropping = true;
          this.__settings.useImageWarping = false;
        } else if (e.target.value === 'useImageWarping') {
          this.__settings.useImageCropping = false;
          this.__settings.useImageWarping = true;
        } else {
          this.__settings.useImageCropping = false;
          this.__settings.useImageWarping = false;
        }
        this.__saveSettingsHandler();
      });
      document.getElementById('use-compress-image').addEventListener('change', e => {
        this.__settings.useCompressImage = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-compress-image-max-width').addEventListener('change', e => {
        this.__settings.useCompressImageMaxWidth = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-compress-image-max-volume').addEventListener('change', e => {
        this.__settings.useCompressImageMaxVolume = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('mirror-mode').addEventListener('change', e => {
        this.__settings.mirrorMode = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('rotation-degree').addEventListener('change', e => {
        this.__settings.rotationDegree = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('camera-resolution-criteria').addEventListener('change', e => {
        this.__settings.cameraResolutionCriteria = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('camera-resource-request-retry-limit').addEventListener('change', e => {
        this.__settings.cameraResourceRequestRetryLimit = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('camera-resource-request-retry-interval').addEventListener('change', e => {
        this.__settings.cameraResourceRequestRetryInterval = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('guide-box-criteria').addEventListener('change', e => {
        this.__settings.calcGuideBoxCriteria = e.target.value;
        this.__saveSettingsHandler();
      });
      document.getElementById('show-clipboard').addEventListener('change', e => {
        this.__settings.showClipFrame = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('show-canvas-preview').addEventListener('change', e => {
        this.__settings.showCanvasPreview = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('use-debug-alert').addEventListener('change', e => {
        this.__settings.useDebugAlert = e.target.checked;
        this.__saveSettingsHandler();
      });
      document.getElementById('force_wasm_reload').addEventListener('change', e => {
        this.__settings.force_wasm_reload = e.target.checked;
        if (!e.target.checked) {
          this.__settings.force_wasm_reload_flag = '';
        }
        this.__saveSettingsHandler();
      });
      document.getElementById('force_wasm_reload_flag').addEventListener('change', e => {
        var checked = document.querySelector('#force_wasm_reload').value;
        this.__settings.force_wasm_reload_flag = checked ? e.target.value : '';
        this.__saveSettingsHandler();
      });
      document.getElementById('resolution-template').addEventListener('change', () => {
        if (document.getElementById('resolution-template').value === 'custom') {
          document.getElementById('resolution-custom').style.display = 'block';
        } else if (document.getElementById('resolution-template').value === 'responsive') {
          document.getElementById('resolution-custom').style.display = 'none';
        } else {
          document.getElementById('resolution-custom').style.display = 'none';
          var source = document.getElementById('resolution-template').value.split('x');
          var target = [document.getElementById('resolution-width'), document.getElementById('resolution-height')];
          [target[0].value, target[1].value] = [source[0], source[1]];
        }
        this.__saveSettingsHandler();
      });
      document.getElementById('use-mask-frame-color-change').addEventListener('change', e => {
        this.__settings.useMaskFrameColorChange = e.target.checked;
        if (e.target.checked) {
          document.getElementById('mask-frame-color-default').style.display = 'none';
          document.getElementById('mask-frame-color-custom').style.display = 'block';
        } else {
          document.getElementById('mask-frame-color-default').style.display = 'block';
          document.getElementById('mask-frame-color-custom').style.display = 'none';
        }
        this.__saveSettingsHandler();
      });
      document.getElementById('resolution-reverse-button').addEventListener('click', () => {
        var arr = [document.getElementById('resolution-width'), document.getElementById('resolution-height')];
        [arr[0].value, arr[1].value] = [arr[1].value, arr[0].value]; // swap
        this.__saveSettingsHandler();
      });
      document.getElementById('save-settings').addEventListener('click', event => {
        var target = document.getElementById('save-settings');
        target.setAttribute('disabled', 'disabled');
        target.querySelector('span').textContent = '설정 적용됨';
        target.querySelector('i').style.display = 'inline-block';
        target.querySelector('i').style.color = '#5cb85c';

        // 인식 프레임 스타일
        var borderWidth = document.getElementById('border-width').value;
        var borderStyle = document.getElementById('border-style').value;
        var borderRadius = document.getElementById('border-radius').value;
        var colorNotReady = document.getElementById('color-not-ready').value;
        var colorReady = document.getElementById('color-ready').value;
        var colorDetectSuccess = document.getElementById('color-detect-success').value;
        var colorDetectFailed = document.getElementById('color-detect-failed').value;
        var colorOCRRecognized = document.getElementById('color-ocr-recognized').value;
        var colorSuccess = document.getElementById('color-success').value;
        var colorFailed = document.getElementById('color-failed').value;
        this.__settings.frameBorderStyle = _objectSpread(_objectSpread({}, this.__settings.frameBorderStyle), {}, {
          width: borderWidth,
          style: borderStyle,
          radius: borderRadius,
          not_ready: colorNotReady,
          ready: colorReady,
          detect_failed: colorDetectFailed,
          detect_success: colorDetectSuccess,
          recognized: colorOCRRecognized,
          recognized_with_ssa: colorOCRRecognized,
          ocr_failed: colorFailed,
          ocr_success: colorSuccess,
          ocr_success_with_ssa: colorSuccess
        });

        // 마스킹 프레임 스타일
        var maskFrameColorNotReady = document.getElementById('mask-frame-color-not-ready').value;
        var maskFrameColorReady = document.getElementById('mask-frame-color-ready').value;
        var maskFrameColorDetectSuccess = document.getElementById('mask-frame-color-detect-success').value;
        var maskFrameColorDetectFailed = document.getElementById('mask-frame-color-detect-failed').value;
        var maskFrameColorOCRRecognized = document.getElementById('mask-frame-color-ocr-recognized').value;
        var maskFrameColorSuccess = document.getElementById('mask-frame-color-success').value;
        var maskFrameColorFailed = document.getElementById('mask-frame-color-failed').value;
        var maskFrameColorBaseColor = document.getElementById('mask-frame-color-base-color').value;
        this.__settings.maskFrameStyle = _objectSpread(_objectSpread({}, this.__settings.maskFrameStyle), {}, {
          base_color: maskFrameColorBaseColor,
          not_ready: maskFrameColorNotReady,
          ready: maskFrameColorReady,
          detect_failed: maskFrameColorDetectFailed,
          detect_success: maskFrameColorDetectSuccess,
          recognized: maskFrameColorOCRRecognized,
          recognized_with_ssa: maskFrameColorOCRRecognized,
          ocr_failed: maskFrameColorFailed,
          ocr_success: maskFrameColorSuccess,
          ocr_success_with_ssa: maskFrameColorSuccess
        });
        if (document.getElementById('resolution-template').value === 'responsive') {
          document.getElementById('resolution-simulation-frame').style.width = '';
          document.getElementById('resolution-simulation-frame').style.height = '';
        } else {
          var resolutionWidth = document.getElementById('resolution-width').value;
          var resolutionHeight = document.getElementById('resolution-height').value;
          var resolutionExpendRatio = document.getElementById('resolution-expend-ratio').value;
          document.getElementById('resolution-simulation-frame').style.width = resolutionWidth * resolutionExpendRatio + 'px';
          document.getElementById('resolution-simulation-frame').style.height = resolutionHeight * resolutionExpendRatio + 'px';
        }
        if (this.__type) {
          this.__onClickStart();
        }
      });
      document.querySelector('#card-select-section .type-button').addEventListener('click', e => {
        if (e.target.nodeName === 'BUTTON') {
          this.__type = e.target.id;
          if (e.target.id === 'alient-back') {
            this.__settings.useFaceImage = false; // 외국인등록증 뒷면은 얼굴 없음
          }

          this.__onClickStart();
          document.querySelector('#card-select-section').style.display = 'none';
          document.querySelector('#simulator-section').style.display = 'block';
          document.querySelector('#simulator-section .prev-button span').textContent = e.target.textContent;
        }
      });
      document.getElementById('restart_btn').addEventListener('click', () => {
        this.__onClickRestart();
      });
      this.__ocrResultOptionsSetting();
    };
  }
  __onClickStart() {
    this.__onClickStartCallback(this.__type, this.__settings);
  }
  __onClickRestart() {
    this.__onClickRestartCallback();
  }
  __ocrResultOptionsSetting() {
    var insertOcrResultKeyOptions = (target, keys) => {
      var html = keys.map(key => {
        return "<li>\n                    <input type=\"checkbox\" id=\"".concat(target, "-").concat(key.value, "\" name=\"").concat(target, "-keylist\" value=\"").concat(key.value, "\" checked />\n                    <label for=\"").concat(target, "-").concat(key.value, "\">").concat(key.value, "</label>\n                  </li>");
      }).join('');
      document.querySelector("ul#".concat(target, "-keylist-wrapper")).insertAdjacentHTML('afterbegin', html);
    };

    // DOM 세팅
    insertOcrResultKeyOptions('ocr-result-idcard', this.__ocrResultIdcardKeys);
    insertOcrResultKeyOptions('encrypt-ocr-result-idcard', this.__ocrResultIdcardKeys);
    insertOcrResultKeyOptions('ocr-result-passport', this.__ocrResultPassportKeys);
    insertOcrResultKeyOptions('encrypt-ocr-result-passport', this.__ocrResultPassportKeys);
    insertOcrResultKeyOptions('ocr-result-alien', this.__ocrResultAlienKeys);
    insertOcrResultKeyOptions('encrypt-ocr-result-alien', this.__ocrResultAlienKeys);
    var addKeyList = (target, key) => {
      return [...target.split(','), key].filter(v => !!v).join(',');
    };
    var removeKeyList = (target, key) => {
      return target.split(',').filter(t => t !== key).join(',');
    };

    // 이벤트 핸들러 등록
    var ocrResultKeylistHandler = e => {
      var settingTarget = '';
      // prettier-ignore
      switch (e.target.name) {
        case 'ocr-result-idcard-keylist':
          settingTarget = 'ocrResultIdcardKeylist';
          break;
        case 'encrypt-ocr-result-idcard-keylist':
          settingTarget = 'encryptedOcrResultIdcardKeylist';
          break;
        case 'ocr-result-passport-keylist':
          settingTarget = 'ocrResultPassportKeylist';
          break;
        case 'encrypt-ocr-result-passport-keylist':
          settingTarget = 'encryptedOcrResultPassportKeylist';
          break;
        case 'ocr-result-alien-keylist':
          settingTarget = 'ocrResultAlienKeylist';
          break;
        case 'encrypt-ocr-result-alien-keylist':
          settingTarget = 'encryptedOcrResultAlienKeylist';
          break;

        // all 체크 버튼 처리
        case 'idcard-plain-all-check':
        case 'idcard-encrypt-all-check':
        case 'passport-plain-all-check':
        case 'passport-encrypt-all-check':
        case 'alien-plain-all-check':
        case 'alien-encrypt-all-check':
          var ocrType = e.target.name.split("-")[0];
          var prefix = e.target.name.split("-")[1] === 'encrypt' ? 'encrypt-' : '';
          document.getElementsByName("".concat(prefix, "ocr-result-").concat(ocrType, "-keylist")).forEach(input => {
            if (input.checked !== e.target.checked) {
              input.click();
            }
          });
          return;
      }
      if (e.target.checked) {
        this.__settings[settingTarget] = addKeyList(this.__settings[settingTarget], e.target.value);
      } else {
        this.__settings[settingTarget] = removeKeyList(this.__settings[settingTarget], e.target.value);
      }
      this.__saveSettingsHandler();
    };
    document.querySelectorAll('#ocr-result-keylist-div input').forEach(input => {
      input.addEventListener('change', ocrResultKeylistHandler);
    });
  }
  resetButton() {
    var buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.classList.remove('active');
    });
  }
  __saveSettingsHandler() {
    var button = document.getElementById('save-settings');
    button.removeAttribute('disabled');
    button.querySelector('.fa-check').style.display = 'none';
    button.querySelector('span').textContent = '설정적용';
  }
}
export default UISimulator;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvdWlfc2ltdWxhdG9yLmpzIiwibmFtZXMiOlsiaW5zdGFuY2UiLCJVSVNpbXVsYXRvciIsImNvbnN0cnVjdG9yIiwib25DbGlja1N0YXJ0Q2FsbGJhY2siLCJvbkNsaWNrUmVzdGFydENhbGxiYWNrIiwib25DbGlja1N0YXJ0UHJlbG9hZGluZ0NhbGxiYWNrIiwiX2RlZmluZVByb3BlcnR5Iiwic3NhUmV0cnlUeXBlIiwidGl0bGUiLCJ2YWx1ZSIsIkVycm9yIiwiX19vbkNsaWNrU3RhcnRDYWxsYmFjayIsIl9fb25DbGlja1Jlc3RhcnRDYWxsYmFjayIsIl9fb25DbGlja1N0YXJ0UHJlbG9hZGluZ0NhbGxiYWNrIiwiX19iaW5kRXZlbnRMaXN0ZW5lciIsIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJpbnB1dCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfX3NhdmVTZXR0aW5nc0hhbmRsZXIiLCJxdWVyeVNlbGVjdG9yIiwic3R5bGUiLCJkaXNwbGF5IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjb2xsYXBzZWRUb2dnbGUiLCJldmVudCIsIl9ldmVudCR0YXJnZXQkaWQiLCJ0b2dnbGVFbGVtZW50IiwidGFyZ2V0IiwiaWQiLCJpbmNsdWRlcyIsInBhcmVudEVsZW1lbnQiLCJzZWN0aW9uIiwibGFiZWwiLCJjaGV2cm9uIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJyZW1vdmUiLCJhZGQiLCJ0ZXh0Q29udGVudCIsImdldEVsZW1lbnRCeUlkIiwiZSIsIl9fc2V0dGluZ3MiLCJzc2FNYXhSZXRyeUNvdW50IiwiaXNOYU4iLCJwYXJzZUludCIsInNldFNzYVR5cGUiLCJlbCIsInRvZ2dsZUN1c3RvbVVJIiwicG9zaXRpb24iLCJ1c2VUb3BVSSIsImNoZWNrZWQiLCJ1c2VNaWRkbGVVSSIsInVzZUJvdHRvbVVJIiwidXNlUHJldmlld1VJIiwidGV4dCIsImNvbmNhdCIsImNsaWNrIiwidG9nZ2xlQ3VzdG9tVUlUZXh0TXNnIiwidXNlVG9wVUlUZXh0TXNnIiwidXNlTWlkZGxlVUlUZXh0TXNnIiwidXNlQm90dG9tVUlUZXh0TXNnIiwidWkiLCJ1c2VGb3JjZUNvbXBsZXRlVUkiLCJ1c2VBdXRvU3dpdGNoVG9TZXJ2ZXJNb2RlIiwic3dpdGNoVG9TZXJ2ZXJUaHJlc2hvbGQiLCJ1c2VNYW51YWxTd2l0Y2hUb1NlcnZlck1vZGUiLCJzZXRFbmNyeXB0T3B0aW9uVUkiLCJzaG93S2V5bGlzdFVJIiwic2V0S2V5bGlzdCIsIm9jclJlc3VsdElkY2FyZEtleWxpc3QiLCJfX29jclJlc3VsdElkY2FyZEtleXMiLCJtYXAiLCJrIiwiam9pbiIsImVuY3J5cHRlZE9jclJlc3VsdElkY2FyZEtleWxpc3QiLCJvY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QiLCJfX29jclJlc3VsdFBhc3Nwb3J0S2V5cyIsImVuY3J5cHRlZE9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdCIsIm9jclJlc3VsdEFsaWVuS2V5bGlzdCIsIl9fb2NyUmVzdWx0QWxpZW5LZXlzIiwiZW5jcnlwdGVkT2NyUmVzdWx0QWxpZW5LZXlsaXN0IiwicmVzZXRFbmNyeXB0U2V0dGluZ3MiLCJ1c2VFbmNyeXB0TW9kZSIsInVzZUVuY3J5cHRWYWx1ZU1vZGUiLCJ1c2VFbmNyeXB0T3ZlcmFsbE1vZGUiLCJhbGxDaGVja09wdHMiLCJuYW1lIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJjb25zb2xlIiwibG9nIiwidXNlTGVnYWN5Rm9ybWF0IiwidXNlSW1hZ2VDcm9wcGluZyIsInVzZUltYWdlV2FycGluZyIsInVzZUNvbXByZXNzSW1hZ2UiLCJ1c2VDb21wcmVzc0ltYWdlTWF4V2lkdGgiLCJ1c2VDb21wcmVzc0ltYWdlTWF4Vm9sdW1lIiwibWlycm9yTW9kZSIsInJvdGF0aW9uRGVncmVlIiwiY2FtZXJhUmVzb2x1dGlvbkNyaXRlcmlhIiwiY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlMaW1pdCIsImNhbWVyYVJlc291cmNlUmVxdWVzdFJldHJ5SW50ZXJ2YWwiLCJjYWxjR3VpZGVCb3hDcml0ZXJpYSIsInNob3dDbGlwRnJhbWUiLCJzaG93Q2FudmFzUHJldmlldyIsInVzZURlYnVnQWxlcnQiLCJmb3JjZV93YXNtX3JlbG9hZCIsImZvcmNlX3dhc21fcmVsb2FkX2ZsYWciLCJzb3VyY2UiLCJzcGxpdCIsInVzZU1hc2tGcmFtZUNvbG9yQ2hhbmdlIiwiYXJyIiwic2V0QXR0cmlidXRlIiwiY29sb3IiLCJib3JkZXJXaWR0aCIsImJvcmRlclN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiY29sb3JOb3RSZWFkeSIsImNvbG9yUmVhZHkiLCJjb2xvckRldGVjdFN1Y2Nlc3MiLCJjb2xvckRldGVjdEZhaWxlZCIsImNvbG9yT0NSUmVjb2duaXplZCIsImNvbG9yU3VjY2VzcyIsImNvbG9yRmFpbGVkIiwiZnJhbWVCb3JkZXJTdHlsZSIsIl9vYmplY3RTcHJlYWQiLCJ3aWR0aCIsInJhZGl1cyIsIm5vdF9yZWFkeSIsInJlYWR5IiwiZGV0ZWN0X2ZhaWxlZCIsImRldGVjdF9zdWNjZXNzIiwicmVjb2duaXplZCIsInJlY29nbml6ZWRfd2l0aF9zc2EiLCJvY3JfZmFpbGVkIiwib2NyX3N1Y2Nlc3MiLCJvY3Jfc3VjY2Vzc193aXRoX3NzYSIsIm1hc2tGcmFtZUNvbG9yTm90UmVhZHkiLCJtYXNrRnJhbWVDb2xvclJlYWR5IiwibWFza0ZyYW1lQ29sb3JEZXRlY3RTdWNjZXNzIiwibWFza0ZyYW1lQ29sb3JEZXRlY3RGYWlsZWQiLCJtYXNrRnJhbWVDb2xvck9DUlJlY29nbml6ZWQiLCJtYXNrRnJhbWVDb2xvclN1Y2Nlc3MiLCJtYXNrRnJhbWVDb2xvckZhaWxlZCIsIm1hc2tGcmFtZUNvbG9yQmFzZUNvbG9yIiwibWFza0ZyYW1lU3R5bGUiLCJiYXNlX2NvbG9yIiwiaGVpZ2h0IiwicmVzb2x1dGlvbldpZHRoIiwicmVzb2x1dGlvbkhlaWdodCIsInJlc29sdXRpb25FeHBlbmRSYXRpbyIsIl9fdHlwZSIsIl9fb25DbGlja1N0YXJ0Iiwibm9kZU5hbWUiLCJ1c2VGYWNlSW1hZ2UiLCJfX29uQ2xpY2tSZXN0YXJ0IiwiX19vY3JSZXN1bHRPcHRpb25zU2V0dGluZyIsImluc2VydE9jclJlc3VsdEtleU9wdGlvbnMiLCJrZXlzIiwiaHRtbCIsImtleSIsImluc2VydEFkamFjZW50SFRNTCIsImFkZEtleUxpc3QiLCJmaWx0ZXIiLCJ2IiwicmVtb3ZlS2V5TGlzdCIsInQiLCJvY3JSZXN1bHRLZXlsaXN0SGFuZGxlciIsInNldHRpbmdUYXJnZXQiLCJvY3JUeXBlIiwicHJlZml4IiwicmVzZXRCdXR0b24iLCJidXR0b25zIiwiYnV0dG9uIiwicmVtb3ZlQXR0cmlidXRlIl0sInNvdXJjZXMiOlsianMvdWlfc2ltdWxhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBpbnN0YW5jZTtcblxuY2xhc3MgVUlTaW11bGF0b3Ige1xuICAvKiogcHJpdmF0ZSBwcm9wZXJ0aWVzICovXG4gIF9fb25DbGlja1N0YXJ0Q2FsbGJhY2s7XG4gIF9fb25DbGlja1Jlc3RhcnRDYWxsYmFjaztcbiAgX190eXBlO1xuICBfX3NldHRpbmdzID0ge1xuICAgIHNzYVJldHJ5VHlwZTogJ0VOU0VNQkxFJyxcbiAgfTtcbiAgX19vY3JSZXN1bHRJZGNhcmRLZXlzID0gW1xuICAgIHsgdGl0bGU6ICfsi6DrtoTspp0g7KKF66WYJywgdmFsdWU6ICdyZXN1bHRfc2Nhbl90eXBlJyB9LFxuICAgIHsgdGl0bGU6ICfsnbTrpoQnLCB2YWx1ZTogJ25hbWUnIH0sXG4gICAgeyB0aXRsZTogJ+yjvOuvvOuTseuhneuyiO2YuCcsIHZhbHVlOiAnanVtaW4nIH0sXG4gICAgeyB0aXRsZTogJ+uwnOq4ieydvOyekCcsIHZhbHVlOiAnaXNzdWVkX2RhdGUnIH0sXG4gICAgeyB0aXRsZTogJ+uwnO2WieyymCcsIHZhbHVlOiAncmVnaW9uJyB9LFxuICAgIHsgdGl0bGU6ICfsnqzsmbjqta3rr7wg7KO866+865Ox66Gd7KadJywgdmFsdWU6ICdvdmVyc2Vhc19yZXNpZGVudCcgfSxcbiAgICB7IHRpdGxlOiAn7Jq07KCE66m07ZeI67KI7Zi4JywgdmFsdWU6ICdkcml2ZXJfbnVtYmVyJyB9LFxuICAgIHsgdGl0bGU6ICfsmrTsoITrqbTtl4jrsojtmLgnLCB2YWx1ZTogJ2RyaXZlcl9zZXJpYWwnIH0sXG4gICAgeyB0aXRsZTogJ+yatOyghOuptO2XiOuyiO2YuCcsIHZhbHVlOiAnZHJpdmVyX3R5cGUnIH0sXG4gICAgeyB0aXRsZTogJ+yggeyEseqygOyCrCDqsLHsi6DquLDqsIQg7Iuc7J6R7J28JywgdmFsdWU6ICdhcHRpdHVkZV90ZXN0X2RhdGVfc3RhcnQnIH0sXG4gICAgeyB0aXRsZTogJ+yggeyEseqygOyCrCDqsLHsi6DquLDqsIQg7KKF66OM7J28JywgdmFsdWU6ICdhcHRpdHVkZV90ZXN0X2RhdGVfZW5kJyB9LFxuICAgIC8vIHsgdGl0bGU6ICfsg53rhYTsm5TsnbwnLCB2YWx1ZTogJ2JpcnRoJyB9LCAgICAgICAgICAgICAgICAgICAgIC8vIGpzIOugiOuyqOyXkOyEnCDsg53shLHtlZjripQg6rCSXG4gICAgLy8geyB0aXRsZTogJ+yatOyghOuptO2XiOymneyduOqyveyasCDrqbTtl4jrsojtmLgg7ZiV7Iud7J20IOq1rO2YlSjsoJzso7wtWFhYWC1YWCnsnbjsp4Ag7Jes67aAJywgdmFsdWU6ICdpc19vbGRfZm9ybWF0X2RyaXZlcl9udW1iZXInIH0sICAgIC8vIGpzIOugiOuyqOyXkOyEnCDsg53shLHtlZjripQg6rCSXG5cbiAgICB7IHRpdGxlOiAn7Lus65+sIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2NvbG9yX3BvaW50JyB9LFxuICAgIHsgdGl0bGU6ICfslrzqtbQg6rKA7LacIOygkOyImCcsIHZhbHVlOiAnZm91bmRfZmFjZScgfSxcbiAgICB7IHRpdGxlOiAn64iIIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2ZvdW5kX2V5ZScgfSxcbiAgICB7IHRpdGxlOiAn67mbIOuwmOyCrOycqCcsIHZhbHVlOiAnc3BlY3VsYXJfcmF0aW8nIH0sXG4gICAgeyB0aXRsZTogJ+yKpOy6lCDsi5zsnpEg7Iuc6rCEJywgdmFsdWU6ICdzdGFydF90aW1lJyB9LFxuICAgIHsgdGl0bGU6ICfsiqTsupQg7JmE66OMIOyLnOqwhCcsIHZhbHVlOiAnZW5kX3RpbWUnIH0sXG5cbiAgICB7IHRpdGxlOiAn7JuQ67O4IOyLoOu2hOymnSDsnbTrr7jsp4AnLCB2YWx1ZTogJ29jcl9vcmlnaW5faW1hZ2UnIH0sXG4gICAgeyB0aXRsZTogJ+uniOyKpO2CueuQnCDsi6DrtoTspp0g7J2066+47KeAJywgdmFsdWU6ICdvY3JfbWFza2luZ19pbWFnZScgfSxcbiAgICB7IHRpdGxlOiAn7Iug67aE7KadIOyDgeydmCDslrzqtbQg7YGs66GtIOydtOuvuOyngCcsIHZhbHVlOiAnb2NyX2ZhY2VfaW1hZ2UnIH0sXG5cbiAgICAvLyB7IHRpdGxlOiAn7IKs67O47YyQ67OEIO2ZnOyEse2ZlCDsl6zrtoAnLCB2YWx1ZTogJ3NzYV9tb2RlJyB9LFxuICAgIC8vIHsgdGl0bGU6ICfsi6DrtoTspp0g7IKs67O47YOQ7KeAIOyLoOuisOuPhCcsIHZhbHVlOiAnZmRfY29uZmlkZW5jZScgfSxcbiAgICAvLyB7IHRpdGxlOiAn7Iug67aE7KadIOyCrOuzuO2DkOyngCDqsrDqs7wgKFJFQUwgOiDsi6TrrLwsIEZBS0UgOiDqsIDsp5wpJywgdmFsdWU6ICdpZF90cnV0aCcgfSxcbiAgXTtcbiAgX19vY3JSZXN1bHRQYXNzcG9ydEtleXMgPSBbXG4gICAgeyB0aXRsZTogJ+yLoOu2hOymnSDsooXrpZgnLCB2YWx1ZTogJ3Jlc3VsdF9zY2FuX3R5cGUnIH0sXG4gICAgeyB0aXRsZTogJ+ydtOumhCcsIHZhbHVlOiAnbmFtZScgfSxcbiAgICB7IHRpdGxlOiAn7ISxJywgdmFsdWU6ICdzdXJfbmFtZScgfSxcbiAgICB7IHRpdGxlOiAn7J2066aEJywgdmFsdWU6ICdnaXZlbl9uYW1lJyB9LFxuICAgIHsgdGl0bGU6ICfsl6zqtowg7KKF66WYJywgdmFsdWU6ICdwYXNzcG9ydF90eXBlJyB9LFxuICAgIHsgdGl0bGU6ICfrsJztlonqta0nLCB2YWx1ZTogJ2lzc3VpbmdfY291bnRyeScgfSxcbiAgICB7IHRpdGxlOiAn7Jes6raM67KI7Zi4JywgdmFsdWU6ICdwYXNzcG9ydF9udW1iZXInIH0sXG4gICAgeyB0aXRsZTogJ+yGjOyGjeq1rScsIHZhbHVlOiAnbmF0aW9uYWxpdHknIH0sXG4gICAgeyB0aXRsZTogJ+uwnO2WieydvOyekCcsIHZhbHVlOiAnaXNzdWVkX2RhdGUnIH0sXG4gICAgeyB0aXRsZTogJ+yEseuzhCcsIHZhbHVlOiAnc2V4JyB9LFxuICAgIHsgdGl0bGU6ICfrp4zro4zsnbwnLCB2YWx1ZTogJ2V4cGlyeV9kYXRlJyB9LFxuICAgIHsgdGl0bGU6ICfsl6zqtozqsJzsnbjrsojtmLgnLCB2YWx1ZTogJ3BlcnNvbmFsX251bWJlcicgfSxcbiAgICB7IHRpdGxlOiAn7KO866+865Ox66Gd67KI7Zi4JywgdmFsdWU6ICdqdW1pbicgfSxcbiAgICB7IHRpdGxlOiAn7IOd64WE7JuU7J28JywgdmFsdWU6ICdiaXJ0aGRheScgfSxcbiAgICB7IHRpdGxlOiAn7ZWc6riAIOydtOumhCcsIHZhbHVlOiAnbmFtZV9rb3InIH0sXG4gICAgeyB0aXRsZTogJ21yejEnLCB2YWx1ZTogJ21yejEnIH0sXG4gICAgeyB0aXRsZTogJ21yejInLCB2YWx1ZTogJ21yejInIH0sXG5cbiAgICB7IHRpdGxlOiAn7Lus65+sIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2NvbG9yX3BvaW50JyB9LFxuICAgIHsgdGl0bGU6ICfslrzqtbQg6rKA7LacIOygkOyImCcsIHZhbHVlOiAnZm91bmRfZmFjZScgfSxcbiAgICB7IHRpdGxlOiAn64iIIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2ZvdW5kX2V5ZScgfSxcbiAgICB7IHRpdGxlOiAn67mbIOuwmOyCrOycqCcsIHZhbHVlOiAnc3BlY3VsYXJfcmF0aW8nIH0sXG4gICAgeyB0aXRsZTogJ+yKpOy6lCDsi5zsnpEg7Iuc6rCEJywgdmFsdWU6ICdzdGFydF90aW1lJyB9LFxuICAgIHsgdGl0bGU6ICfsiqTsupQg7JmE66OMIOyLnOqwhCcsIHZhbHVlOiAnZW5kX3RpbWUnIH0sXG5cbiAgICB7IHRpdGxlOiAn7JuQ67O4IOyLoOu2hOymnSDsnbTrr7jsp4AnLCB2YWx1ZTogJ29jcl9vcmlnaW5faW1hZ2UnIH0sXG4gICAgeyB0aXRsZTogJ+uniOyKpO2CueuQnCDsi6DrtoTspp0g7J2066+47KeAJywgdmFsdWU6ICdvY3JfbWFza2luZ19pbWFnZScgfSxcbiAgICB7IHRpdGxlOiAn7Iug67aE7KadIOyDgeydmCDslrzqtbQg7YGs66GtIOydtOuvuOyngCcsIHZhbHVlOiAnb2NyX2ZhY2VfaW1hZ2UnIH0sXG5cbiAgICAvLyB7IHRpdGxlOiAn7IKs67O47YyQ67OEIO2ZnOyEse2ZlCDsl6zrtoAnLCB2YWx1ZTogJ3NzYV9tb2RlJyB9LFxuICAgIC8vIHsgdGl0bGU6ICfsi6DrtoTspp0g7IKs67O47YOQ7KeAIOyLoOuisOuPhCcsIHZhbHVlOiAnZmRfY29uZmlkZW5jZScgfSxcbiAgICAvLyB7IHRpdGxlOiAn7Iug67aE7KadIOyCrOuzuO2DkOyngCDqsrDqs7wgKFJFQUwgOiDsi6TrrLwsIEZBS0UgOiDqsIDsp5wpJywgdmFsdWU6ICdpZF90cnV0aCcgfSxcbiAgXTtcblxuICBfX29jclJlc3VsdEFsaWVuS2V5cyA9IFtcbiAgICB7IHRpdGxlOiAn7J2066aEJywgdmFsdWU6ICduYW1lJyB9LFxuICAgIHsgdGl0bGU6ICfsmbjqta3snbjrk7HroZ3rsojtmLgnLCB2YWx1ZTogJ2p1bWluJyB9LFxuICAgIHsgdGl0bGU6ICfrsJztlonsnbzsnpAnLCB2YWx1ZTogJ2lzc3VlZF9kYXRlJyB9LFxuICAgIHsgdGl0bGU6ICfqta3qsIDsp4Dsl60nLCB2YWx1ZTogJ25hdGlvbmFsaXR5JyB9LFxuICAgIHsgdGl0bGU6ICfssrTrpZjsnpDqsqknLCB2YWx1ZTogJ3Zpc2FfdHlwZScgfSxcbiAgICB7IHRpdGxlOiAn7ZWc6riAIOydtOumhCcsIHZhbHVlOiAnbmFtZV9rb3InIH0sXG5cbiAgICB7IHRpdGxlOiAn7Lus65+sIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2NvbG9yX3BvaW50JyB9LFxuICAgIHsgdGl0bGU6ICfslrzqtbQg6rKA7LacIOygkOyImCcsIHZhbHVlOiAnZm91bmRfZmFjZScgfSxcbiAgICB7IHRpdGxlOiAn64iIIOqygOy2nCDsoJDsiJgnLCB2YWx1ZTogJ2ZvdW5kX2V5ZScgfSxcbiAgICB7IHRpdGxlOiAn67mbIOuwmOyCrOycqCcsIHZhbHVlOiAnc3BlY3VsYXJfcmF0aW8nIH0sXG4gICAgeyB0aXRsZTogJ+yKpOy6lCDsi5zsnpEg7Iuc6rCEJywgdmFsdWU6ICdzdGFydF90aW1lJyB9LFxuICAgIHsgdGl0bGU6ICfsiqTsupQg7JmE66OMIOyLnOqwhCcsIHZhbHVlOiAnZW5kX3RpbWUnIH0sXG5cbiAgICB7IHRpdGxlOiAn7JuQ67O4IOyLoOu2hOymnSDsnbTrr7jsp4AnLCB2YWx1ZTogJ29jcl9vcmlnaW5faW1hZ2UnIH0sXG4gICAgeyB0aXRsZTogJ+uniOyKpO2CueuQnCDsi6DrtoTspp0g7J2066+47KeAJywgdmFsdWU6ICdvY3JfbWFza2luZ19pbWFnZScgfSxcbiAgICB7IHRpdGxlOiAn7Iug67aE7KadIOyDgeydmCDslrzqtbQg7YGs66GtIOydtOuvuOyngCcsIHZhbHVlOiAnb2NyX2ZhY2VfaW1hZ2UnIH0sXG5cbiAgICAvLyB7IHRpdGxlOiAn7IKs67O47YyQ67OEIO2ZnOyEse2ZlCDsl6zrtoAnLCB2YWx1ZTogJ3NzYV9tb2RlJyB9LFxuICAgIC8vIHsgdGl0bGU6ICfsi6DrtoTspp0g7IKs67O47YOQ7KeAIOyLoOuisOuPhCcsIHZhbHVlOiAnZmRfY29uZmlkZW5jZScgfSxcbiAgICAvLyB7IHRpdGxlOiAn7Iug67aE7KadIOyCrOuzuO2DkOyngCDqsrDqs7wgKFJFQUwgOiDsi6TrrLwsIEZBS0UgOiDqsIDsp5wpJywgdmFsdWU6ICdpZF90cnV0aCcgfSxcbiAgXTtcblxuICAvKiogY29uc3RydWN0b3IgKi9cbiAgY29uc3RydWN0b3Iob25DbGlja1N0YXJ0Q2FsbGJhY2ssIG9uQ2xpY2tSZXN0YXJ0Q2FsbGJhY2ssIG9uQ2xpY2tTdGFydFByZWxvYWRpbmdDYWxsYmFjaykge1xuICAgIGlmICghISFvbkNsaWNrU3RhcnRDYWxsYmFjayB8fCAhISFvbkNsaWNrUmVzdGFydENhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ29uQ2xpY2sgY2FsbGJhY2sgZnVuY3Rpb24gcGFyYW1ldGVyIGlzIG5vdCBleGlzdCcpO1xuICAgIH1cblxuICAgIGlmIChpbnN0YW5jZSkgcmV0dXJuIGluc3RhbmNlO1xuICAgIGluc3RhbmNlID0gdGhpcztcbiAgICB0aGlzLl9fb25DbGlja1N0YXJ0Q2FsbGJhY2sgPSBvbkNsaWNrU3RhcnRDYWxsYmFjaztcbiAgICB0aGlzLl9fb25DbGlja1Jlc3RhcnRDYWxsYmFjayA9IG9uQ2xpY2tSZXN0YXJ0Q2FsbGJhY2s7XG4gICAgdGhpcy5fX29uQ2xpY2tTdGFydFByZWxvYWRpbmdDYWxsYmFjayA9IG9uQ2xpY2tTdGFydFByZWxvYWRpbmdDYWxsYmFjaztcblxuICAgIHRoaXMuX19iaW5kRXZlbnRMaXN0ZW5lcigpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIF9fYmluZEV2ZW50TGlzdGVuZXIoKSB7XG4gICAgd2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXR0aW5ncy1zZWN0aW9uIGlucHV0JykuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcik7XG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb25ib2FyZGluZy1zdGFydCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub25ib2FyZGluZy1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcmQtc2VsZWN0LXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBpZiAodGhpcy5fX29uQ2xpY2tTdGFydFByZWxvYWRpbmdDYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMuX19vbkNsaWNrU3RhcnRQcmVsb2FkaW5nQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FyZC1zZWxlY3Qtc2VjdGlvbiAjcHJldicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub25ib2FyZGluZy1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcmQtc2VsZWN0LXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NpbXVsYXRvci1zZWN0aW9uIC5wcmV2JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJkLXNlbGVjdC1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NpbXVsYXRvci1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb2xsYXBzZWRUb2dnbGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlRWxlbWVudCA9IGV2ZW50LnRhcmdldC5pZD8uaW5jbHVkZXMoJ3RvZ2dsZScpID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgY29uc3Qgc2VjdGlvbiA9IHRvZ2dsZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0b2dnbGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKTtcbiAgICAgICAgY29uc3QgY2hldnJvbiA9IHRvZ2dsZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoZXZyb24nKTtcbiAgICAgICAgLy8gY29uc3Qgc2V0dGluZ3NTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgICAgLy8gY29uc3QgbGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yICsgJyBzcGFuJylcbiAgICAgICAgLy8gY29uc3QgY2hldnJvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IgKyAnIC5jaGV2cm9uJylcbiAgICAgICAgaWYgKHNlY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZWQnKSkge1xuICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgY2hldnJvbi5jbGFzc0xpc3QucmVtb3ZlKCdmYS1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgY2hldnJvbi5jbGFzc0xpc3QuYWRkKCdmYS1jaGV2cm9uLWRvd24nKTtcbiAgICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9ICdb7KCR6riwXSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICBjaGV2cm9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhLWNoZXZyb24tZG93bicpO1xuICAgICAgICAgIGNoZXZyb24uY2xhc3NMaXN0LmFkZCgnZmEtY2hldnJvbi11cCcpO1xuICAgICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gJ1vtjrzsuZjquLBdJztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R5cGUtdG9nZ2xlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb2xsYXBzZWRUb2dnbGUpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldHRpbmdzLXRvZ2dsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29sbGFwc2VkVG9nZ2xlKTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NzYS1tYXgtcmV0cnktY291bnQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3Muc3NhTWF4UmV0cnlDb3VudCA9IGlzTmFOKHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSkgPyAwIDogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNldFNzYVR5cGUgPSAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3Muc3NhUmV0cnlUeXBlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICB9O1xuICAgICAgZG9jdW1lbnRcbiAgICAgICAgLmdldEVsZW1lbnRCeUlkKCdzc2EtdHlwZScpXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNldFNzYVR5cGUpO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgdG9nZ2xlQ3VzdG9tVUkgPSAocG9zaXRpb24sIGV2ZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZVRvcFVJID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtaWRkbGUnOlxuICAgICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZU1pZGRsZVVJID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUJvdHRvbVVJID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwcmV2aWV3JzpcbiAgICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VQcmV2aWV3VUkgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGB1c2UtJHtwb3NpdGlvbn0tdWktdGV4dC1tc2dgKTtcbiAgICAgICAgaWYgKCFldmVudC50YXJnZXQuY2hlY2tlZCAmJiB0ZXh0Py5jaGVja2VkKSB7XG4gICAgICAgICAgdGV4dC5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHRvZ2dsZUN1c3RvbVVJVGV4dE1zZyA9IChwb3NpdGlvbiwgZXZlbnQpID0+IHtcbiAgICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICB0aGlzLl9fc2V0dGluZ3MudXNlVG9wVUlUZXh0TXNnID0gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtaWRkbGUnOlxuICAgICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZU1pZGRsZVVJVGV4dE1zZyA9IGV2ZW50LnRhcmdldC5jaGVja2VkO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VCb3R0b21VSVRleHRNc2cgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgdXNlLSR7cG9zaXRpb259LXVpYCk7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCAmJiAhdWkuY2hlY2tlZCkge1xuICAgICAgICAgIHVpLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS10b3AtdWknKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0b2dnbGVDdXN0b21VSSgndG9wJywgZSk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS10b3AtdWktdGV4dC1tc2cnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0b2dnbGVDdXN0b21VSVRleHRNc2coJ3RvcCcsIGUpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2UtbWlkZGxlLXVpJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdG9nZ2xlQ3VzdG9tVUkoJ21pZGRsZScsIGUpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2UtbWlkZGxlLXVpLXRleHQtbXNnJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdG9nZ2xlQ3VzdG9tVUlUZXh0TXNnKCdtaWRkbGUnLCBlKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWJvdHRvbS11aScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRvZ2dsZUN1c3RvbVVJKCdib3R0b20nLCBlKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWJvdHRvbS11aS10ZXh0LW1zZycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRvZ2dsZUN1c3RvbVVJVGV4dE1zZygnYm90dG9tJywgZSk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS1wcmV2aWV3LXVpJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdG9nZ2xlQ3VzdG9tVUkoJ3ByZXZpZXcnLCBlKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWZvcmNlLWNvbXBsZXRlLXVpJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUZvcmNlQ29tcGxldGVVSSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS1hdXRvLXN3aXRjaCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VBdXRvU3dpdGNoVG9TZXJ2ZXJNb2RlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3dpdGNoLXRvLXNlcnZlci10aHJlc2hvbGQnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3Muc3dpdGNoVG9TZXJ2ZXJUaHJlc2hvbGQgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLW1hbnVhbC1zd2l0Y2gnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3MudXNlTWFudWFsU3dpdGNoVG9TZXJ2ZXJNb2RlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXRFbmNyeXB0T3B0aW9uVUkgPSAoc2hvd0tleWxpc3RVSSwgc2V0S2V5bGlzdCkgPT4ge1xuICAgICAgICBpZiAoc2hvd0tleWxpc3RVSSkge1xuICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2UtZW5jcnlwdC1tb2RlLWRpdicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS1lbmNyeXB0LWFsbC1tb2RlLWRpdicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29jci1yZXN1bHQta2V5bGlzdC1kaXYnKS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy5vY3JSZXN1bHRJZGNhcmRLZXlsaXN0ID0gc2V0S2V5bGlzdCA/IHRoaXMuX19vY3JSZXN1bHRJZGNhcmRLZXlzLm1hcCgoaykgPT4gay52YWx1ZSkuam9pbignLCcpIDogJyc7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0ID0gc2V0S2V5bGlzdCA/IHRoaXMuX19vY3JSZXN1bHRJZGNhcmRLZXlzLm1hcCgoaykgPT4gay52YWx1ZSkuam9pbignLCcpIDogJyc7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy5vY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QgPSBzZXRLZXlsaXN0ID8gdGhpcy5fX29jclJlc3VsdFBhc3Nwb3J0S2V5cy5tYXAoKGspID0+IGsudmFsdWUpLmpvaW4oJywnKSA6ICcnOyAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICB0aGlzLl9fc2V0dGluZ3MuZW5jcnlwdGVkT2NyUmVzdWx0UGFzc3BvcnRLZXlsaXN0ID0gc2V0S2V5bGlzdCA/IHRoaXMuX19vY3JSZXN1bHRQYXNzcG9ydEtleXMubWFwKChrKSA9PiBrLnZhbHVlKS5qb2luKCcsJykgOiAnJzsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgdGhpcy5fX3NldHRpbmdzLm9jclJlc3VsdEFsaWVuS2V5bGlzdCA9IHNldEtleWxpc3QgPyB0aGlzLl9fb2NyUmVzdWx0QWxpZW5LZXlzLm1hcCgoaykgPT4gay52YWx1ZSkuam9pbignLCcpIDogJyc7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRBbGllbktleWxpc3QgPSBzZXRLZXlsaXN0ID8gdGhpcy5fX29jclJlc3VsdEFsaWVuS2V5cy5tYXAoKGspID0+IGsudmFsdWUpLmpvaW4oJywnKSA6ICcnOyAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWVuY3J5cHQtbW9kZS1kaXYnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWVuY3J5cHQtYWxsLW1vZGUtZGl2Jykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29jci1yZXN1bHQta2V5bGlzdC1kaXYnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9fc2V0dGluZ3Mub2NyUmVzdWx0SWRjYXJkS2V5bGlzdDtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fX3NldHRpbmdzLmVuY3J5cHRlZE9jclJlc3VsdElkY2FyZEtleWxpc3Q7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX19zZXR0aW5ncy5vY3JSZXN1bHRQYXNzcG9ydEtleWxpc3Q7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX19zZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3Q7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX19zZXR0aW5ncy5vY3JSZXN1bHRBbGllbktleWxpc3Q7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX19zZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRBbGllbktleWxpc3Q7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJlc2V0RW5jcnlwdFNldHRpbmdzID0gKCkgPT4ge1xuICAgICAgICBkZWxldGUgdGhpcy5fX3NldHRpbmdzLnVzZUVuY3J5cHRNb2RlO1xuICAgICAgICBkZWxldGUgdGhpcy5fX3NldHRpbmdzLnVzZUVuY3J5cHRWYWx1ZU1vZGU7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9fc2V0dGluZ3MudXNlRW5jcnlwdE92ZXJhbGxNb2RlO1xuXG4gICAgICAgIC8vIGFsbCBjaGVjayBvcHRpb24g7J2EIOuqqOuRkCBjaGVja2VkIOyDge2DnOuhnCDqsJXsoJzroZwg66eM65Ok7Ja07IScIGtleWxpc3Qg7KCE7LK066W8IOy0iOq4sCDsg4Htg5zsnbggb24g7IOB7YOc66GcIOyFi+2MhVxuICAgICAgICBjb25zdCBhbGxDaGVja09wdHMgPSBbXG4gICAgICAgICAgJ2lkY2FyZC1wbGFpbi1hbGwtY2hlY2snLFxuICAgICAgICAgICdpZGNhcmQtZW5jcnlwdC1hbGwtY2hlY2snLFxuICAgICAgICAgICdwYXNzcG9ydC1wbGFpbi1hbGwtY2hlY2snLFxuICAgICAgICAgICdwYXNzcG9ydC1lbmNyeXB0LWFsbC1jaGVjaycsXG4gICAgICAgICAgJ2FsaWVuLXBsYWluLWFsbC1jaGVjaycsXG4gICAgICAgICAgJ2FsaWVuLWVuY3J5cHQtYWxsLWNoZWNrJyxcbiAgICAgICAgXTtcblxuICAgICAgICBhbGxDaGVja09wdHMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKG5hbWUpWzBdLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShuYW1lKVswXS5jbGljaygpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmNyeXB0LXR5cGUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICByZXNldEVuY3J5cHRTZXR0aW5ncygpOyAvLyDslZTtmLjtmZQg67Cp7IudIOuzgOqyveyLnCDsmLXshZgg7LSI6riw7ZmUXG5cbiAgICAgICAgY29uc29sZS5sb2coYGVuY3J5cHQgbW9kZTogJHtlLnRhcmdldC52YWx1ZX1gKTtcblxuICAgICAgICBsZXQgc2hvd0tleWxpc3RVSSA9IGZhbHNlLFxuICAgICAgICAgIHNldEtleWxpc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlID09PSAnZGlzYWJsZUVuY3J5cHQnKSB7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUgPT09ICdwaWlFbmNyeXB0Jykge1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VFbmNyeXB0TW9kZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudmFsdWUgPT09ICd2YWx1ZUVuY3J5cHQnKSB7XG4gICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUVuY3J5cHRWYWx1ZU1vZGUgPSB0cnVlO1xuICAgICAgICAgIHNob3dLZXlsaXN0VUkgPSB0cnVlO1xuICAgICAgICAgIHNldEtleWxpc3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnZhbHVlID09PSAnb3ZlcmFsbEVuY3J5cHQnKSB7XG4gICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUVuY3J5cHRPdmVyYWxsTW9kZSA9IHRydWU7XG4gICAgICAgICAgc2hvd0tleWxpc3RVSSA9IHRydWU7XG4gICAgICAgICAgc2V0S2V5bGlzdCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGVuY3J5cHQgdHlwZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0RW5jcnlwdE9wdGlvblVJKHNob3dLZXlsaXN0VUksIHNldEtleWxpc3QpO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2UtbGVnYWN5LWZvcm1hdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VMZWdhY3lGb3JtYXQgPSBlLnRhcmdldC5jaGVja2VkO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2UtaW1hZ2UtY29ycmVjdGlvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA9PT0gJ3VzZUltYWdlQ3JvcHBpbmcnKSB7XG4gICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUltYWdlQ3JvcHBpbmcgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VJbWFnZVdhcnBpbmcgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC52YWx1ZSA9PT0gJ3VzZUltYWdlV2FycGluZycpIHtcbiAgICAgICAgICB0aGlzLl9fc2V0dGluZ3MudXNlSW1hZ2VDcm9wcGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VJbWFnZVdhcnBpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VJbWFnZUNyb3BwaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUltYWdlV2FycGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS1jb21wcmVzcy1pbWFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VDb21wcmVzc0ltYWdlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWNvbXByZXNzLWltYWdlLW1heC13aWR0aCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VDb21wcmVzc0ltYWdlTWF4V2lkdGggPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWNvbXByZXNzLWltYWdlLW1heC12b2x1bWUnKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3MudXNlQ29tcHJlc3NJbWFnZU1heFZvbHVtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaXJyb3ItbW9kZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy5taXJyb3JNb2RlID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm90YXRpb24tZGVncmVlJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLnJvdGF0aW9uRGVncmVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbWVyYS1yZXNvbHV0aW9uLWNyaXRlcmlhJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLmNhbWVyYVJlc29sdXRpb25Dcml0ZXJpYSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW1lcmEtcmVzb3VyY2UtcmVxdWVzdC1yZXRyeS1saW1pdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy5jYW1lcmFSZXNvdXJjZVJlcXVlc3RSZXRyeUxpbWl0ID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbWVyYS1yZXNvdXJjZS1yZXF1ZXN0LXJldHJ5LWludGVydmFsJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLmNhbWVyYVJlc291cmNlUmVxdWVzdFJldHJ5SW50ZXJ2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ3VpZGUtYm94LWNyaXRlcmlhJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLmNhbGNHdWlkZUJveENyaXRlcmlhID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3ctY2xpcGJvYXJkJykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLnNob3dDbGlwRnJhbWUgPSBlLnRhcmdldC5jaGVja2VkO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LWNhbnZhcy1wcmV2aWV3JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLnNob3dDYW52YXNQcmV2aWV3ID0gZS50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlLWRlYnVnLWFsZXJ0JykuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZURlYnVnQWxlcnQgPSBlLnRhcmdldC5jaGVja2VkO1xuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JjZV93YXNtX3JlbG9hZCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy5mb3JjZV93YXNtX3JlbG9hZCA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIGlmICghZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAgIHRoaXMuX19zZXR0aW5ncy5mb3JjZV93YXNtX3JlbG9hZF9mbGFnID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yY2Vfd2FzbV9yZWxvYWRfZmxhZycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoZWNrZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZm9yY2Vfd2FzbV9yZWxvYWQnKS52YWx1ZTtcbiAgICAgICAgdGhpcy5fX3NldHRpbmdzLmZvcmNlX3dhc21fcmVsb2FkX2ZsYWcgPSBjaGVja2VkID8gZS50YXJnZXQudmFsdWUgOiAnJztcbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi10ZW1wbGF0ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXRlbXBsYXRlJykudmFsdWUgPT09ICdjdXN0b20nKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24tY3VzdG9tJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24tdGVtcGxhdGUnKS52YWx1ZSA9PT0gJ3Jlc3BvbnNpdmUnKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24tY3VzdG9tJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi1jdXN0b20nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXRlbXBsYXRlJykudmFsdWUuc3BsaXQoJ3gnKTtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24td2lkdGgnKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24taGVpZ2h0JyldO1xuICAgICAgICAgIFt0YXJnZXRbMF0udmFsdWUsIHRhcmdldFsxXS52YWx1ZV0gPSBbc291cmNlWzBdLCBzb3VyY2VbMV1dO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX19zYXZlU2V0dGluZ3NIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZS1tYXNrLWZyYW1lLWNvbG9yLWNoYW5nZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy51c2VNYXNrRnJhbWVDb2xvckNoYW5nZSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItZGVmYXVsdCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItY3VzdG9tJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItZGVmYXVsdCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXNrLWZyYW1lLWNvbG9yLWN1c3RvbScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fX3NhdmVTZXR0aW5nc0hhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi1yZXZlcnNlLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcnIgPSBbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24td2lkdGgnKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc29sdXRpb24taGVpZ2h0JyldO1xuICAgICAgICBbYXJyWzBdLnZhbHVlLCBhcnJbMV0udmFsdWVdID0gW2FyclsxXS52YWx1ZSwgYXJyWzBdLnZhbHVlXTsgLy8gc3dhcFxuICAgICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLXNldHRpbmdzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtc2V0dGluZ3MnKTtcbiAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS50ZXh0Q29udGVudCA9ICfshKTsoJUg7KCB7Jqp65CoJztcbiAgICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2knKS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgICAgIHRhcmdldC5xdWVyeVNlbGVjdG9yKCdpJykuc3R5bGUuY29sb3IgPSAnIzVjYjg1Yyc7XG5cbiAgICAgICAgLy8g7J247IudIO2UhOugiOyehCDsiqTtg4DsnbxcbiAgICAgICAgY29uc3QgYm9yZGVyV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9yZGVyLXdpZHRoJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGJvcmRlclN0eWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvcmRlci1zdHlsZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBib3JkZXJSYWRpdXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9yZGVyLXJhZGl1cycpLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xvck5vdFJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLW5vdC1yZWFkeScpLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xvclJlYWR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9yLXJlYWR5JykudmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbG9yRGV0ZWN0U3VjY2VzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1kZXRlY3Qtc3VjY2VzcycpLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xvckRldGVjdEZhaWxlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1kZXRlY3QtZmFpbGVkJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbG9yT0NSUmVjb2duaXplZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1vY3ItcmVjb2duaXplZCcpLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xvclN1Y2Nlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sb3Itc3VjY2VzcycpLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xvckZhaWxlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvci1mYWlsZWQnKS52YWx1ZTtcblxuICAgICAgICB0aGlzLl9fc2V0dGluZ3MuZnJhbWVCb3JkZXJTdHlsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9fc2V0dGluZ3MuZnJhbWVCb3JkZXJTdHlsZSxcbiAgICAgICAgICB3aWR0aDogYm9yZGVyV2lkdGgsXG4gICAgICAgICAgc3R5bGU6IGJvcmRlclN0eWxlLFxuICAgICAgICAgIHJhZGl1czogYm9yZGVyUmFkaXVzLFxuICAgICAgICAgIG5vdF9yZWFkeTogY29sb3JOb3RSZWFkeSxcbiAgICAgICAgICByZWFkeTogY29sb3JSZWFkeSxcbiAgICAgICAgICBkZXRlY3RfZmFpbGVkOiBjb2xvckRldGVjdEZhaWxlZCxcbiAgICAgICAgICBkZXRlY3Rfc3VjY2VzczogY29sb3JEZXRlY3RTdWNjZXNzLFxuICAgICAgICAgIHJlY29nbml6ZWQ6IGNvbG9yT0NSUmVjb2duaXplZCxcbiAgICAgICAgICByZWNvZ25pemVkX3dpdGhfc3NhOiBjb2xvck9DUlJlY29nbml6ZWQsXG4gICAgICAgICAgb2NyX2ZhaWxlZDogY29sb3JGYWlsZWQsXG4gICAgICAgICAgb2NyX3N1Y2Nlc3M6IGNvbG9yU3VjY2VzcyxcbiAgICAgICAgICBvY3Jfc3VjY2Vzc193aXRoX3NzYTogY29sb3JTdWNjZXNzLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOuniOyKpO2CuSDtlITroIjsnoQg7Iqk7YOA7J28XG4gICAgICAgIGNvbnN0IG1hc2tGcmFtZUNvbG9yTm90UmVhZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFzay1mcmFtZS1jb2xvci1ub3QtcmVhZHknKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbWFza0ZyYW1lQ29sb3JSZWFkeSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXNrLWZyYW1lLWNvbG9yLXJlYWR5JykudmFsdWU7XG4gICAgICAgIGNvbnN0IG1hc2tGcmFtZUNvbG9yRGV0ZWN0U3VjY2VzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXNrLWZyYW1lLWNvbG9yLWRldGVjdC1zdWNjZXNzJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG1hc2tGcmFtZUNvbG9yRGV0ZWN0RmFpbGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItZGV0ZWN0LWZhaWxlZCcpLnZhbHVlO1xuICAgICAgICBjb25zdCBtYXNrRnJhbWVDb2xvck9DUlJlY29nbml6ZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFzay1mcmFtZS1jb2xvci1vY3ItcmVjb2duaXplZCcpLnZhbHVlO1xuICAgICAgICBjb25zdCBtYXNrRnJhbWVDb2xvclN1Y2Nlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFzay1mcmFtZS1jb2xvci1zdWNjZXNzJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG1hc2tGcmFtZUNvbG9yRmFpbGVkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItZmFpbGVkJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG1hc2tGcmFtZUNvbG9yQmFzZUNvbG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hc2stZnJhbWUtY29sb3ItYmFzZS1jb2xvcicpLnZhbHVlO1xuXG4gICAgICAgIHRoaXMuX19zZXR0aW5ncy5tYXNrRnJhbWVTdHlsZSA9IHtcbiAgICAgICAgICAuLi50aGlzLl9fc2V0dGluZ3MubWFza0ZyYW1lU3R5bGUsXG4gICAgICAgICAgYmFzZV9jb2xvcjogbWFza0ZyYW1lQ29sb3JCYXNlQ29sb3IsXG4gICAgICAgICAgbm90X3JlYWR5OiBtYXNrRnJhbWVDb2xvck5vdFJlYWR5LFxuICAgICAgICAgIHJlYWR5OiBtYXNrRnJhbWVDb2xvclJlYWR5LFxuICAgICAgICAgIGRldGVjdF9mYWlsZWQ6IG1hc2tGcmFtZUNvbG9yRGV0ZWN0RmFpbGVkLFxuICAgICAgICAgIGRldGVjdF9zdWNjZXNzOiBtYXNrRnJhbWVDb2xvckRldGVjdFN1Y2Nlc3MsXG4gICAgICAgICAgcmVjb2duaXplZDogbWFza0ZyYW1lQ29sb3JPQ1JSZWNvZ25pemVkLFxuICAgICAgICAgIHJlY29nbml6ZWRfd2l0aF9zc2E6IG1hc2tGcmFtZUNvbG9yT0NSUmVjb2duaXplZCxcbiAgICAgICAgICBvY3JfZmFpbGVkOiBtYXNrRnJhbWVDb2xvckZhaWxlZCxcbiAgICAgICAgICBvY3Jfc3VjY2VzczogbWFza0ZyYW1lQ29sb3JTdWNjZXNzLFxuICAgICAgICAgIG9jcl9zdWNjZXNzX3dpdGhfc3NhOiBtYXNrRnJhbWVDb2xvclN1Y2Nlc3MsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXRlbXBsYXRlJykudmFsdWUgPT09ICdyZXNwb25zaXZlJykge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXNpbXVsYXRpb24tZnJhbWUnKS5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXNpbXVsYXRpb24tZnJhbWUnKS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCByZXNvbHV0aW9uV2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi13aWR0aCcpLnZhbHVlO1xuICAgICAgICAgIGNvbnN0IHJlc29sdXRpb25IZWlnaHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi1oZWlnaHQnKS52YWx1ZTtcbiAgICAgICAgICBjb25zdCByZXNvbHV0aW9uRXhwZW5kUmF0aW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb2x1dGlvbi1leHBlbmQtcmF0aW8nKS52YWx1ZTtcblxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXNpbXVsYXRpb24tZnJhbWUnKS5zdHlsZS53aWR0aCA9XG4gICAgICAgICAgICByZXNvbHV0aW9uV2lkdGggKiByZXNvbHV0aW9uRXhwZW5kUmF0aW8gKyAncHgnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvbHV0aW9uLXNpbXVsYXRpb24tZnJhbWUnKS5zdHlsZS5oZWlnaHQgPVxuICAgICAgICAgICAgcmVzb2x1dGlvbkhlaWdodCAqIHJlc29sdXRpb25FeHBlbmRSYXRpbyArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fX3R5cGUpIHtcbiAgICAgICAgICB0aGlzLl9fb25DbGlja1N0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2FyZC1zZWxlY3Qtc2VjdGlvbiAudHlwZS1idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5ub2RlTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgICAgICB0aGlzLl9fdHlwZSA9IGUudGFyZ2V0LmlkO1xuICAgICAgICAgIGlmIChlLnRhcmdldC5pZCA9PT0gJ2FsaWVudC1iYWNrJykge1xuICAgICAgICAgICAgdGhpcy5fX3NldHRpbmdzLnVzZUZhY2VJbWFnZSA9IGZhbHNlOyAvLyDsmbjqta3snbjrk7HroZ3spp0g65K366m07J2AIOyWvOq1tCDsl4bsnYxcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fX29uQ2xpY2tTdGFydCgpO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJkLXNlbGVjdC1zZWN0aW9uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2ltdWxhdG9yLXNlY3Rpb24nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2ltdWxhdG9yLXNlY3Rpb24gLnByZXYtYnV0dG9uIHNwYW4nKS50ZXh0Q29udGVudCA9IGUudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnRfYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX19vbkNsaWNrUmVzdGFydCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX19vY3JSZXN1bHRPcHRpb25zU2V0dGluZygpO1xuICAgIH07XG4gIH1cblxuICBfX29uQ2xpY2tTdGFydCgpIHtcbiAgICB0aGlzLl9fb25DbGlja1N0YXJ0Q2FsbGJhY2sodGhpcy5fX3R5cGUsIHRoaXMuX19zZXR0aW5ncyk7XG4gIH1cblxuICBfX29uQ2xpY2tSZXN0YXJ0KCkge1xuICAgIHRoaXMuX19vbkNsaWNrUmVzdGFydENhbGxiYWNrKCk7XG4gIH1cblxuICBfX29jclJlc3VsdE9wdGlvbnNTZXR0aW5nKCkge1xuICAgIGNvbnN0IGluc2VydE9jclJlc3VsdEtleU9wdGlvbnMgPSAodGFyZ2V0LCBrZXlzKSA9PiB7XG4gICAgICBjb25zdCBodG1sID0ga2V5c1xuICAgICAgICAubWFwKChrZXkpID0+IHtcbiAgICAgICAgICByZXR1cm4gYDxsaT5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJHt0YXJnZXR9LSR7a2V5LnZhbHVlfVwiIG5hbWU9XCIke3RhcmdldH0ta2V5bGlzdFwiIHZhbHVlPVwiJHtrZXkudmFsdWV9XCIgY2hlY2tlZCAvPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHt0YXJnZXR9LSR7a2V5LnZhbHVlfVwiPiR7a2V5LnZhbHVlfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8L2xpPmA7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHVsIyR7dGFyZ2V0fS1rZXlsaXN0LXdyYXBwZXJgKS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcbiAgICB9O1xuXG4gICAgLy8gRE9NIOyEuO2MhVxuICAgIGluc2VydE9jclJlc3VsdEtleU9wdGlvbnMoJ29jci1yZXN1bHQtaWRjYXJkJywgdGhpcy5fX29jclJlc3VsdElkY2FyZEtleXMpO1xuICAgIGluc2VydE9jclJlc3VsdEtleU9wdGlvbnMoJ2VuY3J5cHQtb2NyLXJlc3VsdC1pZGNhcmQnLCB0aGlzLl9fb2NyUmVzdWx0SWRjYXJkS2V5cyk7XG4gICAgaW5zZXJ0T2NyUmVzdWx0S2V5T3B0aW9ucygnb2NyLXJlc3VsdC1wYXNzcG9ydCcsIHRoaXMuX19vY3JSZXN1bHRQYXNzcG9ydEtleXMpO1xuICAgIGluc2VydE9jclJlc3VsdEtleU9wdGlvbnMoJ2VuY3J5cHQtb2NyLXJlc3VsdC1wYXNzcG9ydCcsIHRoaXMuX19vY3JSZXN1bHRQYXNzcG9ydEtleXMpO1xuICAgIGluc2VydE9jclJlc3VsdEtleU9wdGlvbnMoJ29jci1yZXN1bHQtYWxpZW4nLCB0aGlzLl9fb2NyUmVzdWx0QWxpZW5LZXlzKTtcbiAgICBpbnNlcnRPY3JSZXN1bHRLZXlPcHRpb25zKCdlbmNyeXB0LW9jci1yZXN1bHQtYWxpZW4nLCB0aGlzLl9fb2NyUmVzdWx0QWxpZW5LZXlzKTtcblxuICAgIGNvbnN0IGFkZEtleUxpc3QgPSAodGFyZ2V0LCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBbLi4udGFyZ2V0LnNwbGl0KCcsJyksIGtleV0uZmlsdGVyKCh2KSA9PiAhIXYpLmpvaW4oJywnKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVtb3ZlS2V5TGlzdCA9ICh0YXJnZXQsIGtleSkgPT4ge1xuICAgICAgcmV0dXJuIHRhcmdldFxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAuZmlsdGVyKCh0KSA9PiB0ICE9PSBrZXkpXG4gICAgICAgIC5qb2luKCcsJyk7XG4gICAgfTtcblxuICAgIC8vIOydtOuypO2KuCDtlbjrk6Trn6wg65Ox66GdXG4gICAgY29uc3Qgb2NyUmVzdWx0S2V5bGlzdEhhbmRsZXIgPSAoZSkgPT4ge1xuICAgICAgbGV0IHNldHRpbmdUYXJnZXQgPSAnJztcbiAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgc3dpdGNoIChlLnRhcmdldC5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ29jci1yZXN1bHQtaWRjYXJkLWtleWxpc3QnOiBzZXR0aW5nVGFyZ2V0ID0gJ29jclJlc3VsdElkY2FyZEtleWxpc3QnOyBicmVhaztcbiAgICAgICAgY2FzZSAnZW5jcnlwdC1vY3ItcmVzdWx0LWlkY2FyZC1rZXlsaXN0Jzogc2V0dGluZ1RhcmdldCA9ICdlbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0JzsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29jci1yZXN1bHQtcGFzc3BvcnQta2V5bGlzdCc6IHNldHRpbmdUYXJnZXQgPSAnb2NyUmVzdWx0UGFzc3BvcnRLZXlsaXN0JzsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VuY3J5cHQtb2NyLXJlc3VsdC1wYXNzcG9ydC1rZXlsaXN0Jzogc2V0dGluZ1RhcmdldCA9ICdlbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QnOyBicmVhaztcbiAgICAgICAgY2FzZSAnb2NyLXJlc3VsdC1hbGllbi1rZXlsaXN0Jzogc2V0dGluZ1RhcmdldCA9ICdvY3JSZXN1bHRBbGllbktleWxpc3QnOyBicmVhaztcbiAgICAgICAgY2FzZSAnZW5jcnlwdC1vY3ItcmVzdWx0LWFsaWVuLWtleWxpc3QnOiBzZXR0aW5nVGFyZ2V0ID0gJ2VuY3J5cHRlZE9jclJlc3VsdEFsaWVuS2V5bGlzdCc7IGJyZWFrO1xuXG4gICAgICAgIC8vIGFsbCDssrTtgawg67KE7Yq8IOyymOumrFxuICAgICAgICBjYXNlICdpZGNhcmQtcGxhaW4tYWxsLWNoZWNrJzpcbiAgICAgICAgY2FzZSAnaWRjYXJkLWVuY3J5cHQtYWxsLWNoZWNrJzpcbiAgICAgICAgY2FzZSAncGFzc3BvcnQtcGxhaW4tYWxsLWNoZWNrJzpcbiAgICAgICAgY2FzZSAncGFzc3BvcnQtZW5jcnlwdC1hbGwtY2hlY2snOlxuICAgICAgICBjYXNlICdhbGllbi1wbGFpbi1hbGwtY2hlY2snOlxuICAgICAgICBjYXNlICdhbGllbi1lbmNyeXB0LWFsbC1jaGVjayc6XG4gICAgICAgICAgY29uc3Qgb2NyVHlwZSA9IGUudGFyZ2V0Lm5hbWUuc3BsaXQoXCItXCIpWzBdO1xuICAgICAgICAgIGNvbnN0IHByZWZpeCA9IGUudGFyZ2V0Lm5hbWUuc3BsaXQoXCItXCIpWzFdID09PSAnZW5jcnlwdCcgPyAnZW5jcnlwdC0nIDogJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoYCR7cHJlZml4fW9jci1yZXN1bHQtJHtvY3JUeXBlfS1rZXlsaXN0YCkuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5jaGVja2VkICE9PSBlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMuX19zZXR0aW5nc1tzZXR0aW5nVGFyZ2V0XSA9IGFkZEtleUxpc3QodGhpcy5fX3NldHRpbmdzW3NldHRpbmdUYXJnZXRdLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fc2V0dGluZ3Nbc2V0dGluZ1RhcmdldF0gPSByZW1vdmVLZXlMaXN0KHRoaXMuX19zZXR0aW5nc1tzZXR0aW5nVGFyZ2V0XSwgZS50YXJnZXQudmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fc2F2ZVNldHRpbmdzSGFuZGxlcigpO1xuICAgIH07XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI29jci1yZXN1bHQta2V5bGlzdC1kaXYgaW5wdXQnKS5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb2NyUmVzdWx0S2V5bGlzdEhhbmRsZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzZXRCdXR0b24oKSB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfSk7XG4gIH1cblxuICBfX3NhdmVTZXR0aW5nc0hhbmRsZXIoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtc2V0dGluZ3MnKTtcbiAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgIGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcuZmEtY2hlY2snKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzcGFuJykudGV4dENvbnRlbnQgPSAn7ISk7KCV7KCB7JqpJztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVSVNpbXVsYXRvcjtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFJQSxRQUFRO0FBRVosTUFBTUMsV0FBVyxDQUFDO0VBaUdoQjtFQUNBQyxXQUFXQSxDQUFDQyxvQkFBb0IsRUFBRUMsc0JBQXNCLEVBQUVDLDhCQUE4QixFQUFFO0lBakcxRjtJQUFBQyxlQUFBO0lBQUFBLGVBQUE7SUFBQUEsZUFBQTtJQUFBQSxlQUFBLHFCQUlhO01BQ1hDLFlBQVksRUFBRTtJQUNoQixDQUFDO0lBQUFELGVBQUEsZ0NBQ3VCLENBQ3RCO01BQUVFLEtBQUssRUFBRSxRQUFRO01BQUVDLEtBQUssRUFBRTtJQUFtQixDQUFDLEVBQzlDO01BQUVELEtBQUssRUFBRSxJQUFJO01BQUVDLEtBQUssRUFBRTtJQUFPLENBQUMsRUFDOUI7TUFBRUQsS0FBSyxFQUFFLFFBQVE7TUFBRUMsS0FBSyxFQUFFO0lBQVEsQ0FBQyxFQUNuQztNQUFFRCxLQUFLLEVBQUUsTUFBTTtNQUFFQyxLQUFLLEVBQUU7SUFBYyxDQUFDLEVBQ3ZDO01BQUVELEtBQUssRUFBRSxLQUFLO01BQUVDLEtBQUssRUFBRTtJQUFTLENBQUMsRUFDakM7TUFBRUQsS0FBSyxFQUFFLFlBQVk7TUFBRUMsS0FBSyxFQUFFO0lBQW9CLENBQUMsRUFDbkQ7TUFBRUQsS0FBSyxFQUFFLFFBQVE7TUFBRUMsS0FBSyxFQUFFO0lBQWdCLENBQUMsRUFDM0M7TUFBRUQsS0FBSyxFQUFFLFFBQVE7TUFBRUMsS0FBSyxFQUFFO0lBQWdCLENBQUMsRUFDM0M7TUFBRUQsS0FBSyxFQUFFLFFBQVE7TUFBRUMsS0FBSyxFQUFFO0lBQWMsQ0FBQyxFQUN6QztNQUFFRCxLQUFLLEVBQUUsZUFBZTtNQUFFQyxLQUFLLEVBQUU7SUFBMkIsQ0FBQyxFQUM3RDtNQUFF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
