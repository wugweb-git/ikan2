package com.ikan.wugweb;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;
import com.ikan.wugweb.health.IkanHealthPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IkanHealthPlugin.class);
        super.onCreate(savedInstanceState);

        /*
         * Hand the system-window insets to the web layer instead of letting the framework pad
         * around them. Paired with windowLayoutInDisplayCutoutMode=shortEdges in the theme,
         * this is what makes env(safe-area-inset-*) report real values inside the WebView.
         *
         * Without it those insets are 0 on Android, so the css that keeps page headers clear
         * of the punch-hole silently falls back to its ordinary padding - while Android 15's
         * enforced edge-to-edge has already pushed the content up under the camera.
         */
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
