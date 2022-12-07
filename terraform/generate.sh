#!/bin/bash

echo "generating project id and name"
PROJECTID=$(gcloud projects list --format=json --limit=1 | jq '.[0].projectId' | tr -d '"')

echo "############ terraform apply running please wait.."
terraform apply -var project_id=$PROJECTID -auto-approve
