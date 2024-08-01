variable "region" {
  description = "The AWS region in which the resources will be created."
  type        = string
  default     = "eu-west-3"
}

variable "availability_zone_a" {
  description = "The availability zone where the resources will reside."
  type        = string
  default     = "eu-west-3a"
}

variable "ami" {
  description = "The ID of the Amazon Machine Image (AMI) used to create the EC2 instance."
  type        = string
  default     = "ami-031813d9986aac8c7" // "ami-031813d9986aac8c7" // "ami-0756283460878b818"
}

variable "instance_type" {
  description = "The type of EC2 instance used to create the instance."
  type        = string
  default     = "t2.micro"
}
