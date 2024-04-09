function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */

/* global-module */
import objectUtil from './object-util.js';
class OcrResultParser {
  constructor() {
    _defineProperty(this, "__ocrTypeList", ['idcard', 'driver', 'passport', 'foreign-passport', 'alien', 'alien-back', 'credit', 'idcard-ssa', 'driver-ssa', 'passport-ssa', 'foreign-passport-ssa', 'alien-ssa', 'credit-ssa']);
  }
  parseOcrResult(ocrType, ssaMode, ocrResult, ssaResult, ssaRetryCount, ssaResultList, ssaRetryType, ssaRetryPivot) {
    if (!this.__ocrTypeList.includes(ocrType)) throw new Error('ResultParser :: Unsupported OCR type');
    var legacyFormat = {};
    var newFormat = {};

    // SSA 처리
    if (ssaMode && !!ssaResult) {
      this.__parseSsaResult(ssaRetryType, ssaRetryPivot, ssaResult, ssaRetryCount, ssaResultList, ocrResult, legacyFormat);
    }
    switch (ocrType) {
      case 'idcard':
      case 'driver':
      case 'idcard-ssa':
      case 'driver-ssa':
        this.__parseIdDriver(ocrResult.ocr_result, legacyFormat);
        break;
      case 'passport':
      case 'passport-ssa':
      case 'foreign-passport':
      case 'foreign-passport-ssa':
        this.__parsePassport(ocrResult.ocr_result, legacyFormat);
        break;
      case 'alien':
      case 'alien-ssa':
        this.__parseAlien(ocrResult.ocr_result, legacyFormat);
        break;
      case 'alien-back':
        legacyFormat = _objectSpread({}, ocrResult.ocr_result);
        break;
      case 'credit':
        [legacyFormat, newFormat] = this.__parseCredit(ocrResult.ocr_result, legacyFormat);
        ocrResult.ocr_result = newFormat;
        break;
      default:
        throw new Error('Unsupported OCR type');
    }
    return {
      legacyFormat,
      newFormat: ocrResult
    };
  }

  // prettier-ignore
  __parseSsaResult(ssaRetryType, ssaRetryPivot, ssaResult, ssaRetryCount, ssaResultList, ocrResult, legacyFormat) {
    function __parseSSARawData(ssaRawData) {
      var _ssaRawData$ssa_resul, _ssaRawData$ssa_resul2;
      // const result = {
      //   fd_confidence: ssaRawData?.ssa_result?.fd_confidence || ssaRawData?.fd_confidence,
      //   id_truth: ssaRawData?.ssa_result?.id_truth || ssaRawData?.id_truth
      // }
      // TODO : PII 일때 truth 로 오는 오류 id_truth 고쳐진 뒤 수정 필요.
      var result = {
        fd_confidence: (ssaRawData === null || ssaRawData === void 0 || (_ssaRawData$ssa_resul = ssaRawData.ssa_result) === null || _ssaRawData$ssa_resul === void 0 ? void 0 : _ssaRawData$ssa_resul.fd_confidence) || (ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.fd_confidence) || (ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.conf),
        id_truth: (ssaRawData === null || ssaRawData === void 0 || (_ssaRawData$ssa_resul2 = ssaRawData.ssa_result) === null || _ssaRawData$ssa_resul2 === void 0 ? void 0 : _ssaRawData$ssa_resul2.id_truth) || (ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.id_truth) || (ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.truth)
      };
      if (ssaRawData !== null && ssaRawData !== void 0 && ssaRawData.encrypted) {
        result.encrypted = ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.encrypted;
      }
      if (ssaRawData !== null && ssaRawData !== void 0 && ssaRawData.encrypted_overall) {
        result.encrypted_overall = ssaRawData === null || ssaRawData === void 0 ? void 0 : ssaRawData.encrypted_overall;
      }
      return result;
    }

    // SSA 관련 처리
    var ssaResultObj = objectUtil.stringToJson(ssaResult);
    var parseSSAResultObj = __parseSSARawData(ssaResultObj);

    // 하위호환성을 위해 평문일때는 ocr_result 내부에도 넣어줌
    ocrResult.ocr_result.fd_confidence = parseSSAResultObj.fd_confidence;
    ocrResult.ocr_result.id_truth = parseSSAResultObj.id_truth;

    // ssa_result 값 추가
    ocrResult.ssa_result = {};
    ocrResult.ssa_result.fd_confidence = parseSSAResultObj.fd_confidence;
    ocrResult.ssa_result.id_truth = parseSSAResultObj.id_truth;
    if (parseSSAResultObj.encrypted) {
      ocrResult.encrypted.ssa_result = parseSSAResultObj.encrypted;
      ocrResult.encrypted.ocr_result.fd_confidence = parseSSAResultObj.encrypted.fd_confidence;
      ocrResult.encrypted.ocr_result.id_truth = parseSSAResultObj.encrypted.id_truth;
    } else if (parseSSAResultObj.encrypted_overall) {
      ocrResult.ssa_encrypted_overall = parseSSAResultObj.encrypted_overall;
    } else {
      // value encrypt 또는 overall encrypt 일 때는 id_truth_retry_count 전달하지 않음
      ocrResult.ocr_result.id_truth_retry_count = ssaRetryCount;
      ocrResult.ssa_result.id_truth_retry_count = ssaRetryCount;
    }

    // SSA Retry 관련 처리
    if (ssaResultList && ssaRetryCount > 0) {
      var truthResultDetail = [];
      for (var item of ssaResultList) {
        var tmpObj = objectUtil.stringToJson(item);
        var truthResult = __parseSSARawData(tmpObj); // prettier-ignore
        truthResultDetail.push(truthResult);
      }
      ocrResult.ocr_result.id_truth_result_detail = truthResultDetail;
      ocrResult.ssa_result.id_truth_result_detail = truthResultDetail;
      if (ssaRetryType === 'ENSEMBLE') {
        var average = list => {
          var sum = list.map(el => Math.abs(ssaRetryPivot - el.fd_confidence)).reduce((acc, cur) => cur + acc, 0);
          if (isNaN(sum / list.length)) return Number.MAX_SAFE_INTEGER;
          return sum / list.length;
        };
        var fakeList = [];
        var realList = [];
        ocrResult.ocr_result.id_truth_result_detail.forEach(el => {
          if (el.id_truth === "FAKE") fakeList.push(el);
          if (el.id_truth === "REAL") realList.push(el);
        });
        var f_avg = average(fakeList); // fake 평균값
        var r_avg = average(realList); // real 평균값

        var f_abs = Math.abs(ssaRetryPivot - f_avg);
        var r_abs = Math.abs(ssaRetryPivot - r_avg);

        // real 에 더 근접함
        if (r_abs - f_abs < 0) {
          ocrResult.ocr_result.id_truth = "REAL";
          ocrResult.ssa_result.id_truth = "REAL";
        }
        // fake 에 더 근접하거나 같다면 FAKE
        if (f_abs - r_abs < 0 || r_abs - f_abs === 0) {
          ocrResult.ocr_result.id_truth = "FAKE";
          ocrResult.ssa_result.id_truth = "FAKE";
        }
      }
    }
    var keyMapSsaResult = {
      truth: 'id_truth',
      truthConfidence: 'fd_confidence',
      truthRetryCount: 'id_truth_retry_count',
      truthResultDetail: 'id_truth_result_detail'
    };
    this.__convertLegacyFormat(ocrResult.ocr_result, legacyFormat, keyMapSsaResult);
    if (ssaResultList && ssaRetryCount > 0) {
      var tmpResultDetail = [];
      for (var idx in legacyFormat.truthResultDetail) {
        var keyMapSsaResultDetail = {
          truth: 'id_truth',
          truthConfidence: 'fd_confidence'
        };
        var detailLegacyFormat = {};
        this.__convertLegacyFormat(legacyFormat.truthResultDetail[idx], detailLegacyFormat, keyMapSsaResultDetail);
        tmpResultDetail.push(detailLegacyFormat);
      }
      legacyFormat.truthResultDetail = tmpResultDetail;
    }
  }
  __convertLegacyFormat(obj, legacyFormat, map) {
    for (var key in map) {
      legacyFormat[key] = typeof obj[map[key]] === 'object' ? _objectSpread({}, obj[map[key]]) : obj[map[key]];
    }
    return legacyFormat;
  }
  __reformatJumin(ocrResult) {
    // 주민번호 형식 리턴값 형식 변경
    if (ocrResult.masked_jumin) {
      // 암호화 된 경우 대응
      if (ocrResult.masked_jumin !== undefined && ocrResult.masked_jumin.length === 13) {
        ocrResult.masked_jumin = ocrResult.masked_jumin.slice(0, 6) + '-' + ocrResult.masked_jumin.slice(6, 13);
      } else {
        ocrResult.masked_jumin = '';
      }
    } else {
      if (ocrResult.jumin !== undefined && ocrResult.jumin.length === 13) {
        ocrResult.jumin = ocrResult.jumin.slice(0, 6) + '-' + ocrResult.jumin.slice(6, 13);
      } else {
        ocrResult.jumin = '';
      }
    }
  }
  __addBirth(ocrResult) {
    if (ocrResult.masked_jumin) {
      // 암호화 된 경우 대응
      ocrResult.birth = ocrResult.masked_jumin.slice(0, 6);
    } else {
      // 일반(평문) 시나리오
      ocrResult.birth = ocrResult.jumin.slice(0, 6);
    }
  }
  __addIsOldFormatDriverNumber(ocrResult) {
    if (ocrResult.masked_jumin) {
      // 암호화 된 경우 대응
      if (ocrResult.result_scan_type === '2') {
        // 구형 면허증 포멧 판정 (ex: 제주 13-001234-12 -> true)
        var regex = /[가-힣]/g;
        ocrResult.is_old_format_driver_number = !!ocrResult.masked_driver_number.match(regex);

        // TODO : 암호화 된값에서는 처리할 수 없고, 마스킹된 운전면허번호에 ' '가 없어 처리 할 수 없음.
        // if (ocrResult.is_old_format_driver_number) {
        //   // useb api 포멧에 맞게 변경 (to: 제주-13-001234-12)
        //   ocrResult.masked_driver_number = ocrResult.masked_driver_number.replace(' ', '-');
        // }
      }
    } else {
      // 일반(평문) 시나리오
      if (ocrResult.result_scan_type === '2') {
        // 구형 면허증 포멧 판정 (ex: 제주 13-001234-12 -> true)
        var _regex = /[가-힣]/g;
        ocrResult.is_old_format_driver_number = !!ocrResult.driver_number.match(_regex);
        if (ocrResult.is_old_format_driver_number) {
          // useb api 포멧에 맞게 변경 (to: 제주-13-001234-12)
          ocrResult.driver_number = ocrResult.driver_number.replace(' ', '-');
        }
      }
    }
  }
  __parseIdDriver(ocrResult, legacyFormat) {
    // 주민번호 형식 리턴값 형식 변경
    this.__reformatJumin(ocrResult);
    this.__addBirth(ocrResult);
    this.__addIsOldFormatDriverNumber(ocrResult);
    var keyMapIdDriver = {
      Completed: 'complete',
      type: 'result_scan_type',
      name: 'name',
      number: 'jumin',
      Date: 'issued_date',
      region: 'region',
      licenseNumber: 'driver_number',
      isOldFormatLicenseNumber: 'is_old_format_driver_number',
      serial: 'driver_serial',
      licenseType: 'driver_type',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapIdDriver);
  }
  __parsePassport(ocrResult, legacyFormat) {
    this.__reformatJumin(ocrResult);
    var keyMapPassport = {
      Completed: 'complete',
      name: 'name',
      surName: 'sur_name',
      givenName: 'given_name',
      type: 'passport_type',
      issuing_country: 'issuing_country',
      passport_no: 'passport_number',
      nationality: 'nationality',
      date_of_issue: 'issued_date',
      sex: 'sex',
      date_of_expiry: 'expiry_date',
      personal_no: 'personal_number',
      number: 'jumin',
      date_of_birth: 'birthday',
      name_kor: 'name_kor',
      mrz1: 'mrz1',
      mrz2: 'mrz2',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapPassport);
  }
  __parseAlien(ocrResult, legacyFormat) {
    this.__reformatJumin(ocrResult);
    var keyMapAlien = {
      Completed: 'complete',
      name: 'name',
      number: 'jumin',
      Date: 'issued_date',
      nationality: 'nationality',
      visaType: 'visa_type',
      name_kor: 'name_kor',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapAlien);
  }
  __parseCredit(ocrResult, legacyFormat) {
    var resultSplit = ocrResult.split(',');
    var resultIndex = 0;
    if (resultIndex < resultSplit.length) legacyFormat.Completed = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) legacyFormat.number = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) legacyFormat.exp_date = resultSplit[resultIndex], resultIndex++;
    return [legacyFormat, legacyFormat];
  }
}
export default new OcrResultParser();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy91c2ViLW9jci13YXNtLXBhcnNlci5qcyIsIm5hbWVzIjpbIm9iamVjdFV0aWwiLCJPY3JSZXN1bHRQYXJzZXIiLCJjb25zdHJ1Y3RvciIsIl9kZWZpbmVQcm9wZXJ0eSIsInBhcnNlT2NyUmVzdWx0Iiwib2NyVHlwZSIsInNzYU1vZGUiLCJvY3JSZXN1bHQiLCJzc2FSZXN1bHQiLCJzc2FSZXRyeUNvdW50Iiwic3NhUmVzdWx0TGlzdCIsInNzYVJldHJ5VHlwZSIsInNzYVJldHJ5UGl2b3QiLCJfX29jclR5cGVMaXN0IiwiaW5jbHVkZXMiLCJFcnJvciIsImxlZ2FjeUZvcm1hdCIsIm5ld0Zvcm1hdCIsIl9fcGFyc2VTc2FSZXN1bHQiLCJfX3BhcnNlSWREcml2ZXIiLCJvY3JfcmVzdWx0IiwiX19wYXJzZVBhc3Nwb3J0IiwiX19wYXJzZUFsaWVuIiwiX29iamVjdFNwcmVhZCIsIl9fcGFyc2VDcmVkaXQiLCJfX3BhcnNlU1NBUmF3RGF0YSIsInNzYVJhd0RhdGEiLCJfc3NhUmF3RGF0YSRzc2FfcmVzdWwiLCJfc3NhUmF3RGF0YSRzc2FfcmVzdWwyIiwicmVzdWx0IiwiZmRfY29uZmlkZW5jZSIsInNzYV9yZXN1bHQiLCJjb25mIiwiaWRfdHJ1dGgiLCJ0cnV0aCIsImVuY3J5cHRlZCIsImVuY3J5cHRlZF9vdmVyYWxsIiwic3NhUmVzdWx0T2JqIiwic3RyaW5nVG9Kc29uIiwicGFyc2VTU0FSZXN1bHRPYmoiLCJzc2FfZW5jcnlwdGVkX292ZXJhbGwiLCJpZF90cnV0aF9yZXRyeV9jb3VudCIsInRydXRoUmVzdWx0RGV0YWlsIiwiaXRlbSIsInRtcE9iaiIsInRydXRoUmVzdWx0IiwicHVzaCIsImlkX3RydXRoX3Jlc3VsdF9kZXRhaWwiLCJhdmVyYWdlIiwibGlzdCIsInN1bSIsIm1hcCIsImVsIiwiTWF0aCIsImFicyIsInJlZHVjZSIsImFjYyIsImN1ciIsImlzTmFOIiwibGVuZ3RoIiwiTnVtYmVyIiwiTUFYX1NBRkVfSU5URUdFUiIsImZha2VMaXN0IiwicmVhbExpc3QiLCJmb3JFYWNoIiwiZl9hdmciLCJyX2F2ZyIsImZfYWJzIiwicl9hYnMiLCJrZXlNYXBTc2FSZXN1bHQiLCJ0cnV0aENvbmZpZGVuY2UiLCJ0cnV0aFJldHJ5Q291bnQiLCJfX2NvbnZlcnRMZWdhY3lGb3JtYXQiLCJ0bXBSZXN1bHREZXRhaWwiLCJpZHgiLCJrZXlNYXBTc2FSZXN1bHREZXRhaWwiLCJkZXRhaWxMZWdhY3lGb3JtYXQiLCJvYmoiLCJrZXkiLCJfX3JlZm9ybWF0SnVtaW4iLCJtYXNrZWRfanVtaW4iLCJ1bmRlZmluZWQiLCJzbGljZSIsImp1bWluIiwiX19hZGRCaXJ0aCIsImJpcnRoIiwiX19hZGRJc09sZEZvcm1hdERyaXZlck51bWJlciIsInJlc3VsdF9zY2FuX3R5cGUiLCJyZWdleCIsImlzX29sZF9mb3JtYXRfZHJpdmVyX251bWJlciIsIm1hc2tlZF9kcml2ZXJfbnVtYmVyIiwibWF0Y2giLCJkcml2ZXJfbnVtYmVyIiwicmVwbGFjZSIsImtleU1hcElkRHJpdmVyIiwiQ29tcGxldGVkIiwidHlwZSIsIm5hbWUiLCJudW1iZXIiLCJEYXRlIiwicmVnaW9uIiwibGljZW5zZU51bWJlciIsImlzT2xkRm9ybWF0TGljZW5zZU51bWJlciIsInNlcmlhbCIsImxpY2Vuc2VUeXBlIiwiY29sb3JfcG9pbnQiLCJmYWNlX3Njb3JlIiwic3BlY3VsYXIiLCJzdGFydF90IiwiZW5kX3QiLCJpZF90eXBlIiwia2V5TWFwUGFzc3BvcnQiLCJzdXJOYW1lIiwiZ2l2ZW5OYW1lIiwiaXNzdWluZ19jb3VudHJ5IiwicGFzc3BvcnRfbm8iLCJuYXRpb25hbGl0eSIsImRhdGVfb2ZfaXNzdWUiLCJzZXgiLCJkYXRlX29mX2V4cGlyeSIsInBlcnNvbmFsX25vIiwiZGF0ZV9vZl9iaXJ0aCIsIm5hbWVfa29yIiwibXJ6MSIsIm1yejIiLCJrZXlNYXBBbGllbiIsInZpc2FUeXBlIiwicmVzdWx0U3BsaXQiLCJzcGxpdCIsInJlc3VsdEluZGV4IiwiZXhwX2RhdGUiXSwic291cmNlcyI6WyJoZWxwZXJzL3VzZWItb2NyLXdhc20tcGFyc2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5cbi8qIGdsb2JhbC1tb2R1bGUgKi9cbmltcG9ydCBvYmplY3RVdGlsIGZyb20gJy4vb2JqZWN0LXV0aWwuanMnO1xuXG5jbGFzcyBPY3JSZXN1bHRQYXJzZXIge1xuICBfX29jclR5cGVMaXN0ID0gW1xuICAgICdpZGNhcmQnLFxuICAgICdkcml2ZXInLFxuICAgICdwYXNzcG9ydCcsXG4gICAgJ2ZvcmVpZ24tcGFzc3BvcnQnLFxuICAgICdhbGllbicsXG4gICAgJ2FsaWVuLWJhY2snLFxuICAgICdjcmVkaXQnLFxuICAgICdpZGNhcmQtc3NhJyxcbiAgICAnZHJpdmVyLXNzYScsXG4gICAgJ3Bhc3Nwb3J0LXNzYScsXG4gICAgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJyxcbiAgICAnYWxpZW4tc3NhJyxcbiAgICAnY3JlZGl0LXNzYScsXG4gIF07XG5cbiAgcGFyc2VPY3JSZXN1bHQob2NyVHlwZSwgc3NhTW9kZSwgb2NyUmVzdWx0LCBzc2FSZXN1bHQsIHNzYVJldHJ5Q291bnQsIHNzYVJlc3VsdExpc3QsIHNzYVJldHJ5VHlwZSwgc3NhUmV0cnlQaXZvdCkge1xuICAgIGlmICghdGhpcy5fX29jclR5cGVMaXN0LmluY2x1ZGVzKG9jclR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoJ1Jlc3VsdFBhcnNlciA6OiBVbnN1cHBvcnRlZCBPQ1IgdHlwZScpO1xuICAgIGxldCBsZWdhY3lGb3JtYXQgPSB7fTtcbiAgICBsZXQgbmV3Rm9ybWF0ID0ge307XG5cbiAgICAvLyBTU0Eg7LKY66asXG4gICAgaWYgKHNzYU1vZGUgJiYgISFzc2FSZXN1bHQpIHtcbiAgICAgIHRoaXMuX19wYXJzZVNzYVJlc3VsdChcbiAgICAgICAgc3NhUmV0cnlUeXBlLFxuICAgICAgICBzc2FSZXRyeVBpdm90LFxuICAgICAgICBzc2FSZXN1bHQsXG4gICAgICAgIHNzYVJldHJ5Q291bnQsXG4gICAgICAgIHNzYVJlc3VsdExpc3QsXG4gICAgICAgIG9jclJlc3VsdCxcbiAgICAgICAgbGVnYWN5Rm9ybWF0XG4gICAgICApO1xuICAgIH1cblxuICAgIHN3aXRjaCAob2NyVHlwZSkge1xuICAgICAgY2FzZSAnaWRjYXJkJzpcbiAgICAgIGNhc2UgJ2RyaXZlcic6XG4gICAgICBjYXNlICdpZGNhcmQtc3NhJzpcbiAgICAgIGNhc2UgJ2RyaXZlci1zc2EnOlxuICAgICAgICB0aGlzLl9fcGFyc2VJZERyaXZlcihvY3JSZXN1bHQub2NyX3Jlc3VsdCwgbGVnYWN5Rm9ybWF0KTtcblxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0LXNzYSc6XG4gICAgICBjYXNlICdmb3JlaWduLXBhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgdGhpcy5fX3BhcnNlUGFzc3BvcnQob2NyUmVzdWx0Lm9jcl9yZXN1bHQsIGxlZ2FjeUZvcm1hdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWxpZW4nOlxuICAgICAgY2FzZSAnYWxpZW4tc3NhJzpcbiAgICAgICAgdGhpcy5fX3BhcnNlQWxpZW4ob2NyUmVzdWx0Lm9jcl9yZXN1bHQsIGxlZ2FjeUZvcm1hdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWxpZW4tYmFjayc6XG4gICAgICAgIGxlZ2FjeUZvcm1hdCA9IHsgLi4ub2NyUmVzdWx0Lm9jcl9yZXN1bHQgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjcmVkaXQnOlxuICAgICAgICBbbGVnYWN5Rm9ybWF0LCBuZXdGb3JtYXRdID0gdGhpcy5fX3BhcnNlQ3JlZGl0KG9jclJlc3VsdC5vY3JfcmVzdWx0LCBsZWdhY3lGb3JtYXQpO1xuICAgICAgICBvY3JSZXN1bHQub2NyX3Jlc3VsdCA9IG5ld0Zvcm1hdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbGVnYWN5Rm9ybWF0LCBuZXdGb3JtYXQ6IG9jclJlc3VsdCB9O1xuICB9XG5cbiAgLy8gcHJldHRpZXItaWdub3JlXG4gIF9fcGFyc2VTc2FSZXN1bHQoc3NhUmV0cnlUeXBlLCBzc2FSZXRyeVBpdm90LCBzc2FSZXN1bHQsIHNzYVJldHJ5Q291bnQsIHNzYVJlc3VsdExpc3QsIG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KSB7XG4gICAgZnVuY3Rpb24gX19wYXJzZVNTQVJhd0RhdGEoc3NhUmF3RGF0YSkge1xuICAgICAgLy8gY29uc3QgcmVzdWx0ID0ge1xuICAgICAgLy8gICBmZF9jb25maWRlbmNlOiBzc2FSYXdEYXRhPy5zc2FfcmVzdWx0Py5mZF9jb25maWRlbmNlIHx8IHNzYVJhd0RhdGE/LmZkX2NvbmZpZGVuY2UsXG4gICAgICAvLyAgIGlkX3RydXRoOiBzc2FSYXdEYXRhPy5zc2FfcmVzdWx0Py5pZF90cnV0aCB8fCBzc2FSYXdEYXRhPy5pZF90cnV0aFxuICAgICAgLy8gfVxuICAgICAgLy8gVE9ETyA6IFBJSSDsnbzrlYwgdHJ1dGgg66GcIOyYpOuKlCDsmKTrpZggaWRfdHJ1dGgg6rOg7LOQ7KeEIOuSpCDsiJjsoJUg7ZWE7JqULlxuICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICBmZF9jb25maWRlbmNlOiBzc2FSYXdEYXRhPy5zc2FfcmVzdWx0Py5mZF9jb25maWRlbmNlIHx8IHNzYVJhd0RhdGE/LmZkX2NvbmZpZGVuY2UgfHwgc3NhUmF3RGF0YT8uY29uZixcbiAgICAgICAgaWRfdHJ1dGg6IHNzYVJhd0RhdGE/LnNzYV9yZXN1bHQ/LmlkX3RydXRoIHx8IHNzYVJhd0RhdGE/LmlkX3RydXRoIHx8IHNzYVJhd0RhdGE/LnRydXRoXG4gICAgICB9XG4gICAgICBpZiAoc3NhUmF3RGF0YT8uZW5jcnlwdGVkKSB7XG4gICAgICAgIHJlc3VsdC5lbmNyeXB0ZWQgPSBzc2FSYXdEYXRhPy5lbmNyeXB0ZWQ7XG4gICAgICB9XG4gICAgICBpZiAoc3NhUmF3RGF0YT8uZW5jcnlwdGVkX292ZXJhbGwpIHtcbiAgICAgICAgcmVzdWx0LmVuY3J5cHRlZF9vdmVyYWxsID0gc3NhUmF3RGF0YT8uZW5jcnlwdGVkX292ZXJhbGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIFNTQSDqtIDroKgg7LKY66asXG4gICAgY29uc3Qgc3NhUmVzdWx0T2JqID0gb2JqZWN0VXRpbC5zdHJpbmdUb0pzb24oc3NhUmVzdWx0KTtcbiAgICBjb25zdCBwYXJzZVNTQVJlc3VsdE9iaiA9IF9fcGFyc2VTU0FSYXdEYXRhKHNzYVJlc3VsdE9iaik7XG5cbiAgICAvLyDtlZjsnITtmLjtmZjshLHsnYQg7JyE7ZW0IO2PieusuOydvOuVjOuKlCBvY3JfcmVzdWx0IOuCtOu2gOyXkOuPhCDrhKPslrTspIxcbiAgICBvY3JSZXN1bHQub2NyX3Jlc3VsdC5mZF9jb25maWRlbmNlID0gcGFyc2VTU0FSZXN1bHRPYmouZmRfY29uZmlkZW5jZTtcbiAgICBvY3JSZXN1bHQub2NyX3Jlc3VsdC5pZF90cnV0aCA9IHBhcnNlU1NBUmVzdWx0T2JqLmlkX3RydXRoO1xuXG4gICAgLy8gc3NhX3Jlc3VsdCDqsJIg7LaU6rCAXG4gICAgb2NyUmVzdWx0LnNzYV9yZXN1bHQgPSB7fTtcbiAgICBvY3JSZXN1bHQuc3NhX3Jlc3VsdC5mZF9jb25maWRlbmNlID0gcGFyc2VTU0FSZXN1bHRPYmouZmRfY29uZmlkZW5jZTtcbiAgICBvY3JSZXN1bHQuc3NhX3Jlc3VsdC5pZF90cnV0aCA9IHBhcnNlU1NBUmVzdWx0T2JqLmlkX3RydXRoO1xuXG4gICAgaWYgKHBhcnNlU1NBUmVzdWx0T2JqLmVuY3J5cHRlZCkge1xuICAgICAgb2NyUmVzdWx0LmVuY3J5cHRlZC5zc2FfcmVzdWx0ID0gcGFyc2VTU0FSZXN1bHRPYmouZW5jcnlwdGVkO1xuICAgICAgb2NyUmVzdWx0LmVuY3J5cHRlZC5vY3JfcmVzdWx0LmZkX2NvbmZpZGVuY2UgPSBwYXJzZVNTQVJlc3VsdE9iai5lbmNyeXB0ZWQuZmRfY29uZmlkZW5jZTtcbiAgICAgIG9jclJlc3VsdC5lbmNyeXB0ZWQub2NyX3Jlc3VsdC5pZF90cnV0aCA9IHBhcnNlU1NBUmVzdWx0T2JqLmVuY3J5cHRlZC5pZF90cnV0aDtcbiAgICB9IGVsc2UgaWYgKHBhcnNlU1NBUmVzdWx0T2JqLmVuY3J5cHRlZF9vdmVyYWxsKSB7XG4gICAgICBvY3JSZXN1bHQuc3NhX2VuY3J5cHRlZF9vdmVyYWxsID0gcGFyc2VTU0FSZXN1bHRPYmouZW5jcnlwdGVkX292ZXJhbGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHZhbHVlIGVuY3J5cHQg65iQ64qUIG92ZXJhbGwgZW5jcnlwdCDsnbwg65WM64qUIGlkX3RydXRoX3JldHJ5X2NvdW50IOyghOuLrO2VmOyngCDslYrsnYxcbiAgICAgIG9jclJlc3VsdC5vY3JfcmVzdWx0LmlkX3RydXRoX3JldHJ5X2NvdW50ID0gc3NhUmV0cnlDb3VudDtcbiAgICAgIG9jclJlc3VsdC5zc2FfcmVzdWx0LmlkX3RydXRoX3JldHJ5X2NvdW50ID0gc3NhUmV0cnlDb3VudDtcbiAgICB9XG5cbiAgICAvLyBTU0EgUmV0cnkg6rSA66CoIOyymOumrFxuICAgIGlmIChzc2FSZXN1bHRMaXN0ICYmIHNzYVJldHJ5Q291bnQgPiAwKSB7XG4gICAgICBsZXQgdHJ1dGhSZXN1bHREZXRhaWwgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBzc2FSZXN1bHRMaXN0KSB7XG4gICAgICAgIGNvbnN0IHRtcE9iaiA9IG9iamVjdFV0aWwuc3RyaW5nVG9Kc29uKGl0ZW0pO1xuICAgICAgICBjb25zdCB0cnV0aFJlc3VsdCA9IF9fcGFyc2VTU0FSYXdEYXRhKHRtcE9iaik7IC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgICB0cnV0aFJlc3VsdERldGFpbC5wdXNoKHRydXRoUmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIG9jclJlc3VsdC5vY3JfcmVzdWx0LmlkX3RydXRoX3Jlc3VsdF9kZXRhaWwgPSB0cnV0aFJlc3VsdERldGFpbDtcbiAgICAgIG9jclJlc3VsdC5zc2FfcmVzdWx0LmlkX3RydXRoX3Jlc3VsdF9kZXRhaWwgPSB0cnV0aFJlc3VsdERldGFpbDtcblxuICAgICAgaWYoc3NhUmV0cnlUeXBlID09PSAnRU5TRU1CTEUnKSB7XG5cbiAgICAgICAgY29uc3QgYXZlcmFnZSA9IChsaXN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3VtID0gbGlzdC5tYXAoKGVsKSA9PiBNYXRoLmFicyhzc2FSZXRyeVBpdm90IC0gZWwuZmRfY29uZmlkZW5jZSkpLnJlZHVjZSgoYWNjLGN1cikgPT4gY3VyICsgYWNjICwgMClcbiAgICAgICAgICBpZihpc05hTihzdW0gLyBsaXN0Lmxlbmd0aCkpIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgICByZXR1cm4gc3VtIC8gbGlzdC5sZW5ndGhcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYWtlTGlzdCA9IFtdXG4gICAgICAgIGNvbnN0IHJlYWxMaXN0ID0gW11cblxuICAgICAgICBvY3JSZXN1bHQub2NyX3Jlc3VsdC5pZF90cnV0aF9yZXN1bHRfZGV0YWlsLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgIGlmKGVsLmlkX3RydXRoID09PSBcIkZBS0VcIikgZmFrZUxpc3QucHVzaChlbClcbiAgICAgICAgICBpZihlbC5pZF90cnV0aCA9PT0gXCJSRUFMXCIpIHJlYWxMaXN0LnB1c2goZWwpXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgZl9hdmcgPSBhdmVyYWdlKGZha2VMaXN0KSAvLyBmYWtlIO2Pieq3oOqwklxuICAgICAgICBjb25zdCByX2F2ZyA9IGF2ZXJhZ2UocmVhbExpc3QpIC8vIHJlYWwg7Y+J6reg6rCSXG5cbiAgICAgICAgY29uc3QgZl9hYnMgPSBNYXRoLmFicyhzc2FSZXRyeVBpdm90IC0gZl9hdmcpXG4gICAgICAgIGNvbnN0IHJfYWJzID0gTWF0aC5hYnMoc3NhUmV0cnlQaXZvdCAtIHJfYXZnKVxuXG4gICAgICAgIC8vIHJlYWwg7JeQIOuNlCDqt7zsoJHtlahcbiAgICAgICAgaWYocl9hYnMgLSBmX2FicyA8IDApIHtcbiAgICAgICAgICBvY3JSZXN1bHQub2NyX3Jlc3VsdC5pZF90cnV0aCA9IFwiUkVBTFwiXG4gICAgICAgICAgb2NyUmVzdWx0LnNzYV9yZXN1bHQuaWRfdHJ1dGggPSBcIlJFQUxcIlxuICAgICAgICB9XG4gICAgICAgIC8vIGZha2Ug7JeQIOuNlCDqt7zsoJHtlZjqsbDrgpgg6rCZ64uk66m0IEZBS0VcbiAgICAgICAgaWYoZl9hYnMgLSByX2FicyA8IDAgfHwgcl9hYnMgLSBmX2FicyA9PT0gMCkge1xuICAgICAgICAgIG9jclJlc3VsdC5vY3JfcmVzdWx0LmlkX3RydXRoID0gXCJGQUtFXCJcbiAgICAgICAgICBvY3JSZXN1bHQuc3NhX3Jlc3VsdC5pZF90cnV0aCA9IFwiRkFLRVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBrZXlNYXBTc2FSZXN1bHQgPSB7XG4gICAgICB0cnV0aDogJ2lkX3RydXRoJyxcbiAgICAgIHRydXRoQ29uZmlkZW5jZTogJ2ZkX2NvbmZpZGVuY2UnLFxuICAgICAgdHJ1dGhSZXRyeUNvdW50OiAnaWRfdHJ1dGhfcmV0cnlfY291bnQnLFxuICAgICAgdHJ1dGhSZXN1bHREZXRhaWw6ICdpZF90cnV0aF9yZXN1bHRfZGV0YWlsJyxcbiAgICB9O1xuXG4gICAgdGhpcy5fX2NvbnZlcnRMZWdhY3lGb3JtYXQob2NyUmVzdWx0Lm9jcl9yZXN1bHQsIGxlZ2FjeUZvcm1hdCwga2V5TWFwU3NhUmVzdWx0KTtcblxuICAgIGlmIChzc2FSZXN1bHRMaXN0ICYmIHNzYVJldHJ5Q291bnQgPiAwKSB7XG4gICAgICBjb25zdCB0bXBSZXN1bHREZXRhaWwgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaWR4IGluIGxlZ2FjeUZvcm1hdC50cnV0aFJlc3VsdERldGFpbCkge1xuICAgICAgICBjb25zdCBrZXlNYXBTc2FSZXN1bHREZXRhaWwgPSB7XG4gICAgICAgICAgdHJ1dGg6ICdpZF90cnV0aCcsXG4gICAgICAgICAgdHJ1dGhDb25maWRlbmNlOiAnZmRfY29uZmlkZW5jZScsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGRldGFpbExlZ2FjeUZvcm1hdCA9IHt9O1xuICAgICAgICB0aGlzLl9fY29udmVydExlZ2FjeUZvcm1hdChcbiAgICAgICAgICBsZWdhY3lGb3JtYXQudHJ1dGhSZXN1bHREZXRhaWxbaWR4XSxcbiAgICAgICAgICBkZXRhaWxMZWdhY3lGb3JtYXQsXG4gICAgICAgICAga2V5TWFwU3NhUmVzdWx0RGV0YWlsXG4gICAgICAgICk7XG4gICAgICAgIHRtcFJlc3VsdERldGFpbC5wdXNoKGRldGFpbExlZ2FjeUZvcm1hdCk7XG4gICAgICB9XG4gICAgICBsZWdhY3lGb3JtYXQudHJ1dGhSZXN1bHREZXRhaWwgPSB0bXBSZXN1bHREZXRhaWw7XG4gICAgfVxuICB9XG5cbiAgX19jb252ZXJ0TGVnYWN5Rm9ybWF0KG9iaiwgbGVnYWN5Rm9ybWF0LCBtYXApIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBtYXApIHtcbiAgICAgIGxlZ2FjeUZvcm1hdFtrZXldID0gdHlwZW9mIG9ialttYXBba2V5XV0gPT09ICdvYmplY3QnID8geyAuLi5vYmpbbWFwW2tleV1dIH0gOiBvYmpbbWFwW2tleV1dO1xuICAgIH1cbiAgICByZXR1cm4gbGVnYWN5Rm9ybWF0O1xuICB9XG5cbiAgX19yZWZvcm1hdEp1bWluKG9jclJlc3VsdCkge1xuICAgIC8vIOyjvOuvvOuyiO2YuCDtmJXsi50g66as7YS06rCSIO2YleyLnSDrs4Dqsr1cbiAgICBpZiAob2NyUmVzdWx0Lm1hc2tlZF9qdW1pbikge1xuICAgICAgLy8g7JWU7Zi47ZmUIOuQnCDqsr3smrAg64yA7J2RXG4gICAgICBpZiAob2NyUmVzdWx0Lm1hc2tlZF9qdW1pbiAhPT0gdW5kZWZpbmVkICYmIG9jclJlc3VsdC5tYXNrZWRfanVtaW4ubGVuZ3RoID09PSAxMykge1xuICAgICAgICBvY3JSZXN1bHQubWFza2VkX2p1bWluID0gb2NyUmVzdWx0Lm1hc2tlZF9qdW1pbi5zbGljZSgwLCA2KSArICctJyArIG9jclJlc3VsdC5tYXNrZWRfanVtaW4uc2xpY2UoNiwgMTMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2NyUmVzdWx0Lm1hc2tlZF9qdW1pbiA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2NyUmVzdWx0Lmp1bWluICE9PSB1bmRlZmluZWQgJiYgb2NyUmVzdWx0Lmp1bWluLmxlbmd0aCA9PT0gMTMpIHtcbiAgICAgICAgb2NyUmVzdWx0Lmp1bWluID0gb2NyUmVzdWx0Lmp1bWluLnNsaWNlKDAsIDYpICsgJy0nICsgb2NyUmVzdWx0Lmp1bWluLnNsaWNlKDYsIDEzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9jclJlc3VsdC5qdW1pbiA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9fYWRkQmlydGgob2NyUmVzdWx0KSB7XG4gICAgaWYgKG9jclJlc3VsdC5tYXNrZWRfanVtaW4pIHtcbiAgICAgIC8vIOyVlO2YuO2ZlCDrkJwg6rK97JqwIOuMgOydkVxuICAgICAgb2NyUmVzdWx0LmJpcnRoID0gb2NyUmVzdWx0Lm1hc2tlZF9qdW1pbi5zbGljZSgwLCA2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g7J2867CYKO2PieusuCkg7Iuc64KY66as7JikXG4gICAgICBvY3JSZXN1bHQuYmlydGggPSBvY3JSZXN1bHQuanVtaW4uc2xpY2UoMCwgNik7XG4gICAgfVxuICB9XG5cbiAgX19hZGRJc09sZEZvcm1hdERyaXZlck51bWJlcihvY3JSZXN1bHQpIHtcbiAgICBpZiAob2NyUmVzdWx0Lm1hc2tlZF9qdW1pbikge1xuICAgICAgLy8g7JWU7Zi47ZmUIOuQnCDqsr3smrAg64yA7J2RXG4gICAgICBpZiAob2NyUmVzdWx0LnJlc3VsdF9zY2FuX3R5cGUgPT09ICcyJykge1xuICAgICAgICAvLyDqtaztmJUg66m07ZeI7KadIO2PrOuppyDtjJDsoJUgKGV4OiDsoJzso7wgMTMtMDAxMjM0LTEyIC0+IHRydWUpXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gL1vqsIAt7Z6jXS9nO1xuICAgICAgICBvY3JSZXN1bHQuaXNfb2xkX2Zvcm1hdF9kcml2ZXJfbnVtYmVyID0gISFvY3JSZXN1bHQubWFza2VkX2RyaXZlcl9udW1iZXIubWF0Y2gocmVnZXgpO1xuXG4gICAgICAgIC8vIFRPRE8gOiDslZTtmLjtmZQg65Cc6rCS7JeQ7ISc64qUIOyymOumrO2VoCDsiJgg7JeG6rOgLCDrp4jsiqTtgrnrkJwg7Jq07KCE66m07ZeI67KI7Zi47JeQICcgJ+qwgCDsl4bslrQg7LKY66asIO2VoCDsiJgg7JeG7J2MLlxuICAgICAgICAvLyBpZiAob2NyUmVzdWx0LmlzX29sZF9mb3JtYXRfZHJpdmVyX251bWJlcikge1xuICAgICAgICAvLyAgIC8vIHVzZWIgYXBpIO2PrOupp+yXkCDrp57qsowg67OA6rK9ICh0bzog7KCc7KO8LTEzLTAwMTIzNC0xMilcbiAgICAgICAgLy8gICBvY3JSZXN1bHQubWFza2VkX2RyaXZlcl9udW1iZXIgPSBvY3JSZXN1bHQubWFza2VkX2RyaXZlcl9udW1iZXIucmVwbGFjZSgnICcsICctJyk7XG4gICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g7J2867CYKO2PieusuCkg7Iuc64KY66as7JikXG4gICAgICBpZiAob2NyUmVzdWx0LnJlc3VsdF9zY2FuX3R5cGUgPT09ICcyJykge1xuICAgICAgICAvLyDqtaztmJUg66m07ZeI7KadIO2PrOuppyDtjJDsoJUgKGV4OiDsoJzso7wgMTMtMDAxMjM0LTEyIC0+IHRydWUpXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gL1vqsIAt7Z6jXS9nO1xuICAgICAgICBvY3JSZXN1bHQuaXNfb2xkX2Zvcm1hdF9kcml2ZXJfbnVtYmVyID0gISFvY3JSZXN1bHQuZHJpdmVyX251bWJlci5tYXRjaChyZWdleCk7XG5cbiAgICAgICAgaWYgKG9jclJlc3VsdC5pc19vbGRfZm9ybWF0X2RyaXZlcl9udW1iZXIpIHtcbiAgICAgICAgICAvLyB1c2ViIGFwaSDtj6zrqafsl5Ag66ee6rKMIOuzgOqyvSAodG86IOygnOyjvC0xMy0wMDEyMzQtMTIpXG4gICAgICAgICAgb2NyUmVzdWx0LmRyaXZlcl9udW1iZXIgPSBvY3JSZXN1bHQuZHJpdmVyX251bWJlci5yZXBsYWNlKCcgJywgJy0nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9fcGFyc2VJZERyaXZlcihvY3JSZXN1bHQsIGxlZ2FjeUZvcm1hdCkge1xuICAgIC8vIOyjvOuvvOuyiO2YuCDtmJXsi50g66as7YS06rCSIO2YleyLnSDrs4Dqsr1cbiAgICB0aGlzLl9fcmVmb3JtYXRKdW1pbihvY3JSZXN1bHQpO1xuICAgIHRoaXMuX19hZGRCaXJ0aChvY3JSZXN1bHQpO1xuICAgIHRoaXMuX19hZGRJc09sZEZvcm1hdERyaXZlck51bWJlcihvY3JSZXN1bHQpO1xuXG4gICAgY29uc3Qga2V5TWFwSWREcml2ZXIgPSB7XG4gICAgICBDb21wbGV0ZWQ6ICdjb21wbGV0ZScsXG4gICAgICB0eXBlOiAncmVzdWx0X3NjYW5fdHlwZScsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBudW1iZXI6ICdqdW1pbicsXG4gICAgICBEYXRlOiAnaXNzdWVkX2RhdGUnLFxuICAgICAgcmVnaW9uOiAncmVnaW9uJyxcbiAgICAgIGxpY2Vuc2VOdW1iZXI6ICdkcml2ZXJfbnVtYmVyJyxcbiAgICAgIGlzT2xkRm9ybWF0TGljZW5zZU51bWJlcjogJ2lzX29sZF9mb3JtYXRfZHJpdmVyX251bWJlcicsXG4gICAgICBzZXJpYWw6ICdkcml2ZXJfc2VyaWFsJyxcbiAgICAgIGxpY2Vuc2VUeXBlOiAnZHJpdmVyX3R5cGUnLFxuXG4gICAgICBjb2xvcl9wb2ludDogJ2NvbG9yX3BvaW50JyxcbiAgICAgIGZhY2Vfc2NvcmU6ICdmb3VuZF9mYWNlJyxcbiAgICAgIHNwZWN1bGFyOiAnc3BlY3VsYXJfcmF0aW8nLFxuICAgICAgc3RhcnRfdDogJ3N0YXJ0X3RpbWUnLFxuICAgICAgZW5kX3Q6ICdlbmRfdGltZScsXG4gICAgICBpZF90eXBlOiAncmVzdWx0X3NjYW5fdHlwZScsXG4gICAgfTtcblxuICAgIHRoaXMuX19jb252ZXJ0TGVnYWN5Rm9ybWF0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0LCBrZXlNYXBJZERyaXZlcik7XG4gIH1cblxuICBfX3BhcnNlUGFzc3BvcnQob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpIHtcbiAgICB0aGlzLl9fcmVmb3JtYXRKdW1pbihvY3JSZXN1bHQpO1xuXG4gICAgY29uc3Qga2V5TWFwUGFzc3BvcnQgPSB7XG4gICAgICBDb21wbGV0ZWQ6ICdjb21wbGV0ZScsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBzdXJOYW1lOiAnc3VyX25hbWUnLFxuICAgICAgZ2l2ZW5OYW1lOiAnZ2l2ZW5fbmFtZScsXG4gICAgICB0eXBlOiAncGFzc3BvcnRfdHlwZScsXG4gICAgICBpc3N1aW5nX2NvdW50cnk6ICdpc3N1aW5nX2NvdW50cnknLFxuICAgICAgcGFzc3BvcnRfbm86ICdwYXNzcG9ydF9udW1iZXInLFxuICAgICAgbmF0aW9uYWxpdHk6ICduYXRpb25hbGl0eScsXG4gICAgICBkYXRlX29mX2lzc3VlOiAnaXNzdWVkX2RhdGUnLFxuICAgICAgc2V4OiAnc2V4JyxcbiAgICAgIGRhdGVfb2ZfZXhwaXJ5OiAnZXhwaXJ5X2RhdGUnLFxuICAgICAgcGVyc29uYWxfbm86ICdwZXJzb25hbF9udW1iZXInLFxuICAgICAgbnVtYmVyOiAnanVtaW4nLFxuICAgICAgZGF0ZV9vZl9iaXJ0aDogJ2JpcnRoZGF5JyxcbiAgICAgIG5hbWVfa29yOiAnbmFtZV9rb3InLFxuICAgICAgbXJ6MTogJ21yejEnLFxuICAgICAgbXJ6MjogJ21yejInLFxuXG4gICAgICBjb2xvcl9wb2ludDogJ2NvbG9yX3BvaW50JyxcbiAgICAgIGZhY2Vfc2NvcmU6ICdmb3VuZF9mYWNlJyxcbiAgICAgIHNwZWN1bGFyOiAnc3BlY3VsYXJfcmF0aW8nLFxuICAgICAgc3RhcnRfdDogJ3N0YXJ0X3RpbWUnLFxuICAgICAgZW5kX3Q6ICdlbmRfdGltZScsXG4gICAgICBpZF90eXBlOiAncmVzdWx0X3NjYW5fdHlwZScsXG4gICAgfTtcbiAgICB0aGlzLl9fY29udmVydExlZ2FjeUZvcm1hdChvY3JSZXN1bHQsIGxlZ2FjeUZvcm1hdCwga2V5TWFwUGFzc3BvcnQpO1xuICB9XG5cbiAgX19wYXJzZUFsaWVuKG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KSB7XG4gICAgdGhpcy5fX3JlZm9ybWF0SnVtaW4ob2NyUmVzdWx0KTtcblxuICAgIGNvbnN0IGtleU1hcEFsaWVuID0ge1xuICAgICAgQ29tcGxldGVkOiAnY29tcGxldGUnLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgbnVtYmVyOiAnanVtaW4nLFxuICAgICAgRGF0ZTogJ2lzc3VlZF9kYXRlJyxcbiAgICAgIG5hdGlvbmFsaXR5OiAnbmF0aW9uYWxpdHknLFxuICAgICAgdmlzYVR5cGU6ICd2aXNhX3R5cGUnLFxuICAgICAgbmFtZV9rb3I6ICduYW1lX2tvcicsXG5cbiAgICAgIGNvbG9yX3BvaW50OiAnY29sb3JfcG9pbnQnLFxuICAgICAgZmFjZV9zY29yZTogJ2ZvdW5kX2ZhY2UnLFxuICAgICAgc3BlY3VsYXI6ICdzcGVjdWxhcl9yYXRpbycsXG4gICAgICBzdGFydF90OiAnc3RhcnRfdGltZScsXG4gICAgICBlbmRfdDogJ2VuZF90aW1lJyxcbiAgICAgIGlkX3R5cGU6ICdyZXN1bHRfc2Nhbl90eXBlJyxcbiAgICB9O1xuXG4gICAgdGhpcy5fX2NvbnZlcnRMZWdhY3lGb3JtYXQob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQsIGtleU1hcEFsaWVuKTtcbiAgfVxuXG4gIF9fcGFyc2VDcmVkaXQob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpIHtcbiAgICBjb25zdCByZXN1bHRTcGxpdCA9IG9jclJlc3VsdC5zcGxpdCgnLCcpO1xuXG4gICAgbGV0IHJlc3VsdEluZGV4ID0gMDtcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpIChsZWdhY3lGb3JtYXQuQ29tcGxldGVkID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdKSwgcmVzdWx0SW5kZXgrKztcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpIChsZWdhY3lGb3JtYXQubnVtYmVyID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdKSwgcmVzdWx0SW5kZXgrKztcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpIChsZWdhY3lGb3JtYXQuZXhwX2RhdGUgPSByZXN1bHRTcGxpdFtyZXN1bHRJbmRleF0pLCByZXN1bHRJbmRleCsrO1xuXG4gICAgcmV0dXJuIFtsZWdhY3lGb3JtYXQsIGxlZ2FjeUZvcm1hdF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE9jclJlc3VsdFBhcnNlcigpO1xuIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0EsT0FBT0EsVUFBVSxNQUFNLGtCQUFrQjtBQUV6QyxNQUFNQyxlQUFlLENBQUM7RUFBQUMsWUFBQTtJQUFBQyxlQUFBLHdCQUNKLENBQ2QsUUFBUSxFQUNSLFFBQVEsRUFDUixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLE9BQU8sRUFDUCxZQUFZLEVBQ1osUUFBUSxFQUNSLFlBQVksRUFDWixZQUFZLEVBQ1osY0FBYyxFQUNkLHNCQUFzQixFQUN0QixXQUFXLEVBQ1gsWUFBWSxDQUNiO0VBQUE7RUFFREMsY0FBY0EsQ0FBQ0MsT0FBTyxFQUFFQyxPQUFPLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFQyxhQUFhLEVBQUVDLGFBQWEsRUFBRUMsWUFBWSxFQUFFQyxhQUFhLEVBQUU7SUFDaEgsSUFBSSxDQUFDLElBQUks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
