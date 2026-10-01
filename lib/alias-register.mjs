import fs from 'node:fs'
import path from 'node:path'
import { registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

function withExtension(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]
  return candidates.find((candidate) => fs.existsSync(candidate))
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const found = withExtension(path.join(root, specifier.slice(2)))
      if (!found) throw new Error(`Cannot resolve ${specifier}`)
      return nextResolve(pathToFileURL(found).href, context)
    }
    if ((specifier.startsWith('./') || specifier.startsWith('../')) && !path.extname(specifier) && context.parentURL) {
      const found = withExtension(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier))
      if (found) return nextResolve(pathToFileURL(found).href, context)
    }
    return nextResolve(specifier, context)
  },
})
