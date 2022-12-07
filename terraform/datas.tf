data "google_container_cluster" "natica_cluster" {
  name     = local.cluster_name
  location = var.region
}

output "gke_cluster_endpoint" {
  value = data.google_container_cluster.natica_cluster.endpoint
}