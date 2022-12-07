
terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    google = {
      source = "hashicorp/google"
    }

    null = {
      source = "hashicorp/null"
    }

    google-beta = {
      source = "hashicorp/google-beta"
    }

    random = {
      source = "hashicorp/random"
    }
    helm = {
      source = "hashicorp/helm"
    }
  }

  backend "gcs" {
    prefix = "terraform/state"
    bucket = "ter_state"
  }

}


provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region

}

provider "helm" {
  kubernetes {
    host                   = "https://${data.google_container_cluster.natica_cluster.endpoint}"
    token                  = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(google_container_cluster.natica_cluster.master_auth.0.cluster_ca_certificate)
  }

  # kubernetes {
  #   config_path = "~/.kube/config"
  # }
}

provider "random" {}


provider "null" {}

provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.natica_cluster.master_auth.0.cluster_ca_certificate)
}
