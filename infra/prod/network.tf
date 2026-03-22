resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-vpc" })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = merge(local.base_tags, { Name = "${local.name_prefix}-igw" })
}

locals {
  public_subnet_cidrs  = { for idx, az in local.azs : az => cidrsubnet(var.vpc_cidr, 8, idx) }
  private_subnet_cidrs = { for idx, az in local.azs : az => cidrsubnet(var.vpc_cidr, 8, idx + 10) }
  db_subnet_cidrs      = { for idx, az in local.azs : az => cidrsubnet(var.vpc_cidr, 8, idx + 20) }
}

resource "aws_subnet" "public" {
  for_each = local.public_subnet_cidrs

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.key
  cidr_block              = each.value
  map_public_ip_on_launch = true

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-public-${replace(each.key, "/", "-")}" })
}

resource "aws_subnet" "private" {
  for_each = local.private_subnet_cidrs

  vpc_id            = aws_vpc.this.id
  availability_zone = each.key
  cidr_block        = each.value

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-private-${replace(each.key, "/", "-")}" })
}

resource "aws_subnet" "db" {
  for_each = local.db_subnet_cidrs

  vpc_id            = aws_vpc.this.id
  availability_zone = each.key
  cidr_block        = each.value

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-db-${replace(each.key, "/", "-")}" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-public-rt" })
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

locals {
  nat_azs = var.nat_gateway_per_az ? local.azs : [local.azs[0]]
}

resource "aws_eip" "nat" {
  for_each = toset(local.nat_azs)

  domain = "vpc"
  tags   = merge(local.base_tags, { Name = "${local.name_prefix}-nat-eip-${replace(each.key, "/", "-")}" })
}

resource "aws_nat_gateway" "this" {
  for_each = aws_eip.nat

  allocation_id = each.value.id
  subnet_id     = aws_subnet.public[each.key].id

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-nat-${replace(each.key, "/", "-")}" })

  depends_on = [aws_internet_gateway.this]
}

resource "aws_route_table" "private" {
  for_each = aws_subnet.private

  vpc_id = aws_vpc.this.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = var.nat_gateway_per_az ? aws_nat_gateway.this[each.key].id : aws_nat_gateway.this[local.azs[0]].id
  }

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-private-rt-${replace(each.key, "/", "-")}" })
}

resource "aws_route_table_association" "private" {
  for_each = aws_subnet.private

  subnet_id      = each.value.id
  route_table_id = aws_route_table.private[each.key].id
}

