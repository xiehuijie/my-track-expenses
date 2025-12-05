import { describe, it, expect } from 'vitest';
import { MediaType, StorageErrorCode, getMediaTypeFromMime, getExtensionFromMime } from '../storage/types';

describe('Storage Types', () => {
    describe('MediaType enum', () => {
        it('should have all media types defined', () => {
            expect(MediaType.IMAGE).toBe('image');
            expect(MediaType.VIDEO).toBe('video');
            expect(MediaType.AUDIO).toBe('audio');
            expect(MediaType.OTHER).toBe('other');
        });
    });

    describe('StorageErrorCode enum', () => {
        it('should have all error codes defined', () => {
            expect(StorageErrorCode.NOT_FOUND).toBe('NOT_FOUND');
            expect(StorageErrorCode.INVALID_TYPE).toBe('INVALID_TYPE');
            expect(StorageErrorCode.QUOTA_EXCEEDED).toBe('QUOTA_EXCEEDED');
            expect(StorageErrorCode.PERMISSION_DENIED).toBe('PERMISSION_DENIED');
            expect(StorageErrorCode.IO_ERROR).toBe('IO_ERROR');
            expect(StorageErrorCode.INVALID_INPUT).toBe('INVALID_INPUT');
            expect(StorageErrorCode.NOT_INITIALIZED).toBe('NOT_INITIALIZED');
            expect(StorageErrorCode.UNKNOWN).toBe('UNKNOWN');
        });
    });

    describe('getMediaTypeFromMime', () => {
        it('should return IMAGE for image MIME types', () => {
            expect(getMediaTypeFromMime('image/jpeg')).toBe(MediaType.IMAGE);
            expect(getMediaTypeFromMime('image/png')).toBe(MediaType.IMAGE);
            expect(getMediaTypeFromMime('image/gif')).toBe(MediaType.IMAGE);
            expect(getMediaTypeFromMime('image/webp')).toBe(MediaType.IMAGE);
            expect(getMediaTypeFromMime('image/svg+xml')).toBe(MediaType.IMAGE);
        });

        it('should return VIDEO for video MIME types', () => {
            expect(getMediaTypeFromMime('video/mp4')).toBe(MediaType.VIDEO);
            expect(getMediaTypeFromMime('video/webm')).toBe(MediaType.VIDEO);
            expect(getMediaTypeFromMime('video/ogg')).toBe(MediaType.VIDEO);
            expect(getMediaTypeFromMime('video/quicktime')).toBe(MediaType.VIDEO);
        });

        it('should return AUDIO for audio MIME types', () => {
            expect(getMediaTypeFromMime('audio/mpeg')).toBe(MediaType.AUDIO);
            expect(getMediaTypeFromMime('audio/ogg')).toBe(MediaType.AUDIO);
            expect(getMediaTypeFromMime('audio/wav')).toBe(MediaType.AUDIO);
            expect(getMediaTypeFromMime('audio/webm')).toBe(MediaType.AUDIO);
        });

        it('should return OTHER for unrecognized MIME types', () => {
            expect(getMediaTypeFromMime('application/pdf')).toBe(MediaType.OTHER);
            expect(getMediaTypeFromMime('text/plain')).toBe(MediaType.OTHER);
            expect(getMediaTypeFromMime('application/json')).toBe(MediaType.OTHER);
            expect(getMediaTypeFromMime('unknown/type')).toBe(MediaType.OTHER);
        });
    });

    describe('getExtensionFromMime', () => {
        it('should return correct extension for image types', () => {
            expect(getExtensionFromMime('image/jpeg')).toBe('.jpg');
            expect(getExtensionFromMime('image/png')).toBe('.png');
            expect(getExtensionFromMime('image/gif')).toBe('.gif');
            expect(getExtensionFromMime('image/webp')).toBe('.webp');
        });

        it('should return correct extension for video types', () => {
            expect(getExtensionFromMime('video/mp4')).toBe('.mp4');
            expect(getExtensionFromMime('video/webm')).toBe('.webm');
            expect(getExtensionFromMime('video/quicktime')).toBe('.mov');
        });

        it('should return correct extension for audio types', () => {
            expect(getExtensionFromMime('audio/mpeg')).toBe('.mp3');
            expect(getExtensionFromMime('audio/ogg')).toBe('.ogg');
            expect(getExtensionFromMime('audio/wav')).toBe('.wav');
        });

        it('should return correct extension for other types', () => {
            expect(getExtensionFromMime('application/pdf')).toBe('.pdf');
            expect(getExtensionFromMime('application/json')).toBe('.json');
            expect(getExtensionFromMime('text/plain')).toBe('.txt');
        });

        it('should return empty string for unknown types', () => {
            expect(getExtensionFromMime('unknown/type')).toBe('');
            expect(getExtensionFromMime('application/unknown')).toBe('');
        });
    });
});
