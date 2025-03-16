import React from 'react';
import {
    ArchiveBoxIcon,
    CodeBracketIcon,
    DocumentChartBarIcon,
    DocumentIcon,
    DocumentTextIcon,
    FilmIcon,
    MusicalNoteIcon,
    PhotoIcon,
} from '@heroicons/react/24/solid';

export const getFromLocalStorage = (key) => {
    return localStorage.getItem(key);
};

export const setToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

export const validateSchemaUtil = (schema, data) => {
    return schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
    });
};

export const getFileIcon = (fileName) => {
    // Extraer la extensión del nombre del archivo
    const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';

    switch (extension) {
        // Imágenes
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'svg':
        case 'webp':
        case 'tiff':
            return React.createElement(PhotoIcon, {
                className: 'h-6 w-6 text-green-500 mr-3 flex-shrink-0',
            });

        // Videos
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'flv':
        case 'mkv':
        case 'webm':
        case 'mpeg':
        case 'mpg':
        case '3gp':
            return React.createElement(FilmIcon, {
                className: 'h-6 w-6 text-purple-500 mr-3 flex-shrink-0',
            });

        // Audio
        case 'mp3':
        case 'wav':
        case 'ogg':
        case 'flac':
        case 'm4a':
        case 'aac':
        case 'wma':
        case 'opus':
            return React.createElement(MusicalNoteIcon, {
                className: 'h-6 w-6 text-pink-500 mr-3 flex-shrink-0',
            });

        // Código
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'html':
        case 'css':
        case 'php':
        case 'py':
        case 'java':
        case 'c':
        case 'cpp':
        case 'rb':
        case 'go':
        case 'swift':
        case 'json':
        case 'xml':
            return React.createElement(CodeBracketIcon, {
                className: 'h-6 w-6 text-yellow-500 mr-3 flex-shrink-0',
            });

        // Documentos de texto
        case 'txt':
        case 'doc':
        case 'docx':
        case 'rtf':
        case 'odt':
        case 'md':
        case 'markdown':
            return React.createElement(DocumentTextIcon, {
                className: 'h-6 w-6 text-blue-500 mr-3 flex-shrink-0',
            });

        // Hojas de cálculo
        case 'xls':
        case 'xlsx':
        case 'csv':
        case 'ods':
        case 'numbers':
            return React.createElement(DocumentChartBarIcon, {
                className: 'h-6 w-6 text-green-600 mr-3 flex-shrink-0',
            });

        // PDF
        case 'pdf':
            return React.createElement(DocumentIcon, {
                className: 'h-6 w-6 text-red-500 mr-3 flex-shrink-0',
            });

        // Archivos comprimidos
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
        case 'bz2':
        case 'xz':
            return React.createElement(ArchiveBoxIcon, {
                className: 'h-6 w-6 text-amber-600 mr-3 flex-shrink-0',
            });

        // Por defecto para otros tipos
        default:
            return React.createElement(DocumentIcon, {
                className: 'h-6 w-6 text-gray-500 mr-3 flex-shrink-0',
            });
    }
};
