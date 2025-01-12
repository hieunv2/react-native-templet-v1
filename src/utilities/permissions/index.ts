/* eslint-disable consistent-return */
import i18next from 'i18next';
import { Alert } from 'react-native';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';
import { isIos, logger } from '../helper';

export const checkCamera = async () => {
    try {
        const checkPermission = await check(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
        if (checkPermission === RESULTS.BLOCKED) {
            showRequestPermission('camera');
            return false;
        }
        if (checkPermission === RESULTS.DENIED) {
            const result = await request(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
            return result === RESULTS.GRANTED;
        }
        return true;
    } catch (err) {
        logger(err);
        return false;
    }
};
export const checkPhoto = async () => {
    try {
        const checkPermission = await check(
            isIos ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (checkPermission === RESULTS.BLOCKED) {
            showRequestPermission('photo');
            return false;
        }
        if (checkPermission === RESULTS.DENIED) {
            const result = await request(
                isIos ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            );
            return result === RESULTS.GRANTED;
        }
        return true;
    } catch (err) {
        logger(err);
        return false;
    }
};

export const checkAudio = async () => {
    try {
        const checkPermission = await check(isIos ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (checkPermission === RESULTS.BLOCKED) {
            showRequestPermission('audio');
            return false;
        }
        if (checkPermission === RESULTS.DENIED) {
            const result = await request(isIos ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO);
            return result === RESULTS.GRANTED;
        }
        return true;
    } catch (err) {
        logger(err);
        return false;
    }
};

const messages: any = {
    camera: i18next.t('permissions.camera'),
    photo: i18next.t('permissions.photo'),
    audio: i18next.t('permissions.audio'),
};

const showRequestPermission = (type: string) => {
    Alert.alert(
        'Demo App',
        messages[type],
        [
            {
                text: i18next.t('alert.button.no'),
                onPress: () => logger('Cancel Pressed'),
                style: 'default',
            },
            {
                text: i18next.t('alert.button.yes'),
                onPress: () => openSettings().catch(() => logger('cannot open settings', true)),
            },
        ],
        { cancelable: false },
    );
};
