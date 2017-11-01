#!/bin/bash

echo ""
echo "Generate a Public Key Cryptography Standards # 12 ( PKCS#12 ) file:"
echo "Enter certificate name (example: crt.pfx):"
read pfx_path
echo "Enter path to private key file (example: key.key):"
read key_path
echo "Enter path to certificate file (example: crt.crt):"
read crt_path
echo ""

if openssl pkcs12 -export -out $pfx_path -inkey $key_path -in $crt_path
then

  echo ""
  echo "Created "$pfx_path" in "$PWD"/"$pfx_path

else

  echo ""
  echo "Could not create "$pfx_path" due to error!"

fi

echo ""
