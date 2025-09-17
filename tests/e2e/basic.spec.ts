import { test, expect } from '@playwright/test'

test.describe('TabZen Extension Basic Tests', () => {
  test('should have valid manifest.json', async () => {
    // Simple test to validate our manifest exists and has basic structure
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const manifestPath = path.resolve(process.cwd(), 'manifest.json')
    const manifestContent = await fs.readFile(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)
    
    // Validate basic manifest structure
    expect(manifest.manifest_version).toBe(3)
    expect(manifest.name).toBe('TabZen')
    expect(manifest.version).toBeDefined()
    expect(manifest.permissions).toContain('tabs')
    expect(manifest.permissions).toContain('storage')
    expect(manifest.action.default_popup).toBe('popup/index.html')
  })

  test('should have built extension files', async () => {
    // Check that build produces the expected files
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const distPath = path.resolve(process.cwd(), 'dist')
    
    try {
      await fs.access(distPath)
      
      // Check for key files
      const popupHtml = path.join(distPath, 'extension/popup/index.html')
      const optionsHtml = path.join(distPath, 'extension/options/index.html')
      const backgroundJs = path.join(distPath, 'background.js')
      const contentJs = path.join(distPath, 'content.js')
      
      await fs.access(popupHtml)
      await fs.access(optionsHtml) 
      await fs.access(backgroundJs)
      await fs.access(contentJs)
      
      expect(true).toBe(true) // Tests passed if we get here
    } catch (error) {
      throw new Error(`Build files not found: ${error}`)
    }
  })
})