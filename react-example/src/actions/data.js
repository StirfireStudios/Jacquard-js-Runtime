import { createAction } from 'redux-act';

export const LoadStarted = createAction('Data - Load Started');
export const LogicLoaded = createAction('Data - Logic File Loaded', (fileName, stream) => ({fileName, stream}));
export const DialogueLoaded = createAction('Data - Dialogue File Loaded', (fileName, stream) => ({fileName, stream}));
export const SourceMapLoaded = createAction('Data - SourceMap File Loaded', (fileName, stream) => ({fileName, stream}));
export const ErrorLoading = createAction('Data - Error Loading File', (fileName, error) => ({fileName, error}));