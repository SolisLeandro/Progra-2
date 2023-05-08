import fs from "fs"

function loadAndProcessInstructions(inputFile) {
  // Leer el archivo de entrada y dividirlo en líneas
  const lines = inputFile.split("\n");

  // Procesar las líneas y extraer las instrucciones y argumentos
  const instructions = lines.map((line) => {
    const matches = line.match(/(\w+)\(([\d, ]+)\)/);

    if (!matches) {
      throw new Error(`Formato de instrucción inválido: ${line}`);
    }

    const instruction = matches[1];
    const args = matches[2].split(",").map((arg) => parseInt(arg.trim()));

    return { instruction, args };
  });

  return instructions;
}

function getRandomInt(min, max, randomSeed) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomSeed() * (max - min + 1) + min);
}

function generateRandomInstructions(seed, numProcesses, numOperations) {
  const randomSeed = new Math.randomSeed(seed);
  let instructions = [];
  let processTable = new Map();
  let ptrCounter = 1;

  for (let i = 0; i < numOperations; i++) {
    const availableProcesses = Array.from(processTable.keys());
    let selectedProcess;

    if (availableProcesses.length < numProcesses) {
      const newProcess = getRandomInt(1, numProcesses, randomSeed);
      if (!availableProcesses.includes(newProcess)) {
        selectedProcess = newProcess;
        processTable.set(newProcess, []);
      } else {
        selectedProcess =
          availableProcesses[
            getRandomInt(0, availableProcesses.length - 1, randomSeed)
          ];
      }
    } else {
      selectedProcess =
        availableProcesses[
          getRandomInt(0, availableProcesses.length - 1, randomSeed)
        ];
    }

    const processPtrs = processTable.get(selectedProcess);
    const operations = ["new"];

    if (processPtrs.length > 0) {
      operations.push("use", "delete");
    }

    const operation =
      operations[getRandomInt(0, operations.length - 1, randomSeed)];

    if (operation === "new") {
      const size = getRandomInt(1, 40960, randomSeed);
      instructions.push(`new(${selectedProcess}, ${size})`);
      processPtrs.push(ptrCounter);
      ptrCounter++;
    } else if (operation === "use") {
      const ptr =
        processPtrs[getRandomInt(0, processPtrs.length - 1, randomSeed)];
      instructions.push(`use(${ptr})`);
    } else if (operation === "delete") {
      const index = getRandomInt(0, processPtrs.length - 1, randomSeed);
      const ptr = processPtrs[index];
      instructions.push(`delete(${ptr})`);
      processPtrs.splice(index, 1);
    }

    if (
      i === numOperations - 1 ||
      (processTable.size === numProcesses &&
        availableProcesses.every((pid) => processTable.get(pid).length === 0))
    ) {
      availableProcesses.forEach((pid) => {
        instructions.push(`kill(${pid})`);
        processTable.delete(pid);
      });
    }
  }

  return instructions;
}

function saveInstructionsToFile(instructions, fileName) {
  fs.writeFileSync(fileName, instructions.join("\n"), "utf8");
}

module.exports = {
  getRandomInt,
  saveInstructionsToFile,
  loadAndProcessInstructions,
  generateRandomInstructions,
};
