export class WebAssemblyHelper {
  /**
   * Initializing a WebAssembly module while its bytes are still being fetched over network
   * provides a load-time performance gain. This contrasts with JavaScript parsing, which cannot
   * begin until the entire module has been fetched.
   */
  public static initialize(moduleName: string, imports: WebAssembly.ModuleImports): Promise<WebAssembly.Module> {
    const request = fetch(moduleName);
    return WebAssembly.instantiateStreaming(request, { imports });
  }

  public static listImports(module: WebAssembly.Module): WebAssembly.ModuleImportDescriptor[] {
    return WebAssembly.Module.imports(module);
  }

  public static listExports(module: WebAssembly.Module): WebAssembly.ModuleExportDescriptor[] {
    return WebAssembly.Module.exports(module)
  }

  public static createMemoryBlock(initial = 1, maximum?: number): WebAssembly.Memory {
    return new WebAssembly.Memory({ initial, maximum });
  }
}
