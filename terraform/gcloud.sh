#!/bin/sh

GCLOUD_LOCATION=$(command -v gcloud)
echo "Using gcloud from $GCLOUD_LOCATION"

gcloud --version

echo "gcloud projects add-iam-policy-binding $1 --member serviceAccount:$1@$1.iam.gserviceaccount.com --role roles/artifactregistry.reader"
gcloud projects $2 $1 --member "serviceAccount:$1@$1.iam.gserviceaccount.com" --role "roles/artifactregistry.reader"

