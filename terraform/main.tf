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
  vpc                       = true
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

}

resource "null_resource" "wait_for_instance" {
  depends_on = [aws_eip.ibtool_eip, aws_instance.web, local_file.private_key]

  provisioner "remote-exec" {
    inline = [
      "echo Instance is ready"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(local_file.private_key.filename)
      host        = aws_instance.web.public_ip
    }
  }
}

resource "null_resource" "provision_fe" {
  depends_on = [null_resource.wait_for_instance]

  provisioner "file" {
    source      = "../ibtool-fe"
    destination = "/home/ec2-user/ibtool-fe"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(local_file.private_key.filename)
      host        = aws_instance.web.public_ip
    }
  }
}

resource "null_resource" "provision_be" {
  depends_on = [null_resource.wait_for_instance]

  provisioner "file" {
    source      = "../ibtool-be"
    destination = "/home/ec2-user/ibtool-be"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(local_file.private_key.filename)
      host        = aws_instance.web.public_ip
    }
  }
}

resource "null_resource" "run_userdata" {
  depends_on = [null_resource.provision_fe, null_resource.provision_be]

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ec2-user/userdata.sh",
      "/home/ec2-user/userdata.sh"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(local_file.private_key.filename)
      host        = aws_instance.web.public_ip
    }
  }
}
