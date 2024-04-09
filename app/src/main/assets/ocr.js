function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */
/* global-module */
import detector from './helpers/detector.js';
import usebOCRWASMParser from './helpers/useb-ocr-wasm-parser.js';
import usebOCRAPIParser from './helpers/useb-ocr-api-parser.js';
import { isSupportWasm, measure, simd } from './helpers/wasm-feature-detect.js';
import ImageUtil from './helpers/image-util.js';
var instance;
var OPTION_TEMPLATE = new Object({
  // 디버깅 옵션
  showClipFrame: false,
  // cilp-frame 보기
  showCanvasPreview: false,
  // canvas preview 보기

  // 출력 옵션
  // 암호화
  // useEncryptModeJSLevel: false, // 암호화 적용 (개인고유식별부호 관련 항목 암호화)
  // useEncryptAllMode: false, // 암호화 적용 (전체 암호화, encrypt object 별도 제공)
  useEncryptValueMode: false,
  useEncryptOverallMode: false,
  // 암호화 적용 (ocr 이미지, 마스킹 이미지, 얼굴이미지 포함)
  useEncryptMode: false,
  // 암호화 적용 (pii)
  useLegacyFormat: false,
  // Legacy format 지원
  useMaskInfo: true,
  // 마스킹 좌표 지원
  useFaceImage: true,
  // 신분증 내 얼굴 사진
  useImageCropping: false,
  // 신분증 이미지를 Cropping(크롭 보정 할지 여부)
  useImageWarping: false,
  // 신분증 이미지를 Warping(왜곡 보정 할지 여부)
  useCompressImage: false,
  // 신분증 이미지를 압축할지 여부
  useCompressImageMaxWidth: 1080,
  // 이미지 리사이징 가로 해상도
  useCompressImageMaxVolume: 1024 * 50,
  // 이미지 압축 목표 용량
  ocrResultIdcardKeylist: [],
  // 주민증/면허증 평문 결과 출력 키 목록
  encryptedOcrResultIdcardKeylist: [],
  // 주민증/면허증 암호화 결과 출력 키 목록
  ocrResultPassportKeylist: [],
  // 여권 평문 결과 출력 키 목록
  encryptedOcrResultPassportKeylist: [],
  // 여권 암호화 결과 출력 키 목록
  ocrResultAlienKeylist: [],
  // 외국인등록증 평문 결과 출력 키 목록
  encryptedOcrResultAlienKeylist: [],
  // 외국인등록증 암호화 결과 출력 키 목록

  // UI 설정
  useTopUI: true,
  // 상단 UI
  useTopUITextMsg: false,
  //상단 UI > TEXT
  useMiddleUI: true,
  //중단 UI
  useMiddleUITextMsg: true,
  // 중단 UI > TEXT
  useBottomUI: true,
  // 하단 UI
  useBottomUITextMsg: false,
  // 하단 UI > TEXT
  usePreviewUI: true,
  // Preview UI
  useCaptureUI: true,
  // 캡처버튼 UI
  preloadingUITextMsg: '신분증인증 모듈을 불러오는 중 입니다<br />잠시만 기다려주세요',
  // 인식 프레임 옵션
  frameBorderStyle: {
    width: 5,
    // border-width
    radius: 20,
    // border-radius
    style: 'solid',
    // border-style

    // 단계별 인식 프레임 border 색상
    not_ready: '#000000',
    // 스캔준비 : 검정
    ready: '#b8b8b8',
    // 스캔대기 : 회색
    detect_success: '#5e8fff',
    // 카드검출 성공 : 하늘
    detect_failed: '#725b67',
    // 카드검출 실패 : 보라
    manual_capture_success: '#5e8fff',
    // 수동촬영 성공 : 하늘
    manual_capture_failed: '#725b67',
    // 수동촬영 실패 : 보라
    recognized: '#003ac2',
    // OCR완료 : 파랑
    recognized_with_ssa: '#003ac2',
    // 사본판별중(사본판별 ON) : 파랑
    ocr_success: '#14b00e',
    // OCR완료 : 초록
    ocr_success_with_ssa: '#14b00e',
    // OCR완료(사본판별 ON) : 초록
    ocr_failed: '#FA113D' // OCR실패 : 빨강
  },

  // 마스크 프레임 fill 컬러 변경 사용 여부
  useMaskFrameColorChange: true,
  // 마스크 프레임 옵션 (카메라 비디오 영역에서 인식 프레임만 보이게 하고 나머지를 덮어쓰는 프레임 영역)
  maskFrameStyle: {
    clip_frame: '#ff00bf',
    // clip-frame 색상 : 딥퍼플 (수정불가)
    base_color: '#333333',
    // mask-frame 색상 : 다크그레이 (투명도는 수정불가 ff로 고정)

    // 단계별 마스크 프레임 fill 색상
    not_ready: '#333333',
    // 스캔준비
    ready: '#333333',
    // 스캔대기
    detect_success: '#222222',
    // 카드검출 성공
    detect_failed: '#333333',
    // 카드검출 실패
    manual_capture_success: '#222222',
    // 수동촬영 성공
    manual_capture_failed: '#333333',
    // 수동촬영 실패
    recognized: '#222222',
    // OCR완료
    recognized_with_ssa: '#222222',
    // 사본판별중(사본판별 ON)
    ocr_success: '#111111',
    //OCR완료
    ocr_success_with_ssa: '#111111',
    // OCR완료(사본판별 ON)
    ocr_failed: '#111111' // OCR실패
  },

  // 촬영옵션
  useAutoSwitchToServerMode: false,
  // 저사양 단말에서 서버OCR로 자동 전환 기능
  useManualSwitchToServerMode: false,
  // 수동으로 서버OCR 전환 기능 (수동이 true이면 자동은 무시됨)
  switchToServerThreshold: 20,
  // 자동전환 기준값 (성능 측정치 ms)
  useForceCompleteUI: false,
  // WASM 모드일때 버튼 누를시 해당 시점에 강제로 완료 사용여부

  // 수동촬영 버튼 옵션
  captureButtonStyle: {
    stroke_color: '#ffffff',
    // 버튼 테두리(stroke) 색상
    base_color: '#5e8fff' // 버튼 색상
  },

  resourceBaseUrl: window.location.origin,
  // wasm, data 파일 리소스 base 경로 (CDN 사용시 변경)
  deviceLabel: '',
  videoTargetId: '',
  // 카메라 설정
  rotationDegree: 0,
  // rotation-degree 카메라가 회전된 각도 (90, 190, 270)
  mirrorMode: false,
  // mirror-mode 셀피 카메라(키오스크 등) 사용시 좌우 반전
  cameraResourceRequestRetryInterval: 1000,
  // 카메라 리소스 재요청 간격(ms)
  cameraResourceRequestRetryLimit: -1,
  // 카메라 리소스 재요청 최대 횟수, -1이면 무한 재요청.

  // 카메라 해상도 설정  : 'compatibility' (호환성 우선) || 'highQuality' (고화질 우선)
  // cameraResolutionCriteria: 'compatibility', // 호환성 우선(권장, 디폴트) : 720으로 고정, 저사양 단말기 호환성 좋음
  cameraResolutionCriteria: 'highQuality',
  // 고화질 우선 : 1080이 가능하면 1080 불가능하면 720

  // 가이드 박스 설정 : 'cameraResolution' (카메라 해상도) || 'ocrViewSize' (ocr div 크기)
  calcGuideBoxCriteria: 'cameraResolution',
  // 카메라 해상도 기준(권장, 디폴트) : 720x1280 해상도(세로모드) 일때 ocr view width size가 720보다 큰 경우, 가이드 박스를 720에 맞춤 (preview 화면 깨짐 없음)
  // calcGuideBoxCriteria: 'ocrViewSize', // 화면 사이즈 기준 : 720x1280 해상도(세로모드) 일때 ocr view width size가 720보다 큰경우, 가이드 박스를 ocr view width 사에즈에 맞춤 (preview 화면 강제로 늘리기 때문에 다소 깨짐)

  // 사본판별 RETRY 설정
  // ssaRetryType
  //   - REAL     : 본인(REAL) 거부율 -> False Negative(실제값은 REAL인데 예측값은 FAKE라서 틀린경우)를 낮추기 위해,
  //   - FAKE     : 타인(FAKE) 수락율 -> False Positive(실제값은 FAKE인데 예측값은 REAL이라서 틀린경우)를 낮추기 위해
  //   - ENSEMBLE : 평균 절대값 -> ssaMaxRetryCount 만큼 반복 수행하고 fd_confidence 절대값 값의 평균으로 판정
  // ssaMaxRetryCount 설정 값만큼 재시도하여 한번이라도 기준값(REAL 또는 FAKE)이 뜨면 기준값(REAL 또는 FAKE)로 판정
  ssaRetryType: 'ENSEMBLE',
  ssaRetryPivot: 0.5,
  // REAL/FAKE를 판정하는 fd_confidence 기준값 (wasm 배포 버전에 따라 다름) ※ 수정불가
  ssaMaxRetryCount: 0,
  // 최대 RETRY 회수설정 0이면 미사용

  // this.__debug()를 통해 찍은 메시지를 alert으로 띄울지 여부
  useDebugAlert: false,
  // WASM 리소스 갱신 여부
  force_wasm_reload: false,
  force_wasm_reload_flag: ''
});
class UseBOCR {
  /** constructor */
  constructor() {
    _defineProperty(this, "IN_PROGRESS", {
      NONE: 'none',
      NOT_READY: 'not_ready',
      READY: 'ready',
      CARD_DETECT_SUCCESS: 'detect_success',
      CARD_DETECT_FAILED: 'detect_failed',
      MANUAL_CAPTURE_SUCCESS: 'manual_capture_success',
      MANUAL_CAPTURE_FAILED: 'manual_capture_failed',
      OCR_RECOGNIZED: 'recognized',
      OCR_RECOGNIZED_WITH_SSA: 'recognized_with_ssa',
      OCR_SUCCESS: 'ocr_success',
      OCR_SUCCESS_WITH_SSA: 'ocr_success_with_ssa',
      OCR_FAILED: 'ocr_failed'
    });
    _defineProperty(this, "OCR_STATUS", {
      NOT_READY: -1,
      READY: 0,
      OCR_SUCCESS: 1,
      DONE: 2
    });
    _defineProperty(this, "PRELOADING_STATUS", {
      NOT_STARTED: -1,
      STARTED: 0,
      DONE: 1
    });
    _defineProperty(this, "OCR_IMG_MODE", {
      WARPING: 0,
      CROPPING: 1,
      NONE: 2
    });
    _defineProperty(this, "OCR_IMG_MASK_MODE", {
      FALSE: 0,
      TRUE: 1
    });
    /** public properties */
    /** private properties */
    _defineProperty(this, "__debugMode", false);
    _defineProperty(this, "__OCREngine", null);
    _defineProperty(this, "__isSupportWasm", false);
    _defineProperty(this, "__isSupportSimd", false);
    _defineProperty(this, "__initialized", false);
    _defineProperty(this, "__preloaded", false);
    _defineProperty(this, "__preloadingStatus", this.PRELOADING_STATUS.NOT_STARTED);
    _defineProperty(this, "__license", void 0);
    _defineProperty(this, "__ocrType", void 0);
    _defineProperty(this, "__ssaMode", false);
    _defineProperty(this, "__ocrStatus", this.OCR_STATUS.NOT_READY);
    _defineProperty(this, "__manualOCRMaxRetryCount", 10);
    _defineProperty(this, "__manualOCRRetryCount", 0);
    _defineProperty(this, "__ssaRetryCount", 0);
    _defineProperty(this, "__detectedCardQueue", []);
    _defineProperty(this, "__onSuccess", null);
    _defineProperty(this, "__onFailure", null);
    _defineProperty(this, "__onInProgressChange", null);
    _defineProperty(this, "__ocrTypeList", ['idcard', 'driver', 'passport', 'foreign-passport', 'alien', 'alien-back', 'credit', 'idcard-ssa', 'driver-ssa', 'passport-ssa', 'foreign-passport-ssa', 'alien-ssa']);
    _defineProperty(this, "__ocrTypeNumberToString", new Map([['1', 'idcard'], ['2', 'driver'], ['3', 'passport'], ['4', 'foreign-passport'], ['5', 'alien'], ['5-1', 'alien'], ['5-2', 'alien'], ['5-3', 'alien']]));
    _defineProperty(this, "__ocrStringToTypeNumber", new Map([['idcard', '1'], ['driver', '2'], ['passport', '3'], ['foreign-passport', '4'], ['alien', '5'], ['alien', '5-1'], ['alien', '5-2'], ['alien', '5-3']]));
    _defineProperty(this, "__ocrResultIdcardKeySet", new Set(['result_scan_type', 'name', 'jumin', 'issued_date', 'region', 'overseas_resident', 'driver_number', 'driver_serial', 'driver_type', 'aptitude_test_date_start', 'aptitude_test_date_end',
    // 'is_old_format_driver_number',
    // 'birth',

    'color_point', 'found_face', 'found_eye', 'specular_ratio', 'start_time', 'end_time', 'ocr_origin_image', 'ocr_masking_image', 'ocr_face_image']));
    _defineProperty(this, "__ocrResultPassportKeySet", new Set(['result_scan_type', 'name', 'sur_name', 'given_name', 'passport_type', 'issuing_country', 'passport_number', 'nationality', 'issued_date', 'sex', 'expiry_date', 'personal_number', 'jumin', 'birthday', 'name_kor', 'mrz1', 'mrz2', 'color_point', 'found_face', 'found_eye', 'specular_ratio', 'start_time', 'end_time', 'ocr_origin_image', 'ocr_masking_image', 'ocr_face_image']));
    _defineProperty(this, "__ocrResultAlienKeySet", new Set(['result_scan_type', 'name', 'jumin', 'issued_date', 'nationality', 'visa_type', 'name_kor', 'color_point', 'found_face', 'found_eye', 'specular_ratio', 'start_time', 'end_time', 'ocr_origin_image', 'ocr_masking_image', 'ocr_face_image']));
    _defineProperty(this, "__ocrResultTruthKeySet", new Set(['truth', 'conf']));
    _defineProperty(this, "__pageEnd", false);
    _defineProperty(this, "__ocr", void 0);
    _defineProperty(this, "__canvas", void 0);
    _defineProperty(this, "__rotationCanvas", void 0);
    _defineProperty(this, "__video", void 0);
    _defineProperty(this, "__videoWrap", void 0);
    _defineProperty(this, "__guideBox", void 0);
    _defineProperty(this, "__guideBoxWrap", void 0);
    _defineProperty(this, "__maskBoxWrap", void 0);
    _defineProperty(this, "__preventToFreezeVideo", void 0);
    _defineProperty(this, "__customUIWrap", void 0);
    _defineProperty(this, "__topUI", void 0);
    _defineProperty(this, "__middleUI", void 0);
    _defineProperty(this, "__bottomUI", void 0);
    _defineProperty(this, "__previewUIWrap", void 0);
    _defineProperty(this, "__previewUI", void 0);
    _defineProperty(this, "__previewImage", void 0);
    _defineProperty(this, "__captureUIWrap", void 0);
    _defineProperty(this, "__captureUI", void 0);
    _defineProperty(this, "__switchUIWrap", void 0);
    _defineProperty(this, "__switchUI", void 0);
    _defineProperty(this, "__captureButton", void 0);
    _defineProperty(this, "__address", 0);
    _defineProperty(this, "__detected", false);
    _defineProperty(this, "__recovered", false);
    _defineProperty(this, "__Buffer", null);
    _defineProperty(this, "__resultBuffer", null);
    _defineProperty(this, "__maskInfoResultBuf", null);
    _defineProperty(this, "__PrevImage", null);
    _defineProperty(this, "__stringOnWasmHeap", null);
    _defineProperty(this, "__camSetComplete", false);
    _defineProperty(this, "__resolutionWidth", 0);
    _defineProperty(this, "__resolutionHeight", 0);
    _defineProperty(this, "__videoWidth", 0);
    _defineProperty(this, "__videoHeight", 0);
    _defineProperty(this, "__resourcesLoaded", false);
    _defineProperty(this, "__intervalTimer", void 0);
    _defineProperty(this, "__cameraPermissionTimeoutTimer", void 0);
    _defineProperty(this, "__cameraResourceRetryCount", 0);
    _defineProperty(this, "__requestAnimationFrameId", void 0);
    _defineProperty(this, "__stream", void 0);
    _defineProperty(this, "__destroyScannerCallback", null);
    _defineProperty(this, "__facingModeConstraint", 'environment');
    _defineProperty(this, "__uiOrientation", '');
    _defineProperty(this, "__prevUiOrientation", '');
    _defineProperty(this, "__videoOrientation", '');
    _defineProperty(this, "__throttlingResizeTimer", null);
    _defineProperty(this, "__throttlingResizeDelay", 500);
    _defineProperty(this, "__maxRetryCountGetAddress", 300);
    // 임시
    _defineProperty(this, "__retryCountGetAddress", 0);
    // 임시
    _defineProperty(this, "__deviceInfo", void 0);
    _defineProperty(this, "__isRotated90or270", false);
    _defineProperty(this, "__inProgressStep", this.IN_PROGRESS.NOT_READY);
    _defineProperty(this, "__previousInProgressStep", this.IN_PROGRESS.NONE);
    _defineProperty(this, "__isInProgressHandleResize", false);
    _defineProperty(this, "__guideBoxRatioByWidth", 1.0);
    // 수정불가
    _defineProperty(this, "__videoRatioByHeight", 0.9);
    // 수정불가
    _defineProperty(this, "__guideBoxReduceRatio", 0.8);
    // 수정불가
    _defineProperty(this, "__cropImageSizeWidth", 0);
    _defineProperty(this, "__cropImageSizeHeight", 0);
    _defineProperty(this, "__isSwitchToServerMode", false);
    /** Default options */
    _defineProperty(this, "__options", _objectSpread({}, OPTION_TEMPLATE));
    if (instance) return instance;
    instance = this;
    return instance;
  }

  /** public methods */
  preloading(onPreloaded) {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (_this.isPreloaded()) {
        console.log('!!! PRELOADING SKIP, ALREADY PRELOADED !!!');
        if (onPreloaded) onPreloaded();
      } else {
        console.log('!!! PRELOADING START !!!');
        _this.showOCRLoadingUI();
        _this.__preloadingStatus = _this.PRELOADING_STATUS.STARTED;
        yield _this.__loadResources();
        _this.__preloadingStatus = _this.PRELOADING_STATUS.DONE;
        _this.__preloaded = true;
        if (onPreloaded) onPreloaded();
        _this.hideOCRLoadingUI();
        console.log('!!! PRELOADING END !!!');
      }
    })();
  }
  isInitialized() {
    return this.__initialized;
  }
  isPreloaded() {
    return this.__preloaded;
  }
  getPreloadingStatus() {
    return this.__preloadingStatus;
  }
  isEncryptMode() {
    return this.__options.useEncryptMode || this.__options.useEncryptValueMode || this.__options.useEncryptOverallMode;
  }
  isCreditCard() {
    return this.__ocrType === 'credit';
  }
  showOCRLoadingUI() {
    var {
      preloadingUIWrap
    } = detector.getOCRElements();
    if (preloadingUIWrap) {
      preloadingUIWrap.style.display = 'flex';
    }
  }
  hideOCRLoadingUI() {
    var {
      preloadingUIWrap
    } = detector.getOCRElements();
    if (preloadingUIWrap) {
      preloadingUIWrap.style.display = 'none';
    }
  }

  // 미사용 : wasm 레벨에서 암호화하여 불필요 해짐
  // encryptResult(review_result) {
  //   if (this.isCreditCard()) {
  //     return;
  //   }
  //
  //   if (this.isEncryptMode() && this.__isSupportWasm) {
  //     // prettier-ignore
  //     if (this.__options.useEncryptModeJSLevel) {
  //       const includeList = ['jumin', 'driver_number', 'passport_number', 'personal_number', 'mrz2'];
  //       const encrypted = {
  //         ocr_result: _.toPairs(_.pick(review_result.ocr_result, includeList)).reduce((acc, [key, value]) => {
  //           acc[key] = this.__encryptScanResult(value);
  //           return acc;
  //         }, {}),
  //         ocr_origin_image: this.__encryptScanResult(review_result.ocr_origin_image),
  //       };
  //
  //       review_result.ocr_result = {
  //         ...review_result.ocr_result,
  //         ...encrypted.ocr_result,
  //       };
  //       review_result.ocr_origin_image = encrypted.ocr_origin_image;
  //     } else if (this.__options.useEncryptAllMode) {
  //       const excludeList = [
  //         'complete',
  //         'result_scan_type',
  //         'color_point',
  //         'found_face',
  //         'specular_ratio',
  //         'start_time',
  //         'end_time',
  //         'fd_confidence',
  //         'id_truth',
  //         'id_truth_retry_count',
  //       ];
  //       const encrypted = {
  //         ocr_result: _.toPairs(_.omit(review_result.ocr_result, excludeList)).reduce((acc, [key, value]) => {
  //           acc[key] = this.__encryptScanResult(value);
  //           return acc;
  //         }, {}),
  //         ocr_origin_image: this.__encryptScanResult(review_result.ocr_origin_image),
  //         ocr_masking_image: this.__encryptScanResult(review_result.ocr_masking_image),
  //         ocr_face_image: this.__encryptScanResult(review_result.ocr_face_image),
  //       };
  //       review_result.encrypted = encrypted;
  //     } else if (this.__options.useEncryptOverallMode) {
  //       const excludeOcrResult = this.__options.encryptedOcrResultIdcardKeylist.includes('all') ? {} : _.omit(review_result.ocr_result, this.__options.encryptedOcrResultIdcardKeylist);
  //       const excludeOcrImage = this.__options.encryptedOcrResultPassportKeylist.includes('all') ? _.omit(review_result, [...this.__ocrResultPassportKeySet]) : _.omit(review_result, this.__options.encryptedOcrResultPassportKeylist);
  //       const encrypted = { ocr_result: excludeOcrResult, ...excludeOcrImage };
  //
  //       review_result.timestamp = Date.now();
  //       review_result.encrypted_overall = this.__encryptScanResult(JSON.stringify(encrypted));
  //     }
  //   }
  // }

  excludeOcrResult(ocr_result, excludeKeylist) {
    return _.omit(ocr_result, excludeKeylist);
  }
  excludeOcrImage(review_result, excludeKeylist) {
    return _.omit(review_result, excludeKeylist);
  }
  getOCREngine() {
    return this.__OCREngine;
  }
  init(settings) {
    if (!!!settings.licenseKey) throw new Error('License key is empty');
    this.__license = settings.licenseKey;
    if (!!settings.ocrResultIdcardKeylist || !!settings.encryptedOcrResultIdcardKeylist || !!settings.ocrResultPassportKeylist || !!settings.encryptedOcrResultPassportKeylist || !!settings.ocrResultAlienKeylist || !!settings.encryptedOcrResultAlienKeylist) {
      var ocrResultKeylistStringToIter = (str, keyIter) => str.toLowerCase().replace(/\s/g, '').split(',').filter(k => keyIter.has(k));
      settings.ocrResultIdcardKeylist = ocrResultKeylistStringToIter(settings.ocrResultIdcardKeylist, this.__ocrResultIdcardKeySet); // prettier-ignore
      settings.encryptedOcrResultIdcardKeylist = ocrResultKeylistStringToIter(settings.encryptedOcrResultIdcardKeylist, this.__ocrResultIdcardKeySet); // prettier-ignore
      settings.ocrResultPassportKeylist = ocrResultKeylistStringToIter(settings.ocrResultPassportKeylist, this.__ocrResultPassportKeySet); // prettier-ignore
      settings.encryptedOcrResultPassportKeylist = ocrResultKeylistStringToIter(settings.encryptedOcrResultPassportKeylist, this.__ocrResultPassportKeySet); // prettier-ignore
      settings.ocrResultAlienKeylist = ocrResultKeylistStringToIter(settings.ocrResultAlienKeylist, this.__ocrResultAlienKeySet); // prettier-ignore
      settings.encryptedOcrResultAlienKeylist = ocrResultKeylistStringToIter(settings.encryptedOcrResultAlienKeylist, this.__ocrResultAlienKeySet); // prettier-ignore
    }

    var mergedOptions = _.merge({}, this.__options, settings);
    this.setOption(mergedOptions);
    console.log(this.getOption());
    if (!this.isInitialized()) {
      this.__windowEventBind();
      this.__deviceInfo = detector.getOsVersion();
      console.debug('this.__deviceInfo.osSimple :: ' + this.__deviceInfo.osSimple);
      this.__isSupportWasm = isSupportWasm();
      if (!this.__isSupportWasm) {
        throw new Error('WebAssembly is not supported. in this browser.');
      }
      this.__initialized = true;
    }
  }
  setOption(settings) {
    this.__options = settings;
  }
  getOption() {
    return this.__options;
  }
  getOcrType(type) {
    return this.__ocrTypeNumberToString.get(type);
  }
  getOcrTypeNumber(string) {
    return this.__ocrStringToTypeNumber.get(string);
  }
  getUIOrientation() {
    return this.__uiOrientation;
  }
  getVideoOrientation() {
    return this.__videoOrientation;
  }
  checkSwitchToServerMode() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (_this2.__options.useManualSwitchToServerMode) {
        // 수동전환 on 이면 수동전환 우선
        return _this2.__isSwitchToServerMode;
      } else {
        // 수동전환 off 이면 자동전환 체크
        if (_this2.__options.useAutoSwitchToServerMode) {
          // 자동전환 on일때
          // 성능 측정값을 기준으로 WASM or Server
          var [latencyPer100ms, measureReport] = yield measure();
          _this2.__debug(measureReport);
          return latencyPer100ms > parseFloat(_this2.__options.switchToServerThreshold);
        } else {
          // 수동전환도 off, 자동전환 off
          return false;
        }
      }
    })();
  }
  startOCR(type, onSuccess, onFailure) {
    var _arguments = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var onInProgressChange = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : null;
      if (!!!type || !!!onSuccess || !!!onFailure) {
        console.debug('invalid parameter, so skip to startOCR()');
        return;
      }
      _this3.__isSwitchToServerMode = yield _this3.checkSwitchToServerMode();
      _this3.__ocrType = type;
      _this3.__ssaMode = _this3.__ocrType.indexOf('-ssa') > -1;
      _this3.__onSuccess = onSuccess;
      _this3.__onFailure = onFailure;
      _this3.__onInProgressChange = onInProgressChange;
      if (onInProgressChange) {
        if (_this3.__options.useTopUI) {
          _this3.__topUI = detector.getOCRElements().topUI;
        }
        if (_this3.__options.useMiddleUI) {
          _this3.__middleUI = detector.getOCRElements().middleUI;
        }
        if (_this3.__options.useBottomUI) {
          _this3.__bottomUI = detector.getOCRElements().bottomUI;
        }
      }
      yield _this3.__changeStage(_this3.IN_PROGRESS.NOT_READY);
      if (!_this3.isInitialized()) {
        throw new Error('Not initialized!');
      }
      try {
        _this3.__preprocess();
        yield _this3.__setupDomElements();
        if (_this3.__isSwitchToServerMode) {
          // serverMode
          // TODO : 서버 모드일때 wasm 암호화를 하더라도 JS에서 평문값을 받는순간 메모리에 남기때문의 무의미
          // if (this.isEncryptMode() && this.__isSupportWasm) {
          //   await this.__preloadingWasm(); // 서버모드 이지만 암호화 하기위해 wasm을 preloading 함
          // }
          yield _this3.__startScanServer();
        } else {
          // wasmMode
          yield _this3.__preloadingWasm();
          yield _this3.__startScanWasm();
        }
      } catch (e) {
        console.error('error in startOCR() : ' + e);
      } finally {
        _this3.stopOCR();
      }
    })();
  }
  stopOCR() {
    this.cleanup();
    this.__closeCamera();
    this.__onSuccess = null;
    this.__onFailure = null;
  }
  setIgnoreComplete(val) {
    this.__OCREngine.setIgnoreComplete(val);
  }

  // 미사용 : wasm 레벨에서 암호화하여 불필요 해짐
  // encrypt(plainStr) {
  //   return this.__encryptScanResult(plainStr);
  // }

  restartOCR(ocrType, onSuccess, onFailure, onInProgressChange) {
    var _arguments2 = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var isSwitchMode = _arguments2.length > 4 && _arguments2[4] !== undefined ? _arguments2[4] : false;
      if (!_this4.__camSetComplete) {
        console.debug("Camera setting is not completed yet. so, skip \"restartOCR()\"");
        return;
      }
      if (isSwitchMode) {
        yield _this4.stopOCR();
      } else {
        _this4.__closeCamera();
      }
      yield _this4.startOCR(ocrType, onSuccess, onFailure, onInProgressChange);
    })();
  }

  /** private methods */
  __waitPreloaded() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var waitingRetryCount = 0;
      return new Promise(resolve => {
        var check = () => {
          setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
            if (_this5.isPreloaded()) {
              resolve();
            } else {
              waitingRetryCount++;
              console.log('waiting for preloading WASM OCR module : ' + waitingRetryCount);
              check();
            }
          }), 500);
        };
        check();
      });
    })();
  }
  __preprocess() {
    var convertTypeToInteger = function convertTypeToInteger(option, defaultValue) {
      return isNaN(parseInt(option)) ? defaultValue : parseInt(option);
    };
    var convertTypeToFloat = function convertTypeToFloat(option, defaultValue) {
      return isNaN(parseFloat(option)) ? defaultValue : parseFloat(option);
    };
    var convertTypeToBoolean = function convertTypeToBoolean(option, defaultValue) {
      if (typeof option === 'string') {
        return option === 'true' ? true : defaultValue;
      } else {
        return option;
      }
    };
    var getOptionKeyListByType = (targetObj, targetType) => {
      if (targetType === 'boolean') {
        return Object.keys(targetObj).filter(value => {
          return typeof targetObj[value] === targetType;
        });
      } else if (targetType === 'integer') {
        return Object.keys(targetObj).filter(value => {
          return typeof targetObj[value] === 'number' && Number.isInteger(targetObj[value]);
        });
      } else if (targetType === 'float') {
        return Object.keys(targetObj).filter(value => {
          return typeof targetObj[value] === 'number' && !Number.isInteger(targetObj[value]);
        });
      } else {
        return [];
      }
    };

    // boolean type list 가져오기
    var booleanTypeOptions = getOptionKeyListByType(OPTION_TEMPLATE, 'boolean');
    console.debug('booleanTypeOptions: ' + booleanTypeOptions);

    // number type list 가져오기
    var integerTypeOptions = getOptionKeyListByType(OPTION_TEMPLATE, 'integer');
    console.debug('integerTypeOptions: ' + integerTypeOptions);

    // float type list 가져오기
    var floatTypeOptions = getOptionKeyListByType(OPTION_TEMPLATE, 'float');
    console.debug('floatTypeOptions: ' + floatTypeOptions);

    // boolean type 인 옵션에 string 값이 들어간 경우 boolean 변환 처리
    booleanTypeOptions.forEach(key => {
      this.__options[key] = convertTypeToBoolean(this.__options[key], OPTION_TEMPLATE[key]);
    });

    // integer type 인 옵션에 string 값이 들어간 경우 integer 변환 처리
    integerTypeOptions.forEach(key => {
      this.__options[key] = convertTypeToInteger(this.__options[key], OPTION_TEMPLATE[key]);
    });

    // float type 인 옵션에 string 값이 들어간 경우 float 변환 처리
    floatTypeOptions.forEach(key => {
      this.__options[key] = convertTypeToFloat(this.__options[key], OPTION_TEMPLATE[key]);
    });
    if (this.isEncryptMode() && this.__options.ssaMaxRetryCount > 0) {
      this.__options.ssaMaxRetryCount = 0;
      console.log('isEncryptMode is true. so, reset ssaMaxRetryCount to 0.');
    }
  }
  __windowEventBind() {
    var _this_ = this;
    if (/iphone|ipod|ipad/.test(window.navigator.userAgent.toLowerCase())) {
      var skipTouchActionforZoom = ev => {
        if (ev.touches.length > 1) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
        }
      };
      window.addEventListener('touchstart', skipTouchActionforZoom, {
        passive: false
      });
      window.addEventListener('touchmove', skipTouchActionforZoom, {
        passive: false
      });
      window.addEventListener('touchend', skipTouchActionforZoom, {
        passive: false
      });
    }
    window.onbeforeunload = function () {
      _this_.__pageEnd = true;
      _this_.cleanup();
    };
    var handleResize = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* () {
        if (!!!_this_.__ocrType) return;
        if (!_this_.__isInProgressHandleResize) {
          _this_.__isInProgressHandleResize = true;
          _this_.__throttlingResizeTimer = null;
          console.log('!!! RESIZE EVENT !!!');
          _this_.__isInProgressHandleResize = false;
          yield _this_.restartOCR(_this_.__ocrType, _this_.__onSuccess, _this_.__onFailure, _this_.__onInProgressChange);
        } else {
          console.log('!!! SKIP RESIZE EVENT - previous resize event process is not completed yet !!!');
        }
      });
      return function handleResize() {
        return _ref2.apply(this, arguments);
      };
    }();
    window.addEventListener('resize', /*#__PURE__*/_asyncToGenerator(function* () {
      if (!!!_this_.__throttlingResizeTimer) {
        _this_.__throttlingResizeTimer = setTimeout(handleResize, _this_.__throttlingResizeDelay);
      }
    }));
  }
  __debug(msg) {
    if (this.__options.useDebugAlert) {
      alert("[DEBUG INFO]\n".concat(msg));
    } else {
      console.debug("[DEBUG INFO]\n".concat(msg));
    }
  }
  __sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  __blobToBase64(blob) {
    return new Promise((resolve, _) => {
      var reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  __base64toBlob(base64) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(base64.split(',')[1]);

    // separate out the mime component
    var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mimeString
    });
  }
  __compressBase64Image(base64, options, constantNumber) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      if (base64 === null) return null;
      var blobFile = _this6.__base64toBlob(base64);
      var compressed = yield ImageUtil.compressImage(blobFile, options, constantNumber);
      var compressionRatio = Math.round((1 - compressed.size / blobFile.size) * 10000) / 100;
      console.log("Image Compression Done. ".concat(compressionRatio, "%. from ").concat(Math.round(blobFile.size / 1024), "KB to ").concat(Math.round(compressed.size / 1024), "KB"));
      return yield _this6.__blobToBase64(compressed);
    })();
  }

  /** 라이센스 키를 heap 에 allocation */
  __getStringOnWasmHeap() {
    if (!!!this.__license) {
      throw new Error('License Key is empty');
    }
    var lengthBytes = this.__OCREngine.lengthBytesUTF8(this.__license) + 1;
    this.__stringOnWasmHeap = this.__OCREngine._malloc(lengthBytes);
    this.__OCREngine.stringToUTF8(this.__license, this.__stringOnWasmHeap, lengthBytes);
    return this.__stringOnWasmHeap;
  }

  // 미사용 : wasm 레벨에서 암호화하여 불필요 해짐
  // __encryptScanResult(ocrResult) {
  //   let stringOnWasmHeap = null;
  //   try {
  //     if (typeof ocrResult === 'number' || typeof ocrResult === 'boolean') ocrResult = ocrResult.toString();
  //     if (ocrResult === '') return '';
  //     if (typeof ocrResult !== 'string' && !!!ocrResult) {
  //       throw new Error('ocrResult is empty');
  //     }
  //     const jsonString = ocrResult;
  //     const lengthBytes = this.__OCREngine.lengthBytesUTF8(jsonString) + 1;
  //     stringOnWasmHeap = this.__OCREngine._malloc(lengthBytes);
  //     this.__OCREngine.stringToUTF8(jsonString, stringOnWasmHeap, lengthBytes);
  //
  //     return this.__OCREngine.encryptResult(stringOnWasmHeap);
  //   } finally {
  //     if (stringOnWasmHeap) {
  //       this.__OCREngine._free(stringOnWasmHeap);
  //       stringOnWasmHeap = null;
  //     }
  //   }
  // }

  __setVideoResolution(videoElement) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var isSupportedResolution = false;
      var resolutionText = 'not ready';
      if (!_this7.__camSetComplete) {
        return {
          isSupportedResolution,
          resolutionText
        };
      }
      if (videoElement.videoWidth === 0 && videoElement.videoHeight === 0) {
        yield _this7.__changeStage(_this7.IN_PROGRESS.NOT_READY);
        return {
          isSupportedResolution,
          resolutionText
        };
      }
      resolutionText = videoElement.videoWidth + 'x' + videoElement.videoHeight;
      if (videoElement.videoWidth === 1080 && videoElement.videoHeight === 1920 || videoElement.videoWidth === 1920 && videoElement.videoHeight === 1080) {
        isSupportedResolution = true;
      } else if (videoElement.videoWidth === 1280 && videoElement.videoHeight === 720 || videoElement.videoWidth === 720 && videoElement.videoHeight === 1280) {
        isSupportedResolution = true;
      } else {
        videoElement.srcObject = null;
        isSupportedResolution = false;
      }
      _this7.__videoWidth = videoElement.videoWidth;
      _this7.__videoHeight = videoElement.videoHeight;
      return {
        isSupportedResolution,
        resolutionText
      };
    })();
  }
  __getScannerAddress(ocrType) {
    if (!this.__ocrTypeList.includes(ocrType)) throw new Error('Unsupported OCR type');
    try {
      var address = 0;
      var destroyCallback = null;
      var stringOnWasmHeap = this.__getStringOnWasmHeap();
      switch (ocrType) {
        // OCR
        case 'idcard':
        case 'driver':
        case 'idcard-ssa':
        case 'driver-ssa':
          address = this.__OCREngine.getIDCardScanner(stringOnWasmHeap);
          destroyCallback = () => this.__OCREngine.destroyIDCardScanner(address);
          break;
        case 'passport':
        case 'foreign-passport':
        case 'passport-ssa':
        case 'foreign-passport-ssa':
          address = this.__OCREngine.getPassportScanner(stringOnWasmHeap);
          destroyCallback = () => this.__OCREngine.destroyPassportScanner(address);
          break;
        case 'alien':
        case 'alien-back':
        case 'alien-ssa':
          address = this.__OCREngine.getAlienScanner(stringOnWasmHeap);
          destroyCallback = () => this.__OCREngine.destroyAlienScanner(address);
          break;
        case 'credit':
          address = this.__OCREngine.getCreditScanner(stringOnWasmHeap);
          destroyCallback = () => this.__OCREngine.destroyCreditScanner(address);
          break;
        default:
          throw new Error('Scanner does not exists');
      }
      this.__OCREngine._free(stringOnWasmHeap);
      if (address === 0) {
        if (this.__maxRetryCountGetAddress === this.__retryCountGetAddress) {
          throw new Error('Wrong License Key');
        }
        this.__retryCountGetAddress++;
      }
      return [address, destroyCallback];
    } catch (e) {
      // TODO : License Issue인 경우 에러 값을 받아서 error 로그를 찍을 수 있게 요청필요 (임시 N번 이상 address를 못받으면 강제 에러)
      console.error('getScannerAddressError()');
      console.error(e);
      throw e;
    }
  }
  __getBuffer() {
    if (!this.__Buffer) {
      this.__Buffer = this.__OCREngine._malloc(this.__resolutionWidth * this.__resolutionHeight * 4);
    }
    if (!this.__resultBuffer) {
      this.__resultBuffer = this.__OCREngine._malloc(4096);
    }
    if (this.__options.useMaskInfo) {
      if (!this.__maskInfoResultBuf) {
        this.__maskInfoResultBuf = this.__OCREngine._malloc(4096);
      }
    }
    return [this.__Buffer, this.__resultBuffer, this.__maskInfoResultBuf];
  }

  /** Free buffer */
  __destroyBuffer() {
    if (this.__Buffer) {
      this.__OCREngine._free(this.__Buffer);
      this.__Buffer = null;
    }
    this.__destroyResultBuffer();
    this.__destroyMaskInfoResultBuffer();
  }
  __destroyResultBuffer() {
    if (this.__resultBuffer !== null) {
      this.__OCREngine._free(this.__resultBuffer);
      this.__resultBuffer = null;
    }
  }
  __destroyMaskInfoResultBuffer() {
    if (this.__maskInfoResultBuf !== null) {
      this.__OCREngine._free(this.__maskInfoResultBuf);
      this.__maskInfoResultBuf = null;
    }
  }

  /** Free PrevImage buffer */
  __destroyPrevImage() {
    if (this.__PrevImage !== null) {
      this.__OCREngine._free(this.__PrevImage);
      this.__PrevImage = null;
    }
  }

  /** free string heap buffer */
  __destroyStringOnWasmHeap() {
    if (this.__stringOnWasmHeap) {
      this.__OCREngine._free(this.__stringOnWasmHeap);
      this.__stringOnWasmHeap = null;
    }
  }

  /** free scanner address */
  __destroyScannerAddress() {
    if (this.__destroyScannerCallback) {
      this.__destroyScannerCallback();
      this.__destroyScannerCallback = null;
    }
  }
  __isVideoResolutionCompatible(videoElement) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var {
        isSupportedResolution,
        resolutionText
      } = yield _this8.__setVideoResolution(videoElement);
      if (!isSupportedResolution) {
        if (resolutionText !== 'not ready') {
          console.error('Video Resolution(' + resolutionText + ') is not Supported!');
        }
      }
      return isSupportedResolution;
    })();
  }
  __getRotationDegree() {
    if (this.isEncryptMode()) {
      this.__options.rotationDegree = 0;
      console.log('isEncryptMode is true. so, reset rotateDegree to 0.');
    }
    return (this.__options.rotationDegree % 360 + 360) % 360;
  }
  __getMirrorMode() {
    return this.__options.mirrorMode;
  }
  __cropImageFromVideo() {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      if (!_this9.__camSetComplete) return [null, null, null];
      var [calcResolution_w, calcResolution_h] = [_this9.__resolutionWidth, _this9.__resolutionHeight];
      var {
        video,
        canvas,
        rotationCanvas
      } = detector.getOCRElements();

      // source image (or video)
      // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
      // ┃     ┊ sy                              ┃
      // ┃┈┈┈┈ ┏━━━━━━━━━━━━━━━┓ ┊               ┃
      // ┃ sx  ┃               ┃ ┊               ┃
      // ┃     ┃               ┃ ┊ sHeight       ┃
      // ┃     ┃               ┃ ┊               ┃               destination canvas
      // ┃     ┗━━━━━━━━━━━━━━━┛ ┊               ┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
      // ┃     ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈                 ┃    ┊                           ┃
      // ┃           sWidth                      ┃    ┊ dy                        ┃
      // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    ┏━━━━━━━━━━━━━━━┓ ┊         ┃
      //                                  ┃┈┈┈┈┈┈┈┈┈┈┈┃               ┃ ┊         ┃
      //                                  ┃    dx     ┃               ┃ ┊ dHeight ┃
      //                                  ┃           ┃               ┃ ┊         ┃
      //                                  ┃           ┗━━━━━━━━━━━━━━━┛ ┊         ┃
      //                                  ┃           ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈           ┃
      //                                  ┃                 dWidth                ┃
      //                                  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
      // drawImage(image, dx, dy)
      // drawImage(image, dx, dy, dWidth, dHeight)
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

      var calcCanvas = canvas;
      var calcVideoWidth = video.videoWidth;
      var calcVideoHeight = video.videoHeight;
      var calcVideoClientWidth = video.clientWidth;
      var calcVideoClientHeight = video.clientHeight;
      var calcCropImageSizeWidth = _this9.__cropImageSizeWidth;
      var calcCropImageSizeHeight = _this9.__cropImageSizeHeight;
      var calcVideoOrientation = _this9.__videoOrientation;
      var isAlienBack = _this9.__ocrType === 'alien-back';
      if (_this9.__isRotated90or270) {
        [calcCropImageSizeWidth, calcCropImageSizeHeight] = [calcCropImageSizeHeight, calcCropImageSizeWidth];
        [calcResolution_w, calcResolution_h] = [calcResolution_h, calcResolution_w];
        calcCanvas = rotationCanvas;
        calcVideoOrientation = _this9.__videoOrientation === 'portrait' ? 'landscape' : 'portrait';
      }
      var calcMaxSWidth = 99999;
      var calcMaxSHeight = 99999;
      if (_this9.__uiOrientation === 'portrait') {
        if (calcVideoOrientation === _this9.__uiOrientation) {
          // 세로 UI / 세로 카메라
          calcMaxSWidth = calcVideoWidth;
          calcMaxSHeight = calcVideoHeight;
        } else {
          // 세로 UI / 가로 카메라
          calcMaxSHeight = calcVideoHeight;
        }
      } else {
        if (calcVideoOrientation === _this9.__uiOrientation) {
          // 가로 UI / 가로 카메라
          calcMaxSHeight = calcVideoHeight;
        } else {
          // 가로 UI / 세로 카메라
          calcMaxSWidth = calcVideoWidth;
          calcMaxSHeight = calcVideoHeight;
        }
      }
      var sx, sy;
      var ratio = calcVideoWidth / calcVideoClientWidth;
      var sWidth = Math.min(Math.round(calcCropImageSizeWidth * ratio), calcMaxSWidth);
      var sHeight = Math.min(Math.round(calcCropImageSizeHeight * ratio), calcMaxSHeight);
      sx = Math.max(Math.round((calcVideoClientWidth - calcCropImageSizeWidth) / 2 * ratio), 0);
      sy = Math.max(Math.round((calcVideoClientHeight - calcCropImageSizeHeight) / 2 * ratio), 0);
      if (isAlienBack) {
        [calcResolution_w, calcResolution_h] = [calcResolution_h, calcResolution_w];
      }
      calcCanvas.setAttribute('width', calcResolution_w);
      calcCanvas.setAttribute('height', calcResolution_h);
      var calcContext = calcCanvas.getContext('2d', {
        willReadFrequently: true
      });
      calcContext.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, calcResolution_w, calcResolution_h);
      var imgData, imgDataUrl;
      imgData = calcContext.getImageData(0, 0, calcResolution_w, calcResolution_h);
      var useDataURL = false;
      if (isAlienBack) {
        useDataURL = true;
      } else {
        if (_this9.isEncryptMode()) {
          console.log('isEncryptMode is true. so, set imageDataURL to empty string');
        } else {
          useDataURL = true;
        }
      }
      imgDataUrl = useDataURL ? calcCanvas.toDataURL('image/jpeg') : '';
      if (isAlienBack) {
        [imgData, imgDataUrl] = yield _this9.__rotate(imgData, imgDataUrl, 270);
      }
      if (_this9.__isRotated90or270) {
        return yield _this9.__rotate(imgData, imgDataUrl, _this9.__getRotationDegree());
      } else {
        return [imgData, imgDataUrl];
      }
    })();
  }
  __rotate(imgData, imgDataUrl, degree) {
    return _asyncToGenerator(function* () {
      return new Promise(resolve => {
        if (degree === 0) {
          resolve([imgData, imgDataUrl]);
        }
        var img = new Image();
        var tempCanvas = document.createElement('canvas');
        img.src = imgDataUrl;
        img.addEventListener('load', /*#__PURE__*/_asyncToGenerator(function* () {
          // canvas = rotationCanvas;
          var tempContext = tempCanvas.getContext('2d');
          tempCanvas.style.position = 'absolute';
          if ([90, 270].includes(degree)) {
            tempCanvas.width = img.height;
            tempCanvas.height = img.width;
          } else if ([0, 180].includes(degree)) {
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
          }
          if (degree === 90) tempContext.translate(img.height, 0);else if (degree === 180) tempContext.translate(img.width, img.height);else if (degree === 270) tempContext.translate(0, img.width);
          tempContext.rotate(degree * Math.PI / 180);
          tempContext.drawImage(img, 0, 0);
          var newImageData = [90, 270].includes(degree) ? tempContext.getImageData(0, 0, img.height, img.width) : tempContext.getImageData(0, 0, img.width, img.height);
          resolve([newImageData, tempCanvas.toDataURL('image/jpeg')]);
          tempContext.restore();
        }));
      });
    })();
  }
  __isCardboxDetected(address) {
    var _arguments3 = arguments,
      _this10 = this;
    return _asyncToGenerator(function* () {
      var boxType = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : 0;
      var retryImg = _arguments3.length > 2 && _arguments3[2] !== undefined ? _arguments3[2] : null;
      if (!address || address < 0) {
        return [false, null];
      }
      try {
        var imgData;
        var imgDataUrl = null;
        var [buffer] = _this10.__getBuffer();
        if (retryImg !== null) {
          imgData = retryImg;
        } else {
          [imgData, imgDataUrl] = yield _this10.__cropImageFromVideo();
        }
        if (!!!imgData) {
          return [false, null];
        }
        _this10.__OCREngine.HEAP8.set(imgData.data, buffer);
        var kor = false,
          alien = false,
          passport = false;
        switch (_this10.__ocrType) {
          case 'idcard':
          case 'driver':
          case 'idcard-ssa':
          case 'driver-ssa':
            kor = true;
            break;
          case 'passport':
          case 'passport-ssa':
          case 'foreign-passport':
          case 'foreign-passport-ssa':
            passport = true;
            break;
          case 'alien':
          case 'alien-back':
          case 'alien-ssa':
            alien = true;
            break;
          case 'credit':
            // nothing
            break;
          default:
            throw new Error('Unsupported OCR type');
        }
        var result = null;
        if (kor || passport || alien) {
          result = _this10.__OCREngine.detect_idcard_opt(buffer, _this10.__resolutionWidth, _this10.__resolutionHeight, address, kor, alien, passport);
        } else {
          result = _this10.__OCREngine.detect_idcard(buffer, _this10.__resolutionWidth, _this10.__resolutionHeight, address, boxType);
        }

        // console.log('isCardboxDetected result -=-----', result)
        return [!!result, imgData, imgDataUrl];
      } catch (e) {
        var message = 'Card detection error : ' + e;
        if (e.toString().includes('memory')) {
          console.debug(message);
        } else {
          console.error('Card detection error : ' + e);
          throw e;
        }
      }
    })();
  }
  __startRecognition(address, ocrType, ssaMode, isSetIgnoreComplete, imgData, imgDataUrl) {
    var _this11 = this;
    return _asyncToGenerator(function* () {
      try {
        if (address === null) {
          return '';
        } else if (address === -1) {
          return 'checkValidation Fail';
        }
        var rawData = null;
        var ocrResult = null;
        if (!_this11.__ocrTypeList.includes(ocrType)) throw new Error('Unsupported OCR type');

        // const [, resultBuffer] = this.__getBuffer();

        var recognition = /*#__PURE__*/function () {
          var _ref5 = _asyncToGenerator(function* (isSetIgnoreComplete) {
            var _ocrResult, _ocrResult2;
            if (isSetIgnoreComplete) {
              yield _this11.__isCardboxDetected(address, 0, imgData);
            }
            switch (ocrType) {
              case 'idcard':
              case 'driver':
              case 'idcard-ssa':
              case 'driver-ssa':
                rawData = _this11.__OCREngine.scanIDCard(address, 0);
                break;
              case 'passport':
              case 'foreign-passport':
              case 'passport-ssa':
              case 'foreign-passport-ssa':
                rawData = _this11.__OCREngine.scanPassport(address, 0);
                break;
              case 'alien':
              case 'alien-ssa':
                rawData = _this11.__OCREngine.scanAlien(address, 0);
                break;
              case 'alien-back':
                rawData = _this11.__OCREngine.scanAlienBack(address, 0);
                break;
              case 'credit':
                rawData = _this11.__OCREngine.scanCredit(address, 0);
                break;
              default:
                throw new Error('Scanner does not exists');
            }

            // TODO: 신용카드는 아직 key:value 형태로 변환 안되어 있음
            if (_this11.isCreditCard()) {
              if (rawData === null || rawData === '' || rawData === 'false' || rawData[0] === 'false') {
                return false;
              } else {
                var {
                  originImage
                } = yield _this11.__getResultImages(ocrType, address);
                ocrResult = {
                  ocr_result: rawData,
                  ocr_origin_image: originImage
                };
                return true;
              }
            } else {
              if (rawData !== 'complete:false') {
                rawData = _this11.__stringToJson(rawData);

                // Pii encrypt 일때만 포멧이 다름
                if (_this11.isEncryptMode() && _this11.__options.useEncryptMode) {
                  ocrResult = {
                    ocr_result: rawData,
                    ocr_origin_image: rawData.ocr_origin_image,
                    ocr_masking_image: rawData.ocr_masking_image,
                    ocr_face_image: rawData.ocr_face_image
                  };
                  delete ocrResult.ocr_result.ocr_origin_image;
                  delete ocrResult.ocr_result.ocr_masking_image;
                  delete ocrResult.ocr_result.ocr_face_image;
                } else {
                  var ocrResultTmp = _objectSpread(_objectSpread({}, rawData.ocr_result), rawData);
                  delete ocrResultTmp.ocr_result;
                  ocrResult = {
                    ocr_result: ocrResultTmp,
                    ocr_origin_image: _this11.__ocrImageGuard(ocrResultTmp.ocr_origin_image),
                    ocr_masking_image: _this11.__ocrImageGuard(ocrResultTmp.ocr_masking_image),
                    ocr_face_image: _this11.__ocrImageGuard(ocrResultTmp.ocr_face_image)
                  };
                  delete ocrResult.ocr_result.ocr_origin_image;
                  delete ocrResult.ocr_result.ocr_masking_image;
                  delete ocrResult.ocr_result.ocr_face_image;

                  // valueEncryptMode 일때 포멧 맞춰주기
                  if (_this11.isEncryptMode() && _this11.__options.useEncryptValueMode) {
                    var encryptedOcrResult = _objectSpread({}, ocrResult.ocr_result.encrypted);
                    var encrypted = {
                      ocr_result: encryptedOcrResult,
                      ocr_origin_image: encryptedOcrResult.ocr_origin_image,
                      ocr_masking_image: encryptedOcrResult.ocr_masking_image,
                      ocr_face_image: encryptedOcrResult.ocr_face_image
                    };
                    delete encrypted.ocr_result.ocr_origin_image;
                    delete encrypted.ocr_result.ocr_masking_image;
                    delete encrypted.ocr_result.ocr_face_image;
                    ocrResult.encrypted = encrypted;
                    delete ocrResult.ocr_result.encrypted;
                  } else if (_this11.isEncryptMode() && _this11.__options.useEncryptOverallMode) {
                    ocrResult.encrypted_overall = ocrResult.ocr_result.encrypted_overall;
                    delete ocrResult.ocr_result.encrypted_overall;
                  }
                }

                // overall 인 경우만 timestamp 처리 /
                if (_this11.isEncryptMode() && _this11.__options.useEncryptOverallMode) {
                  ocrResult.timestamp = ocrResult.ocr_result.timestamp;
                  delete ocrResult.ocr_result.timestamp;
                } else {
                  delete ocrResult.ocr_result.timestamp;
                }
              }
            }
            if (((_ocrResult = ocrResult) === null || _ocrResult === void 0 || (_ocrResult = _ocrResult.ocr_result) === null || _ocrResult === void 0 ? void 0 : _ocrResult.complete) !== 'undefined' && ((_ocrResult2 = ocrResult) === null || _ocrResult2 === void 0 || (_ocrResult2 = _ocrResult2.ocr_result) === null || _ocrResult2 === void 0 ? void 0 : _ocrResult2.complete) === 'true') {
              return true;
            } else {
              if (isSetIgnoreComplete) {
                if (_this11.__manualOCRRetryCount < _this11.__manualOCRMaxRetryCount) {
                  // detectedCardQueue에서 한장을 꺼내서 갱신한다.
                  // 저장되어있는 이미지의 숫자가 retry 보다 작은경우 대비하여 %를 사용함
                  var queueIdx = _this11.__manualOCRRetryCount % _this11.__detectedCardQueue.length;
                  imgData = _this11.__detectedCardQueue[queueIdx];
                  _this11.__manualOCRRetryCount++;
                  return yield recognition(isSetIgnoreComplete);
                } else {
                  // 사진 한장으로 OCR 실패 (popup 내리고 setIgnoreComplete(false) 처리?
                  _this11.__manualOCRRetryCount = 0;
                  _this11.setIgnoreComplete(false);
                  _this11.__blurCaptureButton(); // 팝업이 내려갈때 처리되지만 미리 처리
                  yield _this11.__changeStage(_this11.IN_PROGRESS.MANUAL_CAPTURE_FAILED, false, imgDataUrl);
                  _this11.__setStyle(detector.getOCRElements().video, {
                    display: ''
                  });
                  return false;
                }
              } else {
                return false;
              }
            }
          });
          return function recognition(_x) {
            return _ref5.apply(this, arguments);
          };
        }();
        // end of function recognition()

        if (yield recognition(isSetIgnoreComplete)) {
          if (ssaMode) {
            yield _this11.__changeStage(_this11.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA, false, ocrResult.ocr_masking_image);
          } else {
            yield _this11.__changeStage(_this11.IN_PROGRESS.OCR_RECOGNIZED);
          }
          return ocrResult;
        } else {
          return false;
        }
      } catch (e) {
        console.error('startRecognition error:' + e);
        throw e;
      }
    })();
  }
  __getResultImages(ocrType, address) {
    var _this12 = this;
    return _asyncToGenerator(function* () {
      var originImageMode;
      if (_this12.isCreditCard()) {
        originImageMode = _this12.OCR_IMG_MODE.CROPPING;
      } else if (_this12.__options.useImageCropping) {
        originImageMode = _this12.OCR_IMG_MODE.CROPPING;
      } else if (_this12.__options.useImageWarping) {
        originImageMode = _this12.OCR_IMG_MODE.WARPING;
      } else {
        originImageMode = _this12.OCR_IMG_MODE.NONE;
      }
      var originImage;
      if (!_this12.isCreditCard() && _this12.isEncryptMode()) {
        originImage = _this12.__getPiiEncryptImageBase64(address, _this12.OCR_IMG_MASK_MODE.FALSE, originImageMode);
        console.log('encrypt base64 origin image', originImage);
      } else {
        originImage = yield _this12.__getImageBase64(address, _this12.OCR_IMG_MASK_MODE.FALSE, originImageMode);
      }
      var maskImageMode;
      var maskImage = null;
      var faceImage = null;
      if (!_this12.isCreditCard()) {
        if (_this12.__options.useImageCropping) {
          maskImageMode = _this12.OCR_IMG_MODE.CROPPING;
        } else {
          maskImageMode = _this12.OCR_IMG_MODE.WARPING;
        }
        if (_this12.isEncryptMode()) {
          maskImage = _this12.__getPiiEncryptImageBase64(address, _this12.OCR_IMG_MASK_MODE.TRUE, maskImageMode);
          faceImage = _this12.__options.useFaceImage ? _this12.__getPiiEncryptImageBase64(address, null, originImageMode, 'face') : null;
        } else {
          maskImage = yield _this12.__getImageBase64(address, _this12.OCR_IMG_MASK_MODE.TRUE, maskImageMode);
          maskImage = maskImage === 'data:' ? null : maskImage;
          faceImage = _this12.__options.useFaceImage ? yield _this12.__getImageBase64(address, null, originImageMode, 'face') : null;
        }
      }
      return {
        originImage,
        maskImage,
        faceImage
      };
    })();
  }
  __startTruth(ocrType, address) {
    return new Promise((resolve, reject) => {
      var [, resultBuffer] = this.__getBuffer();
      if (ocrType.indexOf('-ssa') > -1) {
        // TODO: worker를 사용하여 메인(UI 랜더링) 스레드가 멈추지 않도록 처리 필요 (현재 loading UI 띄우면 애니메이션 멈춤)
        // TODO: setTimeout 으로 나누더라도 효과 없음 setTimeout 지우고, worker로 변경 필요
        setTimeout(() => {
          resolve(this.__OCREngine.scanTruth(address, resultBuffer));
        }, 500);
      } else {
        reject(new Error('SSA Mode is true. but, ocrType is invalid : ' + ocrType));
      }
    });
  }
  __csvToObject(str) {
    var pairs = str.split(';');
    var obj = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split(':');
      if (pair.length === 2) obj[pair[0]] = pair[1];
    }
    return obj;
  }
  __stringToJson(str) {
    var obj = {};
    var keyValuePairs = str.match(/\w+:(?:\([^)]*\)|[^;]*)/g);
    if (keyValuePairs) {
      for (var i = 0; i < keyValuePairs.length; i++) {
        var pair = keyValuePairs[i].split(':');
        var key = pair[0].trim();
        var value = pair.slice(1).join(':').trim();
        if (value.startsWith('(') && value.endsWith(')')) {
          var subStr = value.substring(1, value.length - 1); // 서브 문자열 추출
          var subObj = this.__stringToJson(subStr); // 재귀적으로 서브 오브젝트 변환
          obj[key] = subObj;
        } else {
          obj[key] = value;
        }
      }
    }
    return obj;
  }
  __getMaskInfo(address) {
    if (address == null) {
      return '';
    } else if (address === -1) {
      return 'checkValidation Fail';
    }
    var [,, maskInfoResultBuf] = this.__getBuffer();
    var result = null;
    result = this.__OCREngine.getMaskRect(address, maskInfoResultBuf);
    if (result == null || result === '') {
      console.log("scan fail.");
    }

    // this.__destroyMaskInfoResultBuffer();

    return result === null ? null : this.__csvToObject(result);
  }
  __startTruthRetry(ocrType, address, imgData) {
    var _this13 = this;
    return _asyncToGenerator(function* () {
      yield _this13.__isCardboxDetected(address, 0, imgData);
      // await this.__startRecognition(address, ocrType, true);      // for 성능을 위해 진행 X
      return yield _this13.__startTruth(ocrType, address);
    })();
  }
  __setCameraPermissionTimeoutTimer() {
    var _this14 = this;
    this.__clearCameraPermissionTimeoutTimer();
    this.__cameraPermissionTimeoutTimer = setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
      // 1초 delay 후 실행
      yield _this14.__proceedCameraPermission();
    }), this.__options.cameraResourceRequestRetryInterval);
  }
  __proceedCameraPermission() {
    var _this15 = this;
    return _asyncToGenerator(function* () {
      try {
        _this15.__clearCameraPermissionTimeoutTimer();
        var isPassport = _this15.__ocrType.includes('passport');
        yield _this15.__setupVideo(isPassport);
        var {
          video
        } = detector.getOCRElements();
        if (video) {
          // const [track] = this.__stream.getVideoTracks();
          // const capability = track.getCapabilities();
          // console.debug('CardScan__initialize capability', capability);
          if ('srcObject' in video) {
            video.srcObject = _this15.__stream;
          } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(_this15.__stream);
          }
          video.addEventListener('loadedmetadata', () => {
            // console.debug('proceedCameraPermission - onloadedmetadata');
            video.play();
          });
          video.addEventListener('canplay', /*#__PURE__*/_asyncToGenerator(function* () {
            console.debug('canplay');

            // video element style 설정
            _this15.__videoOrientation = video.videoWidth / video.videoHeight < 1 ? 'portrait' : 'landscape';
            console.debug('this.__deviceInfo.osSimple :: ' + _this15.__deviceInfo.osSimple);
            console.debug('this.__uiOrientation :: ' + _this15.__uiOrientation);
            console.debug('this.__videoOrientation :: ' + _this15.__videoOrientation);
            _this15.__camSetComplete = true;
            yield _this15.__adjustStyle();
          }));
          yield _this15.__changeStage(_this15.IN_PROGRESS.READY);
          video.webkitExitFullscreen();
        } else {
          yield _this15.__changeStage(_this15.IN_PROGRESS.NOT_READY);
          _this15.__closeCamera();
        }
      } catch (e) {
        console.error('error', e.name, e);
        if (e.name === 'NotAllowedError') {
          var errorMessage = 'Camera Access Permission is not allowed';
          console.error(errorMessage);
          console.error(e);
          _this15.__onFailureProcess('E403', e, errorMessage);
        } else if (e.name === 'NotReadableError') {
          // 다른곳에서 카메라 자원을 사용중
          yield _this15.__changeStage(_this15.IN_PROGRESS.NOT_READY);
          _this15.stopStream();
          if (_this15.__options.cameraResourceRequestRetryLimit < 0) {
            // 카메라 리소스 재요청 횟수제한 없음
            _this15.__cameraResourceRetryCount += 1;
            _this15.__setCameraPermissionTimeoutTimer(); // 재귀 호출
          } else {
            if (_this15.__options.cameraResourceRequestRetryLimit > _this15.__cameraResourceRetryCount) {
              _this15.__cameraResourceRetryCount += 1;
              _this15.__setCameraPermissionTimeoutTimer(); // 재귀 호출
            } else {
              var _errorMessage = 'Camera permissions were granted, but Failed to acquire Camera resources.';
              _this15.__onFailureProcess('E403', e, _errorMessage);
            }
          }
        } else if (e.name === 'NotFoundError') {
          // 기기에 연결된 카메라가 없음
          var _errorMessage2 = 'Camera Not Found';
          console.error(_errorMessage2);
          console.error(e);
          _this15.__onFailureProcess('E404', e, _errorMessage2);
        } else {
          var _errorMessage3 = 'Unknown Error Occured';
          console.error(_errorMessage3);
          console.error(e);
          _this15.__onFailureProcess('E999', e, _errorMessage3);
        }
      }
    })();
  }
  __setStyle(el, style) {
    if (el && style) {
      Object.assign(el.style, style);
    }
  }
  __changeOCRStatus(val) {
    switch (val) {
      // OCR
      case this.IN_PROGRESS.NOT_READY:
        this.__ocrStatus = this.OCR_STATUS.NOT_READY;
        break;
      case this.IN_PROGRESS.READY:
        this.__ocrStatus = this.OCR_STATUS.READY;
        break;
      case this.IN_PROGRESS.OCR_RECOGNIZED:
      case this.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA:
        this.__ocrStatus = this.OCR_STATUS.OCR_SUCCESS;
        break;
      case this.IN_PROGRESS.OCR_SUCCESS:
      case this.IN_PROGRESS.OCR_SUCCESS_WITH_SSA:
      case this.IN_PROGRESS.OCR_FAILED:
        this.__ocrStatus = this.OCR_STATUS.DONE;
        break;
    }
  }
  __changeStage(val) {
    var _arguments4 = arguments,
      _this16 = this;
    return _asyncToGenerator(function* () {
      var forceUpdate = _arguments4.length > 1 && _arguments4[1] !== undefined ? _arguments4[1] : false;
      var recognizedImage = _arguments4.length > 2 && _arguments4[2] !== undefined ? _arguments4[2] : null;
      if (_this16.__previousInProgressStep === val && forceUpdate === false) {
        return;
      }
      _this16.__changeOCRStatus(val);
      _this16.__previousInProgressStep = val;
      _this16.__inProgressStep = val;
      var {
        guideBox,
        maskBoxWrap,
        captureButton
      } = detector.getOCRElements();
      var style = {
        borderWidth: _this16.__options.frameBorderStyle.width + 'px',
        borderStyle: _this16.__options.frameBorderStyle.style,
        borderRadius: _this16.__options.frameBorderStyle.radius + 'px',
        borderColor: _this16.__options.frameBorderStyle[val]
      };
      if (guideBox) {
        _this16.__setStyle(guideBox, style);
      }
      if (_this16.__options.useMaskFrameColorChange) {
        if (!!_this16.__options.showClipFrame) {
          console.log('MaskFrameColorChange is skipped! (cause : showClipFrame option is true)');
        } else {
          var _maskBoxWrap$querySel;
          maskBoxWrap === null || maskBoxWrap === void 0 || (_maskBoxWrap$querySel = maskBoxWrap.querySelector('#maskBoxOuter')) === null || _maskBoxWrap$querySel === void 0 ? void 0 : _maskBoxWrap$querySel.setAttribute('fill', _this16.__options.maskFrameStyle[val]);
        }
      }
      if (_this16.__options.useCaptureUI) {
        var _captureButton$queryS;
        captureButton === null || captureButton === void 0 || (_captureButton$queryS = captureButton.querySelector('#captureButton')) === null || _captureButton$queryS === void 0 ? void 0 : _captureButton$queryS.setAttribute('fill', _this16.__options.captureButtonStyle['base_color']);
      }
      var ocrMode = _this16.__isSwitchToServerMode ? 'server' : 'wasm';
      if (_this16.__onInProgressChange) {
        if (_this16.__options.useTopUI || _this16.__options.useTopUITextMsg) {
          _this16.__onInProgressChange.call(_this16, ocrMode, _this16.__ocrType, _this16.__inProgressStep, _this16.__topUI, 'top', _this16.__options.useTopUITextMsg, _this16.__options.useCaptureUI, _this16.__options.usePreviewUI, recognizedImage);
        }
        if (_this16.__options.useMiddleUI || _this16.__options.useMiddleUITextMsg) {
          _this16.__onInProgressChange.call(_this16, ocrMode, _this16.__ocrType, _this16.__inProgressStep, _this16.__middleUI, 'middle', _this16.__options.useMiddleUITextMsg, _this16.__options.useCaptureUI, _this16.__options.usePreviewUI, recognizedImage);
        }
        if (_this16.__options.useBottomUI || _this16.__options.useBottomUITextMsg) {
          _this16.__onInProgressChange.call(_this16, ocrMode, _this16.__ocrType, _this16.__inProgressStep, _this16.__bottomUI, 'bottom', _this16.__options.useBottomUITextMsg, _this16.__options.useCaptureUI, _this16.__options.usePreviewUI, recognizedImage);
        }
      }
      if (val === _this16.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS || val === _this16.IN_PROGRESS.MANUAL_CAPTURE_FAILED) {
        if (_this16.__options.usePreviewUI) {
          _this16.__updatePreviewUI(recognizedImage);

          // FAIL인 경우 5초후 자동을 창닫음
          if (val === _this16.IN_PROGRESS.MANUAL_CAPTURE_FAILED) {
            setTimeout(_this16.__hidePreviewUI, 3000, _this16);
          }
        }
      }
      if (val === _this16.IN_PROGRESS.OCR_RECOGNIZED_WITH_SSA) {
        var {
          video
        } = detector.getOCRElements();
        _this16.__setStyle(video, {
          display: 'none'
        });
        if (_this16.__options.usePreviewUI) {
          _this16.__updatePreviewUI(recognizedImage);
        }
      }
      if (val === _this16.IN_PROGRESS.OCR_SUCCESS_WITH_SSA) {
        if (_this16.__options.usePreviewUI) {
          _this16.__hidePreviewUI();
        }
      }
      yield _this16.__sleep(1); // for UI update
    })();
  }

  __updatePreviewUI(recognizedImage) {
    var {
      previewUIWrap,
      previewImage
    } = detector.getOCRElements();
    previewImage.src = recognizedImage;
    var imgStyle = {
      'max-width': '70%',
      'max-height': '60%'
    };
    this.__setStyle(previewImage, imgStyle);
    this.__setStyle(previewUIWrap, {
      display: 'flex'
    });
  }
  __hidePreviewUI(context) {
    var _this_ = this;
    if (context) {
      _this_ = context;
    }
    var {
      video,
      previewUIWrap,
      previewImage
    } = detector.getOCRElements();
    _this_.__setStyle(video, {
      display: 'block'
    });
    _this_.__setStyle(previewUIWrap, {
      display: 'none'
    });
    previewImage.src = '';
  }
  __getInputDevices() {
    var _this17 = this;
    return _asyncToGenerator(function* () {
      // throw error if navigator.mediaDevices is not supported
      if (!navigator.mediaDevices) {
        throw new Error('navigator.mediaDevices is not supported');
      }
      var devices = yield navigator.mediaDevices.enumerateDevices();
      var camera = [];
      for (var device of devices) {
        if (device.kind === 'videoinput') {
          try {
            if (device instanceof InputDeviceInfo) {
              if (device.getCapabilities) {
                var _cap$facingMode;
                var cap = device.getCapabilities();
                if (cap !== null && cap !== void 0 && (_cap$facingMode = cap.facingMode) !== null && _cap$facingMode !== void 0 && _cap$facingMode.includes(_this17.__facingModeConstraint)) {
                  var _device$label;
                  var isUltraCameraReg = /ultra|울트라/gi;
                  if (isUltraCameraReg.test((_device$label = device.label) === null || _device$label === void 0 ? void 0 : _device$label.toLowerCase())) continue;
                  camera.push(cap.deviceId);
                }
              }
            }
          } catch (e) {
            // iOS 17 미만의 chrome, safari 에서는
            // InputDeviceInfo 객체가 없어서 getCapabilities를 확인할 수 없기 때문에
            // device label만 보고 후면 카메라로 사용
            if (e instanceof ReferenceError) {
              var _device$label2;
              var isBackCameraReg = /back|후면/g;
              if ((_device$label2 = device.label) !== null && _device$label2 !== void 0 && _device$label2.length && isBackCameraReg.test(device.label)) {
                camera.push(device.deviceId);
              }
            }
          }
        }
      }
      _this17.__debug("camera = ".concat(camera, ", camera.length = ").concat(camera.length));
      return camera;
    })();
  }
  checkUIOrientation() {
    var current = detector.getUIOrientation(detector.getOCRElements().ocr);
    var isChanged = false;
    if (current !== this.__prevUiOrientation) {
      this.__uiOrientation = current;
      this.__prevUiOrientation = current;
      isChanged = true;
    }
    return {
      current,
      isChanged
    };
  }
  __clearCustomUI(obj) {
    obj.innerHTML = '';
    obj.removeAttribute('style');
    obj.removeAttribute('class');
    this.__setStyle(obj, {
      display: 'none'
    });
  }
  __setupDomElements() {
    var _this18 = this;
    return _asyncToGenerator(function* () {
      var {
        ocr,
        video,
        canvas,
        rotationCanvas,
        guideBox,
        videoWrap,
        guideBoxWrap,
        maskBoxWrap,
        preventToFreezeVideo,
        customUIWrap,
        topUI,
        middleUI,
        bottomUI,
        captureUIWrap,
        captureUI,
        captureButton,
        previewUIWrap,
        previewUI,
        previewImage,
        switchUIWrap,
        switchUI,
        preloadingUIWrap,
        preloadingUI
      } = detector.getOCRElements();
      if (!ocr) throw new Error('ocr div element is not exist');
      if (videoWrap) videoWrap.remove();
      if (guideBoxWrap) guideBoxWrap.remove();
      if (video) video.remove();
      if (canvas) canvas.remove();
      if (rotationCanvas) rotationCanvas.remove();
      if (guideBox) guideBox.remove();
      if (maskBoxWrap) maskBoxWrap.remove();
      if (preventToFreezeVideo) preventToFreezeVideo.remove();
      if (customUIWrap) customUIWrap.remove();
      // 각 top, middle, bottom UI를 미사용일 경우 안의 내용을 삭제
      if (topUI && !_this18.__options.useTopUI) _this18.__clearCustomUI(topUI);
      if (middleUI && !_this18.__options.useMiddleUI) _this18.__clearCustomUI(middleUI);
      if (bottomUI && !_this18.__options.useBottomUI) _this18.__clearCustomUI(bottomUI);
      if (captureUIWrap) captureUIWrap.remove();
      // capture UI를 미사용일 경우 안의 내용을 삭제
      if (captureUI && !_this18.__options.useCaptureUI) _this18.__clearCustomUI(captureUI);
      if (previewUIWrap) previewUIWrap.remove();
      // preview UI를 미사용일 경우 안의 내용을 삭제
      if (previewUI && !_this18.__options.usePreviewUI) _this18.__clearCustomUI(previewUI);
      if (switchUIWrap) switchUIWrap.remove();
      // switch UI를 미사용일 경우 안의 내용을 삭제
      if (switchUI && !_this18.__options.useManualSwitchToServerMode) _this18.__clearCustomUI(switchUI);
      if (preloadingUIWrap) preloadingUIWrap.remove();
      var rotationDegree = _this18.__getRotationDegree();
      _this18.__isRotated90or270 = [90, 270].includes(rotationDegree);
      var ocrStyle = {
        width: '100%',
        height: '100%'
      };
      _this18.__setStyle(ocr, ocrStyle);
      var wrapStyle = {
        position: 'absolute',
        display: 'flex',
        // vertical align middle
        'align-items': 'center',
        'justify-content': 'center',
        width: '100%',
        height: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      };
      videoWrap = document.createElement('div');
      videoWrap.setAttribute('data-useb-ocr', 'videoWrap');
      if (videoWrap) {
        while (videoWrap.firstChild) {
          videoWrap.removeChild(videoWrap.lastChild);
        }
        _this18.__setStyle(videoWrap, wrapStyle);
      }
      ocr.appendChild(videoWrap);
      maskBoxWrap = document.createElement('svg');
      maskBoxWrap.setAttribute('data-useb-ocr', 'maskBoxWrap');
      maskBoxWrap.setAttribute('fill', 'none');
      maskBoxWrap.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      _this18.__setStyle(maskBoxWrap, wrapStyle);
      var mask_frame = _this18.__options.maskFrameStyle.base_color + 'ff';
      if (!!_this18.__options.showClipFrame) {
        mask_frame = _this18.__options.maskFrameStyle.clip_frame + '55';
      }
      maskBoxWrap.innerHTML = '' + "  <svg id='maskBoxContainer' width='100%' height='100%' fill='none' xmlns='http://www.w3.org/2000/svg'>\n" + "    <mask id='mask-rect'>\n" + "      <rect width='100%' height='100%' fill='white'></rect>\n" + "      <svg x='50%' y='50%' overflow='visible'>\n" + "          <rect id='maskBoxInner'\n" + "            width='400' height='260'\n" + "            x='-200' y='-130'\n" + "            rx='10' ry='10'\n" + "            fill='black' stroke='black'></rect>\n" + '      </svg>\n' + '    </mask>\n' + "    <rect id='maskBoxOuter'\n" + "          x='0' y='0' width='100%' height='100%'\n" + "          fill='" + mask_frame + "' mask='url(#mask-rect)'></rect>\n" + '  </svg>';
      ocr.appendChild(maskBoxWrap);
      video = document.createElement('video');
      video.setAttribute('data-useb-ocr', 'video');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      var videoStyle = {
        position: 'relative',
        width: '100%'
      };
      var rotateCss = 'rotate(' + rotationDegree + 'deg)';
      var mirrorCss = 'rotateY(180deg)';
      var rotateAndMirrorCss = mirrorCss + ' ' + rotateCss;
      if (_this18.__isRotated90or270) {
        if (_this18.__getMirrorMode()) {
          videoStyle = _objectSpread(_objectSpread({}, videoStyle), {}, {
            '-webkit-transform': rotateAndMirrorCss,
            '-moz-transform': rotateAndMirrorCss,
            '-o-transform': rotateAndMirrorCss,
            '-ms-transform': rotateAndMirrorCss,
            transform: rotateAndMirrorCss
          });
        } else {
          videoStyle = _objectSpread(_objectSpread({}, videoStyle), {}, {
            '-webkit-transform': rotateCss,
            '-moz-transform': rotateCss,
            '-o-transform': rotateCss,
            '-ms-transform': rotateCss,
            transform: rotateCss
          });
        }
      } else {
        if (_this18.__getMirrorMode()) {
          videoStyle = _objectSpread(_objectSpread({}, videoStyle), {}, {
            '-webkit-transform': mirrorCss,
            '-moz-transform': mirrorCss,
            '-o-transform': mirrorCss,
            '-ms-transform': mirrorCss,
            transform: mirrorCss
          });
        }
      }
      _this18.__setStyle(video, videoStyle);
      videoWrap.appendChild(video);
      guideBoxWrap = document.createElement('div');
      guideBoxWrap.setAttribute('data-useb-ocr', 'guideBoxWrap');
      _this18.__setStyle(guideBoxWrap, wrapStyle);
      ocr.appendChild(guideBoxWrap);
      guideBox = document.createElement('svg');
      guideBox.setAttribute('data-useb-ocr', 'guideBox');
      guideBox.setAttribute('fill', 'none');
      guideBox.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      _this18.__setStyle(guideBox, {
        width: '100%',
        margin: '0 auto',
        position: 'absolute'
      });
      guideBoxWrap.appendChild(guideBox);
      canvas = document.createElement('canvas');
      canvas.setAttribute('data-useb-ocr', 'canvas');
      var canvasStyle = {
        display: _this18.__options.showCanvasPreview ? _this18.__isRotated90or270 ? 'none' : 'display' : 'none',
        width: '25%',
        position: 'absolute',
        left: '0px',
        top: '30px',
        border: 'green 2px solid'
      };
      _this18.__setStyle(canvas, canvasStyle);
      ocr.appendChild(canvas);
      rotationCanvas = document.createElement('canvas');
      rotationCanvas.setAttribute('data-useb-ocr', 'rotationCanvas');
      _this18.__setStyle(rotationCanvas, {
        display: _this18.__options.showCanvasPreview ? _this18.__isRotated90or270 ? 'display' : 'none' : 'none',
        height: '25%',
        position: 'absolute',
        right: '0px',
        top: '30px',
        border: 'blue 2px solid'
      });
      ocr.appendChild(rotationCanvas);
      preventToFreezeVideo = document.createElement('div');
      preventToFreezeVideo.setAttribute('data-useb-ocr', 'preventToFreezeVideo');
      _this18.__setStyle(preventToFreezeVideo, {
        position: 'absolute',
        bottom: '10',
        right: '10'
      });
      preventToFreezeVideo.innerHTML = '' + '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="32px" height="32px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n' + '  <circle cx="84" cy="50" r="10" fill="#86868600">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="0.5555555555555556s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>\n' + '    <animate attributeName="fill" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#86868600;#86868600;#86868600;#86868600;#86868600" begin="0s"></animate>\n' + '  </circle>' + '  <circle cx="16" cy="50" r="10" fill="#86868600">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>\n' + '  </circle>' + '  <circle cx="50" cy="50" r="10" fill="#86868600">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5555555555555556s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5555555555555556s"></animate>\n' + '  </circle>' + '  <circle cx="84" cy="50" r="10" fill="#86868600">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1111111111111112s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1111111111111112s"></animate>\n' + '  </circle>' + '  <circle cx="16" cy="50" r="10" fill="#86868600">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666665s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666665s"></animate>\n' + '  </circle>' + '</svg>';
      ocr.appendChild(preventToFreezeVideo);
      customUIWrap = document.createElement('div');
      customUIWrap.setAttribute('data-useb-ocr', 'customUIWrap');
      var customUIWrapStyle = _objectSpread(_objectSpread({}, wrapStyle), {}, {
        'flex-direction': 'column'
      });
      _this18.__setStyle(customUIWrap, customUIWrapStyle);
      ocr.appendChild(customUIWrap);

      // 각 top, middle, bottom UI 사용(use)여부와 관계없이 영역을 잡기 위해, div가 없으면 생성
      // adjustStyle() 에서 세부적인 사이즈와 위치값 동적으로 설정됨.
      if (!topUI) {
        topUI = document.createElement('div');
        topUI.setAttribute('data-useb-ocr', 'topUI');
      }
      customUIWrap.appendChild(topUI);
      if (!middleUI) {
        middleUI = document.createElement('div');
        middleUI.setAttribute('data-useb-ocr', 'middleUI');
      }
      customUIWrap.appendChild(middleUI);
      if (!bottomUI) {
        bottomUI = document.createElement('div');
        bottomUI.setAttribute('data-useb-ocr', 'bottomUI');
      }
      customUIWrap.appendChild(bottomUI);
      captureUIWrap = document.createElement('div');
      captureUIWrap.setAttribute('data-useb-ocr', 'captureUIWrap');
      var captureUIWrapStyle = _objectSpread(_objectSpread({}, wrapStyle), {}, {
        'flex-direction': 'center'
      });
      _this18.__setStyle(captureUIWrap, captureUIWrapStyle);
      ocr.appendChild(captureUIWrap);
      if (_this18.__options.useCaptureUI) {
        if (_this18.__isSwitchToServerMode || _this18.__options.useForceCompleteUI) {
          if (!captureUI) {
            captureUI = document.createElement('div');
            captureUI.setAttribute('data-useb-ocr', 'captureUI');
            _this18.__setStyle(captureUI, {
              display: 'none',
              cursor: 'pointer'
            });
          }
          if (!captureButton) {
            captureButton = document.createElement('div');
            captureButton.setAttribute('data-useb-ocr', 'captureButton');
            var captureButtonSrcSVG = "";
            captureButtonSrcSVG += "<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>";
            captureButtonSrcSVG += "  <circle id='captureButton' cx='40' cy='40' r='38' fill='#555555' stroke='#ffffff' stroke-width='4'/>";
            captureButtonSrcSVG += "</svg>";
            captureButton.innerHTML = captureButtonSrcSVG;
            captureUI.appendChild(captureButton);
          }
          captureUIWrap.appendChild(captureUI);
          var _this_ = _this18;
          var __onClickCaptureButton = function __onClickCaptureButton() {
            if (_this_.__isSwitchToServerMode) {
              detector.getOCRElements().captureButton.setAttribute('is-clicked', 'true');
              _this_.__setStyle(detector.getOCRElements().captureButton, {
                display: 'none'
              });
            } else {
              detector.getOCRElements().captureButton.setAttribute('is-clicked', 'true');
              _this_.__setStyle(detector.getOCRElements().video, {
                display: 'none'
              });
              _this_.__setStyle(detector.getOCRElements().captureButton, {
                display: 'none'
              });
            }
          };
          captureButton.addEventListener('click', __onClickCaptureButton);
        }
      }
      if (_this18.__options.usePreviewUI) {
        previewUIWrap = document.createElement('div');
        previewUIWrap.setAttribute('data-useb-ocr', 'previewUIWrap');
        var previewUIWrapStyle = _objectSpread(_objectSpread({}, wrapStyle), {}, {
          'flex-direction': 'column',
          display: 'none',
          'background-color': '#000000aa'
        });
        _this18.__setStyle(previewUIWrap, previewUIWrapStyle);
        ocr.appendChild(previewUIWrap);
        if (!previewUI) {
          previewUI = document.createElement('div');
          previewUI.setAttribute('data-useb-ocr', 'previewUI');
        }
        _this18.__setStyle(previewUI, _objectSpread(_objectSpread({}, wrapStyle), {}, {
          'flex-direction': 'column',
          width: '',
          height: '',
          'max-width': '90%',
          'max-height': '90%'
        }));
        previewUIWrap.appendChild(previewUI);
        if (!previewImage) {
          previewImage = document.createElement('img');
          previewImage.setAttribute('data-useb-ocr', 'previewImage');
          previewUI.appendChild(previewImage);
        }
      }
      if (_this18.__options.useManualSwitchToServerMode) {
        switchUIWrap = document.createElement('div');
        switchUIWrap.setAttribute('data-useb-ocr', 'switchUIWrap');
        var switchUIWrapStyle = _objectSpread(_objectSpread({}, wrapStyle), {}, {
          'align-items': '',
          'justify-content': '',
          width: '',
          overflow: '',
          'flex-direction': 'column-reverse'
        });
        _this18.__setStyle(switchUIWrap, switchUIWrapStyle);
        ocr.appendChild(switchUIWrap);
        if (!switchUI) {
          switchUI = document.createElement('div');
          switchUI.setAttribute('data-useb-ocr', 'switchUI');
          var switchHTML = "";
          switchHTML += "<div class='custom--label flex justify-center align-center gap10'>";
          switchHTML += "  <label for='manual-switch-wasm-to-server-checkbox'>WASM</label>";
          switchHTML += "  <label class='switch'>";
          switchHTML += "    <input id='manual-switch-wasm-to-server-checkbox' type='checkbox'>";
          switchHTML += "    <span class='slider round'></span>";
          switchHTML += "  </label>";
          switchHTML += "  <label for='priority-finance-cohtmlForlist-checkbox'>Server</label>";
          switchHTML += "</div>";
          switchUI.innerHTML = switchHTML;
        }
        _this18.__setStyle(switchUI, {
          overflow: 'hidden'
        });
        switchUIWrap.appendChild(switchUI);
        var switchCheckbox = switchUI.getElementsByTagName('input')[0];
        var _this_2 = _this18;
        var __onClickSwitchUI = /*#__PURE__*/function () {
          var _ref8 = _asyncToGenerator(function* (event) {
            _this_2.__isSwitchToServerMode = event.target.checked;
            yield _this_2.restartOCR(_this_2.__ocrType, _this_2.__onSuccess, _this_2.__onFailure, _this_2.__onInProgressChange, true);
          });
          return function __onClickSwitchUI(_x2) {
            return _ref8.apply(this, arguments);
          };
        }();
        switchCheckbox.addEventListener('click', __onClickSwitchUI, {
          once: true
        });
      }
      preloadingUIWrap = document.createElement('div');
      preloadingUIWrap.setAttribute('data-useb-ocr', 'preloadingUIWrap');
      var preloadingUIWrapStyle = _objectSpread(_objectSpread({}, wrapStyle), {}, {
        'flex-direction': 'column',
        display: 'none',
        'background-color': '#000000ff'
      });
      _this18.__setStyle(preloadingUIWrap, preloadingUIWrapStyle);
      ocr.appendChild(preloadingUIWrap);
      if (!preloadingUI) {
        preloadingUI = document.createElement('div');
        preloadingUI.setAttribute('data-useb-ocr', 'preloadingUI');
        preloadingUI.setAttribute('class', 'text-info');
        preloadingUI.innerHTML = '' + '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background: none; display: block; shape-rendering: auto;" width="32px" height="32px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n' + '  <circle cx="84" cy="50" r="10" fill="#ffffffff">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="0.5555555555555556s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"></animate>\n' + '    <animate attributeName="fill" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#86868600;#86868600;#86868600;#86868600;#86868600" begin="0s"></animate>\n' + '  </circle>' + '  <circle cx="16" cy="50" r="10" fill="#ffffffff">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"></animate>\n' + '  </circle>' + '  <circle cx="50" cy="50" r="10" fill="#ffffffff">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5555555555555556s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5555555555555556s"></animate>\n' + '  </circle>' + '  <circle cx="84" cy="50" r="10" fill="#ffffffff">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1111111111111112s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1111111111111112s"></animate>\n' + '  </circle>' + '  <circle cx="16" cy="50" r="10" fill="#ffffffff">\n' + '    <animate attributeName="r" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666665s"></animate>\n' + '    <animate attributeName="cx" repeatCount="indefinite" dur="2.2222222222222223s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.6666666666666665s"></animate>\n' + '  </circle>' + '</svg>';
        if (_this18.__options.preloadingUITextMsg === '' || _this18.__options.preloadingUITextMsg) {
          preloadingUI.innerHTML += _this18.__options.preloadingUITextMsg;
        }
      }
      _this18.__setStyle(preloadingUI, _objectSpread(_objectSpread({}, wrapStyle), {}, {
        'flex-direction': 'column'
      }));
      preloadingUIWrap.appendChild(preloadingUI);

      // loading UI 위치 자리잡게 하기 위해
      yield _this18.__initStyle();

      // 화면과도 현상 해결
      _this18.__setStyle(ocr, {
        display: ''
      });
      _this18.__ocr = ocr;
      _this18.__canvas = canvas;
      _this18.__rotationCanvas = rotationCanvas;
      _this18.__video = video;
      _this18.__videoWrap = videoWrap;
      _this18.__guideBox = guideBox;
      _this18.__guideBoxWrap = guideBoxWrap;
      _this18.__maskBoxWrap = maskBoxWrap;
      _this18.__preventToFreezeVideo = preventToFreezeVideo;
      _this18.__customUIWrap = customUIWrap;
      _this18.__topUI = topUI;
      _this18.__middleUI = middleUI;
      _this18.__bottomUI = bottomUI;
      _this18.__captureUIWrap = captureUIWrap;
      _this18.__captureUI = captureUI;
      _this18.__captureButton = captureButton;
      _this18.__previewUIWrap = previewUIWrap;
      _this18.__previewUI = previewUI;
      _this18.__previewImage = previewImage;
      _this18.__switchUIWrap = switchUIWrap;
      _this18.__switchUI = switchUI;
      return {
        ocr,
        canvas,
        rotationCanvas,
        video,
        videoWrap,
        guideBox,
        guideBoxWrap,
        maskBoxWrap,
        preventToFreezeVideo,
        customUIWrap,
        topUI,
        middleUI,
        bottomUI,
        captureUIWrap,
        captureUI,
        captureButton,
        previewUIWrap,
        previewUI,
        previewImage,
        switchUIWrap,
        switchUI
      };
    })();
  }
  __blurCaptureButton() {
    this.__setStyle(detector.getOCRElements().video, {
      display: ''
    });
    var {
      captureButton
    } = detector.getOCRElements();
    if (captureButton) {
      captureButton.setAttribute('is-clicked', 'false');
      this.__setStyle(captureButton, {
        display: ''
      });
    }
  }
  __isClickedCaptureButton() {
    var {
      captureButton
    } = detector.getOCRElements();
    return captureButton ? captureButton.getAttribute('is-clicked') === 'true' : false;
  }
  __setupVideo(isPassport) {
    var _this19 = this;
    return _asyncToGenerator(function* () {
      // wasm 인식성능 최적화된 해상도
      _this19.__resolutionWidth = 1080;
      _this19.__resolutionHeight = 720;
      _this19.__camSetComplete = false;
      var {
        video,
        canvas,
        rotationCanvas
      } = detector.getOCRElements();
      var camera = yield _this19.__getInputDevices();
      // console.log('videoDevices :: ', camera)

      _this19.checkUIOrientation();
      var constraintWidth, constraintHeight;
      if (_this19.__options.cameraResolutionCriteria === 'highQuality') {
        // 카메라 해상도 설정 : 화질 우선
        // 1920x1080이 가능한경우 사용 아니면 1280x720 사용
        constraintWidth = {
          ideal: 1920,
          min: 1280
        };
        constraintHeight = {
          ideal: 1080,
          min: 720
        };
      } else {
        // 'compatibility'
        // 카메라 해상도 설정 : 호환성 우선
        // 1920x1080이 사용 가능하더라도 1280x720을 사용하도록 고정
        // 사유 : 갤럭시 entry 모델(A시리즈 / Wide 모델 등)에서 1920 x 1080 처리시 비율이 이상해짐(홀쭉이됨)
        // 항상 1280 x 720을 사용하도록 변경
        constraintWidth = {
          ideal: 1280
        };
        constraintHeight = {
          ideal: 720
        };
      }
      var constraints = {
        audio: false,
        video: {
          zoom: {
            ideal: 1
          },
          facingMode: {
            ideal: _this19.__facingModeConstraint
          },
          focusMode: {
            ideal: 'continuous'
          },
          whiteBalanceMode: {
            ideal: 'continuous'
          },
          deviceId: camera.length ? {
            ideal: camera[camera.length - 1]
          } : null,
          width: constraintWidth,
          height: constraintHeight
        }
      };

      // 최초 진입 이어서 videoDeivce 리스트를 가져올 수 없으면,
      // getUserMedia를 임의 호출하여 권한을 받은뒤 다시 가져옴
      if (camera.length === 0) {
        _this19.__debug('cannot to get camera devices. so, try to get camera devices again');
        _this19.__debug("constraints : ".concat(JSON.stringify(constraints)));
        _this19.__stream = yield navigator.mediaDevices.getUserMedia(constraints);
        _this19.stopStream();
        camera = yield _this19.__getInputDevices();
        constraints.video.deviceId = camera.length ? {
          ideal: camera[camera.length - 1]
        } : null;
      }

      // 갤럭시 wide 등 저사양 기기에서 FHD 해상도 카메라 사용시 홀쭉이되는 현상 방지
      // 저사양 기기 판단기준 : 후면카메라의 개수가 1개라는 가정
      if (camera.length === 1) {
        _this19.__debug('maybe device is entry model such as galaxy wide');
        constraints.video.width = {
          ideal: 1280
        };
        constraints.video.height = {
          ideal: 720
        };
      }
      try {
        // const dumptrack = ([a, b], track) =>
        //   `${a}${track.kind == 'video' ? 'Camera' : 'Microphone'} (${track.readyState}): ${track.label}${b}`;

        var stream = yield navigator.mediaDevices.getUserMedia(constraints);
        _this19.__debug("constraints : ".concat(JSON.stringify(constraints)));
        // this.__debug('videoTracks :: ', stream.getVideoTracks());
        var streamSettings = stream.getVideoTracks()[0].getSettings();
        // this.__debug(
        //   'streamCapabilities :: ',
        //   stream.getVideoTracks()[0].getCapabilities()
        // );
        // this.__debug('stream :: ', stream.getVideoTracks()[0].getConstraints());
        // this.__debug('streamSettings :: ', streamSettings);
        _this19.__debug("stream width * height :: ".concat(streamSettings.width, " * ").concat(streamSettings.height));
        _this19.__debug('stream width / height :: ' + streamSettings.width / streamSettings.height);
        _this19.__debug('stream aspectRatio :: ' + streamSettings.aspectRatio);
        _this19.__debug('stream facingMode :: ' + streamSettings.facingMode);
        [canvas.width, canvas.height] = [_this19.__resolutionWidth, _this19.__resolutionHeight];
        if (_this19.__isRotated90or270) {
          [rotationCanvas.width, rotationCanvas.height] = [_this19.__resolutionHeight, _this19.__resolutionWidth];
        }
        video.srcObject = stream;
        _this19.__stream = stream;
      } catch (e) {
        console.error(e);
        throw e;
      }
    })();
  }
  __initStyle() {
    var _this20 = this;
    return _asyncToGenerator(function* () {
      console.debug('adjustStyle - START');
      var {
        ocr,
        guideBox,
        maskBoxWrap,
        topUI,
        middleUI,
        bottomUI,
        captureUI
      } = detector.getOCRElements();
      _this20.__setStyle(captureUI, {
        display: 'none'
      });

      // 기준정보
      var baseWidth = 400;
      var baseHeight = 260;
      var scannerFrameRatio = baseHeight / baseWidth; // 신분증 비율

      var guideBoxWidth, guideBoxHeight;
      var calcOcrClientWidth = ocr.clientWidth;
      var calcOcrClientHeight = ocr.clientHeight;
      var borderWidth = _this20.__options.frameBorderStyle.width;
      var borderRadius = _this20.__options.frameBorderStyle.radius;
      var guideBoxRatioByWidth = _this20.__guideBoxRatioByWidth;
      var videoRatioByHeight = _this20.__videoRatioByHeight;
      if (_this20.__uiOrientation === 'portrait') {
        // 세로 UI && 세로 비디오로 간주
        // 가로 기준으로 가이드박스 계산
        guideBoxWidth = calcOcrClientWidth * guideBoxRatioByWidth;
        guideBoxHeight = guideBoxWidth * scannerFrameRatio;
      } else {
        // 가로 UI && 가로 비디오로 간주
        // 비디오를 가로 UI의 height 기준으로 줄이고
        // 가로 UI height 기준으로 비디오의 width 계산
        guideBoxHeight = calcOcrClientHeight * videoRatioByHeight;
        guideBoxWidth = guideBoxHeight * baseWidth / baseHeight;
      }
      guideBoxWidth += borderWidth * 2;
      guideBoxHeight += borderWidth * 2;
      var reducedGuideBoxWidth = guideBoxWidth * _this20.__guideBoxReduceRatio;
      var reducedGuideBoxHeight = guideBoxHeight * _this20.__guideBoxReduceRatio;
      if (topUI) {
        _this20.__setStyle(topUI, {
          'padding-bottom': '10px',
          height: (calcOcrClientHeight - guideBoxHeight) / 2 + 'px',
          display: 'flex',
          'flex-direction': 'column-reverse'
        });
      }
      if (middleUI) {
        _this20.__setStyle(middleUI, {
          width: reducedGuideBoxWidth - borderWidth * 2 + 'px',
          height: reducedGuideBoxHeight - borderWidth * 2 + 'px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          padding: '10px'
        });
      }
      if (bottomUI) {
        _this20.__setStyle(bottomUI, {
          'padding-top': '10px',
          height: (calcOcrClientHeight - guideBoxHeight) / 2 + 'px',
          display: 'flex',
          'flex-direction': 'column'
        });
      }
      var videoInnerGap = 2; // 미세하게 maskBoxInner보다 guideBox가 작은것 보정
      _this20.__setStyle(guideBox, {
        width: reducedGuideBoxWidth - videoInnerGap + 'px',
        height: reducedGuideBoxHeight - videoInnerGap + 'px',
        backgroundColor: 'transparent'
      });
      var maskBoxInner = maskBoxWrap.querySelector('#maskBoxInner');
      var r = borderRadius - borderWidth * 2;
      r = r < 0 ? 0 : r;
      if (!isNaN(reducedGuideBoxWidth) && !isNaN(reducedGuideBoxHeight) && !isNaN(borderRadius) && !isNaN(borderWidth)) {
        var maskBoxInnerWidth = Math.max(reducedGuideBoxWidth - borderWidth * 2 - videoInnerGap, 0);
        var maskBoxInnerHeight = Math.max(reducedGuideBoxHeight - borderWidth * 2 - videoInnerGap, 0);
        maskBoxInner.setAttribute('width', maskBoxInnerWidth + '');
        maskBoxInner.setAttribute('height', maskBoxInnerHeight + '');
        maskBoxInner.setAttribute('x', maskBoxInnerWidth / 2 * -1 + '');
        maskBoxInner.setAttribute('y', maskBoxInnerHeight / 2 * -1 + '');
        maskBoxInner.setAttribute('rx', r + '');
        maskBoxInner.setAttribute('ry', r + '');
      }
    })();
  }
  __adjustStyle() {
    var _this21 = this;
    return _asyncToGenerator(function* () {
      var __calcGuideBoxCriteria = (a, b) => {
        if (_this21.__options.calcGuideBoxCriteria === 'cameraResolution') {
          return Math.min(a, b);
        } else if (_this21.__options.calcGuideBoxCriteria === 'ocrViewSize') {
          return Math.max(a, b);
        } else {
          return Math.min(a, b); // default : cameraResolution
        }
      };

      console.debug('adjustStyle - START');
      var {
        ocr,
        video,
        guideBox,
        maskBoxWrap,
        topUI,
        middleUI,
        bottomUI,
        captureUIWrap,
        captureUI,
        captureButton
      } = detector.getOCRElements();
      _this21.__setStyle(captureUI, {
        display: 'none'
      });
      var isAlienBack = _this21.__ocrType === 'alien-back';

      // 기준정보
      var baseWidth = isAlienBack ? 260 : 400;
      var baseHeight = isAlienBack ? 400 : 260;
      var scannerFrameRatio = baseHeight / baseWidth; // 신분증 비율

      var guideBoxWidth, guideBoxHeight;
      var calcOcrClientWidth = ocr.clientWidth;
      var calcOcrClientHeight = ocr.clientHeight;
      var calcVideoWidth = video.videoWidth;
      var calcVideoHeight = video.videoHeight;
      var calcVideoClientWidth = video.clientWidth;
      var calcVideoClientHeight = video.clientHeight;
      var calcVideoOrientation = _this21.__videoOrientation;
      if (calcVideoWidth === 0 || calcVideoHeight === 0 || calcVideoClientWidth === 0 || calcVideoClientHeight === 0) {
        return;
      }
      var borderWidth = _this21.__options.frameBorderStyle.width;
      var borderRadius = _this21.__options.frameBorderStyle.radius;
      if (_this21.__isRotated90or270) {
        [calcVideoWidth, calcVideoHeight] = [calcVideoHeight, calcVideoWidth];
        [calcVideoClientWidth, calcVideoClientHeight] = [calcVideoClientHeight, calcVideoClientWidth];
        calcVideoOrientation = _this21.__videoOrientation === 'portrait' ? 'landscape' : 'portrait';
      }
      var newVideoWidth = calcVideoClientWidth;
      var newVideoHeight = calcVideoClientHeight;
      var guideBoxRatioByWidth = _this21.__guideBoxRatioByWidth;
      var videoRatioByHeight = _this21.__videoRatioByHeight;
      var newVideoRatioByWidth = calcVideoClientHeight / calcVideoClientWidth;
      var newVideoRatioByHeight = calcVideoClientWidth / calcVideoClientHeight;
      if (_this21.__uiOrientation === 'portrait') {
        // 세로 UI
        _this21.__setStyle(captureUIWrap, {
          'justify-content': 'center',
          'align-items': 'flex-end'
        });
        // video 가로 기준 100% 유지 (변경없음)
        if (calcVideoOrientation === _this21.__uiOrientation) {
          // 카메라도 세로
          // 세로 UI && 세로 비디오
          // 가로 기준으로 가이드박스 계산
          guideBoxWidth = __calcGuideBoxCriteria(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth;
          guideBoxHeight = guideBoxWidth * scannerFrameRatio;

          // 가이드 박스 가로 기준으로 비디오 확대
          newVideoWidth = guideBoxWidth;
          newVideoHeight = newVideoWidth * newVideoRatioByWidth;
        } else {
          // 카메라는 가로
          // 세로 UI && 가로 비디오
          // 가이드 박스를 비디오 세로 길이에 맞춤
          guideBoxHeight = __calcGuideBoxCriteria(calcVideoClientHeight, calcVideoHeight);
          guideBoxWidth = guideBoxHeight * baseWidth / baseHeight;
        }
      } else {
        // 가로 UI
        _this21.__setStyle(captureUIWrap, {
          'justify-content': 'end',
          'align-items': 'center'
        });
        if (calcVideoOrientation === _this21.__uiOrientation) {
          // 가로 UI && 가로 비디오
          // 비디오를 가로 UI의 height 기준으로 줄이고
          // 가로 UI height 기준으로 비디오의 width 계산

          // 가이드박스는 세로 기준으로 맞춤
          guideBoxHeight = __calcGuideBoxCriteria(calcOcrClientHeight, calcVideoHeight) * videoRatioByHeight;
          guideBoxWidth = guideBoxHeight * baseWidth / baseHeight;

          // 비디오를 세로 기준으로 다시 맞춤
          newVideoHeight = guideBoxHeight;
          newVideoWidth = newVideoHeight * newVideoRatioByHeight;

          // 가이드박스의 가로 크기가 가로 UI width * ratio 값보다 크면,
          if (guideBoxWidth > __calcGuideBoxCriteria(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth) {
            // 계산 방식을 바꾼다 (사유 : 거의 정사각형에 가까운 경우 가이드 박스 가로가 꽉차게 됨.)
            guideBoxWidth = __calcGuideBoxCriteria(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth;
            guideBoxHeight = guideBoxWidth * scannerFrameRatio;

            // 가이드 박스 가로 기준으로 비디오 확대
            newVideoWidth = guideBoxWidth;
            newVideoHeight = newVideoWidth * newVideoRatioByWidth;
          }
        } else {
          // 가로 UI && 세로 비디오
          // 가로 기준으로 가이드박스 계산

          // 가이드박스의 height 크기를 UI의 height 기준에 맞춤
          guideBoxHeight = __calcGuideBoxCriteria(calcOcrClientHeight, calcVideoHeight) * videoRatioByHeight;
          guideBoxWidth = guideBoxHeight * baseWidth / baseHeight;

          // 가이드박스의 가로 크기가 가로 UI width * ratio 값보다 크면,
          if (guideBoxWidth > __calcGuideBoxCriteria(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth) {
            // 계산 방식을 바꾼다 (사유 : 거의 정사각형에 가까운 경우 가이드 박스 가로가 꽉차게 됨.)
            guideBoxWidth = __calcGuideBoxCriteria(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth;
            guideBoxHeight = guideBoxWidth * scannerFrameRatio;
          }

          // 가이드 박스 가로 기준으로 비디오 축소
          newVideoWidth = guideBoxWidth;
          newVideoHeight = newVideoWidth * newVideoRatioByWidth;
        }
      }

      // calcGuideBoxCriteria(카메라 해상도 설정 기준)가 ocrViewSize(화면 크기) 기준일때
      if (_this21.__options.calcGuideBoxCriteria === 'ocrViewSize') {
        // guideBoxHeight 이 calcOcrClientHeight 보다 큰경우(가이드박스가 화면을 넘어가는 경우) 다시 계산
        if (guideBoxHeight > calcOcrClientHeight) {
          guideBoxHeight = Math.min(calcOcrClientHeight, calcVideoHeight) * videoRatioByHeight;
          guideBoxWidth = guideBoxHeight * baseWidth / baseHeight;
          newVideoWidth = guideBoxWidth;
          newVideoHeight = newVideoWidth * newVideoRatioByWidth;
        }

        // guideBoxHeight 이 calcOcrClientHeight 보다 큰경우(가이드박스가 화면을 넘어가는 경우) 다시 계산
        if (guideBoxWidth > calcOcrClientWidth) {
          guideBoxWidth = Math.min(calcOcrClientWidth, calcVideoWidth) * guideBoxRatioByWidth;
          guideBoxHeight = guideBoxWidth * scannerFrameRatio;
          newVideoWidth = guideBoxWidth;
          newVideoHeight = newVideoWidth * newVideoRatioByWidth;
        }
      }
      _this21.__cropImageSizeWidth = Math.min(guideBoxWidth, newVideoWidth);
      _this21.__cropImageSizeHeight = Math.min(guideBoxHeight, newVideoHeight);
      if (_this21.__isRotated90or270) {
        [newVideoWidth, newVideoHeight] = [newVideoHeight, newVideoWidth];
      }
      guideBoxWidth += borderWidth * 2;
      guideBoxHeight += borderWidth * 2;
      var reducedGuideBoxWidth = guideBoxWidth * _this21.__guideBoxReduceRatio;
      var reducedGuideBoxHeight = guideBoxHeight * _this21.__guideBoxReduceRatio;
      if (topUI) {
        _this21.__setStyle(topUI, {
          'padding-bottom': '10px',
          height: (calcOcrClientHeight - guideBoxHeight) / 2 + 'px',
          display: 'flex',
          'flex-direction': 'column-reverse'
        });
      }
      if (middleUI) {
        _this21.__setStyle(middleUI, {
          width: reducedGuideBoxWidth - borderWidth * 2 + 'px',
          height: reducedGuideBoxHeight - borderWidth * 2 + 'px',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          padding: '10px'
        });
      }
      if (bottomUI) {
        _this21.__setStyle(bottomUI, {
          'padding-top': '10px',
          height: (calcOcrClientHeight - guideBoxHeight) / 2 + 'px',
          display: 'flex',
          'flex-direction': 'column'
        });
      }
      _this21.__setStyle(video, {
        width: newVideoWidth + 'px'
      });
      _this21.__setStyle(video, {
        height: newVideoHeight + 'px'
      });
      var videoInnerGap = 2; // 미세하게 maskBoxInner보다 guideBox가 작은것 보정
      _this21.__setStyle(guideBox, {
        width: reducedGuideBoxWidth - videoInnerGap + 'px',
        height: reducedGuideBoxHeight - videoInnerGap + 'px',
        backgroundColor: 'transparent'
      });
      var maskBoxInner = maskBoxWrap.querySelector('#maskBoxInner');
      var r = borderRadius - borderWidth * 2;
      r = r < 0 ? 0 : r;
      if (!isNaN(reducedGuideBoxWidth) && !isNaN(reducedGuideBoxHeight) && !isNaN(borderRadius) && !isNaN(borderWidth)) {
        var maskBoxInnerWidth = Math.max(reducedGuideBoxWidth - borderWidth * 2 - videoInnerGap, 0);
        var maskBoxInnerHeight = Math.max(reducedGuideBoxHeight - borderWidth * 2 - videoInnerGap, 0);
        maskBoxInner.setAttribute('width', maskBoxInnerWidth + '');
        maskBoxInner.setAttribute('height', maskBoxInnerHeight + '');
        maskBoxInner.setAttribute('x', maskBoxInnerWidth / 2 * -1 + '');
        maskBoxInner.setAttribute('y', maskBoxInnerHeight / 2 * -1 + '');
        maskBoxInner.setAttribute('rx', r + '');
        maskBoxInner.setAttribute('ry', r + '');
      }

      // 수동 촬영 UI 사용
      // firstCalled인 경우 아직 captureUI가 그려지지 않아 무의미
      if (_this21.__options.useCaptureUI) {
        _this21.__setStyle(captureUI, {
          display: ''
        });
        if (_this21.__uiOrientation === 'portrait' && bottomUI && captureUI) {
          var calcSumOfHeightBottomUIChildNodes = _this21.__calcSumOfHeightChildNodes(bottomUI);
          var calcCaptureButtonHeight = captureButton.querySelector('svg').getAttribute('height');
          calcCaptureButtonHeight = calcCaptureButtonHeight === 0 ? 80 : calcCaptureButtonHeight;
          var captureUIPaddingBottom = bottomUI.clientHeight;
          captureUIPaddingBottom -= isNaN(parseInt(bottomUI.style.paddingTop)) ? 0 : parseInt(bottomUI.style.paddingTop);
          captureUIPaddingBottom -= calcSumOfHeightBottomUIChildNodes;
          captureUIPaddingBottom -= calcCaptureButtonHeight;
          var baseline = calcOcrClientHeight - (calcOcrClientHeight / 2 + guideBoxHeight / 2);
          if (captureUIPaddingBottom > 0 && captureUIPaddingBottom < baseline) {
            _this21.__setStyle(captureUI, {
              'padding-right': '',
              'padding-bottom': captureUIPaddingBottom + 'px'
            });
          }
        } else {
          _this21.__setStyle(captureUI, {
            'padding-right': '10px',
            'padding-bottom': ''
          });
        }
      }
      yield _this21.__changeStage(_this21.__inProgressStep, true);
      console.debug('adjustStyle - END');
    })();
  }
  __calcSumOfHeightChildNodes(obj) {
    var sum = 0;
    for (var item of obj === null || obj === void 0 ? void 0 : obj.childNodes) {
      sum += item.clientHeight ? item.clientHeight : 0;
    }
    return sum;
  }
  __closeCamera() {
    this.__clearCameraPermissionTimeoutTimer();
    this.stopScan();
    this.stopStream();
  }
  __loadResources() {
    var _this22 = this;
    return _asyncToGenerator(function* () {
      console.log('loadResources() START');
      if (_this22.__resourcesLoaded) {
        console.log('loadResource() SKIP, already loaded!');
        return;
      }
      _this22.__isSupportSimd = yield simd();
      var envInfo = '';
      envInfo += "os : ".concat(_this22.__deviceInfo.os, "\n");
      envInfo += "osSimple : ".concat(_this22.__deviceInfo.osSimple, "\n");
      envInfo += "isSupportWasm: ".concat(_this22.__isSupportWasm, "\n");
      envInfo += "simd(wasm-feature-detect) : ".concat(_this22.__isSupportSimd, "\n");
      if (_this22.__deviceInfo.osSimple === 'IOS' || _this22.__deviceInfo.osSimple === 'MAC') {
        _this22.__isSupportSimd = false;
      }
      envInfo += "isSupportSimd(final) : ".concat(_this22.__isSupportSimd, "\n");
      envInfo += "UserAgent : ".concat(navigator.userAgent, "\n");
      console.log('====== envInfo ======\n' + envInfo);
      _this22.__debug(envInfo);
      window.usebOCREnvInfo = envInfo;
      var sdkSupportEnv = 'quram';
      if (_this22.__isSupportSimd) {
        console.log('!!! applied simd !!!');
        sdkSupportEnv += '_simd';
      } else {
        console.log('!!! not applied simd !!!');
      }
      console.log('====== envInfo ======\n' + envInfo);
      window.usebOCREnvInfo = envInfo;
      console.log('=====================\n' + envInfo);
      var postfix = '';
      if (_this22.__options.force_wasm_reload) {
        // 옵션이 활성화 되면 새로운 WASM 리소스를 요청함.
        postfix = '?ver=' + _this22.__options.force_wasm_reload_flag;
      }
      function getFileXHR(_x3) {
        return _getFileXHR.apply(this, arguments);
      }
      function _getFileXHR() {
        _getFileXHR = _asyncToGenerator(function* (path) {
          return new Promise((resolve, reject) => {
            try {
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    resolve(xhr.responseText);
                  } else {
                    resolve(null);
                  }
                }
              };
              xhr.open('GET', path);
              xhr.send();
            } catch (e) {
              reject(e);
            }
          });
        });
        return _getFileXHR.apply(this, arguments);
      }
      var url = new URL(sdkSupportEnv + '.js' + postfix, _this22.__options.resourceBaseUrl);
      // let src = await fetch(url.href)
      var src = yield getFileXHR(url.href)
      // .then((res) => res.text())
      .then(text => {
        var regex = /(.*) = Module.cwrap/gm;
        var source = text.replace(regex, 'Module.$1 = Module.cwrap');

        // data(model)
        source = source.replace(/^\(function\(\) \{/m, 'var createModelData = async function() {\n' + ' return new Promise(async function (resolve, reject) {\n');
        source = source.replace('   console.error("package error:", error);', '   reject();\n' + '   console.error("package error:", error);');
        source = source.replace('  }, handleError)', '  resolve();\n' + '  }, handleError)');
        source = source.replace(/^\}\)\(\);/m, '\n })\n' + '};');

        // wasm
        source = source.replace(sdkSupportEnv + '.wasm', new URL(sdkSupportEnv + '.wasm' + postfix, _this22.__options.resourceBaseUrl).href);
        source = source.replace(new RegExp("REMOTE_PACKAGE_BASE = ['\"]".concat(sdkSupportEnv, "\\.data[\"']"), 'gm'), "REMOTE_PACKAGE_BASE = \"".concat(new URL(sdkSupportEnv + '.data' + postfix, _this22.__options.resourceBaseUrl).href, "\""));
        source = source.replace('function createWasm', 'async function createWasm');
        source = source.replace('instantiateAsync();', 'await instantiateAsync();');

        // wasm and data(model) file 병렬로 fetch 하기 위해
        source = source.replace('var asm = createWasm();', 'console.log("create wasm and data - start")\n' + 'await (async function() {\n' + '  return new Promise(function(resolve) {\n' + '    var isCreatedWasm = false;\n' + '    var isCreatedData = false;\n' + '    createWasm().then(() => {\n' + '      isCreatedWasm = true;\n' + '      if (isCreatedData) { resolve(); }\n' + '    });\n' + '    createModelData().then(() => {\n' + '      isCreatedData = true;\n' + '      if (isCreatedWasm) { resolve(); }\n' + '    })\n' + '  });\n' + '})();\n' + 'console.log("create wasm and data - end")');
        return source;
      });
      src = "\n    (async function() {\n      ".concat(src, "\n      Module.lengthBytesUTF8 = lengthBytesUTF8\n      Module.stringToUTF8 = stringToUTF8\n      return Module\n    })()\n        ");
      _this22.__OCREngine = yield eval(src);
      _this22.__OCREngine.onRuntimeInitialized = /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator(function* (_) {
          console.log('WASM - onRuntimeInitialized()');
        });
        return function (_x4) {
          return _ref9.apply(this, arguments);
        };
      }();
      yield _this22.__OCREngine.onRuntimeInitialized();
      _this22.__resourcesLoaded = true;
      console.log('loadResources() END');
    })();
  }

  // wasm에서 이미지를 바로 생성할때 base64 인코딩시 prefix가 없는 경우 넣어줌
  __ocrImageGuard(image) {
    var prefix = 'data:image/jpeg;base64,';
    if (image) {
      return image.indexOf(prefix) === 0 ? image : prefix + image;
    } else {
      return null;
    }
  }
  __startScanWasmImpl() {
    var _this23 = this;
    return new Promise((resolve, reject) => {
      this.__detected = false;
      this.setIgnoreComplete(false);
      this.__setupEncryptMode();
      this.__setupImageMode();
      this.__blurCaptureButton();
      this.__address = 0;
      this.__pageEnd = false;
      this.__manualOCRRetryCount = 0;
      this.__ssaRetryCount = 0;
      var scan = /*#__PURE__*/function () {
        var _ref10 = _asyncToGenerator(function* () {
          try {
            var ocrResult = null,
              isDetectedCard = null,
              imgData = null,
              imgDataUrl = null,
              ssaResult = null,
              ssaResultList = [],
              maskInfo = null;

            // await this.__changeStage(IN_PROGRESS.READY);
            if (!_this23.__OCREngine['asm']) return;

            // TODO : 설정할수 있게 변경  default 값도 제공
            var [resolution_w, resolution_h] = [_this23.__resolutionWidth, _this23.__resolutionHeight];
            var {
              video
            } = detector.getOCRElements();
            if (resolution_w === 0 || resolution_h === 0) return;
            if (_this23.__detected) {
              yield _this23.__sleep(100);
              return;
            }
            // console.log('address before ---------', address);
            if (_this23.__address === 0 && !_this23.__pageEnd && (yield _this23.__isVideoResolutionCompatible(video))) {
              [_this23.__address, _this23.__destroyScannerCallback] = _this23.__getScannerAddress(_this23.__ocrType);
            }
            if (!_this23.__address || _this23.__pageEnd) {
              yield _this23.__sleep(100);
              return;
            }
            // console.log('address after ---------', address);

            if (_this23.__ocrStatus < _this23.OCR_STATUS.OCR_SUCCESS) {
              // OCR 완료 이전 상태

              // card not detected
              [isDetectedCard, imgData, imgDataUrl] = yield _this23.__isCardboxDetected(_this23.__address, 0);
              if (!isDetectedCard) {
                if (_this23.__inProgressStep !== _this23.IN_PROGRESS.READY) {
                  yield _this23.__changeStage(_this23.IN_PROGRESS.CARD_DETECT_FAILED);
                }
                if (_this23.__isClickedCaptureButton()) {
                  yield _this23.__changeStage(_this23.IN_PROGRESS.MANUAL_CAPTURE_FAILED, false, imgDataUrl);
                  _this23.__blurCaptureButton();
                  _this23.setIgnoreComplete(false); // 필요한가?
                }

                return;
              }

              // card is detected
              yield _this23.__changeStage(_this23.IN_PROGRESS.CARD_DETECT_SUCCESS);

              // ssa retry 설정이 되어 있으거나, 수동촬영UI를 사용하는 경우, card detect 성공시 이미지 저장
              _this23.__enqueueDetectedCardQueue(imgData);
              if (_this23.__isClickedCaptureButton()) {
                _this23.setIgnoreComplete(true);
                yield _this23.__changeStage(_this23.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS, false, imgDataUrl);
              }
              ocrResult = yield _this23.__startRecognition(_this23.__address, _this23.__ocrType, _this23.__ssaMode, _this23.__isClickedCaptureButton(), imgData, imgDataUrl);

              // if (this.__isClickedCaptureButton()) {
              //   this.__blurCaptureButton();
              //   this.setIgnoreComplete(false);        // 필요한가?
              // }
            }

            if (_this23.__ocrStatus >= _this23.OCR_STATUS.OCR_SUCCESS) {
              // ocr 완료 이후 상태

              // failure case
              if (ocrResult === false) {
                throw new Error("OCR Status is ".concat(_this23.__ocrStatus, ", but ocrResult is false")); // prettier-ignore
              }

              // success case
              _this23.__setStyle(video, {
                display: 'none'
              }); // OCR 완료 시점에 camera preview off

              if (_this23.__ssaMode) {
                console.log("!!! ssaRetryCount : ".concat(_this23.__ssaRetryCount, " !!!"));
                // 최초 시도
                ssaResult = yield _this23.__startTruth(_this23.__ocrType, _this23.__address); // prettier-ignore
                if (ssaResult === null) throw new Error('[ERR] SSA MODE is true. but, ssaResult is null'); // prettier-ignore

                ssaResultList.push(ssaResult);
                if (_this23.__options.ssaMaxRetryCount > 0) {
                  var retryStartDate = new Date();
                  var FAKE = _this23.__options.ssaRetryType === 'FAKE';
                  var REAL = _this23.__options.ssaRetryType === 'REAL';
                  var ENSEMBLE = _this23.__options.ssaRetryType === 'ENSEMBLE';
                  var isCompleted = false; // 비동기 for 문 때문에 break가 안걸리는 이슈로 넣음
                  var _loop = function* _loop(item) {
                      if (isCompleted) {
                        console.log("!!! [RETRY completed] ".concat(ssaResult, ", retry count is ").concat(_this23.__ssaRetryCount, " !!!")); // prettier-ignore
                        return 0; // break
                      }
                      // prettier-ignore
                      if (_this23.__ssaRetryCount === _this23.__options.ssaMaxRetryCount) {
                        console.log("!!! [MAX RETRY EXCEED] ".concat(ssaResult, ", retry count is ").concat(_this23.__ssaRetryCount, " !!!"));
                        return 0; // break
                      }
                      var execute = /*#__PURE__*/function () {
                        var _ref11 = _asyncToGenerator(function* () {
                          _this23.__ssaRetryCount++;
                          console.log("!!! [RETRY++] ".concat(ssaResult, ", but, will be retry ").concat(_this23.__ssaRetryCount, " !!!")); // prettier-ignore
                          ssaResult = yield _this23.__startTruthRetry(_this23.__ocrType, _this23.__address, item); // prettier-ignore
                          if (ssaResult === null) throw new Error('[ERR] SSA MODE is true. but, ssaResult is null'); // prettier-ignore

                          ssaResultList.push(ssaResult);
                        });
                        return function execute() {
                          return _ref11.apply(this, arguments);
                        };
                      }();
                      if (FAKE) {
                        if (ssaResult.indexOf('REAL') > -1) {
                          yield execute();
                        } else {
                          isCompleted = true;
                        }
                      }
                      if (REAL) {
                        if (ssaResult.indexOf('FAKE') > -1) {
                          yield execute();
                        } else {
                          isCompleted = true;
                        }
                      }
                      if (ENSEMBLE) {
                        yield execute();
                      }
                    },
                    _ret;
                  for (var item of _this23.__detectedCardQueue) {
                    _ret = yield* _loop(item);
                    if (_ret === 0) break;
                  }
                  var retryWorkingTime = new Date() - retryStartDate;
                  console.log("[SSA DONE] ssaResult: ".concat(ssaResult, " / retryCount: ").concat(_this23.__ssaRetryCount, " / retry working time: ").concat(retryWorkingTime)); // prettier-ignore
                } else {
                  console.log("[SSA DONE / NO RETRY] ssaResult: ".concat(ssaResult, " / "));
                }
              }
              if (_this23.__options.useMaskInfo) {
                maskInfo = _this23.__getMaskInfo(_this23.__address);
              }
              console.debug("result : ".concat(ocrResult));
              var {
                legacyFormat,
                newFormat
              } = usebOCRWASMParser.parseOcrResult(_this23.__ocrType, _this23.__ssaMode, ocrResult, ssaResult, _this23.__ssaRetryCount, ssaResultList, _this23.__options.ssaRetryType, _this23.__options.ssaRetryPivot);
              var review_result = _objectSpread({
                ocr_type: _this23.__ocrType
              }, newFormat);
              if (!_this23.isCreditCard()) {
                review_result.maskInfo = maskInfo;
                review_result.ssa_mode = _this23.__ssaMode;
              }
              yield _this23.__compressImages(review_result);
              if (_this23.__options.useLegacyFormat) {
                review_result.ocr_data = legacyFormat;
              }
              yield _this23.__onSuccessProcess(review_result);
              _this23.__closeCamera();
              _this23.__detected = true;
              resolve();
            }
          } catch (e) {
            var errorMessage = 'Card detection error';
            if (e.message) {
              errorMessage += ': ' + e.message;
            }
            console.error(errorMessage);

            // if (e.toString().includes('memory')) {
            //   await this.__recoveryScan();
            //   this.__recovered = true;
            // } else {
            yield _this23.__onFailureProcess('WA001', e, errorMessage);
            _this23.__closeCamera();
            _this23.__detected = true;
            reject();
            // }
          } finally {
            if (_this23.__recovered) {
              _this23.__recovered = false;
              return;
            }
            if (!_this23.__detected) {
              setTimeout(scan, 1); // 재귀
            }
          }
        });
        return function scan() {
          return _ref10.apply(this, arguments);
        };
      }();
      setTimeout(scan, 1); // UI 랜더링 blocking 방지 (setTimeout)
    });
  }

  __compressImages(review_result, constantNumber) {
    var _this24 = this;
    return _asyncToGenerator(function* () {
      if (_this24.isEncryptMode()) {
        console.log('isEnryptMode is true. so, skip to compressImages');
        return;
      }
      if (_this24.__options.useCompressImage) {
        var resizeRatio = _this24.__cropImageSizeHeight / _this24.__cropImageSizeWidth;
        var defaultOptions = {
          maxWidth: _this24.__options.useCompressImageMaxWidth,
          maxHeight: _this24.__options.useCompressImageMaxWidth * resizeRatio,
          convertSize: _this24.__options.useCompressImageMaxVolume,
          targetCompressVolume: _this24.__options.useCompressImageMaxVolume // custom option
        };

        if (review_result.ocr_origin_image) {
          review_result.ocr_origin_image = yield _this24.__compressBase64Image(review_result.ocr_origin_image, defaultOptions, constantNumber);
        }
        if (review_result.ocr_masking_image) {
          // masking 이미지는 resize 하면, mask 좌표가 어긋나므로 리사이즈 안하고 압축만 진행
          var maskingImageOptions = {
            quality: defaultOptions.quality,
            targetCompressVolume: defaultOptions.targetCompressVolume
          };
          review_result.ocr_masking_image = yield _this24.__compressBase64Image(review_result.ocr_masking_image, maskingImageOptions, constantNumber);
        }
        if (review_result.ocr_face_image) {
          review_result.ocr_face_image = yield _this24.__compressBase64Image(review_result.ocr_face_image, defaultOptions, constantNumber);
        }
      }
    })();
  }
  __requestGetAPIToken() {
    return new Promise((resolve, reject) => {
      var credential = this.__options.authServerInfo.credential;
      var baseUrl = this.__options.authServerInfo.baseUrl;
      fetch("".concat(baseUrl, "/sign-in"), {
        body: JSON.stringify(credential),
        method: 'POST'
        // mode: 'cors',
        // credentials: 'include',
      }).then(res => res.json()).then(result => {
        console.log(result);
        fetch("".concat(baseUrl, "/useb/token"), {
          headers: {
            authorization: "Bearer ".concat(result.token)
          },
          body: null,
          method: 'GET'
        }).then(res => res.json()).then(json => {
          resolve(json.token);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }
  __requestServerOCR(ocrType, ssaMode, imgDataUrl) {
    var _this25 = this;
    return new Promise( /*#__PURE__*/function () {
      var _ref12 = _asyncToGenerator(function* (resolve, reject) {
        try {
          var baseUrl = _this25.__options.ocrServerBaseUrl;
          switch (ocrType) {
            case 'idcard':
            case 'driver':
            case 'idcard-ssa':
            case 'driver-ssa':
              baseUrl += '/ocr/idcard-driver';
              break;
            case 'passport':
            case 'passport-ssa':
            case 'foreign-passport':
            case 'foreign-passport-ssa':
              baseUrl += '/ocr/passport';
              break;
            case 'alien-back':
              baseUrl += '/ocr/alien-back';
              break;
            case 'alien':
            case 'alien-ssa':
              baseUrl += '/ocr/alien';
              break;
            case 'credit':
              throw new Error('Credit card is not Unsupported Server OCR');
            default:
              throw new Error("Unsupported OCR type: ".concat(ocrType));
          }
          var apiToken = yield _this25.__requestGetAPIToken();
          var myHeaders = new Headers();
          myHeaders.append('Authorization', "Bearer ".concat(apiToken));
          var param = {
            image_base64: imgDataUrl,
            mask_mode: 'true',
            face_mode: 'true'
          };
          if (_this25.__ssaMode) {
            param.ssa_mode = 'true';
          }
          var raw = JSON.stringify(param);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          fetch(baseUrl, requestOptions).then(res => res.json()).then(result => {
            console.log(result);
            resolve(result);
          }).catch(e => {
            throw e;
          });
        } catch (err) {
          console.error('error', err);
          reject(err);
        }
      });
      return function (_x5, _x6) {
        return _ref12.apply(this, arguments);
      };
    }());
  }
  __startScanServerImpl() {
    var _this26 = this;
    return new Promise( /*#__PURE__*/function () {
      var _ref13 = _asyncToGenerator(function* (resolve, reject) {
        var _this26$__captureButt, _this26$__captureButt2;
        // TODO: 서버 모드일때 암호화 는 어떻게 ? 지우는게 맞는가? js 레벨로하면 메모리에 남음 서버에서 암호화된값을 내려주는 옵션이 있어야함
        // this.__setPiiEncrypt(this.__options.useEncryptMode); // ocr result encrypt
        _this26.__blurCaptureButton();
        var __onClickCaptureButton = /*#__PURE__*/function () {
          var _ref14 = _asyncToGenerator(function* () {
            try {
              var ocrResult = null;
              // 캔버스에서 이미지를 가져옴
              var [, imgDataUrl] = yield _this26.__cropImageFromVideo();
              if (1 === true) {
                // server ocr 실패 (발생 가능성 없음)
              } else {
                // server ocr 성공
                yield _this26.__changeStage(_this26.IN_PROGRESS.MANUAL_CAPTURE_SUCCESS, false, imgDataUrl);
                try {
                  ocrResult = yield _this26.__requestServerOCR(_this26.__ocrType, _this26.__ssaMode, imgDataUrl);

                  // failure case
                  if (ocrResult === false) {
                    yield _this26.__changeStage(_this26.IN_PROGRESS.OCR_FAILED);
                  }
                } catch (e) {
                  throw new Error("Server OCR is failed");
                }

                // ssa 시도?

                // success case
                var {
                  video
                } = detector.getOCRElements();
                _this26.__setStyle(video, {
                  display: 'none'
                }); // OCR 완료 시점에 camera preview off

                console.debug("result : ".concat(ocrResult));
                var {
                  legacyFormat,
                  newFormat,
                  base64ImageResult,
                  maskInfo
                } = usebOCRAPIParser.parseOcrResult(_this26.__ocrType, _this26.__ssaMode, ocrResult);
                var review_result = {
                  ocr_type: _this26.__ocrType,
                  ocr_result: newFormat,
                  ocr_origin_image: imgDataUrl,
                  ocr_masking_image: base64ImageResult === null || base64ImageResult === void 0 ? void 0 : base64ImageResult.ocr_masking_image,
                  ocr_face_image: base64ImageResult === null || base64ImageResult === void 0 ? void 0 : base64ImageResult.ocr_face_image
                };
                if (!_this26.isCreditCard()) {
                  review_result.maskInfo = maskInfo;
                  review_result.ssa_mode = _this26.__ssaMode;
                }
                if (_this26.__debugMode) {
                  review_result.ocr_api_response = ocrResult;
                }
                yield _this26.__compressImages(review_result, 0.0);

                // TODO: 서버 모드일때 암호화 는 어떻게 ? 지우는게 맞는가? js 레벨로하면 메모리에 남음 서버에서 암호화된값을 내려주는 옵션이 있어야함
                // this.encryptResult(review_result);

                if (_this26.__options.useLegacyFormat) {
                  review_result.ocr_data = legacyFormat;
                }
                if (ocrResult.complete === true) {
                  yield _this26.__onSuccessProcess(review_result);
                  _this26.__closeCamera();
                  resolve();
                } else {
                  var _ocrResult3;
                  var resultCode = 'SF001';
                  var resultMessage = "".concat(ocrResult.scanner_type, ":").concat((_ocrResult3 = ocrResult) === null || _ocrResult3 === void 0 ? void 0 : _ocrResult3.result_code);
                  var resultDetail = JSON.stringify(ocrResult);
                  yield _this26.__onFailureProcess(resultCode, resultDetail, resultMessage); // QURAM Server OCR 에러

                  _this26.__closeCamera();
                  reject();
                }
              }
            } catch (e) {
              var errorMessage = 'Server OCR Error';
              if (e.message) {
                errorMessage += ': ' + e.message;
              }
              console.error(errorMessage);
              yield _this26.__onFailureProcess('SE001', e, errorMessage); // QURAM Server OCR 에러
              _this26.__closeCamera();
              reject();
            }
          });
          return function __onClickCaptureButton() {
            return _ref14.apply(this, arguments);
          };
        }();
        (_this26$__captureButt = _this26.__captureButton) === null || _this26$__captureButt === void 0 ? void 0 : _this26$__captureButt.removeEventListener('click', __onClickCaptureButton);
        (_this26$__captureButt2 = _this26.__captureButton) === null || _this26$__captureButt2 === void 0 ? void 0 : _this26$__captureButt2.addEventListener('click', __onClickCaptureButton);
      });
      return function (_x7, _x8) {
        return _ref13.apply(this, arguments);
      };
    }());
  }
  __enqueueDetectedCardQueue(imgData) {
    // ssa retry 설정이 되어 있으거나, 수동촬영UI를 사용하는 경우, card detect 성공시 이미지 저장
    if (this.__ssaMode && this.__options.ssaMaxRetryCount > 0 || this.__options.useCaptureUI && this.__manualOCRMaxRetryCount > 0) {
      var limitSaveImageCount = Math.max(this.__options.ssaMaxRetryCount, this.__manualOCRMaxRetryCount);
      if (this.__detectedCardQueue.length === limitSaveImageCount) {
        this.__detectedCardQueue.shift();
      }
      this.__detectedCardQueue.push(imgData);
      console.debug('this.__cardImgList.length : ' + this.__detectedCardQueue.length); // should be removed
    }
  }

  __onSuccessProcess(review_result) {
    var _this27 = this;
    return _asyncToGenerator(function* () {
      // 인식 성공 스캔 루프 종료
      if (review_result.ssa_mode) {
        yield _this27.__changeStage(_this27.IN_PROGRESS.OCR_SUCCESS_WITH_SSA);
      } else {
        yield _this27.__changeStage(_this27.IN_PROGRESS.OCR_SUCCESS);
      }
      var result = {
        api_response: {
          result_code: 'N100',
          result_message: 'OK.'
        },
        result: 'success',
        review_result: review_result
      };
      if (_this27.__onSuccess) {
        _this27.__onSuccess(result);
        _this27.__onSuccess = null;
      } else {
        console.log('[WARN] onSuccess callback is null, so skip to send result');
      }
    })();
  }
  __onFailureProcess(resultCode, e, errorMessage) {
    var _this28 = this;
    return _asyncToGenerator(function* () {
      yield _this28.__changeStage(_this28.IN_PROGRESS.OCR_FAILED);
      var errorDetail = '';
      if (e !== null && e !== void 0 && e.toString()) errorDetail += e.toString();
      if (e !== null && e !== void 0 && e.stack) errorDetail += e.stack;
      var result = {
        api_response: {
          result_code: resultCode,
          result_message: errorMessage
        },
        result: 'failed',
        review_result: {
          ocr_type: _this28.__ocrType,
          error_detail: errorDetail
        }
      };
      if (_this28.__onFailure) {
        _this28.__onFailure(result);
        _this28.__onFailure = null;
      } else {
        console.log('[WARN] onFailure callback is null, so skip to send result');
      }
    })();
  }
  __preloadingWasm() {
    var _this29 = this;
    return _asyncToGenerator(function* () {
      var preloadingStatus = _this29.getPreloadingStatus();
      if (!_this29.isPreloaded() && preloadingStatus === _this29.PRELOADING_STATUS.NOT_STARTED) {
        console.log('!!! WASM OCR IS NOT STARTED PRELOADING. SO, WILL BE START PRELOADING !!!');
        yield _this29.preloading();
      } else {
        if (preloadingStatus === _this29.PRELOADING_STATUS.STARTED) {
          console.log('!!! WASM OCR IS STARTED. BUT, IS NOT DONE. SO, WAITING FOR PRELOADING !!!');
          yield _this29.__waitPreloaded();
        } else if (preloadingStatus === _this29.PRELOADING_STATUS.DONE) {
          console.log('!!! ALREADY WASM OCR IS PRELOADED !!!');
        } else {
          throw new Error("abnormally preloading status, preloaded: ".concat(_this29.isPreloaded(), " / preloadingStatus: ").concat(_this29.getPreloadingStatus()));
        }
      }
    })();
  }
  __setupEncryptMode() {
    if (this.isEncryptMode()) {
      if (this.__options.useEncryptMode) {
        this.__setOverallEncrypt(false);
        this.__setPiiEncrypt(true);
        // TODO: ssa 에 대한 암호화 값 제공은 별도 처리하지 않음
        //       추후 id_truth 와 fd_confidence 값 암호화 요청이 있을 경우 대응
      } else if (this.__options.useEncryptOverallMode) {
        this.__resultIdcardInfo(this.__options.ocrResultIdcardKeylist);
        this.__resultPassportInfo(this.__options.ocrResultPassportKeylist);
        this.__resultAlienInfo(this.__options.ocrResultAlienKeylist);
        this.__encryptIdcardInfo(this.__options.encryptedOcrResultIdcardKeylist);
        this.__encryptPassportInfo(this.__options.encryptedOcrResultPassportKeylist);
        this.__encryptAlienInfo(this.__options.encryptedOcrResultAlienKeylist);
        this.__setOverallEncrypt(true);
        this.__setPiiEncrypt(false);
        if (this.__ssaMode) {
          this.__resultTruthInfo([...this.__ocrResultTruthKeySet]);
          if (this.isEncryptMode()) {
            this.__encryptTruthInfo([...this.__ocrResultTruthKeySet]);
          }
        }
      } else if (this.__options.useEncryptValueMode) {
        this.__resultIdcardInfo(this.__options.ocrResultIdcardKeylist);
        this.__resultPassportInfo(this.__options.ocrResultPassportKeylist);
        this.__resultAlienInfo(this.__options.ocrResultAlienKeylist);
        this.__encryptIdcardInfo(this.__options.encryptedOcrResultIdcardKeylist);
        this.__encryptPassportInfo(this.__options.encryptedOcrResultPassportKeylist);
        this.__encryptAlienInfo(this.__options.encryptedOcrResultAlienKeylist);
        this.__setOverallEncrypt(false);
        this.__setPiiEncrypt(false);
        if (this.__ssaMode) {
          this.__resultTruthInfo([...this.__ocrResultTruthKeySet]);
          if (this.isEncryptMode()) {
            this.__encryptTruthInfo([...this.__ocrResultTruthKeySet]);
          }
        }
      }
    } else {
      this.__resultIdcardInfo([...this.__ocrResultIdcardKeySet]);
      this.__resultPassportInfo([...this.__ocrResultPassportKeySet]);
      this.__resultAlienInfo([...this.__ocrResultAlienKeySet]);
      this.__encryptIdcardInfo('');
      this.__encryptPassportInfo('');
      this.__encryptAlienInfo('');
      this.__setOverallEncrypt(false);
      this.__setPiiEncrypt(false);
      if (this.__ssaMode) {
        this.__resultTruthInfo([...this.__ocrResultTruthKeySet]);
        this.__encryptTruthInfo('');
      }
    }
  }
  __setupImageMode() {
    var imgMode;
    if (this.isCreditCard()) {
      imgMode = this.OCR_IMG_MODE.CROPPING;
    } else if (this.__options.useImageCropping) {
      imgMode = this.OCR_IMG_MODE.CROPPING;
    } else if (this.__options.useImageWarping) {
      imgMode = this.OCR_IMG_MODE.WARPING;
    } else {
      imgMode = this.OCR_IMG_MODE.NONE;
    }
    this.__setImageResult(imgMode);
  }
  __setPiiEncrypt(piiEncryptMode) {
    this.__OCREngine.setPiiEncrypt(piiEncryptMode);
  }
  __stringArrayToString(stringArray) {
    var retString = null;
    if (stringArray === '') return stringArray;
    if (stringArray === undefined || stringArray === null || stringArray.length === 0) return retString;
    retString = '';
    for (var i = 0; i < stringArray.length; i++) {
      retString += stringArray[i];
      if (i < stringArray.length - 1) {
        retString += ',';
      }
    }
    return retString;
  }
  __resultIdcardInfo(optIdcard) {
    this.__OCREngine.setIdcardResult(this.__stringArrayToString(optIdcard));
  }
  __resultPassportInfo(optPassport) {
    this.__OCREngine.setPassportResult(this.__stringArrayToString(optPassport));
  }
  __resultAlienInfo(optAlien) {
    this.__OCREngine.setAlienResult(this.__stringArrayToString(optAlien));
  }
  __resultTruthInfo(optTruth) {
    this.__OCREngine.setTruthResult(this.__stringArrayToString(optTruth));
  }
  __encryptIdcardInfo(optIdcard) {
    this.__OCREngine.setIdcardEncrypt(this.__stringArrayToString(optIdcard));
  }
  __encryptPassportInfo(optPassport) {
    this.__OCREngine.setPassportEncrypt(this.__stringArrayToString(optPassport));
  }
  __encryptAlienInfo(optAlien) {
    this.__OCREngine.setAlienEncrypt(this.__stringArrayToString(optAlien));
  }
  __encryptTruthInfo(optTruth) {
    this.__OCREngine.setTruthEncrypt(this.__stringArrayToString(optTruth));
  }
  __setOverallEncrypt(val) {
    this.__OCREngine.setOverallEncrypt(val);
  }
  __setImageResult(val) {
    this.__OCREngine.setImageResult(val);
  }

  // TODO : 어디서 사용하는지 확인 필요
  // __setPassportResult(val) {
  //   this.__OCREngine.setPassportResultType(val);
  // }

  // TODO : credit card 에서 사용중이어서 삭제 불가 (wasm 레벨로 변경될 경우 삭제 가능) -- START
  __encryptDetectedBase64(address, mask, ocr_mode) {
    var imgType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'card';
    if (imgType === 'face') {
      return this.__OCREngine.encryptBase64jpgDetectedPhotoBase64(address);
    }
    return this.__OCREngine.encryptBase64jpgDetectedFrameBase64(address, mask, ocr_mode);
  }
  __getEncryptedSize() {
    return this.__OCREngine.getEncryptedJpgSize();
  }
  __getEncryptedBuffer() {
    return this.__OCREngine.getEncryptedJpgBuffer();
  }
  __getPiiEncryptImageBase64(address, mask, imgMode) {
    var imgType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'card';
    var encryptDetectedBase64 = this.__encryptDetectedBase64(address, mask, imgMode, imgType);
    if (encryptDetectedBase64 === 1) {
      var jpgSize = this.__getEncryptedSize();
      var jpgPointer = this.__getEncryptedBuffer();
      var encrypted = new Uint8Array(this.__OCREngine.HEAP8.buffer, jpgPointer, jpgSize);
      var textDecoder = new TextDecoder('utf-8');
      return textDecoder.decode(encrypted);
    } else {
      return '';
    }
  }
  __getImageBase64(address, maskMode, imgMode) {
    var _arguments5 = arguments,
      _this30 = this;
    return _asyncToGenerator(function* () {
      var imgType = _arguments5.length > 3 && _arguments5[3] !== undefined ? _arguments5[3] : 'card';
      try {
        if (imgType === 'card') {
          _this30.__OCREngine.encodeJpgDetectedFrameImage(address, maskMode, imgMode);
        } else if (imgType === 'face') {
          _this30.__OCREngine.encodeJpgDetectedPhotoImage(address);
        }
        var jpgSize = _this30.__OCREngine.getEncodedJpgSize();
        var jpgPointer = _this30.__OCREngine.getEncodedJpgBuffer();
        var resultView = new Uint8Array(_this30.__OCREngine.HEAP8.buffer, jpgPointer, jpgSize);
        var result = new Uint8Array(resultView);
        var blob = new Blob([result], {
          type: 'image/jpeg'
        });
        return yield _this30.__blobToBase64(blob);
      } catch (e) {
        console.error('error:' + e);
        throw e;
      } finally {
        _this30.__OCREngine.destroyEncodedJpg();
      }
    })();
  }
  // TODO : credit card 에서 사용중이어서 삭제 불가 (wasm 레벨로 변경될 경우 삭제 가능) -- END

  __startScanWasm() {
    var _this31 = this;
    return _asyncToGenerator(function* () {
      _this31.__debug('wasm_mode');
      _this31.cleanup();
      yield _this31.__proceedCameraPermission();
      yield _this31.__startScanWasmImpl();
      console.log('SCAN END');
    })();
  }
  __startScanServer() {
    var _this32 = this;
    return _asyncToGenerator(function* () {
      _this32.__debug('server_mode');
      _this32.cleanup();
      _this32.__options.useCaptureUI = true;
      yield _this32.__proceedCameraPermission();
      yield _this32.__startScanServerImpl();
      console.log('SCAN END');
    })();
  }
  __recoveryScan() {
    var _this33 = this;
    return _asyncToGenerator(function* () {
      console.log('!!! RECOVERY SCAN !!!');
      _this33.__resourcesLoaded = false;
      _this33.stopScan();
      yield _this33.__startScanWasm();
    })();
  }
  stopScan() {
    this.__detected = true; // switch to server일때 기존 WASM loop 강제종료
    var {
      canvas
    } = detector.getOCRElements();
    if (canvas) {
      var canvasContext = canvas.getContext('2d', {
        willReadFrequently: true
      });
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  stopStream() {
    cancelAnimationFrame(this.__requestAnimationFrameId);
    if (this.__stream) {
      this.__stream.stop && this.__stream.stop();
      var tracks = this.__stream.getTracks && this.__stream.getTracks();
      console.debug('CardScan__stopStream', tracks);
      if (tracks && tracks.length) {
        tracks.forEach(track => track.stop());
      }
      this.__stream = null;
    }
  }

  /** 메모리 allocation free 함수 */
  cleanup() {
    this.__destroyScannerAddress();
    this.__destroyBuffer();
    this.__destroyPrevImage();
    this.__destroyStringOnWasmHeap();
  }
  restoreInitialize() {
    this.__initialized = false;
    this.__preloaded = false;
    this.__preloadingStatus = this.PRELOADING_STATUS.NOT_STARTED;
    this.__resourcesLoaded = false;
  }
  __clearCameraPermissionTimeoutTimer() {
    if (this.__cameraPermissionTimeoutTimer) {
      clearTimeout(this.__cameraPermissionTimeoutTimer);
      this.__cameraPermissionTimeoutTimer = null;
    }
  }
}
export default UseBOCR;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2NyLmpzIiwibmFtZXMiOlsiZGV0ZWN0b3IiLCJ1c2ViT0NSV0FTTVBhcnNlciIsInVzZWJPQ1JBUElQYXJzZXIiLCJpc1N1cHBvcnRXYXNtIiwibWVhc3VyZSIsInNpbWQiLCJJbWFnZVV0aWwiLCJpbnN0YW5jZSIsIk9QVElPTl9URU1QTEFURSIsIk9iamVjdCIsInNob3dDbGlwRnJhbWUiLCJzaG93Q2FudmFzUHJldmlldyIsInVzZUVuY3J5cHRWYWx1ZU1vZGUiLCJ1c2VFbmNyeXB0T3ZlcmFsbE1vZGUiLCJ1c2VFbmNyeXB0TW9kZSIsInVzZUxlZ2FjeUZvcm1hdCIsInVzZU1hc2tJbmZvIiwidXNlRmFjZUltYWdlIiwidXNlSW1hZ2VDcm9wcGluZyIsInVzZUltYWdlV2FycGluZyIsInVzZUNvbXByZXNzSW1hZ2UiLCJ1c2VDb21wcmVzc0ltYWdlTWF4V2lkdGgiLCJ1c2VDb21wcmVzc0ltYWdlTWF4Vm9sdW1lIiwib2NyUmVzdWx0SWRjYXJkS2V5bGlzdCIsImVuY3J5cHRlZE9jclJlc3VsdElkY2FyZEtleWxpc3QiLCJvY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QiLCJlbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QiLCJvY3JSZXN1bHRBbGllbktleWxpc3QiLCJlbmNyeXB0ZWRPY3JSZXN1bHRBbGllbktleWxpc3QiLCJ1c2VUb3BVSSIsInVzZVRvcFVJVGV4dE1zZyIsInVzZU1pZGRsZVVJIiwidXNlTWlkZGxlVUlUZXh0TXNnIiwidXNlQm90dG9tVUkiLCJ1c2VCb3R0b21VSVRleHRNc2ciLCJ1c2VQcmV2aWV3VUkiLCJ1c2VDYXB0dXJlVUkiLCJwcmVsb2FkaW5nVUlUZXh0TXNnIiwiZnJhbWVCb3JkZXJTdHlsZSIsIndpZHRoIiwicmFkaXVzIiwic3R5bGUiLCJub3RfcmVhZHkiLCJyZWFkeSIsImRldGVjdF9zdWNjZXNzIiwiZGV0ZWN0X2ZhaWxlZCIsIm1hbnVhbF9jYXB0dXJlX3N1Y2Nlc3MiLCJtYW51YWxfY2FwdHVyZV9mYWlsZWQiLCJyZWNvZ25pemVkIiwicmVjb2duaXplZF93aXRoX3NzYSIsIm9jcl9zdWNjZXNzIiwib2NyX3N1Y2Nlc3Nfd2l0aF9zc2EiLCJvY3JfZmFpbGVkIiwidXNlTWFza0ZyYW1lQ29sb3JDaGFuZ2UiLCJtYXNrRnJhbWVTdHlsZSIsImNsaXBfZnJhbWUiLCJiYXNlX2NvbG9yIiwidXNlQXV0b1N3aXRjaFRvU2VydmVyTW9kZSIsInVzZU1hbnVhbFN3aXRjaFRvU2VydmVyTW9kZSIsInN3aXRjaFRvU2VydmVyVGhyZXNob2xkIiwidXNlRm9yY2VDb21wbGV0ZVVJIiwiY2FwdHVyZUJ1dHRvblN0eWxlIiwic3Ryb2tlX2NvbG9yIiwicmVzb3VyY2VCYXNlVXJsIiwid2luZG93IiwibG9jYXRpb24iLCJvcmlnaW4iLCJkZXZpY2VMYWJlbCIsInZpZGVvVGFyZ2V0SWQiLCJyb3RhdGlvbkRlZ3JlZSIsIm1pcnJvck1vZGUiLCJjYW1lcmFSZXNvdXJjZVJlcXVlc3RSZXRyeUludGVydmFsIiwiY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlMaW1pdCIsImNhbWVyYVJlc29sdXRpb25Dcml0ZXJpYSIsImNhbGNHdWlkZUJveENyaXRlcmlhIiwic3NhUmV0cnlUeXBlIiwic3NhUmV0cnlQaXZvdCIsInNzYU1heFJldHJ5Q291bnQiLCJ1c2VEZWJ1Z0FsZXJ0IiwiZm9yY2Vfd2FzbV9yZWxvYWQiLCJmb3JjZV93YXNtX3JlbG9hZF9mbGFnIiwiVXNlQk9DUiIsImNvbnN0cnVjdG9yIiwiX2RlZmluZVByb3BlcnR5IiwiTk9ORSIsIk5PVF9SRUFEWSIsIlJFQURZIiwiQ0FSRF9ERVRFQ1RfU1VDQ0VTUyIsIkNBUkRfREVURUNUX0ZBSUxFRCIsIk1BTlVBTF9DQVBUVVJFX1NVQ0NFU1MiLCJNQU5VQUxfQ0FQVFVSRV9GQUlMRUQiLCJPQ1JfUkVDT0dOSVpFRCIsIk9DUl9SRUNPR05JWkVEX1dJVEhfU1NBIiwiT0NSX1NVQ0NFU1MiLCJPQ1JfU1VDQ0VTU19XSVRIX1NTQSIsIk9DUl9GQUlMRUQiLCJET05FIiwiTk9UX1NUQVJURUQiLCJTVEFSVEVEIiwiV0FSUElORyIsIkNST1BQSU5HIiwiRkFMU0UiLCJUUlVFIiwiUFJFTE9BRElOR19TVEFUVVMiLCJPQ1JfU1RBVFVTIiwiTWFwIiwiU2V0IiwiSU5fUFJPR1JFU1MiLCJfb2JqZWN0U3ByZWFkIiwicHJlbG9hZGluZyIsIm9uUHJlbG9hZGVkIiwiX3RoaXMiLCJfYXN5bmNUb0dlbmVyYXRvciIsImlzUHJlbG9hZGVkIiwiY29uc29sZSIsImxvZyIsInNob3dPQ1JMb2FkaW5nVUkiLCJfX3ByZWxvYWRpbmdTdGF0dXMiLCJfX2xvYWRSZXNvdXJjZXMiLCJfX3ByZWxvYWRlZCIsImhpZGVPQ1JMb2FkaW5nVUkiLCJpc0luaXRpYWxpemVkIiwiX19pbml0aWFsaXplZCIsImdldFByZWxvYWRpbmdTdGF0dXMiLCJpc0VuY3J5cHRNb2RlIiwiX19vcHRpb25zIiwiaXNDcmVkaXRDYXJkIiwiX19vY3JUeXBlIiwicHJlbG9hZGluZ1VJV3JhcCIsImdldE9DUkVsZW1lbnRzIiwiZGlzcGxheSIsImV4Y2x1ZGVPY3JSZXN1bHQiLCJvY3JfcmVzdWx0IiwiZXhjbHVkZUtleWxpc3QiLCJfIiwib21pdCIsImV4Y2x1ZGVPY3JJbWFnZSIsInJldmlld19yZXN1bHQiLCJnZXRPQ1JFbmdpbmUiLCJfX09DUkVuZ2luZSIsImluaXQiLCJzZXR0aW5ncyIsImxpY2Vuc2VLZXkiLCJFcnJvciIsIl9fbGljZW5zZSIsIm9jclJlc3VsdEtleWxpc3RTdHJpbmdUb0l0ZXIiLCJzdHIiLCJrZXlJdGVyIiwidG9Mb3dlckNhc2UiLCJyZXBsYWNlIiwic3BsaXQiLCJmaWx0ZXIiLCJrIiwiaGFzIiwiX19vY3JSZXN1bHRJZGNhcmRLZXlTZXQiLCJfX29jclJlc3VsdFBhc3Nwb3J0S2V5U2V0IiwiX19vY3JSZXN1bHRBbGllbktleVNldCIsIm1lcmdlZE9wdGlvbnMiLCJtZXJnZSIsInNldE9wdGlvbiIsImdldE9wdGlvbiIsIl9fd2luZG93RXZlbnRCaW5kIiwiX19kZXZpY2VJbmZvIiwiZ2V0T3NWZXJzaW9uIiwiZGVidWciLCJvc1NpbXBsZSIsIl9faXNTdXBwb3J0V2FzbSIsImdldE9jclR5cGUiLCJ0eXBlIiwiX19vY3JUeXBlTnVtYmVyVG9TdHJpbmciLCJnZXQiLCJnZXRPY3JUeXBlTnVtYmVyIiwic3RyaW5nIiwiX19vY3JTdHJpbmdUb1R5cGVOdW1iZXIiLCJnZXRVSU9yaWVudGF0aW9uIiwiX191aU9yaWVudGF0aW9uIiwiZ2V0VmlkZW9PcmllbnRhdGlvbiIsIl9fdmlkZW9PcmllbnRhdGlvbiIsImNoZWNrU3dpdGNoVG9TZXJ2ZXJNb2RlIiwiX3RoaXMyIiwiX19pc1N3aXRjaFRvU2VydmVyTW9kZSIsImxhdGVuY3lQZXIxMDBtcyIsIm1lYXN1cmVSZXBvcnQiLCJfX2RlYnVnIiwicGFyc2VGbG9hdCIsInN0YXJ0T0NSIiwib25TdWNjZXNzIiwib25GYWlsdXJlIiwiX2FyZ3VtZW50cyIsImFyZ3VtZW50cyIsIl90aGlzMyIsIm9uSW5Qcm9ncmVzc0NoYW5nZSIsImxlbmd0aCIsInVuZGVmaW5lZCIsIl9fc3NhTW9kZSIsImluZGV4T2YiLCJfX29uU3VjY2VzcyIsIl9fb25GYWlsdXJlIiwiX19vbkluUHJvZ3Jlc3NDaGFuZ2UiLCJfX3RvcFVJIiwidG9wVUkiLCJfX21pZGRsZVVJIiwibWlkZGxlVUkiLCJfX2JvdHRvbVVJIiwiYm90dG9tVUkiLCJfX2NoYW5nZVN0YWdlIiwiX19wcmVwcm9jZXNzIiwiX19zZXR1cERvbUVsZW1lbnRzIiwiX19zdGFydFNjYW5TZXJ2ZXIiLCJfX3ByZWxvYWRpbmdXYXNtIiwiX19zdGFydFNjYW5XYXNtIiwiZSIsImVycm9yIiwic3RvcE9DUiIsImNsZWFudXAiLCJfX2Nsb3NlQ2FtZXJhIiwic2V0SWdub3JlQ29tcGxldGUiLCJ2YWwiLCJyZXN0YXJ0T0NSIiwib2NyVHlwZSIsIl9hcmd1bWVudHMyIiwiX3RoaXM0IiwiaXNTd2l0Y2hNb2RlIiwiX19jYW1TZXRDb21wbGV0ZSIsIl9fd2FpdFByZWxvYWRlZCIsIl90aGlzNSIsIndhaXRpbmdSZXRyeUNvdW50IiwiUHJvbWlzZSIsInJlc29sdmUiLCJjaGVjayIsInNldFRpbWVvdXQiLCJjb252ZXJ0VHlwZVRvSW50ZWdlciIsIm9wdGlvbiIsImRlZmF1bHRWYWx1ZSIsImlzTmFOIiwicGFyc2VJbnQiLCJjb252ZXJ0VHlwZVRvRmxvYXQiLCJjb252ZXJ0VHlwZVRvQm9vbGVhbiIsImdldE9wdGlvbktleUxpc3RCeVR5cGUiLCJ0YXJnZXRPYmoiLCJ0YXJnZXRUeXBlIiwia2V5cyIsInZhbHVlIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiYm9vbGVhblR5cGVPcHRpb25zIiwiaW50ZWdlclR5cGVPcHRpb25zIiwiZmxvYXRUeXBlT3B0aW9ucyIsImZvckVhY2giLCJrZXkiLCJfdGhpc18iLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50Iiwic2tpcFRvdWNoQWN0aW9uZm9yWm9vbSIsImV2IiwidG91Y2hlcyIsInByZXZlbnREZWZhdWx0Iiwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmUiLCJvbmJlZm9yZXVubG9hZCIsIl9fcGFnZUVuZCIsImhhbmRsZVJlc2l6ZSIsIl9yZWYyIiwiX19pc0luUHJvZ3Jlc3NIYW5kbGVSZXNpemUiLCJfX3Rocm90dGxpbmdSZXNpemVUaW1lciIsImFwcGx5IiwiX190aHJvdHRsaW5nUmVzaXplRGVsYXkiLCJtc2ciLCJhbGVydCIsImNvbmNhdCIsIl9fc2xlZXAiLCJtcyIsIl9fYmxvYlRvQmFzZTY0IiwiYmxvYiIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWRlbmQiLCJyZXN1bHQiLCJyZWFkQXNEYXRhVVJMIiwiX19iYXNlNjR0b0Jsb2IiLCJiYXNlNjQiLCJieXRlU3RyaW5nIiwiYXRvYiIsIm1pbWVTdHJpbmciLCJhYiIsIkFycmF5QnVmZmVyIiwiaWEiLCJVaW50OEFycmF5IiwiaSIsImNoYXJDb2RlQXQiLCJCbG9iIiwiX19jb21wcmVzc0Jhc2U2NEltYWdlIiwib3B0aW9ucyIsImNvbnN0YW50TnVtYmVyIiwiX3RoaXM2IiwiYmxvYkZpbGUiLCJjb21wcmVzc2VkIiwiY29tcHJlc3NJbWFnZSIsImNvbXByZXNzaW9uUmF0aW8iLCJNYXRoIiwicm91bmQiLCJzaXplIiwiX19nZXRTdHJpbmdPbldhc21IZWFwIiwibGVuZ3RoQnl0ZXMiLCJsZW5ndGhCeXRlc1VURjgiLCJfX3N0cmluZ09uV2FzbUhlYXAiLCJfbWFsbG9jIiwic3RyaW5nVG9VVEY4IiwiX19zZXRWaWRlb1Jlc29sdXRpb24iLCJ2aWRlb0VsZW1lbnQiLCJfdGhpczciLCJpc1N1cHBvcnRlZFJlc29sdXRpb24iLCJyZXNvbHV0aW9uVGV4dCIsInZpZGVvV2lkdGgiLCJ2aWRlb0hlaWdodCIsInNyY09iamVjdCIsIl9fdmlkZW9XaWR0aCIsIl9fdmlkZW9IZWlnaHQiLCJfX2dldFNjYW5uZXJBZGRyZXNzIiwiX19vY3JUeXBlTGlzdCIsImluY2x1ZGVzIiwiYWRkcmVzcyIsImRlc3Ryb3lDYWxsYmFjayIsInN0cmluZ09uV2FzbUhlYXAiLCJnZXRJRENhcmRTY2FubmVyIiwiZGVzdHJveUlEQ2FyZFNjYW5uZXIiLCJnZXRQYXNzcG9ydFNjYW5uZXIiLCJkZXN0cm95UGFzc3BvcnRTY2FubmVyIiwiZ2V0QWxpZW5TY2FubmVyIiwiZGVzdHJveUFsaWVuU2Nhbm5lciIsImdldENyZWRpdFNjYW5uZXIiLCJkZXN0cm95Q3JlZGl0U2Nhbm5lciIsIl9mcmVlIiwiX19tYXhSZXRyeUNvdW50R2V0QWRkcmVzcyIsIl9fcmV0cnlDb3VudEdldEFkZHJlc3MiLCJfX2dldEJ1ZmZlciIsIl9fQnVmZmVyIiwiX19yZXNvbHV0aW9uV2lkdGgiLCJfX3Jlc29sdXRpb25IZWlnaHQiLCJfX3Jlc3VsdEJ1ZmZlciIsIl9fbWFza0luZm9SZXN1bHRCdWYiLCJfX2Rlc3Ryb3lCdWZmZXIiLCJfX2Rlc3Ryb3lSZXN1bHRCdWZmZXIiLCJfX2Rlc3Ryb3lNYXNrSW5mb1Jlc3VsdEJ1ZmZlciIsIl9fZGVzdHJveVByZXZJbWFnZSIsIl9fUHJldkltYWdlIiwiX19kZXN0cm95U3RyaW5nT25XYXNtSGVhcCIsIl9fZGVzdHJveVNjYW5uZXJBZGRyZXNzIiwiX19kZXN0cm95U2Nhbm5lckNhbGxiYWNrIiwiX19pc1ZpZGVvUmVzb2x1dGlvbkNvbXBhdGlibGUiLCJfdGhpczgiLCJfX2dldFJvdGF0aW9uRGVncmVlIiwiX19nZXRNaXJyb3JNb2RlIiwiX19jcm9wSW1hZ2VGcm9tVmlkZW8iLCJfdGhpczkiLCJjYWxjUmVzb2x1dGlvbl93IiwiY2FsY1Jlc29sdXRpb25faCIsInZpZGVvIiwiY2FudmFzIiwicm90YXRpb25DYW52YXMiLCJjYWxjQ2FudmFzIiwiY2FsY1ZpZGVvV2lkdGgiLCJjYWxjVmlkZW9IZWlnaHQiLCJjYWxjVmlkZW9DbGllbnRXaWR0aCIsImNsaWVudFdpZHRoIiwiY2FsY1ZpZGVvQ2xpZW50SGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY2FsY0Nyb3BJbWFnZVNpemVXaWR0aCIsIl9fY3JvcEltYWdlU2l6ZVdpZHRoIiwiY2FsY0Nyb3BJbWFnZVNpemVIZWlnaHQiLCJfX2Nyb3BJbWFnZVNpemVIZWlnaHQiLCJjYWxjVmlkZW9PcmllbnRhdGlvbiIsImlzQWxpZW5CYWNrIiwiX19pc1JvdGF0ZWQ5MG9yMjcwIiwiY2FsY01heFNXaWR0aCIsImNhbGNNYXhTSGVpZ2h0Iiwic3giLCJzeSIsInJhdGlvIiwic1dpZHRoIiwibWluIiwic0hlaWdodCIsIm1heCIsInNldEF0dHJpYnV0ZSIsImNhbGNDb250ZXh0IiwiZ2V0Q29udGV4dCIsIndpbGxSZWFkRnJlcXVlbnRseSIsImRyYXdJbWFnZSIsImltZ0RhdGEiLCJpbWdEYXRhVXJsIiwiZ2V0SW1hZ2VEYXRhIiwidXNlRGF0YVVSTCIsInRvRGF0YVVSTCIsIl9fcm90YXRlIiwiZGVncmVlIiwiaW1nIiwiSW1hZ2UiLCJ0ZW1wQ2FudmFzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwidGVtcENvbnRleHQiLCJwb3NpdGlvbiIsImhlaWdodCIsInRyYW5zbGF0ZSIsInJvdGF0ZSIsIlBJIiwibmV3SW1hZ2VEYXRhIiwicmVzdG9yZSIsIl9faXNDYXJkYm94RGV0ZWN0ZWQiLCJfYXJndW1lbnRzMyIsIl90aGlzMTAiLCJib3hUeXBlIiwicmV0cnlJbWciLCJidWZmZXIiLCJIRUFQOCIsInNldCIsImRhdGEiLCJrb3IiLCJhbGllbiIsInBhc3Nwb3J0IiwiZGV0ZWN0X2lkY2FyZF9vcHQiLCJkZXRlY3RfaWRjYXJkIiwibWVzc2FnZSIsInRvU3RyaW5nIiwiX19zdGFydFJlY29nbml0aW9uIiwic3NhTW9kZSIsImlzU2V0SWdub3JlQ29tcGxldGUiLCJfdGhpczExIiwicmF3RGF0YSIsIm9jclJlc3VsdCIsInJlY29nbml0aW9uIiwiX3JlZjUiLCJfb2NyUmVzdWx0IiwiX29jclJlc3VsdDIiLCJzY2FuSURDYXJkIiwic2NhblBhc3Nwb3J0Iiwic2NhbkFsaWVuIiwic2NhbkFsaWVuQmFjayIsInNjYW5DcmVkaXQiLCJvcmlnaW5JbWFnZSIsIl9fZ2V0UmVzdWx0SW1hZ2VzIiwib2NyX29yaWdpbl9pbWFnZSIsIl9fc3RyaW5nVG9Kc29uIiwib2NyX21hc2tpbmdfaW1hZ2UiLCJvY3JfZmFjZV9pbWFnZSIsIm9jclJlc3VsdFRtcCIsIl9fb2NySW1hZ2VHdWFyZCIsImVuY3J5cHRlZE9jclJlc3VsdCIsImVuY3J5cHRlZCIsImVuY3J5cHRlZF9vdmVyYWxsIiwidGltZXN0YW1wIiwiY29tcGxldGUiLCJfX21hbnVhbE9DUlJldHJ5Q291bnQiLCJfX21hbnVhbE9DUk1heFJldHJ5Q291bnQiLCJxdWV1ZUlkeCIsIl9fZGV0ZWN0ZWRDYXJkUXVldWUiLCJfX2JsdXJDYXB0dXJlQnV0dG9uIiwiX19zZXRTdHlsZSIsIl94IiwiX3RoaXMxMiIsIm9yaWdpbkltYWdlTW9kZSIsIk9DUl9JTUdfTU9ERSIsIl9fZ2V0UGlpRW5jcnlwdEltYWdlQmFzZTY0IiwiT0NSX0lNR19NQVNLX01PREUiLCJfX2dldEltYWdlQmFzZTY0IiwibWFza0ltYWdlTW9kZSIsIm1hc2tJbWFnZSIsImZhY2VJbWFnZSIsIl9fc3RhcnRUcnV0aCIsInJlamVjdCIsInJlc3VsdEJ1ZmZlciIsInNjYW5UcnV0aCIsIl9fY3N2VG9PYmplY3QiLCJwYWlycyIsIm9iaiIsInBhaXIiLCJrZXlWYWx1ZVBhaXJzIiwibWF0Y2giLCJ0cmltIiwic2xpY2UiLCJqb2luIiwic3RhcnRzV2l0aCIsImVuZHNXaXRoIiwic3ViU3RyIiwic3Vic3RyaW5nIiwic3ViT2JqIiwiX19nZXRNYXNrSW5mbyIsIm1hc2tJbmZvUmVzdWx0QnVmIiwiZ2V0TWFza1JlY3QiLCJfX3N0YXJ0VHJ1dGhSZXRyeSIsIl90aGlzMTMiLCJfX3NldENhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIiLCJfdGhpczE0IiwiX19jbGVhckNhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIiLCJfX2NhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIiLCJfX3Byb2NlZWRDYW1lcmFQZXJtaXNzaW9uIiwiX3RoaXMxNSIsImlzUGFzc3BvcnQiLCJfX3NldHVwVmlkZW8iLCJfX3N0cmVhbSIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsInBsYXkiLCJfX2FkanVzdFN0eWxlIiwid2Via2l0RXhpdEZ1bGxzY3JlZW4iLCJuYW1lIiwiZXJyb3JNZXNzYWdlIiwiX19vbkZhaWx1cmVQcm9jZXNzIiwic3RvcFN0cmVhbSIsIl9fY2FtZXJhUmVzb3VyY2VSZXRyeUNvdW50IiwiZWwiLCJhc3NpZ24iLCJfX2NoYW5nZU9DUlN0YXR1cyIsIl9fb2NyU3RhdHVzIiwiX2FyZ3VtZW50czQiLCJfdGhpczE2IiwiZm9yY2VVcGRhdGUiLCJyZWNvZ25pemVkSW1hZ2UiLCJfX3ByZXZpb3VzSW5Qcm9ncmVzc1N0ZXAiLCJfX2luUHJvZ3Jlc3NTdGVwIiwiZ3VpZGVCb3giLCJtYXNrQm94V3JhcCIsImNhcHR1cmVCdXR0b24iLCJib3JkZXJXaWR0aCIsImJvcmRlclN0eWxlIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyQ29sb3IiLCJfbWFza0JveFdyYXAkcXVlcnlTZWwiLCJxdWVyeVNlbGVjdG9yIiwiX2NhcHR1cmVCdXR0b24kcXVlcnlTIiwib2NyTW9kZSIsImNhbGwiLCJfX3VwZGF0ZVByZXZpZXdVSSIsIl9faGlkZVByZXZpZXdVSSIsInByZXZpZXdVSVdyYXAiLCJwcmV2aWV3SW1hZ2UiLCJpbWdTdHlsZSIsImNvbnRleHQiLCJfX2dldElucHV0RGV2aWNlcyIsIl90aGlzMTciLCJtZWRpYURldmljZXMiLCJkZXZpY2VzIiwiZW51bWVyYXRlRGV2aWNlcyIsImNhbWVyYSIsImRldmljZSIsImtpbmQiLCJJbnB1dERldmljZUluZm8iLCJnZXRDYXBhYmlsaXRpZXMiLCJfY2FwJGZhY2luZ01vZGUiLCJjYXAiLCJmYWNpbmdNb2RlIiwiX19mYWNpbmdNb2RlQ29uc3RyYWludCIsIl9kZXZpY2UkbGFiZWwiLCJpc1VsdHJhQ2FtZXJhUmVnIiwibGFiZWwiLCJwdXNoIiwiZGV2aWNlSWQiLCJSZWZlcmVuY2VFcnJvciIsIl9kZXZpY2UkbGFiZWwyIiwiaXNCYWNrQ2FtZXJhUmVnIiwiY2hlY2tVSU9yaWVudGF0aW9uIiwiY3VycmVudCIsIm9jciIsImlzQ2hhbmdlZCIsIl9fcHJldlVpT3JpZW50YXRpb24iLCJfX2NsZWFyQ3VzdG9tVUkiLCJpbm5lckhUTUwiLCJyZW1vdmVBdHRyaWJ1dGUiLCJfdGhpczE4IiwidmlkZW9XcmFwIiwiZ3VpZGVCb3hXcmFwIiwicHJldmVudFRvRnJlZXplVmlkZW8iLCJjdXN0b21VSVdyYXAiLCJjYXB0dXJlVUlXcmFwIiwiY2FwdHVyZVVJIiwicHJldmlld1VJIiwic3dpdGNoVUlXcmFwIiwic3dpdGNoVUkiLCJwcmVsb2FkaW5nVUkiLCJyZW1vdmUiLCJvY3JTdHlsZSIsIndyYXBTdHlsZSIsIm1hcmdpbiIsIm92ZXJmbG93IiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwibGFzdENoaWxkIiwiYXBwZW5kQ2hpbGQiLCJtYXNrX2ZyYW1lIiwidmlkZW9TdHlsZSIsInJvdGF0ZUNzcyIsIm1pcnJvckNzcyIsInJvdGF0ZUFuZE1pcnJvckNzcyIsInRyYW5zZm9ybSIsImNhbnZhc1N0eWxlIiwibGVmdCIsInRvcCIsImJvcmRlciIsInJpZ2h0IiwiYm90dG9tIiwiY3VzdG9tVUlXcmFwU3R5bGUiLCJjYXB0dXJlVUlXcmFwU3R5bGUiLCJjdXJzb3IiLCJjYXB0dXJlQnV0dG9uU3JjU1ZHIiwiX19vbkNsaWNrQ2FwdHVyZUJ1dHRvbiIsInByZXZpZXdVSVdyYXBTdHlsZSIsInN3aXRjaFVJV3JhcFN0eWxlIiwic3dpdGNoSFRNTCIsInN3aXRjaENoZWNrYm94IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJfX29uQ2xpY2tTd2l0Y2hVSSIsIl9yZWY4IiwiZXZlbnQiLCJ0YXJnZXQiLCJjaGVja2VkIiwiX3gyIiwib25jZSIsInByZWxvYWRpbmdVSVdyYXBTdHlsZSIsIl9faW5pdFN0eWxlIiwiX19vY3IiLCJfX2NhbnZhcyIsIl9fcm90YXRpb25DYW52YXMiLCJfX3ZpZGVvIiwiX192aWRlb1dyYXAiLCJfX2d1aWRlQm94IiwiX19ndWlkZUJveFdyYXAiLCJfX21hc2tCb3hXcmFwIiwiX19wcmV2ZW50VG9GcmVlemVWaWRlbyIsIl9fY3VzdG9tVUlXcmFwIiwiX19jYXB0dXJlVUlXcmFwIiwiX19jYXB0dXJlVUkiLCJfX2NhcHR1cmVCdXR0b24iLCJfX3ByZXZpZXdVSVdyYXAiLCJfX3ByZXZpZXdVSSIsIl9fcHJldmlld0ltYWdlIiwiX19zd2l0Y2hVSVdyYXAiLCJfX3N3aXRjaFVJIiwiX19pc0NsaWNrZWRDYXB0dXJlQnV0dG9uIiwiZ2V0QXR0cmlidXRlIiwiX3RoaXMxOSIsImNvbnN0cmFpbnRXaWR0aCIsImNvbnN0cmFpbnRIZWlnaHQiLCJpZGVhbCIsImNvbnN0cmFpbnRzIiwiYXVkaW8iLCJ6b29tIiwiZm9jdXNNb2RlIiwid2hpdGVCYWxhbmNlTW9kZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRVc2VyTWVkaWEiLCJzdHJlYW0iLCJzdHJlYW1TZXR0aW5ncyIsImdldFZpZGVvVHJhY2tzIiwiZ2V0U2V0dGluZ3MiLCJhc3BlY3RSYXRpbyIsIl90aGlzMjAiLCJiYXNlV2lkdGgiLCJiYXNlSGVpZ2h0Iiwic2Nhbm5lckZyYW1lUmF0aW8iLCJndWlkZUJveFdpZHRoIiwiZ3VpZGVCb3hIZWlnaHQiLCJjYWxjT2NyQ2xpZW50V2lkdGgiLCJjYWxjT2NyQ2xpZW50SGVpZ2h0IiwiZ3VpZGVCb3hSYXRpb0J5V2lkdGgiLCJfX2d1aWRlQm94UmF0aW9CeVdpZHRoIiwidmlkZW9SYXRpb0J5SGVpZ2h0IiwiX192aWRlb1JhdGlvQnlIZWlnaHQiLCJyZWR1Y2VkR3VpZGVCb3hXaWR0aCIsIl9fZ3VpZGVCb3hSZWR1Y2VSYXRpbyIsInJlZHVjZWRHdWlkZUJveEhlaWdodCIsInBhZGRpbmciLCJ2aWRlb0lubmVyR2FwIiwiYmFja2dyb3VuZENvbG9yIiwibWFza0JveElubmVyIiwiciIsIm1hc2tCb3hJbm5lcldpZHRoIiwibWFza0JveElubmVySGVpZ2h0IiwiX3RoaXMyMSIsIl9fY2FsY0d1aWRlQm94Q3JpdGVyaWEiLCJhIiwiYiIsIm5ld1ZpZGVvV2lkdGgiLCJuZXdWaWRlb0hlaWdodCIsIm5ld1ZpZGVvUmF0aW9CeVdpZHRoIiwibmV3VmlkZW9SYXRpb0J5SGVpZ2h0IiwiY2FsY1N1bU9mSGVpZ2h0Qm90dG9tVUlDaGlsZE5vZGVzIiwiX19jYWxjU3VtT2ZIZWlnaHRDaGlsZE5vZGVzIiwiY2FsY0NhcHR1cmVCdXR0b25IZWlnaHQiLCJjYXB0dXJlVUlQYWRkaW5nQm90dG9tIiwicGFkZGluZ1RvcCIsImJhc2VsaW5lIiwic3VtIiwiaXRlbSIsImNoaWxkTm9kZXMiLCJzdG9wU2NhbiIsIl90aGlzMjIiLCJfX3Jlc291cmNlc0xvYWRlZCIsIl9faXNTdXBwb3J0U2ltZCIsImVudkluZm8iLCJvcyIsInVzZWJPQ1JFbnZJbmZvIiwic2RrU3VwcG9ydEVudiIsInBvc3RmaXgiLCJnZXRGaWxlWEhSIiwiX3gzIiwiX2dldEZpbGVYSFIiLCJwYXRoIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwicmVzcG9uc2VUZXh0Iiwib3BlbiIsInNlbmQiLCJ1cmwiLCJocmVmIiwidGhlbiIsInRleHQiLCJyZWdleCIsInNvdXJjZSIsIlJlZ0V4cCIsImV2YWwiLCJvblJ1bnRpbWVJbml0aWFsaXplZCIsIl9yZWY5IiwiX3g0IiwiaW1hZ2UiLCJwcmVmaXgiLCJfX3N0YXJ0U2Nhbldhc21JbXBsIiwiX3RoaXMyMyIsIl9fZGV0ZWN0ZWQiLCJfX3NldHVwRW5jcnlwdE1vZGUiLCJfX3NldHVwSW1hZ2VNb2RlIiwiX19hZGRyZXNzIiwiX19zc2FSZXRyeUNvdW50Iiwic2NhbiIsIl9yZWYxMCIsImlzRGV0ZWN0ZWRDYXJkIiwic3NhUmVzdWx0Iiwic3NhUmVzdWx0TGlzdCIsIm1hc2tJbmZvIiwicmVzb2x1dGlvbl93IiwicmVzb2x1dGlvbl9oIiwiX19lbnF1ZXVlRGV0ZWN0ZWRDYXJkUXVldWUiLCJyZXRyeVN0YXJ0RGF0ZSIsIkRhdGUiLCJGQUtFIiwiUkVBTCIsIkVOU0VNQkxFIiwiaXNDb21wbGV0ZWQiLCJfbG9vcCIsImV4ZWN1dGUiLCJfcmVmMTEiLCJfcmV0IiwicmV0cnlXb3JraW5nVGltZSIsImxlZ2FjeUZvcm1hdCIsIm5ld0Zvcm1hdCIsInBhcnNlT2NyUmVzdWx0Iiwib2NyX3R5cGUiLCJzc2FfbW9kZSIsIl9fY29tcHJlc3NJbWFnZXMiLCJvY3JfZGF0YSIsIl9fb25TdWNjZXNzUHJvY2VzcyIsIl9fcmVjb3ZlcmVkIiwiX3RoaXMyNCIsInJlc2l6ZVJhdGlvIiwiZGVmYXVsdE9wdGlvbnMiLCJtYXhXaWR0aCIsIm1heEhlaWdodCIsImNvbnZlcnRTaXplIiwidGFyZ2V0Q29tcHJlc3NWb2x1bWUiLCJtYXNraW5nSW1hZ2VPcHRpb25zIiwicXVhbGl0eSIsIl9fcmVxdWVzdEdldEFQSVRva2VuIiwiY3JlZGVudGlhbCIsImF1dGhTZXJ2ZXJJbmZvIiwiYmFzZVVybCIsImZldGNoIiwiYm9keSIsIm1ldGhvZCIsInJlcyIsImpzb24iLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInRva2VuIiwiY2F0Y2giLCJlcnIiLCJfX3JlcXVlc3RTZXJ2ZXJPQ1IiLCJfdGhpczI1IiwiX3JlZjEyIiwib2NyU2VydmVyQmFzZVVybCIsImFwaVRva2VuIiwibXlIZWFkZXJzIiwiSGVhZGVycyIsImFwcGVuZCIsInBhcmFtIiwiaW1hZ2VfYmFzZTY0IiwibWFza19tb2RlIiwiZmFjZV9tb2RlIiwicmF3IiwicmVxdWVzdE9wdGlvbnMiLCJyZWRpcmVjdCIsIl94NSIsIl94NiIsIl9fc3RhcnRTY2FuU2VydmVySW1wbCIsIl90aGlzMjYiLCJfcmVmMTMiLCJfdGhpczI2JF9fY2FwdHVyZUJ1dHQiLCJfdGhpczI2JF9fY2FwdHVyZUJ1dHQyIiwiX3JlZjE0IiwiYmFzZTY0SW1hZ2VSZXN1bHQiLCJfX2RlYnVnTW9kZSIsIm9jcl9hcGlfcmVzcG9uc2UiLCJfb2NyUmVzdWx0MyIsInJlc3VsdENvZGUiLCJyZXN1bHRNZXNzYWdlIiwic2Nhbm5lcl90eXBlIiwicmVzdWx0X2NvZGUiLCJyZXN1bHREZXRhaWwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3g3IiwiX3g4IiwibGltaXRTYXZlSW1hZ2VDb3VudCIsInNoaWZ0IiwiX3RoaXMyNyIsImFwaV9yZXNwb25zZSIsInJlc3VsdF9tZXNzYWdlIiwiX3RoaXMyOCIsImVycm9yRGV0YWlsIiwic3RhY2siLCJlcnJvcl9kZXRhaWwiLCJfdGhpczI5IiwicHJlbG9hZGluZ1N0YXR1cyIsIl9fc2V0T3ZlcmFsbEVuY3J5cHQiLCJfX3NldFBpaUVuY3J5cHQiLCJfX3Jlc3VsdElkY2FyZEluZm8iLCJfX3Jlc3VsdFBhc3Nwb3J0SW5mbyIsIl9fcmVzdWx0QWxpZW5JbmZvIiwiX19lbmNyeXB0SWRjYXJkSW5mbyIsIl9fZW5jcnlwdFBhc3Nwb3J0SW5mbyIsIl9fZW5jcnlwdEFsaWVuSW5mbyIsIl9fcmVzdWx0VHJ1dGhJbmZvIiwiX19vY3JSZXN1bHRUcnV0aEtleVNldCIsIl9fZW5jcnlwdFRydXRoSW5mbyIsImltZ01vZGUiLCJfX3NldEltYWdlUmVzdWx0IiwicGlpRW5jcnlwdE1vZGUiLCJzZXRQaWlFbmNyeXB0IiwiX19zdHJpbmdBcnJheVRvU3RyaW5nIiwic3RyaW5nQXJyYXkiLCJyZXRTdHJpbmciLCJvcHRJZGNhcmQiLCJzZXRJZGNhcmRSZXN1bHQiLCJvcHRQYXNzcG9ydCIsInNldFBhc3Nwb3J0UmVzdWx0Iiwib3B0QWxpZW4iLCJzZXRBbGllblJlc3VsdCIsIm9wdFRydXRoIiwic2V0VHJ1dGhSZXN1bHQiLCJzZXRJZGNhcmRFbmNyeXB0Iiwic2V0UGFzc3BvcnRFbmNyeXB0Iiwic2V0QWxpZW5FbmNyeXB0Iiwic2V0VHJ1dGhFbmNyeXB0Iiwic2V0T3ZlcmFsbEVuY3J5cHQiLCJzZXRJbWFnZVJlc3VsdCIsIl9fZW5jcnlwdERldGVjdGVkQmFzZTY0IiwibWFzayIsIm9jcl9tb2RlIiwiaW1nVHlwZSIsImVuY3J5cHRCYXNlNjRqcGdEZXRlY3RlZFBob3RvQmFzZTY0IiwiZW5jcnlwdEJhc2U2NGpwZ0RldGVjdGVkRnJhbWVCYXNlNjQiLCJfX2dldEVuY3J5cHRlZFNpemUiLCJnZXRFbmNyeXB0ZWRKcGdTaXplIiwiX19nZXRFbmNyeXB0ZWRCdWZmZXIiLCJnZXRFbmNyeXB0ZWRKcGdCdWZmZXIiLCJlbmNyeXB0RGV0ZWN0ZWRCYXNlNjQiLCJqcGdTaXplIiwianBnUG9pbnRlciIsInRleHREZWNvZGVyIiwiVGV4dERlY29kZXIiLCJkZWNvZGUiLCJtYXNrTW9kZSIsIl9hcmd1bWVudHM1IiwiX3RoaXMzMCIsImVuY29kZUpwZ0RldGVjdGVkRnJhbWVJbWFnZSIsImVuY29kZUpwZ0RldGVjdGVkUGhvdG9JbWFnZSIsImdldEVuY29kZWRKcGdTaXplIiwiZ2V0RW5jb2RlZEpwZ0J1ZmZlciIsInJlc3VsdFZpZXciLCJkZXN0cm95RW5jb2RlZEpwZyIsIl90aGlzMzEiLCJfdGhpczMyIiwiX19yZWNvdmVyeVNjYW4iLCJfdGhpczMzIiwiY2FudmFzQ29udGV4dCIsImNsZWFyUmVjdCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiX19yZXF1ZXN0QW5pbWF0aW9uRnJhbWVJZCIsInN0b3AiLCJ0cmFja3MiLCJnZXRUcmFja3MiLCJ0cmFjayIsInJlc3RvcmVJbml0aWFsaXplIiwiY2xlYXJUaW1lb3V0Il0sInNvdXJjZXMiOlsib2NyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG4vKiBnbG9iYWwtbW9kdWxlICovXG5pbXBvcnQgZGV0ZWN0b3IgZnJvbSAnLi9oZWxwZXJzL2RldGVjdG9yLmpzJztcbmltcG9ydCB1c2ViT0NSV0FTTVBhcnNlciBmcm9tICcuL2hlbHBlcnMvdXNlYi1vY3Itd2FzbS1wYXJzZXIuanMnO1xuaW1wb3J0IHVzZWJPQ1JBUElQYXJzZXIgZnJvbSAnLi9oZWxwZXJzL3VzZWItb2NyLWFwaS1wYXJzZXIuanMnO1xuaW1wb3J0IHsgaXNTdXBwb3J0V2FzbSwgbWVhc3VyZSwgc2ltZCB9IGZyb20gJy4vaGVscGVycy93YXNtLWZlYXR1cmUtZGV0ZWN0LmpzJztcbmltcG9ydCBJbWFnZVV0aWwgZnJvbSAnLi9oZWxwZXJzL2ltYWdlLXV0aWwuanMnO1xuXG5sZXQgaW5zdGFuY2U7XG5cbmNvbnN0IE9QVElPTl9URU1QTEFURSA9IG5ldyBPYmplY3Qoe1xuICAvLyDrlJTrsoTquYUg7Ji17IWYXG4gIHNob3dDbGlwRnJhbWU6IGZhbHNlLCAvLyBjaWxwLWZyYW1lIOuztOq4sFxuICBzaG93Q2FudmFzUHJldmlldzogZmFsc2UsIC8vIGNhbnZhcyBwcmV2aWV3IOuztOq4sFxuXG4gIC8vIOy2nOugpSDsmLXshZhcbiAgLy8g7JWU7Zi47ZmUXG4gIC8vIHVzZUVuY3J5cHRNb2RlSlNMZXZlbDogZmFsc2UsIC8vIOyVlO2YuO2ZlCDsoIHsmqkgKOqwnOyduOqzoOycoOyLneuzhOu2gO2YuCDqtIDroKgg7ZWt66qpIOyVlO2YuO2ZlClcbiAgLy8gdXNlRW5jcnlwdEFsbE1vZGU6IGZhbHNlLCAvLyDslZTtmLjtmZQg7KCB7JqpICjsoITssrQg7JWU7Zi47ZmULCBlbmNyeXB0IG9iamVjdCDrs4Trj4Qg7KCc6rO1KVxuICB1c2VFbmNyeXB0VmFsdWVNb2RlOiBmYWxzZSxcbiAgdXNlRW5jcnlwdE92ZXJhbGxNb2RlOiBmYWxzZSwgLy8g7JWU7Zi47ZmUIOyggeyaqSAob2NyIOydtOuvuOyngCwg66eI7Iqk7YK5IOydtOuvuOyngCwg7Ja86rW07J2066+47KeAIO2PrO2VqClcbiAgdXNlRW5jcnlwdE1vZGU6IGZhbHNlLCAvLyDslZTtmLjtmZQg7KCB7JqpIChwaWkpXG4gIHVzZUxlZ2FjeUZvcm1hdDogZmFsc2UsIC8vIExlZ2FjeSBmb3JtYXQg7KeA7JuQXG4gIHVzZU1hc2tJbmZvOiB0cnVlLCAvLyDrp4jsiqTtgrkg7KKM7ZGcIOyngOybkFxuICB1c2VGYWNlSW1hZ2U6IHRydWUsIC8vIOyLoOu2hOymnSDrgrQg7Ja86rW0IOyCrOynhFxuICB1c2VJbWFnZUNyb3BwaW5nOiBmYWxzZSwgLy8g7Iug67aE7KadIOydtOuvuOyngOulvCBDcm9wcGluZyjtgazroa0g67O07KCVIO2VoOyngCDsl6zrtoApXG4gIHVzZUltYWdlV2FycGluZzogZmFsc2UsIC8vIOyLoOu2hOymnSDsnbTrr7jsp4DrpbwgV2FycGluZyjsmZzqs6Eg67O07KCVIO2VoOyngCDsl6zrtoApXG4gIHVzZUNvbXByZXNzSW1hZ2U6IGZhbHNlLCAvLyDsi6DrtoTspp0g7J2066+47KeA66W8IOyVley2le2VoOyngCDsl6zrtoBcbiAgdXNlQ29tcHJlc3NJbWFnZU1heFdpZHRoOiAxMDgwLCAvLyDsnbTrr7jsp4Ag66as7IKs7J207KeVIOqwgOuhnCDtlbTsg4Hrj4RcbiAgdXNlQ29tcHJlc3NJbWFnZU1heFZvbHVtZTogMTAyNCAqIDUwLCAvLyDsnbTrr7jsp4Ag7JWV7LaVIOuqqe2RnCDsmqnrn4lcbiAgb2NyUmVzdWx0SWRjYXJkS2V5bGlzdDogW10sIC8vIOyjvOuvvOymnS/rqbTtl4jspp0g7Y+J66y4IOqysOqzvCDstpzroKUg7YKkIOuqqeuhnVxuICBlbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0OiBbXSwgLy8g7KO866+87KadL+uptO2XiOymnSDslZTtmLjtmZQg6rKw6rO8IOy2nOugpSDtgqQg66qp66GdXG4gIG9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdDogW10sIC8vIOyXrOq2jCDtj4nrrLgg6rKw6rO8IOy2nOugpSDtgqQg66qp66GdXG4gIGVuY3J5cHRlZE9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdDogW10sIC8vIOyXrOq2jCDslZTtmLjtmZQg6rKw6rO8IOy2nOugpSDtgqQg66qp66GdXG4gIG9jclJlc3VsdEFsaWVuS2V5bGlzdDogW10sIC8vIOyZuOq1reyduOuTseuhneymnSDtj4nrrLgg6rKw6rO8IOy2nOugpSDtgqQg66qp66GdXG4gIGVuY3J5cHRlZE9jclJlc3VsdEFsaWVuS2V5bGlzdDogW10sIC8vIOyZuOq1reyduOuTseuhneymnSDslZTtmLjtmZQg6rKw6rO8IOy2nOugpSDtgqQg66qp66GdXG5cbiAgLy8gVUkg7ISk7KCVXG4gIHVzZVRvcFVJOiB0cnVlLCAvLyDsg4Hri6ggVUlcbiAgdXNlVG9wVUlUZXh0TXNnOiBmYWxzZSwgLy/sg4Hri6ggVUkgPiBURVhUXG4gIHVzZU1pZGRsZVVJOiB0cnVlLCAvL+ykkeuLqCBVSVxuICB1c2VNaWRkbGVVSVRleHRNc2c6IHRydWUsIC8vIOykkeuLqCBVSSA+IFRFWFRcbiAgdXNlQm90dG9tVUk6IHRydWUsIC8vIO2VmOuLqCBVSVxuICB1c2VCb3R0b21VSVRleHRNc2c6IGZhbHNlLCAvLyDtlZjri6ggVUkgPiBURVhUXG4gIHVzZVByZXZpZXdVSTogdHJ1ZSwgLy8gUHJldmlldyBVSVxuICB1c2VDYXB0dXJlVUk6IHRydWUsIC8vIOy6oeyymOuyhO2KvCBVSVxuICBwcmVsb2FkaW5nVUlUZXh0TXNnOiAn7Iug67aE7Kad7J247KadIOuqqOuTiOydhCDrtojrn6zsmKTripQg7KSRIOyeheuLiOuLpDxiciAvPuyeoOyLnOunjCDquLDri6TroKTso7zshLjsmpQnLFxuXG4gIC8vIOyduOyLnSDtlITroIjsnoQg7Ji17IWYXG4gIGZyYW1lQm9yZGVyU3R5bGU6IHtcbiAgICB3aWR0aDogNSwgLy8gYm9yZGVyLXdpZHRoXG4gICAgcmFkaXVzOiAyMCwgLy8gYm9yZGVyLXJhZGl1c1xuICAgIHN0eWxlOiAnc29saWQnLCAvLyBib3JkZXItc3R5bGVcblxuICAgIC8vIOuLqOqzhOuzhCDsnbjsi50g7ZSE66CI7J6EIGJvcmRlciDsg4nsg4FcbiAgICBub3RfcmVhZHk6ICcjMDAwMDAwJywgLy8g7Iqk7LqU7KSA67mEIDog6rKA7KCVXG4gICAgcmVhZHk6ICcjYjhiOGI4JywgLy8g7Iqk7LqU64yA6riwIDog7ZqM7IOJXG4gICAgZGV0ZWN0X3N1Y2Nlc3M6ICcjNWU4ZmZmJywgLy8g7Lm065Oc6rKA7LacIOyEseqztSA6IO2VmOuKmFxuICAgIGRldGVjdF9mYWlsZWQ6ICcjNzI1YjY3JywgLy8g7Lm065Oc6rKA7LacIOyLpO2MqCA6IOuztOudvFxuICAgIG1hbnVhbF9jYXB0dXJlX3N1Y2Nlc3M6ICcjNWU4ZmZmJywgLy8g7IiY64+Z7LSs7JiBIOyEseqztSA6IO2VmOuKmFxuICAgIG1hbnVhbF9jYXB0dXJlX2ZhaWxlZDogJyM3MjViNjcnLCAvLyDsiJjrj5nstKzsmIEg7Iuk7YyoIDog67O06528XG4gICAgcmVjb2duaXplZDogJyMwMDNhYzInLCAvLyBPQ1LsmYTro4wgOiDtjIzrnpFcbiAgICByZWNvZ25pemVkX3dpdGhfc3NhOiAnIzAwM2FjMicsIC8vIOyCrOuzuO2MkOuzhOykkSjsgqzrs7jtjJDrs4QgT04pIDog7YyM656RXG4gICAgb2NyX3N1Y2Nlc3M6ICcjMTRiMDBlJywgLy8gT0NS7JmE66OMIDog7LSI66GdXG4gICAgb2NyX3N1Y2Nlc3Nfd2l0aF9zc2E6ICcjMTRiMDBlJywgLy8gT0NS7JmE66OMKOyCrOuzuO2MkOuzhCBPTikgOiDstIjroZ1cbiAgICBvY3JfZmFpbGVkOiAnI0ZBMTEzRCcsIC8vIE9DUuyLpO2MqCA6IOu5qOqwlVxuICB9LFxuXG4gIC8vIOuniOyKpO2BrCDtlITroIjsnoQgZmlsbCDsu6zrn6wg67OA6rK9IOyCrOyaqSDsl6zrtoBcbiAgdXNlTWFza0ZyYW1lQ29sb3JDaGFuZ2U6IHRydWUsXG4gIC8vIOuniOyKpO2BrCDtlITroIjsnoQg7Ji17IWYICjsubTrqZTrnbwg67mE65SU7JikIOyYgeyXreyXkOyEnCDsnbjsi50g7ZSE66CI7J6E66eMIOuztOydtOqyjCDtlZjqs6Ag64KY66i47KeA66W8IOuNruyWtOyTsOuKlCDtlITroIjsnoQg7JiB7JetKVxuICBtYXNrRnJhbWVTdHlsZToge1xuICAgIGNsaXBfZnJhbWU6ICcjZmYwMGJmJywgLy8gY2xpcC1mcmFtZSDsg4nsg4EgOiDrlKXtjbztlIwgKOyImOygleu2iOqwgClcbiAgICBiYXNlX2NvbG9yOiAnIzMzMzMzMycsIC8vIG1hc2stZnJhbWUg7IOJ7IOBIDog64uk7YGs6re466CI7J20ICjtiKzrqoXrj4TripQg7IiY7KCV67aI6rCAIGZm66GcIOqzoOyglSlcblxuICAgIC8vIOuLqOqzhOuzhCDrp4jsiqTtgawg7ZSE66CI7J6EIGZpbGwg7IOJ7IOBXG4gICAgbm90X3JlYWR5OiAnIzMzMzMzMycsIC8vIOyKpOy6lOykgOu5hFxuICAgIHJlYWR5OiAnIzMzMzMzMycsIC8vIOyKpOy6lOuMgOq4sFxuICAgIGRldGVjdF9zdWNjZXNzOiAnIzIyMjIyMicsIC8vIOy5tOuTnOqygOy2nCDshLHqs7VcbiAgICBkZXRlY3RfZmFpbGVkOiAnIzMzMzMzMycsIC8vIOy5tOuTnOqygOy2nCDsi6TtjKhcbiAgICBtYW51YWxfY2FwdHVyZV9zdWNjZXNzOiAnIzIyMjIyMicsIC8vIOyImOuPmey0rOyYgSDshLHqs7VcbiAgICBtYW51YWxfY2FwdHVyZV9mYWlsZWQ6ICcjMzMzMzMzJywgLy8g7IiY64+Z7LSs7JiBIOyLpO2MqFxuICAgIHJlY29nbml6ZWQ6ICcjMjIyMjIyJywgLy8gT0NS7JmE66OMXG4gICAgcmVjb2duaXplZF93aXRoX3NzYTogJyMyMjIyMjInLCAvLyDsgqzrs7jtjJDrs4TspJEo7IKs67O47YyQ67OEIE9OKVxuICAgIG9jcl9zdWNjZXNzOiAnIzExMTExMScsIC8vT0NS7JmE66OMXG4gICAgb2NyX3N1Y2Nlc3Nfd2l0aF9zc2E6ICcjMTExMTExJywgLy8gT0NS7JmE66OMKOyCrOuzuO2MkOuzhCBPTilcbiAgICBvY3JfZmFpbGVkOiAnIzExMTExMScsIC8vIE9DUuyLpO2MqFxuICB9LFxuXG4gIC8vIOy0rOyYgeyYteyFmFxuICB1c2VBdXRvU3dpdGNoVG9TZXJ2ZXJNb2RlOiBmYWxzZSwgLy8g7KCA7IKs7JaRIOuLqOunkOyXkOyEnCDshJzrsoRPQ1LroZwg7J6Q64+ZIOyghO2ZmCDquLDriqVcbiAgdXNlTWFudWFsU3dpdGNoVG9TZXJ2ZXJNb2RlOiBmYWxzZSwgLy8g7IiY64+Z7Jy866GcIOyEnOuyhE9DUiDsoITtmZgg6riw64qlICjsiJjrj5nsnbQgdHJ1ZeydtOuptCDsnpDrj5nsnYAg66y07Iuc65CoKVxuICBzd2l0Y2hUb1NlcnZlclRocmVzaG9sZDogMjAsIC8vIOyekOuPmeyghO2ZmCDquLDspIDqsJIgKOyEseuKpSDsuKHsoJXsuZggbXMpXG4gIHVzZUZvcmNlQ29tcGxldGVVSTogZmFsc2UsIC8vIFdBU00g66qo65Oc7J2865WMIOuyhO2KvCDriITrpbzsi5wg7ZW064u5IOyLnOygkOyXkCDqsJXsoJzroZwg7JmE66OMIOyCrOyaqeyXrOu2gFxuXG4gIC8vIOyImOuPmey0rOyYgSDrsoTtirwg7Ji17IWYXG4gIGNhcHR1cmVCdXR0b25TdHlsZToge1xuICAgIHN0cm9rZV9jb2xvcjogJyNmZmZmZmYnLCAvLyDrsoTtirwg7YWM65GQ66asKHN0cm9rZSkg7IOJ7IOBXG4gICAgYmFzZV9jb2xvcjogJyM1ZThmZmYnLCAvLyDrsoTtirwg7IOJ7IOBXG4gIH0sXG4gIHJlc291cmNlQmFzZVVybDogd2luZG93LmxvY2F0aW9uLm9yaWdpbiwgLy8gd2FzbSwgZGF0YSDtjIzsnbwg66as7IaM7IqkIGJhc2Ug6rK966GcIChDRE4g7IKs7Jqp7IucIOuzgOqyvSlcbiAgZGV2aWNlTGFiZWw6ICcnLFxuICB2aWRlb1RhcmdldElkOiAnJyxcblxuICAvLyDsubTrqZTrnbwg7ISk7KCVXG4gIHJvdGF0aW9uRGVncmVlOiAwLCAvLyByb3RhdGlvbi1kZWdyZWUg7Lm066mU65286rCAIO2ajOyghOuQnCDqsIHrj4QgKDkwLCAxOTAsIDI3MClcbiAgbWlycm9yTW9kZTogZmFsc2UsIC8vIG1pcnJvci1tb2RlIOyFgO2UvCDsubTrqZTrnbwo7YKk7Jik7Iqk7YGsIOuTsSkg7IKs7Jqp7IucIOyijOyasCDrsJjsoIRcbiAgY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlJbnRlcnZhbDogMTAwMCwgLy8g7Lm066mU6528IOumrOyGjOyKpCDsnqzsmpTssq0g6rCE6rKpKG1zKVxuICBjYW1lcmFSZXNvdXJjZVJlcXVlc3RSZXRyeUxpbWl0OiAtMSwgLy8g7Lm066mU6528IOumrOyGjOyKpCDsnqzsmpTssq0g7LWc64yAIO2an+yImCwgLTHsnbTrqbQg66y07ZWcIOyerOyalOyyrS5cblxuICAvLyDsubTrqZTrnbwg7ZW07IOB64+EIOyEpOyglSAgOiAnY29tcGF0aWJpbGl0eScgKO2YuO2ZmOyEsSDsmrDshKApIHx8ICdoaWdoUXVhbGl0eScgKOqzoO2ZlOyniCDsmrDshKApXG4gIC8vIGNhbWVyYVJlc29sdXRpb25Dcml0ZXJpYTogJ2NvbXBhdGliaWxpdHknLCAvLyDtmLjtmZjshLEg7Jqw7ISgKOq2jOyepSwg65SU7Y+07Yq4KSA6IDcyMOycvOuhnCDqs6DsoJUsIOyggOyCrOyWkSDri6jrp5DquLAg7Zi47ZmY7ISxIOyii+ydjFxuICBjYW1lcmFSZXNvbHV0aW9uQ3JpdGVyaWE6ICdoaWdoUXVhbGl0eScsIC8vIOqzoO2ZlOyniCDsmrDshKAgOiAxMDgw7J20IOqwgOuKpe2VmOuptCAxMDgwIOu2iOqwgOuKpe2VmOuptCA3MjBcblxuICAvLyDqsIDsnbTrk5wg67CV7IqkIOyEpOyglSA6ICdjYW1lcmFSZXNvbHV0aW9uJyAo7Lm066mU6528IO2VtOyDgeuPhCkgfHwgJ29jclZpZXdTaXplJyAob2NyIGRpdiDtgazquLApXG4gIGNhbGNHdWlkZUJveENyaXRlcmlhOiAnY2FtZXJhUmVzb2x1dGlvbicsIC8vIOy5tOuplOudvCDtlbTsg4Hrj4Qg6riw7KSAKOq2jOyepSwg65SU7Y+07Yq4KSA6IDcyMHgxMjgwIO2VtOyDgeuPhCjshLjroZzrqqjrk5wpIOydvOuVjCBvY3IgdmlldyB3aWR0aCBzaXpl6rCAIDcyMOuztOuLpCDtgbAg6rK97JqwLCDqsIDsnbTrk5wg67CV7Iqk66W8IDcyMOyXkCDrp57stqQgKHByZXZpZXcg7ZmU66m0IOq5qOynkCDsl4bsnYwpXG4gIC8vIGNhbGNHdWlkZUJveENyaXRlcmlhOiAnb2NyVmlld1NpemUnLCAvLyDtmZTrqbQg7IKs7J207KaIIOq4sOykgCA6IDcyMHgxMjgwIO2VtOyDgeuPhCjshLjroZzrqqjrk5wpIOydvOuVjCBvY3IgdmlldyB3aWR0aCBzaXpl6rCAIDcyMOuztOuLpCDtgbDqsr3smrAsIOqwgOydtOuTnCDrsJXsiqTrpbwgb2NyIHZpZXcgd2lkdGgg7IKs7JeQ7KaI7JeQIOunnuy2pCAocHJldmlldyDtmZTrqbQg6rCV7KCc66GcIOuKmOumrOq4sCDrlYzrrLjsl5Ag64uk7IaMIOq5qOynkClcblxuICAvLyDsgqzrs7jtjJDrs4QgUkVUUlkg7ISk7KCVXG4gIC8vIHNzYVJldHJ5VHlwZVxuICAvLyAgIC0gUkVBTCAgICAgOiDrs7jsnbgoUkVBTCkg6rGw67aA7JyoIC0+IEZhbHNlIE5lZ2F0aXZlKOyLpOygnOqwkuydgCBSRUFM7J24642wIOyYiOy4oeqwkuydgCBGQUtF65287IScIO2LgOumsOqyveyasCnrpbwg64Ku7LaU6riwIOychO2VtCxcbiAgLy8gICAtIEZBS0UgICAgIDog7YOA7J24KEZBS0UpIOyImOudveycqCAtPiBGYWxzZSBQb3NpdGl2ZSjsi6TsoJzqsJLsnYAgRkFLReyduOuNsCDsmIjsuKHqsJLsnYAgUkVBTOydtOudvOyEnCDti4DrprDqsr3smrAp66W8IOuCruy2lOq4sCDsnITtlbRcbiAgLy8gICAtIEVOU0VNQkxFIDog7Y+J6regIOygiOuMgOqwkiAtPiBzc2FNYXhSZXRyeUNvdW50IOunjO2BvCDrsJjrs7Ug7IiY7ZaJ7ZWY6rOgIGZkX2NvbmZpZGVuY2Ug7KCI64yA6rCSIOqwkuydmCDtj4nqt6DsnLzroZwg7YyQ7KCVXG4gIC8vIHNzYU1heFJldHJ5Q291bnQg7ISk7KCVIOqwkuunjO2BvCDsnqzsi5zrj4TtlZjsl6wg7ZWc67KI7J20652864+EIOq4sOykgOqwkihSRUFMIOuYkOuKlCBGQUtFKeydtCDrnKjrqbQg6riw7KSA6rCSKFJFQUwg65iQ64qUIEZBS0Up66GcIO2MkOyglVxuICBzc2FSZXRyeVR5cGU6ICdFTlNFTUJMRScsXG4gIHNzYVJldHJ5UGl2b3Q6IDAuNSwgLy8gUkVBTC9GQUtF66W8IO2MkOygle2VmOuKlCBmZF9jb25maWRlbmNlIOq4sOykgOqwkiAod2FzbSDrsLDtj6wg67KE7KCE7JeQIOuUsOudvCDri6TrpoQpIOKAuyDsiJjsoJXrtojqsIBcbiAgc3NhTWF4UmV0cnlDb3VudDogMCwgLy8g7LWc64yAIFJFVFJZIO2ajOyImOyEpOyglSAw7J2066m0IOuvuOyCrOyaqVxuXG4gIC8vIHRoaXMuX19kZWJ1Zygp66W8IO2Gte2VtCDssI3snYAg66mU7Iuc7KeA66W8IGFsZXJ07Jy866GcIOudhOyauOyngCDsl6zrtoBcbiAgdXNlRGVidWdBbGVydDogZmFsc2UsXG5cbiAgLy8gV0FTTSDrpqzshozsiqQg6rCx7IugIOyXrOu2gFxuICBmb3JjZV93YXNtX3JlbG9hZDogZmFsc2UsXG4gIGZvcmNlX3dhc21fcmVsb2FkX2ZsYWc6ICcnLFxufSk7XG5cbmNsYXNzIFVzZUJPQ1Ige1xuICBJTl9QUk9HUkVTUyA9IHtcbiAgICBOT05FOiAnbm9uZScsXG4gICAgTk9UX1JFQURZOiAnbm90X3JlYWR5JyxcbiAgICBSRUFEWTogJ3JlYWR5JyxcbiAgICBDQVJEX0RFVEVDVF9TVUNDRVNTOiAnZGV0ZWN0X3N1Y2Nlc3MnLFxuICAgIENBUkRfREVURUNUX0ZBSUxFRDogJ2RldGVjdF9mYWlsZWQnLFxuICAgIE1BTlVBTF9DQVBUVVJFX1NVQ0NFU1M6ICdtYW51YWxfY2FwdHVyZV9zdWNjZXNzJyxcbiAgICBNQU5VQUxfQ0FQVFVSRV9GQUlMRUQ6ICdtYW51YWxfY2FwdHVyZV9mYWlsZWQnLFxuICAgIE9DUl9SRUNPR05JWkVEOiAncmVjb2duaXplZCcsXG4gICAgT0NSX1JFQ09HTklaRURfV0lUSF9TU0E6ICdyZWNvZ25pemVkX3dpdGhfc3NhJyxcbiAgICBPQ1JfU1VDQ0VTUzogJ29jcl9zdWNjZXNzJyxcbiAgICBPQ1JfU1VDQ0VTU19XSVRIX1NTQTogJ29jcl9zdWNjZXNzX3dpdGhfc3NhJyxcbiAgICBPQ1JfRkFJTEVEOiAnb2NyX2ZhaWxlZCcsXG4gIH07XG5cbiAgT0NSX1NUQVRVUyA9IHtcbiAgICBOT1RfUkVBRFk6IC0xLFxuICAgIFJFQURZOiAwLFxuICAgIE9DUl9TVUNDRVNTOiAxLFxuICAgIERPTkU6IDIsXG4gIH07XG5cbiAgUFJFTE9BRElOR19TVEFUVVMgPSB7XG4gICAgTk9UX1NUQVJURUQ6IC0xLFxuICAgIFNUQVJURUQ6IDAsXG4gICAgRE9ORTogMSxcbiAgfTtcblxuICBPQ1JfSU1HX01PREUgPSB7XG4gICAgV0FSUElORzogMCxcbiAgICBDUk9QUElORzogMSxcbiAgICBOT05FOiAyLFxuICB9O1xuXG4gIE9DUl9JTUdfTUFTS19NT0RFID0ge1xuICAgIEZBTFNFOiAwLFxuICAgIFRSVUU6IDEsXG4gIH07XG5cbiAgLyoqIHB1YmxpYyBwcm9wZXJ0aWVzICovXG5cbiAgLyoqIHByaXZhdGUgcHJvcGVydGllcyAqL1xuICBfX2RlYnVnTW9kZSA9IGZhbHNlO1xuICBfX09DUkVuZ2luZSA9IG51bGw7XG4gIF9faXNTdXBwb3J0V2FzbSA9IGZhbHNlO1xuICBfX2lzU3VwcG9ydFNpbWQgPSBmYWxzZTtcbiAgX19pbml0aWFsaXplZCA9IGZhbHNlO1xuICBfX3ByZWxvYWRlZCA9IGZhbHNlO1xuICBfX3ByZWxvYWRpbmdTdGF0dXMgPSB0aGlzLlBSRUxPQURJTkdfU1RBVFVTLk5PVF9TVEFSVEVEO1xuICBfX2xpY2Vuc2U7XG4gIF9fb2NyVHlwZTtcbiAgX19zc2FNb2RlID0gZmFsc2U7XG4gIF9fb2NyU3RhdHVzID0gdGhpcy5PQ1JfU1RBVFVTLk5PVF9SRUFEWTtcbiAgX19tYW51YWxPQ1JNYXhSZXRyeUNvdW50ID0gMTA7XG4gIF9fbWFudWFsT0NSUmV0cnlDb3VudCA9IDA7XG4gIF9fc3NhUmV0cnlDb3VudCA9IDA7XG4gIF9fZGV0ZWN0ZWRDYXJkUXVldWUgPSBbXTtcbiAgX19vblN1Y2Nlc3MgPSBudWxsO1xuICBfX29uRmFpbHVyZSA9IG51bGw7XG4gIF9fb25JblByb2dyZXNzQ2hhbmdlID0gbnVsbDtcbiAgX19vY3JUeXBlTGlzdCA9IFtcbiAgICAnaWRjYXJkJyxcbiAgICAnZHJpdmVyJyxcbiAgICAncGFzc3BvcnQnLFxuICAgICdmb3JlaWduLXBhc3Nwb3J0JyxcbiAgICAnYWxpZW4nLFxuICAgICdhbGllbi1iYWNrJyxcbiAgICAnY3JlZGl0JyxcbiAgICAnaWRjYXJkLXNzYScsXG4gICAgJ2RyaXZlci1zc2EnLFxuICAgICdwYXNzcG9ydC1zc2EnLFxuICAgICdmb3JlaWduLXBhc3Nwb3J0LXNzYScsXG4gICAgJ2FsaWVuLXNzYScsXG4gIF07XG4gIF9fb2NyVHlwZU51bWJlclRvU3RyaW5nID0gbmV3IE1hcChbXG4gICAgWycxJywgJ2lkY2FyZCddLFxuICAgIFsnMicsICdkcml2ZXInXSxcbiAgICBbJzMnLCAncGFzc3BvcnQnXSxcbiAgICBbJzQnLCAnZm9yZWlnbi1wYXNzcG9ydCddLFxuICAgIFsnNScsICdhbGllbiddLFxuICAgIFsnNS0xJywgJ2FsaWVuJ10sXG4gICAgWyc1LTInLCAnYWxpZW4nXSxcbiAgICBbJzUtMycsICdhbGllbiddLFxuICBdKTtcbiAgX19vY3JTdHJpbmdUb1R5cGVOdW1iZXIgPSBuZXcgTWFwKFtcbiAgICBbJ2lkY2FyZCcsICcxJ10sXG4gICAgWydkcml2ZXInLCAnMiddLFxuICAgIFsncGFzc3BvcnQnLCAnMyddLFxuICAgIFsnZm9yZWlnbi1wYXNzcG9ydCcsICc0J10sXG4gICAgWydhbGllbicsICc1J10sXG4gICAgWydhbGllbicsICc1LTEnXSxcbiAgICBbJ2FsaWVuJywgJzUtMiddLFxuICAgIFsnYWxpZW4nLCAnNS0zJ10sXG4gIF0pO1xuICBfX29jclJlc3VsdElkY2FyZEtleVNldCA9IG5ldyBTZXQoW1xuICAgICdyZXN1bHRfc2Nhbl90eXBlJyxcbiAgICAnbmFtZScsXG4gICAgJ2p1bWluJyxcbiAgICAnaXNzdWVkX2RhdGUnLFxuICAgICdyZWdpb24nLFxuICAgICdvdmVyc2Vhc19yZXNpZGVudCcsXG4gICAgJ2RyaXZlcl9udW1iZXInLFxuICAgICdkcml2ZXJfc2VyaWFsJyxcbiAgICAnZHJpdmVyX3R5cGUnLFxuICAgICdhcHRpdHVkZV90ZXN0X2RhdGVfc3RhcnQnLFxuICAgICdhcHRpdHVkZV90ZXN0X2RhdGVfZW5kJyxcbiAgICAvLyAnaXNfb2xkX2Zvcm1hdF9kcml2ZXJfbnVtYmVyJyxcbiAgICAvLyAnYmlydGgnLFxuXG4gICAgJ2NvbG9yX3BvaW50JyxcbiAgICAnZm91bmRfZmFjZScsXG4gICAgJ2ZvdW5kX2V5ZScsXG4gICAgJ3NwZWN1bGFyX3JhdGlvJyxcbiAgICAnc3RhcnRfdGltZScsXG4gICAgJ2VuZF90aW1lJyxcblxuICAgICdvY3Jfb3JpZ2luX2ltYWdlJyxcbiAgICAnb2NyX21hc2tpbmdfaW1hZ2UnLFxuICAgICdvY3JfZmFjZV9pbWFnZScsXG4gIF0pO1xuICBfX29jclJlc3VsdFBhc3Nwb3J0S2V5U2V0ID0gbmV3IFNldChbXG4gICAgJ3Jlc3VsdF9zY2FuX3R5cGUnLFxuICAgICduYW1lJyxcbiAgICAnc3VyX25hbWUnLFxuICAgICdnaXZlbl9uYW1lJyxcbiAgICAncGFzc3BvcnRfdHlwZScsXG4gICAgJ2lzc3VpbmdfY291bnRyeScsXG4gICAgJ3Bhc3Nwb3J0X251bWJlcicsXG4gICAgJ25hdGlvbmFsaXR5JyxcbiAgICAnaXNzdWVkX2RhdGUnLFxuICAgICdzZXgnLFxuICAgICdleHBpcnlfZGF0ZScsXG4gICAgJ3BlcnNvbmFsX251bWJlcicsXG4gICAgJ2p1bWluJyxcbiAgICAnYmlydGhkYXknLFxuICAgICduYW1lX2tvcicsXG4gICAgJ21yejEnLFxuICAgICdtcnoyJyxcblxuICAgICdjb2xvcl9wb2ludCcsXG4gICAgJ2ZvdW5kX2ZhY2UnLFxuICAgICdmb3VuZF9leWUnLFxuICAgICdzcGVjdWxhcl9yYXRpbycsXG4gICAgJ3N0YXJ0X3RpbWUnLFxuICAgICdlbmRfdGltZScsXG5cbiAgICAnb2NyX29yaWdpbl9pbWFnZScsXG4gICAgJ29jcl9tYXNraW5nX2ltYWdlJyxcbiAgICAnb2NyX2ZhY2VfaW1hZ2UnLFxuICBdKTtcbiAgX19vY3JSZXN1bHRBbGllbktleVNldCA9IG5ldyBTZXQoW1xuICAgICdyZXN1bHRfc2Nhbl90eXBlJyxcbiAgICAnbmFtZScsXG4gICAgJ2p1bWluJyxcbiAgICAnaXNzdWVkX2RhdGUnLFxuICAgICduYXRpb25hbGl0eScsXG4gICAgJ3Zpc2FfdHlwZScsXG4gICAgJ25hbWVfa29yJyxcblxuICAgICdjb2xvcl9wb2ludCcsXG4gICAgJ2ZvdW5kX2ZhY2UnLFxuICAgICdmb3VuZF9leWUnLFxuICAgICdzcGVjdWxhcl9yYXRpbycsXG4gICAgJ3N0YXJ0X3RpbWUnLFxuICAgICdlbmRfdGltZScsXG5cbiAgICAnb2NyX29yaWdpbl9pbWFnZScsXG4gICAgJ29jcl9tYXNraW5nX2ltYWdlJyxcbiAgICAnb2NyX2ZhY2VfaW1hZ2UnLFxuICBdKTtcbiAgX19vY3JSZXN1bHRUcnV0aEtleVNldCA9IG5ldyBTZXQoWyd0cnV0aCcsICdjb25mJ10pO1xuICBfX3BhZ2VFbmQgPSBmYWxzZTtcbiAgX19vY3I7XG4gIF9fY2FudmFzO1xuICBfX3JvdGF0aW9uQ2FudmFzO1xuICBfX3ZpZGVvO1xuICBfX3ZpZGVvV3JhcDtcbiAgX19ndWlkZUJveDtcbiAgX19ndWlkZUJveFdyYXA7XG4gIF9fbWFza0JveFdyYXA7XG4gIF9fcHJldmVudFRvRnJlZXplVmlkZW87XG4gIF9fY3VzdG9tVUlXcmFwO1xuICBfX3RvcFVJO1xuICBfX21pZGRsZVVJO1xuICBfX2JvdHRvbVVJO1xuICBfX3ByZXZpZXdVSVdyYXA7XG4gIF9fcHJldmlld1VJO1xuICBfX3ByZXZpZXdJbWFnZTtcbiAgX19jYXB0dXJlVUlXcmFwO1xuICBfX2NhcHR1cmVVSTtcbiAgX19zd2l0Y2hVSVdyYXA7XG4gIF9fc3dpdGNoVUk7XG4gIF9fY2FwdHVyZUJ1dHRvbjtcbiAgX19hZGRyZXNzID0gMDtcbiAgX19kZXRlY3RlZCA9IGZhbHNlO1xuICBfX3JlY292ZXJlZCA9IGZhbHNlO1xuICBfX0J1ZmZlciA9IG51bGw7XG4gIF9fcmVzdWx0QnVmZmVyID0gbnVsbDtcbiAgX19tYXNrSW5mb1Jlc3VsdEJ1ZiA9IG51bGw7XG4gIF9fUHJldkltYWdlID0gbnVsbDtcbiAgX19zdHJpbmdPbldhc21IZWFwID0gbnVsbDtcbiAgX19jYW1TZXRDb21wbGV0ZSA9IGZhbHNlO1xuICBfX3Jlc29sdXRpb25XaWR0aCA9IDA7XG4gIF9fcmVzb2x1dGlvbkhlaWdodCA9IDA7XG4gIF9fdmlkZW9XaWR0aCA9IDA7XG4gIF9fdmlkZW9IZWlnaHQgPSAwO1xuICBfX3Jlc291cmNlc0xvYWRlZCA9IGZhbHNlO1xuICBfX2ludGVydmFsVGltZXI7XG4gIF9fY2FtZXJhUGVybWlzc2lvblRpbWVvdXRUaW1lcjtcbiAgX19jYW1lcmFSZXNvdXJjZVJldHJ5Q291bnQgPSAwO1xuICBfX3JlcXVlc3RBbmltYXRpb25GcmFtZUlkO1xuICBfX3N0cmVhbTtcbiAgX19kZXN0cm95U2Nhbm5lckNhbGxiYWNrID0gbnVsbDtcbiAgX19mYWNpbmdNb2RlQ29uc3RyYWludCA9ICdlbnZpcm9ubWVudCc7XG4gIF9fdWlPcmllbnRhdGlvbiA9ICcnO1xuICBfX3ByZXZVaU9yaWVudGF0aW9uID0gJyc7XG4gIF9fdmlkZW9PcmllbnRhdGlvbiA9ICcnO1xuICBfX3Rocm90dGxpbmdSZXNpemVUaW1lciA9IG51bGw7XG4gIF9fdGhyb3R0bGluZ1Jlc2l6ZURlbGF5ID0gNTAwO1xuICBfX21heFJldHJ5Q291bnRHZXRBZGRyZXNzID0gMzAwOyAvLyDsnoTsi5xcbiAgX19yZXRyeUNvdW50R2V0QWRkcmVzcyA9IDA7IC8vIOyehOyLnFxuICBfX2RldmljZUluZm87XG4gIF9faXNSb3RhdGVkOTBvcjI3MCA9IGZhbHNlO1xuICBfX2luUHJvZ3Jlc3NTdGVwID0gdGhpcy5JTl9QUk9HUkVTUy5OT1RfUkVBRFk7XG4gIF9fcHJldmlvdXNJblByb2dyZXNzU3RlcCA9IHRoaXMuSU5fUFJPR1JFU1MuTk9ORTtcbiAgX19pc0luUHJvZ3Jlc3NIYW5kbGVSZXNpemUgPSBmYWxzZTtcbiAgX19ndWlkZUJveFJhdGlvQnlXaWR0aCA9IDEuMDsgLy8g7IiY7KCV67aI6rCAXG4gIF9fdmlkZW9SYXRpb0J5SGVpZ2h0ID0gMC45OyAvLyDsiJjsoJXrtojqsIBcbiAgX19ndWlkZUJveFJlZHVjZVJhdGlvID0gMC44OyAvLyDsiJjsoJXrtojqsIBcbiAgX19jcm9wSW1hZ2VTaXplV2lkdGggPSAwO1xuICBfX2Nyb3BJbWFnZVNpemVIZWlnaHQgPSAwO1xuICBfX2lzU3dpdGNoVG9TZXJ2ZXJNb2RlID0gZmFsc2U7XG5cbiAgLyoqIERlZmF1bHQgb3B0aW9ucyAqL1xuICBfX29wdGlvbnMgPSB7IC4uLk9QVElPTl9URU1QTEFURSB9O1xuXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoaW5zdGFuY2UpIHJldHVybiBpbnN0YW5jZTtcbiAgICBpbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgLyoqIHB1YmxpYyBtZXRob2RzICovXG4gIGFzeW5jIHByZWxvYWRpbmcob25QcmVsb2FkZWQpIHtcbiAgICBpZiAodGhpcy5pc1ByZWxvYWRlZCgpKSB7XG4gICAgICBjb25zb2xlLmxvZygnISEhIFBSRUxPQURJTkcgU0tJUCwgQUxSRUFEWSBQUkVMT0FERUQgISEhJyk7XG4gICAgICBpZiAob25QcmVsb2FkZWQpIG9uUHJlbG9hZGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCchISEgUFJFTE9BRElORyBTVEFSVCAhISEnKTtcbiAgICAgIHRoaXMuc2hvd09DUkxvYWRpbmdVSSgpO1xuICAgICAgdGhpcy5fX3ByZWxvYWRpbmdTdGF0dXMgPSB0aGlzLlBSRUxPQURJTkdfU1RBVFVTLlNUQVJURUQ7XG4gICAgICBhd2FpdCB0aGlzLl9fbG9hZFJlc291cmNlcygpO1xuICAgICAgdGhpcy5fX3ByZWxvYWRpbmdTdGF0dXMgPSB0aGlzLlBSRUxPQURJTkdfU1RBVFVTLkRPTkU7XG4gICAgICB0aGlzLl9fcHJlbG9hZGVkID0gdHJ1ZTtcbiAgICAgIGlmIChvblByZWxvYWRlZCkgb25QcmVsb2FkZWQoKTtcbiAgICAgIHRoaXMuaGlkZU9DUkxvYWRpbmdVSSgpO1xuICAgICAgY29uc29sZS5sb2coJyEhISBQUkVMT0FESU5HIEVORCAhISEnKTtcbiAgICB9XG4gIH1cblxuICBpc0luaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLl9faW5pdGlhbGl6ZWQ7XG4gIH1cblxuICBpc1ByZWxvYWRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3ByZWxvYWRlZDtcbiAgfVxuXG4gIGdldFByZWxvYWRpbmdTdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19wcmVsb2FkaW5nU3RhdHVzO1xuICB9XG5cbiAgaXNFbmNyeXB0TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdE1vZGUgfHwgdGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdFZhbHVlTW9kZSB8fCB0aGlzLl9fb3B0aW9ucy51c2VFbmNyeXB0T3ZlcmFsbE1vZGU7XG4gIH1cblxuICBpc0NyZWRpdENhcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19vY3JUeXBlID09PSAnY3JlZGl0JztcbiAgfVxuXG4gIHNob3dPQ1JMb2FkaW5nVUkoKSB7XG4gICAgY29uc3QgeyBwcmVsb2FkaW5nVUlXcmFwIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuICAgIGlmIChwcmVsb2FkaW5nVUlXcmFwKSB7XG4gICAgICBwcmVsb2FkaW5nVUlXcmFwLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgfVxuICB9XG4gIGhpZGVPQ1JMb2FkaW5nVUkoKSB7XG4gICAgY29uc3QgeyBwcmVsb2FkaW5nVUlXcmFwIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuICAgIGlmIChwcmVsb2FkaW5nVUlXcmFwKSB7XG4gICAgICBwcmVsb2FkaW5nVUlXcmFwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICB9XG5cbiAgLy8g66+47IKs7JqpIDogd2FzbSDroIjrsqjsl5DshJwg7JWU7Zi47ZmU7ZWY7JesIOu2iO2VhOyalCDtlbTsp5BcbiAgLy8gZW5jcnlwdFJlc3VsdChyZXZpZXdfcmVzdWx0KSB7XG4gIC8vICAgaWYgKHRoaXMuaXNDcmVkaXRDYXJkKCkpIHtcbiAgLy8gICAgIHJldHVybjtcbiAgLy8gICB9XG4gIC8vXG4gIC8vICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpICYmIHRoaXMuX19pc1N1cHBvcnRXYXNtKSB7XG4gIC8vICAgICAvLyBwcmV0dGllci1pZ25vcmVcbiAgLy8gICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VFbmNyeXB0TW9kZUpTTGV2ZWwpIHtcbiAgLy8gICAgICAgY29uc3QgaW5jbHVkZUxpc3QgPSBbJ2p1bWluJywgJ2RyaXZlcl9udW1iZXInLCAncGFzc3BvcnRfbnVtYmVyJywgJ3BlcnNvbmFsX251bWJlcicsICdtcnoyJ107XG4gIC8vICAgICAgIGNvbnN0IGVuY3J5cHRlZCA9IHtcbiAgLy8gICAgICAgICBvY3JfcmVzdWx0OiBfLnRvUGFpcnMoXy5waWNrKHJldmlld19yZXN1bHQub2NyX3Jlc3VsdCwgaW5jbHVkZUxpc3QpKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gIC8vICAgICAgICAgICBhY2Nba2V5XSA9IHRoaXMuX19lbmNyeXB0U2NhblJlc3VsdCh2YWx1ZSk7XG4gIC8vICAgICAgICAgICByZXR1cm4gYWNjO1xuICAvLyAgICAgICAgIH0sIHt9KSxcbiAgLy8gICAgICAgICBvY3Jfb3JpZ2luX2ltYWdlOiB0aGlzLl9fZW5jcnlwdFNjYW5SZXN1bHQocmV2aWV3X3Jlc3VsdC5vY3Jfb3JpZ2luX2ltYWdlKSxcbiAgLy8gICAgICAgfTtcbiAgLy9cbiAgLy8gICAgICAgcmV2aWV3X3Jlc3VsdC5vY3JfcmVzdWx0ID0ge1xuICAvLyAgICAgICAgIC4uLnJldmlld19yZXN1bHQub2NyX3Jlc3VsdCxcbiAgLy8gICAgICAgICAuLi5lbmNyeXB0ZWQub2NyX3Jlc3VsdCxcbiAgLy8gICAgICAgfTtcbiAgLy8gICAgICAgcmV2aWV3X3Jlc3VsdC5vY3Jfb3JpZ2luX2ltYWdlID0gZW5jcnlwdGVkLm9jcl9vcmlnaW5faW1hZ2U7XG4gIC8vICAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLnVzZUVuY3J5cHRBbGxNb2RlKSB7XG4gIC8vICAgICAgIGNvbnN0IGV4Y2x1ZGVMaXN0ID0gW1xuICAvLyAgICAgICAgICdjb21wbGV0ZScsXG4gIC8vICAgICAgICAgJ3Jlc3VsdF9zY2FuX3R5cGUnLFxuICAvLyAgICAgICAgICdjb2xvcl9wb2ludCcsXG4gIC8vICAgICAgICAgJ2ZvdW5kX2ZhY2UnLFxuICAvLyAgICAgICAgICdzcGVjdWxhcl9yYXRpbycsXG4gIC8vICAgICAgICAgJ3N0YXJ0X3RpbWUnLFxuICAvLyAgICAgICAgICdlbmRfdGltZScsXG4gIC8vICAgICAgICAgJ2ZkX2NvbmZpZGVuY2UnLFxuICAvLyAgICAgICAgICdpZF90cnV0aCcsXG4gIC8vICAgICAgICAgJ2lkX3RydXRoX3JldHJ5X2NvdW50JyxcbiAgLy8gICAgICAgXTtcbiAgLy8gICAgICAgY29uc3QgZW5jcnlwdGVkID0ge1xuICAvLyAgICAgICAgIG9jcl9yZXN1bHQ6IF8udG9QYWlycyhfLm9taXQocmV2aWV3X3Jlc3VsdC5vY3JfcmVzdWx0LCBleGNsdWRlTGlzdCkpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgLy8gICAgICAgICAgIGFjY1trZXldID0gdGhpcy5fX2VuY3J5cHRTY2FuUmVzdWx0KHZhbHVlKTtcbiAgLy8gICAgICAgICAgIHJldHVybiBhY2M7XG4gIC8vICAgICAgICAgfSwge30pLFxuICAvLyAgICAgICAgIG9jcl9vcmlnaW5faW1hZ2U6IHRoaXMuX19lbmNyeXB0U2NhblJlc3VsdChyZXZpZXdfcmVzdWx0Lm9jcl9vcmlnaW5faW1hZ2UpLFxuICAvLyAgICAgICAgIG9jcl9tYXNraW5nX2ltYWdlOiB0aGlzLl9fZW5jcnlwdFNjYW5SZXN1bHQocmV2aWV3X3Jlc3VsdC5vY3JfbWFza2luZ19pbWFnZSksXG4gIC8vICAgICAgICAgb2NyX2ZhY2VfaW1hZ2U6IHRoaXMuX19lbmNyeXB0U2NhblJlc3VsdChyZXZpZXdfcmVzdWx0Lm9jcl9mYWNlX2ltYWdlKSxcbiAgLy8gICAgICAgfTtcbiAgLy8gICAgICAgcmV2aWV3X3Jlc3VsdC5lbmNyeXB0ZWQgPSBlbmNyeXB0ZWQ7XG4gIC8vICAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLnVzZUVuY3J5cHRPdmVyYWxsTW9kZSkge1xuICAvLyAgICAgICBjb25zdCBleGNsdWRlT2NyUmVzdWx0ID0gdGhpcy5fX29wdGlvbnMuZW5jcnlwdGVkT2NyUmVzdWx0SWRjYXJkS2V5bGlzdC5pbmNsdWRlcygnYWxsJykgPyB7fSA6IF8ub21pdChyZXZpZXdfcmVzdWx0Lm9jcl9yZXN1bHQsIHRoaXMuX19vcHRpb25zLmVuY3J5cHRlZE9jclJlc3VsdElkY2FyZEtleWxpc3QpO1xuICAvLyAgICAgICBjb25zdCBleGNsdWRlT2NySW1hZ2UgPSB0aGlzLl9fb3B0aW9ucy5lbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QuaW5jbHVkZXMoJ2FsbCcpID8gXy5vbWl0KHJldmlld19yZXN1bHQsIFsuLi50aGlzLl9fb2NyUmVzdWx0UGFzc3BvcnRLZXlTZXRdKSA6IF8ub21pdChyZXZpZXdfcmVzdWx0LCB0aGlzLl9fb3B0aW9ucy5lbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QpO1xuICAvLyAgICAgICBjb25zdCBlbmNyeXB0ZWQgPSB7IG9jcl9yZXN1bHQ6IGV4Y2x1ZGVPY3JSZXN1bHQsIC4uLmV4Y2x1ZGVPY3JJbWFnZSB9O1xuICAvL1xuICAvLyAgICAgICByZXZpZXdfcmVzdWx0LnRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gIC8vICAgICAgIHJldmlld19yZXN1bHQuZW5jcnlwdGVkX292ZXJhbGwgPSB0aGlzLl9fZW5jcnlwdFNjYW5SZXN1bHQoSlNPTi5zdHJpbmdpZnkoZW5jcnlwdGVkKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgZXhjbHVkZU9jclJlc3VsdChvY3JfcmVzdWx0LCBleGNsdWRlS2V5bGlzdCkge1xuICAgIHJldHVybiBfLm9taXQob2NyX3Jlc3VsdCwgZXhjbHVkZUtleWxpc3QpO1xuICB9XG4gIGV4Y2x1ZGVPY3JJbWFnZShyZXZpZXdfcmVzdWx0LCBleGNsdWRlS2V5bGlzdCkge1xuICAgIHJldHVybiBfLm9taXQocmV2aWV3X3Jlc3VsdCwgZXhjbHVkZUtleWxpc3QpO1xuICB9XG5cbiAgZ2V0T0NSRW5naW5lKCkge1xuICAgIHJldHVybiB0aGlzLl9fT0NSRW5naW5lO1xuICB9XG5cbiAgaW5pdChzZXR0aW5ncykge1xuICAgIGlmICghISFzZXR0aW5ncy5saWNlbnNlS2V5KSB0aHJvdyBuZXcgRXJyb3IoJ0xpY2Vuc2Uga2V5IGlzIGVtcHR5Jyk7XG5cbiAgICB0aGlzLl9fbGljZW5zZSA9IHNldHRpbmdzLmxpY2Vuc2VLZXk7XG5cbiAgICBpZiAoXG4gICAgICAhIXNldHRpbmdzLm9jclJlc3VsdElkY2FyZEtleWxpc3QgfHxcbiAgICAgICEhc2V0dGluZ3MuZW5jcnlwdGVkT2NyUmVzdWx0SWRjYXJkS2V5bGlzdCB8fFxuICAgICAgISFzZXR0aW5ncy5vY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QgfHxcbiAgICAgICEhc2V0dGluZ3MuZW5jcnlwdGVkT2NyUmVzdWx0UGFzc3BvcnRLZXlsaXN0IHx8XG4gICAgICAhIXNldHRpbmdzLm9jclJlc3VsdEFsaWVuS2V5bGlzdCB8fFxuICAgICAgISFzZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRBbGllbktleWxpc3RcbiAgICApIHtcbiAgICAgIGNvbnN0IG9jclJlc3VsdEtleWxpc3RTdHJpbmdUb0l0ZXIgPSAoc3RyLCBrZXlJdGVyKSA9PlxuICAgICAgICBzdHJcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHMvZywgJycpXG4gICAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgICAuZmlsdGVyKChrKSA9PiBrZXlJdGVyLmhhcyhrKSk7XG4gICAgICBzZXR0aW5ncy5vY3JSZXN1bHRJZGNhcmRLZXlsaXN0ID0gb2NyUmVzdWx0S2V5bGlzdFN0cmluZ1RvSXRlcihzZXR0aW5ncy5vY3JSZXN1bHRJZGNhcmRLZXlsaXN0LCB0aGlzLl9fb2NyUmVzdWx0SWRjYXJkS2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBzZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0ID0gb2NyUmVzdWx0S2V5bGlzdFN0cmluZ1RvSXRlcihzZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0LCB0aGlzLl9fb2NyUmVzdWx0SWRjYXJkS2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBzZXR0aW5ncy5vY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QgPSBvY3JSZXN1bHRLZXlsaXN0U3RyaW5nVG9JdGVyKHNldHRpbmdzLm9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdCwgdGhpcy5fX29jclJlc3VsdFBhc3Nwb3J0S2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBzZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRQYXNzcG9ydEtleWxpc3QgPSBvY3JSZXN1bHRLZXlsaXN0U3RyaW5nVG9JdGVyKHNldHRpbmdzLmVuY3J5cHRlZE9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdCwgdGhpcy5fX29jclJlc3VsdFBhc3Nwb3J0S2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBzZXR0aW5ncy5vY3JSZXN1bHRBbGllbktleWxpc3QgPSBvY3JSZXN1bHRLZXlsaXN0U3RyaW5nVG9JdGVyKHNldHRpbmdzLm9jclJlc3VsdEFsaWVuS2V5bGlzdCwgdGhpcy5fX29jclJlc3VsdEFsaWVuS2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICBzZXR0aW5ncy5lbmNyeXB0ZWRPY3JSZXN1bHRBbGllbktleWxpc3QgPSBvY3JSZXN1bHRLZXlsaXN0U3RyaW5nVG9JdGVyKHNldHRpbmdzLmVuY3J5cHRlZE9jclJlc3VsdEFsaWVuS2V5bGlzdCwgdGhpcy5fX29jclJlc3VsdEFsaWVuS2V5U2V0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgfVxuXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IF8ubWVyZ2Uoe30sIHRoaXMuX19vcHRpb25zLCBzZXR0aW5ncyk7XG4gICAgdGhpcy5zZXRPcHRpb24obWVyZ2VkT3B0aW9ucyk7XG4gICAgY29uc29sZS5sb2codGhpcy5nZXRPcHRpb24oKSk7XG5cbiAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLl9fd2luZG93RXZlbnRCaW5kKCk7XG4gICAgICB0aGlzLl9fZGV2aWNlSW5mbyA9IGRldGVjdG9yLmdldE9zVmVyc2lvbigpO1xuICAgICAgY29uc29sZS5kZWJ1ZygndGhpcy5fX2RldmljZUluZm8ub3NTaW1wbGUgOjogJyArIHRoaXMuX19kZXZpY2VJbmZvLm9zU2ltcGxlKTtcblxuICAgICAgdGhpcy5fX2lzU3VwcG9ydFdhc20gPSBpc1N1cHBvcnRXYXNtKCk7XG4gICAgICBpZiAoIXRoaXMuX19pc1N1cHBvcnRXYXNtKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV2ViQXNzZW1ibHkgaXMgbm90IHN1cHBvcnRlZC4gaW4gdGhpcyBicm93c2VyLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHNldE9wdGlvbihzZXR0aW5ncykge1xuICAgIHRoaXMuX19vcHRpb25zID0gc2V0dGluZ3M7XG4gIH1cblxuICBnZXRPcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX19vcHRpb25zO1xuICB9XG5cbiAgZ2V0T2NyVHlwZSh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX19vY3JUeXBlTnVtYmVyVG9TdHJpbmcuZ2V0KHR5cGUpO1xuICB9XG5cbiAgZ2V0T2NyVHlwZU51bWJlcihzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5fX29jclN0cmluZ1RvVHlwZU51bWJlci5nZXQoc3RyaW5nKTtcbiAgfVxuXG4gIGdldFVJT3JpZW50YXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX191aU9yaWVudGF0aW9uO1xuICB9XG5cbiAgZ2V0VmlkZW9PcmllbnRhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZGVvT3JpZW50YXRpb247XG4gIH1cblxuICBhc3luYyBjaGVja1N3aXRjaFRvU2VydmVyTW9kZSgpIHtcbiAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlTWFudWFsU3dpdGNoVG9TZXJ2ZXJNb2RlKSB7XG4gICAgICAvLyDsiJjrj5nsoITtmZggb24g7J2066m0IOyImOuPmeyghO2ZmCDsmrDshKBcbiAgICAgIHJldHVybiB0aGlzLl9faXNTd2l0Y2hUb1NlcnZlck1vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOyImOuPmeyghO2ZmCBvZmYg7J2066m0IOyekOuPmeyghO2ZmCDssrTtgaxcbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VBdXRvU3dpdGNoVG9TZXJ2ZXJNb2RlKSB7XG4gICAgICAgIC8vIOyekOuPmeyghO2ZmCBvbuydvOuVjFxuICAgICAgICAvLyDshLHriqUg7Lih7KCV6rCS7J2EIOq4sOykgOycvOuhnCBXQVNNIG9yIFNlcnZlclxuICAgICAgICBjb25zdCBbbGF0ZW5jeVBlcjEwMG1zLCBtZWFzdXJlUmVwb3J0XSA9IGF3YWl0IG1lYXN1cmUoKTtcbiAgICAgICAgdGhpcy5fX2RlYnVnKG1lYXN1cmVSZXBvcnQpO1xuICAgICAgICByZXR1cm4gbGF0ZW5jeVBlcjEwMG1zID4gcGFyc2VGbG9hdCh0aGlzLl9fb3B0aW9ucy5zd2l0Y2hUb1NlcnZlclRocmVzaG9sZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDsiJjrj5nsoITtmZjrj4Qgb2ZmLCDsnpDrj5nsoITtmZggb2ZmXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydE9DUih0eXBlLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSwgb25JblByb2dyZXNzQ2hhbmdlID0gbnVsbCkge1xuICAgIGlmICghISF0eXBlIHx8ICEhIW9uU3VjY2VzcyB8fCAhISFvbkZhaWx1cmUpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2ludmFsaWQgcGFyYW1ldGVyLCBzbyBza2lwIHRvIHN0YXJ0T0NSKCknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9faXNTd2l0Y2hUb1NlcnZlck1vZGUgPSBhd2FpdCB0aGlzLmNoZWNrU3dpdGNoVG9TZXJ2ZXJNb2RlKCk7XG5cbiAgICB0aGlzLl9fb2NyVHlwZSA9IHR5cGU7XG4gICAgdGhpcy5fX3NzYU1vZGUgPSB0aGlzLl9fb2NyVHlwZS5pbmRleE9mKCctc3NhJykgPiAtMTtcbiAgICB0aGlzLl9fb25TdWNjZXNzID0gb25TdWNjZXNzO1xuICAgIHRoaXMuX19vbkZhaWx1cmUgPSBvbkZhaWx1cmU7XG4gICAgdGhpcy5fX29uSW5Qcm9ncmVzc0NoYW5nZSA9IG9uSW5Qcm9ncmVzc0NoYW5nZTtcbiAgICBpZiAob25JblByb2dyZXNzQ2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlVG9wVUkpIHtcbiAgICAgICAgdGhpcy5fX3RvcFVJID0gZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKS50b3BVSTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VNaWRkbGVVSSkge1xuICAgICAgICB0aGlzLl9fbWlkZGxlVUkgPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpLm1pZGRsZVVJO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZUJvdHRvbVVJKSB7XG4gICAgICAgIHRoaXMuX19ib3R0b21VSSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCkuYm90dG9tVUk7XG4gICAgICB9XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk5PVF9SRUFEWSk7XG5cbiAgICBpZiAoIXRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbml0aWFsaXplZCEnKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fX3ByZXByb2Nlc3MoKTtcbiAgICAgIGF3YWl0IHRoaXMuX19zZXR1cERvbUVsZW1lbnRzKCk7XG5cbiAgICAgIGlmICh0aGlzLl9faXNTd2l0Y2hUb1NlcnZlck1vZGUpIHtcbiAgICAgICAgLy8gc2VydmVyTW9kZVxuICAgICAgICAvLyBUT0RPIDog7ISc67KEIOuqqOuTnOydvOuVjCB3YXNtIOyVlO2YuO2ZlOulvCDtlZjrjZTrnbzrj4QgSlPsl5DshJwg7Y+J66y46rCS7J2EIOuwm+uKlOyInOqwhCDrqZTrqqjrpqzsl5Ag64Ko6riw65WM66y47J2YIOustOydmOuvuFxuICAgICAgICAvLyBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkgJiYgdGhpcy5fX2lzU3VwcG9ydFdhc20pIHtcbiAgICAgICAgLy8gICBhd2FpdCB0aGlzLl9fcHJlbG9hZGluZ1dhc20oKTsgLy8g7ISc67KE66qo65OcIOydtOyngOunjCDslZTtmLjtmZQg7ZWY6riw7JyE7ZW0IHdhc23snYQgcHJlbG9hZGluZyDtlahcbiAgICAgICAgLy8gfVxuICAgICAgICBhd2FpdCB0aGlzLl9fc3RhcnRTY2FuU2VydmVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB3YXNtTW9kZVxuICAgICAgICBhd2FpdCB0aGlzLl9fcHJlbG9hZGluZ1dhc20oKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fX3N0YXJ0U2Nhbldhc20oKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdlcnJvciBpbiBzdGFydE9DUigpIDogJyArIGUpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN0b3BPQ1IoKTtcbiAgICB9XG4gIH1cblxuICBzdG9wT0NSKCkge1xuICAgIHRoaXMuY2xlYW51cCgpO1xuICAgIHRoaXMuX19jbG9zZUNhbWVyYSgpO1xuICAgIHRoaXMuX19vblN1Y2Nlc3MgPSBudWxsO1xuICAgIHRoaXMuX19vbkZhaWx1cmUgPSBudWxsO1xuICB9XG5cbiAgc2V0SWdub3JlQ29tcGxldGUodmFsKSB7XG4gICAgdGhpcy5fX09DUkVuZ2luZS5zZXRJZ25vcmVDb21wbGV0ZSh2YWwpO1xuICB9XG5cbiAgLy8g66+47IKs7JqpIDogd2FzbSDroIjrsqjsl5DshJwg7JWU7Zi47ZmU7ZWY7JesIOu2iO2VhOyalCDtlbTsp5BcbiAgLy8gZW5jcnlwdChwbGFpblN0cikge1xuICAvLyAgIHJldHVybiB0aGlzLl9fZW5jcnlwdFNjYW5SZXN1bHQocGxhaW5TdHIpO1xuICAvLyB9XG5cbiAgYXN5bmMgcmVzdGFydE9DUihvY3JUeXBlLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSwgb25JblByb2dyZXNzQ2hhbmdlLCBpc1N3aXRjaE1vZGUgPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5fX2NhbVNldENvbXBsZXRlKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKGBDYW1lcmEgc2V0dGluZyBpcyBub3QgY29tcGxldGVkIHlldC4gc28sIHNraXAgXCJyZXN0YXJ0T0NSKClcImApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNTd2l0Y2hNb2RlKSB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3BPQ1IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX2Nsb3NlQ2FtZXJhKCk7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc3RhcnRPQ1Iob2NyVHlwZSwgb25TdWNjZXNzLCBvbkZhaWx1cmUsIG9uSW5Qcm9ncmVzc0NoYW5nZSk7XG4gIH1cblxuICAvKiogcHJpdmF0ZSBtZXRob2RzICovXG4gIGFzeW5jIF9fd2FpdFByZWxvYWRlZCgpIHtcbiAgICBsZXQgd2FpdGluZ1JldHJ5Q291bnQgPSAwO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgY2hlY2sgPSAoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzUHJlbG9hZGVkKCkpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2FpdGluZ1JldHJ5Q291bnQrKztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3YWl0aW5nIGZvciBwcmVsb2FkaW5nIFdBU00gT0NSIG1vZHVsZSA6ICcgKyB3YWl0aW5nUmV0cnlDb3VudCk7XG4gICAgICAgICAgICBjaGVjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwKTtcbiAgICAgIH07XG4gICAgICBjaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgX19wcmVwcm9jZXNzKCkge1xuICAgIGNvbnN0IGNvbnZlcnRUeXBlVG9JbnRlZ2VyID0gZnVuY3Rpb24gKG9wdGlvbiwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNOYU4ocGFyc2VJbnQob3B0aW9uKSkgPyBkZWZhdWx0VmFsdWUgOiBwYXJzZUludChvcHRpb24pO1xuICAgIH07XG5cbiAgICBjb25zdCBjb252ZXJ0VHlwZVRvRmxvYXQgPSBmdW5jdGlvbiAob3B0aW9uLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIHJldHVybiBpc05hTihwYXJzZUZsb2F0KG9wdGlvbikpID8gZGVmYXVsdFZhbHVlIDogcGFyc2VGbG9hdChvcHRpb24pO1xuICAgIH07XG5cbiAgICBjb25zdCBjb252ZXJ0VHlwZVRvQm9vbGVhbiA9IGZ1bmN0aW9uIChvcHRpb24sIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvcHRpb24gPT09ICd0cnVlJyA/IHRydWUgOiBkZWZhdWx0VmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBnZXRPcHRpb25LZXlMaXN0QnlUeXBlID0gKHRhcmdldE9iaiwgdGFyZ2V0VHlwZSkgPT4ge1xuICAgICAgaWYgKHRhcmdldFR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0T2JqKS5maWx0ZXIoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiB0YXJnZXRPYmpbdmFsdWVdID09PSB0YXJnZXRUeXBlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0VHlwZSA9PT0gJ2ludGVnZXInKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXRPYmopLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIHRhcmdldE9ialt2YWx1ZV0gPT09ICdudW1iZXInICYmIE51bWJlci5pc0ludGVnZXIodGFyZ2V0T2JqW3ZhbHVlXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0YXJnZXRUeXBlID09PSAnZmxvYXQnKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXRPYmopLmZpbHRlcigodmFsdWUpID0+IHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIHRhcmdldE9ialt2YWx1ZV0gPT09ICdudW1iZXInICYmICFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldE9ialt2YWx1ZV0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gYm9vbGVhbiB0eXBlIGxpc3Qg6rCA7KC47Jik6riwXG4gICAgY29uc3QgYm9vbGVhblR5cGVPcHRpb25zID0gZ2V0T3B0aW9uS2V5TGlzdEJ5VHlwZShPUFRJT05fVEVNUExBVEUsICdib29sZWFuJyk7XG4gICAgY29uc29sZS5kZWJ1ZygnYm9vbGVhblR5cGVPcHRpb25zOiAnICsgYm9vbGVhblR5cGVPcHRpb25zKTtcblxuICAgIC8vIG51bWJlciB0eXBlIGxpc3Qg6rCA7KC47Jik6riwXG4gICAgY29uc3QgaW50ZWdlclR5cGVPcHRpb25zID0gZ2V0T3B0aW9uS2V5TGlzdEJ5VHlwZShPUFRJT05fVEVNUExBVEUsICdpbnRlZ2VyJyk7XG4gICAgY29uc29sZS5kZWJ1ZygnaW50ZWdlclR5cGVPcHRpb25zOiAnICsgaW50ZWdlclR5cGVPcHRpb25zKTtcblxuICAgIC8vIGZsb2F0IHR5cGUgbGlzdCDqsIDsoLjsmKTquLBcbiAgICBjb25zdCBmbG9hdFR5cGVPcHRpb25zID0gZ2V0T3B0aW9uS2V5TGlzdEJ5VHlwZShPUFRJT05fVEVNUExBVEUsICdmbG9hdCcpO1xuICAgIGNvbnNvbGUuZGVidWcoJ2Zsb2F0VHlwZU9wdGlvbnM6ICcgKyBmbG9hdFR5cGVPcHRpb25zKTtcblxuICAgIC8vIGJvb2xlYW4gdHlwZSDsnbgg7Ji17IWY7JeQIHN0cmluZyDqsJLsnbQg65Ok7Ja06rCEIOqyveyasCBib29sZWFuIOuzgO2ZmCDsspjrpqxcbiAgICBib29sZWFuVHlwZU9wdGlvbnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB0aGlzLl9fb3B0aW9uc1trZXldID0gY29udmVydFR5cGVUb0Jvb2xlYW4odGhpcy5fX29wdGlvbnNba2V5XSwgT1BUSU9OX1RFTVBMQVRFW2tleV0pO1xuICAgIH0pO1xuXG4gICAgLy8gaW50ZWdlciB0eXBlIOyduCDsmLXshZjsl5Agc3RyaW5nIOqwkuydtCDrk6TslrTqsIQg6rK97JqwIGludGVnZXIg67OA7ZmYIOyymOumrFxuICAgIGludGVnZXJUeXBlT3B0aW9ucy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX19vcHRpb25zW2tleV0gPSBjb252ZXJ0VHlwZVRvSW50ZWdlcih0aGlzLl9fb3B0aW9uc1trZXldLCBPUFRJT05fVEVNUExBVEVba2V5XSk7XG4gICAgfSk7XG5cbiAgICAvLyBmbG9hdCB0eXBlIOyduCDsmLXshZjsl5Agc3RyaW5nIOqwkuydtCDrk6TslrTqsIQg6rK97JqwIGZsb2F0IOuzgO2ZmCDsspjrpqxcbiAgICBmbG9hdFR5cGVPcHRpb25zLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5fX29wdGlvbnNba2V5XSA9IGNvbnZlcnRUeXBlVG9GbG9hdCh0aGlzLl9fb3B0aW9uc1trZXldLCBPUFRJT05fVEVNUExBVEVba2V5XSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkgJiYgdGhpcy5fX29wdGlvbnMuc3NhTWF4UmV0cnlDb3VudCA+IDApIHtcbiAgICAgIHRoaXMuX19vcHRpb25zLnNzYU1heFJldHJ5Q291bnQgPSAwO1xuICAgICAgY29uc29sZS5sb2coJ2lzRW5jcnlwdE1vZGUgaXMgdHJ1ZS4gc28sIHJlc2V0IHNzYU1heFJldHJ5Q291bnQgdG8gMC4nKTtcbiAgICB9XG4gIH1cblxuICBfX3dpbmRvd0V2ZW50QmluZCgpIHtcbiAgICBjb25zdCBfdGhpc18gPSB0aGlzO1xuXG4gICAgaWYgKC9pcGhvbmV8aXBvZHxpcGFkLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICBjb25zdCBza2lwVG91Y2hBY3Rpb25mb3Jab29tID0gKGV2KSA9PiB7XG4gICAgICAgIGlmIChldi50b3VjaGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGV2LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNraXBUb3VjaEFjdGlvbmZvclpvb20sIHtcbiAgICAgICAgcGFzc2l2ZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBza2lwVG91Y2hBY3Rpb25mb3Jab29tLCB7XG4gICAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBza2lwVG91Y2hBY3Rpb25mb3Jab29tLCB7XG4gICAgICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXNfLl9fcGFnZUVuZCA9IHRydWU7XG4gICAgICBfdGhpc18uY2xlYW51cCgpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVSZXNpemUgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoISEhX3RoaXNfLl9fb2NyVHlwZSkgcmV0dXJuO1xuXG4gICAgICBpZiAoIV90aGlzXy5fX2lzSW5Qcm9ncmVzc0hhbmRsZVJlc2l6ZSkge1xuICAgICAgICBfdGhpc18uX19pc0luUHJvZ3Jlc3NIYW5kbGVSZXNpemUgPSB0cnVlO1xuICAgICAgICBfdGhpc18uX190aHJvdHRsaW5nUmVzaXplVGltZXIgPSBudWxsO1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIFJFU0laRSBFVkVOVCAhISEnKTtcblxuICAgICAgICBfdGhpc18uX19pc0luUHJvZ3Jlc3NIYW5kbGVSZXNpemUgPSBmYWxzZTtcbiAgICAgICAgYXdhaXQgX3RoaXNfLnJlc3RhcnRPQ1IoX3RoaXNfLl9fb2NyVHlwZSwgX3RoaXNfLl9fb25TdWNjZXNzLCBfdGhpc18uX19vbkZhaWx1cmUsIF90aGlzXy5fX29uSW5Qcm9ncmVzc0NoYW5nZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnISEhIFNLSVAgUkVTSVpFIEVWRU5UIC0gcHJldmlvdXMgcmVzaXplIGV2ZW50IHByb2Nlc3MgaXMgbm90IGNvbXBsZXRlZCB5ZXQgISEhJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoISEhX3RoaXNfLl9fdGhyb3R0bGluZ1Jlc2l6ZVRpbWVyKSB7XG4gICAgICAgIF90aGlzXy5fX3Rocm90dGxpbmdSZXNpemVUaW1lciA9IHNldFRpbWVvdXQoaGFuZGxlUmVzaXplLCBfdGhpc18uX190aHJvdHRsaW5nUmVzaXplRGVsYXkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX19kZWJ1Zyhtc2cpIHtcbiAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlRGVidWdBbGVydCkge1xuICAgICAgYWxlcnQoYFtERUJVRyBJTkZPXVxcbiR7bXNnfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmRlYnVnKGBbREVCVUcgSU5GT11cXG4ke21zZ31gKTtcbiAgICB9XG4gIH1cblxuICBfX3NsZWVwKG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG4gIH1cblxuICBfX2Jsb2JUb0Jhc2U2NChibG9iKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCBfKSA9PiB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpID0+IHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9fYmFzZTY0dG9CbG9iKGJhc2U2NCkge1xuICAgIC8vIGNvbnZlcnQgYmFzZTY0IHRvIHJhdyBiaW5hcnkgZGF0YSBoZWxkIGluIGEgc3RyaW5nXG4gICAgLy8gZG9lc24ndCBoYW5kbGUgVVJMRW5jb2RlZCBEYXRhVVJJcyAtIHNlZSBTTyBhbnN3ZXIgIzY4NTAyNzYgZm9yIGNvZGUgdGhhdCBkb2VzIHRoaXNcbiAgICBjb25zdCBieXRlU3RyaW5nID0gYXRvYihiYXNlNjQuc3BsaXQoJywnKVsxXSk7XG5cbiAgICAvLyBzZXBhcmF0ZSBvdXQgdGhlIG1pbWUgY29tcG9uZW50XG4gICAgY29uc3QgbWltZVN0cmluZyA9IGJhc2U2NC5zcGxpdCgnLCcpWzBdLnNwbGl0KCc6JylbMV0uc3BsaXQoJzsnKVswXTtcblxuICAgIC8vIHdyaXRlIHRoZSBieXRlcyBvZiB0aGUgc3RyaW5nIHRvIGFuIEFycmF5QnVmZmVyXG4gICAgY29uc3QgYWIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZVN0cmluZy5sZW5ndGgpO1xuICAgIGNvbnN0IGlhID0gbmV3IFVpbnQ4QXJyYXkoYWIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZVN0cmluZy5sZW5ndGg7IGkrKykge1xuICAgICAgaWFbaV0gPSBieXRlU3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCbG9iKFthYl0sIHsgdHlwZTogbWltZVN0cmluZyB9KTtcbiAgfVxuXG4gIGFzeW5jIF9fY29tcHJlc3NCYXNlNjRJbWFnZShiYXNlNjQsIG9wdGlvbnMsIGNvbnN0YW50TnVtYmVyKSB7XG4gICAgaWYgKGJhc2U2NCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgYmxvYkZpbGUgPSB0aGlzLl9fYmFzZTY0dG9CbG9iKGJhc2U2NCk7XG5cbiAgICBjb25zdCBjb21wcmVzc2VkID0gYXdhaXQgSW1hZ2VVdGlsLmNvbXByZXNzSW1hZ2UoYmxvYkZpbGUsIG9wdGlvbnMsIGNvbnN0YW50TnVtYmVyKTtcbiAgICBjb25zdCBjb21wcmVzc2lvblJhdGlvID0gTWF0aC5yb3VuZCgoMSAtIGNvbXByZXNzZWQuc2l6ZSAvIGJsb2JGaWxlLnNpemUpICogMTAwMDApIC8gMTAwO1xuXG4gICAgY29uc29sZS5sb2coXG4gICAgICBgSW1hZ2UgQ29tcHJlc3Npb24gRG9uZS4gJHtjb21wcmVzc2lvblJhdGlvfSUuIGZyb20gJHtNYXRoLnJvdW5kKGJsb2JGaWxlLnNpemUgLyAxMDI0KX1LQiB0byAke01hdGgucm91bmQoXG4gICAgICAgIGNvbXByZXNzZWQuc2l6ZSAvIDEwMjRcbiAgICAgICl9S0JgXG4gICAgKTtcblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9fYmxvYlRvQmFzZTY0KGNvbXByZXNzZWQpO1xuICB9XG5cbiAgLyoqIOudvOydtOyEvOyKpCDtgqTrpbwgaGVhcCDsl5AgYWxsb2NhdGlvbiAqL1xuICBfX2dldFN0cmluZ09uV2FzbUhlYXAoKSB7XG4gICAgaWYgKCEhIXRoaXMuX19saWNlbnNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xpY2Vuc2UgS2V5IGlzIGVtcHR5Jyk7XG4gICAgfVxuICAgIGNvbnN0IGxlbmd0aEJ5dGVzID0gdGhpcy5fX09DUkVuZ2luZS5sZW5ndGhCeXRlc1VURjgodGhpcy5fX2xpY2Vuc2UpICsgMTtcbiAgICB0aGlzLl9fc3RyaW5nT25XYXNtSGVhcCA9IHRoaXMuX19PQ1JFbmdpbmUuX21hbGxvYyhsZW5ndGhCeXRlcyk7XG4gICAgdGhpcy5fX09DUkVuZ2luZS5zdHJpbmdUb1VURjgodGhpcy5fX2xpY2Vuc2UsIHRoaXMuX19zdHJpbmdPbldhc21IZWFwLCBsZW5ndGhCeXRlcyk7XG4gICAgcmV0dXJuIHRoaXMuX19zdHJpbmdPbldhc21IZWFwO1xuICB9XG5cbiAgLy8g66+47IKs7JqpIDogd2FzbSDroIjrsqjsl5DshJwg7JWU7Zi47ZmU7ZWY7JesIOu2iO2VhOyalCDtlbTsp5BcbiAgLy8gX19lbmNyeXB0U2NhblJlc3VsdChvY3JSZXN1bHQpIHtcbiAgLy8gICBsZXQgc3RyaW5nT25XYXNtSGVhcCA9IG51bGw7XG4gIC8vICAgdHJ5IHtcbiAgLy8gICAgIGlmICh0eXBlb2Ygb2NyUmVzdWx0ID09PSAnbnVtYmVyJyB8fCB0eXBlb2Ygb2NyUmVzdWx0ID09PSAnYm9vbGVhbicpIG9jclJlc3VsdCA9IG9jclJlc3VsdC50b1N0cmluZygpO1xuICAvLyAgICAgaWYgKG9jclJlc3VsdCA9PT0gJycpIHJldHVybiAnJztcbiAgLy8gICAgIGlmICh0eXBlb2Ygb2NyUmVzdWx0ICE9PSAnc3RyaW5nJyAmJiAhISFvY3JSZXN1bHQpIHtcbiAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdvY3JSZXN1bHQgaXMgZW1wdHknKTtcbiAgLy8gICAgIH1cbiAgLy8gICAgIGNvbnN0IGpzb25TdHJpbmcgPSBvY3JSZXN1bHQ7XG4gIC8vICAgICBjb25zdCBsZW5ndGhCeXRlcyA9IHRoaXMuX19PQ1JFbmdpbmUubGVuZ3RoQnl0ZXNVVEY4KGpzb25TdHJpbmcpICsgMTtcbiAgLy8gICAgIHN0cmluZ09uV2FzbUhlYXAgPSB0aGlzLl9fT0NSRW5naW5lLl9tYWxsb2MobGVuZ3RoQnl0ZXMpO1xuICAvLyAgICAgdGhpcy5fX09DUkVuZ2luZS5zdHJpbmdUb1VURjgoanNvblN0cmluZywgc3RyaW5nT25XYXNtSGVhcCwgbGVuZ3RoQnl0ZXMpO1xuICAvL1xuICAvLyAgICAgcmV0dXJuIHRoaXMuX19PQ1JFbmdpbmUuZW5jcnlwdFJlc3VsdChzdHJpbmdPbldhc21IZWFwKTtcbiAgLy8gICB9IGZpbmFsbHkge1xuICAvLyAgICAgaWYgKHN0cmluZ09uV2FzbUhlYXApIHtcbiAgLy8gICAgICAgdGhpcy5fX09DUkVuZ2luZS5fZnJlZShzdHJpbmdPbldhc21IZWFwKTtcbiAgLy8gICAgICAgc3RyaW5nT25XYXNtSGVhcCA9IG51bGw7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgYXN5bmMgX19zZXRWaWRlb1Jlc29sdXRpb24odmlkZW9FbGVtZW50KSB7XG4gICAgbGV0IGlzU3VwcG9ydGVkUmVzb2x1dGlvbiA9IGZhbHNlO1xuICAgIGxldCByZXNvbHV0aW9uVGV4dCA9ICdub3QgcmVhZHknO1xuXG4gICAgaWYgKCF0aGlzLl9fY2FtU2V0Q29tcGxldGUpIHtcbiAgICAgIHJldHVybiB7IGlzU3VwcG9ydGVkUmVzb2x1dGlvbiwgcmVzb2x1dGlvblRleHQgfTtcbiAgICB9XG5cbiAgICBpZiAodmlkZW9FbGVtZW50LnZpZGVvV2lkdGggPT09IDAgJiYgdmlkZW9FbGVtZW50LnZpZGVvSGVpZ2h0ID09PSAwKSB7XG4gICAgICBhd2FpdCB0aGlzLl9fY2hhbmdlU3RhZ2UodGhpcy5JTl9QUk9HUkVTUy5OT1RfUkVBRFkpO1xuICAgICAgcmV0dXJuIHsgaXNTdXBwb3J0ZWRSZXNvbHV0aW9uLCByZXNvbHV0aW9uVGV4dCB9O1xuICAgIH1cblxuICAgIHJlc29sdXRpb25UZXh0ID0gdmlkZW9FbGVtZW50LnZpZGVvV2lkdGggKyAneCcgKyB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQ7XG5cbiAgICBpZiAoXG4gICAgICAodmlkZW9FbGVtZW50LnZpZGVvV2lkdGggPT09IDEwODAgJiYgdmlkZW9FbGVtZW50LnZpZGVvSGVpZ2h0ID09PSAxOTIwKSB8fFxuICAgICAgKHZpZGVvRWxlbWVudC52aWRlb1dpZHRoID09PSAxOTIwICYmIHZpZGVvRWxlbWVudC52aWRlb0hlaWdodCA9PT0gMTA4MClcbiAgICApIHtcbiAgICAgIGlzU3VwcG9ydGVkUmVzb2x1dGlvbiA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICh2aWRlb0VsZW1lbnQudmlkZW9XaWR0aCA9PT0gMTI4MCAmJiB2aWRlb0VsZW1lbnQudmlkZW9IZWlnaHQgPT09IDcyMCkgfHxcbiAgICAgICh2aWRlb0VsZW1lbnQudmlkZW9XaWR0aCA9PT0gNzIwICYmIHZpZGVvRWxlbWVudC52aWRlb0hlaWdodCA9PT0gMTI4MClcbiAgICApIHtcbiAgICAgIGlzU3VwcG9ydGVkUmVzb2x1dGlvbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZGVvRWxlbWVudC5zcmNPYmplY3QgPSBudWxsO1xuICAgICAgaXNTdXBwb3J0ZWRSZXNvbHV0aW9uID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX192aWRlb1dpZHRoID0gdmlkZW9FbGVtZW50LnZpZGVvV2lkdGg7XG4gICAgdGhpcy5fX3ZpZGVvSGVpZ2h0ID0gdmlkZW9FbGVtZW50LnZpZGVvSGVpZ2h0O1xuICAgIHJldHVybiB7IGlzU3VwcG9ydGVkUmVzb2x1dGlvbiwgcmVzb2x1dGlvblRleHQgfTtcbiAgfVxuXG4gIF9fZ2V0U2Nhbm5lckFkZHJlc3Mob2NyVHlwZSkge1xuICAgIGlmICghdGhpcy5fX29jclR5cGVMaXN0LmluY2x1ZGVzKG9jclR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG5cbiAgICB0cnkge1xuICAgICAgbGV0IGFkZHJlc3MgPSAwO1xuICAgICAgbGV0IGRlc3Ryb3lDYWxsYmFjayA9IG51bGw7XG5cbiAgICAgIGNvbnN0IHN0cmluZ09uV2FzbUhlYXAgPSB0aGlzLl9fZ2V0U3RyaW5nT25XYXNtSGVhcCgpO1xuXG4gICAgICBzd2l0Y2ggKG9jclR5cGUpIHtcbiAgICAgICAgLy8gT0NSXG4gICAgICAgIGNhc2UgJ2lkY2FyZCc6XG4gICAgICAgIGNhc2UgJ2RyaXZlcic6XG4gICAgICAgIGNhc2UgJ2lkY2FyZC1zc2EnOlxuICAgICAgICBjYXNlICdkcml2ZXItc3NhJzpcbiAgICAgICAgICBhZGRyZXNzID0gdGhpcy5fX09DUkVuZ2luZS5nZXRJRENhcmRTY2FubmVyKHN0cmluZ09uV2FzbUhlYXApO1xuICAgICAgICAgIGRlc3Ryb3lDYWxsYmFjayA9ICgpID0+IHRoaXMuX19PQ1JFbmdpbmUuZGVzdHJveUlEQ2FyZFNjYW5uZXIoYWRkcmVzcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgICAgY2FzZSAnZm9yZWlnbi1wYXNzcG9ydCc6XG4gICAgICAgIGNhc2UgJ3Bhc3Nwb3J0LXNzYSc6XG4gICAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgICBhZGRyZXNzID0gdGhpcy5fX09DUkVuZ2luZS5nZXRQYXNzcG9ydFNjYW5uZXIoc3RyaW5nT25XYXNtSGVhcCk7XG4gICAgICAgICAgZGVzdHJveUNhbGxiYWNrID0gKCkgPT4gdGhpcy5fX09DUkVuZ2luZS5kZXN0cm95UGFzc3BvcnRTY2FubmVyKGFkZHJlc3MpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdhbGllbic6XG4gICAgICAgIGNhc2UgJ2FsaWVuLWJhY2snOlxuICAgICAgICBjYXNlICdhbGllbi1zc2EnOlxuICAgICAgICAgIGFkZHJlc3MgPSB0aGlzLl9fT0NSRW5naW5lLmdldEFsaWVuU2Nhbm5lcihzdHJpbmdPbldhc21IZWFwKTtcbiAgICAgICAgICBkZXN0cm95Q2FsbGJhY2sgPSAoKSA9PiB0aGlzLl9fT0NSRW5naW5lLmRlc3Ryb3lBbGllblNjYW5uZXIoYWRkcmVzcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NyZWRpdCc6XG4gICAgICAgICAgYWRkcmVzcyA9IHRoaXMuX19PQ1JFbmdpbmUuZ2V0Q3JlZGl0U2Nhbm5lcihzdHJpbmdPbldhc21IZWFwKTtcbiAgICAgICAgICBkZXN0cm95Q2FsbGJhY2sgPSAoKSA9PiB0aGlzLl9fT0NSRW5naW5lLmRlc3Ryb3lDcmVkaXRTY2FubmVyKGFkZHJlc3MpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2Nhbm5lciBkb2VzIG5vdCBleGlzdHMnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19PQ1JFbmdpbmUuX2ZyZWUoc3RyaW5nT25XYXNtSGVhcCk7XG5cbiAgICAgIGlmIChhZGRyZXNzID09PSAwKSB7XG4gICAgICAgIGlmICh0aGlzLl9fbWF4UmV0cnlDb3VudEdldEFkZHJlc3MgPT09IHRoaXMuX19yZXRyeUNvdW50R2V0QWRkcmVzcykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV3JvbmcgTGljZW5zZSBLZXknKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9fcmV0cnlDb3VudEdldEFkZHJlc3MrKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBbYWRkcmVzcywgZGVzdHJveUNhbGxiYWNrXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBUT0RPIDogTGljZW5zZSBJc3N1ZeyduCDqsr3smrAg7JeQ65+sIOqwkuydhCDrsJvslYTshJwgZXJyb3Ig66Gc6re466W8IOywjeydhCDsiJgg7J6I6rKMIOyalOyyre2VhOyalCAo7J6E7IucIE7rsogg7J207IOBIGFkZHJlc3Prpbwg66q767Cb7Jy866m0IOqwleygnCDsl5Drn6wpXG4gICAgICBjb25zb2xlLmVycm9yKCdnZXRTY2FubmVyQWRkcmVzc0Vycm9yKCknKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIF9fZ2V0QnVmZmVyKCkge1xuICAgIGlmICghdGhpcy5fX0J1ZmZlcikge1xuICAgICAgdGhpcy5fX0J1ZmZlciA9IHRoaXMuX19PQ1JFbmdpbmUuX21hbGxvYyh0aGlzLl9fcmVzb2x1dGlvbldpZHRoICogdGhpcy5fX3Jlc29sdXRpb25IZWlnaHQgKiA0KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9fcmVzdWx0QnVmZmVyKSB7XG4gICAgICB0aGlzLl9fcmVzdWx0QnVmZmVyID0gdGhpcy5fX09DUkVuZ2luZS5fbWFsbG9jKDQwOTYpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlTWFza0luZm8pIHtcbiAgICAgIGlmICghdGhpcy5fX21hc2tJbmZvUmVzdWx0QnVmKSB7XG4gICAgICAgIHRoaXMuX19tYXNrSW5mb1Jlc3VsdEJ1ZiA9IHRoaXMuX19PQ1JFbmdpbmUuX21hbGxvYyg0MDk2KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFt0aGlzLl9fQnVmZmVyLCB0aGlzLl9fcmVzdWx0QnVmZmVyLCB0aGlzLl9fbWFza0luZm9SZXN1bHRCdWZdO1xuICB9XG5cbiAgLyoqIEZyZWUgYnVmZmVyICovXG4gIF9fZGVzdHJveUJ1ZmZlcigpIHtcbiAgICBpZiAodGhpcy5fX0J1ZmZlcikge1xuICAgICAgdGhpcy5fX09DUkVuZ2luZS5fZnJlZSh0aGlzLl9fQnVmZmVyKTtcbiAgICAgIHRoaXMuX19CdWZmZXIgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLl9fZGVzdHJveVJlc3VsdEJ1ZmZlcigpO1xuICAgIHRoaXMuX19kZXN0cm95TWFza0luZm9SZXN1bHRCdWZmZXIoKTtcbiAgfVxuXG4gIF9fZGVzdHJveVJlc3VsdEJ1ZmZlcigpIHtcbiAgICBpZiAodGhpcy5fX3Jlc3VsdEJ1ZmZlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX09DUkVuZ2luZS5fZnJlZSh0aGlzLl9fcmVzdWx0QnVmZmVyKTtcbiAgICAgIHRoaXMuX19yZXN1bHRCdWZmZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9fZGVzdHJveU1hc2tJbmZvUmVzdWx0QnVmZmVyKCkge1xuICAgIGlmICh0aGlzLl9fbWFza0luZm9SZXN1bHRCdWYgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19PQ1JFbmdpbmUuX2ZyZWUodGhpcy5fX21hc2tJbmZvUmVzdWx0QnVmKTtcbiAgICAgIHRoaXMuX19tYXNrSW5mb1Jlc3VsdEJ1ZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZyZWUgUHJldkltYWdlIGJ1ZmZlciAqL1xuICBfX2Rlc3Ryb3lQcmV2SW1hZ2UoKSB7XG4gICAgaWYgKHRoaXMuX19QcmV2SW1hZ2UgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19PQ1JFbmdpbmUuX2ZyZWUodGhpcy5fX1ByZXZJbWFnZSk7XG4gICAgICB0aGlzLl9fUHJldkltYWdlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogZnJlZSBzdHJpbmcgaGVhcCBidWZmZXIgKi9cbiAgX19kZXN0cm95U3RyaW5nT25XYXNtSGVhcCgpIHtcbiAgICBpZiAodGhpcy5fX3N0cmluZ09uV2FzbUhlYXApIHtcbiAgICAgIHRoaXMuX19PQ1JFbmdpbmUuX2ZyZWUodGhpcy5fX3N0cmluZ09uV2FzbUhlYXApO1xuICAgICAgdGhpcy5fX3N0cmluZ09uV2FzbUhlYXAgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBmcmVlIHNjYW5uZXIgYWRkcmVzcyAqL1xuICBfX2Rlc3Ryb3lTY2FubmVyQWRkcmVzcygpIHtcbiAgICBpZiAodGhpcy5fX2Rlc3Ryb3lTY2FubmVyQ2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX19kZXN0cm95U2Nhbm5lckNhbGxiYWNrKCk7XG4gICAgICB0aGlzLl9fZGVzdHJveVNjYW5uZXJDYWxsYmFjayA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19pc1ZpZGVvUmVzb2x1dGlvbkNvbXBhdGlibGUodmlkZW9FbGVtZW50KSB7XG4gICAgY29uc3QgeyBpc1N1cHBvcnRlZFJlc29sdXRpb24sIHJlc29sdXRpb25UZXh0IH0gPSBhd2FpdCB0aGlzLl9fc2V0VmlkZW9SZXNvbHV0aW9uKHZpZGVvRWxlbWVudCk7XG4gICAgaWYgKCFpc1N1cHBvcnRlZFJlc29sdXRpb24pIHtcbiAgICAgIGlmIChyZXNvbHV0aW9uVGV4dCAhPT0gJ25vdCByZWFkeScpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVmlkZW8gUmVzb2x1dGlvbignICsgcmVzb2x1dGlvblRleHQgKyAnKSBpcyBub3QgU3VwcG9ydGVkIScpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNTdXBwb3J0ZWRSZXNvbHV0aW9uO1xuICB9XG5cbiAgX19nZXRSb3RhdGlvbkRlZ3JlZSgpIHtcbiAgICBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkpIHtcbiAgICAgIHRoaXMuX19vcHRpb25zLnJvdGF0aW9uRGVncmVlID0gMDtcbiAgICAgIGNvbnNvbGUubG9nKCdpc0VuY3J5cHRNb2RlIGlzIHRydWUuIHNvLCByZXNldCByb3RhdGVEZWdyZWUgdG8gMC4nKTtcbiAgICB9XG4gICAgcmV0dXJuICgodGhpcy5fX29wdGlvbnMucm90YXRpb25EZWdyZWUgJSAzNjApICsgMzYwKSAlIDM2MDtcbiAgfVxuXG4gIF9fZ2V0TWlycm9yTW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX29wdGlvbnMubWlycm9yTW9kZTtcbiAgfVxuXG4gIGFzeW5jIF9fY3JvcEltYWdlRnJvbVZpZGVvKCkge1xuICAgIGlmICghdGhpcy5fX2NhbVNldENvbXBsZXRlKSByZXR1cm4gW251bGwsIG51bGwsIG51bGxdO1xuXG4gICAgbGV0IFtjYWxjUmVzb2x1dGlvbl93LCBjYWxjUmVzb2x1dGlvbl9oXSA9IFt0aGlzLl9fcmVzb2x1dGlvbldpZHRoLCB0aGlzLl9fcmVzb2x1dGlvbkhlaWdodF07XG5cbiAgICBjb25zdCB7IHZpZGVvLCBjYW52YXMsIHJvdGF0aW9uQ2FudmFzIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuXG4gICAgLy8gc291cmNlIGltYWdlIChvciB2aWRlbylcbiAgICAvLyDilI/ilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilJNcbiAgICAvLyDilIMgICAgIOKUiiBzeSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKUg1xuICAgIC8vIOKUg+KUiOKUiOKUiOKUiCDilI/ilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilJMg4pSKICAgICAgICAgICAgICAg4pSDXG4gICAgLy8g4pSDIHN4ICDilIMgICAgICAgICAgICAgICDilIMg4pSKICAgICAgICAgICAgICAg4pSDXG4gICAgLy8g4pSDICAgICDilIMgICAgICAgICAgICAgICDilIMg4pSKIHNIZWlnaHQgICAgICAg4pSDXG4gICAgLy8g4pSDICAgICDilIMgICAgICAgICAgICAgICDilIMg4pSKICAgICAgICAgICAgICAg4pSDICAgICAgICAgICAgICAgZGVzdGluYXRpb24gY2FudmFzXG4gICAgLy8g4pSDICAgICDilJfilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilJsg4pSKICAgICAgICAgICAgICAg4pSD4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSTXG4gICAgLy8g4pSDICAgICDilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIggICAgICAgICAgICAgICAgIOKUgyAgICDilIogICAgICAgICAgICAgICAgICAgICAgICAgICDilINcbiAgICAvLyDilIMgICAgICAgICAgIHNXaWR0aCAgICAgICAgICAgICAgICAgICAgICDilIMgICAg4pSKIGR5ICAgICAgICAgICAgICAgICAgICAgICAg4pSDXG4gICAgLy8g4pSX4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSbICAgIOKUj+KUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUkyDilIogICAgICAgICDilINcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDilIPilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIMgICAgICAgICAgICAgICDilIMg4pSKICAgICAgICAg4pSDXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSDICAgIGR4ICAgICDilIMgICAgICAgICAgICAgICDilIMg4pSKIGRIZWlnaHQg4pSDXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSDICAgICAgICAgICDilIMgICAgICAgICAgICAgICDilIMg4pSKICAgICAgICAg4pSDXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSDICAgICAgICAgICDilJfilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilIHilJsg4pSKICAgICAgICAg4pSDXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4pSDICAgICAgICAgICDilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIjilIggICAgICAgICAgIOKUg1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKUgyAgICAgICAgICAgICAgICAgZFdpZHRoICAgICAgICAgICAgICAgIOKUg1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOKUl+KUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUgeKUm1xuICAgIC8vIGRyYXdJbWFnZShpbWFnZSwgZHgsIGR5KVxuICAgIC8vIGRyYXdJbWFnZShpbWFnZSwgZHgsIGR5LCBkV2lkdGgsIGRIZWlnaHQpXG4gICAgLy8gZHJhd0ltYWdlKGltYWdlLCBzeCwgc3ksIHNXaWR0aCwgc0hlaWdodCwgZHgsIGR5LCBkV2lkdGgsIGRIZWlnaHQpXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC9kcmF3SW1hZ2VcblxuICAgIGxldCBjYWxjQ2FudmFzID0gY2FudmFzO1xuICAgIGxldCBjYWxjVmlkZW9XaWR0aCA9IHZpZGVvLnZpZGVvV2lkdGg7XG4gICAgbGV0IGNhbGNWaWRlb0hlaWdodCA9IHZpZGVvLnZpZGVvSGVpZ2h0O1xuICAgIGxldCBjYWxjVmlkZW9DbGllbnRXaWR0aCA9IHZpZGVvLmNsaWVudFdpZHRoO1xuICAgIGxldCBjYWxjVmlkZW9DbGllbnRIZWlnaHQgPSB2aWRlby5jbGllbnRIZWlnaHQ7XG4gICAgbGV0IGNhbGNDcm9wSW1hZ2VTaXplV2lkdGggPSB0aGlzLl9fY3JvcEltYWdlU2l6ZVdpZHRoO1xuICAgIGxldCBjYWxjQ3JvcEltYWdlU2l6ZUhlaWdodCA9IHRoaXMuX19jcm9wSW1hZ2VTaXplSGVpZ2h0O1xuICAgIGxldCBjYWxjVmlkZW9PcmllbnRhdGlvbiA9IHRoaXMuX192aWRlb09yaWVudGF0aW9uO1xuXG4gICAgY29uc3QgaXNBbGllbkJhY2sgPSB0aGlzLl9fb2NyVHlwZSA9PT0gJ2FsaWVuLWJhY2snO1xuICAgIGlmICh0aGlzLl9faXNSb3RhdGVkOTBvcjI3MCkge1xuICAgICAgW2NhbGNDcm9wSW1hZ2VTaXplV2lkdGgsIGNhbGNDcm9wSW1hZ2VTaXplSGVpZ2h0XSA9IFtjYWxjQ3JvcEltYWdlU2l6ZUhlaWdodCwgY2FsY0Nyb3BJbWFnZVNpemVXaWR0aF07XG4gICAgICBbY2FsY1Jlc29sdXRpb25fdywgY2FsY1Jlc29sdXRpb25faF0gPSBbY2FsY1Jlc29sdXRpb25faCwgY2FsY1Jlc29sdXRpb25fd107XG4gICAgICBjYWxjQ2FudmFzID0gcm90YXRpb25DYW52YXM7XG4gICAgICBjYWxjVmlkZW9PcmllbnRhdGlvbiA9IHRoaXMuX192aWRlb09yaWVudGF0aW9uID09PSAncG9ydHJhaXQnID8gJ2xhbmRzY2FwZScgOiAncG9ydHJhaXQnO1xuICAgIH1cblxuICAgIGxldCBjYWxjTWF4U1dpZHRoID0gOTk5OTk7XG4gICAgbGV0IGNhbGNNYXhTSGVpZ2h0ID0gOTk5OTk7XG5cbiAgICBpZiAodGhpcy5fX3VpT3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcbiAgICAgIGlmIChjYWxjVmlkZW9PcmllbnRhdGlvbiA9PT0gdGhpcy5fX3VpT3JpZW50YXRpb24pIHtcbiAgICAgICAgLy8g7IS466GcIFVJIC8g7IS466GcIOy5tOuplOudvFxuICAgICAgICBjYWxjTWF4U1dpZHRoID0gY2FsY1ZpZGVvV2lkdGg7XG4gICAgICAgIGNhbGNNYXhTSGVpZ2h0ID0gY2FsY1ZpZGVvSGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8g7IS466GcIFVJIC8g6rCA66GcIOy5tOuplOudvFxuICAgICAgICBjYWxjTWF4U0hlaWdodCA9IGNhbGNWaWRlb0hlaWdodDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNhbGNWaWRlb09yaWVudGF0aW9uID09PSB0aGlzLl9fdWlPcmllbnRhdGlvbikge1xuICAgICAgICAvLyDqsIDroZwgVUkgLyDqsIDroZwg7Lm066mU6528XG4gICAgICAgIGNhbGNNYXhTSGVpZ2h0ID0gY2FsY1ZpZGVvSGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8g6rCA66GcIFVJIC8g7IS466GcIOy5tOuplOudvFxuICAgICAgICBjYWxjTWF4U1dpZHRoID0gY2FsY1ZpZGVvV2lkdGg7XG4gICAgICAgIGNhbGNNYXhTSGVpZ2h0ID0gY2FsY1ZpZGVvSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzeCwgc3k7XG4gICAgY29uc3QgcmF0aW8gPSBjYWxjVmlkZW9XaWR0aCAvIGNhbGNWaWRlb0NsaWVudFdpZHRoO1xuICAgIGNvbnN0IHNXaWR0aCA9IE1hdGgubWluKE1hdGgucm91bmQoY2FsY0Nyb3BJbWFnZVNpemVXaWR0aCAqIHJhdGlvKSwgY2FsY01heFNXaWR0aCk7XG4gICAgY29uc3Qgc0hlaWdodCA9IE1hdGgubWluKE1hdGgucm91bmQoY2FsY0Nyb3BJbWFnZVNpemVIZWlnaHQgKiByYXRpbyksIGNhbGNNYXhTSGVpZ2h0KTtcblxuICAgIHN4ID0gTWF0aC5tYXgoTWF0aC5yb3VuZCgoKGNhbGNWaWRlb0NsaWVudFdpZHRoIC0gY2FsY0Nyb3BJbWFnZVNpemVXaWR0aCkgLyAyKSAqIHJhdGlvKSwgMCk7XG4gICAgc3kgPSBNYXRoLm1heChNYXRoLnJvdW5kKCgoY2FsY1ZpZGVvQ2xpZW50SGVpZ2h0IC0gY2FsY0Nyb3BJbWFnZVNpemVIZWlnaHQpIC8gMikgKiByYXRpbyksIDApO1xuXG4gICAgaWYgKGlzQWxpZW5CYWNrKSB7XG4gICAgICBbY2FsY1Jlc29sdXRpb25fdywgY2FsY1Jlc29sdXRpb25faF0gPSBbY2FsY1Jlc29sdXRpb25faCwgY2FsY1Jlc29sdXRpb25fd107XG4gICAgfVxuICAgIGNhbGNDYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGNhbGNSZXNvbHV0aW9uX3cpO1xuICAgIGNhbGNDYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBjYWxjUmVzb2x1dGlvbl9oKTtcblxuICAgIGNvbnN0IGNhbGNDb250ZXh0ID0gY2FsY0NhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlIH0pO1xuICAgIGNhbGNDb250ZXh0LmRyYXdJbWFnZSh2aWRlbywgc3gsIHN5LCBzV2lkdGgsIHNIZWlnaHQsIDAsIDAsIGNhbGNSZXNvbHV0aW9uX3csIGNhbGNSZXNvbHV0aW9uX2gpO1xuXG4gICAgbGV0IGltZ0RhdGEsIGltZ0RhdGFVcmw7XG4gICAgaW1nRGF0YSA9IGNhbGNDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBjYWxjUmVzb2x1dGlvbl93LCBjYWxjUmVzb2x1dGlvbl9oKTtcblxuICAgIGxldCB1c2VEYXRhVVJMID0gZmFsc2U7XG4gICAgaWYgKGlzQWxpZW5CYWNrKSB7XG4gICAgICB1c2VEYXRhVVJMID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpc0VuY3J5cHRNb2RlIGlzIHRydWUuIHNvLCBzZXQgaW1hZ2VEYXRhVVJMIHRvIGVtcHR5IHN0cmluZycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXNlRGF0YVVSTCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGltZ0RhdGFVcmwgPSB1c2VEYXRhVVJMID8gY2FsY0NhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL2pwZWcnKSA6ICcnO1xuXG4gICAgaWYgKGlzQWxpZW5CYWNrKSB7XG4gICAgICBbaW1nRGF0YSwgaW1nRGF0YVVybF0gPSBhd2FpdCB0aGlzLl9fcm90YXRlKGltZ0RhdGEsIGltZ0RhdGFVcmwsIDI3MCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19pc1JvdGF0ZWQ5MG9yMjcwKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fX3JvdGF0ZShpbWdEYXRhLCBpbWdEYXRhVXJsLCB0aGlzLl9fZ2V0Um90YXRpb25EZWdyZWUoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbaW1nRGF0YSwgaW1nRGF0YVVybF07XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19yb3RhdGUoaW1nRGF0YSwgaW1nRGF0YVVybCwgZGVncmVlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAoZGVncmVlID09PSAwKSB7XG4gICAgICAgIHJlc29sdmUoW2ltZ0RhdGEsIGltZ0RhdGFVcmxdKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgY29uc3QgdGVtcENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgaW1nLnNyYyA9IGltZ0RhdGFVcmw7XG4gICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gY2FudmFzID0gcm90YXRpb25DYW52YXM7XG4gICAgICAgIGNvbnN0IHRlbXBDb250ZXh0ID0gdGVtcENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0ZW1wQ2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgaWYgKFs5MCwgMjcwXS5pbmNsdWRlcyhkZWdyZWUpKSB7XG4gICAgICAgICAgdGVtcENhbnZhcy53aWR0aCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgdGVtcENhbnZhcy5oZWlnaHQgPSBpbWcud2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAoWzAsIDE4MF0uaW5jbHVkZXMoZGVncmVlKSkge1xuICAgICAgICAgIHRlbXBDYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgICAgdGVtcENhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWdyZWUgPT09IDkwKSB0ZW1wQ29udGV4dC50cmFuc2xhdGUoaW1nLmhlaWdodCwgMCk7XG4gICAgICAgIGVsc2UgaWYgKGRlZ3JlZSA9PT0gMTgwKSB0ZW1wQ29udGV4dC50cmFuc2xhdGUoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgZWxzZSBpZiAoZGVncmVlID09PSAyNzApIHRlbXBDb250ZXh0LnRyYW5zbGF0ZSgwLCBpbWcud2lkdGgpO1xuXG4gICAgICAgIHRlbXBDb250ZXh0LnJvdGF0ZSgoZGVncmVlICogTWF0aC5QSSkgLyAxODApO1xuICAgICAgICB0ZW1wQ29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcbiAgICAgICAgY29uc3QgbmV3SW1hZ2VEYXRhID0gWzkwLCAyNzBdLmluY2x1ZGVzKGRlZ3JlZSlcbiAgICAgICAgICA/IHRlbXBDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCBpbWcuaGVpZ2h0LCBpbWcud2lkdGgpXG4gICAgICAgICAgOiB0ZW1wQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgcmVzb2x2ZShbbmV3SW1hZ2VEYXRhLCB0ZW1wQ2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycpXSk7XG4gICAgICAgIHRlbXBDb250ZXh0LnJlc3RvcmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgX19pc0NhcmRib3hEZXRlY3RlZChhZGRyZXNzLCBib3hUeXBlID0gMCwgcmV0cnlJbWcgPSBudWxsKSB7XG4gICAgaWYgKCFhZGRyZXNzIHx8IGFkZHJlc3MgPCAwKSB7XG4gICAgICByZXR1cm4gW2ZhbHNlLCBudWxsXTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGxldCBpbWdEYXRhO1xuICAgICAgbGV0IGltZ0RhdGFVcmwgPSBudWxsO1xuXG4gICAgICBjb25zdCBbYnVmZmVyXSA9IHRoaXMuX19nZXRCdWZmZXIoKTtcbiAgICAgIGlmIChyZXRyeUltZyAhPT0gbnVsbCkge1xuICAgICAgICBpbWdEYXRhID0gcmV0cnlJbWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBbaW1nRGF0YSwgaW1nRGF0YVVybF0gPSBhd2FpdCB0aGlzLl9fY3JvcEltYWdlRnJvbVZpZGVvKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghISFpbWdEYXRhKSB7XG4gICAgICAgIHJldHVybiBbZmFsc2UsIG51bGxdO1xuICAgICAgfVxuICAgICAgdGhpcy5fX09DUkVuZ2luZS5IRUFQOC5zZXQoaW1nRGF0YS5kYXRhLCBidWZmZXIpO1xuXG4gICAgICBsZXQga29yID0gZmFsc2UsXG4gICAgICAgIGFsaWVuID0gZmFsc2UsXG4gICAgICAgIHBhc3Nwb3J0ID0gZmFsc2U7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5fX29jclR5cGUpIHtcbiAgICAgICAgY2FzZSAnaWRjYXJkJzpcbiAgICAgICAgY2FzZSAnZHJpdmVyJzpcbiAgICAgICAgY2FzZSAnaWRjYXJkLXNzYSc6XG4gICAgICAgIGNhc2UgJ2RyaXZlci1zc2EnOlxuICAgICAgICAgIGtvciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgICAgY2FzZSAncGFzc3BvcnQtc3NhJzpcbiAgICAgICAgY2FzZSAnZm9yZWlnbi1wYXNzcG9ydCc6XG4gICAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgICBwYXNzcG9ydCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2FsaWVuJzpcbiAgICAgICAgY2FzZSAnYWxpZW4tYmFjayc6XG4gICAgICAgIGNhc2UgJ2FsaWVuLXNzYSc6XG4gICAgICAgICAgYWxpZW4gPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjcmVkaXQnOlxuICAgICAgICAgIC8vIG5vdGhpbmdcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuICAgICAgaWYgKGtvciB8fCBwYXNzcG9ydCB8fCBhbGllbikge1xuICAgICAgICByZXN1bHQgPSB0aGlzLl9fT0NSRW5naW5lLmRldGVjdF9pZGNhcmRfb3B0KFxuICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICB0aGlzLl9fcmVzb2x1dGlvbldpZHRoLFxuICAgICAgICAgIHRoaXMuX19yZXNvbHV0aW9uSGVpZ2h0LFxuICAgICAgICAgIGFkZHJlc3MsXG4gICAgICAgICAga29yLFxuICAgICAgICAgIGFsaWVuLFxuICAgICAgICAgIHBhc3Nwb3J0XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSB0aGlzLl9fT0NSRW5naW5lLmRldGVjdF9pZGNhcmQoXG4gICAgICAgICAgYnVmZmVyLFxuICAgICAgICAgIHRoaXMuX19yZXNvbHV0aW9uV2lkdGgsXG4gICAgICAgICAgdGhpcy5fX3Jlc29sdXRpb25IZWlnaHQsXG4gICAgICAgICAgYWRkcmVzcyxcbiAgICAgICAgICBib3hUeXBlXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpc0NhcmRib3hEZXRlY3RlZCByZXN1bHQgLT0tLS0tLScsIHJlc3VsdClcbiAgICAgIHJldHVybiBbISFyZXN1bHQsIGltZ0RhdGEsIGltZ0RhdGFVcmxdO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnQ2FyZCBkZXRlY3Rpb24gZXJyb3IgOiAnICsgZTtcblxuICAgICAgaWYgKGUudG9TdHJpbmcoKS5pbmNsdWRlcygnbWVtb3J5JykpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhcmQgZGV0ZWN0aW9uIGVycm9yIDogJyArIGUpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9fc3RhcnRSZWNvZ25pdGlvbihhZGRyZXNzLCBvY3JUeXBlLCBzc2FNb2RlLCBpc1NldElnbm9yZUNvbXBsZXRlLCBpbWdEYXRhLCBpbWdEYXRhVXJsKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChhZGRyZXNzID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICdjaGVja1ZhbGlkYXRpb24gRmFpbCc7XG4gICAgICB9XG5cbiAgICAgIGxldCByYXdEYXRhID0gbnVsbDtcbiAgICAgIGxldCBvY3JSZXN1bHQgPSBudWxsO1xuXG4gICAgICBpZiAoIXRoaXMuX19vY3JUeXBlTGlzdC5pbmNsdWRlcyhvY3JUeXBlKSkgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBPQ1IgdHlwZScpO1xuXG4gICAgICAvLyBjb25zdCBbLCByZXN1bHRCdWZmZXJdID0gdGhpcy5fX2dldEJ1ZmZlcigpO1xuXG4gICAgICBjb25zdCByZWNvZ25pdGlvbiA9IGFzeW5jIChpc1NldElnbm9yZUNvbXBsZXRlKSA9PiB7XG4gICAgICAgIGlmIChpc1NldElnbm9yZUNvbXBsZXRlKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5fX2lzQ2FyZGJveERldGVjdGVkKGFkZHJlc3MsIDAsIGltZ0RhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChvY3JUeXBlKSB7XG4gICAgICAgICAgY2FzZSAnaWRjYXJkJzpcbiAgICAgICAgICBjYXNlICdkcml2ZXInOlxuICAgICAgICAgIGNhc2UgJ2lkY2FyZC1zc2EnOlxuICAgICAgICAgIGNhc2UgJ2RyaXZlci1zc2EnOlxuICAgICAgICAgICAgcmF3RGF0YSA9IHRoaXMuX19PQ1JFbmdpbmUuc2NhbklEQ2FyZChhZGRyZXNzLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgICAgICBjYXNlICdmb3JlaWduLXBhc3Nwb3J0JzpcbiAgICAgICAgICBjYXNlICdwYXNzcG9ydC1zc2EnOlxuICAgICAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgICAgIHJhd0RhdGEgPSB0aGlzLl9fT0NSRW5naW5lLnNjYW5QYXNzcG9ydChhZGRyZXNzLCAwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FsaWVuJzpcbiAgICAgICAgICBjYXNlICdhbGllbi1zc2EnOlxuICAgICAgICAgICAgcmF3RGF0YSA9IHRoaXMuX19PQ1JFbmdpbmUuc2NhbkFsaWVuKGFkZHJlc3MsIDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWxpZW4tYmFjayc6XG4gICAgICAgICAgICByYXdEYXRhID0gdGhpcy5fX09DUkVuZ2luZS5zY2FuQWxpZW5CYWNrKGFkZHJlc3MsIDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnY3JlZGl0JzpcbiAgICAgICAgICAgIHJhd0RhdGEgPSB0aGlzLl9fT0NSRW5naW5lLnNjYW5DcmVkaXQoYWRkcmVzcywgMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY2FubmVyIGRvZXMgbm90IGV4aXN0cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzog7Iug7Jqp7Lm065Oc64qUIOyVhOyngSBrZXk6dmFsdWUg7ZiV7YOc66GcIOuzgO2ZmCDslYjrkJjslrQg7J6I7J2MXG4gICAgICAgIGlmICh0aGlzLmlzQ3JlZGl0Q2FyZCgpKSB7XG4gICAgICAgICAgaWYgKHJhd0RhdGEgPT09IG51bGwgfHwgcmF3RGF0YSA9PT0gJycgfHwgcmF3RGF0YSA9PT0gJ2ZhbHNlJyB8fCByYXdEYXRhWzBdID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3JpZ2luSW1hZ2UgfSA9IGF3YWl0IHRoaXMuX19nZXRSZXN1bHRJbWFnZXMob2NyVHlwZSwgYWRkcmVzcyk7XG4gICAgICAgICAgICBvY3JSZXN1bHQgPSB7XG4gICAgICAgICAgICAgIG9jcl9yZXN1bHQ6IHJhd0RhdGEsXG4gICAgICAgICAgICAgIG9jcl9vcmlnaW5faW1hZ2U6IG9yaWdpbkltYWdlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmF3RGF0YSAhPT0gJ2NvbXBsZXRlOmZhbHNlJykge1xuICAgICAgICAgICAgcmF3RGF0YSA9IHRoaXMuX19zdHJpbmdUb0pzb24ocmF3RGF0YSk7XG5cbiAgICAgICAgICAgIC8vIFBpaSBlbmNyeXB0IOydvOuVjOunjCDtj6zrqafsnbQg64uk66aEXG4gICAgICAgICAgICBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkgJiYgdGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdE1vZGUpIHtcbiAgICAgICAgICAgICAgb2NyUmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIG9jcl9yZXN1bHQ6IHJhd0RhdGEsXG4gICAgICAgICAgICAgICAgb2NyX29yaWdpbl9pbWFnZTogcmF3RGF0YS5vY3Jfb3JpZ2luX2ltYWdlLFxuICAgICAgICAgICAgICAgIG9jcl9tYXNraW5nX2ltYWdlOiByYXdEYXRhLm9jcl9tYXNraW5nX2ltYWdlLFxuICAgICAgICAgICAgICAgIG9jcl9mYWNlX2ltYWdlOiByYXdEYXRhLm9jcl9mYWNlX2ltYWdlLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkZWxldGUgb2NyUmVzdWx0Lm9jcl9yZXN1bHQub2NyX29yaWdpbl9pbWFnZTtcbiAgICAgICAgICAgICAgZGVsZXRlIG9jclJlc3VsdC5vY3JfcmVzdWx0Lm9jcl9tYXNraW5nX2ltYWdlO1xuICAgICAgICAgICAgICBkZWxldGUgb2NyUmVzdWx0Lm9jcl9yZXN1bHQub2NyX2ZhY2VfaW1hZ2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBvY3JSZXN1bHRUbXAgPSB7IC4uLnJhd0RhdGEub2NyX3Jlc3VsdCwgLi4ucmF3RGF0YSB9O1xuICAgICAgICAgICAgICBkZWxldGUgb2NyUmVzdWx0VG1wLm9jcl9yZXN1bHQ7XG4gICAgICAgICAgICAgIG9jclJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBvY3JfcmVzdWx0OiBvY3JSZXN1bHRUbXAsXG4gICAgICAgICAgICAgICAgb2NyX29yaWdpbl9pbWFnZTogdGhpcy5fX29jckltYWdlR3VhcmQob2NyUmVzdWx0VG1wLm9jcl9vcmlnaW5faW1hZ2UpLFxuICAgICAgICAgICAgICAgIG9jcl9tYXNraW5nX2ltYWdlOiB0aGlzLl9fb2NySW1hZ2VHdWFyZChvY3JSZXN1bHRUbXAub2NyX21hc2tpbmdfaW1hZ2UpLFxuICAgICAgICAgICAgICAgIG9jcl9mYWNlX2ltYWdlOiB0aGlzLl9fb2NySW1hZ2VHdWFyZChvY3JSZXN1bHRUbXAub2NyX2ZhY2VfaW1hZ2UpLFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBkZWxldGUgb2NyUmVzdWx0Lm9jcl9yZXN1bHQub2NyX29yaWdpbl9pbWFnZTtcbiAgICAgICAgICAgICAgZGVsZXRlIG9jclJlc3VsdC5vY3JfcmVzdWx0Lm9jcl9tYXNraW5nX2ltYWdlO1xuICAgICAgICAgICAgICBkZWxldGUgb2NyUmVzdWx0Lm9jcl9yZXN1bHQub2NyX2ZhY2VfaW1hZ2U7XG5cbiAgICAgICAgICAgICAgLy8gdmFsdWVFbmNyeXB0TW9kZSDsnbzrlYwg7Y+s66mnIOunnuy2sOyjvOq4sFxuICAgICAgICAgICAgICBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkgJiYgdGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdFZhbHVlTW9kZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuY3J5cHRlZE9jclJlc3VsdCA9IHsgLi4ub2NyUmVzdWx0Lm9jcl9yZXN1bHQuZW5jcnlwdGVkIH07XG4gICAgICAgICAgICAgICAgY29uc3QgZW5jcnlwdGVkID0ge1xuICAgICAgICAgICAgICAgICAgb2NyX3Jlc3VsdDogZW5jcnlwdGVkT2NyUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgb2NyX29yaWdpbl9pbWFnZTogZW5jcnlwdGVkT2NyUmVzdWx0Lm9jcl9vcmlnaW5faW1hZ2UsXG4gICAgICAgICAgICAgICAgICBvY3JfbWFza2luZ19pbWFnZTogZW5jcnlwdGVkT2NyUmVzdWx0Lm9jcl9tYXNraW5nX2ltYWdlLFxuICAgICAgICAgICAgICAgICAgb2NyX2ZhY2VfaW1hZ2U6IGVuY3J5cHRlZE9jclJlc3VsdC5vY3JfZmFjZV9pbWFnZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbmNyeXB0ZWQub2NyX3Jlc3VsdC5vY3Jfb3JpZ2luX2ltYWdlO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbmNyeXB0ZWQub2NyX3Jlc3VsdC5vY3JfbWFza2luZ19pbWFnZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZW5jcnlwdGVkLm9jcl9yZXN1bHQub2NyX2ZhY2VfaW1hZ2U7XG5cbiAgICAgICAgICAgICAgICBvY3JSZXN1bHQuZW5jcnlwdGVkID0gZW5jcnlwdGVkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvY3JSZXN1bHQub2NyX3Jlc3VsdC5lbmNyeXB0ZWQ7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0VuY3J5cHRNb2RlKCkgJiYgdGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdE92ZXJhbGxNb2RlKSB7XG4gICAgICAgICAgICAgICAgb2NyUmVzdWx0LmVuY3J5cHRlZF9vdmVyYWxsID0gb2NyUmVzdWx0Lm9jcl9yZXN1bHQuZW5jcnlwdGVkX292ZXJhbGw7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9jclJlc3VsdC5vY3JfcmVzdWx0LmVuY3J5cHRlZF9vdmVyYWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG92ZXJhbGwg7J24IOqyveyasOunjCB0aW1lc3RhbXAg7LKY66asIC9cbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW5jcnlwdE1vZGUoKSAmJiB0aGlzLl9fb3B0aW9ucy51c2VFbmNyeXB0T3ZlcmFsbE1vZGUpIHtcbiAgICAgICAgICAgICAgb2NyUmVzdWx0LnRpbWVzdGFtcCA9IG9jclJlc3VsdC5vY3JfcmVzdWx0LnRpbWVzdGFtcDtcbiAgICAgICAgICAgICAgZGVsZXRlIG9jclJlc3VsdC5vY3JfcmVzdWx0LnRpbWVzdGFtcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBvY3JSZXN1bHQub2NyX3Jlc3VsdC50aW1lc3RhbXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9jclJlc3VsdD8ub2NyX3Jlc3VsdD8uY29tcGxldGUgIT09ICd1bmRlZmluZWQnICYmIG9jclJlc3VsdD8ub2NyX3Jlc3VsdD8uY29tcGxldGUgPT09ICd0cnVlJykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpc1NldElnbm9yZUNvbXBsZXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fX21hbnVhbE9DUlJldHJ5Q291bnQgPCB0aGlzLl9fbWFudWFsT0NSTWF4UmV0cnlDb3VudCkge1xuICAgICAgICAgICAgICAvLyBkZXRlY3RlZENhcmRRdWV1ZeyXkOyEnCDtlZzsnqXsnYQg6rq864K07IScIOqwseyLoO2VnOuLpC5cbiAgICAgICAgICAgICAgLy8g7KCA7J6l65CY7Ja07J6I64qUIOydtOuvuOyngOydmCDsiKvsnpDqsIAgcmV0cnkg67O064ukIOyekeydgOqyveyasCDrjIDruYTtlZjsl6wgJeulvCDsgqzsmqntlahcbiAgICAgICAgICAgICAgY29uc3QgcXVldWVJZHggPSB0aGlzLl9fbWFudWFsT0NSUmV0cnlDb3VudCAlIHRoaXMuX19kZXRlY3RlZENhcmRRdWV1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgIGltZ0RhdGEgPSB0aGlzLl9fZGV0ZWN0ZWRDYXJkUXVldWVbcXVldWVJZHhdO1xuICAgICAgICAgICAgICB0aGlzLl9fbWFudWFsT0NSUmV0cnlDb3VudCsrO1xuXG4gICAgICAgICAgICAgIHJldHVybiBhd2FpdCByZWNvZ25pdGlvbihpc1NldElnbm9yZUNvbXBsZXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIOyCrOynhCDtlZzsnqXsnLzroZwgT0NSIOyLpO2MqCAocG9wdXAg64K066as6rOgIHNldElnbm9yZUNvbXBsZXRlKGZhbHNlKSDsspjrpqw/XG4gICAgICAgICAgICAgIHRoaXMuX19tYW51YWxPQ1JSZXRyeUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgdGhpcy5zZXRJZ25vcmVDb21wbGV0ZShmYWxzZSk7XG4gICAgICAgICAgICAgIHRoaXMuX19ibHVyQ2FwdHVyZUJ1dHRvbigpOyAvLyDtjJ3sl4XsnbQg64K066Ck6rCI65WMIOyymOumrOuQmOyngOunjCDrr7jrpqwg7LKY66asXG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX0ZBSUxFRCwgZmFsc2UsIGltZ0RhdGFVcmwpO1xuICAgICAgICAgICAgICB0aGlzLl9fc2V0U3R5bGUoZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKS52aWRlbywgeyBkaXNwbGF5OiAnJyB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgLy8gZW5kIG9mIGZ1bmN0aW9uIHJlY29nbml0aW9uKClcblxuICAgICAgaWYgKGF3YWl0IHJlY29nbml0aW9uKGlzU2V0SWdub3JlQ29tcGxldGUpKSB7XG4gICAgICAgIGlmIChzc2FNb2RlKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy5fX2NoYW5nZVN0YWdlKHRoaXMuSU5fUFJPR1JFU1MuT0NSX1JFQ09HTklaRURfV0lUSF9TU0EsIGZhbHNlLCBvY3JSZXN1bHQub2NyX21hc2tpbmdfaW1hZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk9DUl9SRUNPR05JWkVEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvY3JSZXN1bHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcignc3RhcnRSZWNvZ25pdGlvbiBlcnJvcjonICsgZSk7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9fZ2V0UmVzdWx0SW1hZ2VzKG9jclR5cGUsIGFkZHJlc3MpIHtcbiAgICBsZXQgb3JpZ2luSW1hZ2VNb2RlO1xuXG4gICAgaWYgKHRoaXMuaXNDcmVkaXRDYXJkKCkpIHtcbiAgICAgIG9yaWdpbkltYWdlTW9kZSA9IHRoaXMuT0NSX0lNR19NT0RFLkNST1BQSU5HO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fX29wdGlvbnMudXNlSW1hZ2VDcm9wcGluZykge1xuICAgICAgb3JpZ2luSW1hZ2VNb2RlID0gdGhpcy5PQ1JfSU1HX01PREUuQ1JPUFBJTkc7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9fb3B0aW9ucy51c2VJbWFnZVdhcnBpbmcpIHtcbiAgICAgIG9yaWdpbkltYWdlTW9kZSA9IHRoaXMuT0NSX0lNR19NT0RFLldBUlBJTkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdpbkltYWdlTW9kZSA9IHRoaXMuT0NSX0lNR19NT0RFLk5PTkU7XG4gICAgfVxuXG4gICAgbGV0IG9yaWdpbkltYWdlO1xuICAgIGlmICghdGhpcy5pc0NyZWRpdENhcmQoKSAmJiB0aGlzLmlzRW5jcnlwdE1vZGUoKSkge1xuICAgICAgb3JpZ2luSW1hZ2UgPSB0aGlzLl9fZ2V0UGlpRW5jcnlwdEltYWdlQmFzZTY0KGFkZHJlc3MsIHRoaXMuT0NSX0lNR19NQVNLX01PREUuRkFMU0UsIG9yaWdpbkltYWdlTW9kZSk7XG4gICAgICBjb25zb2xlLmxvZygnZW5jcnlwdCBiYXNlNjQgb3JpZ2luIGltYWdlJywgb3JpZ2luSW1hZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnaW5JbWFnZSA9IGF3YWl0IHRoaXMuX19nZXRJbWFnZUJhc2U2NChhZGRyZXNzLCB0aGlzLk9DUl9JTUdfTUFTS19NT0RFLkZBTFNFLCBvcmlnaW5JbWFnZU1vZGUpO1xuICAgIH1cblxuICAgIGxldCBtYXNrSW1hZ2VNb2RlO1xuICAgIGxldCBtYXNrSW1hZ2UgPSBudWxsO1xuICAgIGxldCBmYWNlSW1hZ2UgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLmlzQ3JlZGl0Q2FyZCgpKSB7XG4gICAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlSW1hZ2VDcm9wcGluZykge1xuICAgICAgICBtYXNrSW1hZ2VNb2RlID0gdGhpcy5PQ1JfSU1HX01PREUuQ1JPUFBJTkc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXNrSW1hZ2VNb2RlID0gdGhpcy5PQ1JfSU1HX01PREUuV0FSUElORztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpKSB7XG4gICAgICAgIG1hc2tJbWFnZSA9IHRoaXMuX19nZXRQaWlFbmNyeXB0SW1hZ2VCYXNlNjQoYWRkcmVzcywgdGhpcy5PQ1JfSU1HX01BU0tfTU9ERS5UUlVFLCBtYXNrSW1hZ2VNb2RlKTtcbiAgICAgICAgZmFjZUltYWdlID0gdGhpcy5fX29wdGlvbnMudXNlRmFjZUltYWdlXG4gICAgICAgICAgPyB0aGlzLl9fZ2V0UGlpRW5jcnlwdEltYWdlQmFzZTY0KGFkZHJlc3MsIG51bGwsIG9yaWdpbkltYWdlTW9kZSwgJ2ZhY2UnKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hc2tJbWFnZSA9IGF3YWl0IHRoaXMuX19nZXRJbWFnZUJhc2U2NChhZGRyZXNzLCB0aGlzLk9DUl9JTUdfTUFTS19NT0RFLlRSVUUsIG1hc2tJbWFnZU1vZGUpO1xuICAgICAgICBtYXNrSW1hZ2UgPSBtYXNrSW1hZ2UgPT09ICdkYXRhOicgPyBudWxsIDogbWFza0ltYWdlO1xuICAgICAgICBmYWNlSW1hZ2UgPSB0aGlzLl9fb3B0aW9ucy51c2VGYWNlSW1hZ2VcbiAgICAgICAgICA/IGF3YWl0IHRoaXMuX19nZXRJbWFnZUJhc2U2NChhZGRyZXNzLCBudWxsLCBvcmlnaW5JbWFnZU1vZGUsICdmYWNlJylcbiAgICAgICAgICA6IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IG9yaWdpbkltYWdlLCBtYXNrSW1hZ2UsIGZhY2VJbWFnZSB9O1xuICB9XG5cbiAgX19zdGFydFRydXRoKG9jclR5cGUsIGFkZHJlc3MpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgWywgcmVzdWx0QnVmZmVyXSA9IHRoaXMuX19nZXRCdWZmZXIoKTtcbiAgICAgIGlmIChvY3JUeXBlLmluZGV4T2YoJy1zc2EnKSA+IC0xKSB7XG4gICAgICAgIC8vIFRPRE86IHdvcmtlcuulvCDsgqzsmqntlZjsl6wg66mU7J24KFVJIOuenOuNlOungSkg7Iqk66CI65Oc6rCAIOupiOy2lOyngCDslYrrj4TroZ0g7LKY66asIO2VhOyalCAo7ZiE7J6sIGxvYWRpbmcgVUkg652E7Jqw66m0IOyVoOuLiOuplOydtOyFmCDrqYjstqQpXG4gICAgICAgIC8vIFRPRE86IHNldFRpbWVvdXQg7Jy866GcIOuCmOuIhOuNlOudvOuPhCDtmqjqs7wg7JeG7J2MIHNldFRpbWVvdXQg7KeA7Jqw6rOgLCB3b3JrZXLroZwg67OA6rK9IO2VhOyalFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHRoaXMuX19PQ1JFbmdpbmUuc2NhblRydXRoKGFkZHJlc3MsIHJlc3VsdEJ1ZmZlcikpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignU1NBIE1vZGUgaXMgdHJ1ZS4gYnV0LCBvY3JUeXBlIGlzIGludmFsaWQgOiAnICsgb2NyVHlwZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX19jc3ZUb09iamVjdChzdHIpIHtcbiAgICBsZXQgcGFpcnMgPSBzdHIuc3BsaXQoJzsnKTtcbiAgICBsZXQgb2JqID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcGFpciA9IHBhaXJzW2ldLnNwbGl0KCc6Jyk7XG5cbiAgICAgIGlmIChwYWlyLmxlbmd0aCA9PT0gMikgb2JqW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIF9fc3RyaW5nVG9Kc29uKHN0cikge1xuICAgIGxldCBvYmogPSB7fTtcblxuICAgIGxldCBrZXlWYWx1ZVBhaXJzID0gc3RyLm1hdGNoKC9cXHcrOig/OlxcKFteKV0qXFwpfFteO10qKS9nKTtcbiAgICBpZiAoa2V5VmFsdWVQYWlycykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlWYWx1ZVBhaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBwYWlyID0ga2V5VmFsdWVQYWlyc1tpXS5zcGxpdCgnOicpO1xuICAgICAgICBsZXQga2V5ID0gcGFpclswXS50cmltKCk7XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhaXIuc2xpY2UoMSkuam9pbignOicpLnRyaW0oKTtcblxuICAgICAgICBpZiAodmFsdWUuc3RhcnRzV2l0aCgnKCcpICYmIHZhbHVlLmVuZHNXaXRoKCcpJykpIHtcbiAgICAgICAgICBsZXQgc3ViU3RyID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpOyAvLyDshJzruIwg66y47J6Q7Je0IOy2lOy2nFxuICAgICAgICAgIGxldCBzdWJPYmogPSB0aGlzLl9fc3RyaW5nVG9Kc29uKHN1YlN0cik7IC8vIOyerOq3gOyggeycvOuhnCDshJzruIwg7Jik67iM7KCd7Yq4IOuzgO2ZmFxuICAgICAgICAgIG9ialtrZXldID0gc3ViT2JqO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgX19nZXRNYXNrSW5mbyhhZGRyZXNzKSB7XG4gICAgaWYgKGFkZHJlc3MgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSBpZiAoYWRkcmVzcyA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAnY2hlY2tWYWxpZGF0aW9uIEZhaWwnO1xuICAgIH1cblxuICAgIGNvbnN0IFssICwgbWFza0luZm9SZXN1bHRCdWZdID0gdGhpcy5fX2dldEJ1ZmZlcigpO1xuXG4gICAgbGV0IHJlc3VsdCA9IG51bGw7XG4gICAgcmVzdWx0ID0gdGhpcy5fX09DUkVuZ2luZS5nZXRNYXNrUmVjdChhZGRyZXNzLCBtYXNrSW5mb1Jlc3VsdEJ1Zik7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgfHwgcmVzdWx0ID09PSAnJykge1xuICAgICAgY29uc29sZS5sb2coYHNjYW4gZmFpbC5gKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLl9fZGVzdHJveU1hc2tJbmZvUmVzdWx0QnVmZmVyKCk7XG5cbiAgICByZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHRoaXMuX19jc3ZUb09iamVjdChyZXN1bHQpO1xuICB9XG5cbiAgYXN5bmMgX19zdGFydFRydXRoUmV0cnkob2NyVHlwZSwgYWRkcmVzcywgaW1nRGF0YSkge1xuICAgIGF3YWl0IHRoaXMuX19pc0NhcmRib3hEZXRlY3RlZChhZGRyZXNzLCAwLCBpbWdEYXRhKTtcbiAgICAvLyBhd2FpdCB0aGlzLl9fc3RhcnRSZWNvZ25pdGlvbihhZGRyZXNzLCBvY3JUeXBlLCB0cnVlKTsgICAgICAvLyBmb3Ig7ISx64ql7J2EIOychO2VtCDsp4TtlokgWFxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9fc3RhcnRUcnV0aChvY3JUeXBlLCBhZGRyZXNzKTtcbiAgfVxuXG4gIF9fc2V0Q2FtZXJhUGVybWlzc2lvblRpbWVvdXRUaW1lcigpIHtcbiAgICB0aGlzLl9fY2xlYXJDYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKCk7XG4gICAgdGhpcy5fX2NhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIC8vIDHstIggZGVsYXkg7ZuEIOyLpO2WiVxuICAgICAgYXdhaXQgdGhpcy5fX3Byb2NlZWRDYW1lcmFQZXJtaXNzaW9uKCk7XG4gICAgfSwgdGhpcy5fX29wdGlvbnMuY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlJbnRlcnZhbCk7XG4gIH1cblxuICBhc3luYyBfX3Byb2NlZWRDYW1lcmFQZXJtaXNzaW9uKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9fY2xlYXJDYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKCk7XG4gICAgICBjb25zdCBpc1Bhc3Nwb3J0ID0gdGhpcy5fX29jclR5cGUuaW5jbHVkZXMoJ3Bhc3Nwb3J0Jyk7XG4gICAgICBhd2FpdCB0aGlzLl9fc2V0dXBWaWRlbyhpc1Bhc3Nwb3J0KTtcblxuICAgICAgY29uc3QgeyB2aWRlbyB9ID0gZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKTtcbiAgICAgIGlmICh2aWRlbykge1xuICAgICAgICAvLyBjb25zdCBbdHJhY2tdID0gdGhpcy5fX3N0cmVhbS5nZXRWaWRlb1RyYWNrcygpO1xuICAgICAgICAvLyBjb25zdCBjYXBhYmlsaXR5ID0gdHJhY2suZ2V0Q2FwYWJpbGl0aWVzKCk7XG4gICAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ0NhcmRTY2FuX19pbml0aWFsaXplIGNhcGFiaWxpdHknLCBjYXBhYmlsaXR5KTtcbiAgICAgICAgaWYgKCdzcmNPYmplY3QnIGluIHZpZGVvKSB7XG4gICAgICAgICAgdmlkZW8uc3JjT2JqZWN0ID0gdGhpcy5fX3N0cmVhbTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBBdm9pZCB1c2luZyB0aGlzIGluIG5ldyBicm93c2VycywgYXMgaXQgaXMgZ29pbmcgYXdheS5cbiAgICAgICAgICB2aWRlby5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTCh0aGlzLl9fc3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcbiAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKCdwcm9jZWVkQ2FtZXJhUGVybWlzc2lvbiAtIG9ubG9hZGVkbWV0YWRhdGEnKTtcbiAgICAgICAgICB2aWRlby5wbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2NhbnBsYXknKTtcblxuICAgICAgICAgIC8vIHZpZGVvIGVsZW1lbnQgc3R5bGUg7ISk7KCVXG4gICAgICAgICAgdGhpcy5fX3ZpZGVvT3JpZW50YXRpb24gPSB2aWRlby52aWRlb1dpZHRoIC8gdmlkZW8udmlkZW9IZWlnaHQgPCAxID8gJ3BvcnRyYWl0JyA6ICdsYW5kc2NhcGUnO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ3RoaXMuX19kZXZpY2VJbmZvLm9zU2ltcGxlIDo6ICcgKyB0aGlzLl9fZGV2aWNlSW5mby5vc1NpbXBsZSk7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygndGhpcy5fX3VpT3JpZW50YXRpb24gOjogJyArIHRoaXMuX191aU9yaWVudGF0aW9uKTtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKCd0aGlzLl9fdmlkZW9PcmllbnRhdGlvbiA6OiAnICsgdGhpcy5fX3ZpZGVvT3JpZW50YXRpb24pO1xuXG4gICAgICAgICAgdGhpcy5fX2NhbVNldENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLl9fYWRqdXN0U3R5bGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLlJFQURZKTtcbiAgICAgICAgdmlkZW8ud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk5PVF9SRUFEWSk7XG4gICAgICAgIHRoaXMuX19jbG9zZUNhbWVyYSgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yJywgZS5uYW1lLCBlKTtcbiAgICAgIGlmIChlLm5hbWUgPT09ICdOb3RBbGxvd2VkRXJyb3InKSB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdDYW1lcmEgQWNjZXNzIFBlcm1pc3Npb24gaXMgbm90IGFsbG93ZWQnO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIHRoaXMuX19vbkZhaWx1cmVQcm9jZXNzKCdFNDAzJywgZSwgZXJyb3JNZXNzYWdlKTtcbiAgICAgIH0gZWxzZSBpZiAoZS5uYW1lID09PSAnTm90UmVhZGFibGVFcnJvcicpIHtcbiAgICAgICAgLy8g64uk66W46rOz7JeQ7IScIOy5tOuplOudvCDsnpDsm5DsnYQg7IKs7Jqp7KSRXG4gICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk5PVF9SRUFEWSk7XG4gICAgICAgIHRoaXMuc3RvcFN0cmVhbSgpO1xuICAgICAgICBpZiAodGhpcy5fX29wdGlvbnMuY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlMaW1pdCA8IDApIHtcbiAgICAgICAgICAvLyDsubTrqZTrnbwg66as7IaM7IqkIOyerOyalOyyrSDtmp/siJjsoJztlZwg7JeG7J2MXG4gICAgICAgICAgdGhpcy5fX2NhbWVyYVJlc291cmNlUmV0cnlDb3VudCArPSAxO1xuICAgICAgICAgIHRoaXMuX19zZXRDYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKCk7IC8vIOyerOq3gCDtmLjstpxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5fX29wdGlvbnMuY2FtZXJhUmVzb3VyY2VSZXF1ZXN0UmV0cnlMaW1pdCA+IHRoaXMuX19jYW1lcmFSZXNvdXJjZVJldHJ5Q291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuX19jYW1lcmFSZXNvdXJjZVJldHJ5Q291bnQgKz0gMTtcbiAgICAgICAgICAgIHRoaXMuX19zZXRDYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKCk7IC8vIOyerOq3gCDtmLjstpxcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ0NhbWVyYSBwZXJtaXNzaW9ucyB3ZXJlIGdyYW50ZWQsIGJ1dCBGYWlsZWQgdG8gYWNxdWlyZSBDYW1lcmEgcmVzb3VyY2VzLic7XG4gICAgICAgICAgICB0aGlzLl9fb25GYWlsdXJlUHJvY2VzcygnRTQwMycsIGUsIGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGUubmFtZSA9PT0gJ05vdEZvdW5kRXJyb3InKSB7XG4gICAgICAgIC8vIOq4sOq4sOyXkCDsl7DqsrDrkJwg7Lm066mU65286rCAIOyXhuydjFxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnQ2FtZXJhIE5vdCBGb3VuZCc7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgdGhpcy5fX29uRmFpbHVyZVByb2Nlc3MoJ0U0MDQnLCBlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ1Vua25vd24gRXJyb3IgT2NjdXJlZCc7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgdGhpcy5fX29uRmFpbHVyZVByb2Nlc3MoJ0U5OTknLCBlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9fc2V0U3R5bGUoZWwsIHN0eWxlKSB7XG4gICAgaWYgKGVsICYmIHN0eWxlKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGVsLnN0eWxlLCBzdHlsZSk7XG4gICAgfVxuICB9XG5cbiAgX19jaGFuZ2VPQ1JTdGF0dXModmFsKSB7XG4gICAgc3dpdGNoICh2YWwpIHtcbiAgICAgIC8vIE9DUlxuICAgICAgY2FzZSB0aGlzLklOX1BST0dSRVNTLk5PVF9SRUFEWTpcbiAgICAgICAgdGhpcy5fX29jclN0YXR1cyA9IHRoaXMuT0NSX1NUQVRVUy5OT1RfUkVBRFk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSB0aGlzLklOX1BST0dSRVNTLlJFQURZOlxuICAgICAgICB0aGlzLl9fb2NyU3RhdHVzID0gdGhpcy5PQ1JfU1RBVFVTLlJFQURZO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgdGhpcy5JTl9QUk9HUkVTUy5PQ1JfUkVDT0dOSVpFRDpcbiAgICAgIGNhc2UgdGhpcy5JTl9QUk9HUkVTUy5PQ1JfUkVDT0dOSVpFRF9XSVRIX1NTQTpcbiAgICAgICAgdGhpcy5fX29jclN0YXR1cyA9IHRoaXMuT0NSX1NUQVRVUy5PQ1JfU1VDQ0VTUztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHRoaXMuSU5fUFJPR1JFU1MuT0NSX1NVQ0NFU1M6XG4gICAgICBjYXNlIHRoaXMuSU5fUFJPR1JFU1MuT0NSX1NVQ0NFU1NfV0lUSF9TU0E6XG4gICAgICBjYXNlIHRoaXMuSU5fUFJPR1JFU1MuT0NSX0ZBSUxFRDpcbiAgICAgICAgdGhpcy5fX29jclN0YXR1cyA9IHRoaXMuT0NSX1NUQVRVUy5ET05FO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBhc3luYyBfX2NoYW5nZVN0YWdlKHZhbCwgZm9yY2VVcGRhdGUgPSBmYWxzZSwgcmVjb2duaXplZEltYWdlID0gbnVsbCkge1xuICAgIGlmICh0aGlzLl9fcHJldmlvdXNJblByb2dyZXNzU3RlcCA9PT0gdmFsICYmIGZvcmNlVXBkYXRlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9fY2hhbmdlT0NSU3RhdHVzKHZhbCk7XG4gICAgdGhpcy5fX3ByZXZpb3VzSW5Qcm9ncmVzc1N0ZXAgPSB2YWw7XG4gICAgdGhpcy5fX2luUHJvZ3Jlc3NTdGVwID0gdmFsO1xuXG4gICAgY29uc3QgeyBndWlkZUJveCwgbWFza0JveFdyYXAsIGNhcHR1cmVCdXR0b24gfSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCk7XG5cbiAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgIGJvcmRlcldpZHRoOiB0aGlzLl9fb3B0aW9ucy5mcmFtZUJvcmRlclN0eWxlLndpZHRoICsgJ3B4JyxcbiAgICAgIGJvcmRlclN0eWxlOiB0aGlzLl9fb3B0aW9ucy5mcmFtZUJvcmRlclN0eWxlLnN0eWxlLFxuICAgICAgYm9yZGVyUmFkaXVzOiB0aGlzLl9fb3B0aW9ucy5mcmFtZUJvcmRlclN0eWxlLnJhZGl1cyArICdweCcsXG4gICAgICBib3JkZXJDb2xvcjogdGhpcy5fX29wdGlvbnMuZnJhbWVCb3JkZXJTdHlsZVt2YWxdLFxuICAgIH07XG5cbiAgICBpZiAoZ3VpZGVCb3gpIHtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShndWlkZUJveCwgc3R5bGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VNYXNrRnJhbWVDb2xvckNoYW5nZSkge1xuICAgICAgaWYgKCEhdGhpcy5fX29wdGlvbnMuc2hvd0NsaXBGcmFtZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnTWFza0ZyYW1lQ29sb3JDaGFuZ2UgaXMgc2tpcHBlZCEgKGNhdXNlIDogc2hvd0NsaXBGcmFtZSBvcHRpb24gaXMgdHJ1ZSknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hc2tCb3hXcmFwPy5xdWVyeVNlbGVjdG9yKCcjbWFza0JveE91dGVyJyk/LnNldEF0dHJpYnV0ZSgnZmlsbCcsIHRoaXMuX19vcHRpb25zLm1hc2tGcmFtZVN0eWxlW3ZhbF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VDYXB0dXJlVUkpIHtcbiAgICAgIGNhcHR1cmVCdXR0b25cbiAgICAgICAgPy5xdWVyeVNlbGVjdG9yKCcjY2FwdHVyZUJ1dHRvbicpXG4gICAgICAgID8uc2V0QXR0cmlidXRlKCdmaWxsJywgdGhpcy5fX29wdGlvbnMuY2FwdHVyZUJ1dHRvblN0eWxlWydiYXNlX2NvbG9yJ10pO1xuICAgIH1cblxuICAgIGNvbnN0IG9jck1vZGUgPSB0aGlzLl9faXNTd2l0Y2hUb1NlcnZlck1vZGUgPyAnc2VydmVyJyA6ICd3YXNtJztcblxuICAgIGlmICh0aGlzLl9fb25JblByb2dyZXNzQ2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlVG9wVUkgfHwgdGhpcy5fX29wdGlvbnMudXNlVG9wVUlUZXh0TXNnKSB7XG4gICAgICAgIHRoaXMuX19vbkluUHJvZ3Jlc3NDaGFuZ2UuY2FsbChcbiAgICAgICAgICB0aGlzLFxuICAgICAgICAgIG9jck1vZGUsXG4gICAgICAgICAgdGhpcy5fX29jclR5cGUsXG4gICAgICAgICAgdGhpcy5fX2luUHJvZ3Jlc3NTdGVwLFxuICAgICAgICAgIHRoaXMuX190b3BVSSxcbiAgICAgICAgICAndG9wJyxcbiAgICAgICAgICB0aGlzLl9fb3B0aW9ucy51c2VUb3BVSVRleHRNc2csXG4gICAgICAgICAgdGhpcy5fX29wdGlvbnMudXNlQ2FwdHVyZVVJLFxuICAgICAgICAgIHRoaXMuX19vcHRpb25zLnVzZVByZXZpZXdVSSxcbiAgICAgICAgICByZWNvZ25pemVkSW1hZ2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VNaWRkbGVVSSB8fCB0aGlzLl9fb3B0aW9ucy51c2VNaWRkbGVVSVRleHRNc2cpIHtcbiAgICAgICAgdGhpcy5fX29uSW5Qcm9ncmVzc0NoYW5nZS5jYWxsKFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgb2NyTW9kZSxcbiAgICAgICAgICB0aGlzLl9fb2NyVHlwZSxcbiAgICAgICAgICB0aGlzLl9faW5Qcm9ncmVzc1N0ZXAsXG4gICAgICAgICAgdGhpcy5fX21pZGRsZVVJLFxuICAgICAgICAgICdtaWRkbGUnLFxuICAgICAgICAgIHRoaXMuX19vcHRpb25zLnVzZU1pZGRsZVVJVGV4dE1zZyxcbiAgICAgICAgICB0aGlzLl9fb3B0aW9ucy51c2VDYXB0dXJlVUksXG4gICAgICAgICAgdGhpcy5fX29wdGlvbnMudXNlUHJldmlld1VJLFxuICAgICAgICAgIHJlY29nbml6ZWRJbWFnZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZUJvdHRvbVVJIHx8IHRoaXMuX19vcHRpb25zLnVzZUJvdHRvbVVJVGV4dE1zZykge1xuICAgICAgICB0aGlzLl9fb25JblByb2dyZXNzQ2hhbmdlLmNhbGwoXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBvY3JNb2RlLFxuICAgICAgICAgIHRoaXMuX19vY3JUeXBlLFxuICAgICAgICAgIHRoaXMuX19pblByb2dyZXNzU3RlcCxcbiAgICAgICAgICB0aGlzLl9fYm90dG9tVUksXG4gICAgICAgICAgJ2JvdHRvbScsXG4gICAgICAgICAgdGhpcy5fX29wdGlvbnMudXNlQm90dG9tVUlUZXh0TXNnLFxuICAgICAgICAgIHRoaXMuX19vcHRpb25zLnVzZUNhcHR1cmVVSSxcbiAgICAgICAgICB0aGlzLl9fb3B0aW9ucy51c2VQcmV2aWV3VUksXG4gICAgICAgICAgcmVjb2duaXplZEltYWdlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZhbCA9PT0gdGhpcy5JTl9QUk9HUkVTUy5NQU5VQUxfQ0FQVFVSRV9TVUNDRVNTIHx8IHZhbCA9PT0gdGhpcy5JTl9QUk9HUkVTUy5NQU5VQUxfQ0FQVFVSRV9GQUlMRUQpIHtcbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VQcmV2aWV3VUkpIHtcbiAgICAgICAgdGhpcy5fX3VwZGF0ZVByZXZpZXdVSShyZWNvZ25pemVkSW1hZ2UpO1xuXG4gICAgICAgIC8vIEZBSUzsnbgg6rK97JqwIDXstIjtm4Qg7J6Q64+Z7J2EIOywveuLq+ydjFxuICAgICAgICBpZiAodmFsID09PSB0aGlzLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX0ZBSUxFRCkge1xuICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5fX2hpZGVQcmV2aWV3VUksIDMwMDAsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZhbCA9PT0gdGhpcy5JTl9QUk9HUkVTUy5PQ1JfUkVDT0dOSVpFRF9XSVRIX1NTQSkge1xuICAgICAgY29uc3QgeyB2aWRlbyB9ID0gZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKTtcbiAgICAgIHRoaXMuX19zZXRTdHlsZSh2aWRlbywgeyBkaXNwbGF5OiAnbm9uZScgfSk7XG5cbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VQcmV2aWV3VUkpIHtcbiAgICAgICAgdGhpcy5fX3VwZGF0ZVByZXZpZXdVSShyZWNvZ25pemVkSW1hZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2YWwgPT09IHRoaXMuSU5fUFJPR1JFU1MuT0NSX1NVQ0NFU1NfV0lUSF9TU0EpIHtcbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VQcmV2aWV3VUkpIHtcbiAgICAgICAgdGhpcy5fX2hpZGVQcmV2aWV3VUkoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLl9fc2xlZXAoMSk7IC8vIGZvciBVSSB1cGRhdGVcbiAgfVxuXG4gIF9fdXBkYXRlUHJldmlld1VJKHJlY29nbml6ZWRJbWFnZSkge1xuICAgIGNvbnN0IHsgcHJldmlld1VJV3JhcCwgcHJldmlld0ltYWdlIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuICAgIHByZXZpZXdJbWFnZS5zcmMgPSByZWNvZ25pemVkSW1hZ2U7XG5cbiAgICBjb25zdCBpbWdTdHlsZSA9IHtcbiAgICAgICdtYXgtd2lkdGgnOiAnNzAlJyxcbiAgICAgICdtYXgtaGVpZ2h0JzogJzYwJScsXG4gICAgfTtcbiAgICB0aGlzLl9fc2V0U3R5bGUocHJldmlld0ltYWdlLCBpbWdTdHlsZSk7XG4gICAgdGhpcy5fX3NldFN0eWxlKHByZXZpZXdVSVdyYXAsIHsgZGlzcGxheTogJ2ZsZXgnIH0pO1xuICB9XG5cbiAgX19oaWRlUHJldmlld1VJKGNvbnRleHQpIHtcbiAgICBsZXQgX3RoaXNfID0gdGhpcztcbiAgICBpZiAoY29udGV4dCkge1xuICAgICAgX3RoaXNfID0gY29udGV4dDtcbiAgICB9XG4gICAgY29uc3QgeyB2aWRlbywgcHJldmlld1VJV3JhcCwgcHJldmlld0ltYWdlIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuICAgIF90aGlzXy5fX3NldFN0eWxlKHZpZGVvLCB7IGRpc3BsYXk6ICdibG9jaycgfSk7XG4gICAgX3RoaXNfLl9fc2V0U3R5bGUocHJldmlld1VJV3JhcCwgeyBkaXNwbGF5OiAnbm9uZScgfSk7XG4gICAgcHJldmlld0ltYWdlLnNyYyA9ICcnO1xuICB9XG5cbiAgYXN5bmMgX19nZXRJbnB1dERldmljZXMoKSB7XG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcyBpcyBub3Qgc3VwcG9ydGVkXG4gICAgaWYgKCFuYXZpZ2F0b3IubWVkaWFEZXZpY2VzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ25hdmlnYXRvci5tZWRpYURldmljZXMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbiAgICBjb25zdCBkZXZpY2VzID0gYXdhaXQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKCk7XG4gICAgbGV0IGNhbWVyYSA9IFtdO1xuICAgIGZvciAoY29uc3QgZGV2aWNlIG9mIGRldmljZXMpIHtcbiAgICAgIGlmIChkZXZpY2Uua2luZCA9PT0gJ3ZpZGVvaW5wdXQnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGRldmljZSBpbnN0YW5jZW9mIElucHV0RGV2aWNlSW5mbykge1xuICAgICAgICAgICAgaWYgKGRldmljZS5nZXRDYXBhYmlsaXRpZXMpIHtcbiAgICAgICAgICAgICAgY29uc3QgY2FwID0gZGV2aWNlLmdldENhcGFiaWxpdGllcygpO1xuICAgICAgICAgICAgICBpZiAoY2FwPy5mYWNpbmdNb2RlPy5pbmNsdWRlcyh0aGlzLl9fZmFjaW5nTW9kZUNvbnN0cmFpbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNVbHRyYUNhbWVyYVJlZyA9IC91bHRyYXzsmrjtirjrnbwvZ2k7XG4gICAgICAgICAgICAgICAgaWYgKGlzVWx0cmFDYW1lcmFSZWcudGVzdChkZXZpY2UubGFiZWw/LnRvTG93ZXJDYXNlKCkpKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYW1lcmEucHVzaChjYXAuZGV2aWNlSWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaU9TIDE3IOuvuOunjOydmCBjaHJvbWUsIHNhZmFyaSDsl5DshJzripRcbiAgICAgICAgICAvLyBJbnB1dERldmljZUluZm8g6rCd7LK06rCAIOyXhuyWtOyEnCBnZXRDYXBhYmlsaXRpZXPrpbwg7ZmV7J247ZWgIOyImCDsl4bquLAg65WM66y47JeQXG4gICAgICAgICAgLy8gZGV2aWNlIGxhYmVs66eMIOuztOqzoCDtm4TrqbQg7Lm066mU652866GcIOyCrOyaqVxuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUmVmZXJlbmNlRXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzQmFja0NhbWVyYVJlZyA9IC9iYWNrfO2bhOuptC9nO1xuICAgICAgICAgICAgaWYgKGRldmljZS5sYWJlbD8ubGVuZ3RoICYmIGlzQmFja0NhbWVyYVJlZy50ZXN0KGRldmljZS5sYWJlbCkpIHtcbiAgICAgICAgICAgICAgY2FtZXJhLnB1c2goZGV2aWNlLmRldmljZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fX2RlYnVnKGBjYW1lcmEgPSAke2NhbWVyYX0sIGNhbWVyYS5sZW5ndGggPSAke2NhbWVyYS5sZW5ndGh9YCk7XG4gICAgcmV0dXJuIGNhbWVyYTtcbiAgfVxuXG4gIGNoZWNrVUlPcmllbnRhdGlvbigpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gZGV0ZWN0b3IuZ2V0VUlPcmllbnRhdGlvbihkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpLm9jcik7XG4gICAgbGV0IGlzQ2hhbmdlZCA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50ICE9PSB0aGlzLl9fcHJldlVpT3JpZW50YXRpb24pIHtcbiAgICAgIHRoaXMuX191aU9yaWVudGF0aW9uID0gY3VycmVudDtcbiAgICAgIHRoaXMuX19wcmV2VWlPcmllbnRhdGlvbiA9IGN1cnJlbnQ7XG4gICAgICBpc0NoYW5nZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4geyBjdXJyZW50LCBpc0NoYW5nZWQgfTtcbiAgfVxuXG4gIF9fY2xlYXJDdXN0b21VSShvYmopIHtcbiAgICBvYmouaW5uZXJIVE1MID0gJyc7XG4gICAgb2JqLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICBvYmoucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgIHRoaXMuX19zZXRTdHlsZShvYmosIHsgZGlzcGxheTogJ25vbmUnIH0pO1xuICB9XG5cbiAgYXN5bmMgX19zZXR1cERvbUVsZW1lbnRzKCkge1xuICAgIGxldCB7XG4gICAgICBvY3IsXG4gICAgICB2aWRlbyxcbiAgICAgIGNhbnZhcyxcbiAgICAgIHJvdGF0aW9uQ2FudmFzLFxuICAgICAgZ3VpZGVCb3gsXG4gICAgICB2aWRlb1dyYXAsXG4gICAgICBndWlkZUJveFdyYXAsXG4gICAgICBtYXNrQm94V3JhcCxcbiAgICAgIHByZXZlbnRUb0ZyZWV6ZVZpZGVvLFxuICAgICAgY3VzdG9tVUlXcmFwLFxuICAgICAgdG9wVUksXG4gICAgICBtaWRkbGVVSSxcbiAgICAgIGJvdHRvbVVJLFxuICAgICAgY2FwdHVyZVVJV3JhcCxcbiAgICAgIGNhcHR1cmVVSSxcbiAgICAgIGNhcHR1cmVCdXR0b24sXG4gICAgICBwcmV2aWV3VUlXcmFwLFxuICAgICAgcHJldmlld1VJLFxuICAgICAgcHJldmlld0ltYWdlLFxuICAgICAgc3dpdGNoVUlXcmFwLFxuICAgICAgc3dpdGNoVUksXG4gICAgICBwcmVsb2FkaW5nVUlXcmFwLFxuICAgICAgcHJlbG9hZGluZ1VJLFxuICAgIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuXG4gICAgaWYgKCFvY3IpIHRocm93IG5ldyBFcnJvcignb2NyIGRpdiBlbGVtZW50IGlzIG5vdCBleGlzdCcpO1xuXG4gICAgaWYgKHZpZGVvV3JhcCkgdmlkZW9XcmFwLnJlbW92ZSgpO1xuICAgIGlmIChndWlkZUJveFdyYXApIGd1aWRlQm94V3JhcC5yZW1vdmUoKTtcbiAgICBpZiAodmlkZW8pIHZpZGVvLnJlbW92ZSgpO1xuICAgIGlmIChjYW52YXMpIGNhbnZhcy5yZW1vdmUoKTtcbiAgICBpZiAocm90YXRpb25DYW52YXMpIHJvdGF0aW9uQ2FudmFzLnJlbW92ZSgpO1xuICAgIGlmIChndWlkZUJveCkgZ3VpZGVCb3gucmVtb3ZlKCk7XG4gICAgaWYgKG1hc2tCb3hXcmFwKSBtYXNrQm94V3JhcC5yZW1vdmUoKTtcbiAgICBpZiAocHJldmVudFRvRnJlZXplVmlkZW8pIHByZXZlbnRUb0ZyZWV6ZVZpZGVvLnJlbW92ZSgpO1xuICAgIGlmIChjdXN0b21VSVdyYXApIGN1c3RvbVVJV3JhcC5yZW1vdmUoKTtcbiAgICAvLyDqsIEgdG9wLCBtaWRkbGUsIGJvdHRvbSBVSeulvCDrr7jsgqzsmqnsnbwg6rK97JqwIOyViOydmCDrgrTsmqnsnYQg7IKt7KCcXG4gICAgaWYgKHRvcFVJICYmICF0aGlzLl9fb3B0aW9ucy51c2VUb3BVSSkgdGhpcy5fX2NsZWFyQ3VzdG9tVUkodG9wVUkpO1xuICAgIGlmIChtaWRkbGVVSSAmJiAhdGhpcy5fX29wdGlvbnMudXNlTWlkZGxlVUkpIHRoaXMuX19jbGVhckN1c3RvbVVJKG1pZGRsZVVJKTtcbiAgICBpZiAoYm90dG9tVUkgJiYgIXRoaXMuX19vcHRpb25zLnVzZUJvdHRvbVVJKSB0aGlzLl9fY2xlYXJDdXN0b21VSShib3R0b21VSSk7XG4gICAgaWYgKGNhcHR1cmVVSVdyYXApIGNhcHR1cmVVSVdyYXAucmVtb3ZlKCk7XG4gICAgLy8gY2FwdHVyZSBVSeulvCDrr7jsgqzsmqnsnbwg6rK97JqwIOyViOydmCDrgrTsmqnsnYQg7IKt7KCcXG4gICAgaWYgKGNhcHR1cmVVSSAmJiAhdGhpcy5fX29wdGlvbnMudXNlQ2FwdHVyZVVJKSB0aGlzLl9fY2xlYXJDdXN0b21VSShjYXB0dXJlVUkpO1xuICAgIGlmIChwcmV2aWV3VUlXcmFwKSBwcmV2aWV3VUlXcmFwLnJlbW92ZSgpO1xuICAgIC8vIHByZXZpZXcgVUnrpbwg66+47IKs7Jqp7J28IOqyveyasCDslYjsnZgg64K07Jqp7J2EIOyCreygnFxuICAgIGlmIChwcmV2aWV3VUkgJiYgIXRoaXMuX19vcHRpb25zLnVzZVByZXZpZXdVSSkgdGhpcy5fX2NsZWFyQ3VzdG9tVUkocHJldmlld1VJKTtcbiAgICBpZiAoc3dpdGNoVUlXcmFwKSBzd2l0Y2hVSVdyYXAucmVtb3ZlKCk7XG4gICAgLy8gc3dpdGNoIFVJ66W8IOuvuOyCrOyaqeydvCDqsr3smrAg7JWI7J2YIOuCtOyaqeydhCDsgq3soJxcbiAgICBpZiAoc3dpdGNoVUkgJiYgIXRoaXMuX19vcHRpb25zLnVzZU1hbnVhbFN3aXRjaFRvU2VydmVyTW9kZSkgdGhpcy5fX2NsZWFyQ3VzdG9tVUkoc3dpdGNoVUkpO1xuICAgIGlmIChwcmVsb2FkaW5nVUlXcmFwKSBwcmVsb2FkaW5nVUlXcmFwLnJlbW92ZSgpO1xuXG4gICAgY29uc3Qgcm90YXRpb25EZWdyZWUgPSB0aGlzLl9fZ2V0Um90YXRpb25EZWdyZWUoKTtcbiAgICB0aGlzLl9faXNSb3RhdGVkOTBvcjI3MCA9IFs5MCwgMjcwXS5pbmNsdWRlcyhyb3RhdGlvbkRlZ3JlZSk7XG5cbiAgICBsZXQgb2NyU3R5bGUgPSB7XG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgfTtcbiAgICB0aGlzLl9fc2V0U3R5bGUob2NyLCBvY3JTdHlsZSk7XG5cbiAgICBjb25zdCB3cmFwU3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGRpc3BsYXk6ICdmbGV4JywgLy8gdmVydGljYWwgYWxpZ24gbWlkZGxlXG4gICAgICAnYWxpZ24taXRlbXMnOiAnY2VudGVyJyxcbiAgICAgICdqdXN0aWZ5LWNvbnRlbnQnOiAnY2VudGVyJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIG1hcmdpbjogJzAgYXV0bycsXG4gICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgfTtcblxuICAgIHZpZGVvV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZpZGVvV3JhcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAndmlkZW9XcmFwJyk7XG4gICAgaWYgKHZpZGVvV3JhcCkge1xuICAgICAgd2hpbGUgKHZpZGVvV3JhcC5maXJzdENoaWxkKSB7XG4gICAgICAgIHZpZGVvV3JhcC5yZW1vdmVDaGlsZCh2aWRlb1dyYXAubGFzdENoaWxkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19zZXRTdHlsZSh2aWRlb1dyYXAsIHdyYXBTdHlsZSk7XG4gICAgfVxuICAgIG9jci5hcHBlbmRDaGlsZCh2aWRlb1dyYXApO1xuXG4gICAgbWFza0JveFdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdmcnKTtcbiAgICBtYXNrQm94V3JhcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAnbWFza0JveFdyYXAnKTtcbiAgICBtYXNrQm94V3JhcC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgIG1hc2tCb3hXcmFwLnNldEF0dHJpYnV0ZSgneG1sbnMnLCAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnKTtcbiAgICB0aGlzLl9fc2V0U3R5bGUobWFza0JveFdyYXAsIHdyYXBTdHlsZSk7XG5cbiAgICBsZXQgbWFza19mcmFtZSA9IHRoaXMuX19vcHRpb25zLm1hc2tGcmFtZVN0eWxlLmJhc2VfY29sb3IgKyAnZmYnO1xuICAgIGlmICghIXRoaXMuX19vcHRpb25zLnNob3dDbGlwRnJhbWUpIHtcbiAgICAgIG1hc2tfZnJhbWUgPSB0aGlzLl9fb3B0aW9ucy5tYXNrRnJhbWVTdHlsZS5jbGlwX2ZyYW1lICsgJzU1JztcbiAgICB9XG5cbiAgICBtYXNrQm94V3JhcC5pbm5lckhUTUwgPVxuICAgICAgJycgK1xuICAgICAgXCIgIDxzdmcgaWQ9J21hc2tCb3hDb250YWluZXInIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+XFxuXCIgK1xuICAgICAgXCIgICAgPG1hc2sgaWQ9J21hc2stcmVjdCc+XFxuXCIgK1xuICAgICAgXCIgICAgICA8cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSd3aGl0ZSc+PC9yZWN0PlxcblwiICtcbiAgICAgIFwiICAgICAgPHN2ZyB4PSc1MCUnIHk9JzUwJScgb3ZlcmZsb3c9J3Zpc2libGUnPlxcblwiICtcbiAgICAgIFwiICAgICAgICAgIDxyZWN0IGlkPSdtYXNrQm94SW5uZXInXFxuXCIgK1xuICAgICAgXCIgICAgICAgICAgICB3aWR0aD0nNDAwJyBoZWlnaHQ9JzI2MCdcXG5cIiArXG4gICAgICBcIiAgICAgICAgICAgIHg9Jy0yMDAnIHk9Jy0xMzAnXFxuXCIgK1xuICAgICAgXCIgICAgICAgICAgICByeD0nMTAnIHJ5PScxMCdcXG5cIiArXG4gICAgICBcIiAgICAgICAgICAgIGZpbGw9J2JsYWNrJyBzdHJva2U9J2JsYWNrJz48L3JlY3Q+XFxuXCIgK1xuICAgICAgJyAgICAgIDwvc3ZnPlxcbicgK1xuICAgICAgJyAgICA8L21hc2s+XFxuJyArXG4gICAgICBcIiAgICA8cmVjdCBpZD0nbWFza0JveE91dGVyJ1xcblwiICtcbiAgICAgIFwiICAgICAgICAgIHg9JzAnIHk9JzAnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnXFxuXCIgK1xuICAgICAgXCIgICAgICAgICAgZmlsbD0nXCIgK1xuICAgICAgbWFza19mcmFtZSArXG4gICAgICBcIicgbWFzaz0ndXJsKCNtYXNrLXJlY3QpJz48L3JlY3Q+XFxuXCIgK1xuICAgICAgJyAgPC9zdmc+JztcbiAgICBvY3IuYXBwZW5kQ2hpbGQobWFza0JveFdyYXApO1xuXG4gICAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIHZpZGVvLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICd2aWRlbycpO1xuICAgIHZpZGVvLnNldEF0dHJpYnV0ZSgnYXV0b3BsYXknLCAndHJ1ZScpO1xuICAgIHZpZGVvLnNldEF0dHJpYnV0ZSgnbXV0ZWQnLCAndHJ1ZScpO1xuICAgIHZpZGVvLnNldEF0dHJpYnV0ZSgncGxheXNpbmxpbmUnLCAndHJ1ZScpO1xuXG4gICAgbGV0IHZpZGVvU3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgfTtcblxuICAgIGNvbnN0IHJvdGF0ZUNzcyA9ICdyb3RhdGUoJyArIHJvdGF0aW9uRGVncmVlICsgJ2RlZyknO1xuICAgIGNvbnN0IG1pcnJvckNzcyA9ICdyb3RhdGVZKDE4MGRlZyknO1xuICAgIGNvbnN0IHJvdGF0ZUFuZE1pcnJvckNzcyA9IG1pcnJvckNzcyArICcgJyArIHJvdGF0ZUNzcztcblxuICAgIGlmICh0aGlzLl9faXNSb3RhdGVkOTBvcjI3MCkge1xuICAgICAgaWYgKHRoaXMuX19nZXRNaXJyb3JNb2RlKCkpIHtcbiAgICAgICAgdmlkZW9TdHlsZSA9IHtcbiAgICAgICAgICAuLi52aWRlb1N0eWxlLFxuICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHJvdGF0ZUFuZE1pcnJvckNzcyxcbiAgICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiByb3RhdGVBbmRNaXJyb3JDc3MsXG4gICAgICAgICAgJy1vLXRyYW5zZm9ybSc6IHJvdGF0ZUFuZE1pcnJvckNzcyxcbiAgICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHJvdGF0ZUFuZE1pcnJvckNzcyxcbiAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZUFuZE1pcnJvckNzcyxcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZGVvU3R5bGUgPSB7XG4gICAgICAgICAgLi4udmlkZW9TdHlsZSxcbiAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiByb3RhdGVDc3MsXG4gICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogcm90YXRlQ3NzLFxuICAgICAgICAgICctby10cmFuc2Zvcm0nOiByb3RhdGVDc3MsXG4gICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiByb3RhdGVDc3MsXG4gICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGVDc3MsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9fZ2V0TWlycm9yTW9kZSgpKSB7XG4gICAgICAgIHZpZGVvU3R5bGUgPSB7XG4gICAgICAgICAgLi4udmlkZW9TdHlsZSxcbiAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiBtaXJyb3JDc3MsXG4gICAgICAgICAgJy1tb3otdHJhbnNmb3JtJzogbWlycm9yQ3NzLFxuICAgICAgICAgICctby10cmFuc2Zvcm0nOiBtaXJyb3JDc3MsXG4gICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiBtaXJyb3JDc3MsXG4gICAgICAgICAgdHJhbnNmb3JtOiBtaXJyb3JDc3MsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX19zZXRTdHlsZSh2aWRlbywgdmlkZW9TdHlsZSk7XG4gICAgdmlkZW9XcmFwLmFwcGVuZENoaWxkKHZpZGVvKTtcblxuICAgIGd1aWRlQm94V3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGd1aWRlQm94V3JhcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAnZ3VpZGVCb3hXcmFwJyk7XG4gICAgdGhpcy5fX3NldFN0eWxlKGd1aWRlQm94V3JhcCwgd3JhcFN0eWxlKTtcbiAgICBvY3IuYXBwZW5kQ2hpbGQoZ3VpZGVCb3hXcmFwKTtcblxuICAgIGd1aWRlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3ZnJyk7XG4gICAgZ3VpZGVCb3guc2V0QXR0cmlidXRlKCdkYXRhLXVzZWItb2NyJywgJ2d1aWRlQm94Jyk7XG4gICAgZ3VpZGVCb3guc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICBndWlkZUJveC5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyk7XG4gICAgdGhpcy5fX3NldFN0eWxlKGd1aWRlQm94LCB7XG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIH0pO1xuXG4gICAgZ3VpZGVCb3hXcmFwLmFwcGVuZENoaWxkKGd1aWRlQm94KTtcblxuICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAnY2FudmFzJyk7XG5cbiAgICBjb25zdCBjYW52YXNTdHlsZSA9IHtcbiAgICAgIGRpc3BsYXk6IHRoaXMuX19vcHRpb25zLnNob3dDYW52YXNQcmV2aWV3ID8gKHRoaXMuX19pc1JvdGF0ZWQ5MG9yMjcwID8gJ25vbmUnIDogJ2Rpc3BsYXknKSA6ICdub25lJyxcbiAgICAgIHdpZHRoOiAnMjUlJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgbGVmdDogJzBweCcsXG4gICAgICB0b3A6ICczMHB4JyxcbiAgICAgIGJvcmRlcjogJ2dyZWVuIDJweCBzb2xpZCcsXG4gICAgfTtcbiAgICB0aGlzLl9fc2V0U3R5bGUoY2FudmFzLCBjYW52YXNTdHlsZSk7XG5cbiAgICBvY3IuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICAgIHJvdGF0aW9uQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgcm90YXRpb25DYW52YXMuc2V0QXR0cmlidXRlKCdkYXRhLXVzZWItb2NyJywgJ3JvdGF0aW9uQ2FudmFzJyk7XG5cbiAgICB0aGlzLl9fc2V0U3R5bGUocm90YXRpb25DYW52YXMsIHtcbiAgICAgIGRpc3BsYXk6IHRoaXMuX19vcHRpb25zLnNob3dDYW52YXNQcmV2aWV3ID8gKHRoaXMuX19pc1JvdGF0ZWQ5MG9yMjcwID8gJ2Rpc3BsYXknIDogJ25vbmUnKSA6ICdub25lJyxcbiAgICAgIGhlaWdodDogJzI1JScsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHJpZ2h0OiAnMHB4JyxcbiAgICAgIHRvcDogJzMwcHgnLFxuICAgICAgYm9yZGVyOiAnYmx1ZSAycHggc29saWQnLFxuICAgIH0pO1xuICAgIG9jci5hcHBlbmRDaGlsZChyb3RhdGlvbkNhbnZhcyk7XG5cbiAgICBwcmV2ZW50VG9GcmVlemVWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByZXZlbnRUb0ZyZWV6ZVZpZGVvLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdwcmV2ZW50VG9GcmVlemVWaWRlbycpO1xuICAgIHRoaXMuX19zZXRTdHlsZShwcmV2ZW50VG9GcmVlemVWaWRlbywge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3R0b206ICcxMCcsXG4gICAgICByaWdodDogJzEwJyxcbiAgICB9KTtcblxuICAgIHByZXZlbnRUb0ZyZWV6ZVZpZGVvLmlubmVySFRNTCA9XG4gICAgICAnJyArXG4gICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgc3R5bGU9XCJtYXJnaW46IGF1dG87IGJhY2tncm91bmQ6IG5vbmU7IGRpc3BsYXk6IGJsb2NrOyBzaGFwZS1yZW5kZXJpbmc6IGF1dG87XCIgd2lkdGg9XCIzMnB4XCIgaGVpZ2h0PVwiMzJweFwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiPlxcbicgK1xuICAgICAgJyAgPGNpcmNsZSBjeD1cIjg0XCIgY3k9XCI1MFwiIHI9XCIxMFwiIGZpbGw9XCIjODY4Njg2MDBcIj5cXG4nICtcbiAgICAgICcgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cInJcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIwLjU1NTU1NTU1NTU1NTU1NTZzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MVwiIHZhbHVlcz1cIjEwOzBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDFcIiBiZWdpbj1cIjBzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCIga2V5VGltZXM9XCIwOzAuMjU7MC41OzAuNzU7MVwiIHZhbHVlcz1cIiM4Njg2ODYwMDsjODY4Njg2MDA7Izg2ODY4NjAwOyM4Njg2ODYwMDsjODY4Njg2MDBcIiBiZWdpbj1cIjBzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAnICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjUwXCIgcj1cIjEwXCIgZmlsbD1cIiM4Njg2ODYwMFwiPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIwOzA7MTA7MTA7MTBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIjBzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIjBzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAnICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjEwXCIgZmlsbD1cIiM4Njg2ODYwMFwiPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIwOzA7MTA7MTA7MTBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0wLjU1NTU1NTU1NTU1NTU1NTZzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0wLjU1NTU1NTU1NTU1NTU1NTZzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAnICA8Y2lyY2xlIGN4PVwiODRcIiBjeT1cIjUwXCIgcj1cIjEwXCIgZmlsbD1cIiM4Njg2ODYwMFwiPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIwOzA7MTA7MTA7MTBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0xLjExMTExMTExMTExMTExMTJzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0xLjExMTExMTExMTExMTExMTJzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAnICA8Y2lyY2xlIGN4PVwiMTZcIiBjeT1cIjUwXCIgcj1cIjEwXCIgZmlsbD1cIiM4Njg2ODYwMFwiPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIwOzA7MTA7MTA7MTBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0xLjY2NjY2NjY2NjY2NjY2NjVzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0xLjY2NjY2NjY2NjY2NjY2NjVzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAnPC9zdmc+JztcblxuICAgIG9jci5hcHBlbmRDaGlsZChwcmV2ZW50VG9GcmVlemVWaWRlbyk7XG5cbiAgICBjdXN0b21VSVdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjdXN0b21VSVdyYXAuc2V0QXR0cmlidXRlKCdkYXRhLXVzZWItb2NyJywgJ2N1c3RvbVVJV3JhcCcpO1xuICAgIGNvbnN0IGN1c3RvbVVJV3JhcFN0eWxlID0geyAuLi53cmFwU3R5bGUsICdmbGV4LWRpcmVjdGlvbic6ICdjb2x1bW4nIH07XG4gICAgdGhpcy5fX3NldFN0eWxlKGN1c3RvbVVJV3JhcCwgY3VzdG9tVUlXcmFwU3R5bGUpO1xuICAgIG9jci5hcHBlbmRDaGlsZChjdXN0b21VSVdyYXApO1xuXG4gICAgLy8g6rCBIHRvcCwgbWlkZGxlLCBib3R0b20gVUkg7IKs7JqpKHVzZSnsl6zrtoDsmYAg6rSA6rOE7JeG7J20IOyYgeyXreydhCDsnqHquLAg7JyE7ZW0LCBkaXbqsIAg7JeG7Jy866m0IOyDneyEsVxuICAgIC8vIGFkanVzdFN0eWxlKCkg7JeQ7IScIOyEuOu2gOyggeyduCDsgqzsnbTspojsmYAg7JyE7LmY6rCSIOuPmeyggeycvOuhnCDshKTsoJXrkKguXG4gICAgaWYgKCF0b3BVSSkge1xuICAgICAgdG9wVUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRvcFVJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICd0b3BVSScpO1xuICAgIH1cbiAgICBjdXN0b21VSVdyYXAuYXBwZW5kQ2hpbGQodG9wVUkpO1xuXG4gICAgaWYgKCFtaWRkbGVVSSkge1xuICAgICAgbWlkZGxlVUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG1pZGRsZVVJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdtaWRkbGVVSScpO1xuICAgIH1cbiAgICBjdXN0b21VSVdyYXAuYXBwZW5kQ2hpbGQobWlkZGxlVUkpO1xuXG4gICAgaWYgKCFib3R0b21VSSkge1xuICAgICAgYm90dG9tVUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGJvdHRvbVVJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdib3R0b21VSScpO1xuICAgIH1cbiAgICBjdXN0b21VSVdyYXAuYXBwZW5kQ2hpbGQoYm90dG9tVUkpO1xuXG4gICAgY2FwdHVyZVVJV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNhcHR1cmVVSVdyYXAuc2V0QXR0cmlidXRlKCdkYXRhLXVzZWItb2NyJywgJ2NhcHR1cmVVSVdyYXAnKTtcbiAgICBjb25zdCBjYXB0dXJlVUlXcmFwU3R5bGUgPSB7IC4uLndyYXBTdHlsZSwgJ2ZsZXgtZGlyZWN0aW9uJzogJ2NlbnRlcicgfTtcbiAgICB0aGlzLl9fc2V0U3R5bGUoY2FwdHVyZVVJV3JhcCwgY2FwdHVyZVVJV3JhcFN0eWxlKTtcbiAgICBvY3IuYXBwZW5kQ2hpbGQoY2FwdHVyZVVJV3JhcCk7XG5cbiAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlQ2FwdHVyZVVJKSB7XG4gICAgICBpZiAodGhpcy5fX2lzU3dpdGNoVG9TZXJ2ZXJNb2RlIHx8IHRoaXMuX19vcHRpb25zLnVzZUZvcmNlQ29tcGxldGVVSSkge1xuICAgICAgICBpZiAoIWNhcHR1cmVVSSkge1xuICAgICAgICAgIGNhcHR1cmVVSSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgIGNhcHR1cmVVSS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAnY2FwdHVyZVVJJyk7XG4gICAgICAgICAgdGhpcy5fX3NldFN0eWxlKGNhcHR1cmVVSSwge1xuICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNhcHR1cmVCdXR0b24pIHtcbiAgICAgICAgICBjYXB0dXJlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgY2FwdHVyZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAnY2FwdHVyZUJ1dHRvbicpO1xuICAgICAgICAgIGxldCBjYXB0dXJlQnV0dG9uU3JjU1ZHID0gYGA7XG4gICAgICAgICAgY2FwdHVyZUJ1dHRvblNyY1NWRyArPSBgPHN2ZyB3aWR0aD0nODAnIGhlaWdodD0nODAnIHZpZXdCb3g9JzAgMCA4MCA4MCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz5gO1xuICAgICAgICAgIGNhcHR1cmVCdXR0b25TcmNTVkcgKz0gYCAgPGNpcmNsZSBpZD0nY2FwdHVyZUJ1dHRvbicgY3g9JzQwJyBjeT0nNDAnIHI9JzM4JyBmaWxsPScjNTU1NTU1JyBzdHJva2U9JyNmZmZmZmYnIHN0cm9rZS13aWR0aD0nNCcvPmA7XG4gICAgICAgICAgY2FwdHVyZUJ1dHRvblNyY1NWRyArPSBgPC9zdmc+YDtcbiAgICAgICAgICBjYXB0dXJlQnV0dG9uLmlubmVySFRNTCA9IGNhcHR1cmVCdXR0b25TcmNTVkc7XG4gICAgICAgICAgY2FwdHVyZVVJLmFwcGVuZENoaWxkKGNhcHR1cmVCdXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIGNhcHR1cmVVSVdyYXAuYXBwZW5kQ2hpbGQoY2FwdHVyZVVJKTtcblxuICAgICAgICBjb25zdCBfdGhpc18gPSB0aGlzO1xuICAgICAgICBjb25zdCBfX29uQ2xpY2tDYXB0dXJlQnV0dG9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhpc18uX19pc1N3aXRjaFRvU2VydmVyTW9kZSkge1xuICAgICAgICAgICAgZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKS5jYXB0dXJlQnV0dG9uLnNldEF0dHJpYnV0ZSgnaXMtY2xpY2tlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICBfdGhpc18uX19zZXRTdHlsZShkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpLmNhcHR1cmVCdXR0b24sIHtcbiAgICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCkuY2FwdHVyZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lzLWNsaWNrZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgX3RoaXNfLl9fc2V0U3R5bGUoZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKS52aWRlbywge1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzXy5fX3NldFN0eWxlKGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCkuY2FwdHVyZUJ1dHRvbiwge1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY2FwdHVyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9fb25DbGlja0NhcHR1cmVCdXR0b24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VQcmV2aWV3VUkpIHtcbiAgICAgIHByZXZpZXdVSVdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZXZpZXdVSVdyYXAuc2V0QXR0cmlidXRlKCdkYXRhLXVzZWItb2NyJywgJ3ByZXZpZXdVSVdyYXAnKTtcbiAgICAgIGNvbnN0IHByZXZpZXdVSVdyYXBTdHlsZSA9IHtcbiAgICAgICAgLi4ud3JhcFN0eWxlLFxuICAgICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uJyxcbiAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjMDAwMDAwYWEnLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShwcmV2aWV3VUlXcmFwLCBwcmV2aWV3VUlXcmFwU3R5bGUpO1xuICAgICAgb2NyLmFwcGVuZENoaWxkKHByZXZpZXdVSVdyYXApO1xuXG4gICAgICBpZiAoIXByZXZpZXdVSSkge1xuICAgICAgICBwcmV2aWV3VUkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJldmlld1VJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdwcmV2aWV3VUknKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19zZXRTdHlsZShwcmV2aWV3VUksIHtcbiAgICAgICAgLi4ud3JhcFN0eWxlLFxuICAgICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uJyxcbiAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICBoZWlnaHQ6ICcnLFxuICAgICAgICAnbWF4LXdpZHRoJzogJzkwJScsXG4gICAgICAgICdtYXgtaGVpZ2h0JzogJzkwJScsXG4gICAgICB9KTtcbiAgICAgIHByZXZpZXdVSVdyYXAuYXBwZW5kQ2hpbGQocHJldmlld1VJKTtcblxuICAgICAgaWYgKCFwcmV2aWV3SW1hZ2UpIHtcbiAgICAgICAgcHJldmlld0ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIHByZXZpZXdJbWFnZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlYi1vY3InLCAncHJldmlld0ltYWdlJyk7XG4gICAgICAgIHByZXZpZXdVSS5hcHBlbmRDaGlsZChwcmV2aWV3SW1hZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VNYW51YWxTd2l0Y2hUb1NlcnZlck1vZGUpIHtcbiAgICAgIHN3aXRjaFVJV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgc3dpdGNoVUlXcmFwLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdzd2l0Y2hVSVdyYXAnKTtcbiAgICAgIGNvbnN0IHN3aXRjaFVJV3JhcFN0eWxlID0ge1xuICAgICAgICAuLi53cmFwU3R5bGUsXG4gICAgICAgICdhbGlnbi1pdGVtcyc6ICcnLFxuICAgICAgICAnanVzdGlmeS1jb250ZW50JzogJycsXG4gICAgICAgIHdpZHRoOiAnJyxcbiAgICAgICAgb3ZlcmZsb3c6ICcnLFxuICAgICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uLXJldmVyc2UnLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShzd2l0Y2hVSVdyYXAsIHN3aXRjaFVJV3JhcFN0eWxlKTtcbiAgICAgIG9jci5hcHBlbmRDaGlsZChzd2l0Y2hVSVdyYXApO1xuXG4gICAgICBpZiAoIXN3aXRjaFVJKSB7XG4gICAgICAgIHN3aXRjaFVJID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHN3aXRjaFVJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdzd2l0Y2hVSScpO1xuICAgICAgICBsZXQgc3dpdGNoSFRNTCA9IGBgO1xuICAgICAgICBzd2l0Y2hIVE1MICs9IGA8ZGl2IGNsYXNzPSdjdXN0b20tLWxhYmVsIGZsZXgganVzdGlmeS1jZW50ZXIgYWxpZ24tY2VudGVyIGdhcDEwJz5gO1xuICAgICAgICBzd2l0Y2hIVE1MICs9IGAgIDxsYWJlbCBmb3I9J21hbnVhbC1zd2l0Y2gtd2FzbS10by1zZXJ2ZXItY2hlY2tib3gnPldBU008L2xhYmVsPmA7XG4gICAgICAgIHN3aXRjaEhUTUwgKz0gYCAgPGxhYmVsIGNsYXNzPSdzd2l0Y2gnPmA7XG4gICAgICAgIHN3aXRjaEhUTUwgKz0gYCAgICA8aW5wdXQgaWQ9J21hbnVhbC1zd2l0Y2gtd2FzbS10by1zZXJ2ZXItY2hlY2tib3gnIHR5cGU9J2NoZWNrYm94Jz5gO1xuICAgICAgICBzd2l0Y2hIVE1MICs9IGAgICAgPHNwYW4gY2xhc3M9J3NsaWRlciByb3VuZCc+PC9zcGFuPmA7XG4gICAgICAgIHN3aXRjaEhUTUwgKz0gYCAgPC9sYWJlbD5gO1xuICAgICAgICBzd2l0Y2hIVE1MICs9IGAgIDxsYWJlbCBmb3I9J3ByaW9yaXR5LWZpbmFuY2UtY29odG1sRm9ybGlzdC1jaGVja2JveCc+U2VydmVyPC9sYWJlbD5gO1xuICAgICAgICBzd2l0Y2hIVE1MICs9IGA8L2Rpdj5gO1xuICAgICAgICBzd2l0Y2hVSS5pbm5lckhUTUwgPSBzd2l0Y2hIVE1MO1xuICAgICAgfVxuICAgICAgdGhpcy5fX3NldFN0eWxlKHN3aXRjaFVJLCB7XG4gICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIH0pO1xuICAgICAgc3dpdGNoVUlXcmFwLmFwcGVuZENoaWxkKHN3aXRjaFVJKTtcbiAgICAgIGNvbnN0IHN3aXRjaENoZWNrYm94ID0gc3dpdGNoVUkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylbMF07XG5cbiAgICAgIGNvbnN0IF90aGlzXyA9IHRoaXM7XG4gICAgICBjb25zdCBfX29uQ2xpY2tTd2l0Y2hVSSA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfdGhpc18uX19pc1N3aXRjaFRvU2VydmVyTW9kZSA9IGV2ZW50LnRhcmdldC5jaGVja2VkO1xuICAgICAgICBhd2FpdCBfdGhpc18ucmVzdGFydE9DUihcbiAgICAgICAgICBfdGhpc18uX19vY3JUeXBlLFxuICAgICAgICAgIF90aGlzXy5fX29uU3VjY2VzcyxcbiAgICAgICAgICBfdGhpc18uX19vbkZhaWx1cmUsXG4gICAgICAgICAgX3RoaXNfLl9fb25JblByb2dyZXNzQ2hhbmdlLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgIH07XG5cbiAgICAgIHN3aXRjaENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX19vbkNsaWNrU3dpdGNoVUksIHtcbiAgICAgICAgb25jZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHByZWxvYWRpbmdVSVdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcmVsb2FkaW5nVUlXcmFwLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdwcmVsb2FkaW5nVUlXcmFwJyk7XG4gICAgY29uc3QgcHJlbG9hZGluZ1VJV3JhcFN0eWxlID0ge1xuICAgICAgLi4ud3JhcFN0eWxlLFxuICAgICAgJ2ZsZXgtZGlyZWN0aW9uJzogJ2NvbHVtbicsXG4gICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjMDAwMDAwZmYnLFxuICAgIH07XG4gICAgdGhpcy5fX3NldFN0eWxlKHByZWxvYWRpbmdVSVdyYXAsIHByZWxvYWRpbmdVSVdyYXBTdHlsZSk7XG4gICAgb2NyLmFwcGVuZENoaWxkKHByZWxvYWRpbmdVSVdyYXApO1xuXG4gICAgaWYgKCFwcmVsb2FkaW5nVUkpIHtcbiAgICAgIHByZWxvYWRpbmdVSSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgcHJlbG9hZGluZ1VJLnNldEF0dHJpYnV0ZSgnZGF0YS11c2ViLW9jcicsICdwcmVsb2FkaW5nVUknKTtcbiAgICAgIHByZWxvYWRpbmdVSS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RleHQtaW5mbycpO1xuXG4gICAgICBwcmVsb2FkaW5nVUkuaW5uZXJIVE1MID1cbiAgICAgICAgJycgK1xuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgc3R5bGU9XCJiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvO1wiIHdpZHRoPVwiMzJweFwiIGhlaWdodD1cIjMycHhcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWRcIj5cXG4nICtcbiAgICAgICAgJyAgPGNpcmNsZSBjeD1cIjg0XCIgY3k9XCI1MFwiIHI9XCIxMFwiIGZpbGw9XCIjZmZmZmZmZmZcIj5cXG4nICtcbiAgICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjAuNTU1NTU1NTU1NTU1NTU1NnNcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDsxXCIgdmFsdWVzPVwiMTA7MFwiIGtleVNwbGluZXM9XCIwIDAuNSAwLjUgMVwiIGJlZ2luPVwiMHNcIj48L2FuaW1hdGU+XFxuJyArXG4gICAgICAgICcgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIjODY4Njg2MDA7Izg2ODY4NjAwOyM4Njg2ODYwMDsjODY4Njg2MDA7Izg2ODY4NjAwXCIgYmVnaW49XCIwc1wiPjwvYW5pbWF0ZT5cXG4nICtcbiAgICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAgICcgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiNTBcIiByPVwiMTBcIiBmaWxsPVwiI2ZmZmZmZmZmXCI+XFxuJyArXG4gICAgICAgICcgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cInJcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMDswOzEwOzEwOzEwXCIga2V5U3BsaW5lcz1cIjAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxXCIgYmVnaW49XCIwc1wiPjwvYW5pbWF0ZT5cXG4nICtcbiAgICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIjBzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgICAnICA8L2NpcmNsZT4nICtcbiAgICAgICAgJyAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIxMFwiIGZpbGw9XCIjZmZmZmZmZmZcIj5cXG4nICtcbiAgICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiclwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIwOzA7MTA7MTA7MTBcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0wLjU1NTU1NTU1NTU1NTU1NTZzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgICAnICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJjeFwiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGR1cj1cIjIuMjIyMjIyMjIyMjIyMjIyM3NcIiBjYWxjTW9kZT1cInNwbGluZVwiIGtleVRpbWVzPVwiMDswLjI1OzAuNTswLjc1OzFcIiB2YWx1ZXM9XCIxNjsxNjsxNjs1MDs4NFwiIGtleVNwbGluZXM9XCIwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMVwiIGJlZ2luPVwiLTAuNTU1NTU1NTU1NTU1NTU1NnNcIj48L2FuaW1hdGU+XFxuJyArXG4gICAgICAgICcgIDwvY2lyY2xlPicgK1xuICAgICAgICAnICA8Y2lyY2xlIGN4PVwiODRcIiBjeT1cIjUwXCIgcj1cIjEwXCIgZmlsbD1cIiNmZmZmZmZmZlwiPlxcbicgK1xuICAgICAgICAnICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJyXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgZHVyPVwiMi4yMjIyMjIyMjIyMjIyMjIzc1wiIGNhbGNNb2RlPVwic3BsaW5lXCIga2V5VGltZXM9XCIwOzAuMjU7MC41OzAuNzU7MVwiIHZhbHVlcz1cIjA7MDsxMDsxMDsxMFwiIGtleVNwbGluZXM9XCIwIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMTswIDAuNSAwLjUgMVwiIGJlZ2luPVwiLTEuMTExMTExMTExMTExMTExMnNcIj48L2FuaW1hdGU+XFxuJyArXG4gICAgICAgICcgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImN4XCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgZHVyPVwiMi4yMjIyMjIyMjIyMjIyMjIzc1wiIGNhbGNNb2RlPVwic3BsaW5lXCIga2V5VGltZXM9XCIwOzAuMjU7MC41OzAuNzU7MVwiIHZhbHVlcz1cIjE2OzE2OzE2OzUwOzg0XCIga2V5U3BsaW5lcz1cIjAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxXCIgYmVnaW49XCItMS4xMTExMTExMTExMTExMTEyc1wiPjwvYW5pbWF0ZT5cXG4nICtcbiAgICAgICAgJyAgPC9jaXJjbGU+JyArXG4gICAgICAgICcgIDxjaXJjbGUgY3g9XCIxNlwiIGN5PVwiNTBcIiByPVwiMTBcIiBmaWxsPVwiI2ZmZmZmZmZmXCI+XFxuJyArXG4gICAgICAgICcgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cInJcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMDswOzEwOzEwOzEwXCIga2V5U3BsaW5lcz1cIjAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxOzAgMC41IDAuNSAxXCIgYmVnaW49XCItMS42NjY2NjY2NjY2NjY2NjY1c1wiPjwvYW5pbWF0ZT5cXG4nICtcbiAgICAgICAgJyAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiY3hcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBkdXI9XCIyLjIyMjIyMjIyMjIyMjIyMjNzXCIgY2FsY01vZGU9XCJzcGxpbmVcIiBrZXlUaW1lcz1cIjA7MC4yNTswLjU7MC43NTsxXCIgdmFsdWVzPVwiMTY7MTY7MTY7NTA7ODRcIiBrZXlTcGxpbmVzPVwiMCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDE7MCAwLjUgMC41IDFcIiBiZWdpbj1cIi0xLjY2NjY2NjY2NjY2NjY2NjVzXCI+PC9hbmltYXRlPlxcbicgK1xuICAgICAgICAnICA8L2NpcmNsZT4nICtcbiAgICAgICAgJzwvc3ZnPic7XG5cbiAgICAgIGlmICh0aGlzLl9fb3B0aW9ucy5wcmVsb2FkaW5nVUlUZXh0TXNnID09PSAnJyB8fCB0aGlzLl9fb3B0aW9ucy5wcmVsb2FkaW5nVUlUZXh0TXNnKSB7XG4gICAgICAgIHByZWxvYWRpbmdVSS5pbm5lckhUTUwgKz0gdGhpcy5fX29wdGlvbnMucHJlbG9hZGluZ1VJVGV4dE1zZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9fc2V0U3R5bGUocHJlbG9hZGluZ1VJLCB7XG4gICAgICAuLi53cmFwU3R5bGUsXG4gICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uJyxcbiAgICB9KTtcbiAgICBwcmVsb2FkaW5nVUlXcmFwLmFwcGVuZENoaWxkKHByZWxvYWRpbmdVSSk7XG5cbiAgICAvLyBsb2FkaW5nIFVJIOychOy5mCDsnpDrpqzsnqHqsowg7ZWY6riwIOychO2VtFxuICAgIGF3YWl0IHRoaXMuX19pbml0U3R5bGUoKTtcblxuICAgIC8vIO2ZlOuptOqzvOuPhCDtmITsg4Eg7ZW06rKwXG4gICAgdGhpcy5fX3NldFN0eWxlKG9jciwgeyBkaXNwbGF5OiAnJyB9KTtcblxuICAgIHRoaXMuX19vY3IgPSBvY3I7XG4gICAgdGhpcy5fX2NhbnZhcyA9IGNhbnZhcztcbiAgICB0aGlzLl9fcm90YXRpb25DYW52YXMgPSByb3RhdGlvbkNhbnZhcztcbiAgICB0aGlzLl9fdmlkZW8gPSB2aWRlbztcbiAgICB0aGlzLl9fdmlkZW9XcmFwID0gdmlkZW9XcmFwO1xuICAgIHRoaXMuX19ndWlkZUJveCA9IGd1aWRlQm94O1xuICAgIHRoaXMuX19ndWlkZUJveFdyYXAgPSBndWlkZUJveFdyYXA7XG4gICAgdGhpcy5fX21hc2tCb3hXcmFwID0gbWFza0JveFdyYXA7XG4gICAgdGhpcy5fX3ByZXZlbnRUb0ZyZWV6ZVZpZGVvID0gcHJldmVudFRvRnJlZXplVmlkZW87XG4gICAgdGhpcy5fX2N1c3RvbVVJV3JhcCA9IGN1c3RvbVVJV3JhcDtcbiAgICB0aGlzLl9fdG9wVUkgPSB0b3BVSTtcbiAgICB0aGlzLl9fbWlkZGxlVUkgPSBtaWRkbGVVSTtcbiAgICB0aGlzLl9fYm90dG9tVUkgPSBib3R0b21VSTtcbiAgICB0aGlzLl9fY2FwdHVyZVVJV3JhcCA9IGNhcHR1cmVVSVdyYXA7XG4gICAgdGhpcy5fX2NhcHR1cmVVSSA9IGNhcHR1cmVVSTtcbiAgICB0aGlzLl9fY2FwdHVyZUJ1dHRvbiA9IGNhcHR1cmVCdXR0b247XG4gICAgdGhpcy5fX3ByZXZpZXdVSVdyYXAgPSBwcmV2aWV3VUlXcmFwO1xuICAgIHRoaXMuX19wcmV2aWV3VUkgPSBwcmV2aWV3VUk7XG4gICAgdGhpcy5fX3ByZXZpZXdJbWFnZSA9IHByZXZpZXdJbWFnZTtcbiAgICB0aGlzLl9fc3dpdGNoVUlXcmFwID0gc3dpdGNoVUlXcmFwO1xuICAgIHRoaXMuX19zd2l0Y2hVSSA9IHN3aXRjaFVJO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9jcixcbiAgICAgIGNhbnZhcyxcbiAgICAgIHJvdGF0aW9uQ2FudmFzLFxuICAgICAgdmlkZW8sXG4gICAgICB2aWRlb1dyYXAsXG4gICAgICBndWlkZUJveCxcbiAgICAgIGd1aWRlQm94V3JhcCxcbiAgICAgIG1hc2tCb3hXcmFwLFxuICAgICAgcHJldmVudFRvRnJlZXplVmlkZW8sXG4gICAgICBjdXN0b21VSVdyYXAsXG4gICAgICB0b3BVSSxcbiAgICAgIG1pZGRsZVVJLFxuICAgICAgYm90dG9tVUksXG4gICAgICBjYXB0dXJlVUlXcmFwLFxuICAgICAgY2FwdHVyZVVJLFxuICAgICAgY2FwdHVyZUJ1dHRvbixcbiAgICAgIHByZXZpZXdVSVdyYXAsXG4gICAgICBwcmV2aWV3VUksXG4gICAgICBwcmV2aWV3SW1hZ2UsXG4gICAgICBzd2l0Y2hVSVdyYXAsXG4gICAgICBzd2l0Y2hVSSxcbiAgICB9O1xuICB9XG5cbiAgX19ibHVyQ2FwdHVyZUJ1dHRvbigpIHtcbiAgICB0aGlzLl9fc2V0U3R5bGUoZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKS52aWRlbywgeyBkaXNwbGF5OiAnJyB9KTtcbiAgICBjb25zdCB7IGNhcHR1cmVCdXR0b24gfSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCk7XG5cbiAgICBpZiAoY2FwdHVyZUJ1dHRvbikge1xuICAgICAgY2FwdHVyZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2lzLWNsaWNrZWQnLCAnZmFsc2UnKTtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShjYXB0dXJlQnV0dG9uLCB7IGRpc3BsYXk6ICcnIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9faXNDbGlja2VkQ2FwdHVyZUJ1dHRvbigpIHtcbiAgICBjb25zdCB7IGNhcHR1cmVCdXR0b24gfSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCk7XG4gICAgcmV0dXJuIGNhcHR1cmVCdXR0b24gPyBjYXB0dXJlQnV0dG9uLmdldEF0dHJpYnV0ZSgnaXMtY2xpY2tlZCcpID09PSAndHJ1ZScgOiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIF9fc2V0dXBWaWRlbyhpc1Bhc3Nwb3J0KSB7XG4gICAgLy8gd2FzbSDsnbjsi53shLHriqUg7LWc7KCB7ZmU65CcIO2VtOyDgeuPhFxuICAgIHRoaXMuX19yZXNvbHV0aW9uV2lkdGggPSAxMDgwO1xuICAgIHRoaXMuX19yZXNvbHV0aW9uSGVpZ2h0ID0gNzIwO1xuXG4gICAgdGhpcy5fX2NhbVNldENvbXBsZXRlID0gZmFsc2U7XG5cbiAgICBjb25zdCB7IHZpZGVvLCBjYW52YXMsIHJvdGF0aW9uQ2FudmFzIH0gPSBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuXG4gICAgbGV0IGNhbWVyYSA9IGF3YWl0IHRoaXMuX19nZXRJbnB1dERldmljZXMoKTtcbiAgICAvLyBjb25zb2xlLmxvZygndmlkZW9EZXZpY2VzIDo6ICcsIGNhbWVyYSlcblxuICAgIHRoaXMuY2hlY2tVSU9yaWVudGF0aW9uKCk7XG4gICAgbGV0IGNvbnN0cmFpbnRXaWR0aCwgY29uc3RyYWludEhlaWdodDtcblxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy5jYW1lcmFSZXNvbHV0aW9uQ3JpdGVyaWEgPT09ICdoaWdoUXVhbGl0eScpIHtcbiAgICAgIC8vIOy5tOuplOudvCDtlbTsg4Hrj4Qg7ISk7KCVIDog7ZmU7KeIIOyasOyEoFxuICAgICAgLy8gMTkyMHgxMDgw7J20IOqwgOuKpe2VnOqyveyasCDsgqzsmqkg7JWE64uI66m0IDEyODB4NzIwIOyCrOyaqVxuICAgICAgY29uc3RyYWludFdpZHRoID0ge1xuICAgICAgICBpZGVhbDogMTkyMCxcbiAgICAgICAgbWluOiAxMjgwLFxuICAgICAgfTtcbiAgICAgIGNvbnN0cmFpbnRIZWlnaHQgPSB7XG4gICAgICAgIGlkZWFsOiAxMDgwLFxuICAgICAgICBtaW46IDcyMCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vICdjb21wYXRpYmlsaXR5J1xuICAgICAgLy8g7Lm066mU6528IO2VtOyDgeuPhCDshKTsoJUgOiDtmLjtmZjshLEg7Jqw7ISgXG4gICAgICAvLyAxOTIweDEwODDsnbQg7IKs7JqpIOqwgOuKpe2VmOuNlOudvOuPhCAxMjgweDcyMOydhCDsgqzsmqntlZjrj4TroZ0g6rOg7KCVXG4gICAgICAvLyDsgqzsnKAgOiDqsKTrn63si5wgZW50cnkg66qo6424KEHsi5zrpqzspoggLyBXaWRlIOuqqOuNuCDrk7Ep7JeQ7IScIDE5MjAgeCAxMDgwIOyymOumrOyLnCDruYTsnKjsnbQg7J207IOB7ZW07KeQKO2ZgOytieydtOuQqClcbiAgICAgIC8vIO2VreyDgSAxMjgwIHggNzIw7J2EIOyCrOyaqe2VmOuPhOuhnSDrs4Dqsr1cbiAgICAgIGNvbnN0cmFpbnRXaWR0aCA9IHtcbiAgICAgICAgaWRlYWw6IDEyODAsXG4gICAgICB9O1xuICAgICAgY29uc3RyYWludEhlaWdodCA9IHtcbiAgICAgICAgaWRlYWw6IDcyMCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgY29uc3RyYWludHMgPSB7XG4gICAgICBhdWRpbzogZmFsc2UsXG4gICAgICB2aWRlbzoge1xuICAgICAgICB6b29tOiB7IGlkZWFsOiAxIH0sXG4gICAgICAgIGZhY2luZ01vZGU6IHsgaWRlYWw6IHRoaXMuX19mYWNpbmdNb2RlQ29uc3RyYWludCB9LFxuICAgICAgICBmb2N1c01vZGU6IHsgaWRlYWw6ICdjb250aW51b3VzJyB9LFxuICAgICAgICB3aGl0ZUJhbGFuY2VNb2RlOiB7IGlkZWFsOiAnY29udGludW91cycgfSxcbiAgICAgICAgZGV2aWNlSWQ6IGNhbWVyYS5sZW5ndGhcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgaWRlYWw6IGNhbWVyYVtjYW1lcmEubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiBudWxsLFxuICAgICAgICB3aWR0aDogY29uc3RyYWludFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNvbnN0cmFpbnRIZWlnaHQsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvLyDstZzstIgg7KeE7J6FIOydtOyWtOyEnCB2aWRlb0RlaXZjZSDrpqzsiqTtirjrpbwg6rCA7KC47JisIOyImCDsl4bsnLzrqbQsXG4gICAgLy8gZ2V0VXNlck1lZGlh66W8IOyehOydmCDtmLjstpztlZjsl6wg6raM7ZWc7J2EIOuwm+ydgOuSpCDri6Tsi5wg6rCA7KC47Ji0XG4gICAgaWYgKGNhbWVyYS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuX19kZWJ1ZygnY2Fubm90IHRvIGdldCBjYW1lcmEgZGV2aWNlcy4gc28sIHRyeSB0byBnZXQgY2FtZXJhIGRldmljZXMgYWdhaW4nKTtcbiAgICAgIHRoaXMuX19kZWJ1ZyhgY29uc3RyYWludHMgOiAke0pTT04uc3RyaW5naWZ5KGNvbnN0cmFpbnRzKX1gKTtcbiAgICAgIHRoaXMuX19zdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cyk7XG4gICAgICB0aGlzLnN0b3BTdHJlYW0oKTtcbiAgICAgIGNhbWVyYSA9IGF3YWl0IHRoaXMuX19nZXRJbnB1dERldmljZXMoKTtcblxuICAgICAgY29uc3RyYWludHMudmlkZW8uZGV2aWNlSWQgPSBjYW1lcmEubGVuZ3RoID8geyBpZGVhbDogY2FtZXJhW2NhbWVyYS5sZW5ndGggLSAxXSB9IDogbnVsbDtcbiAgICB9XG5cbiAgICAvLyDqsKTrn63si5wgd2lkZSDrk7Eg7KCA7IKs7JaRIOq4sOq4sOyXkOyEnCBGSEQg7ZW07IOB64+EIOy5tOuplOudvCDsgqzsmqnsi5wg7ZmA7K2J7J2065CY64qUIO2YhOyDgSDrsKnsp4BcbiAgICAvLyDsoIDsgqzslpEg6riw6riwIO2MkOuLqOq4sOykgCA6IO2bhOuptOy5tOuplOudvOydmCDqsJzsiJjqsIAgMeqwnOudvOuKlCDqsIDsoJVcbiAgICBpZiAoY2FtZXJhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5fX2RlYnVnKCdtYXliZSBkZXZpY2UgaXMgZW50cnkgbW9kZWwgc3VjaCBhcyBnYWxheHkgd2lkZScpO1xuICAgICAgY29uc3RyYWludHMudmlkZW8ud2lkdGggPSB7IGlkZWFsOiAxMjgwIH07XG4gICAgICBjb25zdHJhaW50cy52aWRlby5oZWlnaHQgPSB7IGlkZWFsOiA3MjAgfTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gY29uc3QgZHVtcHRyYWNrID0gKFthLCBiXSwgdHJhY2spID0+XG4gICAgICAvLyAgIGAke2F9JHt0cmFjay5raW5kID09ICd2aWRlbycgPyAnQ2FtZXJhJyA6ICdNaWNyb3Bob25lJ30gKCR7dHJhY2sucmVhZHlTdGF0ZX0pOiAke3RyYWNrLmxhYmVsfSR7Yn1gO1xuXG4gICAgICBjb25zdCBzdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cyk7XG4gICAgICB0aGlzLl9fZGVidWcoYGNvbnN0cmFpbnRzIDogJHtKU09OLnN0cmluZ2lmeShjb25zdHJhaW50cyl9YCk7XG4gICAgICAvLyB0aGlzLl9fZGVidWcoJ3ZpZGVvVHJhY2tzIDo6ICcsIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpKTtcbiAgICAgIGNvbnN0IHN0cmVhbVNldHRpbmdzID0gc3RyZWFtLmdldFZpZGVvVHJhY2tzKClbMF0uZ2V0U2V0dGluZ3MoKTtcbiAgICAgIC8vIHRoaXMuX19kZWJ1ZyhcbiAgICAgIC8vICAgJ3N0cmVhbUNhcGFiaWxpdGllcyA6OiAnLFxuICAgICAgLy8gICBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXS5nZXRDYXBhYmlsaXRpZXMoKVxuICAgICAgLy8gKTtcbiAgICAgIC8vIHRoaXMuX19kZWJ1Zygnc3RyZWFtIDo6ICcsIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdLmdldENvbnN0cmFpbnRzKCkpO1xuICAgICAgLy8gdGhpcy5fX2RlYnVnKCdzdHJlYW1TZXR0aW5ncyA6OiAnLCBzdHJlYW1TZXR0aW5ncyk7XG4gICAgICB0aGlzLl9fZGVidWcoYHN0cmVhbSB3aWR0aCAqIGhlaWdodCA6OiAke3N0cmVhbVNldHRpbmdzLndpZHRofSAqICR7c3RyZWFtU2V0dGluZ3MuaGVpZ2h0fWApO1xuICAgICAgdGhpcy5fX2RlYnVnKCdzdHJlYW0gd2lkdGggLyBoZWlnaHQgOjogJyArIHN0cmVhbVNldHRpbmdzLndpZHRoIC8gc3RyZWFtU2V0dGluZ3MuaGVpZ2h0KTtcbiAgICAgIHRoaXMuX19kZWJ1Zygnc3RyZWFtIGFzcGVjdFJhdGlvIDo6ICcgKyBzdHJlYW1TZXR0aW5ncy5hc3BlY3RSYXRpbyk7XG4gICAgICB0aGlzLl9fZGVidWcoJ3N0cmVhbSBmYWNpbmdNb2RlIDo6ICcgKyBzdHJlYW1TZXR0aW5ncy5mYWNpbmdNb2RlKTtcblxuICAgICAgW2NhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF0gPSBbdGhpcy5fX3Jlc29sdXRpb25XaWR0aCwgdGhpcy5fX3Jlc29sdXRpb25IZWlnaHRdO1xuICAgICAgaWYgKHRoaXMuX19pc1JvdGF0ZWQ5MG9yMjcwKSB7XG4gICAgICAgIFtyb3RhdGlvbkNhbnZhcy53aWR0aCwgcm90YXRpb25DYW52YXMuaGVpZ2h0XSA9IFt0aGlzLl9fcmVzb2x1dGlvbkhlaWdodCwgdGhpcy5fX3Jlc29sdXRpb25XaWR0aF07XG4gICAgICB9XG5cbiAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICAgIHRoaXMuX19zdHJlYW0gPSBzdHJlYW07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19pbml0U3R5bGUoKSB7XG4gICAgY29uc29sZS5kZWJ1ZygnYWRqdXN0U3R5bGUgLSBTVEFSVCcpO1xuICAgIGNvbnN0IHsgb2NyLCBndWlkZUJveCwgbWFza0JveFdyYXAsIHRvcFVJLCBtaWRkbGVVSSwgYm90dG9tVUksIGNhcHR1cmVVSSB9ID0gZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKTtcblxuICAgIHRoaXMuX19zZXRTdHlsZShjYXB0dXJlVUksIHsgZGlzcGxheTogJ25vbmUnIH0pO1xuXG4gICAgLy8g6riw7KSA7KCV67O0XG4gICAgY29uc3QgYmFzZVdpZHRoID0gNDAwO1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSAyNjA7XG5cbiAgICBjb25zdCBzY2FubmVyRnJhbWVSYXRpbyA9IGJhc2VIZWlnaHQgLyBiYXNlV2lkdGg7IC8vIOyLoOu2hOymnSDruYTsnKhcblxuICAgIGxldCBndWlkZUJveFdpZHRoLCBndWlkZUJveEhlaWdodDtcblxuICAgIGxldCBjYWxjT2NyQ2xpZW50V2lkdGggPSBvY3IuY2xpZW50V2lkdGg7XG4gICAgbGV0IGNhbGNPY3JDbGllbnRIZWlnaHQgPSBvY3IuY2xpZW50SGVpZ2h0O1xuXG4gICAgY29uc3QgYm9yZGVyV2lkdGggPSB0aGlzLl9fb3B0aW9ucy5mcmFtZUJvcmRlclN0eWxlLndpZHRoO1xuICAgIGNvbnN0IGJvcmRlclJhZGl1cyA9IHRoaXMuX19vcHRpb25zLmZyYW1lQm9yZGVyU3R5bGUucmFkaXVzO1xuXG4gICAgY29uc3QgZ3VpZGVCb3hSYXRpb0J5V2lkdGggPSB0aGlzLl9fZ3VpZGVCb3hSYXRpb0J5V2lkdGg7XG4gICAgY29uc3QgdmlkZW9SYXRpb0J5SGVpZ2h0ID0gdGhpcy5fX3ZpZGVvUmF0aW9CeUhlaWdodDtcblxuICAgIGlmICh0aGlzLl9fdWlPcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xuICAgICAgLy8g7IS466GcIFVJICYmIOyEuOuhnCDruYTrlJTsmKTroZwg6rCE7KO8XG4gICAgICAvLyDqsIDroZwg6riw7KSA7Jy866GcIOqwgOydtOuTnOuwleyKpCDqs4TsgrBcbiAgICAgIGd1aWRlQm94V2lkdGggPSBjYWxjT2NyQ2xpZW50V2lkdGggKiBndWlkZUJveFJhdGlvQnlXaWR0aDtcbiAgICAgIGd1aWRlQm94SGVpZ2h0ID0gZ3VpZGVCb3hXaWR0aCAqIHNjYW5uZXJGcmFtZVJhdGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDqsIDroZwgVUkgJiYg6rCA66GcIOu5hOuUlOyYpOuhnCDqsITso7xcbiAgICAgIC8vIOu5hOuUlOyYpOulvCDqsIDroZwgVUnsnZggaGVpZ2h0IOq4sOykgOycvOuhnCDspITsnbTqs6BcbiAgICAgIC8vIOqwgOuhnCBVSSBoZWlnaHQg6riw7KSA7Jy866GcIOu5hOuUlOyYpOydmCB3aWR0aCDqs4TsgrBcbiAgICAgIGd1aWRlQm94SGVpZ2h0ID0gY2FsY09jckNsaWVudEhlaWdodCAqIHZpZGVvUmF0aW9CeUhlaWdodDtcbiAgICAgIGd1aWRlQm94V2lkdGggPSAoZ3VpZGVCb3hIZWlnaHQgKiBiYXNlV2lkdGgpIC8gYmFzZUhlaWdodDtcbiAgICB9XG5cbiAgICBndWlkZUJveFdpZHRoICs9IGJvcmRlcldpZHRoICogMjtcbiAgICBndWlkZUJveEhlaWdodCArPSBib3JkZXJXaWR0aCAqIDI7XG5cbiAgICBjb25zdCByZWR1Y2VkR3VpZGVCb3hXaWR0aCA9IGd1aWRlQm94V2lkdGggKiB0aGlzLl9fZ3VpZGVCb3hSZWR1Y2VSYXRpbztcbiAgICBjb25zdCByZWR1Y2VkR3VpZGVCb3hIZWlnaHQgPSBndWlkZUJveEhlaWdodCAqIHRoaXMuX19ndWlkZUJveFJlZHVjZVJhdGlvO1xuXG4gICAgaWYgKHRvcFVJKSB7XG4gICAgICB0aGlzLl9fc2V0U3R5bGUodG9wVUksIHtcbiAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzEwcHgnLFxuICAgICAgICBoZWlnaHQ6IChjYWxjT2NyQ2xpZW50SGVpZ2h0IC0gZ3VpZGVCb3hIZWlnaHQpIC8gMiArICdweCcsXG4gICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgJ2ZsZXgtZGlyZWN0aW9uJzogJ2NvbHVtbi1yZXZlcnNlJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChtaWRkbGVVSSkge1xuICAgICAgdGhpcy5fX3NldFN0eWxlKG1pZGRsZVVJLCB7XG4gICAgICAgIHdpZHRoOiByZWR1Y2VkR3VpZGVCb3hXaWR0aCAtIGJvcmRlcldpZHRoICogMiArICdweCcsXG4gICAgICAgIGhlaWdodDogcmVkdWNlZEd1aWRlQm94SGVpZ2h0IC0gYm9yZGVyV2lkdGggKiAyICsgJ3B4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAnYWxpZ24taXRlbXMnOiAnY2VudGVyJyxcbiAgICAgICAgJ2p1c3RpZnktY29udGVudCc6ICdjZW50ZXInLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYm90dG9tVUkpIHtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShib3R0b21VSSwge1xuICAgICAgICAncGFkZGluZy10b3AnOiAnMTBweCcsXG4gICAgICAgIGhlaWdodDogKGNhbGNPY3JDbGllbnRIZWlnaHQgLSBndWlkZUJveEhlaWdodCkgLyAyICsgJ3B4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZGVvSW5uZXJHYXAgPSAyOyAvLyDrr7jshLjtlZjqsowgbWFza0JveElubmVy67O064ukIGd1aWRlQm946rCAIOyekeydgOqygyDrs7TsoJVcbiAgICB0aGlzLl9fc2V0U3R5bGUoZ3VpZGVCb3gsIHtcbiAgICAgIHdpZHRoOiByZWR1Y2VkR3VpZGVCb3hXaWR0aCAtIHZpZGVvSW5uZXJHYXAgKyAncHgnLFxuICAgICAgaGVpZ2h0OiByZWR1Y2VkR3VpZGVCb3hIZWlnaHQgLSB2aWRlb0lubmVyR2FwICsgJ3B4JyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1hc2tCb3hJbm5lciA9IG1hc2tCb3hXcmFwLnF1ZXJ5U2VsZWN0b3IoJyNtYXNrQm94SW5uZXInKTtcbiAgICBsZXQgciA9IGJvcmRlclJhZGl1cyAtIGJvcmRlcldpZHRoICogMjtcbiAgICByID0gciA8IDAgPyAwIDogcjtcbiAgICBpZiAoIWlzTmFOKHJlZHVjZWRHdWlkZUJveFdpZHRoKSAmJiAhaXNOYU4ocmVkdWNlZEd1aWRlQm94SGVpZ2h0KSAmJiAhaXNOYU4oYm9yZGVyUmFkaXVzKSAmJiAhaXNOYU4oYm9yZGVyV2lkdGgpKSB7XG4gICAgICBjb25zdCBtYXNrQm94SW5uZXJXaWR0aCA9IE1hdGgubWF4KHJlZHVjZWRHdWlkZUJveFdpZHRoIC0gYm9yZGVyV2lkdGggKiAyIC0gdmlkZW9Jbm5lckdhcCwgMCk7XG4gICAgICBjb25zdCBtYXNrQm94SW5uZXJIZWlnaHQgPSBNYXRoLm1heChyZWR1Y2VkR3VpZGVCb3hIZWlnaHQgLSBib3JkZXJXaWR0aCAqIDIgLSB2aWRlb0lubmVyR2FwLCAwKTtcblxuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBtYXNrQm94SW5uZXJXaWR0aCArICcnKTtcbiAgICAgIG1hc2tCb3hJbm5lci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIG1hc2tCb3hJbm5lckhlaWdodCArICcnKTtcbiAgICAgIG1hc2tCb3hJbm5lci5zZXRBdHRyaWJ1dGUoJ3gnLCAobWFza0JveElubmVyV2lkdGggLyAyKSAqIC0xICsgJycpO1xuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgneScsIChtYXNrQm94SW5uZXJIZWlnaHQgLyAyKSAqIC0xICsgJycpO1xuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgncngnLCByICsgJycpO1xuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgncnknLCByICsgJycpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9fYWRqdXN0U3R5bGUoKSB7XG4gICAgY29uc3QgX19jYWxjR3VpZGVCb3hDcml0ZXJpYSA9IChhLCBiKSA9PiB7XG4gICAgICBpZiAodGhpcy5fX29wdGlvbnMuY2FsY0d1aWRlQm94Q3JpdGVyaWEgPT09ICdjYW1lcmFSZXNvbHV0aW9uJykge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oYSwgYik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLmNhbGNHdWlkZUJveENyaXRlcmlhID09PSAnb2NyVmlld1NpemUnKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhLCBiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbihhLCBiKTsgLy8gZGVmYXVsdCA6IGNhbWVyYVJlc29sdXRpb25cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc29sZS5kZWJ1ZygnYWRqdXN0U3R5bGUgLSBTVEFSVCcpO1xuICAgIGNvbnN0IHsgb2NyLCB2aWRlbywgZ3VpZGVCb3gsIG1hc2tCb3hXcmFwLCB0b3BVSSwgbWlkZGxlVUksIGJvdHRvbVVJLCBjYXB0dXJlVUlXcmFwLCBjYXB0dXJlVUksIGNhcHR1cmVCdXR0b24gfSA9XG4gICAgICBkZXRlY3Rvci5nZXRPQ1JFbGVtZW50cygpO1xuXG4gICAgdGhpcy5fX3NldFN0eWxlKGNhcHR1cmVVSSwgeyBkaXNwbGF5OiAnbm9uZScgfSk7XG5cbiAgICBjb25zdCBpc0FsaWVuQmFjayA9IHRoaXMuX19vY3JUeXBlID09PSAnYWxpZW4tYmFjayc7XG5cbiAgICAvLyDquLDspIDsoJXrs7RcbiAgICBjb25zdCBiYXNlV2lkdGggPSBpc0FsaWVuQmFjayA/IDI2MCA6IDQwMDtcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gaXNBbGllbkJhY2sgPyA0MDAgOiAyNjA7XG5cbiAgICBjb25zdCBzY2FubmVyRnJhbWVSYXRpbyA9IGJhc2VIZWlnaHQgLyBiYXNlV2lkdGg7IC8vIOyLoOu2hOymnSDruYTsnKhcblxuICAgIGxldCBndWlkZUJveFdpZHRoLCBndWlkZUJveEhlaWdodDtcblxuICAgIGxldCBjYWxjT2NyQ2xpZW50V2lkdGggPSBvY3IuY2xpZW50V2lkdGg7XG4gICAgbGV0IGNhbGNPY3JDbGllbnRIZWlnaHQgPSBvY3IuY2xpZW50SGVpZ2h0O1xuICAgIGxldCBjYWxjVmlkZW9XaWR0aCA9IHZpZGVvLnZpZGVvV2lkdGg7XG4gICAgbGV0IGNhbGNWaWRlb0hlaWdodCA9IHZpZGVvLnZpZGVvSGVpZ2h0O1xuICAgIGxldCBjYWxjVmlkZW9DbGllbnRXaWR0aCA9IHZpZGVvLmNsaWVudFdpZHRoO1xuICAgIGxldCBjYWxjVmlkZW9DbGllbnRIZWlnaHQgPSB2aWRlby5jbGllbnRIZWlnaHQ7XG4gICAgbGV0IGNhbGNWaWRlb09yaWVudGF0aW9uID0gdGhpcy5fX3ZpZGVvT3JpZW50YXRpb247XG5cbiAgICBpZiAoY2FsY1ZpZGVvV2lkdGggPT09IDAgfHwgY2FsY1ZpZGVvSGVpZ2h0ID09PSAwIHx8IGNhbGNWaWRlb0NsaWVudFdpZHRoID09PSAwIHx8IGNhbGNWaWRlb0NsaWVudEhlaWdodCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJvcmRlcldpZHRoID0gdGhpcy5fX29wdGlvbnMuZnJhbWVCb3JkZXJTdHlsZS53aWR0aDtcbiAgICBjb25zdCBib3JkZXJSYWRpdXMgPSB0aGlzLl9fb3B0aW9ucy5mcmFtZUJvcmRlclN0eWxlLnJhZGl1cztcblxuICAgIGlmICh0aGlzLl9faXNSb3RhdGVkOTBvcjI3MCkge1xuICAgICAgW2NhbGNWaWRlb1dpZHRoLCBjYWxjVmlkZW9IZWlnaHRdID0gW2NhbGNWaWRlb0hlaWdodCwgY2FsY1ZpZGVvV2lkdGhdO1xuICAgICAgW2NhbGNWaWRlb0NsaWVudFdpZHRoLCBjYWxjVmlkZW9DbGllbnRIZWlnaHRdID0gW2NhbGNWaWRlb0NsaWVudEhlaWdodCwgY2FsY1ZpZGVvQ2xpZW50V2lkdGhdO1xuICAgICAgY2FsY1ZpZGVvT3JpZW50YXRpb24gPSB0aGlzLl9fdmlkZW9PcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0JyA/ICdsYW5kc2NhcGUnIDogJ3BvcnRyYWl0JztcbiAgICB9XG4gICAgbGV0IG5ld1ZpZGVvV2lkdGggPSBjYWxjVmlkZW9DbGllbnRXaWR0aDtcbiAgICBsZXQgbmV3VmlkZW9IZWlnaHQgPSBjYWxjVmlkZW9DbGllbnRIZWlnaHQ7XG5cbiAgICBjb25zdCBndWlkZUJveFJhdGlvQnlXaWR0aCA9IHRoaXMuX19ndWlkZUJveFJhdGlvQnlXaWR0aDtcbiAgICBjb25zdCB2aWRlb1JhdGlvQnlIZWlnaHQgPSB0aGlzLl9fdmlkZW9SYXRpb0J5SGVpZ2h0O1xuICAgIGNvbnN0IG5ld1ZpZGVvUmF0aW9CeVdpZHRoID0gY2FsY1ZpZGVvQ2xpZW50SGVpZ2h0IC8gY2FsY1ZpZGVvQ2xpZW50V2lkdGg7XG4gICAgY29uc3QgbmV3VmlkZW9SYXRpb0J5SGVpZ2h0ID0gY2FsY1ZpZGVvQ2xpZW50V2lkdGggLyBjYWxjVmlkZW9DbGllbnRIZWlnaHQ7XG5cbiAgICBpZiAodGhpcy5fX3VpT3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcbiAgICAgIC8vIOyEuOuhnCBVSVxuICAgICAgdGhpcy5fX3NldFN0eWxlKGNhcHR1cmVVSVdyYXAsIHtcbiAgICAgICAgJ2p1c3RpZnktY29udGVudCc6ICdjZW50ZXInLFxuICAgICAgICAnYWxpZ24taXRlbXMnOiAnZmxleC1lbmQnLFxuICAgICAgfSk7XG4gICAgICAvLyB2aWRlbyDqsIDroZwg6riw7KSAIDEwMCUg7Jyg7KeAICjrs4Dqsr3sl4bsnYwpXG4gICAgICBpZiAoY2FsY1ZpZGVvT3JpZW50YXRpb24gPT09IHRoaXMuX191aU9yaWVudGF0aW9uKSB7XG4gICAgICAgIC8vIOy5tOuplOudvOuPhCDshLjroZxcbiAgICAgICAgLy8g7IS466GcIFVJICYmIOyEuOuhnCDruYTrlJTsmKRcbiAgICAgICAgLy8g6rCA66GcIOq4sOykgOycvOuhnCDqsIDsnbTrk5zrsJXsiqQg6rOE7IKwXG4gICAgICAgIGd1aWRlQm94V2lkdGggPSBfX2NhbGNHdWlkZUJveENyaXRlcmlhKGNhbGNPY3JDbGllbnRXaWR0aCwgY2FsY1ZpZGVvV2lkdGgpICogZ3VpZGVCb3hSYXRpb0J5V2lkdGg7XG4gICAgICAgIGd1aWRlQm94SGVpZ2h0ID0gZ3VpZGVCb3hXaWR0aCAqIHNjYW5uZXJGcmFtZVJhdGlvO1xuXG4gICAgICAgIC8vIOqwgOydtOuTnCDrsJXsiqQg6rCA66GcIOq4sOykgOycvOuhnCDruYTrlJTsmKQg7ZmV64yAXG4gICAgICAgIG5ld1ZpZGVvV2lkdGggPSBndWlkZUJveFdpZHRoO1xuICAgICAgICBuZXdWaWRlb0hlaWdodCA9IG5ld1ZpZGVvV2lkdGggKiBuZXdWaWRlb1JhdGlvQnlXaWR0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOy5tOuplOudvOuKlCDqsIDroZxcbiAgICAgICAgLy8g7IS466GcIFVJICYmIOqwgOuhnCDruYTrlJTsmKRcbiAgICAgICAgLy8g6rCA7J2065OcIOuwleyKpOulvCDruYTrlJTsmKQg7IS466GcIOq4uOydtOyXkCDrp57stqRcbiAgICAgICAgZ3VpZGVCb3hIZWlnaHQgPSBfX2NhbGNHdWlkZUJveENyaXRlcmlhKGNhbGNWaWRlb0NsaWVudEhlaWdodCwgY2FsY1ZpZGVvSGVpZ2h0KTtcbiAgICAgICAgZ3VpZGVCb3hXaWR0aCA9IChndWlkZUJveEhlaWdodCAqIGJhc2VXaWR0aCkgLyBiYXNlSGVpZ2h0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDqsIDroZwgVUlcbiAgICAgIHRoaXMuX19zZXRTdHlsZShjYXB0dXJlVUlXcmFwLCB7XG4gICAgICAgICdqdXN0aWZ5LWNvbnRlbnQnOiAnZW5kJyxcbiAgICAgICAgJ2FsaWduLWl0ZW1zJzogJ2NlbnRlcicsXG4gICAgICB9KTtcbiAgICAgIGlmIChjYWxjVmlkZW9PcmllbnRhdGlvbiA9PT0gdGhpcy5fX3VpT3JpZW50YXRpb24pIHtcbiAgICAgICAgLy8g6rCA66GcIFVJICYmIOqwgOuhnCDruYTrlJTsmKRcbiAgICAgICAgLy8g67mE65SU7Jik66W8IOqwgOuhnCBVSeydmCBoZWlnaHQg6riw7KSA7Jy866GcIOykhOydtOqzoFxuICAgICAgICAvLyDqsIDroZwgVUkgaGVpZ2h0IOq4sOykgOycvOuhnCDruYTrlJTsmKTsnZggd2lkdGgg6rOE7IKwXG5cbiAgICAgICAgLy8g6rCA7J2065Oc67CV7Iqk64qUIOyEuOuhnCDquLDspIDsnLzroZwg66ee7LakXG4gICAgICAgIGd1aWRlQm94SGVpZ2h0ID0gX19jYWxjR3VpZGVCb3hDcml0ZXJpYShjYWxjT2NyQ2xpZW50SGVpZ2h0LCBjYWxjVmlkZW9IZWlnaHQpICogdmlkZW9SYXRpb0J5SGVpZ2h0O1xuICAgICAgICBndWlkZUJveFdpZHRoID0gKGd1aWRlQm94SGVpZ2h0ICogYmFzZVdpZHRoKSAvIGJhc2VIZWlnaHQ7XG5cbiAgICAgICAgLy8g67mE65SU7Jik66W8IOyEuOuhnCDquLDspIDsnLzroZwg64uk7IucIOunnuy2pFxuICAgICAgICBuZXdWaWRlb0hlaWdodCA9IGd1aWRlQm94SGVpZ2h0O1xuICAgICAgICBuZXdWaWRlb1dpZHRoID0gbmV3VmlkZW9IZWlnaHQgKiBuZXdWaWRlb1JhdGlvQnlIZWlnaHQ7XG5cbiAgICAgICAgLy8g6rCA7J2065Oc67CV7Iqk7J2YIOqwgOuhnCDtgazquLDqsIAg6rCA66GcIFVJIHdpZHRoICogcmF0aW8g6rCS67O064ukIO2BrOuptCxcbiAgICAgICAgaWYgKGd1aWRlQm94V2lkdGggPiBfX2NhbGNHdWlkZUJveENyaXRlcmlhKGNhbGNPY3JDbGllbnRXaWR0aCwgY2FsY1ZpZGVvV2lkdGgpICogZ3VpZGVCb3hSYXRpb0J5V2lkdGgpIHtcbiAgICAgICAgICAvLyDqs4TsgrAg67Cp7Iud7J2EIOuwlOq+vOuLpCAo7IKs7JygIDog6rGw7J2YIOygleyCrOqwge2YleyXkCDqsIDquYzsmrQg6rK97JqwIOqwgOydtOuTnCDrsJXsiqQg6rCA66Gc6rCAIOq9ieywqOqyjCDrkKguKVxuICAgICAgICAgIGd1aWRlQm94V2lkdGggPSBfX2NhbGNHdWlkZUJveENyaXRlcmlhKGNhbGNPY3JDbGllbnRXaWR0aCwgY2FsY1ZpZGVvV2lkdGgpICogZ3VpZGVCb3hSYXRpb0J5V2lkdGg7XG4gICAgICAgICAgZ3VpZGVCb3hIZWlnaHQgPSBndWlkZUJveFdpZHRoICogc2Nhbm5lckZyYW1lUmF0aW87XG5cbiAgICAgICAgICAvLyDqsIDsnbTrk5wg67CV7IqkIOqwgOuhnCDquLDspIDsnLzroZwg67mE65SU7JikIO2ZleuMgFxuICAgICAgICAgIG5ld1ZpZGVvV2lkdGggPSBndWlkZUJveFdpZHRoO1xuICAgICAgICAgIG5ld1ZpZGVvSGVpZ2h0ID0gbmV3VmlkZW9XaWR0aCAqIG5ld1ZpZGVvUmF0aW9CeVdpZHRoO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDqsIDroZwgVUkgJiYg7IS466GcIOu5hOuUlOyYpFxuICAgICAgICAvLyDqsIDroZwg6riw7KSA7Jy866GcIOqwgOydtOuTnOuwleyKpCDqs4TsgrBcblxuICAgICAgICAvLyDqsIDsnbTrk5zrsJXsiqTsnZggaGVpZ2h0IO2BrOq4sOulvCBVSeydmCBoZWlnaHQg6riw7KSA7JeQIOunnuy2pFxuICAgICAgICBndWlkZUJveEhlaWdodCA9IF9fY2FsY0d1aWRlQm94Q3JpdGVyaWEoY2FsY09jckNsaWVudEhlaWdodCwgY2FsY1ZpZGVvSGVpZ2h0KSAqIHZpZGVvUmF0aW9CeUhlaWdodDtcbiAgICAgICAgZ3VpZGVCb3hXaWR0aCA9IChndWlkZUJveEhlaWdodCAqIGJhc2VXaWR0aCkgLyBiYXNlSGVpZ2h0O1xuXG4gICAgICAgIC8vIOqwgOydtOuTnOuwleyKpOydmCDqsIDroZwg7YGs6riw6rCAIOqwgOuhnCBVSSB3aWR0aCAqIHJhdGlvIOqwkuuztOuLpCDtgazrqbQsXG4gICAgICAgIGlmIChndWlkZUJveFdpZHRoID4gX19jYWxjR3VpZGVCb3hDcml0ZXJpYShjYWxjT2NyQ2xpZW50V2lkdGgsIGNhbGNWaWRlb1dpZHRoKSAqIGd1aWRlQm94UmF0aW9CeVdpZHRoKSB7XG4gICAgICAgICAgLy8g6rOE7IKwIOuwqeyLneydhCDrsJTqvrzri6QgKOyCrOycoCA6IOqxsOydmCDsoJXsgqzqsIHtmJXsl5Ag6rCA6rmM7Jq0IOqyveyasCDqsIDsnbTrk5wg67CV7IqkIOqwgOuhnOqwgCDqvYnssKjqsowg65CoLilcbiAgICAgICAgICBndWlkZUJveFdpZHRoID0gX19jYWxjR3VpZGVCb3hDcml0ZXJpYShjYWxjT2NyQ2xpZW50V2lkdGgsIGNhbGNWaWRlb1dpZHRoKSAqIGd1aWRlQm94UmF0aW9CeVdpZHRoO1xuICAgICAgICAgIGd1aWRlQm94SGVpZ2h0ID0gZ3VpZGVCb3hXaWR0aCAqIHNjYW5uZXJGcmFtZVJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6rCA7J2065OcIOuwleyKpCDqsIDroZwg6riw7KSA7Jy866GcIOu5hOuUlOyYpCDstpXshoxcbiAgICAgICAgbmV3VmlkZW9XaWR0aCA9IGd1aWRlQm94V2lkdGg7XG4gICAgICAgIG5ld1ZpZGVvSGVpZ2h0ID0gbmV3VmlkZW9XaWR0aCAqIG5ld1ZpZGVvUmF0aW9CeVdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNhbGNHdWlkZUJveENyaXRlcmlhKOy5tOuplOudvCDtlbTsg4Hrj4Qg7ISk7KCVIOq4sOykgCnqsIAgb2NyVmlld1NpemUo7ZmU66m0IO2BrOq4sCkg6riw7KSA7J2865WMXG4gICAgaWYgKHRoaXMuX19vcHRpb25zLmNhbGNHdWlkZUJveENyaXRlcmlhID09PSAnb2NyVmlld1NpemUnKSB7XG4gICAgICAvLyBndWlkZUJveEhlaWdodCDsnbQgY2FsY09jckNsaWVudEhlaWdodCDrs7Tri6Qg7YGw6rK97JqwKOqwgOydtOuTnOuwleyKpOqwgCDtmZTrqbTsnYQg64SY7Ja06rCA64qUIOqyveyasCkg64uk7IucIOqzhOyCsFxuICAgICAgaWYgKGd1aWRlQm94SGVpZ2h0ID4gY2FsY09jckNsaWVudEhlaWdodCkge1xuICAgICAgICBndWlkZUJveEhlaWdodCA9IE1hdGgubWluKGNhbGNPY3JDbGllbnRIZWlnaHQsIGNhbGNWaWRlb0hlaWdodCkgKiB2aWRlb1JhdGlvQnlIZWlnaHQ7XG4gICAgICAgIGd1aWRlQm94V2lkdGggPSAoZ3VpZGVCb3hIZWlnaHQgKiBiYXNlV2lkdGgpIC8gYmFzZUhlaWdodDtcblxuICAgICAgICBuZXdWaWRlb1dpZHRoID0gZ3VpZGVCb3hXaWR0aDtcbiAgICAgICAgbmV3VmlkZW9IZWlnaHQgPSBuZXdWaWRlb1dpZHRoICogbmV3VmlkZW9SYXRpb0J5V2lkdGg7XG4gICAgICB9XG5cbiAgICAgIC8vIGd1aWRlQm94SGVpZ2h0IOydtCBjYWxjT2NyQ2xpZW50SGVpZ2h0IOuztOuLpCDtgbDqsr3smrAo6rCA7J2065Oc67CV7Iqk6rCAIO2ZlOuptOydhCDrhJjslrTqsIDripQg6rK97JqwKSDri6Tsi5wg6rOE7IKwXG4gICAgICBpZiAoZ3VpZGVCb3hXaWR0aCA+IGNhbGNPY3JDbGllbnRXaWR0aCkge1xuICAgICAgICBndWlkZUJveFdpZHRoID0gTWF0aC5taW4oY2FsY09jckNsaWVudFdpZHRoLCBjYWxjVmlkZW9XaWR0aCkgKiBndWlkZUJveFJhdGlvQnlXaWR0aDtcbiAgICAgICAgZ3VpZGVCb3hIZWlnaHQgPSBndWlkZUJveFdpZHRoICogc2Nhbm5lckZyYW1lUmF0aW87XG5cbiAgICAgICAgbmV3VmlkZW9XaWR0aCA9IGd1aWRlQm94V2lkdGg7XG4gICAgICAgIG5ld1ZpZGVvSGVpZ2h0ID0gbmV3VmlkZW9XaWR0aCAqIG5ld1ZpZGVvUmF0aW9CeVdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX19jcm9wSW1hZ2VTaXplV2lkdGggPSBNYXRoLm1pbihndWlkZUJveFdpZHRoLCBuZXdWaWRlb1dpZHRoKTtcbiAgICB0aGlzLl9fY3JvcEltYWdlU2l6ZUhlaWdodCA9IE1hdGgubWluKGd1aWRlQm94SGVpZ2h0LCBuZXdWaWRlb0hlaWdodCk7XG5cbiAgICBpZiAodGhpcy5fX2lzUm90YXRlZDkwb3IyNzApIHtcbiAgICAgIFtuZXdWaWRlb1dpZHRoLCBuZXdWaWRlb0hlaWdodF0gPSBbbmV3VmlkZW9IZWlnaHQsIG5ld1ZpZGVvV2lkdGhdO1xuICAgIH1cblxuICAgIGd1aWRlQm94V2lkdGggKz0gYm9yZGVyV2lkdGggKiAyO1xuICAgIGd1aWRlQm94SGVpZ2h0ICs9IGJvcmRlcldpZHRoICogMjtcblxuICAgIGNvbnN0IHJlZHVjZWRHdWlkZUJveFdpZHRoID0gZ3VpZGVCb3hXaWR0aCAqIHRoaXMuX19ndWlkZUJveFJlZHVjZVJhdGlvO1xuICAgIGNvbnN0IHJlZHVjZWRHdWlkZUJveEhlaWdodCA9IGd1aWRlQm94SGVpZ2h0ICogdGhpcy5fX2d1aWRlQm94UmVkdWNlUmF0aW87XG5cbiAgICBpZiAodG9wVUkpIHtcbiAgICAgIHRoaXMuX19zZXRTdHlsZSh0b3BVSSwge1xuICAgICAgICAncGFkZGluZy1ib3R0b20nOiAnMTBweCcsXG4gICAgICAgIGhlaWdodDogKGNhbGNPY3JDbGllbnRIZWlnaHQgLSBndWlkZUJveEhlaWdodCkgLyAyICsgJ3B4JyxcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAnZmxleC1kaXJlY3Rpb24nOiAnY29sdW1uLXJldmVyc2UnLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1pZGRsZVVJKSB7XG4gICAgICB0aGlzLl9fc2V0U3R5bGUobWlkZGxlVUksIHtcbiAgICAgICAgd2lkdGg6IHJlZHVjZWRHdWlkZUJveFdpZHRoIC0gYm9yZGVyV2lkdGggKiAyICsgJ3B4JyxcbiAgICAgICAgaGVpZ2h0OiByZWR1Y2VkR3VpZGVCb3hIZWlnaHQgLSBib3JkZXJXaWR0aCAqIDIgKyAncHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICdhbGlnbi1pdGVtcyc6ICdjZW50ZXInLFxuICAgICAgICAnanVzdGlmeS1jb250ZW50JzogJ2NlbnRlcicsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4JyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChib3R0b21VSSkge1xuICAgICAgdGhpcy5fX3NldFN0eWxlKGJvdHRvbVVJLCB7XG4gICAgICAgICdwYWRkaW5nLXRvcCc6ICcxMHB4JyxcbiAgICAgICAgaGVpZ2h0OiAoY2FsY09jckNsaWVudEhlaWdodCAtIGd1aWRlQm94SGVpZ2h0KSAvIDIgKyAncHgnLFxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICdmbGV4LWRpcmVjdGlvbic6ICdjb2x1bW4nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fX3NldFN0eWxlKHZpZGVvLCB7XG4gICAgICB3aWR0aDogbmV3VmlkZW9XaWR0aCArICdweCcsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9fc2V0U3R5bGUodmlkZW8sIHtcbiAgICAgIGhlaWdodDogbmV3VmlkZW9IZWlnaHQgKyAncHgnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdmlkZW9Jbm5lckdhcCA9IDI7IC8vIOuvuOyEuO2VmOqyjCBtYXNrQm94SW5uZXLrs7Tri6QgZ3VpZGVCb3jqsIAg7J6R7J2A6rKDIOuztOyglVxuICAgIHRoaXMuX19zZXRTdHlsZShndWlkZUJveCwge1xuICAgICAgd2lkdGg6IHJlZHVjZWRHdWlkZUJveFdpZHRoIC0gdmlkZW9Jbm5lckdhcCArICdweCcsXG4gICAgICBoZWlnaHQ6IHJlZHVjZWRHdWlkZUJveEhlaWdodCAtIHZpZGVvSW5uZXJHYXAgKyAncHgnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWFza0JveElubmVyID0gbWFza0JveFdyYXAucXVlcnlTZWxlY3RvcignI21hc2tCb3hJbm5lcicpO1xuICAgIGxldCByID0gYm9yZGVyUmFkaXVzIC0gYm9yZGVyV2lkdGggKiAyO1xuICAgIHIgPSByIDwgMCA/IDAgOiByO1xuICAgIGlmICghaXNOYU4ocmVkdWNlZEd1aWRlQm94V2lkdGgpICYmICFpc05hTihyZWR1Y2VkR3VpZGVCb3hIZWlnaHQpICYmICFpc05hTihib3JkZXJSYWRpdXMpICYmICFpc05hTihib3JkZXJXaWR0aCkpIHtcbiAgICAgIGNvbnN0IG1hc2tCb3hJbm5lcldpZHRoID0gTWF0aC5tYXgocmVkdWNlZEd1aWRlQm94V2lkdGggLSBib3JkZXJXaWR0aCAqIDIgLSB2aWRlb0lubmVyR2FwLCAwKTtcbiAgICAgIGNvbnN0IG1hc2tCb3hJbm5lckhlaWdodCA9IE1hdGgubWF4KHJlZHVjZWRHdWlkZUJveEhlaWdodCAtIGJvcmRlcldpZHRoICogMiAtIHZpZGVvSW5uZXJHYXAsIDApO1xuXG4gICAgICBtYXNrQm94SW5uZXIuc2V0QXR0cmlidXRlKCd3aWR0aCcsIG1hc2tCb3hJbm5lcldpZHRoICsgJycpO1xuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgbWFza0JveElubmVySGVpZ2h0ICsgJycpO1xuICAgICAgbWFza0JveElubmVyLnNldEF0dHJpYnV0ZSgneCcsIChtYXNrQm94SW5uZXJXaWR0aCAvIDIpICogLTEgKyAnJyk7XG4gICAgICBtYXNrQm94SW5uZXIuc2V0QXR0cmlidXRlKCd5JywgKG1hc2tCb3hJbm5lckhlaWdodCAvIDIpICogLTEgKyAnJyk7XG4gICAgICBtYXNrQm94SW5uZXIuc2V0QXR0cmlidXRlKCdyeCcsIHIgKyAnJyk7XG4gICAgICBtYXNrQm94SW5uZXIuc2V0QXR0cmlidXRlKCdyeScsIHIgKyAnJyk7XG4gICAgfVxuXG4gICAgLy8g7IiY64+ZIOy0rOyYgSBVSSDsgqzsmqlcbiAgICAvLyBmaXJzdENhbGxlZOyduCDqsr3smrAg7JWE7KeBIGNhcHR1cmVVSeqwgCDqt7jroKTsp4Dsp4Ag7JWK7JWEIOustOydmOuvuFxuICAgIGlmICh0aGlzLl9fb3B0aW9ucy51c2VDYXB0dXJlVUkpIHtcbiAgICAgIHRoaXMuX19zZXRTdHlsZShjYXB0dXJlVUksIHsgZGlzcGxheTogJycgfSk7XG5cbiAgICAgIGlmICh0aGlzLl9fdWlPcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0JyAmJiBib3R0b21VSSAmJiBjYXB0dXJlVUkpIHtcbiAgICAgICAgY29uc3QgY2FsY1N1bU9mSGVpZ2h0Qm90dG9tVUlDaGlsZE5vZGVzID0gdGhpcy5fX2NhbGNTdW1PZkhlaWdodENoaWxkTm9kZXMoYm90dG9tVUkpO1xuXG4gICAgICAgIGxldCBjYWxjQ2FwdHVyZUJ1dHRvbkhlaWdodCA9IGNhcHR1cmVCdXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJykuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICAgICAgY2FsY0NhcHR1cmVCdXR0b25IZWlnaHQgPSBjYWxjQ2FwdHVyZUJ1dHRvbkhlaWdodCA9PT0gMCA/IDgwIDogY2FsY0NhcHR1cmVCdXR0b25IZWlnaHQ7XG5cbiAgICAgICAgbGV0IGNhcHR1cmVVSVBhZGRpbmdCb3R0b20gPSBib3R0b21VSS5jbGllbnRIZWlnaHQ7XG4gICAgICAgIGNhcHR1cmVVSVBhZGRpbmdCb3R0b20gLT0gaXNOYU4ocGFyc2VJbnQoYm90dG9tVUkuc3R5bGUucGFkZGluZ1RvcCkpID8gMCA6IHBhcnNlSW50KGJvdHRvbVVJLnN0eWxlLnBhZGRpbmdUb3ApO1xuICAgICAgICBjYXB0dXJlVUlQYWRkaW5nQm90dG9tIC09IGNhbGNTdW1PZkhlaWdodEJvdHRvbVVJQ2hpbGROb2RlcztcbiAgICAgICAgY2FwdHVyZVVJUGFkZGluZ0JvdHRvbSAtPSBjYWxjQ2FwdHVyZUJ1dHRvbkhlaWdodDtcblxuICAgICAgICBjb25zdCBiYXNlbGluZSA9IGNhbGNPY3JDbGllbnRIZWlnaHQgLSAoY2FsY09jckNsaWVudEhlaWdodCAvIDIgKyBndWlkZUJveEhlaWdodCAvIDIpO1xuICAgICAgICBpZiAoY2FwdHVyZVVJUGFkZGluZ0JvdHRvbSA+IDAgJiYgY2FwdHVyZVVJUGFkZGluZ0JvdHRvbSA8IGJhc2VsaW5lKSB7XG4gICAgICAgICAgdGhpcy5fX3NldFN0eWxlKGNhcHR1cmVVSSwge1xuICAgICAgICAgICAgJ3BhZGRpbmctcmlnaHQnOiAnJyxcbiAgICAgICAgICAgICdwYWRkaW5nLWJvdHRvbSc6IGNhcHR1cmVVSVBhZGRpbmdCb3R0b20gKyAncHgnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fc2V0U3R5bGUoY2FwdHVyZVVJLCB7XG4gICAgICAgICAgJ3BhZGRpbmctcmlnaHQnOiAnMTBweCcsXG4gICAgICAgICAgJ3BhZGRpbmctYm90dG9tJzogJycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLl9faW5Qcm9ncmVzc1N0ZXAsIHRydWUpO1xuICAgIGNvbnNvbGUuZGVidWcoJ2FkanVzdFN0eWxlIC0gRU5EJyk7XG4gIH1cblxuICBfX2NhbGNTdW1PZkhlaWdodENoaWxkTm9kZXMob2JqKSB7XG4gICAgbGV0IHN1bSA9IDA7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIG9iaj8uY2hpbGROb2Rlcykge1xuICAgICAgc3VtICs9IGl0ZW0uY2xpZW50SGVpZ2h0ID8gaXRlbS5jbGllbnRIZWlnaHQgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gc3VtO1xuICB9XG5cbiAgX19jbG9zZUNhbWVyYSgpIHtcbiAgICB0aGlzLl9fY2xlYXJDYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKCk7XG4gICAgdGhpcy5zdG9wU2NhbigpO1xuICAgIHRoaXMuc3RvcFN0cmVhbSgpO1xuICB9XG5cbiAgYXN5bmMgX19sb2FkUmVzb3VyY2VzKCkge1xuICAgIGNvbnNvbGUubG9nKCdsb2FkUmVzb3VyY2VzKCkgU1RBUlQnKTtcbiAgICBpZiAodGhpcy5fX3Jlc291cmNlc0xvYWRlZCkge1xuICAgICAgY29uc29sZS5sb2coJ2xvYWRSZXNvdXJjZSgpIFNLSVAsIGFscmVhZHkgbG9hZGVkIScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9faXNTdXBwb3J0U2ltZCA9IGF3YWl0IHNpbWQoKTtcblxuICAgIGxldCBlbnZJbmZvID0gJyc7XG4gICAgZW52SW5mbyArPSBgb3MgOiAke3RoaXMuX19kZXZpY2VJbmZvLm9zfVxcbmA7XG4gICAgZW52SW5mbyArPSBgb3NTaW1wbGUgOiAke3RoaXMuX19kZXZpY2VJbmZvLm9zU2ltcGxlfVxcbmA7XG4gICAgZW52SW5mbyArPSBgaXNTdXBwb3J0V2FzbTogJHt0aGlzLl9faXNTdXBwb3J0V2FzbX1cXG5gO1xuICAgIGVudkluZm8gKz0gYHNpbWQod2FzbS1mZWF0dXJlLWRldGVjdCkgOiAke3RoaXMuX19pc1N1cHBvcnRTaW1kfVxcbmA7XG4gICAgaWYgKHRoaXMuX19kZXZpY2VJbmZvLm9zU2ltcGxlID09PSAnSU9TJyB8fCB0aGlzLl9fZGV2aWNlSW5mby5vc1NpbXBsZSA9PT0gJ01BQycpIHtcbiAgICAgIHRoaXMuX19pc1N1cHBvcnRTaW1kID0gZmFsc2U7XG4gICAgfVxuICAgIGVudkluZm8gKz0gYGlzU3VwcG9ydFNpbWQoZmluYWwpIDogJHt0aGlzLl9faXNTdXBwb3J0U2ltZH1cXG5gO1xuICAgIGVudkluZm8gKz0gYFVzZXJBZ2VudCA6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5gO1xuXG4gICAgY29uc29sZS5sb2coJz09PT09PSBlbnZJbmZvID09PT09PVxcbicgKyBlbnZJbmZvKTtcbiAgICB0aGlzLl9fZGVidWcoZW52SW5mbyk7XG4gICAgd2luZG93LnVzZWJPQ1JFbnZJbmZvID0gZW52SW5mbztcbiAgICBsZXQgc2RrU3VwcG9ydEVudiA9ICdxdXJhbSc7XG5cbiAgICBpZiAodGhpcy5fX2lzU3VwcG9ydFNpbWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCchISEgYXBwbGllZCBzaW1kICEhIScpO1xuICAgICAgc2RrU3VwcG9ydEVudiArPSAnX3NpbWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnISEhIG5vdCBhcHBsaWVkIHNpbWQgISEhJyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCc9PT09PT0gZW52SW5mbyA9PT09PT1cXG4nICsgZW52SW5mbyk7XG4gICAgd2luZG93LnVzZWJPQ1JFbnZJbmZvID0gZW52SW5mbztcbiAgICBjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT09XFxuJyArIGVudkluZm8pO1xuXG4gICAgbGV0IHBvc3RmaXggPSAnJztcbiAgICBpZiAodGhpcy5fX29wdGlvbnMuZm9yY2Vfd2FzbV9yZWxvYWQpIHtcbiAgICAgIC8vIOyYteyFmOydtCDtmZzshLHtmZQg65CY66m0IOyDiOuhnOyatCBXQVNNIOumrOyGjOyKpOulvCDsmpTssq3tlaguXG4gICAgICBwb3N0Zml4ID0gJz92ZXI9JyArIHRoaXMuX19vcHRpb25zLmZvcmNlX3dhc21fcmVsb2FkX2ZsYWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZ2V0RmlsZVhIUihwYXRoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoKTtcbiAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHNka1N1cHBvcnRFbnYgKyAnLmpzJyArIHBvc3RmaXgsIHRoaXMuX19vcHRpb25zLnJlc291cmNlQmFzZVVybCk7XG4gICAgLy8gbGV0IHNyYyA9IGF3YWl0IGZldGNoKHVybC5ocmVmKVxuICAgIGxldCBzcmMgPSBhd2FpdCBnZXRGaWxlWEhSKHVybC5ocmVmKVxuICAgICAgLy8gLnRoZW4oKHJlcykgPT4gcmVzLnRleHQoKSlcbiAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgIGxldCByZWdleCA9IC8oLiopID0gTW9kdWxlLmN3cmFwL2dtO1xuICAgICAgICBsZXQgc291cmNlID0gdGV4dC5yZXBsYWNlKHJlZ2V4LCAnTW9kdWxlLiQxID0gTW9kdWxlLmN3cmFwJyk7XG5cbiAgICAgICAgLy8gZGF0YShtb2RlbClcbiAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoXG4gICAgICAgICAgL15cXChmdW5jdGlvblxcKFxcKSBcXHsvbSxcbiAgICAgICAgICAndmFyIGNyZWF0ZU1vZGVsRGF0YSA9IGFzeW5jIGZ1bmN0aW9uKCkge1xcbicgKyAnIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XFxuJ1xuICAgICAgICApO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShcbiAgICAgICAgICAnICAgY29uc29sZS5lcnJvcihcInBhY2thZ2UgZXJyb3I6XCIsIGVycm9yKTsnLFxuICAgICAgICAgICcgICByZWplY3QoKTtcXG4nICsgJyAgIGNvbnNvbGUuZXJyb3IoXCJwYWNrYWdlIGVycm9yOlwiLCBlcnJvcik7J1xuICAgICAgICApO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgnICB9LCBoYW5kbGVFcnJvciknLCAnICByZXNvbHZlKCk7XFxuJyArICcgIH0sIGhhbmRsZUVycm9yKScpO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXlxcfVxcKVxcKFxcKTsvbSwgJ1xcbiB9KVxcbicgKyAnfTsnKTtcblxuICAgICAgICAvLyB3YXNtXG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKFxuICAgICAgICAgIHNka1N1cHBvcnRFbnYgKyAnLndhc20nLFxuICAgICAgICAgIG5ldyBVUkwoc2RrU3VwcG9ydEVudiArICcud2FzbScgKyBwb3N0Zml4LCB0aGlzLl9fb3B0aW9ucy5yZXNvdXJjZUJhc2VVcmwpLmhyZWZcbiAgICAgICAgKTtcbiAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChgUkVNT1RFX1BBQ0tBR0VfQkFTRSA9IFsnXCJdJHtzZGtTdXBwb3J0RW52fVxcXFwuZGF0YVtcIiddYCwgJ2dtJyksXG4gICAgICAgICAgYFJFTU9URV9QQUNLQUdFX0JBU0UgPSBcIiR7bmV3IFVSTChzZGtTdXBwb3J0RW52ICsgJy5kYXRhJyArIHBvc3RmaXgsIHRoaXMuX19vcHRpb25zLnJlc291cmNlQmFzZVVybCkuaHJlZn1cImBcbiAgICAgICAgKTtcbiAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoJ2Z1bmN0aW9uIGNyZWF0ZVdhc20nLCAnYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2FzbScpO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgnaW5zdGFudGlhdGVBc3luYygpOycsICdhd2FpdCBpbnN0YW50aWF0ZUFzeW5jKCk7Jyk7XG5cbiAgICAgICAgLy8gd2FzbSBhbmQgZGF0YShtb2RlbCkgZmlsZSDrs5HroKzroZwgZmV0Y2gg7ZWY6riwIOychO2VtFxuICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShcbiAgICAgICAgICAndmFyIGFzbSA9IGNyZWF0ZVdhc20oKTsnLFxuICAgICAgICAgICdjb25zb2xlLmxvZyhcImNyZWF0ZSB3YXNtIGFuZCBkYXRhIC0gc3RhcnRcIilcXG4nICtcbiAgICAgICAgICAgICdhd2FpdCAoYXN5bmMgZnVuY3Rpb24oKSB7XFxuJyArXG4gICAgICAgICAgICAnICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xcbicgK1xuICAgICAgICAgICAgJyAgICB2YXIgaXNDcmVhdGVkV2FzbSA9IGZhbHNlO1xcbicgK1xuICAgICAgICAgICAgJyAgICB2YXIgaXNDcmVhdGVkRGF0YSA9IGZhbHNlO1xcbicgK1xuICAgICAgICAgICAgJyAgICBjcmVhdGVXYXNtKCkudGhlbigoKSA9PiB7XFxuJyArXG4gICAgICAgICAgICAnICAgICAgaXNDcmVhdGVkV2FzbSA9IHRydWU7XFxuJyArXG4gICAgICAgICAgICAnICAgICAgaWYgKGlzQ3JlYXRlZERhdGEpIHsgcmVzb2x2ZSgpOyB9XFxuJyArXG4gICAgICAgICAgICAnICAgIH0pO1xcbicgK1xuICAgICAgICAgICAgJyAgICBjcmVhdGVNb2RlbERhdGEoKS50aGVuKCgpID0+IHtcXG4nICtcbiAgICAgICAgICAgICcgICAgICBpc0NyZWF0ZWREYXRhID0gdHJ1ZTtcXG4nICtcbiAgICAgICAgICAgICcgICAgICBpZiAoaXNDcmVhdGVkV2FzbSkgeyByZXNvbHZlKCk7IH1cXG4nICtcbiAgICAgICAgICAgICcgICAgfSlcXG4nICtcbiAgICAgICAgICAgICcgIH0pO1xcbicgK1xuICAgICAgICAgICAgJ30pKCk7XFxuJyArXG4gICAgICAgICAgICAnY29uc29sZS5sb2coXCJjcmVhdGUgd2FzbSBhbmQgZGF0YSAtIGVuZFwiKSdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgIH0pO1xuXG4gICAgc3JjID0gYFxuICAgIChhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICR7c3JjfVxuICAgICAgTW9kdWxlLmxlbmd0aEJ5dGVzVVRGOCA9IGxlbmd0aEJ5dGVzVVRGOFxuICAgICAgTW9kdWxlLnN0cmluZ1RvVVRGOCA9IHN0cmluZ1RvVVRGOFxuICAgICAgcmV0dXJuIE1vZHVsZVxuICAgIH0pKClcbiAgICAgICAgYDtcbiAgICB0aGlzLl9fT0NSRW5naW5lID0gYXdhaXQgZXZhbChzcmMpO1xuXG4gICAgdGhpcy5fX09DUkVuZ2luZS5vblJ1bnRpbWVJbml0aWFsaXplZCA9IGFzeW5jIChfKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnV0FTTSAtIG9uUnVudGltZUluaXRpYWxpemVkKCknKTtcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMuX19PQ1JFbmdpbmUub25SdW50aW1lSW5pdGlhbGl6ZWQoKTtcblxuICAgIHRoaXMuX19yZXNvdXJjZXNMb2FkZWQgPSB0cnVlO1xuICAgIGNvbnNvbGUubG9nKCdsb2FkUmVzb3VyY2VzKCkgRU5EJyk7XG4gIH1cblxuICAvLyB3YXNt7JeQ7IScIOydtOuvuOyngOulvCDrsJTroZwg7IOd7ISx7ZWg65WMIGJhc2U2NCDsnbjsvZTrlKnsi5wgcHJlZml46rCAIOyXhuuKlCDqsr3smrAg64Sj7Ja07KSMXG4gIF9fb2NySW1hZ2VHdWFyZChpbWFnZSkge1xuICAgIGNvbnN0IHByZWZpeCA9ICdkYXRhOmltYWdlL2pwZWc7YmFzZTY0LCc7XG4gICAgaWYgKGltYWdlKSB7XG4gICAgICByZXR1cm4gaW1hZ2UuaW5kZXhPZihwcmVmaXgpID09PSAwID8gaW1hZ2UgOiBwcmVmaXggKyBpbWFnZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgX19zdGFydFNjYW5XYXNtSW1wbCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5fX2RldGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnNldElnbm9yZUNvbXBsZXRlKGZhbHNlKTtcbiAgICAgIHRoaXMuX19zZXR1cEVuY3J5cHRNb2RlKCk7XG4gICAgICB0aGlzLl9fc2V0dXBJbWFnZU1vZGUoKTtcbiAgICAgIHRoaXMuX19ibHVyQ2FwdHVyZUJ1dHRvbigpO1xuICAgICAgdGhpcy5fX2FkZHJlc3MgPSAwO1xuICAgICAgdGhpcy5fX3BhZ2VFbmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19tYW51YWxPQ1JSZXRyeUNvdW50ID0gMDtcbiAgICAgIHRoaXMuX19zc2FSZXRyeUNvdW50ID0gMDtcblxuICAgICAgY29uc3Qgc2NhbiA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgb2NyUmVzdWx0ID0gbnVsbCxcbiAgICAgICAgICAgIGlzRGV0ZWN0ZWRDYXJkID0gbnVsbCxcbiAgICAgICAgICAgIGltZ0RhdGEgPSBudWxsLFxuICAgICAgICAgICAgaW1nRGF0YVVybCA9IG51bGwsXG4gICAgICAgICAgICBzc2FSZXN1bHQgPSBudWxsLFxuICAgICAgICAgICAgc3NhUmVzdWx0TGlzdCA9IFtdLFxuICAgICAgICAgICAgbWFza0luZm8gPSBudWxsO1xuXG4gICAgICAgICAgLy8gYXdhaXQgdGhpcy5fX2NoYW5nZVN0YWdlKElOX1BST0dSRVNTLlJFQURZKTtcbiAgICAgICAgICBpZiAoIXRoaXMuX19PQ1JFbmdpbmVbJ2FzbSddKSByZXR1cm47XG5cbiAgICAgICAgICAvLyBUT0RPIDog7ISk7KCV7ZWg7IiYIOyeiOqyjCDrs4Dqsr0gIGRlZmF1bHQg6rCS64+EIOygnOqztVxuICAgICAgICAgIGNvbnN0IFtyZXNvbHV0aW9uX3csIHJlc29sdXRpb25faF0gPSBbdGhpcy5fX3Jlc29sdXRpb25XaWR0aCwgdGhpcy5fX3Jlc29sdXRpb25IZWlnaHRdO1xuICAgICAgICAgIGNvbnN0IHsgdmlkZW8gfSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCk7XG4gICAgICAgICAgaWYgKHJlc29sdXRpb25fdyA9PT0gMCB8fCByZXNvbHV0aW9uX2ggPT09IDApIHJldHVybjtcblxuICAgICAgICAgIGlmICh0aGlzLl9fZGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX19zbGVlcCgxMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnYWRkcmVzcyBiZWZvcmUgLS0tLS0tLS0tJywgYWRkcmVzcyk7XG4gICAgICAgICAgaWYgKHRoaXMuX19hZGRyZXNzID09PSAwICYmICF0aGlzLl9fcGFnZUVuZCAmJiAoYXdhaXQgdGhpcy5fX2lzVmlkZW9SZXNvbHV0aW9uQ29tcGF0aWJsZSh2aWRlbykpKSB7XG4gICAgICAgICAgICBbdGhpcy5fX2FkZHJlc3MsIHRoaXMuX19kZXN0cm95U2Nhbm5lckNhbGxiYWNrXSA9IHRoaXMuX19nZXRTY2FubmVyQWRkcmVzcyh0aGlzLl9fb2NyVHlwZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCF0aGlzLl9fYWRkcmVzcyB8fCB0aGlzLl9fcGFnZUVuZCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fX3NsZWVwKDEwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhZGRyZXNzIGFmdGVyIC0tLS0tLS0tLScsIGFkZHJlc3MpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX19vY3JTdGF0dXMgPCB0aGlzLk9DUl9TVEFUVVMuT0NSX1NVQ0NFU1MpIHtcbiAgICAgICAgICAgIC8vIE9DUiDsmYTro4wg7J207KCEIOyDge2DnFxuXG4gICAgICAgICAgICAvLyBjYXJkIG5vdCBkZXRlY3RlZFxuICAgICAgICAgICAgW2lzRGV0ZWN0ZWRDYXJkLCBpbWdEYXRhLCBpbWdEYXRhVXJsXSA9IGF3YWl0IHRoaXMuX19pc0NhcmRib3hEZXRlY3RlZCh0aGlzLl9fYWRkcmVzcywgMCk7XG4gICAgICAgICAgICBpZiAoIWlzRGV0ZWN0ZWRDYXJkKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9faW5Qcm9ncmVzc1N0ZXAgIT09IHRoaXMuSU5fUFJPR1JFU1MuUkVBRFkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9fY2hhbmdlU3RhZ2UodGhpcy5JTl9QUk9HUkVTUy5DQVJEX0RFVEVDVF9GQUlMRUQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9faXNDbGlja2VkQ2FwdHVyZUJ1dHRvbigpKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX2NoYW5nZVN0YWdlKHRoaXMuSU5fUFJPR1JFU1MuTUFOVUFMX0NBUFRVUkVfRkFJTEVELCBmYWxzZSwgaW1nRGF0YVVybCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2JsdXJDYXB0dXJlQnV0dG9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJZ25vcmVDb21wbGV0ZShmYWxzZSk7IC8vIO2VhOyalO2VnOqwgD9cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNhcmQgaXMgZGV0ZWN0ZWRcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLkNBUkRfREVURUNUX1NVQ0NFU1MpO1xuXG4gICAgICAgICAgICAvLyBzc2EgcmV0cnkg7ISk7KCV7J20IOuQmOyWtCDsnojsnLzqsbDrgpgsIOyImOuPmey0rOyYgVVJ66W8IOyCrOyaqe2VmOuKlCDqsr3smrAsIGNhcmQgZGV0ZWN0IOyEseqzteyLnCDsnbTrr7jsp4Ag7KCA7J6lXG4gICAgICAgICAgICB0aGlzLl9fZW5xdWV1ZURldGVjdGVkQ2FyZFF1ZXVlKGltZ0RhdGEpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzQ2xpY2tlZENhcHR1cmVCdXR0b24oKSkge1xuICAgICAgICAgICAgICB0aGlzLnNldElnbm9yZUNvbXBsZXRlKHRydWUpO1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9fY2hhbmdlU3RhZ2UodGhpcy5JTl9QUk9HUkVTUy5NQU5VQUxfQ0FQVFVSRV9TVUNDRVNTLCBmYWxzZSwgaW1nRGF0YVVybCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9jclJlc3VsdCA9IGF3YWl0IHRoaXMuX19zdGFydFJlY29nbml0aW9uKFxuICAgICAgICAgICAgICB0aGlzLl9fYWRkcmVzcyxcbiAgICAgICAgICAgICAgdGhpcy5fX29jclR5cGUsXG4gICAgICAgICAgICAgIHRoaXMuX19zc2FNb2RlLFxuICAgICAgICAgICAgICB0aGlzLl9faXNDbGlja2VkQ2FwdHVyZUJ1dHRvbigpLFxuICAgICAgICAgICAgICBpbWdEYXRhLFxuICAgICAgICAgICAgICBpbWdEYXRhVXJsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBpZiAodGhpcy5fX2lzQ2xpY2tlZENhcHR1cmVCdXR0b24oKSkge1xuICAgICAgICAgICAgLy8gICB0aGlzLl9fYmx1ckNhcHR1cmVCdXR0b24oKTtcbiAgICAgICAgICAgIC8vICAgdGhpcy5zZXRJZ25vcmVDb21wbGV0ZShmYWxzZSk7ICAgICAgICAvLyDtlYTsmpTtlZzqsIA/XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuX19vY3JTdGF0dXMgPj0gdGhpcy5PQ1JfU1RBVFVTLk9DUl9TVUNDRVNTKSB7XG4gICAgICAgICAgICAvLyBvY3Ig7JmE66OMIOydtO2bhCDsg4Htg5xcblxuICAgICAgICAgICAgLy8gZmFpbHVyZSBjYXNlXG4gICAgICAgICAgICBpZiAob2NyUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE9DUiBTdGF0dXMgaXMgJHt0aGlzLl9fb2NyU3RhdHVzfSwgYnV0IG9jclJlc3VsdCBpcyBmYWxzZWApOyAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3VjY2VzcyBjYXNlXG4gICAgICAgICAgICB0aGlzLl9fc2V0U3R5bGUodmlkZW8sIHsgZGlzcGxheTogJ25vbmUnIH0pOyAvLyBPQ1Ig7JmE66OMIOyLnOygkOyXkCBjYW1lcmEgcHJldmlldyBvZmZcblxuICAgICAgICAgICAgaWYgKHRoaXMuX19zc2FNb2RlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAhISEgc3NhUmV0cnlDb3VudCA6ICR7dGhpcy5fX3NzYVJldHJ5Q291bnR9ICEhIWApO1xuICAgICAgICAgICAgICAvLyDstZzstIgg7Iuc64+EXG4gICAgICAgICAgICAgIHNzYVJlc3VsdCA9IGF3YWl0IHRoaXMuX19zdGFydFRydXRoKHRoaXMuX19vY3JUeXBlLHRoaXMuX19hZGRyZXNzKTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgICAgIGlmIChzc2FSZXN1bHQgPT09IG51bGwpIHRocm93IG5ldyBFcnJvcignW0VSUl0gU1NBIE1PREUgaXMgdHJ1ZS4gYnV0LCBzc2FSZXN1bHQgaXMgbnVsbCcpOyAvLyBwcmV0dGllci1pZ25vcmVcblxuICAgICAgICAgICAgICBzc2FSZXN1bHRMaXN0LnB1c2goc3NhUmVzdWx0KTtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5fX29wdGlvbnMuc3NhTWF4UmV0cnlDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmV0cnlTdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgRkFLRSA9IHRoaXMuX19vcHRpb25zLnNzYVJldHJ5VHlwZSA9PT0gJ0ZBS0UnO1xuICAgICAgICAgICAgICAgIGNvbnN0IFJFQUwgPSB0aGlzLl9fb3B0aW9ucy5zc2FSZXRyeVR5cGUgPT09ICdSRUFMJztcbiAgICAgICAgICAgICAgICBjb25zdCBFTlNFTUJMRSA9IHRoaXMuX19vcHRpb25zLnNzYVJldHJ5VHlwZSA9PT0gJ0VOU0VNQkxFJztcblxuICAgICAgICAgICAgICAgIGxldCBpc0NvbXBsZXRlZCA9IGZhbHNlOyAvLyDruYTrj5nquLAgZm9yIOusuCDrlYzrrLjsl5AgYnJlYWvqsIAg7JWI6rG466as64qUIOydtOyKiOuhnCDrhKPsnYxcblxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLl9fZGV0ZWN0ZWRDYXJkUXVldWUpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgISEhIFtSRVRSWSBjb21wbGV0ZWRdICR7c3NhUmVzdWx0fSwgcmV0cnkgY291bnQgaXMgJHt0aGlzLl9fc3NhUmV0cnlDb3VudH0gISEhYCk7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19zc2FSZXRyeUNvdW50ID09PSB0aGlzLl9fb3B0aW9ucy5zc2FNYXhSZXRyeUNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAhISEgW01BWCBSRVRSWSBFWENFRURdICR7c3NhUmVzdWx0fSwgcmV0cnkgY291bnQgaXMgJHt0aGlzLl9fc3NhUmV0cnlDb3VudH0gISEhYCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBjb25zdCBleGVjdXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc3NhUmV0cnlDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgISEhIFtSRVRSWSsrXSAke3NzYVJlc3VsdH0sIGJ1dCwgd2lsbCBiZSByZXRyeSAke3RoaXMuX19zc2FSZXRyeUNvdW50fSAhISFgKTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIHNzYVJlc3VsdCA9IGF3YWl0IHRoaXMuX19zdGFydFRydXRoUmV0cnkodGhpcy5fX29jclR5cGUsIHRoaXMuX19hZGRyZXNzLCBpdGVtKTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGlmIChzc2FSZXN1bHQgPT09IG51bGwpIHRocm93IG5ldyBFcnJvcignW0VSUl0gU1NBIE1PREUgaXMgdHJ1ZS4gYnV0LCBzc2FSZXN1bHQgaXMgbnVsbCcpOyAvLyBwcmV0dGllci1pZ25vcmVcblxuICAgICAgICAgICAgICAgICAgICBzc2FSZXN1bHRMaXN0LnB1c2goc3NhUmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgIGlmIChGQUtFKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzc2FSZXN1bHQuaW5kZXhPZignUkVBTCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBleGVjdXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGlmIChSRUFMKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzc2FSZXN1bHQuaW5kZXhPZignRkFLRScpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBleGVjdXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGlmIChFTlNFTUJMRSkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBleGVjdXRlKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJldHJ5V29ya2luZ1RpbWUgPSBuZXcgRGF0ZSgpIC0gcmV0cnlTdGFydERhdGU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFtTU0EgRE9ORV0gc3NhUmVzdWx0OiAke3NzYVJlc3VsdH0gLyByZXRyeUNvdW50OiAke3RoaXMuX19zc2FSZXRyeUNvdW50fSAvIHJldHJ5IHdvcmtpbmcgdGltZTogJHtyZXRyeVdvcmtpbmdUaW1lfWApOyAvLyBwcmV0dGllci1pZ25vcmVcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgW1NTQSBET05FIC8gTk8gUkVUUlldIHNzYVJlc3VsdDogJHtzc2FSZXN1bHR9IC8gYCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZU1hc2tJbmZvKSB7XG4gICAgICAgICAgICAgIG1hc2tJbmZvID0gdGhpcy5fX2dldE1hc2tJbmZvKHRoaXMuX19hZGRyZXNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgcmVzdWx0IDogJHtvY3JSZXN1bHR9YCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgbGVnYWN5Rm9ybWF0LCBuZXdGb3JtYXQgfSA9IHVzZWJPQ1JXQVNNUGFyc2VyLnBhcnNlT2NyUmVzdWx0KFxuICAgICAgICAgICAgICB0aGlzLl9fb2NyVHlwZSxcbiAgICAgICAgICAgICAgdGhpcy5fX3NzYU1vZGUsXG4gICAgICAgICAgICAgIG9jclJlc3VsdCxcbiAgICAgICAgICAgICAgc3NhUmVzdWx0LFxuICAgICAgICAgICAgICB0aGlzLl9fc3NhUmV0cnlDb3VudCxcbiAgICAgICAgICAgICAgc3NhUmVzdWx0TGlzdCxcbiAgICAgICAgICAgICAgdGhpcy5fX29wdGlvbnMuc3NhUmV0cnlUeXBlLFxuICAgICAgICAgICAgICB0aGlzLl9fb3B0aW9ucy5zc2FSZXRyeVBpdm90XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBsZXQgcmV2aWV3X3Jlc3VsdCA9IHtcbiAgICAgICAgICAgICAgb2NyX3R5cGU6IHRoaXMuX19vY3JUeXBlLFxuICAgICAgICAgICAgICAuLi5uZXdGb3JtYXQsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNDcmVkaXRDYXJkKCkpIHtcbiAgICAgICAgICAgICAgcmV2aWV3X3Jlc3VsdC5tYXNrSW5mbyA9IG1hc2tJbmZvO1xuICAgICAgICAgICAgICByZXZpZXdfcmVzdWx0LnNzYV9tb2RlID0gdGhpcy5fX3NzYU1vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX19jb21wcmVzc0ltYWdlcyhyZXZpZXdfcmVzdWx0KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZUxlZ2FjeUZvcm1hdCkge1xuICAgICAgICAgICAgICByZXZpZXdfcmVzdWx0Lm9jcl9kYXRhID0gbGVnYWN5Rm9ybWF0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9fb25TdWNjZXNzUHJvY2VzcyhyZXZpZXdfcmVzdWx0KTtcblxuICAgICAgICAgICAgdGhpcy5fX2Nsb3NlQ2FtZXJhKCk7XG4gICAgICAgICAgICB0aGlzLl9fZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSAnQ2FyZCBkZXRlY3Rpb24gZXJyb3InO1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSArPSAnOiAnICsgZS5tZXNzYWdlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTWVzc2FnZSk7XG5cbiAgICAgICAgICAvLyBpZiAoZS50b1N0cmluZygpLmluY2x1ZGVzKCdtZW1vcnknKSkge1xuICAgICAgICAgIC8vICAgYXdhaXQgdGhpcy5fX3JlY292ZXJ5U2NhbigpO1xuICAgICAgICAgIC8vICAgdGhpcy5fX3JlY292ZXJlZCA9IHRydWU7XG4gICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLl9fb25GYWlsdXJlUHJvY2VzcygnV0EwMDEnLCBlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMuX19jbG9zZUNhbWVyYSgpO1xuICAgICAgICAgIHRoaXMuX19kZXRlY3RlZCA9IHRydWU7XG4gICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmICh0aGlzLl9fcmVjb3ZlcmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9fcmVjb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghdGhpcy5fX2RldGVjdGVkKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHNjYW4sIDEpOyAvLyDsnqzqt4BcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNldFRpbWVvdXQoc2NhbiwgMSk7IC8vIFVJIOuenOuNlOungSBibG9ja2luZyDrsKnsp4AgKHNldFRpbWVvdXQpXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBfX2NvbXByZXNzSW1hZ2VzKHJldmlld19yZXN1bHQsIGNvbnN0YW50TnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpKSB7XG4gICAgICBjb25zb2xlLmxvZygnaXNFbnJ5cHRNb2RlIGlzIHRydWUuIHNvLCBza2lwIHRvIGNvbXByZXNzSW1hZ2VzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZUNvbXByZXNzSW1hZ2UpIHtcbiAgICAgIGNvbnN0IHJlc2l6ZVJhdGlvID0gdGhpcy5fX2Nyb3BJbWFnZVNpemVIZWlnaHQgLyB0aGlzLl9fY3JvcEltYWdlU2l6ZVdpZHRoO1xuXG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgbWF4V2lkdGg6IHRoaXMuX19vcHRpb25zLnVzZUNvbXByZXNzSW1hZ2VNYXhXaWR0aCxcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLl9fb3B0aW9ucy51c2VDb21wcmVzc0ltYWdlTWF4V2lkdGggKiByZXNpemVSYXRpbyxcbiAgICAgICAgY29udmVydFNpemU6IHRoaXMuX19vcHRpb25zLnVzZUNvbXByZXNzSW1hZ2VNYXhWb2x1bWUsXG4gICAgICAgIHRhcmdldENvbXByZXNzVm9sdW1lOiB0aGlzLl9fb3B0aW9ucy51c2VDb21wcmVzc0ltYWdlTWF4Vm9sdW1lLCAvLyBjdXN0b20gb3B0aW9uXG4gICAgICB9O1xuXG4gICAgICBpZiAocmV2aWV3X3Jlc3VsdC5vY3Jfb3JpZ2luX2ltYWdlKSB7XG4gICAgICAgIHJldmlld19yZXN1bHQub2NyX29yaWdpbl9pbWFnZSA9IGF3YWl0IHRoaXMuX19jb21wcmVzc0Jhc2U2NEltYWdlKFxuICAgICAgICAgIHJldmlld19yZXN1bHQub2NyX29yaWdpbl9pbWFnZSxcbiAgICAgICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBjb25zdGFudE51bWJlclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAocmV2aWV3X3Jlc3VsdC5vY3JfbWFza2luZ19pbWFnZSkge1xuICAgICAgICAvLyBtYXNraW5nIOydtOuvuOyngOuKlCByZXNpemUg7ZWY66m0LCBtYXNrIOyijO2RnOqwgCDslrTquIvrgpjrr4DroZwg66as7IKs7J207KaIIOyViO2VmOqzoCDslZXstpXrp4wg7KeE7ZaJXG4gICAgICAgIGNvbnN0IG1hc2tpbmdJbWFnZU9wdGlvbnMgPSB7XG4gICAgICAgICAgcXVhbGl0eTogZGVmYXVsdE9wdGlvbnMucXVhbGl0eSxcbiAgICAgICAgICB0YXJnZXRDb21wcmVzc1ZvbHVtZTogZGVmYXVsdE9wdGlvbnMudGFyZ2V0Q29tcHJlc3NWb2x1bWUsXG4gICAgICAgIH07XG4gICAgICAgIHJldmlld19yZXN1bHQub2NyX21hc2tpbmdfaW1hZ2UgPSBhd2FpdCB0aGlzLl9fY29tcHJlc3NCYXNlNjRJbWFnZShcbiAgICAgICAgICByZXZpZXdfcmVzdWx0Lm9jcl9tYXNraW5nX2ltYWdlLFxuICAgICAgICAgIG1hc2tpbmdJbWFnZU9wdGlvbnMsXG4gICAgICAgICAgY29uc3RhbnROdW1iZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJldmlld19yZXN1bHQub2NyX2ZhY2VfaW1hZ2UpIHtcbiAgICAgICAgcmV2aWV3X3Jlc3VsdC5vY3JfZmFjZV9pbWFnZSA9IGF3YWl0IHRoaXMuX19jb21wcmVzc0Jhc2U2NEltYWdlKFxuICAgICAgICAgIHJldmlld19yZXN1bHQub2NyX2ZhY2VfaW1hZ2UsXG4gICAgICAgICAgZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgY29uc3RhbnROdW1iZXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfX3JlcXVlc3RHZXRBUElUb2tlbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IHRoaXMuX19vcHRpb25zLmF1dGhTZXJ2ZXJJbmZvLmNyZWRlbnRpYWw7XG4gICAgICBjb25zdCBiYXNlVXJsID0gdGhpcy5fX29wdGlvbnMuYXV0aFNlcnZlckluZm8uYmFzZVVybDtcblxuICAgICAgZmV0Y2goYCR7YmFzZVVybH0vc2lnbi1pbmAsIHtcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoY3JlZGVudGlhbCksXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAvLyBtb2RlOiAnY29ycycsXG4gICAgICAgIC8vIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICB9KVxuICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGZldGNoKGAke2Jhc2VVcmx9L3VzZWIvdG9rZW5gLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IGBCZWFyZXIgJHtyZXN1bHQudG9rZW59YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBudWxsLFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoanNvbi50b2tlbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfX3JlcXVlc3RTZXJ2ZXJPQ1Iob2NyVHlwZSwgc3NhTW9kZSwgaW1nRGF0YVVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgYmFzZVVybCA9IHRoaXMuX19vcHRpb25zLm9jclNlcnZlckJhc2VVcmw7XG5cbiAgICAgICAgc3dpdGNoIChvY3JUeXBlKSB7XG4gICAgICAgICAgY2FzZSAnaWRjYXJkJzpcbiAgICAgICAgICBjYXNlICdkcml2ZXInOlxuICAgICAgICAgIGNhc2UgJ2lkY2FyZC1zc2EnOlxuICAgICAgICAgIGNhc2UgJ2RyaXZlci1zc2EnOlxuICAgICAgICAgICAgYmFzZVVybCArPSAnL29jci9pZGNhcmQtZHJpdmVyJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgICAgICBjYXNlICdwYXNzcG9ydC1zc2EnOlxuICAgICAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQnOlxuICAgICAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgICAgIGJhc2VVcmwgKz0gJy9vY3IvcGFzc3BvcnQnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWxpZW4tYmFjayc6XG4gICAgICAgICAgICBiYXNlVXJsICs9ICcvb2NyL2FsaWVuLWJhY2snO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWxpZW4nOlxuICAgICAgICAgIGNhc2UgJ2FsaWVuLXNzYSc6XG4gICAgICAgICAgICBiYXNlVXJsICs9ICcvb2NyL2FsaWVuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NyZWRpdCc6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NyZWRpdCBjYXJkIGlzIG5vdCBVbnN1cHBvcnRlZCBTZXJ2ZXIgT0NSJyk7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgT0NSIHR5cGU6ICR7b2NyVHlwZX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwaVRva2VuID0gYXdhaXQgdGhpcy5fX3JlcXVlc3RHZXRBUElUb2tlbigpO1xuXG4gICAgICAgIGNvbnN0IG15SGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gICAgICAgIG15SGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7YXBpVG9rZW59YCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW0gPSB7XG4gICAgICAgICAgaW1hZ2VfYmFzZTY0OiBpbWdEYXRhVXJsLFxuICAgICAgICAgIG1hc2tfbW9kZTogJ3RydWUnLFxuICAgICAgICAgIGZhY2VfbW9kZTogJ3RydWUnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLl9fc3NhTW9kZSkge1xuICAgICAgICAgIHBhcmFtLnNzYV9tb2RlID0gJ3RydWUnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmF3ID0gSlNPTi5zdHJpbmdpZnkocGFyYW0pO1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IG15SGVhZGVycyxcbiAgICAgICAgICBib2R5OiByYXcsXG4gICAgICAgICAgcmVkaXJlY3Q6ICdmb2xsb3cnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZldGNoKGJhc2VVcmwsIHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX19zdGFydFNjYW5TZXJ2ZXJJbXBsKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBUT0RPOiDshJzrsoQg66qo65Oc7J2865WMIOyVlO2YuO2ZlCDripQg7Ja065a76rKMID8g7KeA7Jqw64qU6rKMIOunnuuKlOqwgD8ganMg66CI67Ko66Gc7ZWY66m0IOuplOuqqOumrOyXkCDrgqjsnYwg7ISc67KE7JeQ7IScIOyVlO2YuO2ZlOuQnOqwkuydhCDrgrTroKTso7zripQg7Ji17IWY7J20IOyeiOyWtOyVvO2VqFxuICAgICAgLy8gdGhpcy5fX3NldFBpaUVuY3J5cHQodGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdE1vZGUpOyAvLyBvY3IgcmVzdWx0IGVuY3J5cHRcbiAgICAgIHRoaXMuX19ibHVyQ2FwdHVyZUJ1dHRvbigpO1xuXG4gICAgICBjb25zdCBfX29uQ2xpY2tDYXB0dXJlQnV0dG9uID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxldCBvY3JSZXN1bHQgPSBudWxsO1xuICAgICAgICAgIC8vIOy6lOuyhOyKpOyXkOyEnCDsnbTrr7jsp4Drpbwg6rCA7KC47Ji0XG4gICAgICAgICAgY29uc3QgWywgaW1nRGF0YVVybF0gPSBhd2FpdCB0aGlzLl9fY3JvcEltYWdlRnJvbVZpZGVvKCk7XG4gICAgICAgICAgaWYgKDEgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIHNlcnZlciBvY3Ig7Iuk7YyoICjrsJzsg50g6rCA64ql7ISxIOyXhuydjClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2VydmVyIG9jciDshLHqs7VcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk1BTlVBTF9DQVBUVVJFX1NVQ0NFU1MsIGZhbHNlLCBpbWdEYXRhVXJsKTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgb2NyUmVzdWx0ID0gYXdhaXQgdGhpcy5fX3JlcXVlc3RTZXJ2ZXJPQ1IodGhpcy5fX29jclR5cGUsIHRoaXMuX19zc2FNb2RlLCBpbWdEYXRhVXJsKTtcblxuICAgICAgICAgICAgICAvLyBmYWlsdXJlIGNhc2VcbiAgICAgICAgICAgICAgaWYgKG9jclJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9fY2hhbmdlU3RhZ2UodGhpcy5JTl9QUk9HUkVTUy5PQ1JfRkFJTEVEKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZlciBPQ1IgaXMgZmFpbGVkYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNzYSDsi5zrj4Q/XG5cbiAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FzZVxuICAgICAgICAgICAgY29uc3QgeyB2aWRlbyB9ID0gZGV0ZWN0b3IuZ2V0T0NSRWxlbWVudHMoKTtcbiAgICAgICAgICAgIHRoaXMuX19zZXRTdHlsZSh2aWRlbywgeyBkaXNwbGF5OiAnbm9uZScgfSk7IC8vIE9DUiDsmYTro4wg7Iuc7KCQ7JeQIGNhbWVyYSBwcmV2aWV3IG9mZlxuXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGByZXN1bHQgOiAke29jclJlc3VsdH1gKTtcblxuICAgICAgICAgICAgY29uc3QgeyBsZWdhY3lGb3JtYXQsIG5ld0Zvcm1hdCwgYmFzZTY0SW1hZ2VSZXN1bHQsIG1hc2tJbmZvIH0gPSB1c2ViT0NSQVBJUGFyc2VyLnBhcnNlT2NyUmVzdWx0KFxuICAgICAgICAgICAgICB0aGlzLl9fb2NyVHlwZSxcbiAgICAgICAgICAgICAgdGhpcy5fX3NzYU1vZGUsXG4gICAgICAgICAgICAgIG9jclJlc3VsdFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IHJldmlld19yZXN1bHQgPSB7XG4gICAgICAgICAgICAgIG9jcl90eXBlOiB0aGlzLl9fb2NyVHlwZSxcbiAgICAgICAgICAgICAgb2NyX3Jlc3VsdDogbmV3Rm9ybWF0LFxuICAgICAgICAgICAgICBvY3Jfb3JpZ2luX2ltYWdlOiBpbWdEYXRhVXJsLFxuICAgICAgICAgICAgICBvY3JfbWFza2luZ19pbWFnZTogYmFzZTY0SW1hZ2VSZXN1bHQ/Lm9jcl9tYXNraW5nX2ltYWdlLFxuICAgICAgICAgICAgICBvY3JfZmFjZV9pbWFnZTogYmFzZTY0SW1hZ2VSZXN1bHQ/Lm9jcl9mYWNlX2ltYWdlLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQ3JlZGl0Q2FyZCgpKSB7XG4gICAgICAgICAgICAgIHJldmlld19yZXN1bHQubWFza0luZm8gPSBtYXNrSW5mbztcbiAgICAgICAgICAgICAgcmV2aWV3X3Jlc3VsdC5zc2FfbW9kZSA9IHRoaXMuX19zc2FNb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fX2RlYnVnTW9kZSkge1xuICAgICAgICAgICAgICByZXZpZXdfcmVzdWx0Lm9jcl9hcGlfcmVzcG9uc2UgPSBvY3JSZXN1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX19jb21wcmVzc0ltYWdlcyhyZXZpZXdfcmVzdWx0LCAwLjApO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiDshJzrsoQg66qo65Oc7J2865WMIOyVlO2YuO2ZlCDripQg7Ja065a76rKMID8g7KeA7Jqw64qU6rKMIOunnuuKlOqwgD8ganMg66CI67Ko66Gc7ZWY66m0IOuplOuqqOumrOyXkCDrgqjsnYwg7ISc67KE7JeQ7IScIOyVlO2YuO2ZlOuQnOqwkuydhCDrgrTroKTso7zripQg7Ji17IWY7J20IOyeiOyWtOyVvO2VqFxuICAgICAgICAgICAgLy8gdGhpcy5lbmNyeXB0UmVzdWx0KHJldmlld19yZXN1bHQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fX29wdGlvbnMudXNlTGVnYWN5Rm9ybWF0KSB7XG4gICAgICAgICAgICAgIHJldmlld19yZXN1bHQub2NyX2RhdGEgPSBsZWdhY3lGb3JtYXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvY3JSZXN1bHQuY29tcGxldGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX29uU3VjY2Vzc1Byb2Nlc3MocmV2aWV3X3Jlc3VsdCk7XG5cbiAgICAgICAgICAgICAgdGhpcy5fX2Nsb3NlQ2FtZXJhKCk7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdENvZGUgPSAnU0YwMDEnO1xuICAgICAgICAgICAgICBjb25zdCByZXN1bHRNZXNzYWdlID0gYCR7b2NyUmVzdWx0LnNjYW5uZXJfdHlwZX06JHtvY3JSZXN1bHQ/LnJlc3VsdF9jb2RlfWA7XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdERldGFpbCA9IEpTT04uc3RyaW5naWZ5KG9jclJlc3VsdCk7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuX19vbkZhaWx1cmVQcm9jZXNzKHJlc3VsdENvZGUsIHJlc3VsdERldGFpbCwgcmVzdWx0TWVzc2FnZSk7IC8vIFFVUkFNIFNlcnZlciBPQ1Ig7JeQ65+sXG5cbiAgICAgICAgICAgICAgdGhpcy5fX2Nsb3NlQ2FtZXJhKCk7XG4gICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgPSAnU2VydmVyIE9DUiBFcnJvcic7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlICs9ICc6ICcgKyBlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JNZXNzYWdlKTtcblxuICAgICAgICAgIGF3YWl0IHRoaXMuX19vbkZhaWx1cmVQcm9jZXNzKCdTRTAwMScsIGUsIGVycm9yTWVzc2FnZSk7IC8vIFFVUkFNIFNlcnZlciBPQ1Ig7JeQ65+sXG4gICAgICAgICAgdGhpcy5fX2Nsb3NlQ2FtZXJhKCk7XG4gICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuX19jYXB0dXJlQnV0dG9uPy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9fb25DbGlja0NhcHR1cmVCdXR0b24pO1xuICAgICAgdGhpcy5fX2NhcHR1cmVCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX19vbkNsaWNrQ2FwdHVyZUJ1dHRvbik7XG4gICAgfSk7XG4gIH1cblxuICBfX2VucXVldWVEZXRlY3RlZENhcmRRdWV1ZShpbWdEYXRhKSB7XG4gICAgLy8gc3NhIHJldHJ5IOyEpOygleydtCDrkJjslrQg7J6I7Jy86rGw64KYLCDsiJjrj5nstKzsmIFVSeulvCDsgqzsmqntlZjripQg6rK97JqwLCBjYXJkIGRldGVjdCDshLHqs7Xsi5wg7J2066+47KeAIOyggOyepVxuICAgIGlmIChcbiAgICAgICh0aGlzLl9fc3NhTW9kZSAmJiB0aGlzLl9fb3B0aW9ucy5zc2FNYXhSZXRyeUNvdW50ID4gMCkgfHxcbiAgICAgICh0aGlzLl9fb3B0aW9ucy51c2VDYXB0dXJlVUkgJiYgdGhpcy5fX21hbnVhbE9DUk1heFJldHJ5Q291bnQgPiAwKVxuICAgICkge1xuICAgICAgbGV0IGxpbWl0U2F2ZUltYWdlQ291bnQgPSBNYXRoLm1heCh0aGlzLl9fb3B0aW9ucy5zc2FNYXhSZXRyeUNvdW50LCB0aGlzLl9fbWFudWFsT0NSTWF4UmV0cnlDb3VudCk7XG5cbiAgICAgIGlmICh0aGlzLl9fZGV0ZWN0ZWRDYXJkUXVldWUubGVuZ3RoID09PSBsaW1pdFNhdmVJbWFnZUNvdW50KSB7XG4gICAgICAgIHRoaXMuX19kZXRlY3RlZENhcmRRdWV1ZS5zaGlmdCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fZGV0ZWN0ZWRDYXJkUXVldWUucHVzaChpbWdEYXRhKTtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ3RoaXMuX19jYXJkSW1nTGlzdC5sZW5ndGggOiAnICsgdGhpcy5fX2RldGVjdGVkQ2FyZFF1ZXVlLmxlbmd0aCk7IC8vIHNob3VsZCBiZSByZW1vdmVkXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19vblN1Y2Nlc3NQcm9jZXNzKHJldmlld19yZXN1bHQpIHtcbiAgICAvLyDsnbjsi50g7ISx6rO1IOyKpOy6lCDro6jtlIQg7KKF66OMXG4gICAgaWYgKHJldmlld19yZXN1bHQuc3NhX21vZGUpIHtcbiAgICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk9DUl9TVUNDRVNTX1dJVEhfU1NBKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5fX2NoYW5nZVN0YWdlKHRoaXMuSU5fUFJPR1JFU1MuT0NSX1NVQ0NFU1MpO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBhcGlfcmVzcG9uc2U6IHtcbiAgICAgICAgcmVzdWx0X2NvZGU6ICdOMTAwJyxcbiAgICAgICAgcmVzdWx0X21lc3NhZ2U6ICdPSy4nLFxuICAgICAgfSxcbiAgICAgIHJlc3VsdDogJ3N1Y2Nlc3MnLFxuICAgICAgcmV2aWV3X3Jlc3VsdDogcmV2aWV3X3Jlc3VsdCxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX19vblN1Y2Nlc3MpIHtcbiAgICAgIHRoaXMuX19vblN1Y2Nlc3MocmVzdWx0KTtcbiAgICAgIHRoaXMuX19vblN1Y2Nlc3MgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnW1dBUk5dIG9uU3VjY2VzcyBjYWxsYmFjayBpcyBudWxsLCBzbyBza2lwIHRvIHNlbmQgcmVzdWx0Jyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19vbkZhaWx1cmVQcm9jZXNzKHJlc3VsdENvZGUsIGUsIGVycm9yTWVzc2FnZSkge1xuICAgIGF3YWl0IHRoaXMuX19jaGFuZ2VTdGFnZSh0aGlzLklOX1BST0dSRVNTLk9DUl9GQUlMRUQpO1xuXG4gICAgbGV0IGVycm9yRGV0YWlsID0gJyc7XG4gICAgaWYgKGU/LnRvU3RyaW5nKCkpIGVycm9yRGV0YWlsICs9IGUudG9TdHJpbmcoKTtcbiAgICBpZiAoZT8uc3RhY2spIGVycm9yRGV0YWlsICs9IGUuc3RhY2s7XG5cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBhcGlfcmVzcG9uc2U6IHtcbiAgICAgICAgcmVzdWx0X2NvZGU6IHJlc3VsdENvZGUsXG4gICAgICAgIHJlc3VsdF9tZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICB9LFxuICAgICAgcmVzdWx0OiAnZmFpbGVkJyxcbiAgICAgIHJldmlld19yZXN1bHQ6IHtcbiAgICAgICAgb2NyX3R5cGU6IHRoaXMuX19vY3JUeXBlLFxuICAgICAgICBlcnJvcl9kZXRhaWw6IGVycm9yRGV0YWlsLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX19vbkZhaWx1cmUpIHtcbiAgICAgIHRoaXMuX19vbkZhaWx1cmUocmVzdWx0KTtcbiAgICAgIHRoaXMuX19vbkZhaWx1cmUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnW1dBUk5dIG9uRmFpbHVyZSBjYWxsYmFjayBpcyBudWxsLCBzbyBza2lwIHRvIHNlbmQgcmVzdWx0Jyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX19wcmVsb2FkaW5nV2FzbSgpIHtcbiAgICBjb25zdCBwcmVsb2FkaW5nU3RhdHVzID0gdGhpcy5nZXRQcmVsb2FkaW5nU3RhdHVzKCk7XG4gICAgaWYgKCF0aGlzLmlzUHJlbG9hZGVkKCkgJiYgcHJlbG9hZGluZ1N0YXR1cyA9PT0gdGhpcy5QUkVMT0FESU5HX1NUQVRVUy5OT1RfU1RBUlRFRCkge1xuICAgICAgY29uc29sZS5sb2coJyEhISBXQVNNIE9DUiBJUyBOT1QgU1RBUlRFRCBQUkVMT0FESU5HLiBTTywgV0lMTCBCRSBTVEFSVCBQUkVMT0FESU5HICEhIScpO1xuICAgICAgYXdhaXQgdGhpcy5wcmVsb2FkaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcmVsb2FkaW5nU3RhdHVzID09PSB0aGlzLlBSRUxPQURJTkdfU1RBVFVTLlNUQVJURUQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJyEhISBXQVNNIE9DUiBJUyBTVEFSVEVELiBCVVQsIElTIE5PVCBET05FLiBTTywgV0FJVElORyBGT1IgUFJFTE9BRElORyAhISEnKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fX3dhaXRQcmVsb2FkZWQoKTtcbiAgICAgIH0gZWxzZSBpZiAocHJlbG9hZGluZ1N0YXR1cyA9PT0gdGhpcy5QUkVMT0FESU5HX1NUQVRVUy5ET05FKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCchISEgQUxSRUFEWSBXQVNNIE9DUiBJUyBQUkVMT0FERUQgISEhJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGFibm9ybWFsbHkgcHJlbG9hZGluZyBzdGF0dXMsIHByZWxvYWRlZDogJHt0aGlzLmlzUHJlbG9hZGVkKCl9IC8gcHJlbG9hZGluZ1N0YXR1czogJHt0aGlzLmdldFByZWxvYWRpbmdTdGF0dXMoKX1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX19zZXR1cEVuY3J5cHRNb2RlKCkge1xuICAgIGlmICh0aGlzLmlzRW5jcnlwdE1vZGUoKSkge1xuICAgICAgaWYgKHRoaXMuX19vcHRpb25zLnVzZUVuY3J5cHRNb2RlKSB7XG4gICAgICAgIHRoaXMuX19zZXRPdmVyYWxsRW5jcnlwdChmYWxzZSk7XG4gICAgICAgIHRoaXMuX19zZXRQaWlFbmNyeXB0KHRydWUpO1xuICAgICAgICAvLyBUT0RPOiBzc2Eg7JeQIOuMgO2VnCDslZTtmLjtmZQg6rCSIOygnOqzteydgCDrs4Trj4Qg7LKY66as7ZWY7KeAIOyViuydjFxuICAgICAgICAvLyAgICAgICDstpTtm4QgaWRfdHJ1dGgg7JmAIGZkX2NvbmZpZGVuY2Ug6rCSIOyVlO2YuO2ZlCDsmpTssq3snbQg7J6I7J2EIOqyveyasCDrjIDsnZFcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fX29wdGlvbnMudXNlRW5jcnlwdE92ZXJhbGxNb2RlKSB7XG4gICAgICAgIHRoaXMuX19yZXN1bHRJZGNhcmRJbmZvKHRoaXMuX19vcHRpb25zLm9jclJlc3VsdElkY2FyZEtleWxpc3QpO1xuICAgICAgICB0aGlzLl9fcmVzdWx0UGFzc3BvcnRJbmZvKHRoaXMuX19vcHRpb25zLm9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdCk7XG4gICAgICAgIHRoaXMuX19yZXN1bHRBbGllbkluZm8odGhpcy5fX29wdGlvbnMub2NyUmVzdWx0QWxpZW5LZXlsaXN0KTtcblxuICAgICAgICB0aGlzLl9fZW5jcnlwdElkY2FyZEluZm8odGhpcy5fX29wdGlvbnMuZW5jcnlwdGVkT2NyUmVzdWx0SWRjYXJkS2V5bGlzdCk7XG4gICAgICAgIHRoaXMuX19lbmNyeXB0UGFzc3BvcnRJbmZvKHRoaXMuX19vcHRpb25zLmVuY3J5cHRlZE9jclJlc3VsdFBhc3Nwb3J0S2V5bGlzdCk7XG4gICAgICAgIHRoaXMuX19lbmNyeXB0QWxpZW5JbmZvKHRoaXMuX19vcHRpb25zLmVuY3J5cHRlZE9jclJlc3VsdEFsaWVuS2V5bGlzdCk7XG5cbiAgICAgICAgdGhpcy5fX3NldE92ZXJhbGxFbmNyeXB0KHRydWUpO1xuICAgICAgICB0aGlzLl9fc2V0UGlpRW5jcnlwdChmYWxzZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zc2FNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fX3Jlc3VsdFRydXRoSW5mbyhbLi4udGhpcy5fX29jclJlc3VsdFRydXRoS2V5U2V0XSk7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9fZW5jcnlwdFRydXRoSW5mbyhbLi4udGhpcy5fX29jclJlc3VsdFRydXRoS2V5U2V0XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLnVzZUVuY3J5cHRWYWx1ZU1vZGUpIHtcbiAgICAgICAgdGhpcy5fX3Jlc3VsdElkY2FyZEluZm8odGhpcy5fX29wdGlvbnMub2NyUmVzdWx0SWRjYXJkS2V5bGlzdCk7XG4gICAgICAgIHRoaXMuX19yZXN1bHRQYXNzcG9ydEluZm8odGhpcy5fX29wdGlvbnMub2NyUmVzdWx0UGFzc3BvcnRLZXlsaXN0KTtcbiAgICAgICAgdGhpcy5fX3Jlc3VsdEFsaWVuSW5mbyh0aGlzLl9fb3B0aW9ucy5vY3JSZXN1bHRBbGllbktleWxpc3QpO1xuXG4gICAgICAgIHRoaXMuX19lbmNyeXB0SWRjYXJkSW5mbyh0aGlzLl9fb3B0aW9ucy5lbmNyeXB0ZWRPY3JSZXN1bHRJZGNhcmRLZXlsaXN0KTtcbiAgICAgICAgdGhpcy5fX2VuY3J5cHRQYXNzcG9ydEluZm8odGhpcy5fX29wdGlvbnMuZW5jcnlwdGVkT2NyUmVzdWx0UGFzc3BvcnRLZXlsaXN0KTtcbiAgICAgICAgdGhpcy5fX2VuY3J5cHRBbGllbkluZm8odGhpcy5fX29wdGlvbnMuZW5jcnlwdGVkT2NyUmVzdWx0QWxpZW5LZXlsaXN0KTtcblxuICAgICAgICB0aGlzLl9fc2V0T3ZlcmFsbEVuY3J5cHQoZmFsc2UpO1xuICAgICAgICB0aGlzLl9fc2V0UGlpRW5jcnlwdChmYWxzZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuX19zc2FNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fX3Jlc3VsdFRydXRoSW5mbyhbLi4udGhpcy5fX29jclJlc3VsdFRydXRoS2V5U2V0XSk7XG4gICAgICAgICAgaWYgKHRoaXMuaXNFbmNyeXB0TW9kZSgpKSB7XG4gICAgICAgICAgICB0aGlzLl9fZW5jcnlwdFRydXRoSW5mbyhbLi4udGhpcy5fX29jclJlc3VsdFRydXRoS2V5U2V0XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19yZXN1bHRJZGNhcmRJbmZvKFsuLi50aGlzLl9fb2NyUmVzdWx0SWRjYXJkS2V5U2V0XSk7XG4gICAgICB0aGlzLl9fcmVzdWx0UGFzc3BvcnRJbmZvKFsuLi50aGlzLl9fb2NyUmVzdWx0UGFzc3BvcnRLZXlTZXRdKTtcbiAgICAgIHRoaXMuX19yZXN1bHRBbGllbkluZm8oWy4uLnRoaXMuX19vY3JSZXN1bHRBbGllbktleVNldF0pO1xuXG4gICAgICB0aGlzLl9fZW5jcnlwdElkY2FyZEluZm8oJycpO1xuICAgICAgdGhpcy5fX2VuY3J5cHRQYXNzcG9ydEluZm8oJycpO1xuICAgICAgdGhpcy5fX2VuY3J5cHRBbGllbkluZm8oJycpO1xuXG4gICAgICB0aGlzLl9fc2V0T3ZlcmFsbEVuY3J5cHQoZmFsc2UpO1xuICAgICAgdGhpcy5fX3NldFBpaUVuY3J5cHQoZmFsc2UpO1xuXG4gICAgICBpZiAodGhpcy5fX3NzYU1vZGUpIHtcbiAgICAgICAgdGhpcy5fX3Jlc3VsdFRydXRoSW5mbyhbLi4udGhpcy5fX29jclJlc3VsdFRydXRoS2V5U2V0XSk7XG4gICAgICAgIHRoaXMuX19lbmNyeXB0VHJ1dGhJbmZvKCcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfX3NldHVwSW1hZ2VNb2RlKCkge1xuICAgIGxldCBpbWdNb2RlO1xuXG4gICAgaWYgKHRoaXMuaXNDcmVkaXRDYXJkKCkpIHtcbiAgICAgIGltZ01vZGUgPSB0aGlzLk9DUl9JTUdfTU9ERS5DUk9QUElORztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLnVzZUltYWdlQ3JvcHBpbmcpIHtcbiAgICAgIGltZ01vZGUgPSB0aGlzLk9DUl9JTUdfTU9ERS5DUk9QUElORztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX19vcHRpb25zLnVzZUltYWdlV2FycGluZykge1xuICAgICAgaW1nTW9kZSA9IHRoaXMuT0NSX0lNR19NT0RFLldBUlBJTkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGltZ01vZGUgPSB0aGlzLk9DUl9JTUdfTU9ERS5OT05FO1xuICAgIH1cbiAgICB0aGlzLl9fc2V0SW1hZ2VSZXN1bHQoaW1nTW9kZSk7XG4gIH1cblxuICBfX3NldFBpaUVuY3J5cHQocGlpRW5jcnlwdE1vZGUpIHtcbiAgICB0aGlzLl9fT0NSRW5naW5lLnNldFBpaUVuY3J5cHQocGlpRW5jcnlwdE1vZGUpO1xuICB9XG5cbiAgX19zdHJpbmdBcnJheVRvU3RyaW5nKHN0cmluZ0FycmF5KSB7XG4gICAgbGV0IHJldFN0cmluZyA9IG51bGw7XG5cbiAgICBpZiAoc3RyaW5nQXJyYXkgPT09ICcnKSByZXR1cm4gc3RyaW5nQXJyYXk7XG5cbiAgICBpZiAoc3RyaW5nQXJyYXkgPT09IHVuZGVmaW5lZCB8fCBzdHJpbmdBcnJheSA9PT0gbnVsbCB8fCBzdHJpbmdBcnJheS5sZW5ndGggPT09IDApIHJldHVybiByZXRTdHJpbmc7XG5cbiAgICByZXRTdHJpbmcgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5nQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJldFN0cmluZyArPSBzdHJpbmdBcnJheVtpXTtcbiAgICAgIGlmIChpIDwgc3RyaW5nQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgICByZXRTdHJpbmcgKz0gJywnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0U3RyaW5nO1xuICB9XG5cbiAgX19yZXN1bHRJZGNhcmRJbmZvKG9wdElkY2FyZCkge1xuICAgIHRoaXMuX19PQ1JFbmdpbmUuc2V0SWRjYXJkUmVzdWx0KHRoaXMuX19zdHJpbmdBcnJheVRvU3RyaW5nKG9wdElkY2FyZCkpO1xuICB9XG5cbiAgX19yZXN1bHRQYXNzcG9ydEluZm8ob3B0UGFzc3BvcnQpIHtcbiAgICB0aGlzLl9fT0NSRW5naW5lLnNldFBhc3Nwb3J0UmVzdWx0KHRoaXMuX19zdHJpbmdBcnJheVRvU3RyaW5nKG9wdFBhc3Nwb3J0KSk7XG4gIH1cblxuICBfX3Jlc3VsdEFsaWVuSW5mbyhvcHRBbGllbikge1xuICAgIHRoaXMuX19PQ1JFbmdpbmUuc2V0QWxpZW5SZXN1bHQodGhpcy5fX3N0cmluZ0FycmF5VG9TdHJpbmcob3B0QWxpZW4pKTtcbiAgfVxuXG4gIF9fcmVzdWx0VHJ1dGhJbmZvKG9wdFRydXRoKSB7XG4gICAgdGhpcy5fX09DUkVuZ2luZS5zZXRUcnV0aFJlc3VsdCh0aGlzLl9fc3RyaW5nQXJyYXlUb1N0cmluZyhvcHRUcnV0aCkpO1xuICB9XG5cbiAgX19lbmNyeXB0SWRjYXJkSW5mbyhvcHRJZGNhcmQpIHtcbiAgICB0aGlzLl9fT0NSRW5naW5lLnNldElkY2FyZEVuY3J5cHQodGhpcy5fX3N0cmluZ0FycmF5VG9TdHJpbmcob3B0SWRjYXJkKSk7XG4gIH1cblxuICBfX2VuY3J5cHRQYXNzcG9ydEluZm8ob3B0UGFzc3BvcnQpIHtcbiAgICB0aGlzLl9fT0NSRW5naW5lLnNldFBhc3Nwb3J0RW5jcnlwdCh0aGlzLl9fc3RyaW5nQXJyYXlUb1N0cmluZyhvcHRQYXNzcG9ydCkpO1xuICB9XG5cbiAgX19lbmNyeXB0QWxpZW5JbmZvKG9wdEFsaWVuKSB7XG4gICAgdGhpcy5fX09DUkVuZ2luZS5zZXRBbGllbkVuY3J5cHQodGhpcy5fX3N0cmluZ0FycmF5VG9TdHJpbmcob3B0QWxpZW4pKTtcbiAgfVxuXG4gIF9fZW5jcnlwdFRydXRoSW5mbyhvcHRUcnV0aCkge1xuICAgIHRoaXMuX19PQ1JFbmdpbmUuc2V0VHJ1dGhFbmNyeXB0KHRoaXMuX19zdHJpbmdBcnJheVRvU3RyaW5nKG9wdFRydXRoKSk7XG4gIH1cblxuICBfX3NldE92ZXJhbGxFbmNyeXB0KHZhbCkge1xuICAgIHRoaXMuX19PQ1JFbmdpbmUuc2V0T3ZlcmFsbEVuY3J5cHQodmFsKTtcbiAgfVxuXG4gIF9fc2V0SW1hZ2VSZXN1bHQodmFsKSB7XG4gICAgdGhpcy5fX09DUkVuZ2luZS5zZXRJbWFnZVJlc3VsdCh2YWwpO1xuICB9XG5cbiAgLy8gVE9ETyA6IOyWtOuUlOyEnCDsgqzsmqntlZjripTsp4Ag7ZmV7J24IO2VhOyalFxuICAvLyBfX3NldFBhc3Nwb3J0UmVzdWx0KHZhbCkge1xuICAvLyAgIHRoaXMuX19PQ1JFbmdpbmUuc2V0UGFzc3BvcnRSZXN1bHRUeXBlKHZhbCk7XG4gIC8vIH1cblxuICAvLyBUT0RPIDogY3JlZGl0IGNhcmQg7JeQ7IScIOyCrOyaqeykkeydtOyWtOyEnCDsgq3soJwg67aI6rCAICh3YXNtIOugiOuyqOuhnCDrs4Dqsr3rkKAg6rK97JqwIOyCreygnCDqsIDriqUpIC0tIFNUQVJUXG4gIF9fZW5jcnlwdERldGVjdGVkQmFzZTY0KGFkZHJlc3MsIG1hc2ssIG9jcl9tb2RlLCBpbWdUeXBlID0gJ2NhcmQnKSB7XG4gICAgaWYgKGltZ1R5cGUgPT09ICdmYWNlJykge1xuICAgICAgcmV0dXJuIHRoaXMuX19PQ1JFbmdpbmUuZW5jcnlwdEJhc2U2NGpwZ0RldGVjdGVkUGhvdG9CYXNlNjQoYWRkcmVzcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9fT0NSRW5naW5lLmVuY3J5cHRCYXNlNjRqcGdEZXRlY3RlZEZyYW1lQmFzZTY0KGFkZHJlc3MsIG1hc2ssIG9jcl9tb2RlKTtcbiAgfVxuXG4gIF9fZ2V0RW5jcnlwdGVkU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX09DUkVuZ2luZS5nZXRFbmNyeXB0ZWRKcGdTaXplKCk7XG4gIH1cblxuICBfX2dldEVuY3J5cHRlZEJ1ZmZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fX09DUkVuZ2luZS5nZXRFbmNyeXB0ZWRKcGdCdWZmZXIoKTtcbiAgfVxuXG4gIF9fZ2V0UGlpRW5jcnlwdEltYWdlQmFzZTY0KGFkZHJlc3MsIG1hc2ssIGltZ01vZGUsIGltZ1R5cGUgPSAnY2FyZCcpIHtcbiAgICBjb25zdCBlbmNyeXB0RGV0ZWN0ZWRCYXNlNjQgPSB0aGlzLl9fZW5jcnlwdERldGVjdGVkQmFzZTY0KGFkZHJlc3MsIG1hc2ssIGltZ01vZGUsIGltZ1R5cGUpO1xuICAgIGlmIChlbmNyeXB0RGV0ZWN0ZWRCYXNlNjQgPT09IDEpIHtcbiAgICAgIGNvbnN0IGpwZ1NpemUgPSB0aGlzLl9fZ2V0RW5jcnlwdGVkU2l6ZSgpO1xuICAgICAgY29uc3QganBnUG9pbnRlciA9IHRoaXMuX19nZXRFbmNyeXB0ZWRCdWZmZXIoKTtcblxuICAgICAgY29uc3QgZW5jcnlwdGVkID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fX09DUkVuZ2luZS5IRUFQOC5idWZmZXIsIGpwZ1BvaW50ZXIsIGpwZ1NpemUpO1xuICAgICAgY29uc3QgdGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jyk7XG4gICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKGVuY3J5cHRlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cblxuICBhc3luYyBfX2dldEltYWdlQmFzZTY0KGFkZHJlc3MsIG1hc2tNb2RlLCBpbWdNb2RlLCBpbWdUeXBlID0gJ2NhcmQnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpbWdUeXBlID09PSAnY2FyZCcpIHtcbiAgICAgICAgdGhpcy5fX09DUkVuZ2luZS5lbmNvZGVKcGdEZXRlY3RlZEZyYW1lSW1hZ2UoYWRkcmVzcywgbWFza01vZGUsIGltZ01vZGUpO1xuICAgICAgfSBlbHNlIGlmIChpbWdUeXBlID09PSAnZmFjZScpIHtcbiAgICAgICAgdGhpcy5fX09DUkVuZ2luZS5lbmNvZGVKcGdEZXRlY3RlZFBob3RvSW1hZ2UoYWRkcmVzcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGpwZ1NpemUgPSB0aGlzLl9fT0NSRW5naW5lLmdldEVuY29kZWRKcGdTaXplKCk7XG4gICAgICBjb25zdCBqcGdQb2ludGVyID0gdGhpcy5fX09DUkVuZ2luZS5nZXRFbmNvZGVkSnBnQnVmZmVyKCk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdFZpZXcgPSBuZXcgVWludDhBcnJheSh0aGlzLl9fT0NSRW5naW5lLkhFQVA4LmJ1ZmZlciwganBnUG9pbnRlciwganBnU2l6ZSk7XG4gICAgICBjb25zdCByZXN1bHQgPSBuZXcgVWludDhBcnJheShyZXN1bHRWaWV3KTtcblxuICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtyZXN1bHRdLCB7IHR5cGU6ICdpbWFnZS9qcGVnJyB9KTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9fYmxvYlRvQmFzZTY0KGJsb2IpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yOicgKyBlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuX19PQ1JFbmdpbmUuZGVzdHJveUVuY29kZWRKcGcoKTtcbiAgICB9XG4gIH1cbiAgLy8gVE9ETyA6IGNyZWRpdCBjYXJkIOyXkOyEnCDsgqzsmqnspJHsnbTslrTshJwg7IKt7KCcIOu2iOqwgCAod2FzbSDroIjrsqjroZwg67OA6rK965CgIOqyveyasCDsgq3soJwg6rCA64qlKSAtLSBFTkRcblxuICBhc3luYyBfX3N0YXJ0U2Nhbldhc20oKSB7XG4gICAgdGhpcy5fX2RlYnVnKCd3YXNtX21vZGUnKTtcbiAgICB0aGlzLmNsZWFudXAoKTtcbiAgICBhd2FpdCB0aGlzLl9fcHJvY2VlZENhbWVyYVBlcm1pc3Npb24oKTtcbiAgICBhd2FpdCB0aGlzLl9fc3RhcnRTY2FuV2FzbUltcGwoKTtcbiAgICBjb25zb2xlLmxvZygnU0NBTiBFTkQnKTtcbiAgfVxuXG4gIGFzeW5jIF9fc3RhcnRTY2FuU2VydmVyKCkge1xuICAgIHRoaXMuX19kZWJ1Zygnc2VydmVyX21vZGUnKTtcbiAgICB0aGlzLmNsZWFudXAoKTtcbiAgICB0aGlzLl9fb3B0aW9ucy51c2VDYXB0dXJlVUkgPSB0cnVlO1xuXG4gICAgYXdhaXQgdGhpcy5fX3Byb2NlZWRDYW1lcmFQZXJtaXNzaW9uKCk7XG4gICAgYXdhaXQgdGhpcy5fX3N0YXJ0U2NhblNlcnZlckltcGwoKTtcbiAgICBjb25zb2xlLmxvZygnU0NBTiBFTkQnKTtcbiAgfVxuXG4gIGFzeW5jIF9fcmVjb3ZlcnlTY2FuKCkge1xuICAgIGNvbnNvbGUubG9nKCchISEgUkVDT1ZFUlkgU0NBTiAhISEnKTtcbiAgICB0aGlzLl9fcmVzb3VyY2VzTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5zdG9wU2NhbigpO1xuICAgIGF3YWl0IHRoaXMuX19zdGFydFNjYW5XYXNtKCk7XG4gIH1cblxuICBzdG9wU2NhbigpIHtcbiAgICB0aGlzLl9fZGV0ZWN0ZWQgPSB0cnVlOyAvLyBzd2l0Y2ggdG8gc2VydmVy7J2865WMIOq4sOyhtCBXQVNNIGxvb3Ag6rCV7KCc7KKF66OMXG4gICAgY29uc3QgeyBjYW52YXMgfSA9IGRldGVjdG9yLmdldE9DUkVsZW1lbnRzKCk7XG4gICAgaWYgKGNhbnZhcykge1xuICAgICAgY29uc3QgY2FudmFzQ29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHtcbiAgICAgICAgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBjYW52YXNDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BTdHJlYW0oKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fX3JlcXVlc3RBbmltYXRpb25GcmFtZUlkKTtcbiAgICBpZiAodGhpcy5fX3N0cmVhbSkge1xuICAgICAgdGhpcy5fX3N0cmVhbS5zdG9wICYmIHRoaXMuX19zdHJlYW0uc3RvcCgpO1xuICAgICAgbGV0IHRyYWNrcyA9IHRoaXMuX19zdHJlYW0uZ2V0VHJhY2tzICYmIHRoaXMuX19zdHJlYW0uZ2V0VHJhY2tzKCk7XG4gICAgICBjb25zb2xlLmRlYnVnKCdDYXJkU2Nhbl9fc3RvcFN0cmVhbScsIHRyYWNrcyk7XG4gICAgICBpZiAodHJhY2tzICYmIHRyYWNrcy5sZW5ndGgpIHtcbiAgICAgICAgdHJhY2tzLmZvckVhY2goKHRyYWNrKSA9PiB0cmFjay5zdG9wKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX3N0cmVhbSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIOuplOuqqOumrCBhbGxvY2F0aW9uIGZyZWUg7ZWo7IiYICovXG4gIGNsZWFudXAoKSB7XG4gICAgdGhpcy5fX2Rlc3Ryb3lTY2FubmVyQWRkcmVzcygpO1xuICAgIHRoaXMuX19kZXN0cm95QnVmZmVyKCk7XG4gICAgdGhpcy5fX2Rlc3Ryb3lQcmV2SW1hZ2UoKTtcbiAgICB0aGlzLl9fZGVzdHJveVN0cmluZ09uV2FzbUhlYXAoKTtcbiAgfVxuXG4gIHJlc3RvcmVJbml0aWFsaXplKCkge1xuICAgIHRoaXMuX19pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuX19wcmVsb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9fcHJlbG9hZGluZ1N0YXR1cyA9IHRoaXMuUFJFTE9BRElOR19TVEFUVVMuTk9UX1NUQVJURUQ7XG4gICAgdGhpcy5fX3Jlc291cmNlc0xvYWRlZCA9IGZhbHNlO1xuICB9XG5cbiAgX19jbGVhckNhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIoKSB7XG4gICAgaWYgKHRoaXMuX19jYW1lcmFQZXJtaXNzaW9uVGltZW91dFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fX2NhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIpO1xuICAgICAgdGhpcy5fX2NhbWVyYVBlcm1pc3Npb25UaW1lb3V0VGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VCT0NSO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBLE9BQU9BLFFBQVEsTUFBTSx1QkFBdUI7QUFDNUMsT0FBT0MsaUJBQWlCLE1BQU0sbUNBQW1DO0FBQ2pF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
