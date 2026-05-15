export const trainingEndpoints = {
  modules: '/training/modules',
  getModule: (id: string) => `/training/modules/${id}`,
  complete: (id: string) => `/training/modules/${id}/complete`,
  myCompletions: '/training/my-completions',
  completions: '/training/completions',
} as const;