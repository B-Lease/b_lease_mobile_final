package com.hnc.blease;

import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);

      registerPlugin(GoogleAuth.class);



    }
}
