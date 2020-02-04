#!/bin/bash
 
echo ""
echo "Generate a private Key file in PEM format:"
echo "Enter key name (example: key.key):"
read key_path
echo ""

if  openssl genpkey -algorithm RSA -out $key_path -outform PEM -pkeyopt rsa_keygen_bits:4096
then

  echo ""
  echo "Created "$key_path" in "$PWD"/"$key_path

else

  echo ""
  echo "Could not create "$key_path" due to error!"

fi

echo ""
