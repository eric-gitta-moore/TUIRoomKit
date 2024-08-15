/*
 * @Description: Basic information configuration for TUIRoomKit applications
 */

import LibGenerateTestUserSig from './lib-generate-test-usersig-es.min';

const param = Object.fromEntries(new URL(location.href).searchParams.entries())
const storage = {
  SDKAPPID: Number(param['SDKAPPID'] || localStorage.getItem('SDKAPPID')),
  SDKSECRETKEY: param['SDKSECRETKEY'] || localStorage.getItem('SDKSECRETKEY'),
}

function login(SDKAPPID, SDKSECRETKEY) {
  if (SDKAPPID && SDKSECRETKEY) {
    storage.SDKAPPID = Number(SDKAPPID)
    storage.SDKSECRETKEY = SDKSECRETKEY
    localStorage.setItem('SDKAPPID', storage.SDKAPPID)
    localStorage.setItem('SDKSECRETKEY', storage.SDKSECRETKEY)
  }
}
window.login = login
if (!storage.SDKAPPID || !storage.SDKSECRETKEY) {
  // const SDKAPPID = prompt('SDKAPPID')
  // const SDKSECRETKEY = prompt('SDKSECRETKEY')
  console.warn(`还没有输入 id 和 key，输入 login 登录。例如 login('username', 'password')`)
}

/**
 * Tencent Cloud SDKAppId, which should be replaced with user's SDKAppId.
 * Enter Tencent Cloud TRTC [Console] (https://console.cloud.tencent.com/trtc ) to create an application,
 * and you will see the SDKAppId.
 * It is a unique identifier used by Tencent Cloud to identify users.
 *
 */

export const SDKAPPID = storage['SDKAPPID'] || 0;

/**
 * Encryption key for calculating signature, which can be obtained in the following steps:
 *
 * Step1. Enter Tencent Cloud TRTC [Console](https://console.cloud.tencent.com/rav ),
 * and create an application if you don't have one.
 * Step2. Click your application to find "Quick Start".
 * Step3. Click "View Secret Key" to see the encryption key for calculating UserSig,
 * and copy it to the following variable.
 *
 * Notes: this method is only applicable for debugging Demo. Before official launch,
 * please migrate the UserSig calculation code and key to your backend server to avoid
 * unauthorized traffic use caused by the leakage of encryption key.
 * Document: https://intl.cloud.tencent.com/document/product/647/35166#Server
 *
 */
export const SDKSECRETKEY = storage['SDKSECRETKEY'] || '';

/**
 * Signature expiration time, which should not be too short
 * Time unit: second
 * Default time: 7 * 24 * 60 * 60 = 604800 = 7days
 *
 */
export const EXPIRETIME = 604800;

/**
 * Set user information on the push side
 *
 */
export const userInfo = {
  // UserId
  userId: `user_${Math.ceil(Math.random() * 100000)}`,
  // UserName
  userName: 'myName',
  // UserAvatar
  avatarUrl: '',
};

export function getBasicInfo() {
  if (SDKAPPID === Number(0) || SDKSECRETKEY === String('')) {
    console.warn('Please configure your SDKAPPID in config/basic-info-config.js');
    return;
  }
  console.log("SDKAPPID, SDKSECRETKEY, EXPIRETIME", SDKAPPID, SDKSECRETKEY, EXPIRETIME)
  const generator = new LibGenerateTestUserSig(SDKAPPID, SDKSECRETKEY, EXPIRETIME);
  const userSig = generator.genTestUserSig(userInfo.userId);
  const { userId, userName, avatarUrl } = userInfo;
  return {
    sdkAppId: SDKAPPID,
    userId,
    userSig,
    userName,
    avatarUrl,
  };
};
