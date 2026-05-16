export const trainingEndpoints = {
  modules: '/training/modules',
  getModule: (id: string) => `/training/modules/${id}`,
  complete: (id: string) => `/training/modules/${id}/complete`,
  myCompletions: '/training/my-completions',
  completions: '/training/completions',
  assign: (moduleId: string) => `/training/modules/${moduleId}/assign`,
} as const;

