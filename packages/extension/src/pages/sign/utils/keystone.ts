import { serialize } from "@ethersproject/transactions";
import { EthSignType } from "@keplr-wallet/types";
import { KeystoneEthereumSDK } from "@keystonehq/keystone-sdk";

export interface KeystoneUR {
  type: string;
  cbor: string;
}

export interface KeystoneKeys {
  [path: string]: {
    chain: string;
    name: string;
    pubKey: string;
  };
}

export function getPathFromPubKey(
  keys: KeystoneKeys,
  pubKey: string
): string | null {
  for (const path in keys) {
    if (Object.prototype.hasOwnProperty.call(keys, path)) {
      const key = keys[path];
      if (key.pubKey === pubKey) {
        return path;
      }
    }
  }
  return null;
}

export function getEthDataTypeFromSignType(signType: EthSignType) {
  switch (signType) {
    case EthSignType.TRANSACTION:
      return KeystoneEthereumSDK.DataType.transaction;
    case EthSignType.MESSAGE:
      return KeystoneEthereumSDK.DataType.personalMessage;
    case EthSignType.EIP712:
      return KeystoneEthereumSDK.DataType.typedData;
  }
}

export function encodeEthMessage(
  message: Uint8Array,
  signType: EthSignType
): Buffer {
  switch (signType) {
    case EthSignType.TRANSACTION:
      const tx = JSON.parse(Buffer.from(message).toString());
      if (typeof tx.type === "string") {
        tx.type = +tx.type.replace(/^0x/, "");
      }
      return Buffer.from(serialize(tx).replace(/^0x/, ""), "hex");
    case EthSignType.MESSAGE:
    case EthSignType.EIP712:
      return Buffer.from(message);
  }
}
