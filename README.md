# Neoteric

Automatically updates running containers to the latest image

## Features

- Under 50 lines of code
- Small, auditable codebase
- Zero dependencies

## How it works

- Looks for running containers with label `neoteric.enabled=true`
- Pulls the `latest` tag for each container's image
- Restarts containers whose image digest differs after the pull
- Sleeps for 60 seconds (hardcoded)

## Quick start

```bash
docker run \
  --detach \
  --name neoteric \
  --restart unless-stopped \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  ghcr.io/zartdinov/neoteric:latest
```

## License

MIT
