resource "aws_ecs_task_definition" "mongo" {
  family                   = "mongo-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([{
    name      = "mongo"
    image     = "mongo"
    essential = true
    memory    = 512
    cpu       = 256
    portMappings = [{
      containerPort = 27017
      hostPort      = 27017
    }]
    environment = [
      {
        name  = "MONGO_INITDB_ROOT_USERNAME"
        value = "ibtool"
      },
      {
        name  = "MONGO_INITDB_ROOT_PASSWORD"
        value = "iBeeTim!"
      },
      {
        name  = "MONGO_INITDB_DATABASE"
        value = "ibtool"
      }
    ]
    mountPoints = [{
      sourceVolume = "db"
      containerPath = "/data/db"
    }]
  }])
  volume {
    name      = "db"
    host_path = "/root/ibtool/db"
  }
}

resource "aws_ecs_task_definition" "ibtoolbe" {
  family                   = "ibtoolbe-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([{
    name      = "ibtoolbe"
    image     = "${aws_ecr_repository.ibtool.repository_url}:ibtoolbe-latest"
    essential = true
    memory    = 512
    cpu       = 256
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
  }])
}
# resource "aws_ecs_task_definition" "ibtool" {
#   family                   = "ibtool-task"
#   network_mode             = "awsvpc"
#   requires_compatibilities = ["FARGATE"]
#   execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
#   cpu                      = "256"  # Set CPU at the task level
#   memory                   = "512"  # Set Memory at the task level

#   container_definitions = jsonencode([{
#     name      = "ibtool"
#     image     = "${aws_ecr_repository.ibtool.repository_url}:ibtool-latest"
#     essential = true
#     portMappings = [{
#       containerPort = 8090
#       protocol      = "tcp"
#     }]
#   }])
# }

resource "aws_ecs_task_definition" "ibtool" {
  family                   = "ibtool-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([{
    name      = "ibtool"
    image     = "${aws_ecr_repository.ibtool.repository_url}:ibtool-latest"
    essential = true
    memory    = 512
    cpu       = 256
    portMappings = [{
      containerPort = 80
      hostPort      = 80
      protocol      = "tcp"
    }]
  }])
}


 



