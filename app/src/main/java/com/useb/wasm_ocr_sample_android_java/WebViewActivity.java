package com.useb.wasm_ocr_sample_android_java;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.widget.ImageView;
import android.widget.Toast;

import com.useb.wasm_ocr_sample_android_java.databinding.ActivityWebViewBinding;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Objects;

public class WebViewActivity extends AppCompatActivity {


    private ActivityWebViewBinding binding;
    private Handler handler = new Handler();
    private WebView webview = null;
    private String OCR_LICENSE_KEY = "FPkTB86ym/u+5Gr2Ffvg5BnN8Jh2J64u8l920gwXmvv5/dxlwtGKhNiw9/aeBXRRSYE+5ylxEWRzk4sD8wAbS5xHeZXBw7o9H2fsoxx0FicsaNh0=";
    private String OCR_RESOURCE_BASE_URL = "file:///android_asset/";

    private String url = "file:///android_asset/ocr.html";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);


        // 바인딩 설정
        binding = ActivityWebViewBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (webview != null) {
                    webview.destroy();
                }
                finish();
            }
        });
        // 웹뷰 설정
        webview = binding.webview;
        webview.getSettings().setJavaScriptEnabled(true);
        webview.setWebViewClient(new WebViewClient());
        webview.setWebChromeClient(new WebChromeClient());
        webview.addJavascriptInterface(this, "usebwasmocr");
        webview.getSettings().setAppCacheEnabled(false);
        webview.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        // 파일 유형 설정
        webview.getSettings().setAllowFileAccess(true); // 파일 액세스 허용
        webview.getSettings().setAllowFileAccessFromFileURLs(true); // 파일 URL로부터의 액세스 허용
        webview.getSettings().setAllowUniversalAccessFromFileURLs(true); // 모든 파일로부터의 액세스 허용

        // 사용자 데이터 인코딩
        String encodedUserInfo = encodeJson();

        // POST
        postUserInfo(url, encodedUserInfo);
    }


    // WebView 액티비티에서 뒤로가기 버튼 막기
    @Override
    public void onBackPressed() {
        //super.onBackPressed();
    }

    private void postUserInfo(String url, String encodedUserInfo) {

        handler.post(new Runnable() {
            @Override
            public void run() {

                // 카메라 권한 요청
                cameraAuthRequest();
                webview.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        webview.loadUrl("javascript:usebwasmocrreceive('" + encodedUserInfo + "')");
                    }
                });
            }
        });
    }

    private String encodeJson() {
        String encodedData = null;
        try {
            String data = encodeURIComponent(getData().toString());
            encodedData = Base64.encodeToString(data.getBytes(), 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return encodedData;
    }

    private JSONObject getData() throws JSONException {
        String scanType = getIntent().getStringExtra("scanType");
        return dataToJson(scanType);
    }

    private JSONObject dataToJson(String ocrType) throws JSONException {
        JSONObject settings = new JSONObject();
        settings.put("licenseKey", this.OCR_LICENSE_KEY);
        settings.put("useEncryptMode", Objects.equals(getIntent().getStringExtra("useEncryptMode"), "true"));
        settings.put("resourceBaseUrl", this.OCR_RESOURCE_BASE_URL);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("ocrType", ocrType);
        jsonObject.put("settings", settings);

        return jsonObject;
    }

    private String encodeURIComponent(String encoded) {

        String encodedURI = null;
        try {
            encodedURI = URLEncoder.encode(encoded, "UTF-8").replaceAll("\\+", "%20").replaceAll("\\%21", "!").replaceAll("\\%27", "'").replaceAll("\\%28", "(").replaceAll("\\%29", ")").replaceAll("\\%7E", "~");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        return encodedURI;
    }

    @JavascriptInterface
    public void receive(String data) throws JSONException {

        try {
            Intent intent = new Intent(WebViewActivity.this, ReportActivity.class);

            String decodedData = decodedReceiveData(data);

            JSONObject jsonData = new JSONObject(decodedData);
            JSONObject reviewResult = new JSONObject(jsonData.getString("review_result"));

            String ocrType = reviewResult.getString("ocr_type");
            if (ocrType.startsWith("idcard")) {
                ocrType = "주민증록증/운전면허증";
            } else if (ocrType.startsWith("passport")) {
                ocrType = "국내/해외여권";
            } else if (ocrType.startsWith("alien")) {
                ocrType = "외국인등록증";
            } else if (ocrType.startsWith("credit")) {
                ocrType = "신용카드";
            } else {
                ocrType = "INVALID_TYPE";
            }
            String result = jsonData.getString("result");

            if (result.equals("success")) {
                if (reviewResult.has("ocr_origin_image")) {
                    String b64 = reviewResult.getString("ocr_origin_image");
                    if (!b64.equals("null")) {
                        if (b64.startsWith("data:image/")) {
                            b64 = b64.substring(b64.indexOf(",") + 1);
                            byte[] byteArray = getByteArrayFromBase64String(b64);
                            intent.putExtra("originalImage", byteArray);
                        } else {
                            intent.putExtra("originalImageEncrypted", "Encrypted");
                        }

                    }
                }
                if (reviewResult.has("ocr_masking_image")) {
                    String b64 = reviewResult.getString("ocr_masking_image");
                    if (!b64.equals("null")) {
                        if (b64.startsWith("data:image/")) {
                            b64 = b64.substring(b64.indexOf(",") + 1);
                            byte[] byteArray = getByteArrayFromBase64String(b64);
                            intent.putExtra("maskedImage", byteArray);
                        } else {
                            intent.putExtra("maskedImageEncrypted", "Encrypted");
                        }
                    }
                }

                JSONObject modifiedJsonData = ModifyReviewResult(jsonData);

                intent.putExtra("status", "OCR이 완료되었습니다.");
                intent.putExtra("result", "- 인증 결과 : 성공\n- OCR 종류 : " + ocrType);
                intent.putExtra("detail", modifiedJsonData.toString(4));
            } else if (result.equals("failed")) {
                intent.putExtra("status", "OCR이 실패되었습니다.");
                intent.putExtra("result", "- 인증 결과 : 실패\n- OCR 종류 : " + ocrType);
                intent.putExtra("detail", jsonData.toString(4));
            }

            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            startActivity(intent);

        } catch (JSONException e) {
            e.printStackTrace();
        } catch (Exception e) {
            Log.e("EXCEPTION!!!!!!!", e.getMessage());
            e.printStackTrace();
        }
    }

    private byte[] getByteArrayFromBase64String(String str) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        Bitmap bitmap = getBitmapFromBase64String(str);
        float scale = (float) (1024 / 2 / (float) bitmap.getWidth());
        int image_w = (int) (bitmap.getWidth() * scale);
        int image_h = (int) (bitmap.getHeight() * scale);
        Bitmap resize = Bitmap.createScaledBitmap(bitmap, image_w, image_h, true);
        resize.compress(Bitmap.CompressFormat.JPEG, 100, stream);
        return stream.toByteArray();
    }

    private Bitmap getBitmapFromBase64String(String str) {
        byte[] decodedString = Base64.decode(str.getBytes(), Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
    }

    private JSONObject ModifyReviewResult(JSONObject JsonObject) throws JSONException {

        String reviewResult = JsonObject.getString("review_result");
        JSONObject reviewResultJsonObject = new JSONObject(reviewResult);

        String originalImage = reviewResultJsonObject.getString("ocr_origin_image");
        String maskingImage = reviewResultJsonObject.getString("ocr_masking_image");
        String faceImage = reviewResultJsonObject.getString("ocr_face_image");

        if (originalImage != "null") {
            originalImage = originalImage.substring(0, 20) + "...생략(omit)...";
            reviewResultJsonObject.put("ocr_origin_image", originalImage);
        }
        if (maskingImage != "null") {
            maskingImage = maskingImage.substring(0, 20) + "...생략(omit)...";
            reviewResultJsonObject.put("ocr_masking_image", maskingImage);
        }
        if (faceImage != "null") {
            faceImage = faceImage.substring(0, 20) + "...생략(omit)...";
            reviewResultJsonObject.put("ocr_face_image", faceImage);
        }

        JsonObject.put("review_result", reviewResultJsonObject);

        return JsonObject;
    }

    public String decodedReceiveData(String data) {

        String decoded = new String(Base64.decode(data, 0));
        return decodeURIComponent(decoded);
    }

    private String decodeURIComponent(String decoded) {

        String decodedURI = null;
        try {
            decodedURI = URLDecoder.decode(decoded, "UTF-8").replaceAll("%20", "\\+").replaceAll("!", "\\%21").replaceAll("'", "\\%27").replaceAll("\\(", "\\%28").replaceAll("\\)", "\\%29").replaceAll("~", "\\%7E");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return decodedURI;
    }


    private void cameraAuthRequest() {

        webview = binding.webview;
        WebSettings ws = webview.getSettings();
        ws.setMediaPlaybackRequiresUserGesture(false);

        webview.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {

                //API레벨이 21이상인 경우
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    final String[] requestedResources = request.getResources();
                    for (String r : requestedResources) {
                        if (r.equals(PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                            request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                            break;
                        }
                    }
                }
            }
        });
        int cameraPermissionCheck = ContextCompat.checkSelfPermission(WebViewActivity.this, Manifest.permission.CAMERA);
        if (cameraPermissionCheck != PackageManager.PERMISSION_GRANTED) { // 권한이 없는 경우
            ActivityCompat.requestPermissions(WebViewActivity.this, new String[]{Manifest.permission.CAMERA}, 1000);
        } else {
            webview.loadUrl(url);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == 1000) {
            if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(WebViewActivity.this, "카메라/갤러리 접근 권한이 없습니다. 권한 허용 후 이용해주세요. no access permission for camera and gallery.", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                webview.loadUrl(url);
            }
        }
    }

}