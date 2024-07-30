## Project Title

# Deploy-a-web-server-on-aws-using-terraform

The "Deploy-a-web-server-on-aws-using-terraform" project focuses on automating the deployment process of a web server on AWS using Terraform. By leveraging Terraform's infrastructure as code capabilities, the project simplifies the provisioning and management of AWS resources required for hosting a web server.

The main goal of the project is to provide a streamlined and scalable solution for deploying a web server on AWS. It achieves this by utilizing Terraform to define and manage the infrastructure components, such as EC2 instances, security groups, networking configurations, and other necessary resources.

With the project's infrastructure as code approach, developers can easily version and reproduce the deployment across different environments. This ensures consistency and reduces the chances of errors or configuration discrepancies.

Key features of the project include:

Infrastructure as Code: The project utilizes Terraform to define the AWS resources required for hosting the web server. This allows for declarative and version-controlled infrastructure provisioning.

Automated Deployment: By using Terraform, the project enables automated deployment of the web server infrastructure, saving time and effort for developers.

Scalability and Flexibility: The project supports scalability by allowing developers to easily adjust the resources allocated to the web server as needed. Additionally, it provides flexibility to integrate with other AWS services and extend the functionality of the web server.

Simplified Configuration: With Terraform, the project simplifies the configuration process by providing a centralized and standardized approach to defining the infrastructure components. This eliminates the need for manual setup and reduces the chances of configuration errors.

Reproducibility: The infrastructure configurations defined in Terraform can be easily shared, versioned, and reproduced across different environments. This ensures consistency and makes the deployment process more reliable.

Overall, the "Deploy-a-web-server-on-aws-using-terraform" project offers an automated and scalable solution for deploying web servers on AWS. By leveraging the power of Terraform, it simplifies the provisioning and management of AWS resources, providing a streamlined and efficient deployment process.
Key Features and Functionalities:

## Prerequisites

- AWS account
- Terraform installed
- Proper AWS permissions

## Project Structure

Explain the structure of your project, highlighting important directories and files. Mention the key Terraform files that users need to be aware of:

#### resources.tf: Defines the Terraform resources required for the project.

#### outputs.tf: Specifies the outputs that users can access after provisioning the infrastructure.

#### variables.tf (optional): Lists the input variables that can be customized by users.

#### user.sh: runs a bash script after instance have been created

## Requirements

| Name                                                   | Version |
| ------------------------------------------------------ | ------- |
| <a name="requirement_aws"></a> [aws](#requirement_aws) | 4.67.0  |

## Providers

| Name                                             | Version |
| ------------------------------------------------ | ------- |
| <a name="provider_aws"></a> [aws](#provider_aws) | 4.67.0  |

## Modules

No modules.

## Resources

| Name                                                                                                                                            | Type     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| [aws_eip.ibtool_eip](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/eip)                                           | resource |
| [aws_instance.web](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/instance)                                        | resource |
| [aws_internet_gateway.ibtool_IGW](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/internet_gateway)                 | resource |
| [aws_network_interface.ibtool_net_interface](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/network_interface)     | resource |
| [aws_route.ibtool_route](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/route)                                     | resource |
| [aws_route_table.ibtool_route_table](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/route_table)                   | resource |
| [aws_route_table_association.ibtool_assoc](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/route_table_association) | resource |
| [aws_security_group.ibtool_SG](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/security_group)                      | resource |
| [aws_subnet.ibtool_subnet](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/subnet)                                  | resource |
| [aws_vpc.ibtool_vpc](https://registry.terraform.io/providers/hashicorp/aws/4.67.0/docs/resources/vpc)                                           | resource |

## Inputs

| Name                                                                                   | Description                                                               | Type     | Default                   | Required |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------- | ------------------------- | :------: |
| <a name="input_ami"></a> [ami](#input_ami)                                             | The ID of the Amazon Machine Image (AMI) used to create the EC2 instance. | `string` | `"ami-0261755***b8c4a84"` |    no    |
| <a name="input_availability_zone_a"></a> [availability_zone](#input_availability_zone) | The availability zone where the resources will reside.                    | `string` | `"us-east-1a"`            |    no    |
| <a name="input_instance_type"></a> [instance_type](#input_instance_type)               | The type of EC2 instance used to create the instance.                     | `string` | `"t2.micro"`              |    no    |
| <a name="input_region"></a> [region](#input_region)                                    | The AWS region in which the resources will be created.                    | `string` | `"us-east-1"`             |    no    |

## Outputs

| Name                                                                                      | Description                           |
| ----------------------------------------------------------------------------------------- | ------------------------------------- |
| <a name="output_IGW_id"></a> [IGW_id](#output_IGW_id)                                     | internet gateway id                   |
| <a name="output_SG_id"></a> [SG_id](#output_SG_id)                                        | security group id                     |
| <a name="output_eip"></a> [eip](#output_eip)                                              | public Ip of eip                      |
| <a name="output_instance_id"></a> [instance_id](#output_instance_id)                      | ID of the EC2 instance                |
| <a name="output_instance_public_ip"></a> [instance_public_ip](#output_instance_public_ip) | Public IP address of the EC2 instance |
| <a name="output_routetable_id"></a> [routetable_id](#output_routetable_id)                | route table id                        |
| <a name="output_subnet_id"></a> [subnet_id](#output_subnet_id)                            | private ip(subnet)                    |
| <a name="output_vpc_id"></a> [vpc_id](#output_vpc_id)                                     | vpc id                                |

## Getting Started

Provide step-by-step instructions on how to get started with your project, including:

1. Clone the repository:

   ```shell
   git clone https://github.com/Gris1109/Deploy-a-web-server-on-aws-using-terraform.git
   cd Deploy-a-web-server-on-aws-using-terraform

   ```

2. Configure AWS credentials:

   Create an AWS access key and secret key.
   Configure the AWS CLI with your credentials.

3. Edit configuration files:

   access key and secret key should be configured into the provider.tf, if aws cli is installed on the host server the default profile could be used.
   change the user_data.sh permession to be executable using "sudo chmod +x user_data.sh"

4. Deploy the infrastructure:

   terraform init, terraform plan, and terraform apply.

## Usage

Accessing the Web Server:

Retrieve the public IP address of the EC2 instance. This information should be available in the Terraform output or in the AWS Management Console.
Open a web browser and enter the public IP address in the address bar.
If everything is configured correctly, you should be able to access your web server and view your website.

SSH into the Instance:

Open a terminal or command prompt on your local machine.
Change directory to the location where your private key file (usually a .pem file) is stored.
Set the appropriate permissions for your private key file using the following command:

    chmod 400 <private-key-file.pem>

SSH into the EC2 instance using the following command, replacing <public-ip> with the public IP address of the instance and <private-key-file.pem> with the filename of your private key file:

    ssh -i <private-key-file.pem> ec2-user@<public-ip>

Note: The username (ec2-user) may vary depending on the Amazon Machine Image (AMI) used for your EC2 instance. For some AMIs, the username could be ubuntu, admin, or root.
If the SSH connection is successful, you will be logged into the EC2 instance and can execute commands or perform any necessary administrative tasks.

## Troubleshooting

Address common issues or errors that users may encounter and provide troubleshooting tips or solutions.

## Contributing

Explain how users can contribute to your project if desired. Include information about pull requests, issue tracking, and any contribution guidelines you may have.

## License

Specify the license under which your project is distributed.

## References

Include references to relevant documentation, tutorials, or external resources that users may find helpful.
Acknowledgments

Optionally, acknowledge any individuals or resources that have contributed to the project.

## Troubleshooting, Contributing, and License

Include sections for troubleshooting, contributing guidelines, and information about the project's license, as needed.
