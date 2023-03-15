package com.useb.wasm_ocr_sample_android_java;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.core.content.res.TypedArrayUtils;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

public class ReportActivity extends AppCompatActivity {


    private String result = "";
    private String detail = "";
    private String status = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report);
        AppCompatButton retryButton = findViewById(R.id.btn_retry);
        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(intent);

                finish();
            }
        });
        getData();
        setData();

    }


    private void getData() {
        status = getIntent().getStringExtra("status");
        result = getIntent().getStringExtra("result");
        detail = getIntent().getStringExtra("detail");
    }

    private void setData() {
        try {
            JSONObject jsonObject = new JSONObject(detail);
            JSONObject reviewResult = new JSONObject(jsonObject.getString("review_result"));

            TextView statusTv = findViewById(R.id.status);
            statusTv.setText(status);
            TextView resultTv = findViewById(R.id.result);
            resultTv.setText(result);

            if (getIntent().hasExtra("originalImage")) {
                byte[] byteArray = getIntent().getByteArrayExtra("originalImage");
                Bitmap bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
                TextView tv = findViewById(R.id.textOriginalImage);
                if (reviewResult.getString("ocr_type").equals("credit")) {

                    tv.setText("- 신용카드 원본 사진");
                } else {
                    tv.setText("- 신분증 원본 사진");
                }
                tv.setVisibility(View.VISIBLE);
                ImageView iv = findViewById(R.id.originalImageView);
                iv.setVisibility(View.VISIBLE);
                iv.setImageBitmap(bitmap);
            }

            if (getIntent().hasExtra("maskedImage")) {
                byte[] byteArray = getIntent().getByteArrayExtra("maskedImage");

                Bitmap bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.length);
                TextView tv = findViewById(R.id.textMaskImage);
                tv.setVisibility(View.VISIBLE);

                if (reviewResult.getString("ocr_type").equals("credit")) {
                    tv.setText("- 신용카드 마스킹 사진");
                } else {
                    tv.setText("- 신분증 마스킹 사진");
                }
                ImageView iv = findViewById(R.id.maskedImageView);
                iv.setVisibility(View.VISIBLE);
                iv.setImageBitmap(bitmap);
            }

            TextView detailTv = findViewById(R.id.detail);
            detailTv.setText(detail);
        } catch (JSONException e) {
            e.printStackTrace();
        }
//        try {
//            JSONObject JsonObject = new JSONObject(detail);
//            String reviewResult = JsonObject.getString("review_result");
//            JSONObject reviewResultJsonObject = new JSONObject(reviewResult);
//
//            if (JsonObject.has("ocr_origin_image")) {
//                originalImageBase64 = reviewResultJsonObject.getString("ocr_origin_image");
//            }
//            if (reviewResultJsonObject.has("ocr_masking_image")) {
//                maskedImageBase64 = reviewResultJsonObject.getString("ocr_masking_image");
//            }
//
//            if (!originalImageBase64.equals("null")) {
//                originalImageBase64 = originalImageBase64.substring(originalImageBase64.indexOf(",") + 1);
//                findViewById(R.id.textOriginalImage).setVisibility(View.VISIBLE);
//                ImageView iv = findViewById(R.id.originalImageView);
//                iv.setVisibility(View.VISIBLE);
//                iv.setImageBitmap(getBitmapFromBase64String(originalImageBase64));
//            }
//            if (!maskedImageBase64.equals("null")) {
//                maskedImageBase64 = maskedImageBase64.substring(maskedImageBase64.indexOf(",") + 1);
//                findViewById(R.id.textMaskImage).setVisibility(View.VISIBLE);
//                ImageView iv = findViewById(R.id.maskedImageView);
//                iv.setVisibility(View.VISIBLE);
//                iv.setImageBitmap(getBitmapFromBase64String(maskedImageBase64));
//            }
//
//            TextView detailTv = findViewById(R.id.detail);
//            detailTv.setText(detail);
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }

    }

}