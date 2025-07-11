#!/usr/bin/env node

import { execSync } from 'child_process'
import prompts from 'prompts'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const run = async () => {
  const { ts } = await prompts({
    type: 'confirm',
    name: 'ts',
    message: 'Use TypeScript version?',
    initial: true
  })

  const repo = ts
    ? 'https://github.com/AleksanderLamkov/friendly-frontend-starter-ts'
    : 'https://github.com/AleksanderLamkov/friendly-frontend-starter'

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name:',
    initial: 'my-app'
  })

  execSync(`git clone ${repo} ${name}`, { stdio: 'inherit' })
  execSync(`rm -rf ${name}/.git`, { stdio: 'inherit' })

  console.log('\n✅ Done! Now run:')
  console.log(`\n  cd ${name}`)
  console.log('  npm install')
  console.log('  npm run start\n')
}

run()
