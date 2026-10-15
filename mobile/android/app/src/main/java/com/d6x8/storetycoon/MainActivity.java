package com.d6x8.storetycoon;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(StoreRewardsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
