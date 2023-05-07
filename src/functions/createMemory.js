function createMemory() {
    var memory = []

    for (let index = 0; index < 100; index++) {
        memory.push({})
    }

    return memory
}

export default createMemory