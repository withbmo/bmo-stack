FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    jq \
    pkg-config \
    postgresql-client \
    python3 \
    python3-dev \
    python3-pip \
    python3-venv \
    redis-tools \
    unzip \
  && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=/usr/local/bin sh \
  && corepack enable \
  && corepack prepare pnpm@9.15.4 --activate

ENV PNPM_HOME=/home/vscode/.local/share/pnpm
ENV PATH=${PNPM_HOME}:/usr/local/bin:${PATH}
