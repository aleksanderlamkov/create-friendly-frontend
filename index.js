#!/usr/bin/env node

import prompts from 'prompts'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { promisify } from 'util'
import { execSync } from 'child_process'
import degit from 'degit'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const access = promisify(fs.access)

const run = async () => {
  const { ts } = await prompts({
    type: 'confirm',
    name: 'ts',
    message: 'Use TypeScript version?',
    initial: true
  })

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name:',
    initial: 'my-app'
  })

  const repo = ts
    ? 'AleksanderLamkov/friendly-frontend-starter-ts'
    : 'AleksanderLamkov/friendly-frontend-starter'

  const targetDir = name.trim() === '.' ? process.cwd() : path.resolve(process.cwd(), name)

  // Проверим, что директория либо пуста, либо не существует
  try {
    await access(targetDir, fs.constants.F_OK)
    const files = fs.readdirSync(targetDir)
    if (files.length > 0) {
      console.error(`❌ Directory "${name}" is not empty.`)
      process.exit(1)
    }
  } catch {
    // Ок — директории не существует
  }

  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: false
  })

  console.log(`\n📦 Downloading template into "${name}"...\n`)
  await emitter.clone(targetDir)

  console.log('\n✅ Done! Now run:')
  if (name !== '.') console.log(`\n  cd ${name}`)
  console.log('  npm install')
  console.log('  npm run start\n')
}

run()
