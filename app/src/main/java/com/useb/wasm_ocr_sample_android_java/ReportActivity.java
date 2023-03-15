package com.useb.wasm_ocr_sample_android_java;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;

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
    private String maskedImageBase64 = "";
    private String originalImageBase64 = "";

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
        try {
            getData();
        } catch (Exception e) {
            e.printStackTrace();
        }
        setData();

    }


    private void getData() throws JSONException {
        status = getIntent().getStringExtra("status");
        result = getIntent().getStringExtra("result");
        detail = new String(Base64.decode(getIntent().getStringExtra("detail"), 0));
    }

    private void setData() {
        TextView statusTv = findViewById(R.id.status);
        statusTv.setText(status);
        TextView resultTv = findViewById(R.id.result);
        resultTv.setText(result);

        try {
            JSONObject JsonObject = new JSONObject(detail);
            String reviewResult = JsonObject.getString("review_result");
            JSONObject reviewResultJsonObject = new JSONObject(reviewResult);

            if (JsonObject.has("ocr_origin_image")) {
                originalImageBase64 = reviewResultJsonObject.getString("ocr_origin_image");
            }
            if (reviewResultJsonObject.has("ocr_masking_image")) {
                maskedImageBase64 = reviewResultJsonObject.getString("ocr_masking_image");
            }

            if (!originalImageBase64.equals("null")) {
                originalImageBase64 = originalImageBase64.substring(originalImageBase64.indexOf(",") + 1);
                findViewById(R.id.textOriginalImage).setVisibility(View.VISIBLE);
                ImageView iv = findViewById(R.id.originalImageView);
                iv.setVisibility(View.VISIBLE);
                iv.setImageBitmap(getBitmapFromBase64String(originalImageBase64));
            }
            if (!maskedImageBase64.equals("null")) {
                maskedImageBase64 = maskedImageBase64.substring(maskedImageBase64.indexOf(",") + 1);
                findViewById(R.id.textMaskImage).setVisibility(View.VISIBLE);
                ImageView iv = findViewById(R.id.maskedImageView);
                iv.setVisibility(View.VISIBLE);
                iv.setImageBitmap(getBitmapFromBase64String(maskedImageBase64));
            }

            TextView detailTv = findViewById(R.id.detail);
            detailTv.setText(detail);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    private Bitmap getBitmapFromBase64String(String str) {
        byte[] decodedString = Base64.decode(str.getBytes(), Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
    }
}