export interface TrainingModule {
  id: string;
  associationId: string;
  title: string;
  description: string | null;
  content: string;
  requiredForRoles: string[];
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TrainingCompletion {
  id: string;
  userId: string;
  moduleId: string;
  completedAt: string | Date;
  data: Record<string, unknown>;
}

export interface TrainingCompletionWithUser extends TrainingCompletion {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  module: {
    id: string;
    title: string;
  };
}

export interface TrainingCompletionWithModule extends TrainingCompletion {
  module: TrainingModule;
}

export interface CreateTrainingModuleInput {
  title: string;
  description?: string | null;
  content: string;
  requiredForRoles: string[];
  isActive?: boolean;
}

export interface UpdateTrainingModuleInput {
  title?: string;
  description?: string | null;
  content?: string;
  requiredForRoles?: string[];
  isActive?: boolean;
}

export interface CompleteTrainingInput {
  data?: Record<string, unknown>;
}