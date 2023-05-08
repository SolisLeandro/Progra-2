export class Stopwatch {
  constructor(
    time,
    timeIncreasePerPage,
    trashingTime,
    trashingTimeIncreasePerPage
  ) {
    this.time = time;
    this.timeIncreasePerPage = timeIncreasePerPage;
    this.trashingTime = trashingTime;
    this.trashingTimeIncreasePerPage = trashingTimeIncreasePerPage;
  }

  increaseTrashingTime() {
    this.trashingTime += this.trashingTimeIncreasePerPage;
  }

  increaseTime() {
    this.time += this.timeIncreasePerPage;
  }
}

export class Page {
  constructor(id, location, physicalAddress, size) {
    this.id = id;
    this.location = location;
    this.physicalAddress = physicalAddress;
    this.size = size;
    this.usedSize = 0;
    this.referenceBit = 0; //Para el algoritmo SC
  }
}

export class MMU {
  constructor() {
    this.realMemory = new Array(100).fill(null); // 100 páginas en memoria real
    this.virtualMemory = [];
    this.memoryMap = new Map();
    this.pointerMap = new Map();
    this.nextPageId = 0;
    this.nextPtrId = 1;
    this.stopwatch = new Stopwatch(0, 1, 0, 5);
  }

  generatePageId() {
    return this.nextPageId++;
  }

  generatePrt() {
    return this.nextPtrId++;
  }

  allocatePages(pid, size) {
    const pageCount = Math.ceil(size / 4096);
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
      const id = this.generatePageId();
      const page = new Page(id, "virtual", null, 4096);
      if (size > 4096) {
        page.usedSize = 4096;
        size -= 4096;
      } else {
        page.usedSize = size;
        size = 0;
      }
      this.virtualMemory.push(page);
      pages.push(page);
    }

    const ptr = this.generatePrt();
    this.pointerMap.set(ptr, pages);
    if (this.memoryMap.has(pid)) {
      this.memoryMap.set(pid, this.memoryMap.get(pid).push(ptr));
    } else {
      this.memoryMap.set(pid, [ptr]);
    }

    for (const page of pages) {
      if (page.location === "virtual") {
        this.moveToRealMemory(page);
      }
    }

    return ptr;
  }

  new(pid, size) {
    const ptr = this.allocatePages(pid, size);
    // La función "new" devuelve la primera dirección de puntero lógico (id de la primera página)
    return ptr;
  }

  use(ptr) {
    const pages = this.pointerMap.get(ptr);
    if (!pages) {
      throw new Error(`Puntero no válido: ${ptr}`);
    }

    // Asegurarse de que las páginas estén en memoria real
    for (const page of pages) {
      if (page.location === "virtual") {
        this.moveToRealMemory(page);
      }
    }
  }

  delete(ptr) {
    const pages = this.pointerMap.get(ptr);
    if (!pages) {
      throw new Error(`Puntero no válido: ${ptr}`);
    }

    // Eliminar las páginas de memoria real y virtual
    for (const page of pages) {
      if (page.location === "real") {
        this.realMemory[page.physicalAddress] = null;
        this.stopwatch.increaseTime();
      } else {
        this.stopwatch.increaseTrashingTime();
        const index = this.virtualMemory.indexOf(page);
        this.virtualMemory.splice(index, 1);
      }
    }

    // Eliminar el puntero del mapa de memoria
    this.pointerMap.delete(ptr);
    for (const pidIter of this.memoryMap.keys()) {
      const key = pidIter.next().value();
      const index = this.memoryMap.get(key).indexOf(ptr);
      if (index !== -1) {
        this.memoryMap.set(key, this.memoryMap.get(key).splice(index, 1));
        break;
      }
    }
  }

  kill(pid) {
    const pages = this.memoryMap.get(pid);
    if (!pages) {
      throw new Error(`ID de proceso no válido: ${pid}`);
    }

    // Eliminar las páginas de memoria real y virtual y eliminar el puntero del mapa de memoria
    for (const page of pages) {
      if (page.location === "real") {
        this.stopwatch.increaseTime();
        this.realMemory[page.physicalAddress] = null;
      } else {
        this.stopwatch.increaseTrashingTime();
        const index = this.virtualMemory.indexOf(page);
        this.virtualMemory.splice(index, 1);
      }
    }
    const ptrIds = this.memoryMap.get(pid);
    for (const ptrId of ptrIds) {
      this.pointerMap.delete(ptrId);
    }
    this.memoryMap.delete(pid);
  }

  moveToRealMemory(page) {
    // Este método debe ser implementado en las subclases de MMU para cada algoritmo de paginación específico
    throw new Error(
      "moveToRealMemory debe ser implementado en la subclase específica de MMU"
    );
  }
}

export class FIFO_MMU extends MMU {
  constructor() {
    super();
    this.queue = [];
  }

  moveToRealMemory(page) {
    //Remover la pagina de la memoria virtual
    const virtualPageIndex = this.virtualMemory.indexOf(page);
    this.virtualMemory.splice(virtualPageIndex, 1);

    // Encontrar un espacio libre en la memoria real
    const freeIndex = this.realMemory.findIndex((p) => p === null);

    // Si hay espacio libre, asignamos la página a la memoria real
    if (freeIndex !== -1) {
      this.stopwatch.increaseTime();
      this.realMemory[freeIndex] = page;
      page.location = "real";
      page.physicalAddress = freeIndex;
      this.queue.push(page);
    } else {
      this.stopwatch.increaseTrashingTime();
      // Si no hay espacio libre, sacamos la página más antigua de la memoria real (FIFO)
      const oldestPage = this.queue.shift();
      const oldestPageIndex = this.realMemory.indexOf(oldestPage);

      // Mover la página más antigua a la memoria virtual
      oldestPage.location = "virtual";
      oldestPage.physicalAddress = null;
      this.virtualMemory.push(oldestPage);

      // Mover la nueva página a la memoria real
      this.realMemory[oldestPageIndex] = page;
      page.location = "real";
      page.physicalAddress = oldestPageIndex;

      // Agregar la nueva página al final de la cola
      this.queue.push(page);
    }
  }
}

export class SC_MMU extends MMU {
  constructor() {
    super();
    this.queue = [];
  }

  moveToRealMemory(page) {
    //Remover la pagina de la memoria virtual
    const virtualPageIndex = this.virtualMemory.indexOf(page);
    this.virtualMemory.splice(virtualPageIndex, 1);

    // Encontrar un espacio libre en la memoria real
    const freeIndex = this.realMemory.findIndex((p) => p === null);

    // Si hay espacio libre, asignamos la página a la memoria real
    if (freeIndex !== -1) {
      this.stopwatch.increaseTime();
      this.realMemory[freeIndex] = page;
      page.location = "real";
      page.physicalAddress = freeIndex;
      this.queue.push(page);
    } else {
      // Buscar la primera página con bit de referencia en 0
      this.stopwatch.increaseTrashingTime();
      let pageIndex = -1;
      while (pageIndex === -1) {
        const oldestPage = this.queue.shift();

        // Si el bit de referencia está en 1, le damos una segunda oportunidad
        if (oldestPage.referenceBit === 1) {
          oldestPage.referenceBit = 0;
          this.queue.push(oldestPage);
        } else {
          // Si el bit de referencia está en 0, reemplazamos la página
          pageIndex = this.realMemory.indexOf(oldestPage);

          // Mover la página más antigua a la memoria virtual
          oldestPage.location = "virtual";
          oldestPage.physicalAddress = null;
          this.virtualMemrory.push(oldestPage);

          // Mover la nueva página a la memoria real
          this.realMemory[pageIndex] = page;
          page.location = "real";
          page.physicalAddress = pageIndex;

          // Agregar la nueva página al final de la cola
          this.queue.push(page);
        }
      }
    }
  }

  // Sobreescribimos el método use() para actualizar el registro de páginas utilizadas
  use(ptr) {
    const pages = this.pointerMap.get(ptr);
    if (!pages) {
      throw new Error(`Puntero no válido: ${ptr}`);
    }

    // Asegurarse de que las páginas estén en memoria real
    for (const page of pages) {
      if (page.location === "real") {
        page.referenceBit = 1;
      } else {
        this.moveToRealMemory(page);
      }
    }
  }
}

export class MRU_MMU extends MMU {
  constructor() {
    super();
    this.lastUsed = new Array(100).fill(null);
  }

  moveToRealMemory(page) {
    //Remover la pagina de la memoria virtual
    const virtualPageIndex = this.virtualMemory.indexOf(page);
    this.virtualMemory.splice(virtualPageIndex, 1);

    // Encontrar un espacio libre en la memoria real
    const freeIndex = this.realMemory.findIndex((p) => p === null);

    // Si hay espacio libre, asignamos la página a la memoria real
    if (freeIndex !== -1) {
      this.stopwatch.increaseTime();
      this.realMemory[freeIndex] = page;
      page.location = "real";
      page.physicalAddress = freeIndex;
      this.lastUsed.unshift(page);
    } else {
      this.stopwatch.increaseTrashingTime();

      // Si no hay espacio libre, sacamos la página más recientemente utilizada de la memoria real
      let mostRecentlyUsedPage = this.lastUsed.shift();
      let mostRecentlyUsedPagePhysicalAddress =
        mostRecentlyUsedPage.physicalAddress;

      // Mover la página más recientemente utilizada a la memoria virtual
      mostRecentlyUsedPage.location = "virtual";
      mostRecentlyUsedPage.physicalAddress = null;
      this.virtualMemory.push(mostRecentlyUsedPage);

      // Mover la nueva página a la memoria real
      this.realMemory[mostRecentlyUsedPagePhysicalAddress] = page;
      page.location = "real";
      page.physicalAddress = mostRecentlyUsedPagePhysicalAddress;
      this.lastUsed.unshift(page);
    }
  }

  // Sobreescribimos el método use() para actualizar el registro de páginas utilizadas
  use(ptr) {
    const pages = this.pointerMap.get(ptr);
    if (!pages) {
      throw new Error(`Puntero no válido: ${ptr}`);
    }

    // Asegurarse de que las páginas estén en memoria real
    for (const page of pages) {
      if (page.location === "real") {
        const pageIndex = this.lastUsed.indexOf(page);
        this.lastUsed.splice(pageIndex, 1);
        this.lastUsed.unshift(page);
      } else {
        this.moveToRealMemory(page);
      }
    }
  }
}

export class RND_MMU extends MMU {
  constructor() {
    super();
  }

  moveToRealMemory(page) {
    //Remover la pagina a mover de la memoria virtual a la real
    const virtualPageIndex = this.virtualMemory.indexOf(page);
    this.virtualMemory.splice(virtualPageIndex, 1);

    // Encontrar un espacio libre en la memoria real
    const freeIndex = this.realMemory.findIndex((p) => p === null);

    // Si hay espacio libre, asignamos la página a la memoria real
    if (freeIndex !== -1) {
      this.stopwatch.increaseTime();
      this.realMemory[freeIndex] = page;
      page.location = "real";
      page.physicalAddress = freeIndex;
    } else {
      this.stopwatch.increaseTrashingTime();
      // Si no hay espacio libre, seleccionamos aleatoriamente una página para reemplazar
      const randomPageIndex = Math.floor(
        Math.random() * this.realMemory.length
      );
      const randomPage = this.realMemory[randomPageIndex];

      // Mover la página seleccionada aleatoriamente a la memoria virtual
      randomPage.location = "virtual";
      randomPage.physicalAddress = null;
      this.virtualMemory.push(randomPage);

      // Mover la nueva página a la memoria real
      this.realMemory[randomPageIndex] = page;
      page.location = "real";
      page.physicalAddress = randomPageIndex;
    }
  }
}

export class OptMMU extends MMU {
  constructor(instructions) {
    super();
    this.instructions = instructions;
  }

  moveToRealMemory(page) {
    //Remover la pagina de la memoria virtual
    const virtualPageIndex = this.virtualMemory.indexOf(page);
    this.virtualMemory.splice(virtualPageIndex, 1);

    // Si hay un espacio libre en la memoria real, coloca la página en la primera posición vacía
    const freeIndex = this.realMemory.indexOf(null);
    if (freeIndex !== -1) {
      this.realMemory[freeIndex] = page;
      page.location = "real";
      page.physicalAddress = freeIndex;
      this.stopwatch.increaseTime();
    } else {
      this.stopwatch.increaseTrashingTime();
      // De lo contrario, encuentra la página óptima para reemplazar
      const optimalIndex = this.findOptimalPageIndex();

      // Reemplazar la página óptima con la nueva página
      const replacedPage = this.realMemory[optimalIndex];
      replacedPage.location = "virtual";
      replacedPage.physicalAddress = null;
      this.virtualMemory.push(replacedPage);

      // Mover la nueva página a la memoria real
      this.realMemory[optimalIndex] = page;
      page.location = "real";
      page.physicalAddress = optimalIndex;
    }
  }

  findOptimalPageIndex() {
    let maxDistance = -1;
    let optimalIndex = -1;

    // Buscar la página con la distancia más larga hasta su próxima utilización
    for (let i = 0; i < this.realMemory.length; i++) {
      const page = this.realMemory[i];
      const distance = this.findNextUsageDistance(page);

      // Si la página no se usa en el futuro, es la óptima
      if (distance === Infinity) {
        return i;
      }

      if (distance > maxDistance) {
        maxDistance = distance;
        optimalIndex = i;
      }
    }

    return optimalIndex;
  }

  findNextUsageDistance(page) {
    const currentPageId = page.id;
    let distance = 1;

    for (
      let i = this.currentInstructionIndex;
      i < this.instructions.length;
      i++
    ) {
      const instruction = this.instructions.at(i);
      const operation = instruction.instruction;
      const target = instruction.args;

      if (operation === "use") {
        const targetPages = this.pointerMap.get(target);
        const targetPageIds = targetPages.map((page) => page.id);

        if (targetPageIds.includes(currentPageId)) {
          return distance;
        }
      }

      distance++;
    }

    // Si la página no se usa en el futuro, devuelve Infinity
    return Infinity;
  }
}
