#!/bin/bash

PROJECTID=$(gcloud projects list --format=json --limit=1 | jq '.[0].projectId' | tr -d '"')

echo "destroying terraform cluster and node groups please wait ..."
terraform destroy -var project_id=$PROJECTID -auto-approve

