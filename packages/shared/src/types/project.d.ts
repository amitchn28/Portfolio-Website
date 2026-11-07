export type ProjectCategory = 'FULL_STACK' | 'AI_ML' | 'FRONTEND' | 'MOBILE' | 'OPEN_SOURCE';
export interface Project {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    content?: string;
    category: ProjectCategory;
    tags: string[];
    thumbnailUrl: string;
    bannerUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ProjectCreateInput {
    title: string;
    subtitle: string;
    description: string;
    content?: string;
    category: ProjectCategory;
    tags: string[];
    thumbnailUrl: string;
    bannerUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
    published?: boolean;
    order?: number;
}
//# sourceMappingURL=project.d.ts.map