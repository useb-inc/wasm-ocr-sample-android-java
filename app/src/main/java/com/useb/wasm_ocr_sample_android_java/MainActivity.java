package com.useb.wasm_ocr_sample_android_java;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.useb.wasm_ocr_sample_android_java.databinding.ActivityMainBinding;

import java.util.ArrayList;
import java.util.Arrays;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private View.OnClickListener btnOnclickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            Intent secondIntent = new Intent(getApplicationContext(), WebViewActivity.class);
            if(sendDataToWebview(secondIntent, view.getTag().toString()))
                startActivity(secondIntent);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.btnIdcard.setOnClickListener(btnOnclickListener);
        binding.btnPassport.setOnClickListener(btnOnclickListener);
        binding.btnAlien.setOnClickListener(btnOnclickListener);
        binding.btnCredit.setOnClickListener(btnOnclickListener);
    }

    private boolean isValid(String scanType) {
        ArrayList<String> types = new ArrayList<String>(
                Arrays.asList("idcard", "passport", "alien", "credit"));

        return types.contains(scanType);
    }

    private boolean sendDataToWebview(Intent secondIntent, String scanType){
        if (!isValid(scanType)) return false;

        secondIntent.putExtra("scanType", scanType);
        return true;
    }
}