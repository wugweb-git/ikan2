package com.ikan.wugweb.health

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle

/** Health Connect opens this when someone asks why iKAN wants their health data:
 * it shows iKAN's privacy policy. */
class PermissionsRationaleActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        startActivity(
            Intent(Intent.ACTION_VIEW, Uri.parse("https://app.ikanhealth.in/legal/privacy-policy")),
        )
        finish()
    }
}
