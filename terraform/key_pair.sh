#!/bin/bash

key_name = ec2_key

# Create SSH Key Pair and store its ID in a variable
aws ec2 create-key-pair \
    --key-name  $key_name \
    --query 'KeyMaterial' \
    --output text > ~/.ssh/$key_name.pem

sudo chmod 600 .ssh
sudo chmod 700 ~/.ssh/$key_name.pem
