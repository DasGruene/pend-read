/// <reference lib="webworker" />
import {
    ApplicationBehaviors,
    ApplicationNode, OptionalPromise,
    registerApplicationBehavior,
    ScriptBuilder
} from '@universal-robots/contribution-api';
import { PendantReaderNode } from './PendantReader.node';

// factory is required
const createApplicationNode = (): OptionalPromise<PendantReaderNode> => ({
    type: 'dasg-pend-read-pendantreader',    // type is required
    version: '1.0.0',     // version is required
    parameters: {
        page: 1,
        isLoaded: false,
        selectedFile: null,
        searchText: "",
      },
});

// generatePreamble is optional
const generatePreambleScriptCode = (node: PendantReaderNode): OptionalPromise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    return builder;
};

// upgradeNode is optional
const upgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: PendantReaderNode): PendantReaderNode =>
      defaultNode;

// downgradeNode is optional
const downgradeApplicationNode
  = (loadedNode: ApplicationNode, defaultNode: PendantReaderNode): PendantReaderNode =>
      defaultNode;

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
    upgradeNode: upgradeApplicationNode,
    downgradeNode: downgradeApplicationNode
};

registerApplicationBehavior(behaviors);
