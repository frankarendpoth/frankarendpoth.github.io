#!/bin/bash
 
echo ""
echo "Generate a self signed certificate:"
echo "Enter certificate name (example: crt.crt):"
read crt_path
echo "Enter path to certificate configuration file (example: crt.cnf):"
read cnf_path
echo "Enter path to private key file (example: key.key):"
read key_path
echo "Enter path to CSR file (example: csr.csr):"
read csr_path
echo "Enter number of days until expiration (example: 365):"
read days
echo ""

# certificate extensions must be stored in the v3_ca section in the configuration file
if openssl x509 -req -days $days -in $csr_path -signkey $key_path -out $crt_path -extfile $cnf_path -extensions v3_ca
then

  echo ""
  echo "Created "$crt_path" in "$PWD"/"$crt_path

else

  echo ""
  echo "Could not generate certificate due to error!"

fi

echo ""
