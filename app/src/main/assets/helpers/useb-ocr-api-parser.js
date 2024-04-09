function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */

import objectUtil from './object-util.js';

/* global-module */
class OcrResultParser {
  constructor() {
    _defineProperty(this, "__ocrTypeList", ['idcard', 'driver', 'passport', 'foreign-passport', 'alien', 'credit', 'idcard-ssa', 'driver-ssa', 'passport-ssa', 'foreign-passport-ssa', 'alien-ssa', 'credit-ssa']);
    _defineProperty(this, "MASK_INFO", ['rect_id_issue_date', 'rect_id_number', 'rect_kor_personal_number', 'rect_license_number', 'rect_overseas_residents', 'rect_passport_jumin_number', 'rect_passport_number', 'rect_passport_number_mrz']);
    _defineProperty(this, "RESULT_SCAN_TYPE_MAP", {
      RESIDENT_REGISTRATION: '1',
      DRIVER_LICENSE: '2',
      PASSPORT: '3',
      PASSPORT_OVERSEA: '4',
      // TODO 현재 SERVER SDK 구분안함
      ALIEN_REGISTRATION: '5',
      ALIEN_REGISTRATION_1: '5-1',
      // TODO 현재 SERVER SDK 구분안함
      ALIEN_REGISTRATION_2: '5-2',
      // TODO 현재 SERVER SDK 구분안함
      ALIEN_REGISTRATION_3: '5-3' // TODO 현재 SERVER SDK 구분안함
    });
    _defineProperty(this, "RESULT_MASKING_TYPE_MAP", {
      1: 'kor',
      2: 'driver',
      3: 'passport',
      4: 'passport-oversea',
      // TODO 현재 SERVER SDK 구분안함
      5: 'alien'
    });
  }
  parseOcrResult(ocrType, ssaMode, ocrResult) {
    if (!this.__ocrTypeList.includes(ocrType)) throw new Error('ResultParser :: Unsupported OCR type');
    var legacyFormat = {},
      newFormat = {},
      maskInfo = {},
      base64ImageResult = {};

    // base64 처리
    this.__parseBase64ImageResult(ocrResult, base64ImageResult);
    switch (ocrType) {
      case 'idcard':
      case 'driver':
      case 'idcard-ssa':
      case 'driver-ssa':
        var result = this.__parseIdDriver(ocrResult);
        _.assign(newFormat, result.newFormat);
        _.assign(legacyFormat, result.legacyFormat);
        _.assign(maskInfo, result.maskInfo);
        break;
      case 'passport':
      case 'passport-ssa':
      case 'foreign-passport':
      case 'foreign-passport-ssa':
        var passport_result = this.__parsePassport(ocrResult); // prettier-ignore
        _.assign(newFormat, passport_result.newFormat);
        _.assign(legacyFormat, passport_result.legacyFormat);
        _.assign(maskInfo, passport_result.maskInfo);
        break;
      case 'alien':
      case 'alien-back':
      case 'alien-ssa':
        var alien_result = this.__parseAlien(ocrResult); // prettier-ignore
        _.assign(newFormat, alien_result.newFormat);
        _.assign(legacyFormat, alien_result.legacyFormat);
        _.assign(maskInfo, alien_result.maskInfo);
        break;
      case 'credit':
      case 'credit-ssa':
        this.__parseCredit(ocrResult, legacyFormat, newFormat);
        break;
      default:
        throw new Error('Unsupported OCR type');
    }

    // SSA 처리
    if (!ssaMode) {
      delete legacyFormat.truth;
      delete legacyFormat.truthConfidence;
      delete legacyFormat.truthRetryCount;
      delete newFormat.id_truth;
      delete newFormat.fd_confidence;
      delete newFormat.id_truth_retry_count;
    }
    return {
      legacyFormat,
      newFormat,
      base64ImageResult,
      maskInfo
    };
  }
  __parseBase64ImageResult(ocrResult, base64ImageResult) {
    if (ocrResult.image_base64_mask && !ocrResult.image_base64_mask.startsWith('data:image')) {
      ocrResult.image_base64_mask = 'data:image/jpeg;base64,' + ocrResult.image_base64_mask;
    }
    if (ocrResult.image_base64_face && !ocrResult.image_base64_face.startsWith('data:image')) {
      ocrResult.image_base64_face = 'data:image/jpeg;base64,' + ocrResult.image_base64_face;
    }
    var newFormatKeyMapBase64Image = {
      image_base64_mask: 'ocr_masking_image',
      image_base64_face: 'ocr_face_image'
    };
    this.__convertServerToWasmFormat(ocrResult, base64ImageResult, newFormatKeyMapBase64Image);
  }
  __convertServerToWasmFormat(obj, wasmFormat, map) {
    for (var key in map) {
      var targetValue = objectUtil.getObjectValueWithDot(obj, key);
      var targetObj = {};
      objectUtil.makeObjectWithDot(targetObj, map[key], targetValue);
      objectUtil.objectDeepMerge(wasmFormat, targetObj);
    }
    return wasmFormat;
  }

  /**
   * @param {*} ocrResult
   * @return { newFormat, legacyFormat, maskInfo }
   */
  __parseIdDriver(ocrResult) {
    var _ref, _flat$fd_confidence;
    // TODO wasm에서 지원해주는 idType 값이 없어 임의 매핑 (해외 여권이랑 외국인등록증 구분안되는 문제 있음)
    var idType = ocrResult.result_scan_type ? this.RESULT_SCAN_TYPE_MAP[ocrResult.result_scan_type] : ocrResult.data.idType;
    var flat = this.flatObj(ocrResult);

    // 주민번호 형식 000000-0000000
    var jumin = this.getIdNumberFormat(flat.jumin);

    // new format ##########################
    // id 객체에서 flat 하게 만들 대상들
    var newFormatKeys = ['complete', 'name', 'jumin', 'issued_date', 'region', 'found_face', 'specular_ratio', 'id_truth', 'fd_confidence'];
    var newFormat = _.pick(flat, newFormatKeys);
    newFormat.complete = newFormat.complete + '';
    newFormat.jumin = jumin;
    newFormat.id_truth_retry_count = 0;
    newFormat.result_scan_type = idType;
    newFormat.fd_confidence = (_ref = ((_flat$fd_confidence = flat.fd_confidence) === null || _flat$fd_confidence === void 0 ? void 0 : _flat$fd_confidence.toFixed(3)) + '') !== null && _ref !== void 0 ? _ref : '';
    newFormat.found_face = flat.found_face + '';
    newFormat.specular_ratio = flat.specular_ratio + '';

    // 주민등록증 추가 정보 주입
    if (idType === '1') newFormat.overseas_resident = 'false';

    // 주민번호 형식 리턴값 형식 변경 - birth 추가 // TODO : 여권은 birthday?
    newFormat.birth = jumin.length >= 6 ? jumin.slice(0, 6) : '';

    // 운전면허증일때 추가 정보 주입
    if (idType === '2') {
      var {
        value
      } = this.getDriverLicense(flat.driver_number); // prettier-ignore
      // newFormat.is_old_format_driver_number = isOldFormat;
      newFormat.driver_number = value;
      newFormat.driver_serial = flat.driver_serial;
      newFormat.driver_type = flat.driver_type;
    }

    // legacy format ##########################
    var legacyFormat = {
      Completed: newFormat.complete,
      type: idType,
      name: flat.name,
      number: jumin,
      Date: flat.issued_date,
      region: flat.region,
      truth: flat.id_truth,
      truthConfidence: newFormat.fd_confidence,
      truthRetryCount: 0,
      face_score: newFormat.found_face,
      specular: newFormat.specular_ratio,
      id_type: idType
    };

    // 운전면허증일때 추가 정보 주입
    legacyFormat.licenseNumber = newFormat.driver_number;
    legacyFormat.serial = newFormat.driver_serial;
    legacyFormat.licenseType = newFormat.driver_type;
    return {
      newFormat,
      legacyFormat,
      maskInfo: this.getMaskInfo(flat, idType)
    };
  }
  __parsePassport(ocrResult) {
    var _ref2, _flat$fd_confidence2;
    // TODO wasm에서 지원해주는 idType 값이 없어 임의 매핑 (해외 여권이랑 외국인등록증 구분안되는 문제 있음)
    var idType = this.RESULT_SCAN_TYPE_MAP[ocrResult.result_scan_type];
    var flat = this.flatObj(ocrResult);

    // 주민번호 형식 000000-0000000
    var jumin = this.getIdNumberFormat(flat.jumin);

    // new format ##########################
    // id 객체에서 flat 하게 만들 대상들
    // prettier-ignore
    var newFormatKeys = ['complete', 'name', 'sur_name', 'given_name', 'passport_type', 'issuing_country', 'passport_number', 'nationality', 'issued_date', 'sex', 'expiry_date', 'personal_number', 'jumin', 'birthday', 'name_kor', 'color_point', 'found_face', 'specular_ratio', 'mrz1', 'mrz2', 'id_truth', 'fd_confidence'];
    var newFormat = _.pick(flat, newFormatKeys);
    newFormat.complete = newFormat.complete + '';
    newFormat.jumin = jumin;
    newFormat.id_truth_retry_count = 0;
    newFormat.result_scan_type = idType;
    newFormat.fd_confidence = (_ref2 = ((_flat$fd_confidence2 = flat.fd_confidence) === null || _flat$fd_confidence2 === void 0 ? void 0 : _flat$fd_confidence2.toFixed(3)) + '') !== null && _ref2 !== void 0 ? _ref2 : '';
    newFormat.found_face = flat.found_face + '';
    newFormat.specular_ratio = flat.specular_ratio + '';

    // legacy format ##########################
    var legacyFormat = {
      Completed: newFormat.complete,
      name: flat.name,
      surName: flat.sur_name,
      givenName: flat.given_name,
      type: flat.passport_type,
      issuing_country: flat.issuing_country,
      passport_no: flat.passport_number,
      nationality: flat.nationality,
      date_of_issue: flat.issued_date,
      sex: flat.sex,
      date_of_expiry: flat.expiry_date,
      personal_no: flat.personal_number,
      number: jumin,
      date_of_birth: flat.birthday,
      name_kor: flat.name_kor,
      mrz1: flat.mrz1,
      mrz2: flat.mrz2,
      face_score: newFormat.found_face,
      specular: newFormat.specular_ratio,
      id_type: idType,
      truth: flat.id_truth,
      truthConfidence: newFormat.fd_confidence,
      truthRetryCount: 0
    };
    return {
      newFormat,
      legacyFormat,
      maskInfo: this.getMaskInfo(flat, idType)
    };
  }
  __parseAlien(ocrResult) {
    var _ref3, _flat$fd_confidence3, _flat$nationality, _flat$visa_type, _flat$name_kor;
    // TODO wasm에서 지원해주는 idType 값이 없어 임의 매핑 (해외 여권이랑 외국인등록증 구분안되는 문제 있음)
    var idType = this.RESULT_SCAN_TYPE_MAP[ocrResult.result_scan_type];
    var defaultObj = {
      nationality: '',
      visa_type: '',
      name_kor: ''
    };
    var flat = _.assign(defaultObj, this.flatObj(ocrResult));

    // 주민번호 형식 000000-0000000
    var jumin = this.getIdNumberFormat(flat.jumin);

    // new format ##########################
    // id 객체에서 flat 하게 만들 대상들
    var newFormatKeys = ['complete', 'name', 'jumin', 'issued_date', 'nationality', 'visa_type', 'name_kor', 'found_face', 'specular_ratio', 'id_truth', 'fd_confidence'];
    var newFormat = _.pick(flat, newFormatKeys);
    newFormat.complete = newFormat.complete + '';
    newFormat.jumin = jumin;
    newFormat.id_truth_retry_count = 0;
    newFormat.result_scan_type = idType;
    newFormat.fd_confidence = (_ref3 = ((_flat$fd_confidence3 = flat.fd_confidence) === null || _flat$fd_confidence3 === void 0 ? void 0 : _flat$fd_confidence3.toFixed(3)) + '') !== null && _ref3 !== void 0 ? _ref3 : '';
    newFormat.found_face = flat.found_face + '';
    newFormat.specular_ratio = flat.specular_ratio + '';
    var legacyFormat = {
      Completed: newFormat.complete,
      name: flat.name,
      number: jumin,
      Date: flat.issued_date,
      nationality: (_flat$nationality = flat.nationality) !== null && _flat$nationality !== void 0 ? _flat$nationality : '',
      visaType: (_flat$visa_type = flat.visa_type) !== null && _flat$visa_type !== void 0 ? _flat$visa_type : '',
      name_kor: (_flat$name_kor = flat.name_kor) !== null && _flat$name_kor !== void 0 ? _flat$name_kor : '',
      face_score: newFormat.found_face,
      specular: newFormat.specular_ratio,
      id_type: idType,
      truth: flat.id_truth,
      truthConfidence: newFormat.fd_confidence,
      truthRetryCount: 0
    };
    return {
      newFormat,
      legacyFormat,
      maskInfo: this.getMaskInfo(flat, idType)
    };
  }
  __parseCredit(ocrResult) {
    var target = {};
    var resultSplit = ocrResult.split(',');
    var resultIndex = 0;
    if (resultIndex < resultSplit.length) target.Completed = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) target.number = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) target.exp_date = resultSplit[resultIndex], resultIndex++;
    return [target, target];
  }
  getMaskInfo(obj, idType) {
    var result = {
      type: this.RESULT_MASKING_TYPE_MAP[idType + '']
    };
    this.MASK_INFO.forEach(el => {
      if (_.has(obj, el) && obj[el] !== '0,0,0,0') {
        result[el] = obj[el];
      }
    });
    return result;
  }
  getDriverLicense(value) {
    var _value;
    // 구형 면허증 포멧 판정 (ex: 제주 13-001234-12 -> true)
    var regex = /[가-힣]/g;
    var isOldFormat = (_value = value) === null || _value === void 0 ? void 0 : _value.match(regex);
    if (isOldFormat) value = value.replace(' ', '-');
    return {
      isOldFormat,
      value
    };
  }

  // 주민번호 형식 리턴값 형식 변경
  getIdNumberFormat(value) {
    if ((value === null || value === void 0 ? void 0 : value.length) === 14) return value;
    return (value === null || value === void 0 ? void 0 : value.length) === 13 ? value.slice(0, 6) + '-' + value.slice(6, 13) : '';
  }
  flatObj(obj) {
    var result = {};
    for (var key in obj) {
      var value = obj[key];
      if (value instanceof Object && !Array.isArray(value)) {
        var innerResult = this.flatObj(value);
        _.assign(result, innerResult);
      } else result[key] = value;
    }
    return result;
  }
}
export default new OcrResultParser();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy91c2ViLW9jci1hcGktcGFyc2VyLmpzIiwibmFtZXMiOlsib2JqZWN0VXRpbCIsIk9jclJlc3VsdFBhcnNlciIsImNvbnN0cnVjdG9yIiwiX2RlZmluZVByb3BlcnR5IiwiUkVTSURFTlRfUkVHSVNUUkFUSU9OIiwiRFJJVkVSX0xJQ0VOU0UiLCJQQVNTUE9SVCIsIlBBU1NQT1JUX09WRVJTRUEiLCJBTElFTl9SRUdJU1RSQVRJT04iLCJBTElFTl9SRUdJU1RSQVRJT05fMSIsIkFMSUVOX1JFR0lTVFJBVElPTl8yIiwiQUxJRU5fUkVHSVNUUkFUSU9OXzMiLCJwYXJzZU9jclJlc3VsdCIsIm9jclR5cGUiLCJzc2FNb2RlIiwib2NyUmVzdWx0IiwiX19vY3JUeXBlTGlzdCIsImluY2x1ZGVzIiwiRXJyb3IiLCJsZWdhY3lGb3JtYXQiLCJuZXdGb3JtYXQiLCJtYXNrSW5mbyIsImJhc2U2NEltYWdlUmVzdWx0IiwiX19wYXJzZUJhc2U2NEltYWdlUmVzdWx0IiwicmVzdWx0IiwiX19wYXJzZUlkRHJpdmVyIiwiXyIsImFzc2lnbiIsInBhc3Nwb3J0X3Jlc3VsdCIsIl9fcGFyc2VQYXNzcG9ydCIsImFsaWVuX3Jlc3VsdCIsIl9fcGFyc2VBbGllbiIsIl9fcGFyc2VDcmVkaXQiLCJ0cnV0aCIsInRydXRoQ29uZmlkZW5jZSIsInRydXRoUmV0cnlDb3VudCIsImlkX3RydXRoIiwiZmRfY29uZmlkZW5jZSIsImlkX3RydXRoX3JldHJ5X2NvdW50IiwiaW1hZ2VfYmFzZTY0X21hc2siLCJzdGFydHNXaXRoIiwiaW1hZ2VfYmFzZTY0X2ZhY2UiLCJuZXdGb3JtYXRLZXlNYXBCYXNlNjRJbWFnZSIsIl9fY29udmVydFNlcnZlclRvV2FzbUZvcm1hdCIsIm9iaiIsIndhc21Gb3JtYXQiLCJtYXAiLCJrZXkiLCJ0YXJnZXRWYWx1ZSIsImdldE9iamVjdFZhbHVlV2l0aERvdCIsInRhcmdldE9iaiIsIm1ha2VPYmplY3RXaXRoRG90Iiwib2JqZWN0RGVlcE1lcmdlIiwiX3JlZiIsIl9mbGF0JGZkX2NvbmZpZGVuY2UiLCJpZFR5cGUiLCJyZXN1bHRfc2Nhbl90eXBlIiwiUkVTVUxUX1NDQU5fVFlQRV9NQVAiLCJkYXRhIiwiZmxhdCIsImZsYXRPYmoiLCJqdW1pbiIsImdldElkTnVtYmVyRm9ybWF0IiwibmV3Rm9ybWF0S2V5cyIsInBpY2siLCJjb21wbGV0ZSIsInRvRml4ZWQiLCJmb3VuZF9mYWNlIiwic3BlY3VsYXJfcmF0aW8iLCJvdmVyc2Vhc19yZXNpZGVudCIsImJpcnRoIiwibGVuZ3RoIiwic2xpY2UiLCJ2YWx1ZSIsImdldERyaXZlckxpY2Vuc2UiLCJkcml2ZXJfbnVtYmVyIiwiZHJpdmVyX3NlcmlhbCIsImRyaXZlcl90eXBlIiwiQ29tcGxldGVkIiwidHlwZSIsIm5hbWUiLCJudW1iZXIiLCJEYXRlIiwiaXNzdWVkX2RhdGUiLCJyZWdpb24iLCJmYWNlX3Njb3JlIiwic3BlY3VsYXIiLCJpZF90eXBlIiwibGljZW5zZU51bWJlciIsInNlcmlhbCIsImxpY2Vuc2VUeXBlIiwiZ2V0TWFza0luZm8iLCJfcmVmMiIsIl9mbGF0JGZkX2NvbmZpZGVuY2UyIiwic3VyTmFtZSIsInN1cl9uYW1lIiwiZ2l2ZW5OYW1lIiwiZ2l2ZW5fbmFtZSIsInBhc3Nwb3J0X3R5cGUiLCJpc3N1aW5nX2NvdW50cnkiLCJwYXNzcG9ydF9ubyIsInBhc3Nwb3J0X251bWJlciIsIm5hdGlvbmFsaXR5IiwiZGF0ZV9vZl9pc3N1ZSIsInNleCIsImRhdGVfb2ZfZXhwaXJ5IiwiZXhwaXJ5X2RhdGUiLCJwZXJzb25hbF9ubyIsInBlcnNvbmFsX251bWJlciIsImRhdGVfb2ZfYmlydGgiLCJiaXJ0aGRheSIsIm5hbWVfa29yIiwibXJ6MSIsIm1yejIiLCJfcmVmMyIsIl9mbGF0JGZkX2NvbmZpZGVuY2UzIiwiX2ZsYXQkbmF0aW9uYWxpdHkiLCJfZmxhdCR2aXNhX3R5cGUiLCJfZmxhdCRuYW1lX2tvciIsImRlZmF1bHRPYmoiLCJ2aXNhX3R5cGUiLCJ2aXNhVHlwZSIsInRhcmdldCIsInJlc3VsdFNwbGl0Iiwic3BsaXQiLCJyZXN1bHRJbmRleCIsImV4cF9kYXRlIiwiUkVTVUxUX01BU0tJTkdfVFlQRV9NQVAiLCJNQVNLX0lORk8iLCJmb3JFYWNoIiwiZWwiLCJoYXMiLCJfdmFsdWUiLCJyZWdleCIsImlzT2xkRm9ybWF0IiwibWF0Y2giLCJyZXBsYWNlIiwiT2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiaW5uZXJSZXN1bHQiXSwic291cmNlcyI6WyJoZWxwZXJzL3VzZWItb2NyLWFwaS1wYXJzZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IG9iamVjdFV0aWwgZnJvbSAnLi9vYmplY3QtdXRpbC5qcyc7XG5cbi8qIGdsb2JhbC1tb2R1bGUgKi9cbmNsYXNzIE9jclJlc3VsdFBhcnNlciB7XG4gIF9fb2NyVHlwZUxpc3QgPSBbXG4gICAgJ2lkY2FyZCcsXG4gICAgJ2RyaXZlcicsXG4gICAgJ3Bhc3Nwb3J0JyxcbiAgICAnZm9yZWlnbi1wYXNzcG9ydCcsXG4gICAgJ2FsaWVuJyxcbiAgICAnY3JlZGl0JyxcbiAgICAnaWRjYXJkLXNzYScsXG4gICAgJ2RyaXZlci1zc2EnLFxuICAgICdwYXNzcG9ydC1zc2EnLFxuICAgICdmb3JlaWduLXBhc3Nwb3J0LXNzYScsXG4gICAgJ2FsaWVuLXNzYScsXG4gICAgJ2NyZWRpdC1zc2EnLFxuICBdO1xuXG4gIE1BU0tfSU5GTyA9IFtcbiAgICAncmVjdF9pZF9pc3N1ZV9kYXRlJyxcbiAgICAncmVjdF9pZF9udW1iZXInLFxuICAgICdyZWN0X2tvcl9wZXJzb25hbF9udW1iZXInLFxuICAgICdyZWN0X2xpY2Vuc2VfbnVtYmVyJyxcbiAgICAncmVjdF9vdmVyc2Vhc19yZXNpZGVudHMnLFxuICAgICdyZWN0X3Bhc3Nwb3J0X2p1bWluX251bWJlcicsXG4gICAgJ3JlY3RfcGFzc3BvcnRfbnVtYmVyJyxcbiAgICAncmVjdF9wYXNzcG9ydF9udW1iZXJfbXJ6JyxcbiAgXTtcblxuICBSRVNVTFRfU0NBTl9UWVBFX01BUCA9IHtcbiAgICBSRVNJREVOVF9SRUdJU1RSQVRJT046ICcxJyxcbiAgICBEUklWRVJfTElDRU5TRTogJzInLFxuICAgIFBBU1NQT1JUOiAnMycsXG4gICAgUEFTU1BPUlRfT1ZFUlNFQTogJzQnLCAvLyBUT0RPIO2YhOyerCBTRVJWRVIgU0RLIOq1rOu2hOyViO2VqFxuICAgIEFMSUVOX1JFR0lTVFJBVElPTjogJzUnLFxuICAgIEFMSUVOX1JFR0lTVFJBVElPTl8xOiAnNS0xJywgLy8gVE9ETyDtmITsnqwgU0VSVkVSIFNESyDqtazrtoTslYjtlahcbiAgICBBTElFTl9SRUdJU1RSQVRJT05fMjogJzUtMicsIC8vIFRPRE8g7ZiE7J6sIFNFUlZFUiBTREsg6rWs67aE7JWI7ZWoXG4gICAgQUxJRU5fUkVHSVNUUkFUSU9OXzM6ICc1LTMnLCAvLyBUT0RPIO2YhOyerCBTRVJWRVIgU0RLIOq1rOu2hOyViO2VqFxuICB9O1xuXG4gIFJFU1VMVF9NQVNLSU5HX1RZUEVfTUFQID0ge1xuICAgIDE6ICdrb3InLFxuICAgIDI6ICdkcml2ZXInLFxuICAgIDM6ICdwYXNzcG9ydCcsXG4gICAgNDogJ3Bhc3Nwb3J0LW92ZXJzZWEnLCAvLyBUT0RPIO2YhOyerCBTRVJWRVIgU0RLIOq1rOu2hOyViO2VqFxuICAgIDU6ICdhbGllbicsXG4gIH07XG5cbiAgcGFyc2VPY3JSZXN1bHQob2NyVHlwZSwgc3NhTW9kZSwgb2NyUmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLl9fb2NyVHlwZUxpc3QuaW5jbHVkZXMob2NyVHlwZSkpIHRocm93IG5ldyBFcnJvcignUmVzdWx0UGFyc2VyIDo6IFVuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG4gICAgY29uc3QgbGVnYWN5Rm9ybWF0ID0ge30sXG4gICAgICBuZXdGb3JtYXQgPSB7fSxcbiAgICAgIG1hc2tJbmZvID0ge30sXG4gICAgICBiYXNlNjRJbWFnZVJlc3VsdCA9IHt9O1xuXG4gICAgLy8gYmFzZTY0IOyymOumrFxuICAgIHRoaXMuX19wYXJzZUJhc2U2NEltYWdlUmVzdWx0KG9jclJlc3VsdCwgYmFzZTY0SW1hZ2VSZXN1bHQpO1xuXG4gICAgc3dpdGNoIChvY3JUeXBlKSB7XG4gICAgICBjYXNlICdpZGNhcmQnOlxuICAgICAgY2FzZSAnZHJpdmVyJzpcbiAgICAgIGNhc2UgJ2lkY2FyZC1zc2EnOlxuICAgICAgY2FzZSAnZHJpdmVyLXNzYSc6XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX19wYXJzZUlkRHJpdmVyKG9jclJlc3VsdCk7XG4gICAgICAgIF8uYXNzaWduKG5ld0Zvcm1hdCwgcmVzdWx0Lm5ld0Zvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKGxlZ2FjeUZvcm1hdCwgcmVzdWx0LmxlZ2FjeUZvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKG1hc2tJbmZvLCByZXN1bHQubWFza0luZm8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0LXNzYSc6XG4gICAgICBjYXNlICdmb3JlaWduLXBhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgY29uc3QgcGFzc3BvcnRfcmVzdWx0ID0gdGhpcy5fX3BhcnNlUGFzc3BvcnQob2NyUmVzdWx0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgIF8uYXNzaWduKG5ld0Zvcm1hdCwgcGFzc3BvcnRfcmVzdWx0Lm5ld0Zvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKGxlZ2FjeUZvcm1hdCwgcGFzc3BvcnRfcmVzdWx0LmxlZ2FjeUZvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKG1hc2tJbmZvLCBwYXNzcG9ydF9yZXN1bHQubWFza0luZm8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FsaWVuJzpcbiAgICAgIGNhc2UgJ2FsaWVuLWJhY2snOlxuICAgICAgY2FzZSAnYWxpZW4tc3NhJzpcbiAgICAgICAgY29uc3QgYWxpZW5fcmVzdWx0ID0gdGhpcy5fX3BhcnNlQWxpZW4ob2NyUmVzdWx0KTsgLy8gcHJldHRpZXItaWdub3JlXG4gICAgICAgIF8uYXNzaWduKG5ld0Zvcm1hdCwgYWxpZW5fcmVzdWx0Lm5ld0Zvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKGxlZ2FjeUZvcm1hdCwgYWxpZW5fcmVzdWx0LmxlZ2FjeUZvcm1hdCk7XG4gICAgICAgIF8uYXNzaWduKG1hc2tJbmZvLCBhbGllbl9yZXN1bHQubWFza0luZm8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NyZWRpdCc6XG4gICAgICBjYXNlICdjcmVkaXQtc3NhJzpcbiAgICAgICAgdGhpcy5fX3BhcnNlQ3JlZGl0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0LCBuZXdGb3JtYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgT0NSIHR5cGUnKTtcbiAgICB9XG5cbiAgICAvLyBTU0Eg7LKY66asXG4gICAgaWYgKCFzc2FNb2RlKSB7XG4gICAgICBkZWxldGUgbGVnYWN5Rm9ybWF0LnRydXRoO1xuICAgICAgZGVsZXRlIGxlZ2FjeUZvcm1hdC50cnV0aENvbmZpZGVuY2U7XG4gICAgICBkZWxldGUgbGVnYWN5Rm9ybWF0LnRydXRoUmV0cnlDb3VudDtcbiAgICAgIGRlbGV0ZSBuZXdGb3JtYXQuaWRfdHJ1dGg7XG4gICAgICBkZWxldGUgbmV3Rm9ybWF0LmZkX2NvbmZpZGVuY2U7XG4gICAgICBkZWxldGUgbmV3Rm9ybWF0LmlkX3RydXRoX3JldHJ5X2NvdW50O1xuICAgIH1cblxuICAgIHJldHVybiB7IGxlZ2FjeUZvcm1hdCwgbmV3Rm9ybWF0LCBiYXNlNjRJbWFnZVJlc3VsdCwgbWFza0luZm8gfTtcbiAgfVxuXG4gIF9fcGFyc2VCYXNlNjRJbWFnZVJlc3VsdChvY3JSZXN1bHQsIGJhc2U2NEltYWdlUmVzdWx0KSB7XG4gICAgaWYgKG9jclJlc3VsdC5pbWFnZV9iYXNlNjRfbWFzayAmJiAhb2NyUmVzdWx0LmltYWdlX2Jhc2U2NF9tYXNrLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2UnKSkge1xuICAgICAgb2NyUmVzdWx0LmltYWdlX2Jhc2U2NF9tYXNrID0gJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJyArIG9jclJlc3VsdC5pbWFnZV9iYXNlNjRfbWFzaztcbiAgICB9XG5cbiAgICBpZiAob2NyUmVzdWx0LmltYWdlX2Jhc2U2NF9mYWNlICYmICFvY3JSZXN1bHQuaW1hZ2VfYmFzZTY0X2ZhY2Uuc3RhcnRzV2l0aCgnZGF0YTppbWFnZScpKSB7XG4gICAgICBvY3JSZXN1bHQuaW1hZ2VfYmFzZTY0X2ZhY2UgPSAnZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCwnICsgb2NyUmVzdWx0LmltYWdlX2Jhc2U2NF9mYWNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld0Zvcm1hdEtleU1hcEJhc2U2NEltYWdlID0ge1xuICAgICAgaW1hZ2VfYmFzZTY0X21hc2s6ICdvY3JfbWFza2luZ19pbWFnZScsXG4gICAgICBpbWFnZV9iYXNlNjRfZmFjZTogJ29jcl9mYWNlX2ltYWdlJyxcbiAgICB9O1xuXG4gICAgdGhpcy5fX2NvbnZlcnRTZXJ2ZXJUb1dhc21Gb3JtYXQob2NyUmVzdWx0LCBiYXNlNjRJbWFnZVJlc3VsdCwgbmV3Rm9ybWF0S2V5TWFwQmFzZTY0SW1hZ2UpO1xuICB9XG5cbiAgX19jb252ZXJ0U2VydmVyVG9XYXNtRm9ybWF0KG9iaiwgd2FzbUZvcm1hdCwgbWFwKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbWFwKSB7XG4gICAgICBjb25zdCB0YXJnZXRWYWx1ZSA9IG9iamVjdFV0aWwuZ2V0T2JqZWN0VmFsdWVXaXRoRG90KG9iaiwga2V5KTtcbiAgICAgIGNvbnN0IHRhcmdldE9iaiA9IHt9O1xuICAgICAgb2JqZWN0VXRpbC5tYWtlT2JqZWN0V2l0aERvdCh0YXJnZXRPYmosIG1hcFtrZXldLCB0YXJnZXRWYWx1ZSk7XG4gICAgICBvYmplY3RVdGlsLm9iamVjdERlZXBNZXJnZSh3YXNtRm9ybWF0LCB0YXJnZXRPYmopO1xuICAgIH1cbiAgICByZXR1cm4gd2FzbUZvcm1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyp9IG9jclJlc3VsdFxuICAgKiBAcmV0dXJuIHsgbmV3Rm9ybWF0LCBsZWdhY3lGb3JtYXQsIG1hc2tJbmZvIH1cbiAgICovXG4gIF9fcGFyc2VJZERyaXZlcihvY3JSZXN1bHQpIHtcbiAgICAvLyBUT0RPIHdhc23sl5DshJwg7KeA7JuQ7ZW07KO864qUIGlkVHlwZSDqsJLsnbQg7JeG7Ja0IOyehOydmCDrp6TtlZEgKO2VtOyZuCDsl6zqtozsnbTrnpEg7Jm46rWt7J2465Ox66Gd7KadIOq1rOu2hOyViOuQmOuKlCDrrLjsoJwg7J6I7J2MKVxuICAgIGNvbnN0IGlkVHlwZSA9IG9jclJlc3VsdC5yZXN1bHRfc2Nhbl90eXBlXG4gICAgICA/IHRoaXMuUkVTVUxUX1NDQU5fVFlQRV9NQVBbb2NyUmVzdWx0LnJlc3VsdF9zY2FuX3R5cGVdXG4gICAgICA6IG9jclJlc3VsdC5kYXRhLmlkVHlwZTtcbiAgICBjb25zdCBmbGF0ID0gdGhpcy5mbGF0T2JqKG9jclJlc3VsdCk7XG5cbiAgICAvLyDso7zrr7zrsojtmLgg7ZiV7IudIDAwMDAwMC0wMDAwMDAwXG4gICAgY29uc3QganVtaW4gPSB0aGlzLmdldElkTnVtYmVyRm9ybWF0KGZsYXQuanVtaW4pO1xuXG4gICAgLy8gbmV3IGZvcm1hdCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgIC8vIGlkIOqwneyytOyXkOyEnCBmbGF0IO2VmOqyjCDrp4zrk6Qg64yA7IOB65OkXG4gICAgY29uc3QgbmV3Rm9ybWF0S2V5cyA9IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAnbmFtZScsXG4gICAgICAnanVtaW4nLFxuICAgICAgJ2lzc3VlZF9kYXRlJyxcbiAgICAgICdyZWdpb24nLFxuICAgICAgJ2ZvdW5kX2ZhY2UnLFxuICAgICAgJ3NwZWN1bGFyX3JhdGlvJyxcbiAgICAgICdpZF90cnV0aCcsXG4gICAgICAnZmRfY29uZmlkZW5jZScsXG4gICAgXTtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSBfLnBpY2soZmxhdCwgbmV3Rm9ybWF0S2V5cyk7XG4gICAgbmV3Rm9ybWF0LmNvbXBsZXRlID0gbmV3Rm9ybWF0LmNvbXBsZXRlICsgJyc7XG4gICAgbmV3Rm9ybWF0Lmp1bWluID0ganVtaW47XG4gICAgbmV3Rm9ybWF0LmlkX3RydXRoX3JldHJ5X2NvdW50ID0gMDtcbiAgICBuZXdGb3JtYXQucmVzdWx0X3NjYW5fdHlwZSA9IGlkVHlwZTtcbiAgICBuZXdGb3JtYXQuZmRfY29uZmlkZW5jZSA9IGZsYXQuZmRfY29uZmlkZW5jZT8udG9GaXhlZCgzKSArICcnID8/ICcnO1xuICAgIG5ld0Zvcm1hdC5mb3VuZF9mYWNlID0gZmxhdC5mb3VuZF9mYWNlICsgJyc7XG4gICAgbmV3Rm9ybWF0LnNwZWN1bGFyX3JhdGlvID0gZmxhdC5zcGVjdWxhcl9yYXRpbyArICcnO1xuXG4gICAgLy8g7KO866+865Ox66Gd7KadIOy2lOqwgCDsoJXrs7Qg7KO87J6FXG4gICAgaWYgKGlkVHlwZSA9PT0gJzEnKSBuZXdGb3JtYXQub3ZlcnNlYXNfcmVzaWRlbnQgPSAnZmFsc2UnO1xuXG4gICAgLy8g7KO866+867KI7Zi4IO2YleyLnSDrpqzthLTqsJIg7ZiV7IudIOuzgOqyvSAtIGJpcnRoIOy2lOqwgCAvLyBUT0RPIDog7Jes6raM7J2AIGJpcnRoZGF5P1xuICAgIG5ld0Zvcm1hdC5iaXJ0aCA9IGp1bWluLmxlbmd0aCA+PSA2ID8ganVtaW4uc2xpY2UoMCwgNikgOiAnJztcblxuICAgIC8vIOyatOyghOuptO2XiOymneydvOuVjCDstpTqsIAg7KCV67O0IOyjvOyehVxuICAgIGlmIChpZFR5cGUgPT09ICcyJykge1xuICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gdGhpcy5nZXREcml2ZXJMaWNlbnNlKGZsYXQuZHJpdmVyX251bWJlcik7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgLy8gbmV3Rm9ybWF0LmlzX29sZF9mb3JtYXRfZHJpdmVyX251bWJlciA9IGlzT2xkRm9ybWF0O1xuICAgICAgbmV3Rm9ybWF0LmRyaXZlcl9udW1iZXIgPSB2YWx1ZTtcbiAgICAgIG5ld0Zvcm1hdC5kcml2ZXJfc2VyaWFsID0gZmxhdC5kcml2ZXJfc2VyaWFsO1xuICAgICAgbmV3Rm9ybWF0LmRyaXZlcl90eXBlID0gZmxhdC5kcml2ZXJfdHlwZTtcbiAgICB9XG5cbiAgICAvLyBsZWdhY3kgZm9ybWF0ICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgY29uc3QgbGVnYWN5Rm9ybWF0ID0ge1xuICAgICAgQ29tcGxldGVkOiBuZXdGb3JtYXQuY29tcGxldGUsXG4gICAgICB0eXBlOiBpZFR5cGUsXG4gICAgICBuYW1lOiBmbGF0Lm5hbWUsXG4gICAgICBudW1iZXI6IGp1bWluLFxuICAgICAgRGF0ZTogZmxhdC5pc3N1ZWRfZGF0ZSxcbiAgICAgIHJlZ2lvbjogZmxhdC5yZWdpb24sXG4gICAgICB0cnV0aDogZmxhdC5pZF90cnV0aCxcbiAgICAgIHRydXRoQ29uZmlkZW5jZTogbmV3Rm9ybWF0LmZkX2NvbmZpZGVuY2UsXG4gICAgICB0cnV0aFJldHJ5Q291bnQ6IDAsXG4gICAgICBmYWNlX3Njb3JlOiBuZXdGb3JtYXQuZm91bmRfZmFjZSxcbiAgICAgIHNwZWN1bGFyOiBuZXdGb3JtYXQuc3BlY3VsYXJfcmF0aW8sXG4gICAgICBpZF90eXBlOiBpZFR5cGUsXG4gICAgfTtcblxuICAgIC8vIOyatOyghOuptO2XiOymneydvOuVjCDstpTqsIAg7KCV67O0IOyjvOyehVxuICAgIGxlZ2FjeUZvcm1hdC5saWNlbnNlTnVtYmVyID0gbmV3Rm9ybWF0LmRyaXZlcl9udW1iZXI7XG4gICAgbGVnYWN5Rm9ybWF0LnNlcmlhbCA9IG5ld0Zvcm1hdC5kcml2ZXJfc2VyaWFsO1xuICAgIGxlZ2FjeUZvcm1hdC5saWNlbnNlVHlwZSA9IG5ld0Zvcm1hdC5kcml2ZXJfdHlwZTtcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGb3JtYXQsXG4gICAgICBsZWdhY3lGb3JtYXQsXG4gICAgICBtYXNrSW5mbzogdGhpcy5nZXRNYXNrSW5mbyhmbGF0LCBpZFR5cGUpLFxuICAgIH07XG4gIH1cblxuICBfX3BhcnNlUGFzc3BvcnQob2NyUmVzdWx0KSB7XG4gICAgLy8gVE9ETyB3YXNt7JeQ7IScIOyngOybkO2VtOyjvOuKlCBpZFR5cGUg6rCS7J20IOyXhuyWtCDsnoTsnZgg66ek7ZWRICjtlbTsmbgg7Jes6raM7J20656RIOyZuOq1reyduOuTseuhneymnSDqtazrtoTslYjrkJjripQg66y47KCcIOyeiOydjClcbiAgICBjb25zdCBpZFR5cGUgPSB0aGlzLlJFU1VMVF9TQ0FOX1RZUEVfTUFQW29jclJlc3VsdC5yZXN1bHRfc2Nhbl90eXBlXTtcbiAgICBjb25zdCBmbGF0ID0gdGhpcy5mbGF0T2JqKG9jclJlc3VsdCk7XG5cbiAgICAvLyDso7zrr7zrsojtmLgg7ZiV7IudIDAwMDAwMC0wMDAwMDAwXG4gICAgY29uc3QganVtaW4gPSB0aGlzLmdldElkTnVtYmVyRm9ybWF0KGZsYXQuanVtaW4pO1xuXG4gICAgLy8gbmV3IGZvcm1hdCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgIC8vIGlkIOqwneyytOyXkOyEnCBmbGF0IO2VmOqyjCDrp4zrk6Qg64yA7IOB65OkXG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgY29uc3QgbmV3Rm9ybWF0S2V5cyA9IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAnbmFtZScsXG4gICAgICAnc3VyX25hbWUnLFxuICAgICAgJ2dpdmVuX25hbWUnLFxuICAgICAgJ3Bhc3Nwb3J0X3R5cGUnLFxuICAgICAgJ2lzc3VpbmdfY291bnRyeScsXG4gICAgICAncGFzc3BvcnRfbnVtYmVyJyxcbiAgICAgICduYXRpb25hbGl0eScsXG4gICAgICAnaXNzdWVkX2RhdGUnLFxuICAgICAgJ3NleCcsXG4gICAgICAnZXhwaXJ5X2RhdGUnLFxuICAgICAgJ3BlcnNvbmFsX251bWJlcicsXG4gICAgICAnanVtaW4nLFxuICAgICAgJ2JpcnRoZGF5JyxcbiAgICAgICduYW1lX2tvcicsXG4gICAgICAnY29sb3JfcG9pbnQnLFxuICAgICAgJ2ZvdW5kX2ZhY2UnLFxuICAgICAgJ3NwZWN1bGFyX3JhdGlvJyxcbiAgICAgICdtcnoxJyxcbiAgICAgICdtcnoyJyxcbiAgICAgICdpZF90cnV0aCcsXG4gICAgICAnZmRfY29uZmlkZW5jZScsXG4gICAgXTtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSBfLnBpY2soZmxhdCwgbmV3Rm9ybWF0S2V5cyk7XG4gICAgbmV3Rm9ybWF0LmNvbXBsZXRlID0gbmV3Rm9ybWF0LmNvbXBsZXRlICsgJyc7XG4gICAgbmV3Rm9ybWF0Lmp1bWluID0ganVtaW47XG4gICAgbmV3Rm9ybWF0LmlkX3RydXRoX3JldHJ5X2NvdW50ID0gMDtcbiAgICBuZXdGb3JtYXQucmVzdWx0X3NjYW5fdHlwZSA9IGlkVHlwZTtcbiAgICBuZXdGb3JtYXQuZmRfY29uZmlkZW5jZSA9IGZsYXQuZmRfY29uZmlkZW5jZT8udG9GaXhlZCgzKSArICcnID8/ICcnO1xuICAgIG5ld0Zvcm1hdC5mb3VuZF9mYWNlID0gZmxhdC5mb3VuZF9mYWNlICsgJyc7XG4gICAgbmV3Rm9ybWF0LnNwZWN1bGFyX3JhdGlvID0gZmxhdC5zcGVjdWxhcl9yYXRpbyArICcnO1xuXG4gICAgLy8gbGVnYWN5IGZvcm1hdCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgIGNvbnN0IGxlZ2FjeUZvcm1hdCA9IHtcbiAgICAgIENvbXBsZXRlZDogbmV3Rm9ybWF0LmNvbXBsZXRlLFxuICAgICAgbmFtZTogZmxhdC5uYW1lLFxuICAgICAgc3VyTmFtZTogZmxhdC5zdXJfbmFtZSxcbiAgICAgIGdpdmVuTmFtZTogZmxhdC5naXZlbl9uYW1lLFxuICAgICAgdHlwZTogZmxhdC5wYXNzcG9ydF90eXBlLFxuICAgICAgaXNzdWluZ19jb3VudHJ5OiBmbGF0Lmlzc3VpbmdfY291bnRyeSxcbiAgICAgIHBhc3Nwb3J0X25vOiBmbGF0LnBhc3Nwb3J0X251bWJlcixcbiAgICAgIG5hdGlvbmFsaXR5OiBmbGF0Lm5hdGlvbmFsaXR5LFxuICAgICAgZGF0ZV9vZl9pc3N1ZTogZmxhdC5pc3N1ZWRfZGF0ZSxcbiAgICAgIHNleDogZmxhdC5zZXgsXG4gICAgICBkYXRlX29mX2V4cGlyeTogZmxhdC5leHBpcnlfZGF0ZSxcbiAgICAgIHBlcnNvbmFsX25vOiBmbGF0LnBlcnNvbmFsX251bWJlcixcbiAgICAgIG51bWJlcjoganVtaW4sXG4gICAgICBkYXRlX29mX2JpcnRoOiBmbGF0LmJpcnRoZGF5LFxuICAgICAgbmFtZV9rb3I6IGZsYXQubmFtZV9rb3IsXG4gICAgICBtcnoxOiBmbGF0Lm1yejEsXG4gICAgICBtcnoyOiBmbGF0Lm1yejIsXG4gICAgICBmYWNlX3Njb3JlOiBuZXdGb3JtYXQuZm91bmRfZmFjZSxcbiAgICAgIHNwZWN1bGFyOiBuZXdGb3JtYXQuc3BlY3VsYXJfcmF0aW8sXG4gICAgICBpZF90eXBlOiBpZFR5cGUsXG4gICAgICB0cnV0aDogZmxhdC5pZF90cnV0aCxcbiAgICAgIHRydXRoQ29uZmlkZW5jZTogbmV3Rm9ybWF0LmZkX2NvbmZpZGVuY2UsXG4gICAgICB0cnV0aFJldHJ5Q291bnQ6IDAsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBuZXdGb3JtYXQsXG4gICAgICBsZWdhY3lGb3JtYXQsXG4gICAgICBtYXNrSW5mbzogdGhpcy5nZXRNYXNrSW5mbyhmbGF0LCBpZFR5cGUpLFxuICAgIH07XG4gIH1cblxuICBfX3BhcnNlQWxpZW4ob2NyUmVzdWx0KSB7XG4gICAgLy8gVE9ETyB3YXNt7JeQ7IScIOyngOybkO2VtOyjvOuKlCBpZFR5cGUg6rCS7J20IOyXhuyWtCDsnoTsnZgg66ek7ZWRICjtlbTsmbgg7Jes6raM7J20656RIOyZuOq1reyduOuTseuhneymnSDqtazrtoTslYjrkJjripQg66y47KCcIOyeiOydjClcbiAgICBjb25zdCBpZFR5cGUgPSB0aGlzLlJFU1VMVF9TQ0FOX1RZUEVfTUFQW29jclJlc3VsdC5yZXN1bHRfc2Nhbl90eXBlXTtcbiAgICBjb25zdCBkZWZhdWx0T2JqID0geyBuYXRpb25hbGl0eTogJycsIHZpc2FfdHlwZTogJycsIG5hbWVfa29yOiAnJyB9O1xuICAgIGNvbnN0IGZsYXQgPSBfLmFzc2lnbihkZWZhdWx0T2JqLCB0aGlzLmZsYXRPYmoob2NyUmVzdWx0KSk7XG5cbiAgICAvLyDso7zrr7zrsojtmLgg7ZiV7IudIDAwMDAwMC0wMDAwMDAwXG4gICAgY29uc3QganVtaW4gPSB0aGlzLmdldElkTnVtYmVyRm9ybWF0KGZsYXQuanVtaW4pO1xuXG4gICAgLy8gbmV3IGZvcm1hdCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgIC8vIGlkIOqwneyytOyXkOyEnCBmbGF0IO2VmOqyjCDrp4zrk6Qg64yA7IOB65OkXG4gICAgY29uc3QgbmV3Rm9ybWF0S2V5cyA9IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAnbmFtZScsXG4gICAgICAnanVtaW4nLFxuICAgICAgJ2lzc3VlZF9kYXRlJyxcbiAgICAgICduYXRpb25hbGl0eScsXG4gICAgICAndmlzYV90eXBlJyxcbiAgICAgICduYW1lX2tvcicsXG4gICAgICAnZm91bmRfZmFjZScsXG4gICAgICAnc3BlY3VsYXJfcmF0aW8nLFxuICAgICAgJ2lkX3RydXRoJyxcbiAgICAgICdmZF9jb25maWRlbmNlJyxcbiAgICBdO1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IF8ucGljayhmbGF0LCBuZXdGb3JtYXRLZXlzKTtcbiAgICBuZXdGb3JtYXQuY29tcGxldGUgPSBuZXdGb3JtYXQuY29tcGxldGUgKyAnJztcbiAgICBuZXdGb3JtYXQuanVtaW4gPSBqdW1pbjtcbiAgICBuZXdGb3JtYXQuaWRfdHJ1dGhfcmV0cnlfY291bnQgPSAwO1xuICAgIG5ld0Zvcm1hdC5yZXN1bHRfc2Nhbl90eXBlID0gaWRUeXBlO1xuICAgIG5ld0Zvcm1hdC5mZF9jb25maWRlbmNlID0gZmxhdC5mZF9jb25maWRlbmNlPy50b0ZpeGVkKDMpICsgJycgPz8gJyc7XG4gICAgbmV3Rm9ybWF0LmZvdW5kX2ZhY2UgPSBmbGF0LmZvdW5kX2ZhY2UgKyAnJztcbiAgICBuZXdGb3JtYXQuc3BlY3VsYXJfcmF0aW8gPSBmbGF0LnNwZWN1bGFyX3JhdGlvICsgJyc7XG5cbiAgICBjb25zdCBsZWdhY3lGb3JtYXQgPSB7XG4gICAgICBDb21wbGV0ZWQ6IG5ld0Zvcm1hdC5jb21wbGV0ZSxcbiAgICAgIG5hbWU6IGZsYXQubmFtZSxcbiAgICAgIG51bWJlcjoganVtaW4sXG4gICAgICBEYXRlOiBmbGF0Lmlzc3VlZF9kYXRlLFxuICAgICAgbmF0aW9uYWxpdHk6IGZsYXQubmF0aW9uYWxpdHkgPz8gJycsXG4gICAgICB2aXNhVHlwZTogZmxhdC52aXNhX3R5cGUgPz8gJycsXG4gICAgICBuYW1lX2tvcjogZmxhdC5uYW1lX2tvciA/PyAnJyxcbiAgICAgIGZhY2Vfc2NvcmU6IG5ld0Zvcm1hdC5mb3VuZF9mYWNlLFxuICAgICAgc3BlY3VsYXI6IG5ld0Zvcm1hdC5zcGVjdWxhcl9yYXRpbyxcbiAgICAgIGlkX3R5cGU6IGlkVHlwZSxcbiAgICAgIHRydXRoOiBmbGF0LmlkX3RydXRoLFxuICAgICAgdHJ1dGhDb25maWRlbmNlOiBuZXdGb3JtYXQuZmRfY29uZmlkZW5jZSxcbiAgICAgIHRydXRoUmV0cnlDb3VudDogMCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5ld0Zvcm1hdCxcbiAgICAgIGxlZ2FjeUZvcm1hdCxcbiAgICAgIG1hc2tJbmZvOiB0aGlzLmdldE1hc2tJbmZvKGZsYXQsIGlkVHlwZSksXG4gICAgfTtcbiAgfVxuXG4gIF9fcGFyc2VDcmVkaXQob2NyUmVzdWx0KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge307XG5cbiAgICBjb25zdCByZXN1bHRTcGxpdCA9IG9jclJlc3VsdC5zcGxpdCgnLCcpO1xuXG4gICAgbGV0IHJlc3VsdEluZGV4ID0gMDtcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpICh0YXJnZXQuQ29tcGxldGVkID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdKSwgcmVzdWx0SW5kZXgrKztcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpICh0YXJnZXQubnVtYmVyID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdKSwgcmVzdWx0SW5kZXgrKztcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpICh0YXJnZXQuZXhwX2RhdGUgPSByZXN1bHRTcGxpdFtyZXN1bHRJbmRleF0pLCByZXN1bHRJbmRleCsrO1xuXG4gICAgcmV0dXJuIFt0YXJnZXQsIHRhcmdldF07XG4gIH1cblxuICBnZXRNYXNrSW5mbyhvYmosIGlkVHlwZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIHR5cGU6IHRoaXMuUkVTVUxUX01BU0tJTkdfVFlQRV9NQVBbaWRUeXBlICsgJyddLFxuICAgIH07XG4gICAgdGhpcy5NQVNLX0lORk8uZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChfLmhhcyhvYmosIGVsKSAmJiBvYmpbZWxdICE9PSAnMCwwLDAsMCcpIHtcbiAgICAgICAgcmVzdWx0W2VsXSA9IG9ialtlbF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldERyaXZlckxpY2Vuc2UodmFsdWUpIHtcbiAgICAvLyDqtaztmJUg66m07ZeI7KadIO2PrOuppyDtjJDsoJUgKGV4OiDsoJzso7wgMTMtMDAxMjM0LTEyIC0+IHRydWUpXG4gICAgY29uc3QgcmVnZXggPSAvW+qwgC3tnqNdL2c7XG4gICAgY29uc3QgaXNPbGRGb3JtYXQgPSB2YWx1ZT8ubWF0Y2gocmVnZXgpO1xuICAgIGlmIChpc09sZEZvcm1hdCkgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCcgJywgJy0nKTtcbiAgICByZXR1cm4geyBpc09sZEZvcm1hdCwgdmFsdWUgfTtcbiAgfVxuXG4gIC8vIOyjvOuvvOuyiO2YuCDtmJXsi50g66as7YS06rCSIO2YleyLnSDrs4Dqsr1cbiAgZ2V0SWROdW1iZXJGb3JtYXQodmFsdWUpIHtcbiAgICBpZiAodmFsdWU/Lmxlbmd0aCA9PT0gMTQpIHJldHVybiB2YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU/Lmxlbmd0aCA9PT0gMTMgPyB2YWx1ZS5zbGljZSgwLCA2KSArICctJyArIHZhbHVlLnNsaWNlKDYsIDEzKSA6ICcnO1xuICB9XG5cbiAgZmxhdE9iaihvYmopIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGlubmVyUmVzdWx0ID0gdGhpcy5mbGF0T2JqKHZhbHVlKTtcbiAgICAgICAgXy5hc3NpZ24ocmVzdWx0LCBpbm5lclJlc3VsdCk7XG4gICAgICB9IGVsc2UgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgT2NyUmVzdWx0UGFyc2VyKCk7XG4iXSwibWFwcGluZ3MiOiI7OztBQUFBOztBQUVBLE9BQU9BLFVBQVUsTUFBTSxrQkFBa0I7O0FBRXpDO0FBQ0EsTUFBTUMsZUFBZSxDQUFDO0VBQUFDLFlBQUE7SUFBQUMsZUFBQSx3QkFDSixDQUNkLFFBQVEsRUFDUixRQUFRLEVBQ1IsVUFBVSxFQUNWLGtCQUFrQixFQUNsQixPQUFPLEVBQ1AsUUFBUSxFQUNSLFlBQVksRUFDWixZQUFZLEVBQ1osY0FBYyxFQUNkLHNCQUFzQixFQUN0QixXQUFXLEVBQ1gsWUFBWSxDQUNiO0lBQUFBLGVBQUEsb0JBRVcsQ0FDVixvQkFBb0IsRUFDcEIsZ0JBQWdCLEVBQ2hCLDBCQUEwQixFQUMxQixxQkFBcUIsRUFDckIseUJBQXlCLEVBQ3pCLDRCQUE0QixF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
