output "db_private_ip" {
  value = google_sql_database_instance.private_postgres_instance.private_ip_address
}

output "db_public_ip" {
  value = google_sql_database_instance.private_postgres_instance.public_ip_address
}
output "db_connection_name" {
  value = google_sql_database_instance.private_postgres_instance.name
}

output "db_email" {
  value = google_sql_database_instance.private_postgres_instance.service_account_email_address
}


output "db_self_link" {
  value = google_sql_database_instance.private_postgres_instance.self_link
}

output "db_password" {
  value = random_password.user_password.result
  sensitive = true
}