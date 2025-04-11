import { Node, Edge } from 'reactflow';

export type MessageType = 'text' | 'mcd';

export interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  type: MessageType;
  text?: string;
  nodes?: Node[];
  edges?: Edge[];
  loading?: boolean;
}
