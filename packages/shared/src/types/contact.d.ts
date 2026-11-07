export type MessageStatus = 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: MessageStatus;
    createdAt: string;
}
export interface ContactFormData {
    name: string;
    email: string;
    subject?: string;
    message: string;
}
//# sourceMappingURL=contact.d.ts.map