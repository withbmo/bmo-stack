resource "aws_ec2_transit_gateway" "this" {
  description                     = "Pytholit demo transit gateway"
  default_route_table_association = "enable"
  default_route_table_propagation = "enable"

  tags = merge(var.tags, { Name = "demo-tgw" })
}

resource "aws_ec2_transit_gateway_vpc_attachment" "services" {
  subnet_ids         = var.services_private_subnet_ids
  transit_gateway_id = aws_ec2_transit_gateway.this.id
  vpc_id             = var.services_vpc_id

  tags = merge(var.tags, { Name = "services-tgw-attachment" })
}

resource "aws_ec2_transit_gateway_vpc_attachment" "envs" {
  subnet_ids         = var.envs_private_subnet_ids
  transit_gateway_id = aws_ec2_transit_gateway.this.id
  vpc_id             = var.envs_vpc_id

  tags = merge(var.tags, { Name = "envs-tgw-attachment" })
}

resource "aws_route" "services_to_envs" {
  count = length(var.services_private_route_table_ids)

  route_table_id         = var.services_private_route_table_ids[count.index]
  destination_cidr_block = var.envs_vpc_cidr
  transit_gateway_id     = aws_ec2_transit_gateway.this.id
}

resource "aws_route" "envs_to_services" {
  count = length(var.envs_private_route_table_ids)

  route_table_id         = var.envs_private_route_table_ids[count.index]
  destination_cidr_block = var.services_vpc_cidr
  transit_gateway_id     = aws_ec2_transit_gateway.this.id
}

output "transit_gateway_id" {
  value = aws_ec2_transit_gateway.this.id
}
