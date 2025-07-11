#!/usr/bin/env node

import prompts from 'prompts'
import path from 'path'
import { existsSync, readdirSync, rmSync } from 'fs'
import degit from 'degit'

const run = async () => {
  const { useTS } = await prompts({
    type: 'select',
    name: 'useTS',
    message: 'Choose a template:',
    choices: [
      { title: 'JavaScript', value: false },
      { title: 'TypeScript', value: true },
    ],
    initial: 0
  })

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Project name (or "." to use current directory):',
    placeholder: 'my-app',
    validate: name => name.trim().length ? true : 'Please enter a project name.'
  })

  const repo = useTS
    ? 'AleksanderLamkov/friendly-frontend-starter-ts'
    : 'AleksanderLamkov/friendly-frontend-starter'

  const targetDir = name.trim() === '.' ? process.cwd() : path.resolve(process.cwd(), name)

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    const { action } = await prompts({
      type: 'select',
      name: 'action',
      message: `Directory "${name}" is not empty. How would you like to proceed?`,
      choices: [
        { title: '❌ Cancel installation', value: 'cancel' },
        { title: '🧹 Remove all files and continue', value: 'clear' },
        { title: '✅ Keep files and continue', value: 'keep' }
      ]
    })

    if (action === 'cancel') {
      console.log('🚫 Operation cancelled.')
      process.exit(0)
    }

    if (action === 'clear') {
      const files = readdirSync(targetDir)
      for (const file of files) {
        if (file === '.git') continue
        rmSync(path.join(targetDir, file), { recursive: true, force: true })
      }
      console.log('🧹 Cleared directory.')
    }
  }

  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: false
  })

  const visibleName = name.trim() === '.' ? path.basename(targetDir) : name
  console.log(`\n📦 Downloading template into "${visibleName}"...\n`)

  try {
    await emitter.clone(targetDir)
    console.log(`📁 Project created in: ${targetDir}`)
  } catch (err) {
    console.error(`❌ Failed to clone template: ${err.message}`)
    process.exit(1)
  }

  console.log('🚀 Installing dependencies...\n')

  console.log('\n✅ Done! Now run:')

  if (name.trim() !== '.') {
    console.log(`\n  cd ${name}`)
  }

  console.log('  npm install')
  console.log('  npm run start\n')
}

run()
