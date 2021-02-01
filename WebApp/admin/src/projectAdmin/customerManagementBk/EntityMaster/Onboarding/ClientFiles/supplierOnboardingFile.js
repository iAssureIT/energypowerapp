import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const SupplierFile = new FilesCollection({
    collectionName: 'SupplierFile',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});