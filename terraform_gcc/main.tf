# Store the terraform state in a google cloud storage bucket:
terraform {
  backend "gcs" {
    bucket = "rhyssoft-tfstate"
    prefix = "tfstate"
  }
}

# define the bucket for holding the website files:
resource "google_storage_bucket" "rhyssoft_com" {
  name     = "www.rhyssoft.com"
  # The name is what matches the bucket to the hostname
  location = "europe-west2"
  project  = "rhyssoft-com-website"

  public_access_prevention    = "inherited"
  uniform_bucket_level_access = false # needs to be false to apply an acl

  versioning {
    enabled = false
  }

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

# define the default ACL for the bucket
#  gives read access to all users (making the bucket public-readable)
resource "google_storage_default_object_acl" "rhyssoft-default-acl" {
  bucket      = google_storage_bucket.rhyssoft_com.name
  role_entity = [
    "READER:allUsers"
  ]
}

############ Set up Load Balancer, so that we can server via HTTPS ############
# VPC
resource "google_compute_network" "rs-network" {
  project                 = "rhyssoft-com-website"
  name                    = "rs-network"
  auto_create_subnetworks = false
}

# backend subnet
resource "google_compute_subnetwork" "rs-subnet" {
  project       = "rhyssoft-com-website"
  name          = "rs-subnetwork"
  ip_cidr_range = "10.0.1.0/24"
  region        = "europe-west2"
  network       = google_compute_network.rs-network.id
}

# reserved IP address
resource "google_compute_global_address" "rs-address" {
  project  = "rhyssoft-com-website"
  provider = google-beta
  name     = "rs-address"
}

# forwarding rule
resource "google_compute_global_forwarding_rule" "rs-https-forwarding-rule" {
  project               = "rhyssoft-com-website"
  name                  = "rs-https-forwarding-rule"
  provider              = google-beta
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.rs-target-https-proxy.id
  ip_address            = google_compute_global_address.rs-address.id
}

resource "google_compute_global_forwarding_rule" "rs-http-forwarding-rule" {
  project               = "rhyssoft-com-website"
  name                  = "rs-http-forwarding-rule"
  provider              = google-beta
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "80"
  target                = google_compute_target_http_proxy.rs-target-http-proxy.id
  ip_address            = google_compute_global_address.rs-address.id
}

# http proxy
resource "google_compute_target_http_proxy" "rs-target-http-proxy" {
  project  = "rhyssoft-com-website"
  name     = "rs-http-proxy"
  provider = google-beta
  url_map  = google_compute_url_map.rs-url-map.id
}

# https proxy
resource "google_compute_target_https_proxy" "rs-target-https-proxy" {
  project          = "rhyssoft-com-website"
  name             = "rs-https-proxy"
  provider         = google-beta
  url_map          = google_compute_url_map.rs-url-map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.rs-ssl-cert.id]
}

# url map
resource "google_compute_url_map" "rs-url-map" {
  project         = "rhyssoft-com-website"
  name            = "rs-url-map"
  provider        = google-beta
  default_service = google_compute_backend_bucket.rs-backend-bucket.id


  host_rule {
    hosts        = ["*.rhyssoft.com"]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_bucket.rs-backend-bucket.id

    path_rule {
      paths   = ["/*"]
      service = google_compute_backend_bucket.rs-backend-bucket.id
    }
  }
}

resource "google_compute_backend_bucket" "rs-backend-bucket" {
  project     = "rhyssoft-com-website"
  name        = "rs-backend-bucket"
  description = "Serve rhyssoft.com"
  bucket_name = google_storage_bucket.rhyssoft_com.name
}

# SSL certificate:
resource "google_compute_managed_ssl_certificate" "rs-ssl-cert" {
  project = "rhyssoft-com-website"
  name    = "rs-ssl-cert"

  managed {
    domains = ["rhyssoft.com", "www.rhyssoft.com"]
  }
}
