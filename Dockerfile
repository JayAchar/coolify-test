# Stage 1: Build
FROM node:18-alpine AS base 

# setup pnpm 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

COPY . /usr/src/app
# Set working directory
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api

FROM base AS api 
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000 
CMD [ "pnpm", "start" ]


