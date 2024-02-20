import path from "path";
import readline from "readline";
const WRITE_CHUNK_SIZE = parseInt(process.env.WRITE_CHUNK_SIZE, 10);

const PREFIX = "__elixirnodejs__UOSBsDUP6bp9IF5__";

async function getResponse(string) {
  try {
    console.log(string);
    const [[moduleName, funcName], args] = JSON.parse(string);
    const module = await import(moduleName);

    const result = await module[funcName](...args);

    //return JSON.stringify([false, "Hello from node.js"]);
    return JSON.stringify([true, result]);
  } catch ({ message, stack }) {
    return JSON.stringify([false, `${message}\n${stack}`]);
  }
}

async function onLine(string) {
  const buffer = Buffer.from(`${await getResponse(string)}\n`);

  // The function we called might have written something to stdout without starting a new line.
  // So we add one here and write the response after the prefix
  process.stdout.write("\n");
  process.stdout.write(PREFIX);
  for (let i = 0; i < buffer.length; i += WRITE_CHUNK_SIZE) {
    let chunk = buffer.slice(i, i + WRITE_CHUNK_SIZE);

    process.stdout.write(chunk);
  }
}

function startServer() {
  process.stdin.on("end", () => process.exit());

  const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  readLineInterface.on("line", onLine);
}

startServer();
