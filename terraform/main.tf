# Create a vpc 
resource "aws_vpc" "ibtool_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    name = "my_vpc"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "ibtool_IGW" {
  vpc_id = aws_vpc.ibtool_vpc.id

  tags = {
    name = "my_IGW"
  }
}

# Create a custom route table
resource "aws_route_table" "ibtool_route_table" {
  vpc_id = aws_vpc.ibtool_vpc.id

  tags = {
    name = "my_route_table"
  }
}

# create route
resource "aws_route" "ibtool_route" {
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.ibtool_IGW.id
  route_table_id         = aws_route_table.ibtool_route_table.id
}

# create a subnet
resource "aws_subnet" "ibtool_subnet" {
  vpc_id            = aws_vpc.ibtool_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = var.availability_zone_a

  tags = {
    name = "my_subnet"
  }
}

# associate internet gateway to the route table by using subnet
resource "aws_route_table_association" "ibtool_assoc" {
  subnet_id      = aws_subnet.ibtool_subnet.id
  route_table_id = aws_route_table.ibtool_route_table.id
}

# create security group to allow ingoing ports
resource "aws_security_group" "ibtool_SG" {
  name        = "sec_group"
  description = "security group for the EC2 instance"
  vpc_id      = aws_vpc.ibtool_vpc.id

  ingress = [
    {
      description      = "https traffic"
      from_port        = 443
      to_port          = 443
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.ibtool_vpc.cidr_block]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    },
    {
      description      = "http traffic"
      from_port        = 80
      to_port          = 80
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.ibtool_vpc.cidr_block]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    },
    {
      description      = "ssh"
      from_port        = 22
      to_port          = 22
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.ibtool_vpc.cidr_block]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  egress = [
    {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      description      = "Outbound traffic rule"
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  tags = {
    name = "allow_web"
  }
}


# create a network interface with private ip from step 4
resource "aws_network_interface" "ibtool_net_interface" {
  subnet_id       = aws_subnet.ibtool_subnet.id
  security_groups = [aws_security_group.ibtool_SG.id]
}

# assign a elastic ip to the network interface created in step 7
resource "aws_eip" "ibtool_eip" {
  domain                   = "vpc"
  network_interface         = aws_network_interface.ibtool_net_interface.id
  associate_with_private_ip = aws_network_interface.ibtool_net_interface.private_ip
  depends_on                = [aws_internet_gateway.ibtool_IGW, aws_instance.web]
}


resource "tls_private_key" "ibtool_key" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "ibtool_key" {
  key_name   = "key-pair"
  public_key = tls_private_key.ibtool_key.public_key_openssh
}

resource "local_file" "private_key" {
  content        = tls_private_key.ibtool_key.private_key_pem
  filename       = "${path.module}/key-pair.pem"
  file_permission = "0400"
}

# create an ubuntu server and install/enable apache2
resource "aws_instance" "web" {
  ami               = var.ami
  instance_type     = var.instance_type
  availability_zone = var.availability_zone_a
  key_name          = aws_key_pair.ibtool_key.key_name

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.ibtool_net_interface.id
  }

  user_data = file("${path.module}/userdata.sh")

  tags = {
    name = "web_server"
  }

  depends_on = [aws_network_interface.ibtool_net_interface]
}



# resource "null_resource" "wait_for_instance" {
#   depends_on = [aws_eip.ibtool_eip, aws_instance.web, local_file.private_key]

#   provisioner "remote-exec" {
#     inline = [
#       "echo Instance is ready"
#     ]
#     connection {
#       type        = "ssh"
#       user        = "ec2-user"
#       private_key = file(local_file.private_key.filename)
#       host        = "${aws_instance.web.public_ip}"
#     }
#   }
# }
# resource "null_resource" "copy_userdata" {
#   depends_on = [null_resource.wait_for_instance]

#   provisioner "file" {
#     source      = "${path.module}/userdata.sh"
#     destination = "/home/ec2-user/userdata.sh"
#     connection {
#       type        = "ssh"
#       user        = "ec2-user"
#       private_key = file(local_file.private_key.filename)
#       host        = aws_instance.web.public_ip
#     }
#   }
# }
# resource "null_resource" "run_userdata" {
#   depends_on = [null_resource.wait_for_instance]

#   provisioner "remote-exec" {
#     inline = [
#       "sudo chmod +x /home/ec2-user/userdata.sh",
#       "sudo /home/ec2-user/userdata.sh"
#     ]

#     connection {
#       type        = "ssh"
#       user        = "ec2-user"
#       private_key = file(local_file.private_key.filename)
#       host        = "${aws_instance.web.public_ip}"
#     }
#   }
# }


# resource "null_resource" "provision_fe" {
#   depends_on = [null_resource.wait_for_instance]

#   provisioner "file" {
#     source      = "../ibtool-fe"
#     destination = "/home/ec2-user/ibtool-fe"

#     connection {
#       type        = "ssh"
#       user        = "ec2-user"
#       private_key = file(local_file.private_key.filename)
#       host        = aws_instance.web.public_ip
#     }
#   }
# }

# resource "null_resource" "provision_be" {
#   depends_on = [null_resource.wait_for_instance]

#   provisioner "file" {
#     source      = "../ibtool-be"
#     destination = "/home/ec2-user/ibtool-be"

#     connection {
#       type        = "ssh"
#       user        = "ec2-user"
#       private_key = file(local_file.private_key.filename)
#       host        = aws_instance.web.public_ip
#     }
#   }
# }

#############################################################
##############################################################

data "aws_availability_zones" "available" {}

locals {
  region = "eu-west-3"
  name   = "ex-${basename(path.cwd)}"

  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  container_name = "ibtool"
  container_port = 80

  tags = {
    Name       = local.name
    Example    = local.name
    Repository = "https://github.com/terraform-aws-modules/terraform-aws-ecs"
  }
}

################################################################################
# Cluster
################################################################################

module "ecs_cluster" {
  source = "./modules/cluster"

  cluster_name = local.name

  # Capacity provider - autoscaling groups
  default_capacity_provider_use_fargate = false
  autoscaling_capacity_providers = {
    # On-demand instances
    ex_1 = {
      auto_scaling_group_arn         = module.autoscaling["ex_1"].autoscaling_group_arn
      managed_termination_protection = "ENABLED"

      managed_scaling = {
        maximum_scaling_step_size = 5
        minimum_scaling_step_size = 1
        status                    = "ENABLED"
        target_capacity           = 60
      }

      default_capacity_provider_strategy = {
        weight = 60
        base   = 20
      }
    }
    # Spot instances
    ex_2 = {
      auto_scaling_group_arn         = module.autoscaling["ex_2"].autoscaling_group_arn
      managed_termination_protection = "ENABLED"

      managed_scaling = {
        maximum_scaling_step_size = 15
        minimum_scaling_step_size = 5
        status                    = "ENABLED"
        target_capacity           = 90
      }

      default_capacity_provider_strategy = {
        weight = 40
      }
    }
  }

  tags = local.tags
}

################################################################################
# Service
################################################################################

# module "ecs_service" {
#   source = "./modules/service"

#   # Service
#   name        = local.name
#   cluster_arn = module.ecs_cluster.arn

#   # Task Definition
#   requires_compatibilities = ["EC2"]
#   capacity_provider_strategy = {
#     # On-demand instances
#     ex_1 = {
#       capacity_provider = module.ecs_cluster.autoscaling_capacity_providers["ex_1"].name
#       weight            = 1
#       base              = 1
#     }
#   }

#   volume = {
#     my-vol = {}
#   }

#   # Container definition(s)
#   container_definitions = {
#     (local.container_name) = {
#       image = "public.ecr.aws/ecs-sample-image/ibtool:latest"
#       port_mappings = [
#         {
#           name          = local.container_name
#           containerPort = local.container_port
#           protocol      = "tcp"
#         }
#       ]

#       mount_points = [
#         {
#           sourceVolume  = "my-vol",
#           containerPath = "/var/www/my-vol"
#         }
#       ]

#       entry_point = ["/usr/sbin/apache2", "-D", "FOREGROUND"]

#       # Example image used requires access to write to root filesystem
#       readonly_root_filesystem = false

#       enable_cloudwatch_logging              = true
#       create_cloudwatch_log_group            = true
#       cloudwatch_log_group_name              = "/aws/ecs/${local.name}/${local.container_name}"
#       cloudwatch_log_group_retention_in_days = 7

#       log_configuration = {
#         logDriver = "awslogs"
#       }
#     }
#   }

#   load_balancer = {
#     service = {
#       target_group_arn = module.alb.target_groups["ex_ecs"].arn
#       container_name   = local.container_name
#       container_port   = local.container_port
#     }
#   }

#   subnet_ids = module.vpc.private_subnets
#   security_group_rules = {
#     alb_http_ingress = {
#       type                     = "ingress"
#       from_port                = local.container_port
#       to_port                  = local.container_port
#       protocol                 = "tcp"
#       description              = "Service port"
#       source_security_group_id = module.alb.security_group_id
#     }
#   }

#   tags = local.tags
# }

################################################################################
# Supporting Resources
################################################################################

module "autoscaling" {
  source  = "terraform-aws-modules/autoscaling/aws"
  version = "~> 6.5"

  for_each = {
    # On-demand instances
    ex_1 = {
      instance_type              = "t3.large"
      use_mixed_instances_policy = false
      mixed_instances_policy     = {}
      user_data                  = <<-EOT
        #!/bin/bash

        cat <<'EOF' >> /etc/ecs/ecs.config
        ECS_CLUSTER=${local.name}
        ECS_LOGLEVEL=debug
        ECS_CONTAINER_INSTANCE_TAGS=${jsonencode(local.tags)}
        ECS_ENABLE_TASK_IAM_ROLE=true
        EOF
      EOT
    }
    # Spot instances
    ex_2 = {
      instance_type              = "t3.medium"
      use_mixed_instances_policy = true
      mixed_instances_policy = {
        instances_distribution = {
          on_demand_base_capacity                  = 0
          on_demand_percentage_above_base_capacity = 0
          spot_allocation_strategy                 = "price-capacity-optimized"
        }

        override = [
          {
            instance_type     = "m4.large"
            weighted_capacity = "2"
          },
          {
            instance_type     = "t3.large"
            weighted_capacity = "1"
          },
        ]
      }
      user_data = <<-EOT
        #!/bin/bash

        cat <<'EOF' >> /etc/ecs/ecs.config
        ECS_CLUSTER=${local.name}
        ECS_LOGLEVEL=debug
        ECS_CONTAINER_INSTANCE_TAGS=${jsonencode(local.tags)}
        ECS_ENABLE_TASK_IAM_ROLE=true
        ECS_ENABLE_SPOT_INSTANCE_DRAINING=true
        EOF
      EOT
    }
  }

  name = "${local.name}-${each.key}"

  image_id      = data.aws_ssm_parameter.ecs_optimized_ami.value
  instance_type = each.value.instance_type

  security_groups                 = [module.autoscaling_sg.security_group_id]
  user_data                       = base64encode(each.value.user_data)
  ignore_desired_capacity_changes = true

  create_iam_instance_profile = true
  iam_role_name               = local.name
  iam_role_description        = "ECS role for ${local.name}"
  iam_role_policies = {
    AmazonEC2ContainerServiceforEC2Role = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
    AmazonSSMManagedInstanceCore        = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  }

  vpc_zone_identifier = module.vpc.private_subnets
  health_check_type   = "EC2"
  min_size            = 1
  max_size            = 5
  desired_capacity    = 2

  # https://github.com/hashicorp/terraform-provider-aws/issues/12582
  autoscaling_group_tags = {
    AmazonECSManaged = true
  }

  # Required for  managed_termination_protection = "ENABLED"
  protect_from_scale_in = true

  # Spot instances
  use_mixed_instances_policy = each.value.use_mixed_instances_policy
  mixed_instances_policy     = each.value.mixed_instances_policy

  tags = local.tags
}

module "autoscaling_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"

  name        = local.name
  description = "Autoscaling group security group"
  vpc_id      = module.vpc.vpc_id

  computed_ingress_with_source_security_group_id = [
    {
      rule                     = "http-80-tcp"
      source_security_group_id = module.alb.security_group_id
    }
  ]
  number_of_computed_ingress_with_source_security_group_id = 1

  egress_rules = ["all-all"]

  tags = local.tags
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = local.name
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = local.tags
}

resource "aws_ecr_repository" "ibtool" {
  name                 = "ibtool"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = <<EOT
#!/bin/bash
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 522814712726.dkr.ecr.eu-west-3.amazonaws.com

# Build and push frontend image
cd ~/Documents/repos/ibtool-m2/ibtool-fe
docker build -t ibtool .
docker tag ibtool:latest 522814712726.dkr.ecr.eu-west-3.amazonaws.com/ibtool:ibtool-latest
docker push 522814712726.dkr.ecr.eu-west-3.amazonaws.com/ibtool:ibtool-latest

# Build and push backend image
cd ~/Documents/repos/ibtool-m2/ibtool-be
docker build -t ibtoolbe .
docker tag ibtoolbe:latest 522814712726.dkr.ecr.eu-west-3.amazonaws.com/ibtool:ibtoolbe-latest
docker push 522814712726.dkr.ecr.eu-west-3.amazonaws.com/ibtool:ibtoolbe-latest
EOT
  }
  
  depends_on = [aws_ecr_repository.ibtool]
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "ecs_task_execution_role_policy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  roles      = [aws_iam_role.ecs_task_execution_role.name]
  name       = "ecs_task_exec_policy"
}

resource "aws_ecs_service" "mongo" {
  name            = "mongo-service"
  cluster         = module.ecs_cluster.id
  task_definition = aws_ecs_task_definition.mongo.arn
  desired_count   = 1
  launch_type     = "EC2"
}

resource "aws_ecs_service" "ibtoolbe" {
  name            = "ibtoolbe-service"
  cluster         = module.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ibtoolbe.arn
  desired_count   = 1
  launch_type     = "EC2"
  depends_on = [
    aws_ecs_service.mongo
  ]
}

resource "aws_ecs_service" "ibtool" {
  name            = "ibtool-service"
  cluster         = module.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ibtool.arn
  desired_count   = 1
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = module.alb.target_groups["ex_ecs"].arn
    container_name   = "ibtool"
    container_port   = 80
  }

  depends_on = [
    aws_ecs_service.ibtoolbe
  ]
}








