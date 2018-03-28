#!/bin/bash
 
echo ""
echo "Generate a Certificate Signing Request (CSR) file:"
echo "Enter CSR name (example: csr.csr):"
read csr_path
echo "Enter path to CSR configuration file (example: csr.cnf):"
read cnf_path
echo "Enter path to private key file (example: key.key):"
read key_path
echo ""

if openssl req -config $cnf_path -new -key $key_path -inform PEM -out $csr_path -outform PEM
then

  echo ""
  echo "Created "$csr_path" in "$PWD"/"$csr_path

else

  echo ""
  echo "Could not generate CSR due to error!"

fi

echo ""
