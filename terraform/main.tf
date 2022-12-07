# google_client_config and kubernetes provider must be explicitly specified like the following.

data "google_client_config" "default" {}

resource "google_compute_subnetwork" "private_subnet" {
  name          = "main-subnetwork"
  ip_cidr_range = "16.2.0.0/16"
  region        = var.region
  network       = google_compute_network.main_network.id

  secondary_ip_range {
    range_name    = "services-range"
    ip_cidr_range = "192.168.0.0/18"
  }

  secondary_ip_range {
    range_name    = "pod-ranges"
    ip_cidr_range = "192.168.64.0/18"
  }
}


resource "google_compute_network" "main_network" {
  name                    = "main-network"
  auto_create_subnetworks = false
}



resource "google_compute_global_address" "private_ip_address" {
  provider = google-beta

  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16

  network = google_compute_network.main_network.id

}


resource "google_service_networking_connection" "private_vpc_connection" {
  provider = google-beta

  network                 = google_compute_network.main_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}


resource "random_id" "db_prefix" {
  byte_length = 4
}

resource "google_sql_database_instance" "private_postgres_instance" {
  provider = google-beta

  name             = "private-postgres-instance-${random_id.db_prefix.hex}"
  region           = var.region
  database_version = "POSTGRES_14"

  depends_on = [
    google_service_networking_connection.private_vpc_connection
  ]
  settings {
    tier = "db-g1-small"
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.main_network.id
    }

  }

  deletion_protection = false
}

resource "google_sql_database" "main_db" {
  name     = "prod_db"
  project  = var.project_id
  instance = google_sql_database_instance.private_postgres_instance.name
  depends_on = [
    google_sql_database_instance.private_postgres_instance
  ]

}

resource "random_password" "user_password" {
  keepers = {
    name = google_sql_database_instance.private_postgres_instance.name
  }

  length     = 32
  special    = false
  depends_on = [google_sql_database_instance.private_postgres_instance]
}

resource "google_sql_user" "default_user" {
  name     = var.user_name == "" ? "postgres" : var.user_name
  project  = var.project_id
  instance = google_sql_database_instance.private_postgres_instance.name
  password = random_password.user_password.result

  deletion_policy = "ABANDON"


  depends_on = [
    google_sql_database_instance.private_postgres_instance
  ]
}

# search it 
resource "google_service_account" "default" {
  account_id   = var.project_id
  display_name = "natica"

}


resource "null_resource" "delay" {
  provisioner "local-exec" {
    command = "sleep 20"
  }

  triggers = {
    "before" = "${google_service_account.default.id}"
  }
}

resource "google_container_cluster" "natica_cluster" {
  name               = local.cluster_name
  location           = var.region # first one
  initial_node_count = 1

  node_locations = ["${var.region}-a", "${var.region}-b"]


  min_master_version = data.google_container_engine_versions.europewest3.latest_node_version

  network    = google_compute_network.main_network.id
  subnetwork = google_compute_subnetwork.private_subnet.id


  ip_allocation_policy {
    cluster_secondary_range_name  = "services-range"
    services_secondary_range_name = google_compute_subnetwork.private_subnet.secondary_ip_range.1.range_name
  }


  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }


  remove_default_node_pool = true


  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
  }

  depends_on = [
    null_resource.delay
  ]
}


data "google_container_engine_versions" "europewest3" {
  # provider       = google-beta
  location       = var.region
  version_prefix = "1.24."
}


resource "google_container_node_pool" "primary_node_group" {
  name_prefix = "node-pool"
  cluster     = google_container_cluster.natica_cluster.id
  node_count  = 1


  version = data.google_container_engine_versions.europewest3.latest_node_version

  autoscaling {
    max_node_count = 2
    min_node_count = 0
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }


  node_config {
    preemptible  = true
    machine_type = "e2-medium"

    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    service_account = google_service_account.default.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    disk_size_gb = 20
    disk_type    = "pd-standard"
    labels = {
      "Name" = "node-group"
    }
    image_type = "cos_containerd"
  }
}


resource "null_resource" "create_role" {
  depends_on = [
    google_container_cluster.natica_cluster,
    google_container_node_pool.primary_node_group
  ]

  provisioner "local-exec" {
    command = "${path.module}/gcloud.sh ${var.project_id} add-iam-policy-binding"
    # interpreter = [
    #   "gcloud"
    # ]

    environment = {
      PROJECT_ID = var.project_id,
      WHICH      = "add-iam-policy-binding"
    }
  }
}


resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress-controller"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"

  set {
    name  = "service.type"
    value = "LoadBalancer"
  }

  depends_on = [
    google_container_cluster.natica_cluster,
    google_container_node_pool.primary_node_group,
    null_resource.create_role
  ]

}




# resource "null_resource" "connect" {
#   depends_on = [
#     null_resource.create_role
#   ]

#   provisioner "local-exec" {
#     command = "${path.module}/connect.sh"
#     interpreter = [
#       "bash"

#   }
# }

