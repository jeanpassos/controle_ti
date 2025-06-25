import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

// Estendendo os matchers do expect do Vitest com os do jest-dom
expect.extend(matchers)

// Limpar automaticamente depois de cada teste
afterEach(() => {
  cleanup()
})
