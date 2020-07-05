# How to Generate an Android Keystore

1. `keytool -genkeypair -v -keystore keystore.jks -alias Y29tLmFkbWluaXN0cmF0ZS5sbXM= -keyalg RSA -keysize 2048 -validity 9125`
1. Set a keystore password.
1. Set the following fields:

   - `What is your first and last name?`: `Greg Brimble`
   - `What is the name of your organizational unit?`: `Engineering`
   - `What is the name of your organization?`: `Glenstack`
   - `What is the name of your City or Locality?`: `Edinburgh`
   - `What is the name of your State or Province?`: `City of Edinburgh`
   - `What is the two-letter country code for this unit?`: `UK`

1. Confirm the details are correct: `yes`
1. Set a key password.
