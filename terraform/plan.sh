#!/bin/bash
echo "generating project id and name"
PROJECTID=$(gcloud projects list --format=json  | jq '.[1].projectId' | tr -d '"')

echo "############ terraform apply running please wait.."
terraform plan -var project_id=$PROJECTID 
