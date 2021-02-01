import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const VendorLogo = new FilesCollection({
    collectionName: 'VendorLogo',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});