const call = async (path, options = {}) =>
    await fetch(`http://localhost${path}`, { unix: '/var/run/docker.sock', ...options  })

const list = async () => 
    await (await call('/containers/json?filters={"status":["running"],"label":["neoteric.enabled=true"]}')).json()

const inspect = async (image) => 
    await (await call(`/images/${image}/json`)).json()

const restart = async (containerId) =>
    await call(`/containers/${containerId}/restart`, { method: 'POST' })

const pull = async (image) => {
    const response = await call(`/images/create?fromImage=${encodeURIComponent(image)}&tag=latest`, {
        method: 'POST',
    })
    const text = await response.text()
    const lines = text.trim().split('\n')
    for (const line of lines) {
        const json = JSON.parse(line)
        if (json.status) {
            console.log(`🐳 ${json.status}${json.progress ? ' ' + json.progress : ''}`)
        }
    }
}

const main = async () => {
    console.log(`🤖 Looking for containers`)
    const containers = await list()
    for (const container of containers) {
        console.log(`📦 Container: ${container.Id}`)
        await pull(container.Image)
        const image = await inspect(container.Image)
        if (container.ImageID !== image.Id) {
            console.log(`🚀 Restarting container: ${container.Id}`)
            await restart(container.Id)
            console.log(`✅ Container restarted successfully`)
        }
    }
    console.log(`😴 Sleeping for 60 seconds`)
}

setInterval(main, 60 * 1000)

main()
