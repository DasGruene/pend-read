import { ApplicationNode } from '@universal-robots/contribution-api';

export interface PendantReaderNode extends ApplicationNode {
  type: string;
  version: string;
  parameters: {
    page: number;
    isLoaded: boolean;
    selectedFile: File | null;
    searchText: string;
  };
}
