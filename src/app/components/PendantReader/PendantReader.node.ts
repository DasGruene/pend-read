import { ApplicationNode } from '@universal-robots/contribution-api';

export interface PendantReaderNode extends ApplicationNode {
  type: string;
  version: string;
}
