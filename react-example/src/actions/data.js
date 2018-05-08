import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started');
export const LogicLoaded = createAction('Data - Logic File Loaded');
export const DialogueLoaded = createAction('Data - Dialogue File Loaded');
export const SourceMapLoaded = createAction('Data - SourceMap File Loaded');
export const ErrorLoading = createAction('Data - Error Loading File');
export const Unrecognized = createAction('Data - Unrecognized File');