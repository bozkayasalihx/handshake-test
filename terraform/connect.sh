#!/bin/sh

echo "############# connection to google cloud gke service ############"


echo "setting up cluster name"
CLUSTER_NAME=$(gcloud container clusters list --format=json --limit=1  | jq '.[0].name' | tr -d '"')

echo "setting up region"
REGION="europe-west3" 


echo "settting up project name and id "
PROJECTID=$(gcloud projects list --format=json | jq '.[0].projectId' | tr -d '"')


echo "script running please wait..."
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION --project $PROJECTID
