export interface Notification {
    id?: number;
    type: 'LOW_STOCK' | 'NEW_WORK_ORDER';
    message: string;
    timestamp: Date;
    isRead: boolean;
    relatedEntityId?: number;
    relatedEntityType?: string;
} 