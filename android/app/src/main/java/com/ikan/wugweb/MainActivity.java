package com.ikan.wugweb;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.ikan.wugweb.health.IkanHealthPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IkanHealthPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
