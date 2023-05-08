import { OptMMU, FIFO_MMU, SC_MMU, MRU_MMU, RND_MMU } from "./classes.js";

import { loadAndProcessInstructions } from "./functions.js";

class MMU_Simulation {
  constructor(MMUtoExecute, randomSeed, sleepTime) {
    this.MMUtoExecute = MMUtoExecute;
    this.randomSeed = randomSeed;
    this.sleepTime = sleepTime;
    this.numProcesses = 0;
    this.numOperations = 0;
    this.isPaused = false;
    this.optMMU = null;
    this.otherMMU = null;
    this.instructions = null;
    this.instructionsString = null;
  }

  setGenerateRandomInstructions(numProcesses, numOperations) {
    this.numProcesses = numProcesses;
    this.numOperations = numOperations;
  }

  setInstructionsString(instructionsString) {
    this.instructionsString = instructionsString;
  }

  pauseExecution() {
    this.isPaused = true;
  }

  resumeExecution() {
    this.isPaused = false;
  }

  iniciate() {
    //const instructionsString = Elige entre si generar las instrucciones o leerlas de un archivo. Recuerde que si las genera tiene que usar la función "saveInstructionsToFile" para guardarlo en un txt
    this.instructions = loadAndProcessInstructions(this.instructionsString);

    this.optMMU = new OptMMU(this.instructions);

    switch (this.MMUtoExecute) {
      case "FIFO":
        this.otherMMU = new FIFO_MMU();
        break;
      case "SC":
        this.otherMMU = new SC_MMU();
        break;
      case "MRU":
        this.otherMMU = new MRU_MMU();
        break;
      case "RND":
        this.otherMMU = new RND_MMU();
        break;
      default:
        throw new Error(`MMU desconocido: ${this.MMUtoExecute}`);
    }

    //Le toca pegar la funcion "executeInstruction" como metodo del objeto y ni idea de como :v
    //Luego de eso aqui solo tiene que llamar aca a la funcion de main y recuerde que los parametros que ocupa para esas funciones son atributos de este objeto
  }

  async executeInstruction(instruction, mmu, sleepTime) {
    await new Promise((resolve) => {
      if (this.isPaused) {
        const checkInterval = setInterval(() => {
          if (!this.isPaused) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 1000);
      } else {
        setTimeout(resolve, sleepTime * 1000);
      }
    });

    const { instruction: instr, args } = instruction;
    switch (instr) {
      case "new":
        if (mmu === 1) {
          this.optMMU.new(...args);
        } else {
          this.otherMMU.new(...args);
        }
        break;
      case "use":
        if (mmu === 1) {
          this.optMMU.use(...args);
        } else {
          this.otherMMU.use(...args);
        }
        break;
      case "delete":
        if (mmu === 1) {
          this.optMMU.delete(...args);
        } else {
          this.otherMMU.delete(...args);
        }
        break;
      case "kill":
        if (mmu === 1) {
          this.optMMU.kill(...args);
        } else {
          this.otherMMU.kill(...args);
        }
        break;
      default:
        throw new Error(`Instrucción desconocida: ${instr}`);
    }
  }
}

export default MMU_Simulation;
